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
  path.join("/Users", "lanretech", "Documents", "BricLab Kids")
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
const FORBIDDEN_CAPABILITY_NAMES = new Set([
  "token",
  "secret",
  "password",
  "apiKey",
  "privateKey",
  "githubToken",
  "gitPush",
  "remoteUrl",
  "deploy",
  "deployment",
  "release",
  "productionUrl",
  "dispatchTarget",
  "externalWrite",
  "webhook",
  "apiEndpoint",
  "emailRecipient"
]);

const REQUIRED_PHASE_1C_DEFS = new Set([
  "ledgerRecord",
  "handoffRecord",
  "ledgerRepo",
  "ledgerGit",
  "gateResult",
  "blockedReason",
  "riskAssessment",
  "authorityFlags",
  "redactionSummary",
  "integrityBlock",
  "reviewerEnum",
  "classificationEnum",
  "handoffRouting",
  "gateStatusEnum"
]);
const PHASE_1C_FIXTURES = [
  {
    file: "tests/fixtures/pnpd/ledger/valid-ledger-record.json",
    def: "ledgerRecord",
    expectValid: true,
    expectedReason: "valid ledger record"
  },
  {
    file: "tests/fixtures/pnpd/ledger/invalid-authority-flag.json",
    def: "ledgerRecord",
    expectValid: false,
    expectedReason: "authority flag must be const false"
  },
  {
    file: "tests/fixtures/pnpd/ledger/invalid-capability-field.json",
    def: "ledgerRecord",
    expectValid: false,
    expectedReason: "extra deploy field blocked by additionalProperties false"
  },
  {
    file: "tests/fixtures/pnpd/ledger/invalid-missing-required.json",
    def: "ledgerRecord",
    expectValid: false,
    expectedReason: "missing required gates field"
  },
  {
    file: "tests/fixtures/pnpd/handoff/valid-handoff-record.json",
    def: "handoffRecord",
    expectValid: true,
    expectedReason: "valid handoff record"
  },
  {
    file: "tests/fixtures/pnpd/handoff/invalid-routing-target.json",
    def: "handoffRecord",
    expectValid: false,
    expectedReason: "routing target dispatch is not allowed"
  },
  {
    file: "tests/fixtures/pnpd/handoff/invalid-approval-claim.json",
    def: "handoffRecord",
    expectValid: false,
    expectedReason: "authority flags must be const false"
  }
];



function parseArgs(argv) {
  const args = { phase: null };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--phase") {
      if (!argv[i + 1]) {
        throw new Error("--phase requires a value (0, 1b, 1c, or 1f).");
      }
      const phaseVal = argv[i + 1];
      if (phaseVal !== "0" && phaseVal !== "1b" && phaseVal !== "1c" && phaseVal !== "1f") {
        throw new Error('--phase must be "0", "1b", "1c", or "1f".');
      }
      args.phase = phaseVal;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`PNPD Schema Validator

Usage:
  node scripts/pnpd-validate-schemas.mjs [--phase 0|1b|1c|1f]

Options:
  --phase 0   Validate Phase 0 invariants only.
  --phase 1b  Validate Phase 0 + Phase 1B invariants.
  --phase 1c  Validate Phase 0 + Phase 1B + Phase 1C invariants + fixture instance validation.
  --phase 1f  Validate PNPD dispatch readiness fixtures (explicit-only, not included in default).
  (default)   Validate all invariants (Phase 0 + 1B + 1C).`);
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


// ── Phase 1C helpers ─────────────────────────────────────────────────────────────

function getDef(schema, name) {
  const def = schema.$defs?.[name];
  assert(def, "Missing required $def: " + name);
  return def;
}

function resolveLocalRef(schema, ref) {
  if (typeof ref !== "string" || !ref.startsWith("#/$defs/")) {
    throw new Error("Only local #/$defs/ refs are supported; got: " + ref);
  }
  const name = ref.slice("#/$defs/".length);
  return getDef(schema, name);
}

function scanForbiddenCapabilityNames(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanForbiddenCapabilityNames(item, currentPath + "[" + i + "]", findings));
    return findings;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_CAPABILITY_NAMES.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanForbiddenCapabilityNames(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanExternalRefs(schema, currentPath, findings) {
  if (typeof schema === "string") {
    if (currentPath.endsWith(".$ref") && !schema.startsWith("#/$defs/")) {
      findings.push(currentPath + " = " + schema);
    }
    return findings;
  }

  if (!schema || typeof schema !== "object") return findings;

  if (Array.isArray(schema)) {
    schema.forEach((item, i) => scanExternalRefs(item, currentPath + "[" + i + "]", findings));
    return findings;
  }

  for (const [key, value] of Object.entries(schema)) {
    scanExternalRefs(value, currentPath + "." + key, findings);
  }
  return findings;
}
// ── Main ────────────────────────────────────────────────────────────────────────


// ── Phase 1C schema validators ────────────────────────────────────────────────────


// ── Phase 1C instance validator ──────────────────────────────────────────────────

function resolveRef(schema, ref, refPath) {
  if (typeof ref !== "string" || !ref.startsWith("#/$defs/")) {
    throw new Error("Unsupported $ref at " + refPath + ": " + String(ref));
  }
  const name = ref.slice("#/$defs/".length);
  const resolved = schema.$defs?.[name] ?? null;
  if (!resolved) {
    throw new Error("Missing $ref target at " + refPath + ": " + ref);
  }
  return resolved;
}

function validateInstance(instance, schemaDef, fullSchema, path) {
  const failures = [];
  if (!schemaDef) {
    failures.push({ path, expected: "schema definition", actual: "missing" });
    return failures;
  }

  // type check
  if (schemaDef.type) {
    const types = Array.isArray(schemaDef.type) ? schemaDef.type : [schemaDef.type];
    const instType = instance === null ? "null" : Array.isArray(instance) ? "array" : typeof instance;
    const typeMatches = types.some(function(t) {
      if (t === "integer") return Number.isInteger(instance);
      return t === instType;
    });
    if (!typeMatches) {
      var extra = "";
      if (typeof instance === "number" && !Number.isInteger(instance)) extra = " (float)";
      failures.push({ path: path, expected: "type " + types.join("|"), actual: instType + extra });
      return failures;
    }
  }

  // object validations
  if (schemaDef.type === "object" && instance && typeof instance === "object" && !Array.isArray(instance)) {
    // additionalProperties
    if (schemaDef.additionalProperties === false) {
      var knownKeys = new Set(Object.keys(schemaDef.properties || {}));
      for (var _i = 0, _keys = Object.keys(instance); _i < _keys.length; _i++) {
        var key = _keys[_i];
        if (!knownKeys.has(key)) {
          failures.push({ path: path + "." + key, expected: "no extra properties", actual: "extra field: " + key });
        }
      }
    }

    // required
    for (var _j = 0, _reqs = schemaDef.required || []; _j < _reqs.length; _j++) {
      var req = _reqs[_j];
      if (!(req in instance)) {
        failures.push({ path: path, expected: "required field " + req, actual: "missing" });
      }
    }

    // properties
    if (schemaDef.properties) {
      for (var _k = 0, _entries = Object.entries(schemaDef.properties); _k < _entries.length; _k++) {
        var entry = _entries[_k];
        var propKey = entry[0];
        var propSchema = entry[1];
        if (propKey in instance) {
          var resolved = propSchema.$ref ? resolveRef(fullSchema, propSchema.$ref, path + "." + propKey + ".$ref") : propSchema;
          var subFailures = validateInstance(instance[propKey], resolved, fullSchema, path + "." + propKey);
          for (var _m = 0; _m < subFailures.length; _m++) {
            failures.push(subFailures[_m]);
          }
        }
      }
    }
  }

  // const
  if (schemaDef.const !== undefined && instance !== schemaDef.const) {
    failures.push({ path: path, expected: String(schemaDef.const), actual: String(instance) });
  }

  // enum
  if (schemaDef.enum && !schemaDef.enum.includes(instance)) {
    failures.push({ path: path, expected: "one of [" + schemaDef.enum.join(", ") + "]", actual: String(instance) });
  }

  // string validations
  if (typeof instance === "string") {
    if (schemaDef.pattern) {
      var re = new RegExp("^(?:" + schemaDef.pattern + ")$");
      if (!re.test(instance)) {
        failures.push({ path: path, expected: "pattern " + schemaDef.pattern, actual: instance });
      }
    }
    if (schemaDef.maxLength !== undefined && instance.length > schemaDef.maxLength) {
      failures.push({ path: path, expected: "maxLength " + schemaDef.maxLength, actual: "length " + instance.length });
    }
    if (schemaDef.minLength !== undefined && instance.length < schemaDef.minLength) {
      failures.push({ path: path, expected: "minLength " + schemaDef.minLength, actual: "length " + instance.length });
    }
    if (schemaDef.format === "date-time") {
      var dtRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
      if (!dtRe.test(instance)) {
        failures.push({ path: path, expected: "date-time format", actual: instance });
      }
    }
  }

  // number validations
  if (typeof instance === "number") {
    if (schemaDef.minimum !== undefined && instance < schemaDef.minimum) {
      failures.push({ path: path, expected: "minimum " + schemaDef.minimum, actual: String(instance) });
    }
    if (schemaDef.maximum !== undefined && instance > schemaDef.maximum) {
      failures.push({ path: path, expected: "maximum " + schemaDef.maximum, actual: String(instance) });
    }
  }

  // integer validation (via type)
  if (schemaDef.type === "integer" && !Number.isInteger(instance)) {
    failures.push({ path: path, expected: "integer", actual: String(instance) });
  }

  // array validations
  if (Array.isArray(instance)) {
    if (schemaDef.maxItems !== undefined && instance.length > schemaDef.maxItems) {
      failures.push({ path: path, expected: "maxItems " + schemaDef.maxItems, actual: "length " + instance.length });
    }
    if (schemaDef.items) {
      var itemSchema = schemaDef.items.$ref ? resolveRef(fullSchema, schemaDef.items.$ref, path + ".items.$ref") : schemaDef.items;
      for (var i = 0; i < instance.length; i++) {
        var arrFails = validateInstance(instance[i], itemSchema, fullSchema, path + "[" + i + "]");
        for (var _n = 0; _n < arrFails.length; _n++) {
          failures.push(arrFails[_n]);
        }
      }
    }
  }

  // oneOf
  if (schemaDef.oneOf) {
    var matchCount = 0;
    for (var _o = 0; _o < schemaDef.oneOf.length; _o++) {
      var subSchema = schemaDef.oneOf[_o];
      var subResolved = subSchema.$ref ? resolveRef(fullSchema, subSchema.$ref, path + ".oneOf[" + _o + "].$ref") : subSchema;
      var subFailures = validateInstance(instance, subResolved, fullSchema, path);
      if (subFailures.length === 0) {
        matchCount += 1;
      }
    }
    if (matchCount !== 1) {
      failures.push({ path: path, expected: "exactly one oneOf match", actual: String(matchCount) + " alternatives matched" });
    }
  }

  return failures;
}

function scanFixtureContent(fixture) {
  var secretFindings = findSecretLikeFields(fixture);
  var forbiddenPathFindings = findForbiddenPaths(fixture);
  var envFindings = findEnvPaths(fixture);

  var issues = [];
  if (secretFindings.length > 0) {
    issues.push("Secret-like fields: " + secretFindings.join(", "));
  }
  if (forbiddenPathFindings.length > 0) {
    issues.push("Forbidden paths: " + JSON.stringify(forbiddenPathFindings));
  }
  if (envFindings.length > 0) {
    issues.push(".env paths: " + JSON.stringify(envFindings));
  }
  return issues;
}

function validateFixturesPhase1C() {
  var schema = readJson(".pnpd/orchestrator.schema.json");
  var failures = [];

  for (var _p = 0; _p < PHASE_1C_FIXTURES.length; _p++) {
    var entry = PHASE_1C_FIXTURES[_p];

    // Check fixture file exists
    var fixture;
    try {
      fixture = readJson(entry.file);
    } catch (e) {
      failures.push(entry.file + ": MISSING or invalid JSON: " + e.message);
      continue;
    }

    // Safety scan
    var safetyIssues = scanFixtureContent(fixture);
    if (safetyIssues.length > 0) {
      failures.push(entry.file + ": SAFETY VIOLATION: " + safetyIssues.join("; "));
      continue;
    }

    // Validate against the specified schema definition
    var schemaDef = getDef(schema, entry.def);
    var validationFailures = validateInstance(fixture, schemaDef, schema, "$");

    if (entry.expectValid && validationFailures.length > 0) {
      var detail = validationFailures.map(function(f) { return f.path + ": " + f.expected + " (got: " + f.actual + ")"; }).join("; ");
      failures.push(entry.file + ": expected VALID but got " + validationFailures.length + " failure(s): " + detail);
    } else if (!entry.expectValid && validationFailures.length === 0) {
      failures.push(entry.file + ": expected INVALID (" + entry.expectedReason + ") but passed validation");
    }
  }

  if (failures.length > 0) {
    throw new Error("Fixture validation failures:\\n  " + failures.join("\\n  "));
  }
}

function validateOrchestratorSchemaPhase1C(schema) {
  const defs = schema.$defs;
  assert(defs, "Orchestrator schema must have $defs.");

  // -- Required $defs existence --
  for (const name of REQUIRED_PHASE_1C_DEFS) {
    getDef(schema, name);
  }

  // -- Ledger record --
  validateLedgerRecordPhase1C(schema);
  // -- Handoff record --
  validateHandoffRecordPhase1C(schema);
  // -- Shared defs --
  validateSharedDefsPhase1C(schema);
  // -- Capability field scan --
  validateCapabilityScanPhase1C(schema);
  // -- External $ref scan --
  validateExternalRefScanPhase1C(schema);
  // -- Backward compatibility --
  validatePhase1CBackwardCompat(schema);

  // Fixture instance validation
  validateFixturesPhase1C();
}

function validateLedgerRecordPhase1C(schema) {
  const lr = getDef(schema, "ledgerRecord");

  assert(lr.type === "object", "ledgerRecord must be type object.");
  assert(lr.additionalProperties === false, "ledgerRecord must have additionalProperties: false.");
  assert(lr.properties?.recordType?.const === "ledger", "ledgerRecord recordType must be const ledger.");
  assert(lr.properties?.schemaVersion?.const === 1, "ledgerRecord schemaVersion must be const 1.");

  const source = lr.properties?.source;
  assert(source, "ledgerRecord must have source property.");
  assert(
    source.const === "pnpd-orchestrator-dry-run" ||
    (source.enum && source.enum.length === 1 && source.enum[0] === "pnpd-orchestrator-dry-run"),
    "ledgerRecord.source must be const pnpd-orchestrator-dry-run."
  );

  const required = lr.required || [];
  const coreLedgerFields = ["recordType", "runId", "createdAt", "source", "generatorVersion", "repo", "git", "classification", "gates", "authorityFlags", "integrity"];
  for (const f of coreLedgerFields) {
    assert(required.includes(f), "ledgerRecord required must include: " + f);
  }

  // Free-text field maxLength
  assert(lr.properties?.recommendedAction?.maxLength > 0, "ledgerRecord recommendedAction must have maxLength.");

  // $ref integrity
  validateRef(schema, lr.properties?.repo?.$ref, "ledgerRepo", "ledgerRecord.repo");
  validateRef(schema, lr.properties?.git?.$ref, "ledgerGit", "ledgerRecord.git");
  validateRef(schema, lr.properties?.classification?.$ref, "classificationEnum", "ledgerRecord.classification");
  validateRef(schema, lr.properties?.gates?.items?.$ref, "gateResult", "ledgerRecord.gates.items");
  validateRef(schema, lr.properties?.authorityFlags?.$ref, "authorityFlags", "ledgerRecord.authorityFlags");
  validateRef(schema, lr.properties?.integrity?.$ref, "integrityBlock", "ledgerRecord.integrity");
}

function validateHandoffRecordPhase1C(schema) {
  const hr = getDef(schema, "handoffRecord");

  assert(hr.type === "object", "handoffRecord must be type object.");
  assert(hr.additionalProperties === false, "handoffRecord must have additionalProperties: false.");
  assert(hr.properties?.recordType?.const === "handoff", "handoffRecord recordType must be const handoff.");
  assert(hr.properties?.schemaVersion?.const === 1, "handoffRecord schemaVersion must be const 1.");

  const source = hr.properties?.source;
  assert(source, "handoffRecord must have source property.");
  assert(
    source.const === "pnpd-orchestrator-dry-run" ||
    (source.enum && source.enum.length === 1 && source.enum[0] === "pnpd-orchestrator-dry-run"),
    "handoffRecord.source must be const pnpd-orchestrator-dry-run."
  );

  const required = hr.required || [];
  assert(required.includes("handoff"), "handoffRecord required must include handoff.");

  const handoff = hr.properties?.handoff;
  assert(handoff, "handoffRecord must have handoff property.");
  assert(handoff.additionalProperties === false, "handoffRecord.handoff must have additionalProperties: false.");
  assert(handoff.properties?.format?.const === "pnpd-handoff-v1", "handoff.format must be const pnpd-handoff-v1.");
  assert(handoff.properties?.summary?.maxLength > 0, "handoff.summary must have maxLength.");
  if (handoff.properties?.context) {
    assert(handoff.properties.context.maxLength > 0, "handoff.context must have maxLength.");
  }
  assert(handoff.properties?.routing, "handoff must have routing property.");
  validateRef(schema, handoff.properties?.routing?.$ref, "handoffRouting", "handoffRecord.handoff.routing");

  // No forbidden capability fields at the handoff level
  if (handoff.properties) {
    const caps = [];
    scanForbiddenCapabilityNames(handoff.properties, "handoffRecord.handoff.properties", caps);
    assert(caps.length === 0, "handoff handoff object contains forbidden capability field(s): " + caps.join(", "));
  }
}

function validateSharedDefsPhase1C(schema) {
  // --- authorityFlags ---
  const af = getDef(schema, "authorityFlags");
  assert(af.type === "object", "authorityFlags must be type object.");
  assert(af.additionalProperties === false, "authorityFlags must have additionalProperties: false.");
  const afRequired = af.required || [];
  const afFlags = ["approvalClaimed", "mergeClaimed", "dispatchRequested", "auditClaimed", "productionReadinessClaimed"];
  for (const f of afFlags) {
    assert(afRequired.includes(f), "authorityFlags required must include: " + f);
    assert(af.properties?.[f]?.const === false, "authorityFlags." + f + " must be const: false.");
  }

  // --- handoffRouting ---
  const routing = getDef(schema, "handoffRouting");
  assert(routing.type === "object", "handoffRouting must be type object.");
  assert(routing.additionalProperties === false, "handoffRouting must have additionalProperties: false.");

  // Resolve routing.to (may be $ref to reviewerEnum)
  const toDef = resolveIfRef(schema, routing.properties?.to);
  assert(toDef, "handoffRouting.to must be defined.");
  const toEnum = toDef.enum;
  assert(toEnum, "handoffRouting.to must have enum (directly or via $ref).");
  const expectedTo = ["owner", "hermes", "deepseek", "codex", "none"];
  for (const v of expectedTo) {
    assert(toEnum.includes(v), "handoffRouting.to enum missing: " + v);
  }
  assert(toEnum.length === expectedTo.length, "handoffRouting.to enum has unexpected extra values.");

  // urgency enum
  const urgencyEnum = routing.properties?.urgency?.enum;
  if (urgencyEnum) {
    const expectedUrgency = ["low", "normal", "high", "blocked"];
    for (const v of expectedUrgency) {
      assert(urgencyEnum.includes(v), "handoffRouting.urgency enum missing: " + v);
    }
    assert(urgencyEnum.length === expectedUrgency.length, "handoffRouting.urgency enum has unexpected extra values.");
  }

  // No forbidden capability fields in routing
  const routingCaps = [];
  scanForbiddenCapabilityNames(routing.properties, "handoffRouting.properties", routingCaps);
  assert(routingCaps.length === 0, "handoffRouting contains forbidden capability field(s): " + routingCaps.join(", "));

  // --- reviewerEnum ---
  const rev = getDef(schema, "reviewerEnum");
  const revExpected = ["owner", "hermes", "deepseek", "codex", "none"];
  assert(rev.enum, "reviewerEnum must have enum.");
  for (const v of revExpected) {
    assert(rev.enum.includes(v), "reviewerEnum enum missing: " + v);
  }
  assert(rev.enum.length === revExpected.length, "reviewerEnum enum has unexpected extra values.");

  // --- classificationEnum ---
  const ce = getDef(schema, "classificationEnum");
  assert(ce.enum, "classificationEnum must have enum.");
  const expectedStates = [
    "DISCOVERED", "NEEDS_TRIAGE", "NEEDS_INFO", "READY_FOR_AGENT",
    "DISPATCHED", "IN_PROGRESS", "AGENT_DONE", "AUTOREVIEW_REQUIRED",
    "CODEX_REVIEW_REQUIRED", "OWNER_REVIEW_REQUIRED", "APPROVED_FOR_MERGE",
    "DONE", "BLOCKED", "WONTFIX"
  ];
  for (const s of expectedStates) {
    assert(ce.enum.includes(s), "classificationEnum enum missing: " + s);
  }
  assert(ce.enum.length === expectedStates.length, "classificationEnum enum has unexpected extra values.");

  // --- gateStatusEnum ---
  const gs = getDef(schema, "gateStatusEnum");
  const gsExpected = ["pass", "fail", "blocked", "not-run"];
  assert(gs.enum, "gateStatusEnum must have enum.");
  for (const v of gsExpected) {
    assert(gs.enum.includes(v), "gateStatusEnum enum missing: " + v);
  }
  assert(gs.enum.length === gsExpected.length, "gateStatusEnum enum has unexpected extra values.");

  // --- integrityBlock ---
  const ib = getDef(schema, "integrityBlock");
  assert(ib.type === "object", "integrityBlock must be type object.");
  assert(ib.additionalProperties === false, "integrityBlock must have additionalProperties: false.");
  assert(ib.properties?.contentHash?.pattern === "^sha256:[a-f0-9]{64}$", "integrityBlock.contentHash must have sha256 pattern.");

  // previousLedgerHash allows null
  const plh = ib.properties?.previousLedgerHash;
  assert(plh, "integrityBlock must have previousLedgerHash.");
  if (plh.oneOf) {
    const hasNull = plh.oneOf.some(o => o.type === "null");
    const hasStr  = plh.oneOf.some(o => o.type === "string" && o.pattern === "^sha256:[a-f0-9]{64}$");
    assert(hasNull, "integrityBlock.previousLedgerHash oneOf must include null type.");
    assert(hasStr, "integrityBlock.previousLedgerHash oneOf must include sha256 string type.");
  } else if (Array.isArray(plh.type)) {
    assert(plh.type.includes("null"), "integrityBlock.previousLedgerHash type must include null.");
    assert(plh.pattern === "^sha256:[a-f0-9]{64}$", "integrityBlock.previousLedgerHash must have sha256 pattern.");
  }

  assert(ib.properties?.canonicalization?.const === "json-canonical", "integrityBlock.canonicalization must be const json-canonical.");

  // No forbidden fields in integrityBlock
  const ibCaps = [];
  scanForbiddenCapabilityNames(ib.properties, "integrityBlock.properties", ibCaps);
  assert(ibCaps.length === 0, "integrityBlock contains forbidden capability field(s): " + ibCaps.join(", "));

  // --- redactionSummary ---
  const rs = getDef(schema, "redactionSummary");
  assert(rs.type === "object", "redactionSummary must be type object.");
  assert(rs.additionalProperties === false, "redactionSummary must have additionalProperties: false.");
  assert(rs.properties?.count?.type === "integer", "redactionSummary.count must be integer.");
  assert(rs.properties?.count?.minimum >= 0, "redactionSummary.count minimum must be >= 0.");
  assert(rs.properties?.paths, "redactionSummary must have paths property.");
  assert(!rs.properties?.values, "redactionSummary must not have values property.");
  assert(rs.properties?.paths?.items?.maxLength > 0, "redactionSummary.paths items must have maxLength.");

  // --- Object shared defs: additionalProperties ---
  const objectDefs = ["ledgerRepo", "ledgerGit", "gateResult", "blockedReason", "riskAssessment"];
  for (const name of objectDefs) {
    const def = getDef(schema, name);
    assert(def.type === "object", name + " must be type object.");
    assert(def.additionalProperties === false, name + " must have additionalProperties: false.");
  }

  // Free-text fields in these defs need maxLength
  for (const name of ["gateResult", "blockedReason"]) {
    const def = getDef(schema, name);
    if (def.properties) {
      for (const [k, v] of Object.entries(def.properties)) {
        if (v.type === "string" && k !== "status") {
          assert(v.maxLength > 0, name + "." + k + " must have maxLength.");
        }
      }
    }
  }
}

function validateCapabilityScanPhase1C(schema) {
  const findings = [];
  // Scan properties AND required arrays in Phase 1C defs
  for (const name of REQUIRED_PHASE_1C_DEFS) {
    const def = schema.$defs?.[name];
    if (def && def.properties) {
      scanForbiddenCapabilityNames(def.properties, "$defs." + name + ".properties", findings);
    }
  }
  assert(findings.length === 0, "Phase 1C defs contain forbidden capability field(s): " + findings.join(", "));
}

function validateExternalRefScanPhase1C(schema) {
  const findings = [];
  scanExternalRefs(schema, "$", findings);
  assert(findings.length === 0, "Orchestrator schema contains non-local $ref(s): " + findings.join(", "));
}

function validatePhase1CBackwardCompat(schema) {
  // Top-level required unchanged
  const topRequired = schema.required || [];
  const expectedTopReq = ["mode", "generatedAt", "registryPath", "dispatchEnabled", "repos"];
  for (const f of expectedTopReq) {
    assert(topRequired.includes(f), "Top-level required must include: " + f);
  }
  assert(topRequired.length === expectedTopReq.length, "Top-level required has unexpected extra fields.");

  // repoResult required unchanged
  const rrReq = schema.$defs?.repoResult?.required || [];
  const expectedRrReq = ["id", "name", "path", "enabled", "classification", "dispatchAllowed", "gates", "nextAction"];
  for (const f of expectedRrReq) {
    assert(rrReq.includes(f), "repoResult required must include: " + f);
  }
  assert(rrReq.length === expectedRrReq.length, "repoResult required has unexpected extra fields.");

  // dispatchEnabled const false
  assert(schema.properties?.dispatchEnabled?.const === false, "dispatchEnabled must remain const: false.");

  // repoResult.dispatchAllowed const false
  assert(schema.$defs?.repoResult?.properties?.dispatchAllowed?.const === false, "repoResult.dispatchAllowed must remain const: false.");

  // repoResult.classification inline enum still has 14 states
  const classificationEnum = schema.$defs?.repoResult?.properties?.classification?.enum || [];
  for (const state of STATES) {
    assert(classificationEnum.includes(state), "repoResult.classification enum missing state: " + state);
  }
  assert(classificationEnum.length === 14, "repoResult.classification enum has unexpected extra states.");

  // repoResult.authorityFlags inline still has all five const false
  const af = schema.$defs?.repoResult?.properties?.authorityFlags?.properties;
  if (af) {
    const flags = ["approvalClaimed", "mergeClaimed", "dispatchRequested", "auditClaimed", "productionReadinessClaimed"];
    for (const f of flags) {
      assert(af[f]?.const === false, "repoResult.authorityFlags." + f + " must remain const: false.");
    }
  }

  // No top-level ledger/handoff required fields
  assert(!topRequired.includes("ledgerRecords"), "Top-level must not require ledgerRecords.");
  assert(!topRequired.includes("handoffRecords"), "Top-level must not require handoffRecords.");
}

// ── Phase 1C helpers (continued) ──────────────────────────────────────────────────

function validateRef(schema, ref, expectedName, path) {
  assert(ref, path + " must have a $ref.");
  assert(ref.startsWith("#/$defs/"), path + " $ref must be local #/$defs/.");
  const name = ref.slice("#/$defs/".length);
  assert(name === expectedName, path + " $ref must point to " + expectedName + ", got: " + name);
  getDef(schema, name); // ensure the target exists
}

function resolveIfRef(schema, prop) {
  if (!prop) return null;
  if (prop.$ref) {
    return resolveLocalRef(schema, prop.$ref);
  }
  return prop;
}

// ── Phase 1F: Dispatch Readiness Validation ──────────────────────────────────────

const DISPATCH_READINESS_SCHEMA_PATH = ".pnpd/dispatch-readiness.schema.json";
const DISPATCH_READINESS_FIXTURES_DIR = "tests/fixtures/pnpd/dispatch-readiness";

const READINESS_STATES = new Set([
  "dispatchUnavailable",
  "dispatchBlocked",
  "dispatchEligibleForOwnerReview",
  "dispatchOwnerApprovedPendingCodex",
  "dispatchCodexAuditedPendingOwnerFinal",
  "dispatchReadyButNotExecuted"
]);

const CLASSIFICATIONS = new Set([
  "GREEN",
  "AMBER",
  "RED",
  "AMBER_NOT_CODEX_AUDITED",
  "CODEX_REVIEW_REQUIRED",
  "OWNER_REVIEW_REQUIRED",
  "BLOCKED",
  "DONE"
]);

const LATE_STAGE_READINESS_STATES = new Set([
  "dispatchOwnerApprovedPendingCodex",
  "dispatchCodexAuditedPendingOwnerFinal",
  "dispatchReadyButNotExecuted"
]);

const FORBIDDEN_DISPATCH_FIELDS = new Set([
  "approvedForDispatch",
  "dispatchNow",
  "executeDispatch",
  "autoDispatch",
  "deployNow",
  "githubMutationToken",
  "secret",
  "productionReady",
  "ownerBypassed",
  "codexBypassed",
  "mergeApproved",
  "mergeNow",
  "certProductionReady",
  "bypassGate",
  "bypassOwner",
  "bypassCodex",
  "agentBridgeApproves",
  "agentBridgeApprovedByHermes",
  "agentBridgeCertifies",
  "orchestratorApproved"
]);

const EXPECTED_POSITIVE_FIXTURES = new Set([
  "valid-minimal-dispatch-blocked.json",
  "valid-eligible-for-owner-review.json",
  "valid-codex-audited-pending-owner.json"
]);

const EXPECTED_NEGATIVE_FIXTURES = new Set([
  "invalid-missing-advisory-safety-consts.json",
  "invalid-agentbridge-authority-claim.json",
  "invalid-github-api-mutation-allowed.json",
  "invalid-scheduler-auto-dispatch.json",
  "invalid-production-ready-claim.json",
  "invalid-amber-executable.json",
  "invalid-dispatch-execute-named-state.json",
  "invalid-missing-ledger-ref.json",
  "invalid-forbidden-field-name.json"
]);

const DISPATCH_SECRET_FRAGMENTS = [
  "sk-",
  "ghp_",
  "github_pat_",
  "xoxb-",
  "AKIA",
  "BEGIN PRIVATE KEY",
  "SUPABASE_ACCESS_TOKEN",
  "RESEND_API_KEY",
  "OPENAI_API_KEY",
  "DEEPSEEK_API_KEY",
  "GITHUB_TOKEN"
];

const DISPATCH_FORBIDDEN_PATH_FRAGMENTS = [
  "/Users/",
  "/Users/lanretech/Documents/BricLab Kids",
  ".env"
];

const DISPATCH_FORBIDDEN_URL_FRAGMENTS = [
  "api.github.com",
  "supabase.co",
  "resend.com",
  "vercel",
  "netlify",
  "railway",
  "render",
  "fly.io"
];

const DISPATCH_SECRET_KEY_NAMES = new Set([
  "apiKey",
  "api_key",
  "authToken",
  "auth_token",
  "accessToken",
  "access_token",
  "secretKey",
  "secret_key",
  "password",
  "privateKey",
  "private_key",
  "authorization",
  "authHeader",
  "auth_header"
]);

const EXPECTED_TOP_LEVEL_FIELDS = new Set([
  "schemaVersion",
  "recordType",
  "recordId",
  "runId",
  "generatedAt",
  "source",
  "repo",
  "classification",
  "readiness",
  "blockers",
  "evidence",
  "approvals",
  "audit",
  "scope",
  "safety",
  "scheduler",
  "authority",
  "integrity"
]);

const EXPECTED_DEFS = new Set([
  "classificationEnum",
  "readinessStateEnum",
  "readiness",
  "blockerCodeEnum",
  "blockerObject",
  "recordRepo",
  "gateResult",
  "scanSummary",
  "schedulerModeEnum",
  "evidence",
  "approvals",
  "audit",
  "scope",
  "safety",
  "scheduler",
  "authority",
  "integrity"
]);

function scanForbiddenDispatchFields(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanForbiddenDispatchFields(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_DISPATCH_FIELDS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanForbiddenDispatchFields(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanDispatchFixtureSecrets(rawContent, filename) {
  const findings = [];

  for (const fragment of DISPATCH_SECRET_FRAGMENTS) {
    if (rawContent.includes(fragment)) {
      findings.push("secret fragment: " + fragment);
    }
  }

  for (const fragment of DISPATCH_FORBIDDEN_PATH_FRAGMENTS) {
    if (rawContent.includes(fragment)) {
      findings.push("forbidden path fragment: " + fragment);
    }
  }

  for (const fragment of DISPATCH_FORBIDDEN_URL_FRAGMENTS) {
    if (rawContent.includes(fragment)) {
      findings.push("forbidden URL fragment: " + fragment);
    }
  }

  // Check for prod/production URLs
  if (/https?:\/\/[^"\s]*(prod|production)[^"\s]*/i.test(rawContent)) {
    findings.push("production URL detected");
  }

  return findings;
}

function scanDispatchFixtureSecretKeys(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanDispatchFixtureSecretKeys(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (DISPATCH_SECRET_KEY_NAMES.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanDispatchFixtureSecretKeys(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function checkPositiveConsts(fixture) {
  const failures = [];

  // Top-level required
  if (fixture.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (fixture.recordType !== "dispatchReadiness") failures.push("recordType must be dispatchReadiness");

  // Readiness safety
  const r = fixture.readiness || {};
  if (r.advisoryOnly !== true) failures.push("readiness.advisoryOnly must be true");
  if (r.executesDispatch !== false) failures.push("readiness.executesDispatch must be false");
  if (r.authorizesExecution !== false) failures.push("readiness.authorizesExecution must be false");
  if (r.productionCertification !== false) failures.push("readiness.productionCertification must be false");

  // Scheduler
  const sch = fixture.scheduler || {};
  if (sch.autoDispatchAllowed !== false) failures.push("scheduler.autoDispatchAllowed must be false");
  if (sch.localOnly !== true) failures.push("scheduler.localOnly must be true");

  // Safety
  const s = fixture.safety || {};
  if (s.githubMutationAllowed !== false) failures.push("safety.githubMutationAllowed must be false");
  if (s.deployAllowed !== false) failures.push("safety.deployAllowed must be false");
  if (s.externalMutationAllowed !== false) failures.push("safety.externalMutationAllowed must be false");
  if (s.secretsAllowed !== false) failures.push("safety.secretsAllowed must be false");
  if (s.productionCertificationAllowed !== false) failures.push("safety.productionCertificationAllowed must be false");

  // Authority
  const a = fixture.authority || {};
  if (a.ownerFinalAuthority !== true) failures.push("authority.ownerFinalAuthority must be true");
  if (a.agentBridgeMayApprove !== false) failures.push("authority.agentBridgeMayApprove must be false");
  if (a.agentBridgeMayMerge !== false) failures.push("authority.agentBridgeMayMerge must be false");
  if (a.agentBridgeMayDeploy !== false) failures.push("authority.agentBridgeMayDeploy must be false");
  if (a.agentBridgeMayDispatch !== false) failures.push("authority.agentBridgeMayDispatch must be false");
  if (a.agentBridgeMayCertify !== false) failures.push("authority.agentBridgeMayCertify must be false");

  // Audit
  const aud = fixture.audit || {};
  if (aud.codexRequiredBeforeExecution !== true) failures.push("audit.codexRequiredBeforeExecution must be true");

  // Enums
  if (!READINESS_STATES.has(r.state)) failures.push("readiness.state '" + r.state + "' not in readinessStateEnum");
  if (!CLASSIFICATIONS.has(fixture.classification)) failures.push("classification '" + fixture.classification + "' not in classificationEnum");

  // Blockers: each code must be a valid blocker code (check non-empty string, schema-enforced)
  const blockers = fixture.blockers || [];
  for (let i = 0; i < blockers.length; i++) {
    if (!blockers[i].code || typeof blockers[i].code !== "string") {
      failures.push("blockers[" + i + "].code must be a non-empty string");
    }
  }

  // Evidence
  const ev = fixture.evidence || {};
  if (!ev.ledgerRecordRef || typeof ev.ledgerRecordRef !== "string") failures.push("evidence.ledgerRecordRef must be a non-empty string");
  if (!ev.handoffRecordRef || typeof ev.handoffRecordRef !== "string") failures.push("evidence.handoffRecordRef must be a non-empty string");
  if (ev.registryValidated !== true) failures.push("evidence.registryValidated must be true");
  if (ev.outputSchemaValidated !== true) failures.push("evidence.outputSchemaValidated must be true");
  if (ev.dryRunTextPassed !== true) failures.push("evidence.dryRunTextPassed must be true");
  if (ev.dryRunJsonParsed !== true) failures.push("evidence.dryRunJsonParsed must be true");
  if (ev.lockCapability !== true) failures.push("evidence.lockCapability must be true");

  return failures;
}

function checkSemanticRules(fixture) {
  const failures = [];
  const classification = fixture.classification;
  const state = (fixture.readiness || {}).state;
  const blockers = fixture.blockers || [];
  const codexStatus = (fixture.audit || {}).codexAuditStatus;

  // AMBER + late-stage state
  if (classification === "AMBER" && LATE_STAGE_READINESS_STATES.has(state)) {
    failures.push("classification AMBER with late-stage readiness state '" + state + "'");
  }

  // RED + non-blocked state
  if (classification === "RED" && (state === "dispatchEligibleForOwnerReview" || LATE_STAGE_READINESS_STATES.has(state))) {
    failures.push("classification RED with non-blocked readiness state '" + state + "'");
  }

  // AMBER_NOT_CODEX_AUDITED + late-stage state
  if (classification === "AMBER_NOT_CODEX_AUDITED" && LATE_STAGE_READINESS_STATES.has(state)) {
    failures.push("classification AMBER_NOT_CODEX_AUDITED with late-stage readiness state '" + state + "'");
  }

  // Non-GREEN classification with empty blockers, passed codex, or late-stage state
  if (classification !== "GREEN") {
    if (blockers.length === 0) {
      failures.push("non-GREEN classification '" + classification + "' with empty blockers");
    }
    if (codexStatus === "passed") {
      failures.push("non-GREEN classification '" + classification + "' with codexAuditStatus passed");
    }
  }

  return failures;
}

function detectNegativeFailure(fixture, filename) {
  const reasons = [];

  switch (filename) {
    case "invalid-missing-advisory-safety-consts.json": {
      const r = fixture.readiness || {};
      if (r.advisoryOnly !== true || r.executesDispatch !== false ||
          r.authorizesExecution !== false || r.productionCertification !== false) {
        reasons.push("const safety failure: advisory/execution/authorization/production violation");
      }
      break;
    }
    case "invalid-agentbridge-authority-claim.json": {
      const a = fixture.authority || {};
      if (a.agentBridgeMayApprove !== false || a.agentBridgeMayMerge !== false ||
          a.agentBridgeMayDeploy !== false || a.agentBridgeMayDispatch !== false ||
          a.agentBridgeMayCertify !== false) {
        reasons.push("AgentBridge authority escalation detected");
      }
      break;
    }
    case "invalid-github-api-mutation-allowed.json": {
      const s = fixture.safety || {};
      if (s.githubMutationAllowed !== false || s.externalMutationAllowed !== false ||
          s.deployAllowed !== false || s.secretsAllowed !== false) {
        reasons.push("mutation/deploy/secrets safety violation");
      }
      break;
    }
    case "invalid-scheduler-auto-dispatch.json": {
      const sch = fixture.scheduler || {};
      if (sch.autoDispatchAllowed !== false) {
        reasons.push("scheduler auto-dispatch allowed");
      }
      break;
    }
    case "invalid-production-ready-claim.json": {
      const r = fixture.readiness || {};
      const s = fixture.safety || {};
      if (r.productionCertification !== false || s.productionCertificationAllowed !== false) {
        reasons.push("production certification claimed");
      }
      break;
    }
    case "invalid-amber-executable.json": {
      const classification = fixture.classification;
      const state = (fixture.readiness || {}).state;
      const blockers = fixture.blockers || [];
      const codexStatus = (fixture.audit || {}).codexAuditStatus;
      if ((classification === "AMBER" || classification === "RED" || classification === "AMBER_NOT_CODEX_AUDITED") &&
          LATE_STAGE_READINESS_STATES.has(state)) {
        reasons.push("AMBER/RED/AMBER_NOT_CODEX_AUDITED classification with late-stage readiness state");
      } else if (classification !== "GREEN" && (blockers.length === 0 || codexStatus === "passed")) {
        reasons.push("non-GREEN classification with empty blockers or passed codex audit");
      }
      break;
    }
    case "invalid-dispatch-execute-named-state.json": {
      const r = fixture.readiness || {};
      if (!READINESS_STATES.has(r.state)) {
        reasons.push("invalid readiness state enum: '" + r.state + "'");
      }
      break;
    }
    case "invalid-missing-ledger-ref.json": {
      const ev = fixture.evidence || {};
      if (!ev.ledgerRecordRef || ev.ledgerRecordRef === "") {
        reasons.push("missing or empty evidence.ledgerRecordRef");
      }
      break;
    }
    case "invalid-forbidden-field-name.json": {
      const forbiddenFindings = [];
      scanForbiddenDispatchFields(fixture, "$", forbiddenFindings);
      if (forbiddenFindings.length > 0) {
        reasons.push("forbidden field(s) found: " + forbiddenFindings.join(", "));
      }
      break;
    }
    default:
      reasons.push("unknown negative fixture, no expected failure route configured");
      break;
  }

  return reasons;
}

function validateDispatchReadinessPhase1F() {
  let exitCode = 0;
  const results = [];
  let positivePassed = 0;
  let positiveFailed = 0;
  let negativeInvalid = 0;
  let negativeUnexpectedPass = 0;
  let forbiddenFieldPass = true;
  let securityPass = true;
  let semanticPass = true;

  // ── Schema load checks ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, DISPATCH_READINESS_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Schema load failed: " + e.message);
    process.exit(2);
  }

  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    console.error("Schema $schema must be https://json-schema.org/draft/2020-12/schema");
    process.exit(2);
  }
  if (schema.$id !== "https://pnpd-os.local/schemas/dispatch-readiness.schema.json") {
    console.error("Schema $id must be https://pnpd-os.local/schemas/dispatch-readiness.schema.json");
    process.exit(2);
  }
  if (schema.title !== "PNPD Dispatch Readiness Record") {
    console.error("Schema title must be 'PNPD Dispatch Readiness Record'");
    process.exit(2);
  }
  if (schema.type !== "object") {
    console.error("Schema top-level type must be object");
    process.exit(2);
  }
  if (schema.additionalProperties !== false) {
    console.error("Schema top-level additionalProperties must be false");
    process.exit(2);
  }

  const topRequired = schema.required || [];
  for (const f of EXPECTED_TOP_LEVEL_FIELDS) {
    if (!topRequired.includes(f)) {
      console.error("Schema missing top-level required field: " + f);
      process.exit(2);
    }
  }

  const defs = schema.$defs || {};
  for (const d of EXPECTED_DEFS) {
    if (!defs[d]) {
      console.error("Schema missing $def: " + d);
      process.exit(2);
    }
  }

  // ── Fixture discovery ──
  const fixturesDir = path.join(ROOT, DISPATCH_READINESS_FIXTURES_DIR);
  let fixtureFiles;
  try {
    fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith(".json")).sort();
  } catch (e) {
    console.error("Fixture directory not readable: " + e.message);
    process.exit(2);
  }

  if (fixtureFiles.length !== 12) {
    console.error("Expected exactly 12 fixture files, found: " + fixtureFiles.length);
    process.exit(1);
  }

  for (const f of EXPECTED_POSITIVE_FIXTURES) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing positive fixture: " + f);
      process.exit(1);
    }
  }
  for (const f of EXPECTED_NEGATIVE_FIXTURES) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing negative fixture: " + f);
      process.exit(1);
    }
  }

  // ── Process each fixture ──
  console.log("PNPD Dispatch Readiness Validation");
  console.log("Schema: " + DISPATCH_READINESS_SCHEMA_PATH);
  console.log("Fixtures: " + DISPATCH_READINESS_FIXTURES_DIR);

  for (const filename of fixtureFiles) {
    const filePath = path.join(fixturesDir, filename);
    let rawContent;
    let fixture;

    try {
      rawContent = fs.readFileSync(filePath, "utf8");
      fixture = JSON.parse(rawContent);
    } catch (e) {
      console.log("[FAIL] " + filename + " — JSON parse error: " + e.message);
      if (filename.startsWith("valid-")) {
        positiveFailed++;
      }
      exitCode = 1;
      continue;
    }

    // ── Security scan (hard fail for all) ──
    const secretFindings = scanDispatchFixtureSecrets(rawContent, filename);
    const secretKeyFindings = scanDispatchFixtureSecretKeys(fixture, "$", []);
    if (secretFindings.length > 0 || secretKeyFindings.length > 0) {
      const allSecrets = [...secretFindings, ...secretKeyFindings.map(k => "secret-like key: " + k)];
      console.log("[FAIL] " + filename + " — SECURITY VIOLATION: " + allSecrets.join("; "));
      securityPass = false;
      exitCode = 1;
      continue;
    }

    if (filename.startsWith("valid-")) {
      // ── Positive fixture validation ──
      const constFails = checkPositiveConsts(fixture);
      const semanticFails = checkSemanticRules(fixture);
      const forbiddenFields = [];
      scanForbiddenDispatchFields(fixture, "$", forbiddenFields);

      const allFailures = [];
      if (constFails.length > 0) allFailures.push(...constFails.map(f => "const: " + f));
      if (semanticFails.length > 0) allFailures.push(...semanticFails.map(f => "semantic: " + f));
      if (forbiddenFields.length > 0) allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));

      if (allFailures.length > 0) {
        console.log("[FAIL] " + filename + " — " + allFailures.join("; "));
        positiveFailed++;
        if (semanticFails.length > 0) semanticPass = false;
        if (forbiddenFields.length > 0) forbiddenFieldPass = false;
        exitCode = 1;
      } else {
        console.log("[PASS] " + filename + " — valid fixture accepted");
        positivePassed++;
      }
    } else if (filename.startsWith("invalid-")) {
      // ── Negative fixture validation ──
      const expectedReasons = detectNegativeFailure(fixture, filename);

      if (expectedReasons.length > 0) {
        console.log("[INVALID-as-expected] " + filename + " — " + expectedReasons.join("; "));
        negativeInvalid++;
      } else {
        // Also check if the fixture accidentally passes all const checks
        const constFails = checkPositiveConsts(fixture);
        if (constFails.length === 0) {
          console.log("[FAIL] " + filename + " — expected INVALID but passed all structural checks");
          negativeUnexpectedPass++;
          exitCode = 1;
        } else {
          // It fails structurally but not through the expected route
          console.log("[INVALID-as-expected] " + filename + " — structural failure: " + constFails.join("; "));
          negativeInvalid++;
        }
      }

      // Run forbidden field scan on negatives too (except the one that's supposed to have them)
      if (filename !== "invalid-forbidden-field-name.json") {
        const forbiddenFields = [];
        scanForbiddenDispatchFields(fixture, "$", forbiddenFields);
        if (forbiddenFields.length > 0) {
          console.log("[FAIL] " + filename + " — unexpected forbidden field(s): " + forbiddenFields.join(", "));
          forbiddenFieldPass = false;
          exitCode = 1;
        }
      }
    }
  }

  // ── Summary ──
  console.log("");
  console.log("Positive fixtures: " + positivePassed + " passed, " + positiveFailed + " failed");
  console.log("Negative fixtures: " + negativeInvalid + " invalid as expected, " + negativeUnexpectedPass + " unexpectedly passed");
  console.log("Forbidden-field scan: " + (forbiddenFieldPass ? "pass" : "fail"));
  console.log("Fake-data/security scan: " + (securityPass ? "pass" : "fail"));
  console.log("Semantic checks: " + (semanticPass ? "pass" : "fail"));

  process.exit(exitCode);
}

// ── Main ────────────────────────────────────────────────────────────────────────

try {
  const args = parseArgs(process.argv);
  const runPhase1f = args.phase === "1f";

  if (runPhase1f) {
    validateDispatchReadinessPhase1F();
  }

  const runPhase0 = args.phase === null || args.phase === "0" || args.phase === "1b" || args.phase === "1c";
  const runPhase1b = args.phase === null || args.phase === "1b" || args.phase === "1c";
  const runPhase1c = args.phase === null || args.phase === "1c";

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

  if (runPhase1c) {
    validateOrchestratorSchemaPhase1C(readJson(".pnpd/orchestrator.schema.json"));
  }

  console.log("pnpd schema validation ok");
} catch (error) {
  console.error(`pnpd schema validation failed: ${error.message}`);
  process.exit(1);
}
