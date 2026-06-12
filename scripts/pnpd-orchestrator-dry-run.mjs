#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import process from "node:process";

const STATES = new Set([
  "DISCOVERED",
  "NEEDS_TRIAGE",
  "NEEDS_INFO",
  "READY_FOR_AGENT",
  "DISPATCHED",
  "IN_PROGRESS",
  "AGENT_DONE",
  "AUTOREVIEW_REQUIRED",
  "CODEX_REVIEW_REQUIRED",
  "OWNER_REVIEW_REQUIRED",
  "APPROVED_FOR_MERGE",
  "DONE",
  "BLOCKED",
  "WONTFIX"
]);

const SECRET_KEY_PATTERN = /(token|secret|password|private[_-]?key|api[_-]?key|authorization|auth[_-]?header)/i;
const SECRET_VALUE_PATTERN = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

const FORBIDDEN_LEDGER_PATH = ["/Users/lanretech/Documents", "BricLab Kids"].join("/");
const LEDGER_DEFAULT_DIR = ".pnpd/ledger";
const HANDOFF_DEFAULT_DIR = ".pnpd/handoffs";
const LOCK_DEFAULT_DIR = ".pnpd/locks";
const GENERATOR_VERSION = "1.0.0";

function parseArgs(argv) {
  const args = {
    registry: ".pnpd/repos.example.json",
    json: false,
    writeLedger: false,
    writeHandoff: false,
    noWrite: false,
    ledgerDir: null,
    handoffDir: null,
    useLock: false,
    lockDir: null
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--write-ledger") {
      args.writeLedger = true;
    } else if (arg === "--no-write") {
      args.noWrite = true;
    } else if (arg === "--write-handoff") {
      args.writeHandoff = true;
    } else if (arg === "--use-lock") {
      args.useLock = true;
    } else if (arg === "--lock-dir") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--lock-dir requires a path value.");
      }
      args.lockDir = argv[i + 1];
      i += 1;
    } else if (arg === "--handoff-dir") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--handoff-dir requires a path value.");
      }
      args.handoffDir = argv[i + 1];
      i += 1;
    } else if (arg === "--ledger-dir") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--ledger-dir requires a path value.");
      }
      args.ledgerDir = argv[i + 1];
      i += 1;
    } else if (arg === "--registry") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--registry requires a path value.");
      }
      args.registry = argv[i + 1];
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`PNPD Orchestrator dry run

Usage:
  node scripts/pnpd-orchestrator-dry-run.mjs [--registry .pnpd/repos.example.json] [--json]

Phase 0 constraints:
  - reads local registry only
  - runs local git read commands only
  - writes no files unless --write-ledger or --write-handoff is explicitly provided
  - creates no agent threads
  - performs no merge, deploy, push, or GitHub mutation\n\nWrite flags (opt-in, off by default):\n  --write-ledger         Append one JSONL ledger record per repo.\n  --write-handoff        Create one local handoff JSON file per repo.\n  --no-write             Override all write flags; perform zero writes.\n  --ledger-dir <path>    Custom ledger directory under .pnpd/ledger.\n  --use-lock            Acquire a lockfile before writes; release on exit.
  --lock-dir <path>      Custom lock directory under .pnpd/locks.
  --handoff-dir <path>   Custom handoff directory under .pnpd/handoffs.`);
}

function readRegistry(registryPath) {
  const absolutePath = path.resolve(process.cwd(), registryPath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const data = JSON.parse(raw);
  validateRegistry(data, absolutePath);
  return { data, absolutePath };
}

function validateRegistry(data, registryPath) {
  if (!data || typeof data !== "object") {
    throw new Error(`Registry must be a JSON object: ${registryPath}`);
  }
  if (data.version !== 1) {
    throw new Error("Registry version must be 1.");
  }
  if (!data.orchestrator || data.orchestrator.mode !== "dry-run") {
    throw new Error("Phase 0 orchestrator mode must be dry-run.");
  }
  if (data.orchestrator.dispatchEnabled !== false) {
    throw new Error("Phase 0 dispatchEnabled must be false.");
  }
  if (data.orchestrator.maxParallelThreads !== 0) {
    throw new Error("Phase 0 maxParallelThreads must be 0.");
  }
  if (!Array.isArray(data.repos)) {
    throw new Error("Registry repos must be an array.");
  }
  for (const repo of data.repos) {
    if (!repo.id || !repo.name || !repo.path) {
      throw new Error("Every repo must include id, name, and path.");
    }
    for (const item of repo.pendingItems || []) {
      if (item.state && !STATES.has(item.state)) {
        throw new Error(`Invalid state for ${repo.id}/${item.id}: ${item.state}`);
      }
      if (item.state === "APPROVED_FOR_MERGE") {
        throw new Error(`Phase 0 registry cannot pre-classify ${repo.id}/${item.id} as APPROVED_FOR_MERGE.`);
      }
    }
  }
}

function findSecretLikeFields(value, currentPath = "$", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findSecretLikeFields(item, `${currentPath}[${index}]`, findings));
    return findings;
  }

  if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      const nestedPath = `${currentPath}.${key}`;
      if (SECRET_KEY_PATTERN.test(key)) {
        findings.push(nestedPath);
      }
      findSecretLikeFields(nestedValue, nestedPath, findings);
    }
    return findings;
  }

  if (typeof value === "string" && SECRET_VALUE_PATTERN.test(value)) {
    findings.push(currentPath);
  }

  return findings;
}

function runGit(repoPath, args) {
  try {
    return {
      ok: true,
      stdout: execFileSync("git", ["-C", repoPath, ...args], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      }).trim()
    };
  } catch (error) {
    return {
      ok: false,
      stdout: "",
      error: error.stderr?.toString().trim() || error.message
    };
  }
}

function inspectRepo(repo, registryRoot, orchestrator) {
  const repoPath = path.resolve(registryRoot, repo.path);
  const gates = [];
  const pendingItems = Array.isArray(repo.pendingItems) ? repo.pendingItems : [];
  const protectedBranches = repo.protectedBranches || orchestrator.defaultProtectedBranches || ["main", "master"];

  const result = {
    id: repo.id,
    name: repo.name,
    path: repoPath,
    enabled: repo.enabled !== false,
    branch: null,
    dirty: null,
    classification: "DISCOVERED",
    dispatchAllowed: false,
    gates,
    nextAction: "No action selected.",
    handoffPreview: null
  };

  const secretFindings = findSecretLikeFields(repo);
  if (secretFindings.length > 0) {
    gates.push({
      name: "secrets",
      status: "blocked",
      reason: `Registry contains secret-like field(s): ${secretFindings.join(", ")}`
    });
    result.classification = "BLOCKED";
    result.nextAction = "Remove secret-like registry fields before orchestration.";
    result.handoffPreview = buildHandoff(repo, result, pendingItems);
    return result;
  }

  gates.push({ name: "secrets", status: "pass", reason: "No secret-like registry fields detected." });

  if (!result.enabled) {
    gates.push({ name: "enabled", status: "not-run", reason: "Repo is disabled in registry." });
    result.classification = "DONE";
    result.nextAction = "Enable this repo in the registry when it is ready for orchestration.";
    result.handoffPreview = buildHandoff(repo, result, pendingItems);
    return result;
  }

  if (!fs.existsSync(repoPath)) {
    gates.push({ name: "path", status: "blocked", reason: "Repo path does not exist." });
    result.classification = "BLOCKED";
    result.nextAction = "Fix the registry path or disable the repo.";
    result.handoffPreview = buildHandoff(repo, result, pendingItems);
    return result;
  }
  gates.push({ name: "path", status: "pass", reason: "Repo path exists." });

  const insideWorkTree = runGit(repoPath, ["rev-parse", "--is-inside-work-tree"]);
  if (!insideWorkTree.ok || insideWorkTree.stdout !== "true") {
    gates.push({ name: "git", status: "blocked", reason: "Path is not a Git worktree." });
    result.classification = "BLOCKED";
    result.nextAction = "Register only Git worktrees or disable this repo.";
    result.handoffPreview = buildHandoff(repo, result, pendingItems);
    return result;
  }
  gates.push({ name: "git", status: "pass", reason: "Path is a Git worktree." });

  const branch = runGit(repoPath, ["branch", "--show-current"]);
  result.branch = branch.ok ? branch.stdout || "(detached)" : null;
  gates.push({
    name: "branch",
    status: branch.ok ? "pass" : "blocked",
    reason: branch.ok ? `Current branch: ${result.branch}` : "Could not read current branch."
  });

  const status = runGit(repoPath, ["status", "--porcelain"]);
  if (!status.ok) {
    gates.push({ name: "dirty-tree", status: "blocked", reason: "Could not read git status." });
    result.classification = "BLOCKED";
    result.nextAction = "Resolve Git status read failure before orchestration.";
    result.handoffPreview = buildHandoff(repo, result, pendingItems);
    return result;
  }

  result.dirty = status.stdout.length > 0;
  gates.push({
    name: "dirty-tree",
    status: result.dirty ? "fail" : "pass",
    reason: result.dirty ? "Uncommitted changes are present." : "Working tree is clean."
  });

  const onProtectedBranch = protectedBranches.includes(result.branch);
  gates.push({
    name: "protected-branch",
    status: onProtectedBranch ? "blocked" : "pass",
    reason: onProtectedBranch
      ? `Current branch ${result.branch} is protected for orchestration dispatch.`
      : "Current branch is not protected."
  });

  gates.push({ name: "external-writes", status: "pass", reason: "No external writes are implemented in Phase 0." });
  gates.push({ name: "budget-rate-limit", status: "not-run", reason: "No external actions are implemented in Phase 0." });
  gates.push({ name: "max-parallel-threads", status: "pass", reason: "Maximum parallel dispatch is fixed at 0 in Phase 0." });
  gates.push({ name: "lockfile", status: "not-run", reason: "Phase 0 does not create or consume lockfiles." });
  gates.push({ name: "dispatch", status: "blocked", reason: "Dispatch is disabled in Phase 0 dry-run mode." });

  result.classification = classifyRepo({ pendingItems, dirty: result.dirty, onProtectedBranch });
  result.nextAction = chooseNextAction(result.classification, pendingItems);
  result.handoffPreview = buildHandoff(repo, result, pendingItems);
  return result;
}

function classifyRepo({ pendingItems, dirty, onProtectedBranch }) {
  if (dirty) {
    return "NEEDS_TRIAGE";
  }
  if (pendingItems.some((item) => item.state === "BLOCKED")) {
    return "BLOCKED";
  }
  if (pendingItems.some((item) => item.requiresCodexReview || item.state === "CODEX_REVIEW_REQUIRED")) {
    return "CODEX_REVIEW_REQUIRED";
  }
  if (pendingItems.some((item) => item.requiresOwnerApproval || item.state === "OWNER_REVIEW_REQUIRED")) {
    return "OWNER_REVIEW_REQUIRED";
  }
  if (pendingItems.some((item) => item.state === "AUTOREVIEW_REQUIRED")) {
    return "AUTOREVIEW_REQUIRED";
  }
  if (pendingItems.some((item) => item.state === "AGENT_DONE")) {
    return "AGENT_DONE";
  }
  if (pendingItems.some((item) => item.state === "DISPATCHED" || item.state === "IN_PROGRESS")) {
    return "IN_PROGRESS";
  }
  if (pendingItems.some((item) => item.state === "NEEDS_INFO")) {
    return "NEEDS_INFO";
  }
  if (onProtectedBranch && pendingItems.length > 0) {
    return "OWNER_REVIEW_REQUIRED";
  }
  if (pendingItems.some((item) => item.state === "READY_FOR_AGENT" || item.state === "DISCOVERED" || !item.state)) {
    return "READY_FOR_AGENT";
  }
  return "DONE";
}

function chooseNextAction(classification, pendingItems) {
  switch (classification) {
    case "NEEDS_TRIAGE":
      return "Hermes verifies repo state, dirty tree, and task scope.";
    case "CODEX_REVIEW_REQUIRED":
      return "Codex performs formal review with full evidence before owner decision.";
    case "OWNER_REVIEW_REQUIRED":
      return "Owner reviews the evidence and decides whether to approve, patch, or reject.";
    case "AUTOREVIEW_REQUIRED":
      return "Run the configured self-review gate, then route results to Hermes.";
    case "AGENT_DONE":
      return "Hermes verifies the agent report, evidence, branch, and dirty tree.";
    case "IN_PROGRESS":
      return "Monitor existing work state; do not dispatch another agent.";
    case "NEEDS_INFO":
      return "Request missing evidence before routing.";
    case "READY_FOR_AGENT":
      return "Prepare a dry-run handoff; do not dispatch until a future approved phase.";
    case "BLOCKED":
      return "Record blocker and stop advancement.";
    case "DONE":
      return "No action required in Phase 0 dry-run.";
    default:
      if (pendingItems[0]?.nextAction) {
        return pendingItems[0].nextAction;
      }
      return "Review classification and select one next action.";
  }
}

function buildHandoff(repo, result, pendingItems) {
  const firstItem = pendingItems[0] || null;
  return {
    from: "pnpd-orchestrator",
    to: result.classification === "CODEX_REVIEW_REQUIRED" ? "codex" : "hermes",
    repo_id: repo.id,
    task_id: firstItem?.id || null,
    status: result.classification,
    authority: "coordination/recommendation only",
    dispatch_allowed: false,
    evidence: {
      repo_path: result.path,
      branch: result.branch,
      dirty_tree: result.dirty,
      gates: result.gates.map((gate) => `${gate.name}:${gate.status}`)
    },
    next_action: result.nextAction
  };
}

function renderText(summary) {
  console.log("PNPD Orchestrator Dry Run");
  console.log(`Mode: ${summary.mode}`);
  console.log(`Registry: ${summary.registryPath}`);
  console.log(`Dispatch enabled: ${summary.dispatchEnabled}`);
  console.log(`Generated at: ${summary.generatedAt}`);
  console.log("");

  for (const repo of summary.repos) {
    console.log(`Repo: ${repo.name} (${repo.id})`);
    console.log(`  Path: ${repo.path}`);
    console.log(`  Enabled: ${repo.enabled}`);
    console.log(`  Branch: ${repo.branch ?? "not-read"}`);
    console.log(`  Dirty: ${repo.dirty ?? "not-read"}`);
    console.log(`  Classification: ${repo.classification}`);
    console.log(`  Dispatch allowed: ${repo.dispatchAllowed}`);
    console.log("  Gates:");
    for (const gate of repo.gates) {
      console.log(`    - ${gate.name}: ${gate.status} - ${gate.reason}`);
    }
    console.log(`  Next action: ${repo.nextAction}`);
    console.log("  Handoff preview:");
    console.log(`    to: ${repo.handoffPreview.to}`);
    console.log(`    status: ${repo.handoffPreview.status}`);
    console.log(`    next_action: ${repo.handoffPreview.next_action}`);
    console.log("");
  }
}

// ── Ledger writer helpers ────────────────────────────────────────────────────────

function stableCanonicalize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableCanonicalize).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map(function(key) { return JSON.stringify(key) + ":" + stableCanonicalize(value[key]); }).join(",") + "}";
}

function computeContentHash(record) {
  const payload = {};
  for (const key of Object.keys(record).sort()) {
    if (key !== "integrity") payload[key] = record[key];
  }
  const canonical = stableCanonicalize(payload);
  const hash = crypto.createHash("sha256").update(canonical).digest("hex");
  return "sha256:" + hash;
}

function generateRunId() {
  const now = new Date();
  const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19) + "Z";
  const rand = Math.random().toString(36).slice(2, 6);
  return "pnpd-orchestrator-" + ts + "-" + rand;
}


function validateLockDirPath(requestedDir, repoRoot) {
  const lockBase = path.resolve(repoRoot, LOCK_DEFAULT_DIR);
  
  if (!requestedDir) return { valid: true, resolved: lockBase };
  
  if (path.isAbsolute(requestedDir)) {
    return { valid: false, reason: "lock-dir must be a relative path" };
  }
  
  if (requestedDir.includes("..")) {
    return { valid: false, reason: "lock-dir must not contain .." };
  }
  
  const resolved = path.resolve(repoRoot, requestedDir);
  
  const rel = path.relative(lockBase, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return { valid: false, reason: "lock-dir must be inside " + LOCK_DEFAULT_DIR };
  }
  
  if (fs.existsSync(resolved)) {
    try {
      const real = fs.realpathSync(resolved);
      const realRel = path.relative(lockBase, real);
      if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
        return { valid: false, reason: "lock-dir resolves outside " + LOCK_DEFAULT_DIR + " via symlink" };
      }
    } catch (e) {
      return { valid: false, reason: "lock-dir realpath check failed: " + e.message };
    }
  }
  
  return { valid: true, resolved };
}

function validateHandoffDirPath(requestedDir, repoRoot) {
  const handoffBase = path.resolve(repoRoot, HANDOFF_DEFAULT_DIR);

  if (!requestedDir) return { valid: true, resolved: handoffBase };

  // Must be relative
  if (path.isAbsolute(requestedDir)) {
    return { valid: false, reason: "handoff-dir must be a relative path" };
  }

  // Must not contain ..
  if (requestedDir.includes("..")) {
    return { valid: false, reason: "handoff-dir must not contain .." };
  }

  const resolved = path.resolve(repoRoot, requestedDir);

  // Must be inside handoffBase
  const rel = path.relative(handoffBase, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return { valid: false, reason: "handoff-dir must be inside " + HANDOFF_DEFAULT_DIR };
  }

  // Symlink check: if path exists, realpath it and re-check
  if (fs.existsSync(resolved)) {
    try {
      const real = fs.realpathSync(resolved);
      const realRel = path.relative(handoffBase, real);
      if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
        return { valid: false, reason: "handoff-dir resolves outside " + HANDOFF_DEFAULT_DIR + " via symlink" };
      }
    } catch (e) {
      return { valid: false, reason: "handoff-dir realpath check failed: " + e.message };
    }
  }

  return { valid: true, resolved };
}

function validateLedgerDirPath(requestedDir, repoRoot) {
  const ledgerBase = path.resolve(repoRoot, LEDGER_DEFAULT_DIR);

  if (!requestedDir) return { valid: true, resolved: ledgerBase };

  // Must be relative
  if (path.isAbsolute(requestedDir)) {
    return { valid: false, reason: "ledger-dir must be a relative path" };
  }

  // Must not contain ..
  if (requestedDir.includes("..")) {
    return { valid: false, reason: "ledger-dir must not contain .." };
  }

  const resolved = path.resolve(repoRoot, requestedDir);

  // Must be inside ledgerBase
  const rel = path.relative(ledgerBase, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return { valid: false, reason: "ledger-dir must be inside " + LEDGER_DEFAULT_DIR };
  }

  // Symlink check: if path exists, realpath it and re-check
  if (fs.existsSync(resolved)) {
    try {
      const real = fs.realpathSync(resolved);
      const realRel = path.relative(ledgerBase, real);
      if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
        return { valid: false, reason: "ledger-dir resolves outside " + LEDGER_DEFAULT_DIR + " via symlink" };
      }
    } catch (e) {
      return { valid: false, reason: "ledger-dir realpath check failed: " + e.message };
    }
  }

  return { valid: true, resolved };
}

function scanRecordContent(record) {
  const serialized = JSON.stringify(record);

  // Secret value scan
  if (SECRET_VALUE_PATTERN.test(serialized)) {
    return { safe: false, reason: "secret-like value detected in ledger record" };
  }

  // Forbidden path scan
  if (serialized.includes(FORBIDDEN_LEDGER_PATH)) {
    return { safe: false, reason: "forbidden path detected in ledger record" };
  }

  // .env scan
  if (serialized.includes(".env")) {
    // Check for .env as a path component (not just as substring in prohibition text)
    if (serialized.includes("\".env\"") || serialized.includes("/.env")) {
      return { safe: false, reason: ".env path detected in ledger record" };
    }
  }

  return { safe: true };
}


function validateHandoffRecordStruct(record) {
  if (record.recordType !== "handoff") return "recordType must be handoff";
  if (record.schemaVersion !== 1) return "schemaVersion must be 1";
  if (record.source !== "pnpd-orchestrator-dry-run") return "source must be pnpd-orchestrator-dry-run";
  if (!record.runId || typeof record.runId !== "string") return "runId must be non-empty string";
  if (!record.createdAt || typeof record.createdAt !== "string") return "createdAt must be non-empty string";
  if (!record.repo || typeof record.repo !== "object") return "repo must be an object";
  if (!record.git || typeof record.git !== "object") return "git must be an object";
  if (!record.classification || typeof record.classification !== "string") return "classification must be non-empty string";
  if (!Array.isArray(record.gates)) return "gates must be an array";
  if (!Array.isArray(record.blockedReasons)) return "blockedReasons must be an array";

  const af = record.authorityFlags;
  if (!af || typeof af !== "object") return "authorityFlags must be an object";
  if (af.approvalClaimed !== false) return "approvalClaimed must be false";
  if (af.mergeClaimed !== false) return "mergeClaimed must be false";
  if (af.dispatchRequested !== false) return "dispatchRequested must be false";
  if (af.auditClaimed !== false) return "auditClaimed must be false";
  if (af.productionReadinessClaimed !== false) return "productionReadinessClaimed must be false";

  if (!record.redactions || typeof record.redactions !== "object") return "redactions must be an object";

  const h = record.handoff;
  if (!h || typeof h !== "object") return "handoff block must exist";
  if (h.format !== "pnpd-handoff-v1") return "handoff.format must be pnpd-handoff-v1";

  const routing = h.routing;
  if (!routing || typeof routing !== "object") return "handoff.routing must exist";
  const allowedRouting = ["owner", "hermes", "deepseek", "codex", "none"];
  if (!allowedRouting.includes(routing.to)) return "handoff.routing.to must be one of " + allowedRouting.join(", ");
  if (routing.to === "dispatch") return "handoff.routing.to must not be dispatch";

  if (!record.integrity || typeof record.integrity !== "object") return "integrity must be an object";
  if (!record.integrity.contentHash) return "integrity.contentHash must be set";

  return null;
}

function validateLedgerRecordStruct(record) {
  if (record.recordType !== "ledger") return "recordType must be ledger";
  if (record.schemaVersion !== 1) return "schemaVersion must be 1";
  if (record.source !== "pnpd-orchestrator-dry-run") return "source must be pnpd-orchestrator-dry-run";
  if (!record.runId || typeof record.runId !== "string") return "runId must be non-empty string";
  if (!record.createdAt || typeof record.createdAt !== "string") return "createdAt must be non-empty string";
  if (!record.repo || typeof record.repo !== "object") return "repo must be an object";
  if (!record.git || typeof record.git !== "object") return "git must be an object";
  if (!record.classification || typeof record.classification !== "string") return "classification must be non-empty string";
  if (!Array.isArray(record.gates)) return "gates must be an array";
  if (!Array.isArray(record.blockedReasons)) return "blockedReasons must be an array";

  const af = record.authorityFlags;
  if (!af || typeof af !== "object") return "authorityFlags must be an object";
  if (af.approvalClaimed !== false) return "approvalClaimed must be false";
  if (af.mergeClaimed !== false) return "mergeClaimed must be false";
  if (af.dispatchRequested !== false) return "dispatchRequested must be false";
  if (af.auditClaimed !== false) return "auditClaimed must be false";
  if (af.productionReadinessClaimed !== false) return "productionReadinessClaimed must be false";

  if (!record.redactions || typeof record.redactions !== "object") return "redactions must be an object";
  if (!record.integrity || typeof record.integrity !== "object") return "integrity must be an object";
  if (!record.integrity.contentHash) return "integrity.contentHash must be set";

  return null;
}

function getPreviousLedgerHash(ledgerFile) {
  if (!fs.existsSync(ledgerFile)) return null;
  const raw = fs.readFileSync(ledgerFile, "utf8").trim();
  if (!raw) return null;

  const lines = raw.split("\n").filter(Boolean);
  if (lines.length === 0) return null;

  try {
    const lastRecord = JSON.parse(lines[lines.length - 1]);
    return lastRecord.integrity?.contentHash ?? null;
  } catch (e) {
    return null;
  }
}

function buildLedgerRecord(repoResult, runId, previousHash) {
  const createdAt = new Date().toISOString();

  const record = {
    recordType: "ledger",
    schemaVersion: 1,
    runId: runId,
    createdAt: createdAt,
    source: "pnpd-orchestrator-dry-run",
    generatorVersion: GENERATOR_VERSION,
    repo: {
      id: repoResult.id,
      name: repoResult.name,
      path: repoResult.path
    },
    git: {
      branch: repoResult.branch ?? "not-read",
      commit: repoResult.commit ?? "not-read",
      dirty: repoResult.dirty ?? null,
      detachedHead: false
    },
    classification: repoResult.classification,
    gates: repoResult.gates || [],
    blockedReasons: repoResult.blockedReasons || [],
    recommendedAction: repoResult.nextAction || "",
    requiredReviewer: repoResult.requiredReviewer || "none",
    codexAuditRequired: repoResult.codexAuditRequired || false,
    ownerActionRequired: repoResult.ownerActionRequired || false,
    riskAssessment: repoResult.riskAssessment || { level: "unknown", factors: [] },
    authorityFlags: {
      approvalClaimed: false,
      mergeClaimed: false,
      dispatchRequested: false,
      auditClaimed: false,
      productionReadinessClaimed: false
    },
    redactions: { count: 0, paths: [] },
    integrity: {
      contentHash: "",
      previousLedgerHash: previousHash,
      canonicalization: "json-canonical"
    }
  };

  // Compute content hash
  record.integrity.contentHash = computeContentHash(record);

  return record;
}


function buildHandoffRecord(repoResult, runId) {
  const createdAt = new Date().toISOString();

  const record = {
    recordType: "handoff",
    schemaVersion: 1,
    runId: runId,
    createdAt: createdAt,
    source: "pnpd-orchestrator-dry-run",
    generatorVersion: GENERATOR_VERSION,
    repo: {
      id: repoResult.id,
      name: repoResult.name,
      path: repoResult.path
    },
    git: {
      branch: repoResult.branch ?? "not-read",
      commit: repoResult.commit ?? "not-read",
      dirty: repoResult.dirty ?? null,
      detachedHead: false
    },
    classification: repoResult.classification,
    gates: repoResult.gates || [],
    blockedReasons: repoResult.blockedReasons || [],
    recommendedAction: repoResult.nextAction || "",
    requiredReviewer: repoResult.requiredReviewer || "none",
    codexAuditRequired: repoResult.codexAuditRequired || false,
    ownerActionRequired: repoResult.ownerActionRequired || false,
    riskAssessment: repoResult.riskAssessment || { level: "unknown", factors: [] },
    authorityFlags: {
      approvalClaimed: false,
      mergeClaimed: false,
      dispatchRequested: false,
      auditClaimed: false,
      productionReadinessClaimed: false
    },
    redactions: { count: 0, paths: [] },
    handoff: {
      format: "pnpd-handoff-v1",
      summary: repoResult.nextAction || "No action required.",
      context: "PNPD Orchestrator dry-run handoff for " + repoResult.name + " (" + repoResult.id + ").",
      routing: {
        to: mapClassificationToRouting(repoResult.classification),
        action: repoResult.nextAction || "Review and decide next step.",
        urgency: repoResult.classification === "BLOCKED" ? "high" : "normal"
      }
    },
    integrity: {
      contentHash: "",
      previousLedgerHash: null,
      canonicalization: "json-canonical"
    }
  };

  // Compute content hash
  record.integrity.contentHash = computeContentHash(record);

  return record;
}

function mapClassificationToRouting(classification) {
  switch (classification) {
    case "CODEX_REVIEW_REQUIRED": return "codex";
    case "OWNER_REVIEW_REQUIRED": return "owner";
    case "OWNER_REVIEW_REQUIRED": return "owner";
    case "BLOCKED": return "owner";
    case "NEEDS_TRIAGE": return "hermes";
    case "READY_FOR_AGENT": return "deepseek";
    case "AGENT_DONE": return "hermes";
    case "AUTOREVIEW_REQUIRED": return "deepseek";
    default: return "none";
  }
}

function writeLedgerRecords(summary, args, registryRoot, runId) {
  // Path validation
  const pathCheck = validateLedgerDirPath(args.ledgerDir, registryRoot);
  if (!pathCheck.valid) {
    console.error("pnpd-orchestrator-dry-run: ledger write blocked: " + pathCheck.reason);
    process.exit(1);
  }

  const ledgerDir = pathCheck.resolved;
  const today = new Date().toISOString().slice(0, 10);
  const ledgerFile = path.join(ledgerDir, today + ".jsonl");

  // Ensure ledger directory exists
  if (!fs.existsSync(ledgerDir)) {
    fs.mkdirSync(ledgerDir, { recursive: true });
  }

  let previousHash = getPreviousLedgerHash(ledgerFile);

  let writeCount = 0;

  for (const repoResult of summary.repos) {
    try {
      const record = buildLedgerRecord(repoResult, runId, previousHash);

      // Structural validation
      const structErr = validateLedgerRecordStruct(record);
      if (structErr) {
        console.error("pnpd-orchestrator-dry-run: ledger structural validation failed for " + repoResult.id + ": " + structErr);
        continue;
      }

      // Content safety scan
      const safetyCheck = scanRecordContent(record);
      if (!safetyCheck.safe) {
        console.error("pnpd-orchestrator-dry-run: ledger content safety failed for " + repoResult.id + ": " + safetyCheck.reason);
        continue;
      }

      // Append
      const line = JSON.stringify(record) + "\n";
      fs.appendFileSync(ledgerFile, line, "utf8");
      previousHash = record.integrity.contentHash;
      writeCount++;

    } catch (e) {
      console.error("pnpd-orchestrator-dry-run: ledger write failed for " + repoResult.id + ": " + e.message);
    }
  }

  if (writeCount > 0) {
    process.stderr.write("pnpd-orchestrator-dry-run: wrote " + writeCount + " ledger record(s) to " + ledgerFile + "\n");
  }
}

function writeHandoffRecords(summary, args, registryRoot, runId) {
  // Path validation
  const pathCheck = validateHandoffDirPath(args.handoffDir, registryRoot);
  if (!pathCheck.valid) {
    console.error("pnpd-orchestrator-dry-run: handoff write blocked: " + pathCheck.reason);
    process.exit(1);
  }

  const handoffDir = pathCheck.resolved;

  // Ensure handoff directory exists
  if (!fs.existsSync(handoffDir)) {
    fs.mkdirSync(handoffDir, { recursive: true });
  }


  let writeCount = 0;

  for (const repoResult of summary.repos) {
    try {
      const record = buildHandoffRecord(repoResult, runId);

      // Structural validation
      const structErr = validateHandoffRecordStruct(record);
      if (structErr) {
        console.error("pnpd-orchestrator-dry-run: handoff structural validation failed for " + repoResult.id + ": " + structErr);
        continue;
      }

      // Content safety scan
      const safetyCheck = scanRecordContent(record);
      if (!safetyCheck.safe) {
        console.error("pnpd-orchestrator-dry-run: handoff content safety failed for " + repoResult.id + ": " + safetyCheck.reason);
        continue;
      }

      // Build target path
      const fileName = repoResult.id + "-" + runId + ".json";
      const filePath = path.join(handoffDir, fileName);

      // Create-only: never overwrite existing files
      if (fs.existsSync(filePath)) {
        console.error("pnpd-orchestrator-dry-run: handoff file already exists, skipping: " + filePath);
        continue;
      }

      // Write pretty-printed JSON
      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), { encoding: "utf8", flag: "wx" });
      writeCount++;

    } catch (e) {
      console.error("pnpd-orchestrator-dry-run: handoff write failed for " + repoResult.id + ": " + e.message);
    }
  }

  if (writeCount > 0) {
    process.stderr.write("pnpd-orchestrator-dry-run: wrote " + writeCount + " handoff file(s) to " + handoffDir + "\n");
  }
}

function buildLockRecord(runId, repoRoot, args) {
  return {
    lockVersion: 1,
    runId: runId,
    createdAt: new Date().toISOString(),
    pid: process.pid,
    hostname: os.hostname(),
    repoRoot: repoRoot,
    source: "pnpd-orchestrator-dry-run",
    mode: "dry-run",
    writeLedger: !!args.writeLedger,
    writeHandoff: !!args.writeHandoff
  };
}

function isStaleLock(lockData, thresholdMs) {
  const createdAt = new Date(lockData.createdAt).getTime();
  if (isNaN(createdAt)) return false;
  
  const age = Date.now() - createdAt;
  if (age < thresholdMs) return false;
  
  try {
    process.kill(lockData.pid, 0);
    return false;
  } catch (e) {
    if (e.code === "ESRCH") return true;
    if (e.code === "EPERM") return false;
    return false;
  }
}

function acquireLock(args, repoRoot, runId) {
  const pathCheck = validateLockDirPath(args.lockDir, repoRoot);
  if (!pathCheck.valid) {
    console.error("pnpd-orchestrator-dry-run: lock blocked: " + pathCheck.reason);
    process.exit(1);
  }
  
  const lockDir = pathCheck.resolved;
  const lockPath = path.join(lockDir, "orchestrator.lock");
  
  if (!fs.existsSync(lockDir)) {
    fs.mkdirSync(lockDir, { recursive: true });
  }
  
  if (fs.existsSync(lockPath)) {
    let lockData = null;
    try {
      lockData = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    } catch (e) {
      console.error("pnpd-orchestrator-dry-run: existing lock is unreadable at " + lockPath);
      process.exit(1);
    }
    
    const STALE_THRESHOLD_MS = 5 * 60 * 1000;
    const stale = isStaleLock(lockData, STALE_THRESHOLD_MS);
    
    const meta = "pid=" + lockData.pid +
      " createdAt=" + lockData.createdAt +
      " source=" + (lockData.source || "unknown") +
      " repoRoot=" + (lockData.repoRoot || "unknown");
    
    if (stale) {
      console.error("pnpd-orchestrator-dry-run: stale lock detected at " + lockPath);
      console.error("  " + meta);
      console.error("  The lock appears stale (PID not alive).");
      console.error("  Manual removal: rm " + lockPath);
    } else {
      console.error("pnpd-orchestrator-dry-run: lock exists at " + lockPath);
      console.error("  " + meta);
      console.error("  Lock is still valid (PID alive or unknown).");
    }
    process.exit(1);
  }
  
  const record = buildLockRecord(runId, repoRoot, args);
  fs.writeFileSync(lockPath, JSON.stringify(record, null, 2), { flag: "wx" });
  
  process.stderr.write("pnpd-orchestrator-dry-run: lock acquired at " + lockPath + "\n");
  
  return { lockPath, record };
}

function releaseLock(lockInfo, runId) {
  if (!lockInfo || !lockInfo.lockPath) return false;
  
  const lockPath = lockInfo.lockPath;
  
  if (!fs.existsSync(lockPath)) return false;
  
  let lockData = null;
  try {
    lockData = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  } catch (e) {
    console.error("pnpd-orchestrator-dry-run: cannot release unreadable lock at " + lockPath);
    return false;
  }
  
  if (lockData.runId !== runId) {
    console.error("pnpd-orchestrator-dry-run: lock runId mismatch; refusing to release");
    return false;
  }
  
  if (lockData.source !== "pnpd-orchestrator-dry-run") {
    console.error("pnpd-orchestrator-dry-run: lock source mismatch; refusing to release");
    return false;
  }
  
  if (lockData.pid !== process.pid) {
    console.error("pnpd-orchestrator-dry-run: lock pid mismatch; refusing to release");
    return false;
  }
  
  try {
    fs.unlinkSync(lockPath);
    process.stderr.write("pnpd-orchestrator-dry-run: lock released at " + lockPath + "\n");
    return true;
  } catch (e) {
    console.error("pnpd-orchestrator-dry-run: failed to release lock at " + lockPath + ": " + e.message);
    return false;
  }
}

function main() {
  const args = parseArgs(process.argv);
  let acquiredLock = null;
  const { data, absolutePath } = readRegistry(args.registry);
  const registryRoot = process.cwd();
  const repos = [...data.repos]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((repo) => inspectRepo(repo, registryRoot, data.orchestrator));

  const summary = {
    mode: "dry-run",
    generatedAt: new Date().toISOString(),
    registryPath: absolutePath,
    dispatchEnabled: false,
    repos
  };

  // Shared run ID for ledger + handoff + lock correlation
  const sharedRunId = (args.writeLedger || args.writeHandoff || args.useLock) && !args.noWrite ? generateRunId() : null;

  // Acquire lock (opt-in, off by default)
  if (args.useLock && !args.noWrite) {
    acquiredLock = acquireLock(args, registryRoot, sharedRunId);
  }

  try {
    // Ledger write (opt-in, off by default)
    const doLedgerWrite = args.writeLedger && !args.noWrite;
    if (doLedgerWrite) {
      writeLedgerRecords(summary, args, registryRoot, sharedRunId);
    }

    // Handoff write (opt-in, off by default)
    const doHandoffWrite = args.writeHandoff && !args.noWrite;
    if (doHandoffWrite) {
      writeHandoffRecords(summary, args, registryRoot, sharedRunId);
    }

    if (args.json) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      renderText(summary);
    }
  } finally {
    if (acquiredLock) {
      releaseLock(acquiredLock, sharedRunId);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`pnpd-orchestrator-dry-run: ${error.message}`);
  process.exit(1);
}
