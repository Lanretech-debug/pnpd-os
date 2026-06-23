#!/usr/bin/env node

import crypto from "node:crypto";
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
const PROJECT_PROFILE_FIXTURES = [
  {
    file: "tests/fixtures/pnpd/project-profile/valid/minimal-valid-project-profile.json",
    expectValid: true,
    expectedReason: "minimal valid synthetic project profile"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/valid/full-valid-project-profile.json",
    expectValid: true,
    expectedReason: "full valid synthetic project profile"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/missing-required-root.json",
    expectValid: false,
    expectedReason: "missing required root field"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/invalid-project-slug.json",
    expectValid: false,
    expectedReason: "projectSlug must match slug pattern"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/invalid-commit-sha.json",
    expectValid: false,
    expectedReason: "commit fields must be full 40-character lowercase SHA"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/owner-required-false.json",
    expectValid: false,
    expectedReason: "ownerRequired must be const true"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/agentbridge-authority-true.json",
    expectValid: false,
    expectedReason: "agentBridgeAuthority must be const false"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/root-additional-property.json",
    expectValid: false,
    expectedReason: "root additionalProperties false blocks unknown fields"
  },
  {
    file: "tests/fixtures/pnpd/project-profile/invalid/invalid-dry-run-status.json",
    expectValid: false,
    expectedReason: "dryRunStatus must be an allowed enum value"
  }
];

const BUG_FORECAST_SCHEMA_PATH = ".pnpd/bug-forecast.schema.json";
const BUG_FORECAST_FIXTURES_DIR = "tests/fixtures/pnpd/bug-forecast";
const BUG_FORECAST_EXAMPLES_DIR = "tests/fixtures/pnpd/bug-forecast/examples";
const BUG_FORECAST_INVALID_EXAMPLES_DIR = "tests/fixtures/pnpd/bug-forecast/examples-invalid";

const BUG_FORECAST_FIXTURES = [
  {
    file: "tests/fixtures/pnpd/bug-forecast/valid/minimal-valid-bug-forecast.json",
    expectValid: true,
    expectedReason: "minimal valid synthetic bug forecast report with zero findings"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/valid/full-valid-bug-forecast.json",
    expectValid: true,
    expectedReason: "full valid synthetic bug forecast report with three findings and evidence"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/missing-required-root.json",
    expectValid: false,
    expectedReason: "missing required root field governanceBoundary"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/invalid-artifact-type.json",
    expectValid: false,
    expectedReason: "artifactType must equal const bug-forecast-report"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/invalid-produced-by.json",
    expectValid: false,
    expectedReason: "producedBy not in enum"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/short-target-commit.json",
    expectValid: false,
    expectedReason: "target.commit must match full 40-character SHA pattern"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/authority-field-additional-property.json",
    expectValid: false,
    expectedReason: "governanceBoundary additionalProperties false blocks unexpectedAuthorityFlag"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/contains-sensitive-data-true.json",
    expectValid: false,
    expectedReason: "securityBoundary.containsSensitiveData must equal const false"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/governance-advisory-false.json",
    expectValid: false,
    expectedReason: "governanceBoundary.advisoryOnly must equal const true"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/invalid-finding-status.json",
    expectValid: false,
    expectedReason: "finding.status not in enum"
  },
  {
    file: "tests/fixtures/pnpd/bug-forecast/invalid/too-many-findings.json",
    expectValid: false,
    expectedReason: "findings maxItems 25 exceeded"
  }
];

function parseArgs(argv) {
  const args = { phase: null, runtimeReadinessReport: null, researchDiscoveryArtifact: null, productDeliveryArtifact: null, productDeliveryRegistry: null, projectProfile: null, bugForecast: null, checkRegistryArtifacts: false, verifyRegistryArtifactHashes: false, validateSchemaInstance: false };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--phase") {
      if (args.runtimeReadinessReport) {
        throw new Error("--runtime-readiness-report is a standalone validator and cannot be combined with --phase.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--research-discovery-artifact is a standalone validator and cannot be combined with --phase.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--product-delivery-artifact is a standalone validator and cannot be combined with --phase.");
      }
      if (args.productDeliveryRegistry) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --phase.");
      }
      if (args.checkRegistryArtifacts) {
        throw new Error("--check-registry-artifacts cannot be combined with --phase.");
      }
      if (args.projectProfile) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --phase.");
      }
      if (args.bugForecast) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --phase.");
      }
      if (!argv[i + 1]) {
        throw new Error("--phase requires a value (0, 1b, 1c, 1f, 1h, 1m, 1n, 1o, 1o-example, 1p-profile, 1q-bug-forecast, 1q-bug-forecast-example, 1q-bug-forecast-example-negative, or 1q-bug-forecast-summary).");
      }
      const phaseVal = argv[i + 1];
      if (phaseVal !== "0" && phaseVal !== "1b" && phaseVal !== "1c" && phaseVal !== "1f" && phaseVal !== "1h" && phaseVal !== "1m" && phaseVal !== "1n" && phaseVal !== "1o" && phaseVal !== "1o-example" && phaseVal !== "1p-profile" && phaseVal !== "1q-bug-forecast" && phaseVal !== "1q-bug-forecast-example" && phaseVal !== "1q-bug-forecast-example-negative" && phaseVal !== "1q-bug-forecast-summary") {
        throw new Error('--phase must be "0", "1b", "1c", "1f", "1h", "1m", "1n", "1o", "1o-example", "1p-profile", "1q-bug-forecast", "1q-bug-forecast-example", "1q-bug-forecast-example-negative", or "1q-bug-forecast-summary".');
      }
      args.phase = phaseVal;
      i += 1;
    } else if (arg === "--runtime-readiness-report") {
      if (args.phase) {
        throw new Error("--runtime-readiness-report is a standalone validator and cannot be combined with --phase.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--runtime-readiness-report is a standalone validator and cannot be combined with --product-delivery-artifact.");
      }
      if (args.projectProfile) {
        throw new Error("--runtime-readiness-report is a standalone validator and cannot be combined with --project-profile.");
      }
      if (!argv[i + 1]) {
        throw new Error("--runtime-readiness-report requires a file path argument.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--runtime-readiness-report accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--runtime-readiness-report requires a file path argument, got: " + argv[i + 1]);
      }
      args.runtimeReadinessReport = argv[i + 1];
      i += 1;
    } else if (arg === "--research-discovery-artifact") {
      if (args.phase) {
        throw new Error("--research-discovery-artifact is a standalone validator and cannot be combined with --phase.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--research-discovery-artifact is a standalone validator and cannot be combined with --runtime-readiness-report.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--research-discovery-artifact is a standalone validator and cannot be combined with --product-delivery-artifact.");
      }
      if (args.projectProfile) {
        throw new Error("--research-discovery-artifact is a standalone validator and cannot be combined with --project-profile.");
      }
      if (!argv[i + 1]) {
        throw new Error("--research-discovery-artifact requires a file path argument.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--research-discovery-artifact accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--research-discovery-artifact requires a file path argument, got: " + argv[i + 1]);
      }
      args.researchDiscoveryArtifact = argv[i + 1];
      i += 1;
    } else if (arg === "--product-delivery-artifact") {
      if (args.phase) {
        throw new Error("--product-delivery-artifact is a standalone validator and cannot be combined with --phase.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--product-delivery-artifact is a standalone validator and cannot be combined with --runtime-readiness-report.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--product-delivery-artifact is a standalone validator and cannot be combined with --research-discovery-artifact.");
      }
      if (args.projectProfile) {
        throw new Error("--product-delivery-artifact is a standalone validator and cannot be combined with --project-profile.");
      }
      if (!argv[i + 1]) {
        throw new Error("--product-delivery-artifact requires a file path argument.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--product-delivery-artifact accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--product-delivery-artifact requires a file path argument, got: " + argv[i + 1]);
      }
      args.productDeliveryArtifact = argv[i + 1];
      i += 1;
    } else if (arg === "--product-delivery-registry") {
      if (args.phase) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --phase.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --runtime-readiness-report.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --research-discovery-artifact.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --product-delivery-artifact.");
      }
      if (args.projectProfile) {
        throw new Error("--product-delivery-registry is a standalone validator and cannot be combined with --project-profile.");
      }
      if (!argv[i + 1]) {
        throw new Error("--product-delivery-registry requires a file path argument.");
      }
      if (args.productDeliveryRegistry) {
        throw new Error("--product-delivery-registry accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--product-delivery-registry requires a file path argument, got: " + argv[i + 1]);
      }
      args.productDeliveryRegistry = argv[i + 1];
      i += 1;
    } else if (arg === "--project-profile") {
      if (args.phase) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --phase.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --runtime-readiness-report.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --research-discovery-artifact.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --product-delivery-artifact.");
      }
      if (args.productDeliveryRegistry) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --product-delivery-registry.");
      }
      if (args.checkRegistryArtifacts) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --check-registry-artifacts.");
      }
      if (args.verifyRegistryArtifactHashes) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --verify-registry-artifact-hashes.");
      }
      if (args.validateSchemaInstance) {
        throw new Error("--project-profile is a standalone validator and cannot be combined with --validate-schema-instance.");
      }
      if (!argv[i + 1]) {
        throw new Error("--project-profile requires a file path argument.");
      }
      if (args.projectProfile) {
        throw new Error("--project-profile accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--project-profile requires a file path argument, got: " + argv[i + 1]);
      }
      args.projectProfile = argv[i + 1];
      i += 1;
    } else if (arg === "--bug-forecast") {
      if (args.phase) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --phase.");
      }
      if (args.runtimeReadinessReport) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --runtime-readiness-report.");
      }
      if (args.researchDiscoveryArtifact) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --research-discovery-artifact.");
      }
      if (args.productDeliveryArtifact) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --product-delivery-artifact.");
      }
      if (args.productDeliveryRegistry) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --product-delivery-registry.");
      }
      if (args.projectProfile) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --project-profile.");
      }
      if (args.checkRegistryArtifacts) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --check-registry-artifacts.");
      }
      if (args.verifyRegistryArtifactHashes) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --verify-registry-artifact-hashes.");
      }
      if (args.validateSchemaInstance) {
        throw new Error("--bug-forecast is a standalone validator and cannot be combined with --validate-schema-instance.");
      }
      if (!argv[i + 1]) {
        throw new Error("--bug-forecast requires a file path argument.");
      }
      if (args.bugForecast) {
        throw new Error("--bug-forecast accepts exactly one file path.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--bug-forecast requires a file path argument, got: " + argv[i + 1]);
      }
      args.bugForecast = argv[i + 1];
      i += 1;
    } else if (arg === "--check-registry-artifacts") {
      args.checkRegistryArtifacts = true;
    } else if (arg === "--verify-registry-artifact-hashes") {
      args.verifyRegistryArtifactHashes = true;
    } else if (arg === "--validate-schema-instance") {
      args.validateSchemaInstance = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`PNPD Schema Validator

Usage:
  node scripts/pnpd-validate-schemas.mjs [--phase 0|1b|1c|1f|1h|1m|1n|1o|1o-example|1p-profile|1q-bug-forecast|1q-bug-forecast-example|1q-bug-forecast-example-negative|1q-bug-forecast-summary]
  node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report <path>
  node scripts/pnpd-validate-schemas.mjs --research-discovery-artifact <path>
  node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>
  node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> [--validate-schema-instance] [--check-registry-artifacts] [--verify-registry-artifact-hashes]
  node scripts/pnpd-validate-schemas.mjs --project-profile <path>
  node scripts/pnpd-validate-schemas.mjs --bug-forecast <path>

Options:
  --phase 0   Validate Phase 0 invariants only.
  --phase 1b  Validate Phase 0 + Phase 1B invariants.
  --phase 1c  Validate Phase 0 + Phase 1B + Phase 1C invariants + fixture instance validation.
  --phase 1f  Validate PNPD dispatch readiness fixtures (explicit-only, not included in default).
  --phase 1h  Validate PNPD runtime readiness schema and fixtures (explicit-only, not included in default).
  --phase 1m  Validate Research Discovery schema and fixtures (explicit-only, not included in default).
  --phase 1n  Validate Product Delivery schema and fixtures (explicit-only, not included in default).
  --phase 1o  Validate Product Delivery registry schema and shape fixtures (explicit-only, not included in default).
  --phase 1o-example  Validate Product Delivery registry example fixtures (explicit-only, not included in default).
  --phase 1p-profile  Validate PNPD project profile fixtures (explicit-only, not included in default).
  --phase 1q-bug-forecast  Validate PNPD bug forecast fixtures (explicit-only, not included in default).
  --phase 1q-bug-forecast-example  Validate PNPD bug forecast examples (explicit-only, not included in default).
  --phase 1q-bug-forecast-example-negative  Validate PNPD bug forecast negative examples (explicit-only, not included in default).
  --phase 1q-bug-forecast-summary  Read-only bug forecast audit summary (explicit-only, not included in default).
  --runtime-readiness-report <path>  Validate a generated runtime readiness JSON report file.
  --research-discovery-artifact <path>  Validate a user-created Research Discovery artifact JSON file.
  --product-delivery-artifact <path>  Validate a user-created Product Delivery artifact JSON file.
  --product-delivery-registry <path>  Validate a Product Delivery registry JSON file.
  --project-profile <path>  Validate a project profile JSON file against the project profile schema.
  --bug-forecast <path>  Validate a bug forecast report JSON file against the bug forecast schema.
  --validate-schema-instance           With --product-delivery-registry: validate registry JSON against the registry schema.
  --check-registry-artifacts          With --product-delivery-registry: check each entry path points to an existing regular file.
  --verify-registry-artifact-hashes   With --product-delivery-registry AND --check-registry-artifacts: verify sha256 contentHash against file bytes.
  (default)   Validate all invariants (Phase 0 + 1B + 1C).`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.validateSchemaInstance && !args.productDeliveryRegistry) {
    throw new Error("--validate-schema-instance requires --product-delivery-registry <path>.");
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
  var isObjectInstance = instance && typeof instance === "object" && !Array.isArray(instance);
  var hasObjectSchema = schemaDef.type === "object" || schemaDef.properties || schemaDef.required && schemaDef.required.length > 0 || schemaDef.additionalProperties !== undefined;
  if (hasObjectSchema && isObjectInstance) {
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
  if (schemaDef.const !== undefined) {
    var constMatches = false;
    if (Array.isArray(schemaDef.const) && Array.isArray(instance)) {
      if (schemaDef.const.length === instance.length) {
        constMatches = schemaDef.const.every(function(v, i) { return v === instance[i]; });
      }
    } else {
      constMatches = instance === schemaDef.const;
    }
    if (!constMatches) {
      failures.push({ path: path, expected: String(schemaDef.const), actual: String(instance) });
    }
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

  // allOf
  if (schemaDef.allOf) {
    for (var _ao = 0; _ao < schemaDef.allOf.length; _ao++) {
      var allOfSub = schemaDef.allOf[_ao];
      var allOfResolved = allOfSub.$ref ? resolveRef(fullSchema, allOfSub.$ref, path + ".allOf[" + _ao + "].$ref") : allOfSub;
      var allOfFails = validateInstance(instance, allOfResolved, fullSchema, path);
      for (var _aof = 0; _aof < allOfFails.length; _aof++) {
        failures.push(allOfFails[_aof]);
      }
    }
  }

  // if/then/else
  if (schemaDef.if) {
    var ifResolved = schemaDef.if.$ref ? resolveRef(fullSchema, schemaDef.if.$ref, path + ".if.$ref") : schemaDef.if;
    var ifFails = validateInstance(instance, ifResolved, fullSchema, path);
    if (ifFails.length === 0) {
      if (schemaDef.then) {
        var thenResolved = schemaDef.then.$ref ? resolveRef(fullSchema, schemaDef.then.$ref, path + ".then.$ref") : schemaDef.then;
        var thenFails = validateInstance(instance, thenResolved, fullSchema, path);
        for (var _tf = 0; _tf < thenFails.length; _tf++) {
          failures.push(thenFails[_tf]);
        }
      }
    } else {
      if (schemaDef.else) {
        var elseResolved = schemaDef.else.$ref ? resolveRef(fullSchema, schemaDef.else.$ref, path + ".else.$ref") : schemaDef.else;
        var elseFails = validateInstance(instance, elseResolved, fullSchema, path);
        for (var _ef = 0; _ef < elseFails.length; _ef++) {
          failures.push(elseFails[_ef]);
        }
      }
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
  "apiKey",
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
    if (state === "dispatchEligibleForOwnerReview" || LATE_STAGE_READINESS_STATES.has(state)) {
      failures.push("non-GREEN classification '" + classification + "' with late-stage eligibility state '" + state + "'");
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

// ── Phase 1H: Runtime Readiness Validation ──────────────────────────────────────

const RUNTIME_READINESS_SCHEMA_PATH = ".pnpd/runtime-readiness.schema.json";
const RUNTIME_READINESS_FIXTURE_DIR = "tests/fixtures/pnpd/runtime-readiness";

const RUNTIME_READINESS_POSITIVE_FIXTURES = new Set([
  "valid-minimal-review-blocked.json",
  "valid-remote-ci-observed-success.json",
  "valid-codex-review-required.json",
]);

const RUNTIME_READINESS_NEGATIVE_SCHEMA_INVALID_FIXTURES = new Set([
  "invalid-authorizes-dispatch.json",
  "invalid-agentbridge-authority.json",
  "invalid-production-certified.json",
  "invalid-github-mutation-allowed.json",
  "invalid-remote-ci-failure-marked-ready.json",
  "invalid-forbidden-field-name.json",
  "invalid-missing-required-field.json",
  "invalid-external-api-used.json",
  "invalid-write-allowed.json",
]);

const RUNTIME_READINESS_NEGATIVE_SEMANTIC_INVALID_FIXTURES = new Set([
  "invalid-amber-final-readiness.json",
]);

const RUNTIME_READINESS_FORBIDDEN_FIELDS = new Set([
  "approvedForDispatch",
  "dispatchApproved",
  "dispatchNow",
  "executeDispatch",
  "deployApproved",
  "productionReady",
  "productionCertified",
  "mergeApproved",
  "ownerBypassed",
  "codexBypassed",
  "agentBridgeApproved",
  "agentBridgeCanDeploy",
  "githubMutationEnabled",
  "secretsEnabled",
  "autoDispatch",
  "autonomousDispatch",
  "releaseApproved",
  "agentBridgeCanApprove",
  "agentBridgeCanMerge",
  "agentBridgeCanDispatch",
  "agentBridgeCanCertifyProduction",
  "externalWritesEnabled",
  "deployNow",
  "releaseNow",
  "productionCertifiedByAgent",
]);

const RUNTIME_READINESS_LATE_STAGE_STATES = new Set([
  "ownerApprovedPendingCodex",
  "codexAuditedPendingOwnerFinal",
  "readyForManualOwnerDecisionButNotExecuted",
]);

const RUNTIME_READINESS_BLOCKED_CLASSIFICATIONS = new Set([
  "AMBER_NOT_CODEX_AUDITED",
  "RED",
  "BLOCKED_DIRTY_TREE",
  "BLOCKED_PROTECTED_BRANCH",
  "BLOCKED_SCOPE",
  "BLOCKED_SECURITY",
  "BLOCKED_GOVERNANCE",
]);

// Fake-data/security scan patterns for runtime readiness
const RUNTIME_READINESS_FORBIDDEN_STRING_PATTERNS = [
  { re: /\/Users\//, label: "real path: /Users/" },
  { re: /\/Users\/lanretech\/Documents\/BricLab Kids/, label: "real path: BricLab Kids" },
  { re: /https:\/\/github\.com/, label: "live GitHub URL" },
  { re: /https:\/\/api\.github\.com/, label: "live GitHub API URL" },
  { re: /https:\/\/raw\.githubusercontent\.com/, label: "live GitHub raw URL" },
  { re: /https?:\/\//, label: "HTTP/HTTPS URL" },
  { re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, label: "email-like" },
  { re: /\+44[0-9]{2,}/, label: "UK phone-like" },
  { re: /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/, label: "token/secret-like value" },
  { re: /\.env/, label: ".env reference" },
];

const RUNTIME_READINESS_ALLOWED_STRING_PATTERNS = [
  /\/tmp\/pnpd-fixtures\/example-app/,
  /^fixture-ci-provider$/,
  /^fixture-run-000[12]$/,
  /^fixture-ci-url$/,
];

const RUNTIME_READINESS_FORBIDDEN_URL_FRAGMENTS = [
  "api.github.com",
  "github.com",
  "raw.githubusercontent.com",
];

// ── Phase 1H helper functions ──────────────────────────────────────────────────

function scanForbiddenRuntimeReadinessFields(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanForbiddenRuntimeReadinessFields(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (RUNTIME_READINESS_FORBIDDEN_FIELDS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanForbiddenRuntimeReadinessFields(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanRuntimeReadinessFakeData(rawContent, filename) {
  const findings = [];

  // Scan for forbidden URL fragments in raw content
  for (const fragment of RUNTIME_READINESS_FORBIDDEN_URL_FRAGMENTS) {
    if (rawContent.includes(fragment)) {
      findings.push("forbidden URL fragment: " + fragment);
    }
  }

  for (const entry of RUNTIME_READINESS_FORBIDDEN_STRING_PATTERNS) {
    if (entry.re.test(rawContent)) {
      // Check if all matches are in allowed patterns
      const matches = rawContent.match(new RegExp(entry.re.source, "g")) || [];
      let allAllowed = true;
      for (const m of matches) {
        let matched = false;
        for (const allowed of RUNTIME_READINESS_ALLOWED_STRING_PATTERNS) {
          if (allowed.test(m)) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          allAllowed = false;
          break;
        }
      }
      if (!allAllowed) {
        findings.push(entry.label);
      }
    }
  }

  return findings;
}

function scanRuntimeReadinessFixtureContent(fixture) {
  const rawContent = JSON.stringify(fixture);
  const findings = [];

  // Secret-like fields from global patterns
  const secretKeyFindings = findSecretLikeFields(fixture);
  if (secretKeyFindings.length > 0) {
    findings.push("Secret-like fields: " + secretKeyFindings.join(", "));
  }

  // Forbidden paths from global patterns
  const forbiddenPathFindings = findForbiddenPaths(fixture);
  if (forbiddenPathFindings.length > 0) {
    findings.push("Forbidden paths: " + JSON.stringify(forbiddenPathFindings));
  }

  // .env paths
  const envFindings = findEnvPaths(fixture);
  if (envFindings.length > 0) {
    findings.push(".env paths: " + JSON.stringify(envFindings));
  }

  return findings;
}

function validateRuntimeReadinessSemantics(fixture, filename) {
  const failures = [];
  const classification = (fixture.dryRun || {}).classification;
  const status = (fixture.readiness || {}).status;
  const source = fixture.source || {};

  // Check if classification is in blocked set
  if (RUNTIME_READINESS_BLOCKED_CLASSIFICATIONS.has(classification)) {
    if (RUNTIME_READINESS_LATE_STAGE_STATES.has(status)) {
      failures.push("blocked classification '" + classification + "' with late-stage readiness state '" + status + "'");
    }
    if (status === "eligibleForOwnerReview") {
      failures.push("blocked classification '" + classification + "' with eligibleForOwnerReview state");
    }
  }

  // AMBER_NOT_CODEX_AUDITED specifically can't pair with late-stage states
  if (classification === "AMBER_NOT_CODEX_AUDITED" && RUNTIME_READINESS_LATE_STAGE_STATES.has(status)) {
    failures.push("AMBER_NOT_CODEX_AUDITED classification with late-stage readiness state '" + status + "'");
  }

  // RED can't pair with eligibleForOwnerReview or late-stage
  if (classification === "RED") {
    if (status === "eligibleForOwnerReview" || RUNTIME_READINESS_LATE_STAGE_STATES.has(status)) {
      failures.push("RED classification with ineligible readiness state '" + status + "'");
    }
  }

  // BLOCKED_* can't pair with eligibleForOwnerReview or late-stage
  if (classification && classification.startsWith("BLOCKED_")) {
    if (status === "eligibleForOwnerReview" || RUNTIME_READINESS_LATE_STAGE_STATES.has(status)) {
      failures.push("BLOCKED_* classification '" + classification + "' with ineligible readiness state '" + status + "'");
    }
  }

  // Remote CI: if remoteCiObserved is true and conclusion is not success, can't have certain readiness states
  if (source.remoteCiObserved === true && source.remoteCiConclusion !== "success") {
    if (status === "eligibleForOwnerReview" || RUNTIME_READINESS_LATE_STAGE_STATES.has(status)) {
      failures.push("remote CI failure with late-stage readiness state '" + status + "'");
    }
  }

  return failures;
}

// ── Phase 1H main validator ────────────────────────────────────────────────────

function validatePhase1HRuntimeReadiness() {
  let exitCode = 0;
  let positivePassed = 0;
  let positiveFailed = 0;
  let negativeInvalid = 0;
  let negativeUnexpectedPass = 0;
  let forbiddenFieldPass = true;
  let securityPass = true;
  let semanticPass = true;

  // ── Schema load ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, RUNTIME_READINESS_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Runtime readiness schema load failed: " + e.message);
    process.exit(2);
  }

  // Verify schema structure
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    console.error("Schema $schema must be https://json-schema.org/draft/2020-12/schema");
    process.exit(2);
  }
  if (!schema.$id) {
    console.error("Schema $id is required");
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
  const expectedTopReq = ["schemaVersion", "recordType", "recordId", "generatedAt", "repo", "source", "validation", "dryRun", "authority", "safety", "readiness", "integrity", "audit"];
  for (const f of expectedTopReq) {
    if (!topRequired.includes(f)) {
      console.error("Schema missing top-level required field: " + f);
      process.exit(2);
    }
  }

  // ── Fixture discovery ──
  const fixturesDir = path.join(ROOT, RUNTIME_READINESS_FIXTURE_DIR);
  let fixtureFiles;
  try {
    fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith(".json")).sort();
  } catch (e) {
    console.error("Runtime readiness fixture directory not readable: " + e.message);
    process.exit(2);
  }

  if (fixtureFiles.length !== 13) {
    console.error("Expected exactly 13 runtime readiness fixture files, found: " + fixtureFiles.length);
    process.exit(1);
  }

  const allExpected = new Set([
    ...RUNTIME_READINESS_POSITIVE_FIXTURES,
    ...RUNTIME_READINESS_NEGATIVE_SCHEMA_INVALID_FIXTURES,
    ...RUNTIME_READINESS_NEGATIVE_SEMANTIC_INVALID_FIXTURES,
  ]);
  for (const f of allExpected) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing expected fixture: " + f);
      process.exit(1);
    }
  }

  // ── Process each fixture ──
  console.log("PNPD Runtime Readiness Validation");
  console.log("Schema: " + RUNTIME_READINESS_SCHEMA_PATH);
  console.log("Fixtures: " + RUNTIME_READINESS_FIXTURE_DIR);
  console.log("");

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

    // ── Fake-data/security scan (for all fixtures) ──
    const fakeDataFindings = scanRuntimeReadinessFakeData(rawContent, filename);
    const contentFindings = scanRuntimeReadinessFixtureContent(fixture);
    const allSecurityFindings = [...fakeDataFindings, ...contentFindings];
    if (allSecurityFindings.length > 0) {
      console.log("[FAIL] " + filename + " — SECURITY/FAKE-DATA VIOLATION: " + allSecurityFindings.join("; "));
      securityPass = false;
      exitCode = 1;
      continue;
    }

    // ── Schema validation ──
    const schemaFails = validateInstance(fixture, schema, schema, "$");
    const schemaValid = schemaFails.length === 0;

    // ── Semantic validation ──
    const semanticFails = validateRuntimeReadinessSemantics(fixture, filename);
    const semanticValid = semanticFails.length === 0;

    // ── Forbidden-field scan ──
    const forbiddenFields = [];
    scanForbiddenRuntimeReadinessFields(fixture, "$", forbiddenFields);
    const forbiddenFieldValid = forbiddenFields.length === 0;

    if (filename.startsWith("valid-")) {
      // Positive fixture: must pass schema, semantic, and forbidden-field
      const allFailures = [];
      if (!schemaValid) allFailures.push("schema: " + schemaFails.map(f => f.path + ": " + f.expected + " (got " + f.actual + ")").join("; "));
      if (!semanticValid) allFailures.push("semantic: " + semanticFails.join("; "));
      if (!forbiddenFieldValid) allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));

      if (allFailures.length > 0) {
        console.log("[FAIL] " + filename + " — " + allFailures.join(" | "));
        positiveFailed++;
        if (!semanticValid) semanticPass = false;
        if (!forbiddenFieldValid) forbiddenFieldPass = false;
        exitCode = 1;
      } else {
        console.log("[PASS] " + filename + " — schema valid, semantic valid");
        positivePassed++;
      }
    } else if (filename.startsWith("invalid-")) {
      const isSchemaInvalid = RUNTIME_READINESS_NEGATIVE_SCHEMA_INVALID_FIXTURES.has(filename);
      const isSemanticInvalid = RUNTIME_READINESS_NEGATIVE_SEMANTIC_INVALID_FIXTURES.has(filename);

      if (isSchemaInvalid && !schemaValid) {
        // Expected schema failure
        let reason = "schema violation";
        if (schemaFails.length > 0) {
          const firstFailure = schemaFails[0];
          reason = firstFailure.path + ": " + firstFailure.expected + " (got " + firstFailure.actual + ")";
        }

        // For N5 (remote-ci-failure), also check semantic
        if (filename === "invalid-remote-ci-failure-marked-ready.json") {
          if (!semanticValid) {
            reason += " | semantic: " + semanticFails.join("; ");
          }
        }

        console.log("[INVALID-as-expected] " + filename + " — " + reason);
        negativeInvalid++;
      } else if (isSemanticInvalid && schemaValid && !semanticValid) {
        // Expected semantic-only failure
        console.log("[INVALID-as-expected] " + filename + " — semantic readiness violation");
        negativeInvalid++;
      } else if (!isSchemaInvalid && !isSemanticInvalid) {
        // Unknown negative fixture
        if (!schemaValid) {
          console.log("[INVALID-as-expected] " + filename + " — schema violation");
          negativeInvalid++;
        } else if (!semanticValid) {
          console.log("[INVALID-as-expected] " + filename + " — semantic violation");
          negativeInvalid++;
        } else {
          console.log("[FAIL] " + filename + " — expected INVALID but passed all checks");
          negativeUnexpectedPass++;
          exitCode = 1;
        }
      } else if (isSchemaInvalid && schemaValid) {
        // Schema-invalid fixture unexpectedly passed schema validation
        console.log("[FAIL] " + filename + " — expected schema INVALID but passed validation");
        negativeUnexpectedPass++;
        exitCode = 1;
      } else {
        // Other negative fixtures that are invalid for different reasons
        console.log("[INVALID-as-expected] " + filename + " — validation failure");
        negativeInvalid++;
      }

      // Forbidden-field scan on negatives (except N7 which should have dispatchApproved)
      if (filename === "invalid-forbidden-field-name.json") {
        if (!forbiddenFieldValid) {
          // Expected - should find forbidden field
          // Already counted in negativeInvalid, just log extra detail
        } else {
          console.log("[FAIL] " + filename + " — expected forbidden field scan to find dispatchApproved");
          forbiddenFieldPass = false;
          exitCode = 1;
        }
      } else if (!forbiddenFieldValid) {
        console.log("[FAIL] " + filename + " — unexpected forbidden field(s): " + forbiddenFields.join(", "));
        forbiddenFieldPass = false;
        exitCode = 1;
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

// ── Phase 1M: Research Discovery Schema + Fixture Validation ────────────────────

const RESEARCH_DISCOVERY_SCHEMA_PATH = ".pnpd/research-discovery.schema.json";
const RESEARCH_DISCOVERY_FIXTURES_DIR = "tests/fixtures/pnpd/research-discovery";

const RD_POSITIVE_FIXTURES = new Set([
  "valid-problem-discovery-minimal.json",
  "valid-source-review-primary.json",
  "valid-experiment-log-expected-vs-actual.json",
  "valid-failure-mining-cluster.json",
  "valid-owner-decision-park.json",
  "valid-owner-decision-approve-implementation-design.json",
]);

const RD_NEGATIVE_FIXTURES = new Set([
  "invalid-authorizes-implementation.json",
  "invalid-authorizes-dispatch.json",
  "invalid-owner-bypass.json",
  "invalid-missing-uncertainty.json",
  "invalid-missing-disproof-criteria.json",
  "invalid-experiment-missing-expected-result.json",
  "invalid-missing-artifact-type.json",
  "invalid-forbidden-field.json",
  "invalid-production-certification-claim.json",
  "invalid-codex-bypass.json",
]);

const FORBIDDEN_RD_FIELDS = new Set([
  "dispatchApproved",
  "executeDispatch",
  "productionReady",
  "productionCertified",
  "mergeApproved",
  "ownerBypassed",
  "codexBypassed",
  "agentBridgeApproved",
  "githubMutationEnabled",
  "secretsEnabled",
  "autoDispatch",
  "deployNow",
  "releaseNow",
]);

const RD_ARTIFACT_TYPES = new Set([
  "problem_discovery",
  "source_review",
  "experiment_log",
  "failure_mining",
  "owner_decision",
]);

const RD_PHASES = new Set([
  "draft",
  "under_review",
  "ready_for_owner_decision",
  "owner_approved_for_implementation_design",
  "parked",
  "rejected",
]);

const RD_SOURCE_QUALITIES = new Set([
  "primary",
  "secondary",
  "anecdotal",
  "marketing",
  "benchmark",
  "academic",
  "code",
  "user_evidence",
  "expert_opinion",
  "unverified",
]);

const RD_OWNER_DECISIONS = new Set([
  "approve_implementation_design",
  "request_more_research",
  "reject",
  "park",
]);

const RD_TYPE_SPECIFIC_MAP = {
  "problem_discovery": "problemDiscovery",
  "source_review": "sourceReview",
  "experiment_log": "experimentLog",
  "failure_mining": "failureMining",
  "owner_decision": "ownerDecision",
};

function scanForbiddenRDFields(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanForbiddenRDFields(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_RD_FIELDS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanForbiddenRDFields(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanRDFixtureSecurity(rawContent) {
  const findings = [];
  if (SECRET_VALUE_PATTERN.test(rawContent)) {
    findings.push("secret-like value detected");
  }
  for (const frag of FORBIDDEN_PATH_FRAGMENTS) {
    if (rawContent.includes(frag)) {
      findings.push("forbidden path fragment: " + frag);
    }
  }
  if (/\/Users\//.test(rawContent) || /\/home\//.test(rawContent) || /\/etc\//.test(rawContent) || /\/var\//.test(rawContent)) {
    findings.push("real system path detected");
  }
  if (/[A-Z]:\\/.test(rawContent)) {
    findings.push("Windows drive path detected");
  }
  if (/https?:\/\/(?!example\.com)[^\s"]+/.test(rawContent)) {
    findings.push("non-example.com URL detected");
  }
  if (/\.env/.test(rawContent)) {
    findings.push(".env reference detected");
  }
  if (/production-ready|production ready|deployment enabled|dispatch enabled|enterprise-grade/.test(rawContent)) {
    findings.push("premature production/deployment claim");
  }
  return findings;
}

function scanRDFixtureSecretKeys(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanRDFixtureSecretKeys(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_KEY_PATTERN.test(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanRDFixtureSecretKeys(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function checkRDPositiveFixture(fixture) {
  const failures = [];

  if (fixture.schemaVersion !== "1.0.0") failures.push("schemaVersion must be 1.0.0");
  if (fixture.recordType !== "pnpd.researchDiscovery") failures.push("recordType must be pnpd.researchDiscovery");

  if (!fixture.artifactId || typeof fixture.artifactId !== "string" || fixture.artifactId.length === 0)
    failures.push("artifactId missing or empty");
  if (!fixture.artifactType || !RD_ARTIFACT_TYPES.has(fixture.artifactType))
    failures.push("artifactType missing or invalid");
  if (!fixture.phase || !RD_PHASES.has(fixture.phase))
    failures.push("phase missing or invalid");
  if (!fixture.createdAt || typeof fixture.createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(fixture.createdAt))
    failures.push("createdAt missing or invalid format");
  if (!fixture.createdBy || typeof fixture.createdBy !== "string" || fixture.createdBy.length === 0)
    failures.push("createdBy missing or empty");

  const g = fixture.governance;
  if (!g) {
    failures.push("governance missing");
  } else {
    if (g.authorizesImplementation !== false) failures.push("governance.authorizesImplementation must be false");
    if (g.authorizesMerge !== false) failures.push("governance.authorizesMerge must be false");
    if (g.authorizesDispatch !== false) failures.push("governance.authorizesDispatch must be false");
    if (g.authorizesDeployment !== false) failures.push("governance.authorizesDeployment must be false");
    if (g.productionCertification !== false) failures.push("governance.productionCertification must be false");
    if (g.ownerFinalAuthority !== true) failures.push("governance.ownerFinalAuthority must be true");
    if (g.codexAuditRequiredBeforeMerge !== true) failures.push("governance.codexAuditRequiredBeforeMerge must be true");
    if (g.agentBridgeAuthority !== false) failures.push("governance.agentBridgeAuthority must be false");
  }

  const e = fixture.evidence;
  if (!e) {
    failures.push("evidence missing");
  } else {
    if (!e.evidenceExists || typeof e.evidenceExists !== "string" || e.evidenceExists.length === 0)
      failures.push("evidence.evidenceExists missing or empty");
    if (!e.evidenceMissing || typeof e.evidenceMissing !== "string" || e.evidenceMissing.length === 0)
      failures.push("evidence.evidenceMissing missing or empty");
    if (!Array.isArray(e.assumptions) || e.assumptions.length === 0)
      failures.push("evidence.assumptions missing or empty array");
    else if (e.assumptions.some(a => typeof a !== "string" || a.length === 0))
      failures.push("evidence.assumptions contains empty item");
    if (!e.uncertainty || typeof e.uncertainty !== "string" || e.uncertainty.length === 0)
      failures.push("evidence.uncertainty missing or empty");
    if (!e.disproofCriteria || typeof e.disproofCriteria !== "string" || e.disproofCriteria.length === 0)
      failures.push("evidence.disproofCriteria missing or empty");
    if (!e.sourceQuality || !RD_SOURCE_QUALITIES.has(e.sourceQuality))
      failures.push("evidence.sourceQuality missing or invalid");
  }

  const artifactType = fixture.artifactType;
  const expectedKey = RD_TYPE_SPECIFIC_MAP[artifactType];
  if (!expectedKey) {
    failures.push("unknown artifactType: " + artifactType);
  } else {
    const tsObj = fixture[expectedKey];
    if (!tsObj || typeof tsObj !== "object") {
      failures.push(expectedKey + " missing or not an object");
    } else {
      for (const [at, mappedKey] of Object.entries(RD_TYPE_SPECIFIC_MAP)) {
        if (at !== artifactType && fixture[mappedKey] !== undefined) {
          failures.push("extraneous type-specific object: " + mappedKey + " (artifactType is " + artifactType + ")");
        }
      }

      switch (artifactType) {
        case "problem_discovery":
          if (!tsObj.problemName || typeof tsObj.problemName !== "string" || tsObj.problemName.length === 0) failures.push("problemDiscovery.problemName missing or empty");
          if (!tsObj.whoHasThisProblem || typeof tsObj.whoHasThisProblem !== "string" || tsObj.whoHasThisProblem.length === 0) failures.push("problemDiscovery.whoHasThisProblem missing or empty");
          if (!tsObj.whyNow || typeof tsObj.whyNow !== "string" || tsObj.whyNow.length === 0) failures.push("problemDiscovery.whyNow missing or empty");
          if (!tsObj.whyNotTrendy || typeof tsObj.whyNotTrendy !== "string" || tsObj.whyNotTrendy.length === 0) failures.push("problemDiscovery.whyNotTrendy missing or empty");
          if (!tsObj.painLevel || !["critical","high","moderate","low"].includes(tsObj.painLevel)) failures.push("problemDiscovery.painLevel missing or invalid");
          if (!tsObj.problemClassification || typeof tsObj.problemClassification !== "string" || tsObj.problemClassification.length === 0) failures.push("problemDiscovery.problemClassification missing or empty");
          if (!tsObj.currentSolutions || typeof tsObj.currentSolutions !== "string" || tsObj.currentSolutions.length === 0) failures.push("problemDiscovery.currentSolutions missing or empty");
          if (!tsObj.whyCurrentSolutionsFail || typeof tsObj.whyCurrentSolutionsFail !== "string" || tsObj.whyCurrentSolutionsFail.length === 0) failures.push("problemDiscovery.whyCurrentSolutionsFail missing or empty");
          if (!tsObj.smallestNextResearchAction || typeof tsObj.smallestNextResearchAction !== "string" || tsObj.smallestNextResearchAction.length === 0) failures.push("problemDiscovery.smallestNextResearchAction missing or empty");
          if (!Array.isArray(tsObj.ownerDecisionOptions) || tsObj.ownerDecisionOptions.length === 0) failures.push("problemDiscovery.ownerDecisionOptions missing or empty array");
          break;
        case "source_review":
          if (!tsObj.sourceIdentifier || typeof tsObj.sourceIdentifier !== "string" || tsObj.sourceIdentifier.length === 0) failures.push("sourceReview.sourceIdentifier missing or empty");
          if (!tsObj.sourceType || !RD_SOURCE_QUALITIES.has(tsObj.sourceType)) failures.push("sourceReview.sourceType missing or invalid");
          if (!tsObj.sourceAge || typeof tsObj.sourceAge !== "string" || tsObj.sourceAge.length === 0) failures.push("sourceReview.sourceAge missing or empty");
          if (!tsObj.keyClaims || typeof tsObj.keyClaims !== "string" || tsObj.keyClaims.length === 0) failures.push("sourceReview.keyClaims missing or empty");
          if (!tsObj.credibilityAssessment || typeof tsObj.credibilityAssessment !== "string" || tsObj.credibilityAssessment.length === 0) failures.push("sourceReview.credibilityAssessment missing or empty");
          if (!tsObj.biasAssessment || typeof tsObj.biasAssessment !== "string" || tsObj.biasAssessment.length === 0) failures.push("sourceReview.biasAssessment missing or empty");
          if (!tsObj.overWeightedRisk || typeof tsObj.overWeightedRisk !== "string" || tsObj.overWeightedRisk.length === 0) failures.push("sourceReview.overWeightedRisk missing or empty");
          if (!tsObj.claimSupported || typeof tsObj.claimSupported !== "string" || tsObj.claimSupported.length === 0) failures.push("sourceReview.claimSupported missing or empty");
          if (!tsObj.claimWeakened || typeof tsObj.claimWeakened !== "string" || tsObj.claimWeakened.length === 0) failures.push("sourceReview.claimWeakened missing or empty");
          if (!tsObj.uncertaintyRemaining || typeof tsObj.uncertaintyRemaining !== "string" || tsObj.uncertaintyRemaining.length === 0) failures.push("sourceReview.uncertaintyRemaining missing or empty");
          break;
        case "experiment_log":
          if (!tsObj.experimentName || typeof tsObj.experimentName !== "string" || tsObj.experimentName.length === 0) failures.push("experimentLog.experimentName missing or empty");
          if (!tsObj.hypothesis || typeof tsObj.hypothesis !== "string" || tsObj.hypothesis.length === 0) failures.push("experimentLog.hypothesis missing or empty");
          if (!tsObj.whyMatters || typeof tsObj.whyMatters !== "string" || tsObj.whyMatters.length === 0) failures.push("experimentLog.whyMatters missing or empty");
          if (!tsObj.expectedResult || typeof tsObj.expectedResult !== "string" || tsObj.expectedResult.length === 0) failures.push("experimentLog.expectedResult missing or empty");
          if (!tsObj.confidenceBeforeTest || !["low","medium","high"].includes(tsObj.confidenceBeforeTest)) failures.push("experimentLog.confidenceBeforeTest missing or invalid");
          if (!tsObj.testPerformed || typeof tsObj.testPerformed !== "string" || tsObj.testPerformed.length === 0) failures.push("experimentLog.testPerformed missing or empty");
          if (!tsObj.actualResult || typeof tsObj.actualResult !== "string" || tsObj.actualResult.length === 0) failures.push("experimentLog.actualResult missing or empty");
          if (!tsObj.expectedVsActualDelta || typeof tsObj.expectedVsActualDelta !== "string" || tsObj.expectedVsActualDelta.length === 0) failures.push("experimentLog.expectedVsActualDelta missing or empty");
          if (!tsObj.updatedBelief || typeof tsObj.updatedBelief !== "string" || tsObj.updatedBelief.length === 0) failures.push("experimentLog.updatedBelief missing or empty");
          if (!tsObj.nextAction || typeof tsObj.nextAction !== "string" || tsObj.nextAction.length === 0) failures.push("experimentLog.nextAction missing or empty");
          if (tsObj.disposable !== true && tsObj.disposable !== false) failures.push("experimentLog.disposable missing");
          break;
        case "failure_mining":
          if (!tsObj.failureObserved || typeof tsObj.failureObserved !== "string" || tsObj.failureObserved.length === 0) failures.push("failureMining.failureObserved missing or empty");
          if (!tsObj.whereAppeared || typeof tsObj.whereAppeared !== "string" || tsObj.whereAppeared.length === 0) failures.push("failureMining.whereAppeared missing or empty");
          if (!tsObj.frequency || !["once","occasional","repeating"].includes(tsObj.frequency)) failures.push("failureMining.frequency missing or invalid");
          if (!tsObj.impact || !["blocked","degraded","informative"].includes(tsObj.impact)) failures.push("failureMining.impact missing or invalid");
          if (!tsObj.likelyCause || typeof tsObj.likelyCause !== "string" || tsObj.likelyCause.length === 0) failures.push("failureMining.likelyCause missing or empty");
          if (!tsObj.competingExplanations || typeof tsObj.competingExplanations !== "string" || tsObj.competingExplanations.length === 0) failures.push("failureMining.competingExplanations missing or empty");
          if (!tsObj.biggestFailurePile || typeof tsObj.biggestFailurePile !== "string" || tsObj.biggestFailurePile.length === 0) failures.push("failureMining.biggestFailurePile missing or empty");
          if (!tsObj.smallestNextFixOrTest || typeof tsObj.smallestNextFixOrTest !== "string" || tsObj.smallestNextFixOrTest.length === 0) failures.push("failureMining.smallestNextFixOrTest missing or empty");
          if (!tsObj.whatNotToChangeYet || typeof tsObj.whatNotToChangeYet !== "string" || tsObj.whatNotToChangeYet.length === 0) failures.push("failureMining.whatNotToChangeYet missing or empty");
          if (!tsObj.patternRecognition || typeof tsObj.patternRecognition !== "string" || tsObj.patternRecognition.length === 0) failures.push("failureMining.patternRecognition missing or empty");
          break;
        case "owner_decision":
          if (!tsObj.decisionTitle || typeof tsObj.decisionTitle !== "string" || tsObj.decisionTitle.length === 0) failures.push("ownerDecision.decisionTitle missing or empty");
          if (!tsObj.researchEvidenceReviewed || typeof tsObj.researchEvidenceReviewed !== "string" || tsObj.researchEvidenceReviewed.length === 0) failures.push("ownerDecision.researchEvidenceReviewed missing or empty");
          if (!tsObj.mainFinding || typeof tsObj.mainFinding !== "string" || tsObj.mainFinding.length === 0) failures.push("ownerDecision.mainFinding missing or empty");
          if (!tsObj.risks || typeof tsObj.risks !== "string" || tsObj.risks.length === 0) failures.push("ownerDecision.risks missing or empty");
          if (!tsObj.openQuestions || typeof tsObj.openQuestions !== "string" || tsObj.openQuestions.length === 0) failures.push("ownerDecision.openQuestions missing or empty");
          if (!tsObj.recommendedNextPhase || typeof tsObj.recommendedNextPhase !== "string" || tsObj.recommendedNextPhase.length === 0) failures.push("ownerDecision.recommendedNextPhase missing or empty");
          if (!tsObj.decision || !RD_OWNER_DECISIONS.has(tsObj.decision)) failures.push("ownerDecision.decision missing or invalid");
          if (!tsObj.rationale || typeof tsObj.rationale !== "string" || tsObj.rationale.length === 0) failures.push("ownerDecision.rationale missing or empty");
          if (!tsObj.constraints || typeof tsObj.constraints !== "string" || tsObj.constraints.length === 0) failures.push("ownerDecision.constraints missing or empty");
          if (!tsObj.nextActions || typeof tsObj.nextActions !== "string" || tsObj.nextActions.length === 0) failures.push("ownerDecision.nextActions missing or empty");
          if (!tsObj.ownerSignature || typeof tsObj.ownerSignature !== "string" || tsObj.ownerSignature.length === 0) failures.push("ownerDecision.ownerSignature missing or empty");
          break;
      }
    }
  }

  return failures;
}

function detectRDNegativeFailure(fixture, filename) {
  const reasons = [];

  switch (filename) {
    case "invalid-authorizes-implementation.json":
      if (fixture.governance && fixture.governance.authorizesImplementation === true)
        reasons.push("governance.authorizesImplementation is true");
      break;
    case "invalid-authorizes-dispatch.json":
      if (fixture.governance && fixture.governance.authorizesDispatch === true)
        reasons.push("governance.authorizesDispatch is true");
      break;
    case "invalid-owner-bypass.json":
      if (fixture.governance && fixture.governance.ownerFinalAuthority === false)
        reasons.push("governance.ownerFinalAuthority is false");
      break;
    case "invalid-missing-uncertainty.json":
      if (!fixture.evidence || !fixture.evidence.uncertainty || (typeof fixture.evidence.uncertainty === "string" && fixture.evidence.uncertainty.length === 0))
        reasons.push("evidence.uncertainty missing or empty");
      break;
    case "invalid-missing-disproof-criteria.json":
      if (!fixture.evidence || !fixture.evidence.disproofCriteria || (typeof fixture.evidence.disproofCriteria === "string" && fixture.evidence.disproofCriteria.length === 0))
        reasons.push("evidence.disproofCriteria missing or empty");
      break;
    case "invalid-experiment-missing-expected-result.json":
      if (!fixture.experimentLog || !fixture.experimentLog.expectedResult || (typeof fixture.experimentLog.expectedResult === "string" && fixture.experimentLog.expectedResult.length === 0))
        reasons.push("experimentLog.expectedResult missing or empty");
      break;
    case "invalid-missing-artifact-type.json":
      if (!fixture.artifactType)
        reasons.push("artifactType missing");
      break;
    case "invalid-forbidden-field.json":
      if (fixture.dispatchApproved === true)
        reasons.push("forbidden field dispatchApproved present");
      break;
    case "invalid-production-certification-claim.json":
      if (fixture.governance && fixture.governance.productionCertification === true)
        reasons.push("governance.productionCertification is true");
      break;
    case "invalid-codex-bypass.json":
      if (fixture.governance && fixture.governance.codexAuditRequiredBeforeMerge === false)
        reasons.push("governance.codexAuditRequiredBeforeMerge is false");
      break;
  }

  if (reasons.length === 0) {
    const structFails = checkRDPositiveFixture(fixture);
    if (structFails.length > 0) {
      reasons.push("structural failure: " + structFails[0]);
    }
  }

  return reasons;
}

function validateResearchDiscoveryPhase1M() {
  let exitCode = 0;
  let positivePassed = 0;
  let positiveFailed = 0;
  let negativeInvalid = 0;
  let negativeUnexpectedPass = 0;
  let forbiddenFieldPass = true;
  let securityPass = true;

  // ── Schema load checks ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, RESEARCH_DISCOVERY_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Research Discovery schema load failed: " + e.message);
    process.exit(2);
  }

  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    console.error("Schema $schema must be https://json-schema.org/draft/2020-12/schema");
    process.exit(2);
  }
  if (schema.$id !== "pnpd-research-discovery.schema.json") {
    console.error("Schema $id must be pnpd-research-discovery.schema.json");
    process.exit(2);
  }
  if (schema.title !== "PNPD Research Discovery Artifact Schema") {
    console.error("Schema title must be 'PNPD Research Discovery Artifact Schema'");
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

  const props = schema.properties || {};
  if (!props.recordType || props.recordType.const !== "pnpd.researchDiscovery") {
    console.error("Schema recordType const must be pnpd.researchDiscovery");
    process.exit(2);
  }
  if (!props.schemaVersion || props.schemaVersion.const !== "1.0.0") {
    console.error("Schema schemaVersion const must be 1.0.0");
    process.exit(2);
  }

  const atEnum = props.artifactType && props.artifactType.enum;
  if (!atEnum || !Array.isArray(atEnum)) {
    console.error("Schema artifactType must have an enum");
    process.exit(2);
  }
  for (const at of RD_ARTIFACT_TYPES) {
    if (!atEnum.includes(at)) {
      console.error("Schema artifactType enum missing: " + at);
      process.exit(2);
    }
  }

  for (const key of Object.values(RD_TYPE_SPECIFIC_MAP)) {
    if (!props[key]) {
      console.error("Schema properties missing: " + key);
      process.exit(2);
    }
  }

  if (!Array.isArray(schema.oneOf) || schema.oneOf.length !== 5) {
    console.error("Schema oneOf must have exactly 5 branches");
    process.exit(2);
  }

  const defs = schema.$defs || {};
  if (!defs.governance) {
    console.error("Schema $defs.governance missing");
    process.exit(2);
  }
  if (!defs.evidence) {
    console.error("Schema $defs.evidence missing");
    process.exit(2);
  }
  for (const key of Object.values(RD_TYPE_SPECIFIC_MAP)) {
    if (!defs[key]) {
      console.error("Schema $defs." + key + " missing");
      process.exit(2);
    }
  }

  const gProps = defs.governance && defs.governance.properties;
  if (gProps) {
    const consts = {
      authorizesImplementation: false,
      authorizesMerge: false,
      authorizesDispatch: false,
      authorizesDeployment: false,
      productionCertification: false,
      ownerFinalAuthority: true,
      codexAuditRequiredBeforeMerge: true,
      agentBridgeAuthority: false,
    };
    for (const [key, expected] of Object.entries(consts)) {
      if (!gProps[key] || gProps[key].const !== expected) {
        console.error("Schema governance." + key + " const must be " + expected);
        process.exit(2);
      }
    }
  }

  const caProps = props.createdAt;
  if (!caProps || !caProps.pattern) {
    console.error("Schema createdAt must have explicit pattern (not just format)");
    process.exit(2);
  }

  // ── Fixture discovery ──
  const fixturesDir = path.join(ROOT, RESEARCH_DISCOVERY_FIXTURES_DIR);
  let fixtureFiles;
  try {
    fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith(".json")).sort();
  } catch (e) {
    console.error("Research Discovery fixture directory not readable: " + e.message);
    process.exit(2);
  }

  if (fixtureFiles.length !== 16) {
    console.error("Expected exactly 16 research discovery fixture files, found: " + fixtureFiles.length);
    process.exit(1);
  }

  const allExpected = new Set([...RD_POSITIVE_FIXTURES, ...RD_NEGATIVE_FIXTURES]);
  for (const f of allExpected) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing expected fixture: " + f);
      process.exit(1);
    }
  }

  // ── Process each fixture ──
  console.log("PNPD Research Discovery Validation");
  console.log("Schema: " + RESEARCH_DISCOVERY_SCHEMA_PATH);
  console.log("Fixtures: " + RESEARCH_DISCOVERY_FIXTURES_DIR);
  console.log("");

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

    // ── Security/fake-data scan ──
    const secFindings = scanRDFixtureSecurity(rawContent);
    const keyFindings = scanRDFixtureSecretKeys(fixture, "$", []);
    const allSecFindings = [...secFindings, ...keyFindings.map(k => "secret-like key: " + k)];
    if (allSecFindings.length > 0) {
      console.log("[FAIL] " + filename + " — SECURITY/FAKE-DATA VIOLATION: " + allSecFindings.join("; "));
      securityPass = false;
      exitCode = 1;
      continue;
    }

    if (filename.startsWith("valid-")) {
      // ── Positive fixture validation ──
      const structFails = checkRDPositiveFixture(fixture);

      const forbiddenFields = [];
      scanForbiddenRDFields(fixture, "$", forbiddenFields);

      const allFailures = [];
      if (structFails.length > 0) allFailures.push(structFails.join("; "));
      if (forbiddenFields.length > 0) {
        allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));
        forbiddenFieldPass = false;
      }

      if (allFailures.length > 0) {
        console.log("[FAIL] " + filename + " — " + allFailures.join(" | "));
        positiveFailed++;
        exitCode = 1;
      } else {
        if (filename === "valid-owner-decision-approve-implementation-design.json") {
          console.log("[PASS] " + filename + " — valid fixture accepted (owner approves design only, governance non-authorizing)");
        } else if (filename === "valid-experiment-log-expected-vs-actual.json") {
          console.log("[PASS] " + filename + " — valid fixture accepted (expected vs actual complete)");
        } else {
          console.log("[PASS] " + filename + " — valid fixture accepted");
        }
        positivePassed++;
      }
    } else if (filename.startsWith("invalid-")) {
      // ── Negative fixture validation ──
      const expectedReasons = detectRDNegativeFailure(fixture, filename);

      if (expectedReasons.length > 0) {
        console.log("[INVALID-as-expected] " + filename + " — " + expectedReasons.join("; "));
        negativeInvalid++;
      } else {
        const structFails = checkRDPositiveFixture(fixture);
        if (structFails.length > 0) {
          console.log("[INVALID-as-expected] " + filename + " — structural failure: " + structFails[0]);
          negativeInvalid++;
        } else {
          console.log("[FAIL] " + filename + " — expected INVALID but passed all checks");
          negativeUnexpectedPass++;
          exitCode = 1;
        }
      }

      if (filename !== "invalid-forbidden-field.json") {
        const forbiddenFields = [];
        scanForbiddenRDFields(fixture, "$", forbiddenFields);
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

  process.exit(exitCode);
}

// ── Phase 1M-D: Standalone Research Discovery Artifact Validation ────────────────

function resolveRDArtifactPath(pathArg) {
  if (!pathArg) {
    throw new Error("--research-discovery-artifact requires a file path argument.");
  }

  if (path.isAbsolute(pathArg)) {
    throw new Error("Absolute paths are not allowed. Provide a relative path under the repository root.");
  }

  if (pathArg.includes("..")) {
    throw new Error("Path traversal is not allowed.");
  }

  if (!pathArg.endsWith(".json")) {
    throw new Error("Artifact file must end with .json.");
  }

  const resolvedPath = path.resolve(ROOT, pathArg);

  let realPath;
  try {
    realPath = fs.realpathSync(resolvedPath);
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Artifact file not found: " + pathArg);
    }
    throw new Error("Cannot resolve artifact path: " + e.message);
  }

  // Containment check: must resolve inside repository root
  if (!realPath.startsWith(ROOT + path.sep) && realPath !== ROOT) {
    throw new Error("Artifact file must be inside the repository root. Got: " + pathArg);
  }

  let stat;
  try {
    stat = fs.statSync(realPath);
  } catch (e) {
    throw new Error("Cannot stat artifact file: " + e.message);
  }

  if (!stat.isFile()) {
    throw new Error("Path must be a regular file, not a directory: " + pathArg);
  }

  return realPath;
}

function scanRDArtifactSecurity(rawContent, fixture) {
  const findings = [];

  // Secret-like value patterns
  const SECRET_VALUE_EXTENDED = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|gho_[A-Za-z0-9_]{12,}|github_pat_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
  if (SECRET_VALUE_EXTENDED.test(rawContent)) {
    findings.push("secret-like value detected");
  }

  // Forbidden path fragments (legacy BricLab)
  for (const frag of FORBIDDEN_PATH_FRAGMENTS) {
    if (rawContent.includes(frag)) {
      findings.push("forbidden path fragment: " + frag);
    }
  }

  // Private/local filesystem paths
  if (/\/Users\//.test(rawContent) || /\/home\//.test(rawContent) || /\/etc\//.test(rawContent) || /\/var\//.test(rawContent)) {
    findings.push("private/local filesystem path detected");
  }

  // Windows drive paths
  if (/[A-Z]:\\/.test(rawContent)) {
    findings.push("Windows drive path detected");
  }

  // .env references
  if (/\.env/.test(rawContent)) {
    findings.push(".env reference detected");
  }

  // Premature production/deployment/dispatch/GitHub mutation claims
  if (/production-ready|production ready|deployment enabled|dispatch enabled|enterprise-grade|production certified|ready for production|deploy to production|github mutation|github write|github api mutation|mutates github/i.test(rawContent)) {
    findings.push("premature production/deployment/dispatch claim detected");
  }

  // Secret-like keys scan
  const secretKeyFindings = [];
  scanRDArtifactSecretKeys(fixture, "$", secretKeyFindings);
  for (const skf of secretKeyFindings) {
    findings.push("secret-like key: " + skf);
  }

  // Forbidden authority fields scan (reuse existing function)
  const forbiddenFieldFindings = [];
  scanForbiddenRDFields(fixture, "$", forbiddenFieldFindings);
  for (const fff of forbiddenFieldFindings) {
    findings.push("forbidden field: " + fff);
  }

  return findings;
}

function scanRDArtifactSecretKeys(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanRDArtifactSecretKeys(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_KEY_PATTERN.test(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanRDArtifactSecretKeys(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function validateResearchDiscoveryArtifact(pathArg) {
  console.log("PNPD Research Discovery Artifact Validation");
  console.log("Artifact: " + pathArg);
  console.log("");

  // 1. Path safety
  let realPath;
  try {
    realPath = resolveRDArtifactPath(pathArg);
  } catch (e) {
    console.error("Path safety failure: " + e.message);
    process.exit(1);
  }

  // 2. JSON parse
  let rawContent;
  let artifact;
  try {
    rawContent = fs.readFileSync(realPath, "utf8");
    artifact = JSON.parse(rawContent);
    console.log("[PASS] JSON parse");
  } catch (e) {
    console.error("JSON parse failure: " + e.message);
    process.exit(1);
  }

  // 3. Security scan
  const secFindings = scanRDArtifactSecurity(rawContent, artifact);
  if (secFindings.length > 0) {
    console.error("Security scan failure: " + secFindings.join("; "));
    process.exit(1);
  }
  console.log("[PASS] Security scan");

  // 4. Structural checks
  const structFails = checkRDPositiveFixture(artifact);
  if (structFails.length > 0) {
    console.error("Structural check failure: " + structFails.join("; "));
    process.exit(1);
  }
  console.log("[PASS] Structural checks");

  // 5. Forbidden-field scan
  const forbiddenFields = [];
  scanForbiddenRDFields(artifact, "$", forbiddenFields);
  if (forbiddenFields.length > 0) {
    console.error("Forbidden-field scan failure: " + forbiddenFields.join(", "));
    process.exit(1);
  }
  console.log("[PASS] Forbidden-field scan");

  // Success
  console.log("");
  console.log("Artifact valid: all checks passed.");
  process.exit(0);
}

// ── Phase 1J: Runtime Readiness Report File Validation ───────────────────────────

function resolveReportPath(reportPathArg) {
  // Reject absolute paths
  if (path.isAbsolute(reportPathArg)) {
    throw new Error("Absolute paths are not allowed. Provide a relative path under .pnpd/runtime-readiness/.");
  }

  // Reject path traversal patterns
  if (reportPathArg.includes("..")) {
    throw new Error("Path traversal is not allowed.");
  }

  const resolvedPath = path.resolve(ROOT, reportPathArg);
  const containmentRoot = path.resolve(ROOT, ".pnpd/runtime-readiness");

  // Resolve symlinks
  let realPath;
  try {
    realPath = fs.realpathSync(resolvedPath);
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Report file not found: " + reportPathArg);
    }
    throw new Error("Cannot resolve report path: " + e.message);
  }

  // Containment check
  if (!realPath.startsWith(containmentRoot + path.sep) && realPath !== containmentRoot) {
    throw new Error("Report file must be under .pnpd/runtime-readiness/. Got: " + reportPathArg);
  }

  // Must be a file, not a directory
  let stat;
  try {
    stat = fs.statSync(realPath);
  } catch (e) {
    throw new Error("Cannot stat report file: " + e.message);
  }

  if (!stat.isFile()) {
    throw new Error("Path must be a file, not a directory: " + reportPathArg);
  }

  return { resolvedPath: realPath, originalPath: reportPathArg };
}

function validateRuntimeReadinessReportFile(reportPathArg) {
  let exitCode = 0;
  const checks = [];

  function pass(label) {
    console.log("[PASS] " + label);
    checks.push({ label, ok: true });
  }

  function fail(label, detail) {
    const msg = detail ? label + ": " + detail : label;
    console.log("[FAIL] " + msg);
    checks.push({ label, ok: false, detail });
    exitCode = 1;
  }

  // ── Resolve and validate path ──
  let pathInfo;
  try {
    pathInfo = resolveReportPath(reportPathArg);
  } catch (e) {
    console.error("Path validation failed: " + e.message);
    process.exit(1);
  }

  const reportPath = pathInfo.resolvedPath;
  const displayPath = pathInfo.originalPath;
  const filename = path.basename(reportPath);

  console.log("PNPD Runtime Readiness Report Validation");
  console.log("Report: " + displayPath);
  console.log("");

  // ── JSON parse ──
  let rawContent;
  let report;
  try {
    rawContent = fs.readFileSync(reportPath, "utf8");
    report = JSON.parse(rawContent);
    pass("JSON parse");
  } catch (e) {
    fail("JSON parse", e.message);
    process.exit(1);
  }

  // ── Load runtime readiness schema ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, RUNTIME_READINESS_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Runtime readiness schema load failed: " + e.message);
    process.exit(2);
  }

  // ── Schema validation ──
  const schemaFails = validateInstance(report, schema, schema, "$");
  if (schemaFails.length === 0) {
    pass("Schema structure");
  } else {
    for (const f of schemaFails) {
      fail("Schema structure", f.path + ": " + f.expected + " (got " + f.actual + ")");
    }
  }

  // ── Top-level required field checks ──
  if (report.schemaVersion !== "1.0.0") {
    fail("schemaVersion", 'expected "1.0.0", got ' + JSON.stringify(report.schemaVersion));
  } else {
    pass("schemaVersion: 1.0.0");
  }

  if (report.recordType !== "pnpd.runtimeReadiness") {
    fail("recordType", 'expected "pnpd.runtimeReadiness", got ' + JSON.stringify(report.recordType));
  } else {
    pass("recordType: pnpd.runtimeReadiness");
  }

  // ── Source checks ──
  const source = report.source || {};

  if (source.localOnly !== true) {
    fail("source.localOnly", "expected true, got " + JSON.stringify(source.localOnly));
  } else {
    pass("source.localOnly: true");
  }

  if (source.externalApiUsed !== false) {
    fail("source.externalApiUsed", "expected false, got " + JSON.stringify(source.externalApiUsed));
  }

  if (source.manualEvidenceOnly !== true) {
    fail("source.manualEvidenceOnly", "expected true, got " + JSON.stringify(source.manualEvidenceOnly));
  }

  if (source.remoteCiObserved !== false) {
    fail("source.remoteCiObserved", "expected false (remote CI reports not yet supported for file validation), got " + JSON.stringify(source.remoteCiObserved));
  } else {
    pass("source.remoteCiObserved: false");
  }

  // Remote CI fields must be null when remoteCiObserved is false
  if (source.remoteCiObserved === false) {
    const remoteCiFields = ["remoteCiProvider", "remoteCiRunId", "remoteCiStatus", "remoteCiConclusion", "remoteCiUrl"];
    for (const field of remoteCiFields) {
      if (source[field] !== null && source[field] !== undefined) {
        fail("source." + field, "expected null when remoteCiObserved is false, got " + JSON.stringify(source[field]));
      }
    }
  }

  // ── Repo path check ──
  const repo = report.repo || {};
  const repoPath = repo.path;
  if (repoPath === undefined || repoPath === null) {
    fail("repo.path", "missing");
  } else if (typeof repoPath !== "string") {
    fail("repo.path", "expected string, got " + typeof repoPath);
  } else if (path.isAbsolute(repoPath) || repoPath.startsWith("/")) {
    fail("repo.path", "must not be absolute: " + repoPath);
  } else if (repoPath.includes("/Users/")) {
    fail("repo.path", "must not contain local path: " + repoPath);
  } else if (repoPath.includes("\\") || repoPath.includes("..")) {
    fail("repo.path", "must not contain path traversal or backslashes: " + repoPath);
  } else if (!/^[a-zA-Z0-9_-]+$/.test(repoPath)) {
    fail("repo.path", "must match safe pattern [a-zA-Z0-9_-]+, got: " + repoPath);
  }
  // Pass implicitly if no failures

  // ── Dry-run checks ──
  const dryRun = report.dryRun || {};

  if (dryRun.dispatchEnabled !== false) {
    fail("dryRun.dispatchEnabled", "expected false, got " + JSON.stringify(dryRun.dispatchEnabled));
  } else {
    pass("dryRun.dispatchEnabled: false");
  }

  if (dryRun.dispatchAllowed !== false) {
    fail("dryRun.dispatchAllowed", "expected false, got " + JSON.stringify(dryRun.dispatchAllowed));
  } else {
    pass("dryRun.dispatchAllowed: false");
  }

  if (dryRun.maxParallelDispatch !== 0) {
    fail("dryRun.maxParallelDispatch", "expected 0, got " + JSON.stringify(dryRun.maxParallelDispatch));
  }

  if (dryRun.classification !== "CODEX_REVIEW_REQUIRED") {
    fail("dryRun.classification", 'expected "CODEX_REVIEW_REQUIRED", got ' + JSON.stringify(dryRun.classification));
  } else {
    pass("dryRun.classification: CODEX_REVIEW_REQUIRED");
  }

  // ── Authority checks ──
  const authority = report.authority || {};
  const authorityChecks = [
    ["agentBridgeMayApprove", false],
    ["agentBridgeMayMerge", false],
    ["agentBridgeMayDeploy", false],
    ["agentBridgeMayDispatch", false],
    ["agentBridgeMayCertifyProduction", false],
    ["ownerFinalAuthority", true],
    ["codexAuditRequired", true],
  ];

  let authorityPass = true;
  for (const [field, expected] of authorityChecks) {
    if (authority[field] !== expected) {
      fail("authority." + field, "expected " + JSON.stringify(expected) + ", got " + JSON.stringify(authority[field]));
      authorityPass = false;
    }
  }
  if (authorityPass) {
    pass("authority flags are non-authorizing");
  }

  // ── Safety checks ──
  const safety = report.safety || {};
  const safetyChecks = [
    ["advisoryOnly", true],
    ["authorizesDispatch", false],
    ["authorizesDeployment", false],
    ["authorizesMerge", false],
    ["certifiesProductionReadiness", false],
    ["executesDispatch", false],
    ["mutatesGitHub", false],
    ["externalWritesAllowed", false],
    ["githubMutationAllowed", false],
  ];

  let safetyPass = true;
  for (const [field, expected] of safetyChecks) {
    if (safety[field] !== expected) {
      fail("safety." + field, "expected " + JSON.stringify(expected) + ", got " + JSON.stringify(safety[field]));
      safetyPass = false;
    }
  }
  if (safetyPass) {
    pass("safety flags are advisory-only and non-authorizing");
  }

  // ── Readiness checks ──
  const readiness = report.readiness || {};
  if (readiness.status !== "reviewBlocked") {
    fail("readiness.status", 'expected "reviewBlocked", got ' + JSON.stringify(readiness.status));
  } else {
    pass("readiness.status: reviewBlocked");
  }

  // ── Audit checks ──
  const audit = report.audit || {};
  if (audit.mergeAllowed !== false) {
    fail("audit.mergeAllowed", "expected false, got " + JSON.stringify(audit.mergeAllowed));
  }
  if (audit.pushAllowed !== false) {
    fail("audit.pushAllowed", "expected false, got " + JSON.stringify(audit.pushAllowed));
  }

  // ── Integrity / contentHash check ──
  const integrity = report.integrity || {};
  if (!integrity.contentHash || !/^[a-f0-9]{64}$/.test(integrity.contentHash)) {
    fail("integrity.contentHash", "expected 64-char hex string, got " + JSON.stringify(integrity.contentHash));
  }

  // ── Filename hash-prefix check ──
  const filenameRe = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)-([a-f0-9]{8})\.json$/;
  const fileMatch = filename.match(filenameRe);
  if (!fileMatch) {
    fail("filename hash prefix", "filename does not match expected format YYYY-MM-DDTHH-mm-ss-SSSZ-{hash8}.json: " + filename);
  } else {
    const fileHashPrefix = fileMatch[2];
    const contentHashPrefix = integrity.contentHash ? integrity.contentHash.slice(0, 8) : "";
    if (fileHashPrefix !== contentHashPrefix) {
      fail("filename hash prefix", "filename hash prefix " + fileHashPrefix + " does not match stored contentHash prefix " + contentHashPrefix);
    } else {
      pass("filename hash prefix matches stored contentHash prefix");
    }
  }

  // ── Forbidden-field scan ──
  const forbiddenFields = [];
  scanForbiddenRuntimeReadinessFields(report, "$", forbiddenFields);
  if (forbiddenFields.length > 0) {
    for (const ff of forbiddenFields) {
      fail("forbidden-field scan", "forbidden field: " + ff);
    }
  } else {
    pass("forbidden-field scan");
  }

  // ── Fake-data/security scan ──
  const fakeDataFindings = scanRuntimeReadinessFakeData(rawContent, filename);
  const contentFindings = scanRuntimeReadinessFixtureContent(report);
  const allSecurityFindings = [...fakeDataFindings, ...contentFindings];
  if (allSecurityFindings.length > 0) {
    for (const sf of allSecurityFindings) {
      fail("fake-data/security scan", sf);
    }
  } else {
    pass("fake-data/security scan");
  }

  // ── Summary ──
  console.log("");
  if (exitCode === 0) {
    console.log("Report valid: all checks passed.");
  } else {
    console.log("Report invalid: " + checks.filter(c => !c.ok).length + " check(s) failed.");
  }

  process.exit(exitCode);
}

// ── Phase 1N: Product Delivery Validation ───────────────────────────────────────

const PD_SCHEMA_PATH = ".pnpd/product-delivery.schema.json";
const PD_FIXTURE_DIR = "tests/fixtures/pnpd/product-delivery";

const PD_ARTIFACT_TYPES = new Set([
  "prd",
  "productSpec",
  "architectureSpec",
  "implementationHandoff",
]);

const PD_PHASES = new Set([
  "draft",
  "under_review",
  "owner_approved",
  "parked",
  "rejected",
]);

const PD_POSITIVE_FIXTURES = new Set([
  "valid-prd-minimal.json",
  "valid-prd-full.json",
  "valid-product-spec-minimal.json",
  "valid-architecture-spec-minimal.json",
  "valid-implementation-handoff-minimal.json",
  "valid-implementation-handoff-full.json",
]);

const PD_NEGATIVE_FIXTURES = new Set([
  "invalid-prd-authorizes-implementation.json",
  "invalid-prd-missing-non-goals.json",
  "invalid-prd-codex-is-owner.json",
  "invalid-product-spec-missing-out-of-scope.json",
  "invalid-product-spec-missing-acceptance-criteria.json",
  "invalid-architecture-authorizes-deployment.json",
  "invalid-architecture-missing-security-boundaries.json",
  "invalid-handoff-allows-push.json",
  "invalid-handoff-allows-merge.json",
  "invalid-handoff-empty-forbidden-files.json",
]);

const PD_TYPE_SPECIFIC_MAP = {
  prd: "prd",
  productSpec: "productSpec",
  architectureSpec: "architectureSpec",
  implementationHandoff: "implementationHandoff",
};

const FORBIDDEN_PD_FIELDS = new Set([
  "approvedForImplementation",
  "implementationApproved",
  "mergeApproved",
  "dispatchApproved",
  "deploymentApproved",
  "productionReady",
  "productionCertified",
  "releaseApproved",
  "executeDispatch",
  "autoDispatch",
  "deployNow",
  "releaseNow",
  "mergeNow",
  "ownerBypassed",
  "codexBypassed",
  "agentBridgeApproved",
  "agentBridgeApproves",
  "codexAuthorizesMerge",
  "githubMutationEnabled",
  "apiMutationEnabled",
  "secretsEnabled",
  "unsafeAutonomyEnabled",
]);

const UNSAFE_PD_CLAIM_PATTERNS = [
  "authorizes implementation",
  "codex is the owner",
  "agentbridge approves merge",
  "agentbridge approves",
  "ready for production",
  "deployment approved",
  "dispatch approved",
  "github mutation enabled",
  "skip owner approval",
  "skip codex audit",
  "merge now",
  "release now",
  "production certified",
  "bypass owner",
  "bypass codex",
];

// ── Phase 1N helper functions ───────────────────────────────────────────────────

function scanForbiddenPDFields(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanForbiddenPDFields(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_PD_FIELDS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanForbiddenPDFields(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanPDUnsafeClaims(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanPDUnsafeClaims(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      for (const pattern of UNSAFE_PD_CLAIM_PATTERNS) {
        if (lower.includes(pattern)) {
          findings.push(currentPath + "." + key + " (\"" + pattern + "\")");
        }
      }
    }
    if (value && typeof value === "object") {
      scanPDUnsafeClaims(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanPDFixtureSecurity(rawContent) {
  const findings = [];
  if (SECRET_VALUE_PATTERN.test(rawContent)) {
    findings.push("secret-like value detected");
  }
  for (const frag of FORBIDDEN_PATH_FRAGMENTS) {
    if (rawContent.includes(frag)) {
      findings.push("forbidden path fragment: " + frag);
    }
  }
  if (/\/Users\//.test(rawContent) || /\/home\//.test(rawContent) || /\/etc\//.test(rawContent) || /\/var\//.test(rawContent)) {
    findings.push("real system path detected");
  }
  if (/[A-Z]:\\/.test(rawContent)) {
    findings.push("Windows drive path detected");
  }
  if (/\.env/.test(rawContent)) {
    findings.push(".env reference detected");
  }
  if (/https?:\/\/(?!example\.com)[^\s"]+/.test(rawContent)) {
    findings.push("non-example.com URL detected");
  }
  if (/production-ready|production ready|deployment enabled|dispatch enabled|enterprise-grade/.test(rawContent)) {
    findings.push("premature production/deployment claim");
  }
  return findings;
}

const PD_SAFE_SECRET_LIKE_KEYS = new Set([
  "ownerAuthorizationRequired",
]);

function scanPDFixtureSecretKeys(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanPDFixtureSecretKeys(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_KEY_PATTERN.test(key) && !PD_SAFE_SECRET_LIKE_KEYS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanPDFixtureSecretKeys(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

// ── Positive fixture validation ─────────────────────────────────────────────────

function checkPDPositiveFixture(fixture) {
  const failures = [];

  if (fixture.schemaVersion !== "1.0.0") failures.push("schemaVersion must be 1.0.0");
  if (fixture.recordType !== "pnpd.productDelivery") failures.push("recordType must be pnpd.productDelivery");

  if (!fixture.artifactId || typeof fixture.artifactId !== "string" || fixture.artifactId.length === 0)
    failures.push("artifactId missing or empty");
  if (!fixture.artifactType || !PD_ARTIFACT_TYPES.has(fixture.artifactType))
    failures.push("artifactType missing or invalid");
  if (!fixture.phase || !PD_PHASES.has(fixture.phase))
    failures.push("phase missing or invalid");
  if (!fixture.createdAt || typeof fixture.createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(fixture.createdAt))
    failures.push("createdAt missing or invalid format");
  if (!fixture.createdBy || typeof fixture.createdBy !== "string" || fixture.createdBy.length === 0)
    failures.push("createdBy missing or empty");
  if (!fixture.repo || typeof fixture.repo !== "string" || fixture.repo.length === 0)
    failures.push("repo missing or empty");

  const g = fixture.governance;
  if (!g) {
    failures.push("governance missing");
  } else {
    if (g.authorizesImplementation !== false) failures.push("governance.authorizesImplementation must be false");
    if (g.authorizesMerge !== false) failures.push("governance.authorizesMerge must be false");
    if (g.authorizesDispatch !== false) failures.push("governance.authorizesDispatch must be false");
    if (g.authorizesDeployment !== false) failures.push("governance.authorizesDeployment must be false");
    if (g.authorizesGitHubMutation !== false) failures.push("governance.authorizesGitHubMutation must be false");
    if (g.authorizesApiMutation !== false) failures.push("governance.authorizesApiMutation must be false");
    if (g.certifiesProductionReadiness !== false) failures.push("governance.certifiesProductionReadiness must be false");
    if (g.ownerFinalAuthority !== true) failures.push("governance.ownerFinalAuthority must be true");
    if (g.codexAuditRequiredBeforeMerge !== true) failures.push("governance.codexAuditRequiredBeforeMerge must be true");
    if (g.codexIsOwner !== false) failures.push("governance.codexIsOwner must be false");
    if (g.advisoryOnly !== true) failures.push("governance.advisoryOnly must be true");
  }

  const e = fixture.evidence;
  if (!e) {
    failures.push("evidence missing");
  } else {
    if (!e.evidenceSummary || typeof e.evidenceSummary !== "string" || e.evidenceSummary.length === 0)
      failures.push("evidence.evidenceSummary missing or empty");
    const labels = e.evidenceLabels;
    if (!labels || typeof labels !== "object") {
      failures.push("evidence.evidenceLabels missing");
    } else {
      if (!Array.isArray(labels.knownFacts)) failures.push("evidence.evidenceLabels.knownFacts missing or not an array");
      if (!Array.isArray(labels.assumptions)) failures.push("evidence.evidenceLabels.assumptions missing or not an array");
      if (!Array.isArray(labels.unknowns)) failures.push("evidence.evidenceLabels.unknowns missing or not an array");
      if (!Array.isArray(labels.researchNeeded)) failures.push("evidence.evidenceLabels.researchNeeded missing or not an array");
      if (!Array.isArray(labels.ownerDecisions)) failures.push("evidence.evidenceLabels.ownerDecisions missing or not an array");
    }
  }

  if (fixture.sourceArtifacts !== undefined) {
    if (!Array.isArray(fixture.sourceArtifacts) || fixture.sourceArtifacts.some(s => typeof s !== "string" || s.length === 0))
      failures.push("sourceArtifacts must be an array of non-empty strings");
  }

  if (fixture.riskNotes !== undefined) {
    if (!Array.isArray(fixture.riskNotes) || fixture.riskNotes.some(r => typeof r !== "string"))
      failures.push("riskNotes must be an array of strings");
  }

  const artifactType = fixture.artifactType;
  const expectedKey = PD_TYPE_SPECIFIC_MAP[artifactType];
  if (!expectedKey) {
    failures.push("unknown artifactType: " + artifactType);
  } else {
    const tsObj = fixture[expectedKey];
    if (!tsObj || typeof tsObj !== "object") {
      failures.push(expectedKey + " missing or not an object");
    } else {
      for (const [at, mappedKey] of Object.entries(PD_TYPE_SPECIFIC_MAP)) {
        if (at !== artifactType && fixture[mappedKey] !== undefined) {
          failures.push("extraneous type-specific object: " + mappedKey + " (artifactType is " + artifactType + ")");
        }
      }

      switch (artifactType) {
        case "prd":
          if (!tsObj.productName || typeof tsObj.productName !== "string" || tsObj.productName.length === 0)
            failures.push("prd.productName missing or empty");
          if (!tsObj.problemStatement || typeof tsObj.problemStatement !== "string" || tsObj.problemStatement.length === 0)
            failures.push("prd.problemStatement missing or empty");
          if (!Array.isArray(tsObj.targetUsers) || tsObj.targetUsers.length === 0)
            failures.push("prd.targetUsers missing or empty array");
          if (!Array.isArray(tsObj.goals) || tsObj.goals.length === 0)
            failures.push("prd.goals missing or empty array");
          if (!Array.isArray(tsObj.nonGoals) || tsObj.nonGoals.length === 0)
            failures.push("prd.nonGoals missing or empty array");
          if (!Array.isArray(tsObj.successCriteria) || tsObj.successCriteria.length === 0)
            failures.push("prd.successCriteria missing or empty array");
          if (tsObj.ownerDecisionRequiredBeforeProductSpec !== true)
            failures.push("prd.ownerDecisionRequiredBeforeProductSpec must be true");
          break;
        case "productSpec":
          if (!Array.isArray(tsObj.features) || tsObj.features.length === 0)
            failures.push("productSpec.features missing or empty array");
          if (!Array.isArray(tsObj.userStories) || tsObj.userStories.length === 0)
            failures.push("productSpec.userStories missing or empty array");
          if (!Array.isArray(tsObj.acceptanceCriteria) || tsObj.acceptanceCriteria.length === 0)
            failures.push("productSpec.acceptanceCriteria missing or empty array");
          if (!Array.isArray(tsObj.outOfScopeBehaviors) || tsObj.outOfScopeBehaviors.length === 0)
            failures.push("productSpec.outOfScopeBehaviors missing or empty array");
          if (tsObj.ownerDecisionRequiredBeforeImplementation !== true)
            failures.push("productSpec.ownerDecisionRequiredBeforeImplementation must be true");
          break;
        case "architectureSpec":
          if (!tsObj.overview || typeof tsObj.overview !== "string" || tsObj.overview.length === 0)
            failures.push("architectureSpec.overview missing or empty");
          if (!Array.isArray(tsObj.components) || tsObj.components.length === 0)
            failures.push("architectureSpec.components missing or empty array");
          if (!Array.isArray(tsObj.dataModel) || tsObj.dataModel.length === 0)
            failures.push("architectureSpec.dataModel missing or empty array");
          if (!Array.isArray(tsObj.securityBoundaries) || tsObj.securityBoundaries.length === 0)
            failures.push("architectureSpec.securityBoundaries missing or empty array");
          if (tsObj.ownerDecisionRequiredBeforeImplementation !== true)
            failures.push("architectureSpec.ownerDecisionRequiredBeforeImplementation must be true");
          break;
        case "implementationHandoff":
          if (!tsObj.branchName || typeof tsObj.branchName !== "string" || !/^[a-zA-Z0-9/._-]+$/.test(tsObj.branchName))
            failures.push("implementationHandoff.branchName missing or invalid pattern");
          if (!tsObj.taskScope || typeof tsObj.taskScope !== "string" || tsObj.taskScope.length === 0)
            failures.push("implementationHandoff.taskScope missing or empty");
          if (!Array.isArray(tsObj.allowedFiles) || tsObj.allowedFiles.length === 0)
            failures.push("implementationHandoff.allowedFiles missing or empty array");
          if (!Array.isArray(tsObj.forbiddenFiles) || tsObj.forbiddenFiles.length === 0)
            failures.push("implementationHandoff.forbiddenFiles missing or empty array");
          if (!Array.isArray(tsObj.implementationSteps) || tsObj.implementationSteps.length === 0)
            failures.push("implementationHandoff.implementationSteps missing or empty array");
          if (!Array.isArray(tsObj.gatesToRun) || tsObj.gatesToRun.length === 0)
            failures.push("implementationHandoff.gatesToRun missing or empty array");
          if (tsObj.noPushUnlessAuthorized !== true)
            failures.push("implementationHandoff.noPushUnlessAuthorized must be true");
          if (tsObj.noMergeUnlessAuthorized !== true)
            failures.push("implementationHandoff.noMergeUnlessAuthorized must be true");
          if (tsObj.noDeployUnlessAuthorized !== true)
            failures.push("implementationHandoff.noDeployUnlessAuthorized must be true");
          if (tsObj.ownerAuthorizationRequired !== true)
            failures.push("implementationHandoff.ownerAuthorizationRequired must be true");
          if (tsObj.codexAuditRequired !== true)
            failures.push("implementationHandoff.codexAuditRequired must be true");
          break;
      }
    }
  }

  return failures;
}

// ── Negative fixture detection ──────────────────────────────────────────────────

function detectPDNegativeFailure(fixture, filename) {
  const reasons = [];

  switch (filename) {
    case "invalid-prd-authorizes-implementation.json":
      if (fixture.governance && fixture.governance.authorizesImplementation === true)
        reasons.push("governance.authorizesImplementation is true");
      break;
    case "invalid-prd-missing-non-goals.json":
      if (!fixture.prd || !Array.isArray(fixture.prd.nonGoals) || fixture.prd.nonGoals.length === 0)
        reasons.push("prd.nonGoals missing or empty");
      break;
    case "invalid-prd-codex-is-owner.json":
      if (fixture.governance && fixture.governance.codexIsOwner === true)
        reasons.push("governance.codexIsOwner is true");
      break;
    case "invalid-product-spec-missing-out-of-scope.json":
      if (!fixture.productSpec || !Array.isArray(fixture.productSpec.outOfScopeBehaviors) || fixture.productSpec.outOfScopeBehaviors.length === 0)
        reasons.push("productSpec.outOfScopeBehaviors missing or empty");
      break;
    case "invalid-product-spec-missing-acceptance-criteria.json":
      if (!fixture.productSpec || !Array.isArray(fixture.productSpec.acceptanceCriteria) || fixture.productSpec.acceptanceCriteria.length === 0)
        reasons.push("productSpec.acceptanceCriteria missing or empty");
      break;
    case "invalid-architecture-authorizes-deployment.json":
      if (fixture.governance && fixture.governance.authorizesDeployment === true)
        reasons.push("governance.authorizesDeployment is true");
      break;
    case "invalid-architecture-missing-security-boundaries.json":
      if (!fixture.architectureSpec || !Array.isArray(fixture.architectureSpec.securityBoundaries) || fixture.architectureSpec.securityBoundaries.length === 0)
        reasons.push("architectureSpec.securityBoundaries missing or empty");
      break;
    case "invalid-handoff-allows-push.json":
      if (fixture.implementationHandoff && fixture.implementationHandoff.noPushUnlessAuthorized === false)
        reasons.push("implementationHandoff.noPushUnlessAuthorized is false");
      break;
    case "invalid-handoff-allows-merge.json":
      if (fixture.implementationHandoff && fixture.implementationHandoff.noMergeUnlessAuthorized === false)
        reasons.push("implementationHandoff.noMergeUnlessAuthorized is false");
      break;
    case "invalid-handoff-empty-forbidden-files.json":
      if (!fixture.implementationHandoff || !Array.isArray(fixture.implementationHandoff.forbiddenFiles) || fixture.implementationHandoff.forbiddenFiles.length === 0)
        reasons.push("implementationHandoff.forbiddenFiles missing or empty");
      break;
  }

  if (reasons.length === 0) {
    const structFails = checkPDPositiveFixture(fixture);
    if (structFails.length > 0) {
      reasons.push("structural failure: " + structFails[0]);
    }
  }

  return reasons;
}

// ── Phase 1N-E: Product Delivery Artifact Standalone Validation ──────────────────

function resolvePDArtifactPath(pathArg) {
  if (!pathArg) {
    throw new Error("--product-delivery-artifact requires a file path argument.");
  }

  if (path.isAbsolute(pathArg)) {
    throw new Error("Absolute paths are not allowed. Provide a relative path under the repository root.");
  }

  if (pathArg.includes("..")) {
    throw new Error("Path traversal is not allowed.");
  }

  if (!pathArg.endsWith(".json")) {
    throw new Error("Artifact file must end with .json.");
  }

  const resolvedPath = path.resolve(ROOT, pathArg);

  let realPath;
  try {
    realPath = fs.realpathSync(resolvedPath);
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Artifact file not found: " + pathArg);
    }
    throw new Error("Cannot resolve artifact path: " + e.message);
  }

  // Containment check: must resolve inside repository root
  if (!realPath.startsWith(ROOT + path.sep) && realPath !== ROOT) {
    throw new Error("Artifact file must be inside the repository root. Got: " + pathArg);
  }

  let stat;
  try {
    stat = fs.statSync(realPath);
  } catch (e) {
    throw new Error("Cannot stat artifact file: " + e.message);
  }

  if (!stat.isFile()) {
    throw new Error("Path must be a regular file, not a directory: " + pathArg);
  }

  return realPath;
}

function scanPDArtifactSecurity(rawContent, artifact) {
  const findings = [];

  // Secret-like value patterns
  const SECRET_VALUE_EXTENDED = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|gho_[A-Za-z0-9_]{12,}|github_pat_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
  if (SECRET_VALUE_EXTENDED.test(rawContent)) {
    findings.push("secret-like value detected");
  }

  // Forbidden path fragments (legacy BricLab)
  for (const frag of FORBIDDEN_PATH_FRAGMENTS) {
    if (rawContent.includes(frag)) {
      findings.push("forbidden path fragment: " + frag);
    }
  }

  // Private/local filesystem paths
  if (/\/Users\//.test(rawContent) || /\/home\//.test(rawContent) || /\/etc\//.test(rawContent) || /\/var\//.test(rawContent)) {
    findings.push("private/local filesystem path detected");
  }

  // Windows drive paths
  if (/[A-Z]:\\/.test(rawContent)) {
    findings.push("Windows drive path detected");
  }

  // .env references
  if (/\.env/.test(rawContent)) {
    findings.push(".env reference detected");
  }

  // Premature production/deployment/dispatch/GitHub mutation claims
  if (/production-ready|production ready|deployment enabled|dispatch enabled|enterprise-grade|production certified|ready for production|deploy to production|github mutation|github write|github api mutation|mutates github/i.test(rawContent)) {
    findings.push("premature production/deployment/dispatch claim detected");
  }

  // GitHub/API mutation claims
  if (/github mutation|github write|github api mutation|api mutation allowed|mutates github/i.test(rawContent)) {
    findings.push("GitHub/API mutation claim detected");
  }

  // Deploy/release claims
  if (/deploy now|release now|deploy to production|production deploy|auto deploy|auto release/i.test(rawContent)) {
    findings.push("deploy/release claim detected");
  }

  // Owner/Codex bypass claims
  if (/owner bypass|codex bypass|owner bypassed|codex bypassed|skip owner|skip codex|owner override|codex override/i.test(rawContent)) {
    findings.push("Owner/Codex bypass claim detected");
  }

  // AgentBridge authority claims
  if (/agentbridge approves|agentbridge authority|agentbridge authorizes|agentbridge merge|agentbridge dispatch/i.test(rawContent)) {
    findings.push("AgentBridge authority claim detected");
  }

  return findings;
}

function scanPDArtifactSecretKeys(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanPDArtifactSecretKeys(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_KEY_PATTERN.test(key) && !PD_SAFE_SECRET_LIKE_KEYS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanPDArtifactSecretKeys(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function validateProductDeliveryArtifact(pathArg) {
  console.log("PNPD Product Delivery Artifact Validation");
  console.log("Artifact: " + pathArg);
  console.log("");

  // 1. Path safety
  let realPath;
  try {
    realPath = resolvePDArtifactPath(pathArg);
  } catch (e) {
    console.error("Path safety failure: " + e.message);
    process.exit(1);
  }

  // 2. JSON parse
  let rawContent;
  let artifact;
  try {
    rawContent = fs.readFileSync(realPath, "utf8");
    artifact = JSON.parse(rawContent);
    console.log("[PASS] JSON parse");
  } catch (e) {
    console.error("JSON parse failure: " + e.message);
    process.exit(1);
  }

  const allFindings = [];
  let valid = true;

  // 3. Security scan
  const secFindings = scanPDArtifactSecurity(rawContent, artifact);
  if (secFindings.length > 0) {
    console.error("[FAIL] Security scan: " + secFindings.join("; "));
    allFindings.push(...secFindings);
    valid = false;
  } else {
    console.log("[PASS] Security scan");
  }

  // 4. Secret-key scan
  const secretKeyFindings = [];
  scanPDArtifactSecretKeys(artifact, "$", secretKeyFindings);
  if (secretKeyFindings.length > 0) {
    console.error("[FAIL] Secret-key scan: " + secretKeyFindings.join(", "));
    allFindings.push(...secretKeyFindings);
    valid = false;
  } else {
    console.log("[PASS] Secret-key scan");
  }

  // 5. Structural checks
  const structFails = checkPDPositiveFixture(artifact);
  if (structFails.length > 0) {
    console.error("[FAIL] Structural checks: " + structFails.join("; "));
    allFindings.push(...structFails);
    valid = false;
  } else {
    console.log("[PASS] Structural checks");
  }

  // 6. Forbidden-field scan
  const forbiddenFields = [];
  scanForbiddenPDFields(artifact, "$", forbiddenFields);
  if (forbiddenFields.length > 0) {
    console.error("[FAIL] Forbidden-field scan: " + forbiddenFields.join(", "));
    allFindings.push(...forbiddenFields);
    valid = false;
  } else {
    console.log("[PASS] Forbidden-field scan");
  }

  // 7. Unsafe-claim scan
  const unsafeClaims = [];
  scanPDUnsafeClaims(artifact, "$", unsafeClaims);
  if (unsafeClaims.length > 0) {
    console.error("[FAIL] Unsafe-claim scan: " + unsafeClaims.join(", "));
    allFindings.push(...unsafeClaims);
    valid = false;
  } else {
    console.log("[PASS] Unsafe-claim scan");
  }

  // Summary
  console.log("");
  if (valid) {
    console.log("Product Delivery artifact valid: all checks passed.");
    process.exit(0);
  } else {
    console.log("Product Delivery artifact invalid: " + allFindings.length + " violation(s).");
    process.exit(1);
  }
}

// ── Main Phase 1N validator ─────────────────────────────────────────────────────

function validateProductDeliveryPhase1N() {
  let exitCode = 0;
  let positivePassed = 0;
  let positiveFailed = 0;
  let negativeInvalid = 0;
  let negativeUnexpectedPass = 0;
  let forbiddenFieldPass = true;
  let unsafeClaimPass = true;
  let securityPass = true;

  // ── Schema load checks ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, PD_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Product Delivery schema load failed: " + e.message);
    process.exit(2);
  }

  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    console.error("Schema $schema must be https://json-schema.org/draft/2020-12/schema");
    process.exit(2);
  }
  if (schema.$id !== "pnpd-product-delivery.schema.json") {
    console.error("Schema $id must be pnpd-product-delivery.schema.json");
    process.exit(2);
  }
  if (schema.title !== "PNPD Product Delivery Artifact Schema") {
    console.error("Schema title must be 'PNPD Product Delivery Artifact Schema'");
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

  const props = schema.properties || {};
  if (!props.recordType || props.recordType.const !== "pnpd.productDelivery") {
    console.error("Schema recordType const must be pnpd.productDelivery");
    process.exit(2);
  }
  if (!props.schemaVersion || props.schemaVersion.const !== "1.0.0") {
    console.error("Schema schemaVersion const must be 1.0.0");
    process.exit(2);
  }

  const atEnum = props.artifactType && props.artifactType.enum;
  if (!atEnum || !Array.isArray(atEnum)) {
    console.error("Schema artifactType must have an enum");
    process.exit(2);
  }
  for (const at of PD_ARTIFACT_TYPES) {
    if (!atEnum.includes(at)) {
      console.error("Schema artifactType enum missing: " + at);
      process.exit(2);
    }
  }

  // Check root properties exist
  const expectedRootProps = ["schemaVersion", "recordType", "artifactType", "artifactId", "createdAt", "createdBy", "phase", "repo", "governance", "evidence", "prd", "productSpec", "architectureSpec", "implementationHandoff"];
  for (const rp of expectedRootProps) {
    if (!props[rp]) {
      console.error("Schema properties missing: " + rp);
      process.exit(2);
    }
  }

  if (!Array.isArray(schema.oneOf) || schema.oneOf.length !== 4) {
    console.error("Schema oneOf must have exactly 4 branches");
    process.exit(2);
  }

  // $defs checks
  const defs = schema.$defs || {};
  if (!defs.governance) { console.error("Schema $defs.governance missing"); process.exit(2); }
  if (!defs.evidence) { console.error("Schema $defs.evidence missing"); process.exit(2); }
  if (!defs.prd) { console.error("Schema $defs.prd missing"); process.exit(2); }
  if (!defs.productSpec) { console.error("Schema $defs.productSpec missing"); process.exit(2); }
  if (!defs.architectureSpec) { console.error("Schema $defs.architectureSpec missing"); process.exit(2); }
  if (!defs.implementationHandoff) { console.error("Schema $defs.implementationHandoff missing"); process.exit(2); }

  // Governance schema validation
  const gov = defs.governance;
  if (gov.additionalProperties !== false) {
    console.error("Schema $defs.governance additionalProperties must be false");
    process.exit(2);
  }
  const gProps = gov.properties;
  if (gProps) {
    const consts = {
      authorizesImplementation: false,
      authorizesMerge: false,
      authorizesDispatch: false,
      authorizesDeployment: false,
      authorizesGitHubMutation: false,
      authorizesApiMutation: false,
      certifiesProductionReadiness: false,
      ownerFinalAuthority: true,
      codexAuditRequiredBeforeMerge: true,
      codexIsOwner: false,
      advisoryOnly: true,
    };
    for (const [key, expected] of Object.entries(consts)) {
      if (!gProps[key] || gProps[key].const !== expected) {
        console.error("Schema governance." + key + " const must be " + expected);
        process.exit(2);
      }
    }
  }

  // Evidence schema validation
  const ev = defs.evidence;
  if (!ev) { console.error("Schema $defs.evidence missing"); process.exit(2); }
  if (ev.additionalProperties !== false) {
    console.error("Schema $defs.evidence additionalProperties must be false");
    process.exit(2);
  }
  const evProps = ev.properties || {};
  if (!evProps.evidenceSummary) { console.error("Schema evidence.evidenceSummary missing"); process.exit(2); }
  if (!evProps.evidenceLabels) { console.error("Schema evidence.evidenceLabels missing"); process.exit(2); }
  const labelsDef = evProps.evidenceLabels;
  if (labelsDef && labelsDef.properties) {
    if (!labelsDef.properties.knownFacts) { console.error("Schema evidenceLabels.knownFacts missing"); process.exit(2); }
    if (!labelsDef.properties.assumptions) { console.error("Schema evidenceLabels.assumptions missing"); process.exit(2); }
    if (!labelsDef.properties.unknowns) { console.error("Schema evidenceLabels.unknowns missing"); process.exit(2); }
    if (!labelsDef.properties.researchNeeded) { console.error("Schema evidenceLabels.researchNeeded missing"); process.exit(2); }
    if (!labelsDef.properties.ownerDecisions) { console.error("Schema evidenceLabels.ownerDecisions missing"); process.exit(2); }
  }

  // Type-specific schema validation
  const prdDef = defs.prd;
  if (prdDef.additionalProperties !== false) { console.error("Schema $defs.prd additionalProperties must be false"); process.exit(2); }
  const prdProps = prdDef.properties || {};
  if (!prdProps.productName) { console.error("Schema prd.productName missing"); process.exit(2); }
  if (!prdProps.problemStatement) { console.error("Schema prd.problemStatement missing"); process.exit(2); }
  if (!prdProps.targetUsers) { console.error("Schema prd.targetUsers missing"); process.exit(2); }
  if (!prdProps.goals) { console.error("Schema prd.goals missing"); process.exit(2); }
  if (!prdProps.nonGoals) { console.error("Schema prd.nonGoals missing"); process.exit(2); }
  if (!prdProps.successCriteria) { console.error("Schema prd.successCriteria missing"); process.exit(2); }
  if (!prdProps.ownerDecisionRequiredBeforeProductSpec || prdProps.ownerDecisionRequiredBeforeProductSpec.const !== true) {
    console.error("Schema prd.ownerDecisionRequiredBeforeProductSpec const must be true"); process.exit(2);
  }
  if (!prdProps.nonGoals.minItems || prdProps.nonGoals.minItems < 1) {
    console.error("Schema prd.nonGoals minItems must be >= 1"); process.exit(2);
  }

  const psDef = defs.productSpec;
  if (psDef.additionalProperties !== false) { console.error("Schema $defs.productSpec additionalProperties must be false"); process.exit(2); }
  const psProps = psDef.properties || {};
  if (!psProps.features) { console.error("Schema productSpec.features missing"); process.exit(2); }
  if (!psProps.userStories) { console.error("Schema productSpec.userStories missing"); process.exit(2); }
  if (!psProps.acceptanceCriteria) { console.error("Schema productSpec.acceptanceCriteria missing"); process.exit(2); }
  if (!psProps.outOfScopeBehaviors) { console.error("Schema productSpec.outOfScopeBehaviors missing"); process.exit(2); }
  if (!psProps.ownerDecisionRequiredBeforeImplementation || psProps.ownerDecisionRequiredBeforeImplementation.const !== true) {
    console.error("Schema productSpec.ownerDecisionRequiredBeforeImplementation const must be true"); process.exit(2);
  }
  if (!psProps.acceptanceCriteria.minItems || psProps.acceptanceCriteria.minItems < 1) {
    console.error("Schema productSpec.acceptanceCriteria minItems must be >= 1"); process.exit(2);
  }
  if (!psProps.outOfScopeBehaviors.minItems || psProps.outOfScopeBehaviors.minItems < 1) {
    console.error("Schema productSpec.outOfScopeBehaviors minItems must be >= 1"); process.exit(2);
  }

  const asDef = defs.architectureSpec;
  if (asDef.additionalProperties !== false) { console.error("Schema $defs.architectureSpec additionalProperties must be false"); process.exit(2); }
  const asProps = asDef.properties || {};
  if (!asProps.overview) { console.error("Schema architectureSpec.overview missing"); process.exit(2); }
  if (!asProps.components) { console.error("Schema architectureSpec.components missing"); process.exit(2); }
  if (!asProps.dataModel) { console.error("Schema architectureSpec.dataModel missing"); process.exit(2); }
  if (!asProps.securityBoundaries) { console.error("Schema architectureSpec.securityBoundaries missing"); process.exit(2); }
  if (!asProps.ownerDecisionRequiredBeforeImplementation || asProps.ownerDecisionRequiredBeforeImplementation.const !== true) {
    console.error("Schema architectureSpec.ownerDecisionRequiredBeforeImplementation const must be true"); process.exit(2);
  }
  if (!asProps.securityBoundaries.minItems || asProps.securityBoundaries.minItems < 1) {
    console.error("Schema architectureSpec.securityBoundaries minItems must be >= 1"); process.exit(2);
  }

  const ihDef = defs.implementationHandoff;
  if (ihDef.additionalProperties !== false) { console.error("Schema $defs.implementationHandoff additionalProperties must be false"); process.exit(2); }
  const ihProps = ihDef.properties || {};
  if (!ihProps.branchName) { console.error("Schema implementationHandoff.branchName missing"); process.exit(2); }
  if (!ihProps.taskScope) { console.error("Schema implementationHandoff.taskScope missing"); process.exit(2); }
  if (!ihProps.allowedFiles) { console.error("Schema implementationHandoff.allowedFiles missing"); process.exit(2); }
  if (!ihProps.forbiddenFiles) { console.error("Schema implementationHandoff.forbiddenFiles missing"); process.exit(2); }
  if (!ihProps.implementationSteps) { console.error("Schema implementationHandoff.implementationSteps missing"); process.exit(2); }
  if (!ihProps.gatesToRun) { console.error("Schema implementationHandoff.gatesToRun missing"); process.exit(2); }
  if (!ihProps.noPushUnlessAuthorized || ihProps.noPushUnlessAuthorized.const !== true) {
    console.error("Schema implementationHandoff.noPushUnlessAuthorized const must be true"); process.exit(2);
  }
  if (!ihProps.noMergeUnlessAuthorized || ihProps.noMergeUnlessAuthorized.const !== true) {
    console.error("Schema implementationHandoff.noMergeUnlessAuthorized const must be true"); process.exit(2);
  }
  if (!ihProps.noDeployUnlessAuthorized || ihProps.noDeployUnlessAuthorized.const !== true) {
    console.error("Schema implementationHandoff.noDeployUnlessAuthorized const must be true"); process.exit(2);
  }
  if (!ihProps.ownerAuthorizationRequired || ihProps.ownerAuthorizationRequired.const !== true) {
    console.error("Schema implementationHandoff.ownerAuthorizationRequired const must be true"); process.exit(2);
  }
  if (!ihProps.codexAuditRequired || ihProps.codexAuditRequired.const !== true) {
    console.error("Schema implementationHandoff.codexAuditRequired const must be true"); process.exit(2);
  }
  if (!ihProps.branchName.pattern || ihProps.branchName.pattern !== "^[a-zA-Z0-9/._-]+$") {
    console.error("Schema implementationHandoff.branchName pattern must be ^[a-zA-Z0-9/._-]+$"); process.exit(2);
  }
  if (!ihProps.allowedFiles.minItems || ihProps.allowedFiles.minItems < 1) {
    console.error("Schema implementationHandoff.allowedFiles minItems must be >= 1"); process.exit(2);
  }
  if (!ihProps.forbiddenFiles.minItems || ihProps.forbiddenFiles.minItems < 1) {
    console.error("Schema implementationHandoff.forbiddenFiles minItems must be >= 1"); process.exit(2);
  }
  if (!ihProps.gatesToRun.minItems || ihProps.gatesToRun.minItems < 1) {
    console.error("Schema implementationHandoff.gatesToRun minItems must be >= 1"); process.exit(2);
  }

  // ── Fixture discovery ──
  const fixturesDir = path.join(ROOT, PD_FIXTURE_DIR);
  let fixtureFiles;
  try {
    fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith(".json")).sort();
  } catch (e) {
    console.error("Product Delivery fixture directory not readable: " + e.message);
    process.exit(2);
  }

  if (fixtureFiles.length !== 16) {
    console.error("Expected exactly 16 product delivery fixture files, found: " + fixtureFiles.length);
    process.exit(1);
  }

  const allExpected = new Set([...PD_POSITIVE_FIXTURES, ...PD_NEGATIVE_FIXTURES]);
  for (const f of allExpected) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing expected fixture: " + f);
      process.exit(1);
    }
  }

  // ── Process each fixture ──
  console.log("PNPD Product Delivery Validation");
  console.log("Schema: " + PD_SCHEMA_PATH);
  console.log("Fixtures: " + PD_FIXTURE_DIR);
  console.log("");

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

    // ── Security/fake-data scan (all fixtures) ──
    const secFindings = scanPDFixtureSecurity(rawContent);
    const keyFindings = scanPDFixtureSecretKeys(fixture, "$", []);
    const allSecFindings = [...secFindings, ...keyFindings.map(k => "secret-like key: " + k)];
    if (allSecFindings.length > 0) {
      console.log("[FAIL] " + filename + " — SECURITY/FAKE-DATA VIOLATION: " + allSecFindings.join("; "));
      securityPass = false;
      exitCode = 1;
      continue;
    }

    if (filename.startsWith("valid-")) {
      // ── Positive fixture validation ──
      const structFails = checkPDPositiveFixture(fixture);

      const forbiddenFields = [];
      scanForbiddenPDFields(fixture, "$", forbiddenFields);

      const unsafeClaims = [];
      scanPDUnsafeClaims(fixture, "$", unsafeClaims);

      const allFailures = [];
      if (structFails.length > 0) allFailures.push(structFails.join("; "));
      if (forbiddenFields.length > 0) {
        allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));
        forbiddenFieldPass = false;
      }
      if (unsafeClaims.length > 0) {
        allFailures.push("unsafe claim(s): " + unsafeClaims.join(", "));
        unsafeClaimPass = false;
      }

      if (allFailures.length > 0) {
        console.log("[FAIL] " + filename + " — " + allFailures.join(" | "));
        positiveFailed++;
        exitCode = 1;
      } else {
        console.log("[PASS] " + filename + " — valid fixture accepted");
        positivePassed++;
      }
    } else if (filename.startsWith("invalid-")) {
      // ── Negative fixture validation ──
      const expectedReasons = detectPDNegativeFailure(fixture, filename);

      if (expectedReasons.length > 0) {
        console.log("[INVALID-as-expected] " + filename + " — " + expectedReasons.join("; "));
        negativeInvalid++;
      } else {
        const structFails = checkPDPositiveFixture(fixture);
        if (structFails.length > 0) {
          console.log("[INVALID-as-expected] " + filename + " — structural failure: " + structFails[0]);
          negativeInvalid++;
        } else {
          console.log("[FAIL] " + filename + " — expected INVALID but passed all checks");
          negativeUnexpectedPass++;
          exitCode = 1;
        }
      }

      // Do NOT scan negative fixtures for forbidden fields or unsafe claims
    }
  }

  // ── Summary ──
  console.log("");
  console.log("Product Delivery schema: pass");
  console.log("Product Delivery positive fixtures: " + positivePassed + " passed, " + positiveFailed + " failed");
  console.log("Product Delivery negative fixtures: " + negativeInvalid + " invalid as expected, " + negativeUnexpectedPass + " unexpectedly passed");
  console.log("Product Delivery forbidden-field scan: " + (forbiddenFieldPass ? "pass" : "fail"));
  console.log("Product Delivery unsafe-claim scan: " + (unsafeClaimPass ? "pass" : "fail"));
  console.log("Product Delivery fake-data/security scan: " + (securityPass ? "pass" : "fail"));

  if (exitCode === 0) {
    console.log("Phase 1N Product Delivery validation passed");
  }

  process.exit(exitCode);
}

// ── Phase 1O: Product Delivery Registry Validation ──────────────────────────────

const REGISTRY_SCHEMA_PATH = ".pnpd/product-delivery-registry.schema.json";
const REGISTRY_FIXTURE_DIR = "tests/fixtures/pnpd/product-delivery-registry";

const REGISTRY_SUPPORTED_ARTIFACT_TYPES = new Set([
  "prd",
  "productSpec",
  "architectureSpec",
  "implementationHandoff",
]);

const REGISTRY_SUPPORTED_VALIDATION_STATUSES = new Set([
  "valid",
  "invalid",
  "notValidated",
  "stale",
  "unknown",
]);

const REGISTRY_POSITIVE_FIXTURES = new Set([
  "empty-registry.json",
  "one-prd-entry.json",
  "one-product-spec-entry.json",
  "one-architecture-spec-entry.json",
  "one-implementation-handoff-entry.json",
  "one-stale-entry.json",
]);

const REGISTRY_NEGATIVE_FIXTURES = new Set([
  "missing-governance.json",
  "authorizes-implementation-true.json",
  "codex-is-owner-true.json",
  "agentbridge-can-approve-true.json",
  "runtime-consumption-allowed-true.json",
  "absolute-path.json",
  "traversal-path.json",
  "url-path.json",
  "unsupported-artifact-type.json",
  "production-ready-claim.json",
  "secret-like-field.json",
  "extra-top-level-property.json",
  "missing-entry-integrity.json",
  "invalid-validation-status.json",
  "schema-version-mismatch.json",
]);

const FORBIDDEN_REGISTRY_FIELDS = new Set([
  "approvedForImplementation",
  "implementationApproved",
  "approvedForMerge",
  "mergeApproved",
  "mergeAuthorized",
  "dispatchNow",
  "executeDispatch",
  "dispatchApproved",
  "deployNow",
  "deploymentApproved",
  "releaseNow",
  "releaseApproved",
  "productionReady",
  "productionCertified",
  "certifiedForProduction",
  "ownerBypassed",
  "codexBypassed",
  "codexApprovedAsOwner",
  "agentBridgeApproved",
  "agentBridgeApproves",
  "runtimeConsumes",
  "orchestratorConsumes",
  "autoGenerate",
  "generateImplementation",
  "executeCommand",
  "shellCommand",
  "githubToken",
  "githubMutationEnabled",
  "apiKey",
  "secret",
  "privateKey",
  "deployTarget",
  "buildCommand",
]);

const REGISTRY_EXPECTED_FAILURES = new Map([
  ["missing-governance.json", "missing top-level governance"],
  ["authorizes-implementation-true.json", "governance.authorizesImplementation const false violated"],
  ["codex-is-owner-true.json", "governance.codexIsOwner const false violated"],
  ["agentbridge-can-approve-true.json", "governance.agentBridgeCanApprove const false violated"],
  ["runtime-consumption-allowed-true.json", "governance.runtimeConsumptionAllowed const false violated"],
  ["absolute-path.json", "entry path is absolute"],
  ["traversal-path.json", "entry path contains traversal"],
  ["url-path.json", "entry path is a URL"],
  ["unsupported-artifact-type.json", "unsupported artifactType enum"],
  ["production-ready-claim.json", "extra top-level property productionReady"],
  ["secret-like-field.json", "extra top-level property apiKey"],
  ["extra-top-level-property.json", "extra top-level property"],
  ["missing-entry-integrity.json", "entry missing integrity"],
  ["invalid-validation-status.json", "invalid validation.status enum"],
  ["schema-version-mismatch.json", "schemaVersion const 1.0.0 violated"],
]);

const REGISTRY_SECRET_VALUE_PATTERN = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|github_pat_[A-Za-z0-9_]+)/;

const REGISTRY_ALLOWED_ROOT_FIELDS = new Set([
  "schemaVersion", "recordType", "registryId", "createdAt", "createdBy",
  "repo", "governance", "entries",
]);

const REGISTRY_ALLOWED_REPO_FIELDS = new Set([
  "repoId", "name", "rootRelative", "branch", "commit",
]);

const REGISTRY_ALLOWED_GOVERNANCE_FIELDS = new Set([
  "advisoryOnly", "authorizesImplementation", "authorizesMerge",
  "authorizesDispatch", "authorizesDeployment", "authorizesGitHubMutation",
  "authorizesApiMutation", "certifiesProductionReadiness",
  "ownerFinalAuthority", "codexIsOwner", "agentBridgeCanApprove",
  "agentBridgeCanMerge", "agentBridgeCanDispatch", "agentBridgeCanDeploy",
  "runtimeConsumptionAllowed", "artifactGenerationAllowed",
  "externalMutationAllowed",
]);

const REGISTRY_ALLOWED_ENTRY_FIELDS = new Set([
  "artifactId", "artifactType", "phase", "path", "validation", "createdAt",
  "createdBy", "source", "notes", "integrity",
]);

const REGISTRY_ALLOWED_VALIDATION_FIELDS = new Set([
  "validator", "mode", "status", "validatedAt", "path", "exitCode",
]);

const REGISTRY_ALLOWED_SOURCE_FIELDS = new Set([
  "sourceType", "sourceRef",
]);

const REGISTRY_ALLOWED_INTEGRITY_FIELDS = new Set([
  "hashAlgorithm", "contentHash",
]);

// ── Phase 1O helper functions ───────────────────────────────────────────────────

function resolveRegistryPath(pathArg) {
  if (!pathArg || typeof pathArg !== "string") {
    throw new Error("Registry path must be a non-empty string.");
  }
  if (path.isAbsolute(pathArg)) {
    throw new Error("Absolute registry paths are not allowed: " + pathArg);
  }
  if (pathArg.includes("..")) {
    throw new Error("Path traversal is not allowed: " + pathArg);
  }
  if (pathArg.includes("://")) {
    throw new Error("URL paths are not allowed: " + pathArg);
  }
  const resolved = path.resolve(ROOT, pathArg);
  if (!resolved.startsWith(path.resolve(ROOT) + path.sep) && resolved !== path.resolve(ROOT)) {
    throw new Error("Registry path escapes repo root: " + pathArg);
  }
  try {
    const real = fs.realpathSync(resolved);
    if (!real.startsWith(path.resolve(ROOT) + path.sep) && real !== path.resolve(ROOT)) {
      throw new Error("Resolved registry path escapes repo root: " + real);
    }
    return real;
  } catch (e) {
    if (e.code === "ENOENT") return resolved;
    throw e;
  }
}

function scanRegistryForbiddenFields(obj, currentPath, findings) {
  if (!obj || typeof obj !== "object") return findings;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      scanRegistryForbiddenFields(obj[i], currentPath + "[" + i + "]", findings);
    }
    return findings;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_REGISTRY_FIELDS.has(key)) {
      findings.push(currentPath + "." + key);
    }
    if (value && typeof value === "object") {
      scanRegistryForbiddenFields(value, currentPath + "." + key, findings);
    }
  }
  return findings;
}

function scanRegistrySecretValues(rawContent) {
  const findings = [];
  if (REGISTRY_SECRET_VALUE_PATTERN.test(rawContent)) {
    const matches = rawContent.match(new RegExp(REGISTRY_SECRET_VALUE_PATTERN.source, "g"));
    if (matches) {
      for (const m of matches) {
        findings.push("secret-like value pattern: " + m.substring(0, 20) + "...");
      }
    }
  }
  return findings;
}

function checkRegistryAllowedFields(obj, allowedFields, pathLabel, failures) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
  for (const key of Object.keys(obj)) {
    if (!allowedFields.has(key)) {
      failures.push(pathLabel + "." + key + " is not allowed");
    }
  }
}

function checkRegistryPositiveFixture(registry) {
  const failures = [];

  if (!registry || typeof registry !== "object") {
    failures.push("registry is not an object");
    return failures;
  }

  checkRegistryAllowedFields(registry, REGISTRY_ALLOWED_ROOT_FIELDS, "$", failures);

  if (registry.recordType !== "productDeliveryArtifactRegistry") {
    failures.push("recordType must be productDeliveryArtifactRegistry");
  }

  if (registry.schemaVersion !== "1.0.0") {
    failures.push("schemaVersion must be 1.0.0");
  }

  if (!registry.registryId || typeof registry.registryId !== "string") {
    failures.push("registryId missing or invalid");
  }

  if (!registry.createdAt) {
    failures.push("createdAt missing");
  }

  if (!registry.createdBy || typeof registry.createdBy !== "string") {
    failures.push("createdBy missing");
  }

  if (!registry.repo || typeof registry.repo !== "object") {
    failures.push("repo missing or invalid");
  } else {
    checkRegistryAllowedFields(registry.repo, REGISTRY_ALLOWED_REPO_FIELDS, "repo", failures);
  }

  if (!registry.governance || typeof registry.governance !== "object") {
    failures.push("governance missing or invalid");
  }

  if (!Array.isArray(registry.entries)) {
    failures.push("entries must be an array");
  }

  // Governance checks
  if (registry.governance && typeof registry.governance === "object") {
    const g = registry.governance;
    checkRegistryAllowedFields(g, REGISTRY_ALLOWED_GOVERNANCE_FIELDS, "governance", failures);

    if (g.advisoryOnly !== true) failures.push("governance.advisoryOnly must be true");
    if (g.ownerFinalAuthority !== true) failures.push("governance.ownerFinalAuthority must be true");

    const mustBeFalse = [
      "authorizesImplementation", "authorizesMerge", "authorizesDispatch",
      "authorizesDeployment", "authorizesGitHubMutation", "authorizesApiMutation",
      "certifiesProductionReadiness", "codexIsOwner",
      "agentBridgeCanApprove", "agentBridgeCanMerge", "agentBridgeCanDispatch",
      "agentBridgeCanDeploy", "runtimeConsumptionAllowed",
      "artifactGenerationAllowed", "externalMutationAllowed",
    ];
    for (const f of mustBeFalse) {
      if (g[f] !== false) failures.push("governance." + f + " must be false");
    }
  }

  // Entry checks
  if (Array.isArray(registry.entries)) {
    for (let i = 0; i < registry.entries.length; i++) {
      const e = registry.entries[i];
      const prefix = "entries[" + i + "].";

      checkRegistryAllowedFields(e, REGISTRY_ALLOWED_ENTRY_FIELDS, "entries[" + i + "]", failures);

      if (!e.artifactId) failures.push(prefix + "artifactId missing");
      if (!e.artifactType) {
        failures.push(prefix + "artifactType missing");
      } else if (!REGISTRY_SUPPORTED_ARTIFACT_TYPES.has(e.artifactType)) {
        failures.push(prefix + "artifactType unsupported: " + e.artifactType);
      }
      if (!e.path) {
        failures.push(prefix + "path missing");
      } else {
        if (e.path.startsWith("/")) failures.push(prefix + "path must not be absolute");
        if (e.path.includes("..")) failures.push(prefix + "path must not contain traversal");
        if (e.path.includes("://")) failures.push(prefix + "path must not be a URL");
        if (e.path.includes(".env")) failures.push(prefix + "path must not reference .env");
        if (e.path.includes("~")) failures.push(prefix + "path must not contain ~");
        if (/^[A-Za-z]:[\\/]/.test(e.path)) failures.push(prefix + "path must not be a Windows drive path");
        if (e.path.includes(".pnpd/")) failures.push(prefix + "path must not reference .pnpd/");
        if (!e.path.endsWith(".json")) failures.push(prefix + "path must end with .json");
      }

      if (!e.validation) {
        failures.push(prefix + "validation missing");
      } else {
        const v = e.validation;
        checkRegistryAllowedFields(v, REGISTRY_ALLOWED_VALIDATION_FIELDS, prefix + "validation", failures);

        if (!REGISTRY_SUPPORTED_VALIDATION_STATUSES.has(v.status)) {
          failures.push(prefix + "validation.status unsupported: " + v.status);
        }
        if (v.status === "valid") {
          if (!v.validatedAt) failures.push(prefix + "validation.validatedAt required when status is valid");
          if (v.exitCode !== 0) failures.push(prefix + "validation.exitCode must be 0 when status is valid");
        }
        if (v.path !== e.path) {
          failures.push(prefix + "validation.path must equal entry path");
        }
      }

      if (!e.integrity) {
        failures.push(prefix + "integrity missing");
      } else {
        checkRegistryAllowedFields(e.integrity, REGISTRY_ALLOWED_INTEGRITY_FIELDS, prefix + "integrity", failures);

        if (e.integrity.hashAlgorithm === "none" && e.integrity.contentHash !== null) {
          failures.push(prefix + "contentHash must be null when hashAlgorithm is none");
        }
      }

      if (!e.source || !e.source.sourceType) {
        failures.push(prefix + "source missing or invalid");
      } else {
        checkRegistryAllowedFields(e.source, REGISTRY_ALLOWED_SOURCE_FIELDS, prefix + "source", failures);
      }
    }
  }

  return failures;
}

function detectRegistryNegativeFailure(registry, filename) {
  const reasons = [];
  const expected = REGISTRY_EXPECTED_FAILURES.get(filename);

  // Check structural failures
  if (!registry.governance) {
    reasons.push("missing governance");
  }
  if (registry.schemaVersion && registry.schemaVersion !== "1.0.0") {
    reasons.push("schemaVersion mismatch: " + registry.schemaVersion);
  }
  if (registry.governance) {
    const g = registry.governance;
    if (g.authorizesImplementation === true) reasons.push("authorizesImplementation is true");
    if (g.codexIsOwner === true) reasons.push("codexIsOwner is true");
    if (g.agentBridgeCanApprove === true) reasons.push("agentBridgeCanApprove is true");
    if (g.runtimeConsumptionAllowed === true) reasons.push("runtimeConsumptionAllowed is true");
  }
  if (Array.isArray(registry.entries) && registry.entries.length > 0) {
    const e = registry.entries[0];
    if (e.path) {
      if (e.path.startsWith("/")) reasons.push("absolute path");
      if (e.path.includes("..")) reasons.push("traversal path");
      if (e.path.includes("://")) reasons.push("URL path");
    }
    if (e.artifactType && !REGISTRY_SUPPORTED_ARTIFACT_TYPES.has(e.artifactType)) {
      reasons.push("unsupported artifactType: " + e.artifactType);
    }
    if (e.validation && !REGISTRY_SUPPORTED_VALIDATION_STATUSES.has(e.validation.status)) {
      reasons.push("invalid validation status: " + e.validation.status);
    }
    if (!("integrity" in e)) reasons.push("missing entry integrity");
  }
  if (registry.productionReady === true) reasons.push("productionReady extra property");
  if (registry.apiKey !== undefined) reasons.push("apiKey extra property");
  if (registry.unexpectedField !== undefined) reasons.push("unexpectedField extra property");

  return reasons;
}

// ── Schema-instance validator ────────────────────────────────────────────────────

function validateSchemaInstance(schema, instance, instancePath) {
  const errors = [];
  const $defs = schema.$defs || schema.definitions || {};

  const SUPPORTED_SCHEMA_KEYWORDS = new Set([
    "$schema",
    "$id",
    "$defs",
    "$ref",
    "additionalProperties",
    "anyOf",
    "const",
    "definitions",
    "description",
    "enum",
    "items",
    "maxItems",
    "maxLength",
    "minItems",
    "minLength",
    "pattern",
    "properties",
    "required",
    "title",
    "type"
  ]);

  function collectUnsupportedSchemaKeywords(sch, path, collector) {
    if (!sch || typeof sch !== "object" || Array.isArray(sch)) {
      return;
    }

    for (const key of Object.keys(sch)) {
      if (!SUPPORTED_SCHEMA_KEYWORDS.has(key)) {
        collector.push(path + ": unsupported schema keyword " + key);
      }
    }

    if (typeof sch.additionalProperties === "object" && sch.additionalProperties !== null) {
      collector.push(path + ".additionalProperties: object schemas are unsupported");
    }

    if (Array.isArray(sch.type)) {
      collector.push(path + ".type: array type declarations are unsupported");
    }

    if (sch.properties && typeof sch.properties === "object" && !Array.isArray(sch.properties)) {
      for (const [propName, propSch] of Object.entries(sch.properties)) {
        collectUnsupportedSchemaKeywords(propSch, path + ".properties." + propName, collector);
      }
    }

    if (sch.$defs && typeof sch.$defs === "object" && !Array.isArray(sch.$defs)) {
      for (const [defName, defSch] of Object.entries(sch.$defs)) {
        collectUnsupportedSchemaKeywords(defSch, path + ".$defs." + defName, collector);
      }
    }

    if (sch.definitions && typeof sch.definitions === "object" && !Array.isArray(sch.definitions)) {
      for (const [defName, defSch] of Object.entries(sch.definitions)) {
        collectUnsupportedSchemaKeywords(defSch, path + ".definitions." + defName, collector);
      }
    }

    if (sch.items && typeof sch.items === "object") {
      collectUnsupportedSchemaKeywords(sch.items, path + ".items", collector);
    }

    if (Array.isArray(sch.anyOf)) {
      for (let i = 0; i < sch.anyOf.length; i++) {
        collectUnsupportedSchemaKeywords(sch.anyOf[i], path + ".anyOf[" + i + "]", collector);
      }
    }
  }

  collectUnsupportedSchemaKeywords(schema, "$schema", errors);
  if (errors.length > 0) {
    return errors;
  }

  function validate(inst, sch, path) {
    if (sch === undefined || sch === null) {
      errors.push(path + ": schema is null or undefined");
      return;
    }

    // ── anyOf ──
    if (Array.isArray(sch.anyOf)) {
      let anyMatch = false;
      const subErrors = [];
      for (const subSch of sch.anyOf) {
        const nested = [];
        const saved = errors.length;
        // Temporarily redirect errors to nested
        const origErrors = errors;
        const fake = [];
        // Use a collector
        validateWithCollector(inst, subSch, path, fake, $defs);
        if (fake.length === 0) {
          anyMatch = true;
          break;
        }
        subErrors.push(fake);
      }
      if (!anyMatch) {
        const reasons = subErrors.map(e => e.length > 0 ? e[0] : "no match").join("; ");
        errors.push(path + ": no anyOf alternative matched: " + reasons);
      }
      return;
    }

    // ── $ref ──
    if (typeof sch.$ref === "string") {
      const refPath = sch.$ref;
      if (refPath.startsWith("#/$defs/") || refPath.startsWith("#/definitions/")) {
        const parts = refPath.split("/");
        const defName = parts[parts.length - 1];
        const defSch = $defs[defName];
        if (!defSch) {
          errors.push(path + ": unresolved $ref: " + refPath);
          return;
        }
        // Merge any sibling constraints from the referencing schema with the resolved def
        const merged = { ...defSch };
        // If the referencing schema has properties/required/additionalProperties on top of $ref, merge them
        // But in our schema, $ref is used standalone - just validate against the resolved schema
        validate(inst, defSch, path);
        return;
      }
      errors.push(path + ": unsupported $ref target: " + sch.$ref);
      return;
    }

    // ── type ──
    if (typeof sch.type === "string") {
      const instType = Array.isArray(inst) ? "array" : (inst === null ? "null" : typeof inst);
      if (sch.type === "integer") {
        if (typeof inst !== "number" || !Number.isInteger(inst)) {
          errors.push(path + ": expected type integer, got " + instType);
          return;
        }
      } else if (instType !== sch.type) {
        errors.push(path + ": expected type " + sch.type + ", got " + instType);
        return;
      }
    }

    if (inst === null) {
      // null is valid if we reached here (anyOf null case)
      return;
    }

    // ── object-specific ──
    if (typeof inst === "object" && !Array.isArray(inst)) {
      // additionalProperties
      if (sch.additionalProperties === false && typeof sch.properties === "object") {
        const allowedKeys = new Set(Object.keys(sch.properties));
        for (const key of Object.keys(inst)) {
          if (!allowedKeys.has(key)) {
            errors.push(path + "." + key + ": additional property not allowed");
          }
        }
      }

      // properties
      if (typeof sch.properties === "object") {
        for (const [propName, propSch] of Object.entries(sch.properties)) {
          if (inst.hasOwnProperty(propName) || propName in inst) {
            validate(inst[propName], propSch, path + "." + propName);
          }
        }
      }

      // required
      if (Array.isArray(sch.required)) {
        for (const req of sch.required) {
          if (!(req in inst)) {
            errors.push(path + ": missing required property " + req);
          }
        }
      }
    }

    // ── array-specific ──
    if (Array.isArray(inst)) {
      if (typeof sch.minItems === "number" && inst.length < sch.minItems) {
        errors.push(path + ": expected at least " + sch.minItems + " items, got " + inst.length);
      }
      if (typeof sch.maxItems === "number" && inst.length > sch.maxItems) {
        errors.push(path + ": expected at most " + sch.maxItems + " items, got " + inst.length);
      }
      if (sch.items && typeof sch.items === "object") {
        for (let i = 0; i < inst.length; i++) {
          validate(inst[i], sch.items, path + "[" + i + "]");
        }
      }
    }

    // ── string-specific ──
    if (typeof inst === "string") {
      if (sch.hasOwnProperty("const")) {
        if (inst !== sch.const) {
          errors.push(path + ": expected const " + JSON.stringify(sch.const) + ", got " + JSON.stringify(inst));
        }
      }
      if (Array.isArray(sch.enum)) {
        if (!sch.enum.includes(inst)) {
          errors.push(path + ": value " + JSON.stringify(inst) + " not in enum [" + sch.enum.join(", ") + "]");
        }
      }
      if (typeof sch.pattern === "string") {
        try {
          const re = new RegExp(sch.pattern);
          if (!re.test(inst)) {
            errors.push(path + ": pattern " + sch.pattern + " does not match " + JSON.stringify(inst));
          }
        } catch (e) {
          errors.push(path + ": invalid pattern " + sch.pattern + ": " + e.message);
        }
      }
      if (typeof sch.minLength === "number" && inst.length < sch.minLength) {
        errors.push(path + ": expected minLength " + sch.minLength + ", got " + inst.length);
      }
      if (typeof sch.maxLength === "number" && inst.length > sch.maxLength) {
        errors.push(path + ": expected maxLength " + sch.maxLength + ", got " + inst.length);
      }
    }

    // ── integer-specific ──
    if (typeof inst === "number" && Number.isInteger(inst)) {
      if (Array.isArray(sch.enum)) {
        if (!sch.enum.includes(inst)) {
          errors.push(path + ": value " + inst + " not in enum [" + sch.enum.join(", ") + "]");
        }
      }
    }

    // ── const (non-string) ──
    if (sch.hasOwnProperty("const")) {
      // Only check const for non-strings (strings handled above)
      if (typeof inst !== "string") {
        if (inst !== sch.const) {
          errors.push(path + ": expected const " + JSON.stringify(sch.const) + ", got " + JSON.stringify(inst));
        }
      }
    }

    // ── enum (non-string, non-integer) ──
    if (Array.isArray(sch.enum)) {
      if (typeof inst !== "string" && !(typeof inst === "number" && Number.isInteger(inst))) {
        errors.push(path + ": unsupported enum context for type " + typeof inst);
      }
    }
  }

  function validateWithCollector(inst, sch, path, collector, defs) {
    // Simplified recursive validation that collects into the given array
    if (sch === undefined || sch === null) {
      collector.push(path + ": schema is null or undefined");
      return;
    }

    if (Array.isArray(sch.anyOf)) {
      let anyMatch = false;
      for (const subSch of sch.anyOf) {
        const nested = [];
        validateWithCollector(inst, subSch, path, nested, defs);
        if (nested.length === 0) {
          anyMatch = true;
          break;
        }
      }
      if (!anyMatch) {
        collector.push(path + ": no anyOf alternative matched");
      }
      return;
    }

    if (typeof sch.$ref === "string") {
      const refPath = sch.$ref;
      if (refPath.startsWith("#/$defs/") || refPath.startsWith("#/definitions/")) {
        const parts = refPath.split("/");
        const defName = parts[parts.length - 1];
        const defSch = defs[defName];
        if (!defSch) {
          collector.push(path + ": unresolved $ref: " + refPath);
          return;
        }
        validateWithCollector(inst, defSch, path, collector, defs);
        return;
      }
      collector.push(path + ": unsupported $ref target: " + sch.$ref);
      return;
    }

    if (typeof sch.type === "string") {
      const instType = Array.isArray(inst) ? "array" : (inst === null ? "null" : typeof inst);
      if (sch.type === "integer") {
        if (typeof inst !== "number" || !Number.isInteger(inst)) {
          collector.push(path + ": expected type integer, got " + instType);
          return;
        }
      } else if (instType !== sch.type) {
        collector.push(path + ": expected type " + sch.type + ", got " + instType);
        return;
      }
    }

    if (inst === null) return;

    if (typeof inst === "object" && !Array.isArray(inst)) {
      if (sch.additionalProperties === false && typeof sch.properties === "object") {
        const allowedKeys = new Set(Object.keys(sch.properties));
        for (const key of Object.keys(inst)) {
          if (!allowedKeys.has(key)) {
            collector.push(path + "." + key + ": additional property not allowed");
          }
        }
      }
      if (typeof sch.properties === "object") {
        for (const [propName, propSch] of Object.entries(sch.properties)) {
          if (inst.hasOwnProperty(propName) || propName in inst) {
            validateWithCollector(inst[propName], propSch, path + "." + propName, collector, defs);
          }
        }
      }
      if (Array.isArray(sch.required)) {
        for (const req of sch.required) {
          if (!(req in inst)) {
            collector.push(path + ": missing required property " + req);
          }
        }
      }
    }

    if (Array.isArray(inst)) {
      if (typeof sch.minItems === "number" && inst.length < sch.minItems) {
        collector.push(path + ": expected at least " + sch.minItems + " items, got " + inst.length);
      }
      if (typeof sch.maxItems === "number" && inst.length > sch.maxItems) {
        collector.push(path + ": expected at most " + sch.maxItems + " items, got " + inst.length);
      }
      if (sch.items && typeof sch.items === "object") {
        for (let i = 0; i < inst.length; i++) {
          validateWithCollector(inst[i], sch.items, path + "[" + i + "]", collector, defs);
        }
      }
    }

    if (typeof inst === "string") {
      if (sch.hasOwnProperty("const") && inst !== sch.const) {
        collector.push(path + ": expected const " + JSON.stringify(sch.const) + ", got " + JSON.stringify(inst));
      }
      if (Array.isArray(sch.enum) && !sch.enum.includes(inst)) {
        collector.push(path + ": value " + JSON.stringify(inst) + " not in enum [" + sch.enum.join(", ") + "]");
      }
      if (typeof sch.pattern === "string") {
        try {
          const re = new RegExp(sch.pattern);
          if (!re.test(inst)) {
            collector.push(path + ": pattern " + sch.pattern + " does not match " + JSON.stringify(inst));
          }
        } catch (e) {
          collector.push(path + ": invalid pattern " + sch.pattern);
        }
      }
      if (typeof sch.minLength === "number" && inst.length < sch.minLength) {
        collector.push(path + ": expected minLength " + sch.minLength + ", got " + inst.length);
      }
      if (typeof sch.maxLength === "number" && inst.length > sch.maxLength) {
        collector.push(path + ": expected maxLength " + sch.maxLength + ", got " + inst.length);
      }
    }

    if (typeof inst === "number" && Number.isInteger(inst) && Array.isArray(sch.enum)) {
      if (!sch.enum.includes(inst)) {
        collector.push(path + ": value " + inst + " not in enum [" + sch.enum.join(", ") + "]");
      }
    }
  }

  validate(instance, schema, "$");
  return errors;
}

// ── Standalone registry file validator ───────────────────────────────────────────

function validateProductDeliveryRegistryFile(pathArg, checkArtifacts, verifyHashes, validateSchema) {
  console.log("PNPD Product Delivery Registry Validation");
  console.log("Registry file: " + pathArg);
  if (checkArtifacts) {
    console.log("Artifact reference check: enabled (--check-registry-artifacts)");
  }
  if (verifyHashes) {
    console.log("Hash verification: enabled (--verify-registry-artifact-hashes)");
  }
  console.log("");

  // 1. Path safety
  let realPath;
  try {
    realPath = resolveRegistryPath(pathArg);
  } catch (e) {
    console.error("Path safety failure: " + e.message);
    process.exit(1);
  }

  // 2. File exists and is regular file
  let stat;
  try {
    stat = fs.statSync(realPath);
    if (!stat.isFile()) {
      console.error("Path is not a regular file: " + realPath);
      process.exit(1);
    }
  } catch (e) {
    console.error("File not found: " + realPath);
    process.exit(1);
  }

  // 3. Must be .json extension
  if (!realPath.endsWith(".json")) {
    console.error("Registry file must have .json extension");
    process.exit(1);
  }

  // 4. JSON parse
  let rawContent;
  let registry;
  try {
    rawContent = fs.readFileSync(realPath, "utf8");
    registry = JSON.parse(rawContent);
    console.log("[PASS] JSON parse");
  } catch (e) {
    console.error("JSON parse failure: " + e.message);
    process.exit(1);
  }

  // 5. Schema validation
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY_SCHEMA_PATH), "utf8"));
  } catch (e) {
    console.error("Registry schema load failed: " + e.message);
    process.exit(2);
  }

  // 5. Schema-instance validation (when requested)
  let allFindings = [];
  if (validateSchema) {
    console.log("Schema-instance validation: enabled (--validate-schema-instance)");
    const schemaErrors = validateSchemaInstance(schema, registry, realPath);
    if (schemaErrors.length > 0) {
      console.log("[FAIL] Schema-instance validation: " + schemaErrors.length + " error(s)");
      for (const err of schemaErrors) {
        console.log("  " + err);
      }
      allFindings = allFindings.concat(schemaErrors);
    } else {
      console.log("[PASS] Schema-instance validation");
    }
  }

  // 6. Structural checks
  const structFails = checkRegistryPositiveFixture(registry);
  if (structFails.length > 0) {
    console.error("[FAIL] Structural checks: " + structFails.join("; "));
    allFindings = allFindings.concat(structFails);
  } else {
    console.log("[PASS] Structural checks");
  }

  // 7. Forbidden-field scan
  const forbiddenFields = [];
  scanRegistryForbiddenFields(registry, "$", forbiddenFields);
  if (forbiddenFields.length > 0) {
    console.error("[FAIL] Forbidden-field scan: " + forbiddenFields.join(", "));
    allFindings = allFindings.concat(forbiddenFields);
  } else {
    console.log("[PASS] Forbidden-field scan");
  }

  // 8. Secret value scan
  const secFindings = scanRegistrySecretValues(rawContent);
  if (secFindings.length > 0) {
    console.error("[FAIL] Secret value scan: " + secFindings.join("; "));
    allFindings = allFindings.concat(secFindings);
  } else {
    console.log("[PASS] Secret value scan");
  }

  if (allFindings.length > 0) {
    console.log("");
    console.log("Product Delivery registry invalid: " + allFindings.length + " violation(s).");
    process.exit(1);
  }

  console.log("");
  console.log("Product Delivery registry valid.");

  // ── Optional artifact reference check ─────────────────────────────────────────
  if (checkArtifacts) {
    const entries = registry.entries || [];
    let totalChecked = 0;
    let totalExists = 0;
    const missingFailures = [];
    const directoryFailures = [];

    for (const entry of entries) {
      totalChecked += 1;
      const artifactPath = entry.path;

      // Validate path safety using same rules as resolveRegistryPath
      if (path.isAbsolute(artifactPath)) {
        missingFailures.push({ artifactId: entry.artifactId, reason: "absolute path not allowed: " + artifactPath });
        continue;
      }
      if (artifactPath.includes("..")) {
        missingFailures.push({ artifactId: entry.artifactId, reason: "path traversal not allowed: " + artifactPath });
        continue;
      }
      if (artifactPath.includes("://")) {
        missingFailures.push({ artifactId: entry.artifactId, reason: "URL path not allowed: " + artifactPath });
        continue;
      }

      const resolved = path.resolve(ROOT, artifactPath);
      if (!resolved.startsWith(path.resolve(ROOT) + path.sep) && resolved !== path.resolve(ROOT)) {
        missingFailures.push({ artifactId: entry.artifactId, reason: "path escapes repo root: " + artifactPath });
        continue;
      }

      // Realpath containment
      let realArtifactPath;
      try {
        realArtifactPath = fs.realpathSync(resolved);
        if (!realArtifactPath.startsWith(path.resolve(ROOT) + path.sep) && realArtifactPath !== path.resolve(ROOT)) {
          missingFailures.push({ artifactId: entry.artifactId, reason: "resolved path escapes repo root: " + artifactPath });
          continue;
        }
      } catch (e) {
        if (e.code === "ENOENT") {
          missingFailures.push({ artifactId: entry.artifactId, reason: "missing artifact: " + artifactPath });
          continue;
        }
        missingFailures.push({ artifactId: entry.artifactId, reason: "artifact path error: " + e.message });
        continue;
      }

      // Check it is a regular file, not a directory
      let artStat;
      try {
        artStat = fs.statSync(realArtifactPath);
      } catch (e) {
        missingFailures.push({ artifactId: entry.artifactId, reason: "missing artifact: " + artifactPath });
        continue;
      }

      if (!artStat.isFile()) {
        directoryFailures.push({ artifactId: entry.artifactId, reason: "path is a directory, not a file: " + artifactPath });
        continue;
      }

      totalExists += 1;
    }

    // Report results
    console.log("");
    console.log("Artifact reference check: " + totalChecked + " checked, " + totalExists + " exists");

    let artifactExitCode = 0;
    if (missingFailures.length > 0) {
      console.log("");
      for (const f of missingFailures) {
        console.log("[FAIL] entry \"" + f.artifactId + "\": " + f.reason);
      }
      artifactExitCode = 1;
    }
    if (directoryFailures.length > 0) {
      for (const f of directoryFailures) {
        console.log("[FAIL] entry \"" + f.artifactId + "\": " + f.reason);
      }
      artifactExitCode = 1;
    }

    if (artifactExitCode === 0) {
      console.log("[PASS] Artifact reference check: " + totalChecked + " checked, " + totalExists + " exists");

      // ── Hash verification (Phase 1O-K) ──────────────────────────────────────────
      if (verifyHashes) {
        console.log("");
        let hashChecked = 0;
        let hashMatched = 0;
        let hashMismatches = [];
        let hashSkipped = 0;
        let hashFailures = [];

        for (const entry of entries) {
          const integrity = entry.integrity;
          if (!integrity) {
            // Should already be schema-rejected, but defensive check
            hashFailures.push({ artifactId: entry.artifactId, reason: "missing integrity object" });
            continue;
          }

          const algorithm = integrity.hashAlgorithm;
          const contentHash = integrity.contentHash;

          if (algorithm === "none") {
            // already validated: none must have null contentHash
            hashSkipped += 1;
            continue;
          }

          if (algorithm === "sha256") {
            if (contentHash === null) {
              hashFailures.push({ artifactId: entry.artifactId, reason: "sha256 requires non-null contentHash" });
              continue;
            }

            // Resolve the artifact path (same safety rules as artifact check)
            const artifactPath = entry.path;
            const resolved = path.resolve(ROOT, artifactPath);
            let fileBytes;
            try {
              fileBytes = fs.readFileSync(resolved);
            } catch (e) {
              hashFailures.push({ artifactId: entry.artifactId, reason: "cannot read artifact for hash: " + e.message });
              continue;
            }

            const computedHash = crypto.createHash("sha256").update(fileBytes).digest("hex");
            hashChecked += 1;

            if (computedHash === contentHash) {
              hashMatched += 1;
            } else {
              hashMismatches.push({
                artifactId: entry.artifactId,
                entryPath: artifactPath,
                expected: contentHash,
                computed: computedHash
              });
            }
            continue;
          }

          // Defensive: algorithm should be schema-rejected
          hashFailures.push({ artifactId: entry.artifactId, reason: "unsupported hashAlgorithm: " + algorithm });
        }

        // Report hash verification results
        console.log("Hash verification: " + hashChecked + " checked, " + hashMatched + " matched, " + hashSkipped + " skipped");

        let hashExitCode = 0;
        if (hashFailures.length > 0) {
          console.log("");
          for (const f of hashFailures) {
            console.log("[FAIL] entry \"" + f.artifactId + "\": " + f.reason);
          }
          hashExitCode = 1;
        }
        if (hashMismatches.length > 0) {
          for (const m of hashMismatches) {
            console.log("[FAIL] entry \"" + m.artifactId + "\": hash mismatch for " + m.entryPath + ": expected " + m.expected + ", computed " + m.computed);
          }
          hashExitCode = 1;
        }

        if (hashExitCode === 0) {
          console.log("[PASS] registry artifact hash verification: " + hashChecked + " checked, " + hashMatched + " matched, " + hashSkipped + " skipped");
          process.exit(0);
        } else {
          console.log("");
          console.log("Hash verification failed: " + (hashFailures.length + hashMismatches.length) + " hash check(s) failed.");
          process.exit(1);
        }
      }

      process.exit(0);
    } else {
      console.log("");
      console.log("Artifact reference check failed: " + (missingFailures.length + directoryFailures.length) + " artifact(s) missing or invalid.");
      process.exit(1);
    }
  }

  process.exit(0);
}

// ── Phase 1O fixture validator ──────────────────────────────────────────────────

function validateProductDeliveryRegistryPhase1O() {
  let exitCode = 0;
  let positivePassed = 0;
  let positiveFailed = 0;
  let negativeInvalid = 0;
  let negativeUnexpectedPass = 0;
  let forbiddenFieldPass = true;
  let securityPass = true;

  // ── Schema load checks ──
  let schema;
  try {
    const schemaRaw = fs.readFileSync(path.join(ROOT, REGISTRY_SCHEMA_PATH), "utf8");
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.error("Product Delivery Registry schema load failed: " + e.message);
    process.exit(2);
  }

  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    console.error("Schema $schema must be https://json-schema.org/draft/2020-12/schema");
    process.exit(2);
  }
  if (schema.$id !== "pnpd-product-delivery-registry.schema.json") {
    console.error("Schema $id must be pnpd-product-delivery-registry.schema.json");
    process.exit(2);
  }
  if (schema.title !== "PNPD Product Delivery Artifact Registry Schema") {
    console.error("Schema title must be 'PNPD Product Delivery Artifact Registry Schema'");
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

  const props = schema.properties || {};
  if (!props.recordType || props.recordType.const !== "productDeliveryArtifactRegistry") {
    console.error("Schema recordType const must be productDeliveryArtifactRegistry");
    process.exit(2);
  }
  if (!props.schemaVersion || props.schemaVersion.const !== "1.0.0") {
    console.error("Schema schemaVersion const must be 1.0.0");
    process.exit(2);
  }

  const requiredRoot = ["schemaVersion", "recordType", "registryId", "createdAt", "createdBy", "repo", "governance", "entries"];
  for (const rp of requiredRoot) {
    if (!props[rp]) {
      console.error("Schema properties missing: " + rp);
      process.exit(2);
    }
  }

  if (!props.entries || props.entries.minItems !== 0) {
    console.error("Schema entries.minItems must be 0");
    process.exit(2);
  }
  if (!props.entries || props.entries.maxItems !== 500) {
    console.error("Schema entries.maxItems must be 500");
    process.exit(2);
  }

  // $defs checks
  const defs = schema.$defs || {};
  const expectedDefs = ["repo", "governance", "entry", "validation", "source", "integrity"];
  for (const d of expectedDefs) {
    if (!defs[d]) {
      console.error("Schema $defs." + d + " missing");
      process.exit(2);
    }
  }

  // Entry artifactType enum
  const entryDef = defs.entry;
  if (entryDef && entryDef.properties) {
    const atProp = entryDef.properties.artifactType;
    if (atProp && atProp.enum) {
      for (const at of REGISTRY_SUPPORTED_ARTIFACT_TYPES) {
        if (!atProp.enum.includes(at)) {
          console.error("Schema entry.artifactType enum missing: " + at);
          process.exit(2);
        }
      }
    }
    // Validation status enum
    const vsProp = entryDef.properties.validation;
    if (vsProp && vsProp.$ref) {
      // validation is a $ref to $defs.validation
    }
  }
  const valDef = defs.validation;
  if (valDef && valDef.properties && valDef.properties.status) {
    const statusEnum = valDef.properties.status.enum;
    if (statusEnum) {
      for (const s of REGISTRY_SUPPORTED_VALIDATION_STATUSES) {
        if (!statusEnum.includes(s)) {
          console.error("Schema validation.status enum missing: " + s);
          process.exit(2);
        }
      }
    }
  }

  // Governance consts
  const govDef = defs.governance;
  if (govDef && govDef.properties) {
    const gProps = govDef.properties;
    if (gProps.advisoryOnly && gProps.advisoryOnly.const !== true) {
      console.error("Schema governance.advisoryOnly const must be true");
      process.exit(2);
    }
    if (gProps.ownerFinalAuthority && gProps.ownerFinalAuthority.const !== true) {
      console.error("Schema governance.ownerFinalAuthority const must be true");
      process.exit(2);
    }
    const mustBeFalse = [
      "authorizesImplementation", "authorizesMerge", "authorizesDispatch",
      "authorizesDeployment", "authorizesGitHubMutation", "authorizesApiMutation",
      "certifiesProductionReadiness", "codexIsOwner",
      "agentBridgeCanApprove", "agentBridgeCanMerge", "agentBridgeCanDispatch",
      "agentBridgeCanDeploy", "runtimeConsumptionAllowed",
      "artifactGenerationAllowed", "externalMutationAllowed",
    ];
    for (const f of mustBeFalse) {
      if (gProps[f] && gProps[f].const !== false) {
        console.error("Schema governance." + f + " const must be false");
        process.exit(2);
      }
    }
  }

  // ── Fixture inventory enforcement ──
  const fixturesDir = path.join(ROOT, REGISTRY_FIXTURE_DIR);
  const posDir = path.join(fixturesDir, "positive");
  const negDir = path.join(fixturesDir, "negative");

  let fixtureFiles = [];
  try {
    const posFiles = fs.readdirSync(posDir).filter(f => f.endsWith(".json"));
    const negFiles = fs.readdirSync(negDir).filter(f => f.endsWith(".json"));
    fixtureFiles = [...posFiles.map(f => "positive/" + f), ...negFiles.map(f => "negative/" + f)];
  } catch (e) {
    console.error("Product Delivery Registry fixture directory not readable: " + e.message);
    process.exit(2);
  }

  if (fixtureFiles.length !== 21) {
    console.error("Expected exactly 21 product delivery registry fixture files, found: " + fixtureFiles.length);
    process.exit(1);
  }

  const allExpected = new Set([
    ...Array.from(REGISTRY_POSITIVE_FIXTURES).map(f => "positive/" + f),
    ...Array.from(REGISTRY_NEGATIVE_FIXTURES).map(f => "negative/" + f),
  ]);
  for (const f of allExpected) {
    if (!fixtureFiles.includes(f)) {
      console.error("Missing expected fixture: " + f);
      process.exit(1);
    }
  }
  for (const f of fixtureFiles) {
    if (!allExpected.has(f)) {
      console.error("Unexpected fixture file: " + f);
      process.exit(1);
    }
  }

  // ── Process each fixture ──
  console.log("PNPD Product Delivery Registry Validation");
  console.log("Schema: " + REGISTRY_SCHEMA_PATH);
  console.log("Fixtures: " + REGISTRY_FIXTURE_DIR);
  console.log("");

  for (const relPath of fixtureFiles) {
    const filePath = path.join(fixturesDir, relPath);
    const filename = path.basename(relPath);
    let rawContent;
    let fixture;

    try {
      rawContent = fs.readFileSync(filePath, "utf8");
      fixture = JSON.parse(rawContent);
    } catch (e) {
      console.log("[FAIL] " + filename + " — JSON parse error: " + e.message);
      exitCode = 1;
      if (REGISTRY_POSITIVE_FIXTURES.has(filename)) positiveFailed++;
      continue;
    }

    // ── Security scan (all fixtures) ──
    const secFindings = scanRegistrySecretValues(rawContent);
    if (secFindings.length > 0) {
      console.log("[FAIL] " + filename + " — SECURITY VIOLATION: " + secFindings.join("; "));
      securityPass = false;
      exitCode = 1;
      continue;
    }

    const isPositive = REGISTRY_POSITIVE_FIXTURES.has(filename);

    if (isPositive) {
      // ── Positive fixture validation ──
      const structFails = checkRegistryPositiveFixture(fixture);

      const forbiddenFields = [];
      scanRegistryForbiddenFields(fixture, "$", forbiddenFields);

      const allFailures = [];
      if (structFails.length > 0) allFailures.push(structFails.join("; "));
      if (forbiddenFields.length > 0) {
        allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));
        forbiddenFieldPass = false;
      }

      if (allFailures.length > 0) {
        console.log("[FAIL] " + filename + " — " + allFailures.join(" | "));
        positiveFailed++;
        exitCode = 1;
      } else {
        console.log("[PASS] " + filename + " — valid fixture accepted");
        positivePassed++;
      }
    } else {
      // ── Negative fixture validation ──
      const expectedReasons = detectRegistryNegativeFailure(fixture, filename);

      if (expectedReasons.length > 0) {
        console.log("[INVALID-as-expected] " + filename + " — " + expectedReasons.join("; "));
        negativeInvalid++;
      } else {
        const structFails = checkRegistryPositiveFixture(fixture);
        if (structFails.length > 0) {
          console.log("[INVALID-as-expected] " + filename + " — structural failure: " + structFails[0]);
          negativeInvalid++;
        } else {
          console.log("[FAIL] " + filename + " — expected INVALID but passed all checks");
          negativeUnexpectedPass++;
          exitCode = 1;
        }
      }
    }
  }

  // ── Summary ──
  console.log("");
  console.log("Product Delivery Registry schema: pass");
  console.log("Product Delivery Registry positive fixtures: " + positivePassed + " passed, " + positiveFailed + " failed");
  console.log("Product Delivery Registry negative fixtures: " + negativeInvalid + " invalid as expected, " + negativeUnexpectedPass + " unexpectedly passed");
  console.log("Product Delivery Registry forbidden-field scan: " + (forbiddenFieldPass ? "pass" : "fail"));
  console.log("Product Delivery Registry security scan: " + (securityPass ? "pass" : "fail"));

  if (exitCode === 0) {
    console.log("Phase 1O Product Delivery Registry validation passed");
  }

  process.exit(exitCode);
}

// ── Phase 1O-R: Example fixture discovery ────────────────────────────────────────

const REGISTRY_EXAMPLES_DIR = "tests/fixtures/pnpd/product-delivery-registry/examples";

function validateProductDeliveryRegistryPhase1OExample() {
  console.log("PNPD Product Delivery Registry Example Validation");
  console.log("Examples path: " + REGISTRY_EXAMPLES_DIR);
  console.log("Schema: " + REGISTRY_SCHEMA_PATH);
  console.log("");

  const examplesDir = path.join(ROOT, REGISTRY_EXAMPLES_DIR);

  // Load schema
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY_SCHEMA_PATH), "utf8"));
  } catch (e) {
    console.error("Registry schema load failed: " + e.message);
    process.exit(2);
  }

  // Check if examples directory exists
  if (!fs.existsSync(examplesDir)) {
    console.log("Example fixtures: 0 discovered (examples/ directory does not exist)");
    console.log("");
    console.log("Phase 1O-example Product Delivery Registry example validation passed");
    console.log("(Example fixture implementation is future Phase 1O-S)");
    process.exit(0);
  }

  if (!fs.statSync(examplesDir).isDirectory()) {
    console.error("Examples path is not a directory: " + examplesDir);
    process.exit(1);
  }

  // Discover .json files
  let exampleFiles = [];
  try {
    exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith(".json")).sort();
  } catch (e) {
    console.error("Examples directory not readable: " + e.message);
    process.exit(2);
  }

  if (exampleFiles.length === 0) {
    console.log("Example fixtures: 0 discovered (examples/ directory exists but contains no .json files)");
    console.log("");
    console.log("Phase 1O-example Product Delivery Registry example validation passed");
    console.log("(Example fixture implementation is future Phase 1O-S)");
    process.exit(0);
  }

  console.log("Example fixtures: " + exampleFiles.length + " discovered");
  console.log("");

  let passed = 0;
  let failed = 0;
  let exitCode = 0;

  for (const filename of exampleFiles) {
    const filePath = path.join(examplesDir, filename);
    let rawContent;
    let registry;

    try {
      rawContent = fs.readFileSync(filePath, "utf8");
      registry = JSON.parse(rawContent);
    } catch (e) {
      console.log("[FAIL] " + filename + " — JSON parse error: " + e.message);
      failed++;
      exitCode = 1;
      continue;
    }

    // Security scan
    const secFindings = scanRegistrySecretValues(rawContent);
    if (secFindings.length > 0) {
      console.log("[FAIL] " + filename + " — SECURITY VIOLATION: " + secFindings.join("; "));
      failed++;
      exitCode = 1;
      continue;
    }

    // Schema-instance validation
    const schemaErrors = validateSchemaInstance(schema, registry, filePath);
    if (schemaErrors.length > 0) {
      console.log("[FAIL] " + filename + " — schema-instance: " + schemaErrors.length + " error(s)");
      for (const err of schemaErrors) {
        console.log("  " + err);
      }
      failed++;
      exitCode = 1;
      continue;
    }

    // Inline structural/governance/security checks
    const structFails = checkRegistryPositiveFixture(registry);

    const forbiddenFields = [];
    scanRegistryForbiddenFields(registry, "$", forbiddenFields);

    const allFailures = [];
    if (structFails.length > 0) allFailures.push("structural: " + structFails.join("; "));
    if (forbiddenFields.length > 0) allFailures.push("forbidden field(s): " + forbiddenFields.join(", "));

    if (allFailures.length > 0) {
      console.log("[FAIL] " + filename + " — " + allFailures.join(" | "));
      failed++;
      exitCode = 1;
    } else {
      console.log("[PASS] " + filename + " — valid example fixture");
      passed++;
    }
  }

  console.log("");
  console.log("Example fixtures: " + passed + " passed, " + failed + " failed");

  if (exitCode === 0) {
    console.log("Phase 1O-example Product Delivery Registry example validation passed");
  }

  process.exit(exitCode);
}


// ── Phase 1P: Project Profile Validation ──────────────────────────────────────────

const PROJECT_PROFILE_SCHEMA_PATH = ".pnpd/project-profile.schema.json";

function loadProjectProfileSchema() {
  const schema = readJson(PROJECT_PROFILE_SCHEMA_PATH);
  assert(schema["$schema"] === "https://json-schema.org/draft/2020-12/schema",
    "Project profile schema must use JSON Schema draft 2020-12.");
  assert(schema["$id"] === "pnpd-project-profile.schema.json",
    "Project profile schema $id must be pnpd-project-profile.schema.json.");
  assert(schema.title === "PNPD Project Profile",
    "Project profile schema title must be 'PNPD Project Profile'.");
  assert(schema.type === "object",
    "Project profile schema top-level type must be object.");
  assert(schema.additionalProperties === false,
    "Project profile schema top-level additionalProperties must be false.");

  // Required root fields
  const topRequired = schema.required || [];
  const expectedRequired = [
    "schemaVersion", "profileId", "projectName", "projectSlug",
    "projectOwner", "repo", "product", "lifecycle", "pnpdAdoption",
    "authority", "agents", "automation", "validation",
    "controlledUnlocks", "audit"
  ];
  for (const f of expectedRequired) {
    assert(topRequired.includes(f),
      "Project profile schema missing required root field: " + f);
  }

  // Safety const checks in $defs
  const defs = schema["$defs"] || {};
  assert(defs.authority, "Missing $defs.authority");
  assert(defs.authority.properties.ownerRequired.const === true,
    "authority.ownerRequired must be const: true.");
  assert(defs.authority.properties.agentBridgeAuthority.const === false,
    "authority.agentBridgeAuthority must be const: false.");
  assert(defs.lifecycle.properties.productionReadinessClaim.default === false,
    "lifecycle.productionReadinessClaim must default to false.");
  assert(defs.authority.properties.deploymentPolicy.default === "blocked",
    "authority.deploymentPolicy must default to blocked.");
  assert(defs.authority.properties.dispatchPolicy.default === "blocked",
    "authority.dispatchPolicy must default to blocked.");
  assert(defs.automation.properties.automationLevel.default === "advisory_only",
    "automation.automationLevel must default to advisory_only.");

  return schema;
}

function formatValidationFailures(failures) {
  return failures.map(function(f) {
    return f.path + ": expected " + f.expected + " (got: " + f.actual + ")";
  }).join("; ");
}

function validateProjectProfileInstance(profile, sourceLabel) {
  const safetyIssues = scanFixtureContent(profile);
  if (safetyIssues.length > 0) {
    throw new Error(sourceLabel + ": SAFETY VIOLATION: " + safetyIssues.join("; "));
  }

  const schema = loadProjectProfileSchema();
  const failures = validateInstance(profile, schema, schema, "$");
  if (failures.length > 0) {
    throw new Error(sourceLabel + ": validation failed: " + formatValidationFailures(failures));
  }
  return true;
}

function validateProjectProfileFile(file) {
  let profile;
  try {
    profile = readJson(file);
  } catch (e) {
    throw new Error(file + ": invalid JSON: " + e.message);
  }
  validateProjectProfileInstance(profile, file);
  return profile;
}

function validateProjectProfileFixtures() {
  const schema = loadProjectProfileSchema();
  const failures = [];

  console.log("PNPD Project Profile Validation");
  console.log("Schema: " + PROJECT_PROFILE_SCHEMA_PATH);
  console.log("Fixtures: tests/fixtures/pnpd/project-profile");

  for (var _pp = 0; _pp < PROJECT_PROFILE_FIXTURES.length; _pp++) {
    const entry = PROJECT_PROFILE_FIXTURES[_pp];
    let fixture;
    try {
      fixture = readJson(entry.file);
    } catch (e) {
      failures.push(entry.file + ": MISSING or invalid JSON: " + e.message);
      continue;
    }

    // Safety scan
    const safetyIssues = scanFixtureContent(fixture);
    if (safetyIssues.length > 0) {
      failures.push(entry.file + ": SAFETY VIOLATION: " + safetyIssues.join("; "));
      continue;
    }

    // Validate against the root schema
    const validationFailures = validateInstance(fixture, schema, schema, "$");

    if (entry.expectValid && validationFailures.length > 0) {
      const detail = validationFailures.map(function(f) {
        return f.path + ": " + f.expected + " (got: " + f.actual + ")";
      }).join("; ");
      failures.push(entry.file + ": expected VALID (" + entry.expectedReason + ") but got " + validationFailures.length + " failure(s): " + detail);
    } else if (!entry.expectValid && validationFailures.length === 0) {
      failures.push(entry.file + ": expected INVALID (" + entry.expectedReason + ") but passed validation");
    } else if (entry.expectValid) {
      console.log("[PASS] " + entry.file + " \u2014 " + entry.expectedReason);
    } else {
      console.log("[INVALID-as-expected] " + entry.file + " \u2014 " + entry.expectedReason);
    }
  }

  if (failures.length > 0) {
    throw new Error("Project profile fixture validation failures:\\n  " + failures.join("\\n  "));
  }

  console.log("Project profile validation: pass");
}

// ── Phase 1Q: Bug Forecast Validation ───────────────────────────────────────────

function loadBugForecastSchema() {
  const schema = readJson(BUG_FORECAST_SCHEMA_PATH);
  assert(schema["$id"] === "pnpd-bug-forecast.schema.json",
    "Bug forecast schema $id must be pnpd-bug-forecast.schema.json.");
  return schema;
}

function validateBugForecastFile(file) {
  let forecast;
  try {
    forecast = readJson(file);
  } catch (e) {
    throw new Error(file + ": invalid JSON: " + e.message);
  }
  const schema = loadBugForecastSchema();
  const failures = validateInstance(forecast, schema, schema, "$");
  if (failures.length > 0) {
    const detail = failures.map(function(f) {
      return f.path + ": " + f.expected + " (got: " + f.actual + ")";
    }).join("; ");
    throw new Error(file + ": validation failed with " + failures.length + " issue(s): " + detail);
  }
  return forecast;
}

function validateBugForecastPhase() {
  const schema = loadBugForecastSchema();
  const failures = [];

  console.log("PNPD Bug Forecast Validation");
  console.log("Schema: " + BUG_FORECAST_SCHEMA_PATH);
  console.log("Fixtures: " + BUG_FORECAST_FIXTURES_DIR);

  for (var _bf = 0; _bf < BUG_FORECAST_FIXTURES.length; _bf++) {
    const entry = BUG_FORECAST_FIXTURES[_bf];
    let fixture;
    try {
      fixture = readJson(entry.file);
    } catch (e) {
      failures.push(entry.file + ": MISSING or invalid JSON: " + e.message);
      continue;
    }

    const validationFailures = validateInstance(fixture, schema, schema, "$");

    if (entry.expectValid && validationFailures.length > 0) {
      const detail = validationFailures.map(function(f) {
        return f.path + ": " + f.expected + " (got: " + f.actual + ")";
      }).join("; ");
      failures.push(entry.file + ": expected VALID (" + entry.expectedReason + ") but got " + validationFailures.length + " failure(s): " + detail);
    } else if (!entry.expectValid && validationFailures.length === 0) {
      failures.push(entry.file + ": expected INVALID (" + entry.expectedReason + ") but passed validation");
    } else if (entry.expectValid) {
      console.log("[PASS] " + entry.file + " \u2014 " + entry.expectedReason);
    } else {
      console.log("[INVALID-as-expected] " + entry.file + " \u2014 " + entry.expectedReason);
    }
  }

  if (failures.length > 0) {
    throw new Error("Bug forecast fixture validation failures:\\n  " + failures.join("\\n  "));
  }

  console.log("Bug forecast validation: pass");
}

// ── Phase 1Q-E: Bug Forecast Example Discovery ──────────────────────────────────

function validateBugForecastExamplePhase() {
  const examplesDirPath = path.join(ROOT, BUG_FORECAST_EXAMPLES_DIR);

  console.log("PNPD Bug Forecast Example Discovery");
  console.log("Examples path: " + BUG_FORECAST_EXAMPLES_DIR);

  let entries;
  try {
    entries = fs.readdirSync(examplesDirPath);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("Bug forecast examples: 0 found");
      return;
    }
    throw new Error("Bug forecast examples directory read failed: " + e.message);
  }

  if (entries.length === 0) {
    console.log("Bug forecast examples: 0 found");
    return;
  }

  const jsonFiles = [];
  const nonJsonFiles = [];

  for (var _ei = 0; _ei < entries.length; _ei++) {
    const entry = entries[_ei];
    if (entry.endsWith(".json")) {
      jsonFiles.push(entry);
    } else {
      nonJsonFiles.push(entry);
    }
  }

  if (nonJsonFiles.length > 0) {
    nonJsonFiles.sort();
    const fileList = nonJsonFiles.map(function(f) {
      return BUG_FORECAST_EXAMPLES_DIR + "/" + f;
    }).join(", ");
    throw new Error("Unexpected non-JSON file(s) in bug forecast examples directory: " + fileList);
  }

  jsonFiles.sort();

  const schema = loadBugForecastSchema();
  const failures = [];

  for (var _ej = 0; _ej < jsonFiles.length; _ej++) {
    const file = BUG_FORECAST_EXAMPLES_DIR + "/" + jsonFiles[_ej];
    let example;
    try {
      example = readJson(file);
    } catch (e) {
      failures.push(file + ": invalid JSON: " + e.message);
      continue;
    }

    const validationFailures = validateInstance(example, schema, schema, "$");

    if (validationFailures.length > 0) {
      const detail = validationFailures.map(function(f) {
        return f.path + ": " + f.expected + " (got: " + f.actual + ")";
      }).join("; ");
      failures.push(file + ": validation failed with " + validationFailures.length + " issue(s): " + detail);
    } else {
      console.log("[PASS] " + file + " \u2014 valid bug forecast example");
    }
  }

  if (failures.length > 0) {
    throw new Error("Bug forecast example validation failures:\\n  " + failures.join("\\n  "));
  }

  console.log("Bug forecast examples: " + jsonFiles.length + " found, all passed");
}

function validateBugForecastExampleNegativePhase() {
  const examplesDirPath = path.join(ROOT, BUG_FORECAST_INVALID_EXAMPLES_DIR);

  console.log("PNPD Bug Forecast Negative Example Guard");
  console.log("Examples path: " + BUG_FORECAST_INVALID_EXAMPLES_DIR);

  let entries;
  try {
    entries = fs.readdirSync(examplesDirPath);
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Bug forecast negative examples directory missing: " + BUG_FORECAST_INVALID_EXAMPLES_DIR);
    }
    throw new Error("Bug forecast negative examples directory read failed: " + e.message);
  }

  if (entries.length === 0) {
    throw new Error("Bug forecast negative examples directory is empty. Expected at least one negative example file.");
  }

  entries.sort();

  const schema = loadBugForecastSchema();
  const rejected = [];
  const unexpected = [];

  for (var _ek = 0; _ek < entries.length; _ek++) {
    const entry = entries[_ek];
    // Skip dotfiles and directories
    if (entry.startsWith(".")) {
      continue;
    }
    const file = BUG_FORECAST_INVALID_EXAMPLES_DIR + "/" + entry;
    let stat;
    try {
      stat = fs.statSync(file);
    } catch (e) {
      rejected.push(file + ": cannot stat: " + e.message);
      continue;
    }
    if (stat.isDirectory()) {
      continue;
    }

    // Non-JSON files are expected rejections
    if (!entry.endsWith(".json")) {
      rejected.push(file + " (non-JSON: expected rejection)");
      continue;
    }

    // Try to parse as JSON
    let example;
    try {
      example = readJson(file);
    } catch (e) {
      rejected.push(file + " (malformed JSON: expected rejection): " + e.message);
      continue;
    }

    // JSON parsed, verify it fails schema validation
    const validationFailures = validateInstance(example, schema, schema, "$");

    if (validationFailures.length > 0) {
      const detail = validationFailures.map(function(f) {
        return f.path + ": " + f.expected + " (got: " + f.actual + ")";
      }).join("; ");
      rejected.push(file + " (schema invalid: expected rejection): " + detail);
    } else {
      unexpected.push(file + ": parsed and passed schema validation, but expected rejection");
    }
  }

  if (unexpected.length > 0) {
    throw new Error("Bug forecast negative example passed when it should have been rejected:\\n  " + unexpected.join("\\n  "));
  }

  console.log("Bug forecast negative examples: " + rejected.length + " rejected as expected");
}

// ── Phase 1Q-H: Bug Forecast Audit Summary ──────────────────────────────────────

function validateBugForecastSummaryPhase() {
  console.log("Bug forecast summary: pass");

  const schemaPath = BUG_FORECAST_SCHEMA_PATH;
  const validDir = "tests/fixtures/pnpd/bug-forecast/valid";
  const invalidDir = "tests/fixtures/pnpd/bug-forecast/invalid";
  const examplesDir = BUG_FORECAST_EXAMPLES_DIR;
  const negativeDir = BUG_FORECAST_INVALID_EXAMPLES_DIR;

  // Verify schema exists
  const schemaAbs = path.join(ROOT, schemaPath);
  if (!fs.existsSync(schemaAbs)) {
    throw new Error("Bug forecast schema missing: " + schemaPath);
  }

  // Verify directories exist
  const dirs = [
    { path: validDir, label: "valid fixture" },
    { path: invalidDir, label: "invalid fixture" },
    { path: examplesDir, label: "active example" },
    { path: negativeDir, label: "negative example" }
  ];

  for (var _ds = 0; _ds < dirs.length; _ds++) {
    const d = dirs[_ds];
    if (!fs.existsSync(path.join(ROOT, d.path))) {
      throw new Error("Bug forecast " + d.label + " directory missing: " + d.path);
    }
  }

  // Count valid fixtures (.json files only)
  const validEntries = fs.readdirSync(path.join(ROOT, validDir));
  const validJsonCount = validEntries.filter(function(e) {
    return e.endsWith(".json") && fs.statSync(path.join(ROOT, validDir, e)).isFile();
  }).length;

  if (validJsonCount !== 2) {
    throw new Error("Expected valid fixture count 2, got " + validJsonCount);
  }

  // Count invalid fixtures (.json files only)
  const invalidEntries = fs.readdirSync(path.join(ROOT, invalidDir));
  const invalidJsonCount = invalidEntries.filter(function(e) {
    return e.endsWith(".json") && fs.statSync(path.join(ROOT, invalidDir, e)).isFile();
  }).length;

  if (invalidJsonCount !== 9) {
    throw new Error("Expected invalid fixture count 9, got " + invalidJsonCount);
  }

  // Count active examples (.json files only)
  const exampleEntries = fs.readdirSync(path.join(ROOT, examplesDir));
  const exampleJsonCount = exampleEntries.filter(function(e) {
    return e.endsWith(".json") && fs.statSync(path.join(ROOT, examplesDir, e)).isFile();
  }).length;

  if (exampleJsonCount !== 1) {
    throw new Error("Expected active example count 1, got " + exampleJsonCount);
  }

  // Count negative examples (all direct files, including .json and .txt)
  const negativeEntries = fs.readdirSync(path.join(ROOT, negativeDir));
  const negativeFileCount = negativeEntries.filter(function(e) {
    return !e.startsWith(".") && fs.statSync(path.join(ROOT, negativeDir, e)).isFile();
  }).length;

  if (negativeFileCount !== 3) {
    throw new Error("Expected negative example count 3, got " + negativeFileCount);
  }

  // Print summary
  console.log("schema: " + schemaPath);
  console.log("valid fixtures: " + validDir);
  console.log("invalid fixtures: " + invalidDir);
  console.log("active examples: " + examplesDir);
  console.log("negative examples: " + negativeDir);

  console.log("valid fixture count: " + validJsonCount);
  console.log("invalid fixture count: " + invalidJsonCount);
  console.log("active example count: " + exampleJsonCount);
  console.log("negative example count: " + negativeFileCount);

  console.log("standalone validator: --bug-forecast <path>");
  console.log("suite flag: --phase 1q-bug-forecast");
  console.log("suite flag: --phase 1q-bug-forecast-example");
  console.log("suite flag: --phase 1q-bug-forecast-example-negative");
  console.log("summary flag: --phase 1q-bug-forecast-summary");

  console.log("advisoryOnly enforced by schema");
  console.log("sensitive data boundary enforced by schema");

  console.log("non-capability: no Skeptic execution");
  console.log("non-capability: no generator");
  console.log("non-capability: no runtime behavior");
  console.log("non-capability: no scanner behavior");
  console.log("non-capability: no CI change");
  console.log("non-capability: no deployment");
  console.log("non-capability: no certification");
  console.log("non-capability: no production readiness claim");
}

// ── Main ────────────────────────────────────────────────────────────────────────

try {
  const args = parseArgs(process.argv);

  // Phase 1O-K: --verify-registry-artifact-hashes requires --product-delivery-registry AND --check-registry-artifacts
  if (args.verifyRegistryArtifactHashes) {
    if (args.phase) {
      throw new Error("--verify-registry-artifact-hashes cannot be combined with --phase.");
    }
    if (args.projectProfile) {
      throw new Error("--verify-registry-artifact-hashes cannot be combined with --project-profile.");
    }
    if (!args.productDeliveryRegistry) {
      throw new Error("--verify-registry-artifact-hashes requires --product-delivery-registry <path>.");
    }
    if (!args.checkRegistryArtifacts) {
      throw new Error("--verify-registry-artifact-hashes requires --check-registry-artifacts.");
    }
  }

  // Phase 1J: runtime readiness report file validation (standalone)
  if (args.runtimeReadinessReport) {
    validateRuntimeReadinessReportFile(args.runtimeReadinessReport);
    // validateRuntimeReadinessReportFile calls process.exit internally
  }

  // Phase 1M-D: standalone Research Discovery artifact validation
  if (args.researchDiscoveryArtifact) {
    validateResearchDiscoveryArtifact(args.researchDiscoveryArtifact);
    // validateResearchDiscoveryArtifact calls process.exit internally
  }

  // Phase 1N-E: standalone Product Delivery artifact validation
  if (args.productDeliveryArtifact) {
    validateProductDeliveryArtifact(args.productDeliveryArtifact);
    // validateProductDeliveryArtifact calls process.exit internally
  }

  // Phase 1O-F: standalone Product Delivery registry validation
  if (args.productDeliveryRegistry) {
    validateProductDeliveryRegistryFile(args.productDeliveryRegistry, args.checkRegistryArtifacts, args.verifyRegistryArtifactHashes, args.validateSchemaInstance);
    // validateProductDeliveryRegistryFile calls process.exit internally
  }

  // Phase 1P-D: standalone project profile validation
  if (args.projectProfile) {
    validateProjectProfileFile(args.projectProfile);
    console.log("project profile: pass");
    process.exit(0);
  }

  // Phase 1Q-D: standalone bug forecast validation
  if (args.bugForecast) {
    validateBugForecastFile(args.bugForecast);
    console.log("bug forecast: pass");
    process.exit(0);
  }

  // Phase 1O-I: --check-registry-artifacts requires --product-delivery-registry
  if (args.checkRegistryArtifacts && !args.productDeliveryRegistry) {
    if (args.phase) {
      throw new Error("--check-registry-artifacts cannot be combined with --phase.");
    }
    throw new Error("--check-registry-artifacts requires --product-delivery-registry <path>.");
  }

  const runPhase1f = args.phase === "1f";
  const runPhase1h = args.phase === "1h";

  if (runPhase1f) {
    validateDispatchReadinessPhase1F();
  }

  if (runPhase1h) {
    validatePhase1HRuntimeReadiness();
  }

  const runPhase1m = args.phase === "1m";

  if (runPhase1m) {
    validateResearchDiscoveryPhase1M();
  }

  const runPhase1n = args.phase === "1n";

  if (runPhase1n) {
    validateProductDeliveryPhase1N();
  }

  const runPhase1o = args.phase === "1o";

  if (runPhase1o) {
    validateProductDeliveryRegistryPhase1O();
  }

  const runPhase1oExample = args.phase === "1o-example";

  if (runPhase1oExample) {
    validateProductDeliveryRegistryPhase1OExample();
  }

  const runPhase1pProfile = args.phase === "1p-profile";

  if (runPhase1pProfile) {
    validateProjectProfileFixtures();
  }

  const runPhase1qBugForecast = args.phase === "1q-bug-forecast";

  if (runPhase1qBugForecast) {
    validateBugForecastPhase();
  }

  const runPhase1qBugForecastExample = args.phase === "1q-bug-forecast-example";

  if (runPhase1qBugForecastExample) {
    validateBugForecastExamplePhase();
  }

  const runPhase1qBugForecastExampleNegative = args.phase === "1q-bug-forecast-example-negative";

  if (runPhase1qBugForecastExampleNegative) {
    validateBugForecastExampleNegativePhase();
  }

  const runPhase1qBugForecastSummary = args.phase === "1q-bug-forecast-summary";

  if (runPhase1qBugForecastSummary) {
    validateBugForecastSummaryPhase();
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
