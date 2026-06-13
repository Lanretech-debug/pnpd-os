# PNPD OS Phase 1H-B Runtime Readiness Schema Proposal Design

## Status

- **Phase:** `PHASE_1H_B_RUNTIME_READINESS_SCHEMA_DESIGN_DOC`
- **Hermes verdict:** `HERMES_PHASE_1H_B_RUNTIME_READINESS_SCHEMA_PROPOSAL_DESIGN_READY`
- **Baseline:** `main` at `8bfe1cb` (`merge: Phase 1H-A PNPD runtime readiness report design into main`)
- **Prior design:** Phase 1H-A runtime readiness report design pushed (commit `89f39f8`)
- **Remote CI:** run `27469237440` passed earlier for Phase 1G-D
- **Document type:** docs-only schema proposal design
- **No schema implementation is included.**
- **No fixtures are included.**
- **No validator support is included.**
- **No runtime generator is included.**
- **No dispatch is included.**

## Purpose

Propose the future JSON Schema shape for advisory runtime readiness records.

This document:

- Preserves advisory-only semantics from Phase 1H-A.
- Preserves Owner final authority.
- Preserves Codex audit requirement.
- Preserves AgentBridge coordination-only role.
- Keeps dispatch blocked.
- Defines safe future schema boundaries before Phase 1H-C schema implementation.
- Provides a concrete, reviewable schema proposal that Codex can audit independently.

## Non-Purpose

This document is **not**:

- A schema implementation.
- `.pnpd/runtime-readiness.schema.json`.
- Fixture implementation.
- Validator integration.
- `--phase 1h` support.
- Runtime report generation.
- Report writing.
- CI validation.
- GitHub/API access.
- Dispatch permission.
- Deployment permission.
- Production-readiness certification.
- Owner approval.
- Codex audit replacement.

## Current Baseline

| Item | Status |
|------|--------|
| `main` aligned with `origin/main` | Yes |
| Head commit | `8bfe1cb` |
| Phase 1H-A design doc | Present — `docs/pnpd/orchestrator-phase-1h-runtime-readiness-report-design.md` |
| `package.json` | Present with validate, dry-run, test scripts |
| Quickstart | Present — `docs/quickstart-local.md` |
| README quick local verification section | Present |
| CI workflow | Present — `.github/workflows/pnpd-ci.yml` |
| Prior remote CI run `27469237440` | Passed (`success`) |
| Validators (default, `--phase 0/1b/1c/1f`) | All pass |
| Dry-run (text + JSON) | Passes; dispatch blocked |
| Dispatch | Blocked and not implemented |
| Runtime readiness schema | Absent |
| Runtime readiness fixtures | Absent |
| Runtime readiness generator | Absent |
| Runtime readiness validator (`--phase 1h`) | Absent |
| Dependencies | None |
| Lockfiles | None |
| State dirs after cleanup | None |
| Deployment | None |
| Daemon/watcher | None |
| Installer/packaging | None |

## Recommended Schema Path And Naming

| Attribute | Recommendation |
|-----------|---------------|
| Future schema path (Phase 1H-C) | `.pnpd/runtime-readiness.schema.json` |
| Record type constant | `pnpd.runtimeReadiness` |
| Schema draft | Draft 2020-12 |
| Preferred naming | Advisory runtime readiness, or runtime review readiness |
| Readiness status naming rule | Names must avoid implying execution capability |

**Avoid** names that imply execution:
- `dispatchReadyButNotExecuted` — "dispatchReady" suggests execution capability.

**Prefer** these softer, review-oriented status names:

| Status value | Meaning |
|-------------|---------|
| `reviewUnavailable` | No readiness review can be generated yet |
| `reviewBlocked` | Review is blocked by unresolved gates |
| `eligibleForOwnerReview` | Evidence gathered; ready for Owner review |
| `ownerApprovedPendingCodex` | Owner reviewed; awaiting Codex audit |
| `codexAuditedPendingOwnerFinal` | Codex audited; awaiting Owner final decision |
| `readyForManualOwnerDecisionButNotExecuted` | All evidence in; only Owner manual decision remains; no automatic execution |

## Proposed Top-Level Schema Model

The future schema should define a **closed** top-level object with these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `schemaVersion` | string | Yes | Schema version identifier |
| `recordType` | string (const) | Yes | Must be `pnpd.runtimeReadiness` |
| `recordId` | string | Yes | Unique record identifier |
| `generatedAt` | string (ISO 8601) | Yes | Generation timestamp |
| `repo` | object | Yes | Repository metadata |
| `source` | object | Yes | Evidence source metadata |
| `validation` | object | Yes | Validation results |
| `dryRun` | object | Yes | Dry-run results |
| `authority` | object | Yes | Authority flags |
| `safety` | object | Yes | Safety constants |
| `readiness` | object | Yes | Readiness assessment |
| `integrity` | object | Yes | Content integrity |
| `audit` | object | Yes | Audit trail |

Rules:

- `additionalProperties: false` at top level.
- `additionalProperties: false` inside all nested objects.
- Required fields must be explicit in the schema.
- Nullable fields only where intentionally allowed.
- `generatedAt` format must be `date-time` (ISO 8601).
- Schema validation remains separate from dry-run behavior.
- The schema validates shape; semantic rules are enforced by the validator.

## Proposed $defs

The following reusable definitions are proposed for the future schema:

| `$def` name | Purpose |
|------------|---------|
| `repo` | Repository metadata fields |
| `source` | Evidence source metadata fields |
| `validation` | Validation result fields |
| `dryRun` | Dry-run result fields |
| `authority` | Authority flag fields |
| `safety` | Safety constant fields |
| `readiness` | Readiness assessment fields |
| `blocker` | Individual blocker item |
| `evidence` | Evidence reference |
| `integrity` | Content integrity fields |
| `audit` | Audit trail fields |
| `classification` | Valid classification values |
| `readinessStatus` | Valid readiness status enum |
| `safetyConstants` | Const-enforced safety fields |
| `authorityConstants` | Const-enforced authority fields |
| `nonEmptyString` | Non-empty string pattern |
| `isoDateTime` | ISO 8601 date-time format |

## Repo Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Repository identifier |
| `name` | string | Yes | Human-readable repository name |
| `path` | string | Yes | Local filesystem path |
| `branch` | string | Yes | Current branch name |
| `commit` | string | Yes | Current HEAD commit hash |
| `dirty` | boolean | Yes | Whether working tree has uncommitted changes |
| `protectedBranch` | boolean | Yes | Whether current branch is protected |

Fixtures policy:

- Fixture paths must use fake/test paths only (e.g., `/tmp/pnpd-fixtures/example-app`).
- No real `/Users/...` paths in fixtures.
- No production URLs in fixtures.
- No real repository identifiers in fixtures.

## Source Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `localOnly` | boolean (const) | Yes | Must be `true` in early phases |
| `remoteCiObserved` | boolean | Yes | Whether remote CI was observed |
| `remoteCiProvider` | string | No | Provider name (e.g., `GitHub Actions`) |
| `remoteCiRunId` | string | No | Remote CI run identifier |
| `remoteCiStatus` | string | No | Remote CI job status |
| `remoteCiConclusion` | string | No | Remote CI job conclusion |
| `remoteCiUrl` | string | No | Remote CI run URL |
| `externalApiUsed` | boolean (const) | Yes | Must be `false` in early phases |
| `manualEvidenceOnly` | boolean (const) | Yes | Must be `true` in early phases |

Rules:

- Early phases use local-only evidence.
- Remote CI evidence is manually supplied metadata only.
- Automated GitHub/API lookup is deferred to later governed phases.
- `externalApiUsed` must be `false` in early phases.
- `manualEvidenceOnly` must be `true` in early phases.
- If `remoteCiObserved` is `false`, all remote CI fields must be `null`.
- If `remoteCiObserved` is `true`, `remoteCiConclusion` must be `success`.

## Validation Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `npmValidatePassed` | boolean | Yes | `npm run validate` exit code 0 |
| `npmDryRunPassed` | boolean | Yes | `npm run dry-run` exit code 0 |
| `npmTestPassed` | boolean | Yes | `npm test` exit code 0 |
| `validatorPhasesPassed` | array of string | Yes | Phases that passed validation |
| `dispatchReadinessFixturesPassed` | boolean | Yes | Dispatch readiness fixture validation passed |
| `runtimeReadinessSchemaValidated` | boolean | Yes | Runtime readiness schema validated (future only) |
| `runtimeReadinessFixturesValidated` | boolean | Yes | Runtime readiness fixtures validated (future only) |

Rules:

- `runtimeReadinessSchemaValidated` and `runtimeReadinessFixturesValidated` must be `false` until their respective phases exist.
- Existing default, Phase 0, Phase 1B, Phase 1C, and Phase 1F validators must remain unchanged.
- The validator must not alter any existing validation behavior.

## Dry Run Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `classification` | string | Yes | Current PNPD classification |
| `dispatchEnabled` | boolean (const) | Yes | Must be `false` |
| `dispatchAllowed` | boolean (const) | Yes | Must be `false` |
| `dispatchBlockedReason` | string | Yes | Human-readable blocked reason |
| `externalWritesImplemented` | boolean (const) | Yes | Must be `false` |
| `maxParallelDispatch` | integer (const) | Yes | Must be `0` |
| `protectedBranchBlocked` | boolean | Yes | Whether protected-branch gate blocks dispatch |

Locked expectations:

- `dispatchEnabled` MUST be `false`.
- `dispatchAllowed` MUST be `false`.
- `externalWritesImplemented` MUST be `false`.
- `maxParallelDispatch` MUST be `0`.

## Authority Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ownerApproved` | boolean | Yes | Owner has approved |
| `codexAudited` | boolean | Yes | Codex has completed audit |
| `agentBridgeMayApprove` | boolean (const) | Yes | Must be `false` |
| `agentBridgeMayMerge` | boolean (const) | Yes | Must be `false` |
| `agentBridgeMayDeploy` | boolean (const) | Yes | Must be `false` |
| `agentBridgeMayDispatch` | boolean (const) | Yes | Must be `false` |
| `agentBridgeMayCertifyProduction` | boolean (const) | Yes | Must be `false` |
| `ownerFinalAuthority` | boolean (const) | Yes | Must be `true` |
| `codexAuditRequired` | boolean (const) | Yes | Must be `true` |

Rules:

- Owner remains final authority.
- Codex audit remains required.
- All AgentBridge authority flags must be `false`.
- `ownerApproved` and `codexAudited` are evidence fields; they do not automatically authorize execution.
- `ownerApproved` defaults to `false` unless manually supplied as external evidence in a later governed phase.
- `codexAudited` defaults to `false` unless manually supplied as external evidence in a later governed phase.

## Safety Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `advisoryOnly` | boolean (const) | Yes | Must be `true` |
| `authorizesDispatch` | boolean (const) | Yes | Must be `false` |
| `authorizesDeployment` | boolean (const) | Yes | Must be `false` |
| `authorizesMerge` | boolean (const) | Yes | Must be `false` |
| `certifiesProductionReadiness` | boolean (const) | Yes | Must be `false` |
| `executesDispatch` | boolean (const) | Yes | Must be `false` |
| `mutatesGitHub` | boolean (const) | Yes | Must be `false` |
| `usesSecrets` | boolean (const) | Yes | Must be `false` |
| `externalWritesAllowed` | boolean (const) | Yes | Must be `false` |
| `secretsPresent` | boolean | Yes | Whether secrets were detected |
| `stateDirsPresent` | boolean | Yes | Whether PNPD state dirs exist |
| `deploymentConfigured` | boolean (const) | Yes | Must be `false` |
| `daemonConfigured` | boolean (const) | Yes | Must be `false` |
| `installerConfigured` | boolean (const) | Yes | Must be `false` |
| `githubMutationAllowed` | boolean (const) | Yes | Must be `false` |

Locked expectations:

- `advisoryOnly` MUST be `true`.
- `authorizesDispatch` MUST be `false`.
- `authorizesDeployment` MUST be `false`.
- `authorizesMerge` MUST be `false`.
- `certifiesProductionReadiness` MUST be `false`.
- `executesDispatch` MUST be `false`.
- `mutatesGitHub` MUST be `false`.
- `usesSecrets` MUST be `false`.
- `externalWritesAllowed` MUST be `false`.
- `secretsPresent` MUST be `false`.
- `stateDirsPresent` MUST be `false`.
- `deploymentConfigured` MUST be `false`.
- `daemonConfigured` MUST be `false`.
- `installerConfigured` MUST be `false`.
- `githubMutationAllowed` MUST be `false`.

## Readiness Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string (enum) | Yes | Readiness status |
| `blockers` | array of blocker | Yes | Active blockers |
| `remainingRisks` | array of string | Yes | Identified remaining risks |
| `nextSafestStep` | string | Yes | Recommended next step |

Blockers (`blocker` item):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Blocker identifier |
| `description` | string | Yes | Human-readable description |
| `severity` | string | Yes | `blocking` or `advisory` |
| `resolvedBy` | string | No | Who or what resolves this blocker |

Recommended `readinessStatus` enum:

| Value | Meaning |
|-------|---------|
| `reviewUnavailable` | No readiness review can be generated yet |
| `reviewBlocked` | Review is blocked by unresolved gates |
| `eligibleForOwnerReview` | Evidence gathered; ready for Owner review |
| `ownerApprovedPendingCodex` | Owner reviewed; awaiting Codex audit |
| `codexAuditedPendingOwnerFinal` | Codex audited; awaiting Owner final decision |
| `readyForManualOwnerDecisionButNotExecuted` | All evidence present; only manual Owner decision remains |

Rules:

- All readiness statuses are **advisory only**.
- No status executes dispatch.
- No status authorizes deployment.
- No status replaces Owner decision.
- No status replaces Codex audit.
- AMBER, RED, and `AMBER_NOT_CODEX_AUDITED` must never pair with final/manual decision statuses.

## Integrity Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contentHash` | string | Yes | Hash of canonicalized content |
| `hashAlgorithm` | string | Yes | Algorithm used (e.g., `sha256`) |
| `canonicalization` | string | Yes | Canonicalization method |

Rules:

- Content hash may be required in future schema; it may be deferred if too early for the current phase.
- Canonicalization should be deterministic if later enforced.
- Hash values in fixtures must be fake, safe, and deterministic.
- No real content hashes in fixtures.

## Audit Object

Proposed fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hermesDesigned` | boolean | Yes | Hermes completed design |
| `deepseekImplemented` | boolean | Yes | DeepSeek completed implementation |
| `codexAudited` | boolean | Yes | Codex completed audit |
| `ownerDecisionRequired` | boolean | Yes | Owner decision is required |
| `mergeAllowed` | boolean (const) | Yes | Must be `false` |
| `pushAllowed` | boolean (const) | Yes | Must be `false` |

Rules:

- `mergeAllowed` MUST be `false`.
- `pushAllowed` MUST be `false`.
- Codex audit and owner decision are tracked as evidence, not automatic authority.
- The report itself does not authorize merge or push.

## Locked Constants

These constants must be enforced by the future schema via `const`:

```
recordType                         = "pnpd.runtimeReadiness"

source.localOnly                   = true
source.externalApiUsed             = false
source.manualEvidenceOnly          = true

dryRun.dispatchEnabled             = false
dryRun.dispatchAllowed             = false
dryRun.externalWritesImplemented   = false
dryRun.maxParallelDispatch         = 0

authority.agentBridgeMayApprove              = false
authority.agentBridgeMayMerge                = false
authority.agentBridgeMayDeploy               = false
authority.agentBridgeMayDispatch             = false
authority.agentBridgeMayCertifyProduction    = false
authority.ownerFinalAuthority                = true
authority.codexAuditRequired                 = true

safety.advisoryOnly                 = true
safety.authorizesDispatch           = false
safety.authorizesDeployment         = false
safety.authorizesMerge              = false
safety.certifiesProductionReadiness = false
safety.executesDispatch             = false
safety.mutatesGitHub                = false
safety.usesSecrets                  = false
safety.externalWritesAllowed        = false
safety.deploymentConfigured         = false
safety.daemonConfigured             = false
safety.installerConfigured          = false
safety.githubMutationAllowed        = false

audit.mergeAllowed                  = false
audit.pushAllowed                   = false
```

Total: 30 locked constants.

## Forbidden Field Names

The following field names must be recursively forbidden in any runtime readiness record. Their presence must cause a validation failure in the future `--phase 1h` validator:

| Forbidden field | Rationale |
|-----------------|-----------|
| `approvedForDispatch` | Dispatch is never approved by a report |
| `dispatchApproved` | Dispatch is never approved |
| `dispatchNow` | Dispatch is never executed automatically |
| `executeDispatch` | Dispatch is never executed |
| `deployApproved` | Deployment is never approved by a report |
| `productionReady` | Reports do not certify production |
| `productionCertified` | Reports do not certify production |
| `mergeApproved` | Merge is never approved by a report |
| `ownerBypassed` | Owner is never bypassed |
| `codexBypassed` | Codex is never bypassed |
| `agentBridgeApproved` | AgentBridge never approves |
| `agentBridgeCanDeploy` | AgentBridge never deploys |
| `githubMutationEnabled` | GitHub mutation is never enabled |
| `secretsEnabled` | Secrets are never enabled |
| `autoDispatch` | Auto-dispatch is never allowed |
| `autonomousDispatch` | Autonomous dispatch is never allowed |
| `releaseApproved` | Release is never approved by a report |
| `agentBridgeCanApprove` | AgentBridge never approves |
| `agentBridgeCanMerge` | AgentBridge never merges |
| `agentBridgeCanDispatch` | AgentBridge never dispatches |
| `agentBridgeCanCertifyProduction` | AgentBridge never certifies production |
| `externalWritesEnabled` | External writes are never enabled |
| `deployNow` | Deploy is never triggered automatically |
| `releaseNow` | Release is never triggered automatically |
| `productionCertifiedByAgent` | Production is never certified by an agent |

These are **prohibition/design language only** in this Phase 1H-B document. They will be enforced later by validator logic in Phase 1H-E.

## JSON Schema Expressible Rules

Rules that can be expressed directly in JSON Schema (Draft 2020-12):

| Mechanism | Applied to |
|-----------|-----------|
| `const` | `recordType`, all locked constants |
| `enum` | `readiness.status`, `classification`, `blocker.severity` |
| `required` | All non-nullable top-level and nested fields |
| `additionalProperties: false` | Top-level object and all nested objects |
| `format: date-time` | `generatedAt` |
| `if`/`then`/`else` | Remote CI conditional: if `remoteCiObserved=true` then remote CI fields required, else all remote CI fields must be `null` |

Specific expressible rules:

- Record type const: `"const": "pnpd.runtimeReadiness"`.
- Safety consts: all 15 safety booleans enforced with `const`.
- Authority consts: all 9 authority booleans enforced with `const`.
- Dry-run consts: `dispatchEnabled`, `dispatchAllowed`, `externalWritesImplemented` enforced with `const`; `maxParallelDispatch` enforced with `const: 0`.
- Audit consts: `mergeAllowed` and `pushAllowed` enforced with `const: false`.
- Source consts: `localOnly`, `externalApiUsed`, `manualEvidenceOnly` enforced with `const`.
- All objects closed with `additionalProperties: false`.
- Readiness status values restricted to the 6-enum set.

## Validator-Only Semantic Rules

Rules that require Phase 1H-E validator logic (cannot be expressed in JSON Schema alone):

| Rule | Enforcement |
|------|-------------|
| AMBER/RED/AMBER_NOT_CODEX_AUDITED must not pair with final/manual decision statuses | Validator cross-field check |
| If `ownerApproved=false` and `codexAudited=false`, status must not be owner/codex/final states | Validator cross-field check |
| If `source.externalApiUsed=true`, fail in early phases | Validator semantic check |
| If `dryRun.dispatchEnabled=true`, fail | Validator semantic check |
| If `dryRun.dispatchAllowed=true`, fail | Validator semantic check |
| If forbidden field names appear recursively anywhere in record, fail | Recursive field scan |
| If fake-data/security scan fails, fail | Security scanner |
| Report validation must not change dispatch state | Invariant check |
| `source.remoteCiConclusion` must be `success` when `remoteCiObserved=true` | Validator cross-field check |
| All positive fixtures pass; all negative fixtures fail as expected | Fixture harness |

## Fixture Plan For Phase 1H-D

### Positive fixtures (must pass validation)

| Fixture file | Description |
|-------------|-------------|
| `valid-minimal-review-blocked.json` | Minimal valid record with dispatch blocked |
| `valid-remote-ci-observed-success.json` | Remote CI observed with `success` conclusion |
| `valid-codex-review-required.json` | Codex review required state |

### Negative fixtures (must fail as expected)

| Fixture file | Expected failure reason |
|-------------|------------------------|
| `invalid-authorizes-dispatch.json` | `safety.authorizesDispatch` is `true` (const violation) |
| `invalid-agentbridge-authority.json` | AgentBridge authority flag is `true` (const violation) |
| `invalid-production-certified.json` | `safety.certifiesProductionReadiness` is `true` (const violation) |
| `invalid-github-mutation-allowed.json` | `safety.githubMutationAllowed` is `true` (const violation) |
| `invalid-remote-ci-failure-marked-ready.json` | `remoteCiConclusion` is `failure` but readiness claims eligible (semantic violation) |
| `invalid-amber-final-readiness.json` | AMBER classification with final readiness status (semantic violation) |
| `invalid-forbidden-field-name.json` | Contains `approvedForDispatch` field (forbidden-field violation) |
| `invalid-missing-required-field.json` | Missing required field (required violation) |
| `invalid-external-api-used.json` | `source.externalApiUsed` is `true` (const violation) |
| `invalid-write-allowed.json` | `safety.externalWritesAllowed` is `true` (const violation) |

### Fake-data policy

All fixtures must use:

- Fake repo ID/name only (e.g., `example-app`, `pnpd-fixture-repo`).
- Fake local paths (e.g., `/tmp/pnpd-fixtures/example-app`).
- Fake run IDs (e.g., `0000000000`).
- Fake record IDs (e.g., `pnpd-rr-00000000-0000-0000-0000-000000000000`).
- Fake hashes only (e.g., `0000000000000000000000000000000000000000000000000000000000000000`).
- No real `/Users/...` paths.
- No production URLs.
- No secrets.
- No `.env`.
- No tokens.
- No real repository identifiers.

## Future Validator Plan For Phase 1H-E

When Phase 1H-E is implemented:

- Validator must be **explicit-only**: `--phase 1h`.
- Default validator (no `--phase` flag) unchanged.
- Phase 0, Phase 1B, Phase 1C, Phase 1F validators unchanged.
- Schema parse: load `.pnpd/runtime-readiness.schema.json`.
- Fixture discovery: scan `tests/fixtures/pnpd/runtime-readiness/`.
- Positives pass: all positive fixtures validate without error.
- Negatives fail as expected: each negative fixture must produce the expected failure.
- Recursive forbidden-field scan: scan entire record tree for forbidden field names.
- Semantic cross-field checks: enforce conditional rules beyond schema.
- Fake-data/security scan: detect real paths, URLs, secrets, tokens.
- Dry-run behavior unchanged: validator does not alter dry-run output.

## Future Generator Implications

- No generator in Phase 1H-B.
- Console-only generator deferred to Phase 1H-F.
- Write flag deferred to Phase 1H-G.
- No writes by default.
- `--no-write` means zero writes.
- No GitHub/API access in any phase.
- No scheduler side effects.
- No dispatch side effects.
- No approval side effects.
- No CI propagation unless explicitly governed.

## Safety And Governance Boundaries

This schema proposal and all its future implementations must maintain:

### Safety

- No dispatch execution.
- No deployment.
- No daemon/watcher.
- No installer/packaging.
- No secrets.
- No external mutation.
- No GitHub/API write access.
- No production-readiness claim.
- No authority escalation.

### Governance

- **Owner remains final authority.** No report, schema, or process overrides Owner decisions.
- **Codex audit remains required.** Schema validation does not replace Codex review.
- **AgentBridge cannot approve, merge, deploy, certify, or dispatch.** AgentBridge coordinates, records state, prepares handoffs, and supports review.
- **Runtime readiness records are review aids only.** They do not authorize execution.

## Codex Audit Checklist

Codex should verify:

- [ ] Only allowed docs file changed: `docs/pnpd/orchestrator-phase-1h-b-runtime-readiness-schema-design.md`.
- [ ] No schema implementation (no `.pnpd/runtime-readiness.schema.json`).
- [ ] No fixtures (no `tests/fixtures/pnpd/runtime-readiness/`).
- [ ] No validator changes (no `--phase 1h` support).
- [ ] No runtime changes.
- [ ] No package changes.
- [ ] No CI changes.
- [ ] No README/quickstart changes.
- [ ] No dependency or lockfile.
- [ ] Advisory-only wording throughout.
- [ ] No authority escalation.
- [ ] No dispatch, deploy, or production claims (except as prohibition).
- [ ] No GitHub/API mutation language.
- [ ] No secrets — no API keys, tokens, or credentials.
- [ ] Locked constants complete (30 constants).
- [ ] Forbidden field list complete (25 fields).
- [ ] Readiness status names are non-executing.
- [ ] Future phase split preserved.
- [ ] All current gates pass.

## Owner Decisions Required

The owner must decide:

1. Approve Phase 1H-B schema proposal.
2. Approve future schema path `.pnpd/runtime-readiness.schema.json`.
3. Approve record type `pnpd.runtimeReadiness`.
4. Approve softer readiness status names (non-executing).
5. Approve locked constants (30 constants).
6. Approve forbidden field list (25 fields).
7. Approve schema-before-fixtures-before-validator sequence.
8. Approve explicit-only `--phase 1h` for future validator.
9. Approve no writes by default.
10. Approve no GitHub/API access.
11. Confirm dispatch remains blocked.
12. Confirm no production-readiness claim.
13. Confirm Codex audit required before merge.

## Next Safest Step

1. **Codex audit** of this docs-only schema proposal.
2. **Owner merge decision** after Codex audit.
3. **No Phase 1H-C schema implementation yet.**
4. No fixtures.
5. No validator (`--phase 1h`).
6. No generator.
7. No writes.
8. No CI changes.
9. No dispatch.
10. No deployment.
11. No daemonization.
12. No installer/packaging.
13. No GitHub/API mutation.
