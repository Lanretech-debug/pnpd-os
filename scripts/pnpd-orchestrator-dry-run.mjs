#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
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

function parseArgs(argv) {
  const args = {
    registry: ".pnpd/repos.example.json",
    json: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
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
  - writes no files
  - creates no agent threads
  - performs no merge, deploy, push, or GitHub mutation`);
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

function main() {
  const args = parseArgs(process.argv);
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

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    renderText(summary);
  }
}

try {
  main();
} catch (error) {
  console.error(`pnpd-orchestrator-dry-run: ${error.message}`);
  process.exit(1);
}
