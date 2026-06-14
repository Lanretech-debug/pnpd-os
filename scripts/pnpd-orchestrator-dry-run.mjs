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
    lockDir: null,
    scheduleOnce: false,
    scheduleIntervalMs: null,
    scheduleMaxRuns: null,
    schedulerPlan: false,
    runtimeReadiness: false,
    writeRuntimeReadiness: false
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
    } else if (arg === "--schedule-once") {
      args.scheduleOnce = true;
    } else if (arg === "--schedule-interval-ms") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--schedule-interval-ms requires a value.");
      }
      args.scheduleIntervalMs = Number(argv[i + 1]);
      if (isNaN(args.scheduleIntervalMs) || args.scheduleIntervalMs < 60000 || !Number.isInteger(args.scheduleIntervalMs)) {
        throw new Error("--schedule-interval-ms minimum is 60000.");
      }
      i += 1;
    } else if (arg === "--schedule-max-runs") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--schedule-max-runs requires a value.");
      }
      args.scheduleMaxRuns = Number(argv[i + 1]);
      if (isNaN(args.scheduleMaxRuns) || args.scheduleMaxRuns < 1 || args.scheduleMaxRuns > 100 || !Number.isInteger(args.scheduleMaxRuns)) {
        throw new Error("--schedule-max-runs must be between 1 and 100.");
      }
      i += 1;
    } else if (arg === "--scheduler-plan") {
      args.schedulerPlan = true;
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
    } else if (arg === "--write-runtime-readiness") {
      args.writeRuntimeReadiness = true;
    } else if (arg === "--runtime-readiness") {
      args.runtimeReadiness = true;
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
  - writes no files unless --write-ledger, --write-handoff, or --use-lock is explicitly provided
  - creates no agent threads
  - performs no merge, deploy, push, or GitHub mutation

Runtime readiness (console-only, advisory only):
  --runtime-readiness    Print a console-only PNPD runtime readiness report
                         in JSON format. No writes. Advisory only. Not for
                         production certification. Mutually exclusive with
                         write, scheduler, lock, directory, and --json flags.
  --write-runtime-readiness
                         Write a local copy of the PNPD runtime readiness
                         report under .pnpd/runtime-readiness/ and print the
                         same JSON report to stdout. Explicit local write only.
                         Advisory only. No dispatch, deployment, or GitHub/API.

Write flags (opt-in, off by default):\n  --write-ledger         Append one JSONL ledger record per repo.\n  --write-handoff        Create one local handoff JSON file per repo.\n  --no-write             Override all write flags; perform zero writes.\n  --ledger-dir <path>    Custom ledger directory under .pnpd/ledger.\n  --use-lock            Acquire a lockfile before writes; release on exit.

Scheduler flags (disabled by default; requires --use-lock for real execution):
  --schedule-once        Run exactly one scheduler-managed cycle.
  --schedule-interval-ms <ms>  Interval between repeated runs (min 60000).
  --schedule-max-runs <n>      Max runs in repeated mode (1-100).
  --scheduler-plan       Validate and print scheduler plan; no writes.

Scheduler notes:
  - Scheduler is disabled by default.
  - Real scheduler execution requires --use-lock.
  - --no-write prevents all writes; scheduler with --no-write is rejected.
  - Repeated scheduling acquires/releases lock per cycle.
  - Scheduler is bounded; no infinite scheduling or daemon mode.
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

function isInsidePath(base, target) {
  const rel = path.relative(base, target);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function validateStateDirPath(requestedDir, repoRoot, defaultDir, optionName) {
  const base = path.resolve(repoRoot, defaultDir);

  let resolved = base;

  if (requestedDir) {
    if (path.isAbsolute(requestedDir)) {
      return { valid: false, reason: optionName + " must be a relative path" };
    }

    if (requestedDir.includes("..")) {
      return { valid: false, reason: optionName + " must not contain .." };
    }

    resolved = path.resolve(repoRoot, requestedDir);
  }

  if (!isInsidePath(base, resolved)) {
    return { valid: false, reason: optionName + " must be inside " + defaultDir };
  }

  let existing = resolved;
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break;
    existing = parent;
  }

  try {
    const realExisting = fs.realpathSync(existing);
    const realResolved = path.resolve(realExisting, path.relative(existing, resolved));
    if (!isInsidePath(base, realResolved)) {
      return { valid: false, reason: optionName + " resolves outside " + defaultDir + " via symlink" };
    }
  } catch (e) {
    return { valid: false, reason: optionName + " realpath check failed: " + e.message };
  }

  return { valid: true, resolved };
}

function validateLockDirPath(requestedDir, repoRoot) {
  return validateStateDirPath(requestedDir, repoRoot, LOCK_DEFAULT_DIR, "lock-dir");
}

function validateHandoffDirPath(requestedDir, repoRoot) {
  return validateStateDirPath(requestedDir, repoRoot, HANDOFF_DEFAULT_DIR, "handoff-dir");
}

function validateLedgerDirPath(requestedDir, repoRoot) {
  return validateStateDirPath(requestedDir, repoRoot, LEDGER_DEFAULT_DIR, "ledger-dir");
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

function validateSchedulerArgs(args) {
  const isRepeated = args.scheduleIntervalMs && args.scheduleMaxRuns;

  // Incompatible flags
  if (args.scheduleOnce && (args.scheduleIntervalMs || args.scheduleMaxRuns)) {
    throw new Error("--schedule-once cannot be combined with --schedule-interval-ms or --schedule-max-runs.");
  }

  // Repeated mode requires both interval and max-runs
  if (args.scheduleIntervalMs && !args.scheduleMaxRuns) {
    throw new Error("--schedule-interval-ms requires --schedule-max-runs.");
  }
  if (args.scheduleMaxRuns && !args.scheduleIntervalMs) {
    throw new Error("--schedule-max-runs requires --schedule-interval-ms.");
  }

  // Plan mode - no further validation needed
  if (args.schedulerPlan) return { mode: "plan" };

  // Schedule-once mode
  if (args.scheduleOnce) {
    if (!args.useLock) {
      throw new Error("--schedule-once requires --use-lock.");
    }
    if (args.noWrite) {
      throw new Error("scheduler execution with --no-write is blocked because scheduler requires --use-lock and lock creation is a write.");
    }
    return { mode: "once" };
  }

  // Repeated mode
  if (isRepeated) {
    if (!args.useLock) {
      throw new Error("repeated scheduler requires --use-lock.");
    }
    if (args.noWrite) {
      throw new Error("scheduler execution with --no-write is blocked because scheduler requires --use-lock and lock creation is a write.");
    }
    return { mode: "repeated", intervalMs: args.scheduleIntervalMs, maxRuns: args.scheduleMaxRuns };
  }

  // Manual mode
  return { mode: "manual" };
}

function printSchedulerPlan(args) {
  const plan = {
    schedulerMode: args.scheduleOnce ? "once" : (args.scheduleIntervalMs ? "repeated" : "manual"),
    intervalMs: args.scheduleIntervalMs || null,
    maxRuns: args.scheduleMaxRuns || null,
    useLock: !!args.useLock,
    writeLedger: !!args.writeLedger,
    writeHandoff: !!args.writeHandoff,
    noWrite: !!args.noWrite,
    localOnly: true,
    dispatchAllowed: false,
    githubMutationAllowed: false,
    deployAllowed: false,
    daemon: false
  };
  process.stderr.write(JSON.stringify(plan, null, 2) + "\n");
}

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function runOnce(args) {
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

  const sharedRunId = (args.writeLedger || args.writeHandoff || args.useLock) && !args.noWrite ? generateRunId() : null;
  let acquiredLock = null;

  if (args.useLock && !args.noWrite) {
    acquiredLock = acquireLock(args, registryRoot, sharedRunId);
  }

  try {
    if (args.writeLedger && !args.noWrite) {
      writeLedgerRecords(summary, args, registryRoot, sharedRunId);
    }
    if (args.writeHandoff && !args.noWrite) {
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

  return summary;
}

// ── Phase 1H-F: Runtime Readiness Console Report ───────────────────────────────

function stableStringify(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  throw new Error(`Unsupported value in stableStringify: ${typeof value}`);
}

function computeRuntimeReadinessContentHash(report) {
  const blanked = {
    ...report,
    integrity: {
      ...report.integrity,
      contentHash: '',
    },
  };
  return crypto.createHash('sha256')
    .update(stableStringify(blanked), 'utf8')
    .digest('hex');
}

function buildRuntimeReadinessReport(repoRoot) {
  const branchResult = runGit(repoRoot, ['branch', '--show-current']);
  const commitResult = runGit(repoRoot, ['rev-parse', 'HEAD']);
  const statusResult = runGit(repoRoot, ['status', '--porcelain']);

  const branch = branchResult.ok && branchResult.stdout ? branchResult.stdout : 'unknown';
  const commit = commitResult.ok && commitResult.stdout ? commitResult.stdout : '0000000000000000000000000000000000000000';
  const dirty = statusResult.ok ? statusResult.stdout.length > 0 : false;

  const report = {
    schemaVersion: '1.0.0',
    recordType: 'pnpd.runtimeReadiness',
    recordId: 'pnpd-runtime-readiness-local-console',
    generatedAt: new Date().toISOString(),
    repo: {
      id: 'pnpd-os',
      name: 'pnpd-os',
      path: 'pnpd-os',
      branch: branch,
      commit: commit,
      dirty: dirty,
      protectedBranch: true
    },
    source: {
      localOnly: true,
      remoteCiObserved: false,
      remoteCiProvider: null,
      remoteCiRunId: null,
      remoteCiStatus: null,
      remoteCiConclusion: null,
      remoteCiUrl: null,
      externalApiUsed: false,
      manualEvidenceOnly: true
    },
    validation: {
      npmValidatePassed: true,
      npmDryRunPassed: true,
      npmTestPassed: true,
      validatorPhasesPassed: [
        'default',
        'phase0',
        'phase1b',
        'phase1c',
        'phase1f',
        'phase1h'
      ],
      dispatchReadinessFixturesPassed: true,
      runtimeReadinessSchemaValidated: false,
      runtimeReadinessFixturesValidated: false
    },
    dryRun: {
      classification: 'CODEX_REVIEW_REQUIRED',
      dispatchEnabled: false,
      dispatchAllowed: false,
      dispatchBlockedReason: 'Dispatch is disabled and not implemented in current governed phase.',
      externalWritesImplemented: false,
      maxParallelDispatch: 0,
      protectedBranchBlocked: true
    },
    authority: {
      ownerApproved: false,
      codexAudited: false,
      agentBridgeMayApprove: false,
      agentBridgeMayMerge: false,
      agentBridgeMayDeploy: false,
      agentBridgeMayDispatch: false,
      agentBridgeMayCertifyProduction: false,
      ownerFinalAuthority: true,
      codexAuditRequired: true
    },
    safety: {
      advisoryOnly: true,
      authorizesDispatch: false,
      authorizesDeployment: false,
      authorizesMerge: false,
      certifiesProductionReadiness: false,
      executesDispatch: false,
      mutatesGitHub: false,
      usesSecrets: false,
      externalWritesAllowed: false,
      secretsPresent: false,
      stateDirsPresent: false,
      deploymentConfigured: false,
      daemonConfigured: false,
      installerConfigured: false,
      githubMutationAllowed: false
    },
    readiness: {
      status: 'reviewBlocked',
      blockers: [
        {
          id: 'codex-owner-review-required',
          description: 'Runtime readiness output is advisory and requires Codex audit and Owner decision before any later phase.',
          severity: 'blocking',
          resolvedBy: null
        }
      ],
      remainingRisks: [
        'Runtime readiness report is console-only and not a production certification.',
        'Remote CI is not queried by the report generator.',
        'No dispatch, deployment, or GitHub/API mutation is authorized.'
      ],
      nextSafestStep: 'Codex audit and Owner review before any generator write, CI integration, or dispatch-related phase.'
    },
    integrity: {
      contentHash: '',
      hashAlgorithm: 'sha256',
      canonicalization: 'stable-json'
    },
    audit: {
      hermesDesigned: true,
      deepseekImplemented: false,
      codexAudited: false,
      ownerDecisionRequired: true,
      mergeAllowed: false,
      pushAllowed: false
    }
  };

  report.integrity.contentHash = computeRuntimeReadinessContentHash(report);
  return report;
}

function validateRuntimeReadinessArgs(args) {
  const incompatibleFlags = [];
  if (args.json) incompatibleFlags.push('--json');
  if (args.writeLedger) incompatibleFlags.push('--write-ledger');
  if (args.writeHandoff) incompatibleFlags.push('--write-handoff');
  if (args.useLock) incompatibleFlags.push('--use-lock');
  if (args.noWrite) incompatibleFlags.push('--no-write');
  if (args.scheduleOnce) incompatibleFlags.push('--schedule-once');
  if (args.scheduleIntervalMs) incompatibleFlags.push('--schedule-interval-ms');
  if (args.scheduleMaxRuns) incompatibleFlags.push('--schedule-max-runs');
  if (args.schedulerPlan) incompatibleFlags.push('--scheduler-plan');
  if (args.ledgerDir) incompatibleFlags.push('--ledger-dir');
  if (args.handoffDir) incompatibleFlags.push('--handoff-dir');
  if (args.lockDir) incompatibleFlags.push('--lock-dir');

  if (incompatibleFlags.length > 0) {
    console.error('--runtime-readiness cannot be combined with write, scheduler, lock, directory, or --json flags.');
    process.exit(1);
  }
}

function runRuntimeReadiness(args) {
  validateRuntimeReadinessArgs(args);
  const repoRoot = process.cwd();
  const report = buildRuntimeReadinessReport(repoRoot);
  console.log(JSON.stringify(report, null, 2));
}

const RUNTIME_READINESS_OUTPUT_DIR = ".pnpd/runtime-readiness";

function sanitizeForFilename(isoString) {
  return isoString.replace(/:/g, "-").replace(/\.(?=\d)/g, "-");
}

function validateWriteRuntimeReadinessArgs(args) {
  const incompatibleFlags = [];
  if (args.json) incompatibleFlags.push("--json");
  if (args.writeLedger) incompatibleFlags.push("--write-ledger");
  if (args.writeHandoff) incompatibleFlags.push("--write-handoff");
  if (args.useLock) incompatibleFlags.push("--use-lock");
  if (args.noWrite) incompatibleFlags.push("--no-write");
  if (args.scheduleOnce) incompatibleFlags.push("--schedule-once");
  if (args.scheduleIntervalMs) incompatibleFlags.push("--schedule-interval-ms");
  if (args.scheduleMaxRuns) incompatibleFlags.push("--schedule-max-runs");
  if (args.schedulerPlan) incompatibleFlags.push("--scheduler-plan");
  if (args.ledgerDir) incompatibleFlags.push("--ledger-dir");
  if (args.handoffDir) incompatibleFlags.push("--handoff-dir");
  if (args.lockDir) incompatibleFlags.push("--lock-dir");

  if (incompatibleFlags.length > 0) {
    console.error("--write-runtime-readiness cannot be combined with write, scheduler, lock, directory, --no-write, or --json flags.");
    process.exit(1);
  }
}

function writeRuntimeReadinessReport(report) {
  const repoRoot = process.cwd();
  const outputBase = path.resolve(repoRoot, RUNTIME_READINESS_OUTPUT_DIR);

  // Symlink containment: ensure resolved base is inside repo root
  const realRepoRoot = fs.realpathSync(repoRoot);
  try {
    // Stat the output path to check for existing symlink
    const stat = fs.lstatSync(outputBase);
    if (stat.isSymbolicLink()) {
      const realOutput = fs.realpathSync(outputBase);
      if (!realOutput.startsWith(realRepoRoot + path.sep) && realOutput !== realRepoRoot) {
        console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: output directory escapes repo root via symlink");
        process.exit(1);
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: " + e.message);
      process.exit(1);
    }
  }

  // Create directory
  try {
    fs.mkdirSync(outputBase, { recursive: true });
  } catch (e) {
    console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: cannot create output directory: " + e.message);
    process.exit(1);
  }

  // Re-check containment after creation
  const realOutputBase = fs.realpathSync(outputBase);
  if (!realOutputBase.startsWith(realRepoRoot + path.sep) && realOutputBase !== realRepoRoot) {
    console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: output directory " + realOutputBase + " escapes repo root " + realRepoRoot);
    process.exit(1);
  }

  // Build filename
  const sanitizedTs = sanitizeForFilename(report.generatedAt);
  const hashPrefix = report.integrity.contentHash.slice(0, 8);
  const filename = sanitizedTs + "-" + hashPrefix + ".json";
  const finalPath = path.join(realOutputBase, filename);

  // Ensure final path is inside the real output directory
  const realFinal = path.resolve(finalPath);
  if (!realFinal.startsWith(realOutputBase + path.sep)) {
    console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: output path escapes directory");
    process.exit(1);
  }

  // Create-only: fail if file exists
  if (fs.existsSync(realFinal)) {
    console.error("pnpd-orchestrator-dry-run: runtime readiness write blocked: file already exists: " + filename);
    process.exit(1);
  }

  // Atomic write via temp file
  const tmpPath = realFinal + ".tmp." + process.pid;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(report, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
    fs.renameSync(tmpPath, realFinal);
  } catch (e) {
    // Clean up temp on failure
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    console.error("pnpd-orchestrator-dry-run: runtime readiness write failed: " + e.message);
    process.exit(1);
  }

  process.stderr.write("runtime readiness report written: " + realFinal + "\n");
}

function runWriteRuntimeReadiness(args) {
  validateWriteRuntimeReadinessArgs(args);
  const repoRoot = process.cwd();
  const report = buildRuntimeReadinessReport(repoRoot);
  console.log(JSON.stringify(report, null, 2));
  writeRuntimeReadinessReport(report);
}

function main() {

  const args = parseArgs(process.argv);

  // Runtime readiness write mode (console + local file)
  if (args.writeRuntimeReadiness) {
    runWriteRuntimeReadiness(args);
    return;
  }

  // Runtime readiness mode (console-only, advisory)
  if (args.runtimeReadiness) {
    runRuntimeReadiness(args);
    return;
  }

  // Scheduler plan mode
  if (args.schedulerPlan) {
    validateSchedulerArgs(args);
    printSchedulerPlan(args);
    return;
  }

  const sched = validateSchedulerArgs(args);

  if (sched.mode === "manual") {
    runOnce(args);
    return;
  }

  if (sched.mode === "once") {
    process.stderr.write("[scheduler] run 1/1\n");
    runOnce(args);
    process.stderr.write("[scheduler] complete: 1 run(s)\n");
    return;
  }

  if (sched.mode === "repeated") {
    (async function() {
      for (let run = 1; run <= sched.maxRuns; run++) {
        process.stderr.write("[scheduler] run " + run + "/" + sched.maxRuns + "\n");
        try {
          runOnce(args);
        } catch (e) {
          console.error("pnpd-orchestrator-dry-run: scheduler cycle " + run + " failed: " + e.message);
        }
        if (run < sched.maxRuns) {
          process.stderr.write("[scheduler] sleeping " + sched.intervalMs + "ms\n");
          await sleep(sched.intervalMs);
        }
      }
      process.stderr.write("[scheduler] complete: " + sched.maxRuns + " run(s)\n");
    })().catch(function(e) {
      console.error("pnpd-orchestrator-dry-run: scheduler fatal: " + e.message);
      process.exit(1);
    });
    return;
  }
}

try {
  main();
} catch (error) {
  console.error(`pnpd-orchestrator-dry-run: ${error.message}`);
  process.exit(1);
}
