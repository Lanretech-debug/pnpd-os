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

const SECRET_KEY_PATTERN = /(token|secret|password|private[_-]?key|api[_-]?key|authorization|auth[_-]?header)/i;
const SECRET_VALUE_PATTERN = /(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

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

function validateRepoSchema(schema) {
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

function validateOutputSchema(schema) {
  assert(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "Output schema must use JSON Schema draft 2020-12.");
  assert(schema.properties?.mode?.const === "dry-run", "Output schema must force dry-run mode.");
  assert(schema.properties?.dispatchEnabled?.const === false, "Output schema must force dispatchEnabled false.");
  assert(schema.$defs?.repoResult?.properties?.dispatchAllowed?.const === false, "Output schema must force dispatchAllowed false.");
  const stateEnum = schema.$defs?.repoResult?.properties?.classification?.enum || [];
  for (const state of STATES) {
    assert(stateEnum.includes(state), `Output schema missing state ${state}.`);
  }
}

function validateRegistry(registry) {
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

try {
  validateRepoSchema(readJson(".pnpd/repos.schema.json"));
  validateOutputSchema(readJson(".pnpd/orchestrator.schema.json"));
  validateRegistry(readJson(".pnpd/repos.example.json"));
  console.log("pnpd schema validation ok");
} catch (error) {
  console.error(`pnpd schema validation failed: ${error.message}`);
  process.exit(1);
}
