#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
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

const SECRET_KEY_PATTERN = /(api[_-]?key|auth[_-]?token|access[_-]?token|secret[_-]?key|password|private[_-]?key|authorization|auth[_-]?header)/i;
const SECRET_VALUE_PATTERN = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

const FORBIDDEN_PATH_FRAGMENTS = [
  "/Users/lanretech/Documents/BricLab Kids"
];

const FORBIDDEN_REGISTRY_KEY_PATTERNS = [
  /^\.env$/,
  /\.env$/,
  /deploy/i,
  /github[_-]?token/i,
  /github[_-]?write/i,
  /merge[_-]?enabled/i,
  /push[_-]?enabled/i,
  /auto[_-]?merge/i,
  /auto[_-]?approve/i
];

function parseArgs(argv) {
  const args = { phase: null };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--phase") {
      if (!argv[i + 1]) {
        throw new Error("--phase requires a value (0 or 1b).");
      }
      const phaseVal = argv[i + 1];
      if (phaseVal !== "0" && phaseVal !== "1b") {
        throw new Error('--phase must be "0" or "1b".');
      }
      args.phase = phaseVal;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`PNPD Schema Validator

Usage:
  node scripts/pnpd-validate-schemas.mjs [--phase 0|1b]

Options:
  --phase 0   Validate Phase 0 invariants only.
  --phase 1b  Validate Phase 1B invariants only.
  (default)   Validate all invariants.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
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

function findForbiddenPaths(value, currentPath = "$", findings = []) {
  if (typeof value === "string") {
    for (const fragment of FORBIDDEN_PATH_FRAGMENTS) {
      if (value.includes(fragment)) {
        findings.push({ path: currentPath, value, fragment });
      }
    }
    if (value.includes("..")) {
      findings.push({ path: currentPath, value, fragment: "path-traversal" });
    }
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenPaths(item, `${currentPath}[${index}]`, findings));
  } else if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      findForbiddenPaths(nestedValue, `${currentPath}.${key}`, findings);
    }
  }

  return findings;
}

function findForbiddenRegistryKeys(value, currentPath = "$", findings = []) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      const nestedPath = `${currentPath}.${key}`;
      for (const pattern of FORBIDDEN_REGISTRY_KEY_PATTERNS) {
        if (pattern.test(key)) {
          findings.push({ path: nestedPath, key });
        }
      }
      findForbiddenRegistryKeys(nestedValue, nestedPath, findings);
    }
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenRegistryKeys(item, `${currentPath}[${index}]`, findings));
  }

  return findings;
}

function findEnvPaths(value, currentPath = "$", findings = []) {
  if (typeof value === "string" && (value.endsWith(".env") || value.includes("/.env"))) {
    findings.push({ path: currentPath, value });
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => findEnvPaths(item, `${currentPath}[${index}]`, findings));
  } else if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      findEnvPaths(nestedValue, `${currentPath}.${key}`, findings);
    }
  }

  return findings;
}

// ── Phase 0 schema validators ──────────────────────────────────────────────────

function validateRepoSchemaPhase0(schema) {
  assert(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "Repo schema must use JSON Schema draft 2020-12.");
  assert(schema.properties?.version?.const === 1, "Repo schema must require version 1.");
  assert(schema.properties?.orchestrator?.properties?.mode?.enum?.includes("dry-run"), "Repo schema must include dry-run mode.");
  assert(schema.properties?.orchestrator?.properties?.dispatchEnabled?.const === false, "Repo schema must force dispatchEnabled false.");
  assert(schema.properties?.orchestrator?.properties?.maxParallelThreads?.maximum === 0, "Repo schema must force maxParallelThreads 0.");
  const stateEnum = schema.$defs?.pendingItem?.properties?.state?.enum || [];
  for (const state of STATES) {
    assert(stateEnum.includes(state), `Repo schema missing state ${state}.`);
  }
}

function validateOutputSchemaPhase0(schema) {
  assert(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "Output schema must use JSON Schema draft 2020-12.");
  assert(schema.properties?.mode?.const === "dry-run", "Output schema must force dry-run mode.");
  assert(schema.properties?.dispatchEnabled?.const === false, "Output schema must force dispatchEnabled false.");
  assert(schema.$defs?.repoResult?.properties?.dispatchAllowed?.const === false, "Output schema must force dispatchAllowed false.");
  const stateEnum = schema.$defs?.repoResult?.properties?.classification?.enum || [];
  for (const state of STATES) {
    assert(stateEnum.includes(state), `Output schema missing state ${state}.`);
  }
}

function validateRegistryPhase0(registry) {
  assert(registry.version === 1, "Registry example must be version 1.");
  assert(registry.orchestrator?.mode === "dry-run", "Registry example must be dry-run.");
  assert(registry.orchestrator?.dispatchEnabled === false, "Registry example must disable dispatch.");
  assert(registry.orchestrator?.maxParallelThreads === 0, "Registry example must set maxParallelThreads to 0.");
  assert(Array.isArray(registry.repos), "Registry example must contain repos array.");

  const ids = new Set();
  for (const repo of registry.repos) {
    assert(repo.id && repo.name && repo.path, "Every repo must include id, name, and path.");
    assert(!ids.has(repo.id), `Duplicate repo id: ${repo.id}`);
    ids.add(repo.id);

    for (const item of repo.pendingItems || []) {
      assert(item.id && item.type && item.title, `Pending item in ${repo.id} is missing required fields.`);
      if (item.state) {
        assert(STATES.has(item.state), `Invalid pending item state ${item.state} in ${repo.id}.`);
      }
      assert(item.state !== "APPROVED_FOR_MERGE", `Phase 0 registry must not pre-classify ${item.id} as APPROVED_FOR_MERGE.`);
    }
  }

  const secretFindings = findSecretLikeFields(registry);
  assert(secretFindings.length === 0, `Registry contains secret-like field(s): ${secretFindings.join(", ")}`);
}

// ── Phase 1B schema validators ──────────────────────────────────────────────────

function validateRepoSchemaPhase1B(schema) {
  // Verify new Phase 1B repo schema blocks enforce safety

  const repoDef = schema.$defs?.repo;
  assert(repoDef, "Repo schema must have $defs.repo definition.");
  assert(repoDef.additionalProperties === false, "Phase 1B repo schema must set additionalProperties: false.");

  // scheduler
  const schedulerProps = repoDef.properties?.scheduler?.properties;
  if (schedulerProps) {
    assert(schedulerProps.enabled?.const === false, "scheduler.enabled must be const: false.");
  }

  // authority
  const authorityProps = repoDef.properties?.authority?.properties;
  if (authorityProps) {
    assert(authorityProps.dispatchAllowed?.const === false, "authority.dispatchAllowed must be const: false.");
    assert(authorityProps.externalWritesAllowed?.const === false, "authority.externalWritesAllowed must be const: false.");
  }

  // secrets
  const secretsProps = repoDef.properties?.secrets?.properties;
  if (secretsProps) {
    assert(secretsProps.policy?.const === "deny-all", "secrets.policy must be const: deny-all.");
  }

  // localWrites
  const localWritesProps = repoDef.properties?.localWrites?.properties;
  if (localWritesProps) {
    assert(localWritesProps.allowed?.const === false, "localWrites.allowed must be const: false.");
  }
}

function validateOutputSchemaPhase1B(schema) {
  // Verify new Phase 1B output authority flags enforce safety

  const authorityFlagsProps = schema.$defs?.repoResult?.properties?.authorityFlags?.properties;
  if (authorityFlagsProps) {
    assert(authorityFlagsProps.approvalClaimed?.const === false, "authorityFlags.approvalClaimed must be const: false.");
    assert(authorityFlagsProps.mergeClaimed?.const === false, "authorityFlags.mergeClaimed must be const: false.");
    assert(authorityFlagsProps.dispatchRequested?.const === false, "authorityFlags.dispatchRequested must be const: false.");
    assert(authorityFlagsProps.auditClaimed?.const === false, "authorityFlags.auditClaimed must be const: false.");
    assert(authorityFlagsProps.productionReadinessClaimed?.const === false, "authorityFlags.productionReadinessClaimed must be const: false.");
  }
}

function validateRegistryPhase1B(registry) {
  // Phase 1B registry-level safety checks
  for (const repo of registry.repos) {
    // scheduler
    if (repo.scheduler) {
      assert(repo.scheduler.enabled === false, `${repo.id}: scheduler.enabled must be false.`);
    }

    // authority
    if (repo.authority) {
      assert(repo.authority.dispatchAllowed === false, `${repo.id}: authority.dispatchAllowed must be false.`);
      assert(repo.authority.externalWritesAllowed === false, `${repo.id}: authority.externalWritesAllowed must be false.`);
    }

    // secrets
    if (repo.secrets) {
      assert(repo.secrets.policy === "deny-all", `${repo.id}: secrets.policy must be deny-all.`);
    }

    // localWrites
    if (repo.localWrites) {
      assert(repo.localWrites.allowed === false, `${repo.id}: localWrites.allowed must be false.`);
    }
  }

  // No forbidden paths (legacy BricLab Kids Documents path, path traversal)
  const forbiddenPaths = findForbiddenPaths(registry);
  assert(forbiddenPaths.length === 0, `Registry contains forbidden path(s): ${JSON.stringify(forbiddenPaths)}`);

  // No .env paths
  const envPaths = findEnvPaths(registry);
  assert(envPaths.length === 0, `Registry contains .env path(s): ${JSON.stringify(envPaths)}`);

  // No forbidden registry keys (deploy config, GitHub write, auto-merge, auto-approve)
  const forbiddenKeys = findForbiddenRegistryKeys(registry);
  assert(forbiddenKeys.length === 0, `Registry contains forbidden key(s): ${JSON.stringify(forbiddenKeys)}`);

  // No GitHub write config
  for (const repo of registry.repos) {
    if (repo.metadataSources?.github) {
      const gh = repo.metadataSources.github;
      assert(!gh.writeEnabled, `${repo.id}: GitHub writeEnabled must not be present.`);
      assert(!gh.mergeEnabled, `${repo.id}: GitHub mergeEnabled must not be present.`);
      assert(!gh.pushEnabled, `${repo.id}: GitHub pushEnabled must not be present.`);
    }
  }

  // No deploy config
  for (const repo of registry.repos) {
    assert(!repo.deploy, `${repo.id}: deploy config must not be present.`);
    assert(!repo.deployment, `${repo.id}: deployment config must not be present.`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────────

try {
  const args = parseArgs(process.argv);
  const runPhase0 = args.phase === null || args.phase === "0";
  const runPhase1b = args.phase === null || args.phase === "1b";

  if (runPhase0) {
    validateRepoSchemaPhase0(readJson(".pnpd/repos.schema.json"));
    validateOutputSchemaPhase0(readJson(".pnpd/orchestrator.schema.json"));
    validateRegistryPhase0(readJson(".pnpd/repos.example.json"));
  }

  if (runPhase1b) {
    validateRepoSchemaPhase1B(readJson(".pnpd/repos.schema.json"));
    validateOutputSchemaPhase1B(readJson(".pnpd/orchestrator.schema.json"));
    validateRegistryPhase1B(readJson(".pnpd/repos.example.json"));
  }

  console.log("pnpd schema validation ok");
} catch (error) {
  console.error(`pnpd schema validation failed: ${error.message}`);
  process.exit(1);
}
