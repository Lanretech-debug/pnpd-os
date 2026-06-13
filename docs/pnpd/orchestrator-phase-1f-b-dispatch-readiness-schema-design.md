# PNPD Orchestrator Phase 1F-B1 Dispatch Readiness Schema Proposal

## 1. Status

| Field | Value |
|-------|-------|
| **Status** | `PHASE_1F_B1_DISPATCH_READINESS_SCHEMA_PROPOSAL` |
| **Source design** | `HERMES_PHASE_1F_B_DISPATCH_READINESS_SCHEMA_DESIGN_READY` |
| **Scope** | Docs-only schema proposal |
| **Schema implementation** | None |
| **Runtime changes** | None |
| **Validator changes** | None |
| **Fixture changes** | None |
| **Dispatch implementation** | None |
| **GitHub/API mutation** | None |
| **Deploy behavior** | None |
| **Daemon behavior** | None |
| **Installer/packaging behavior** | None |
| **Date** | 2026-06-13 |
| **Branch** | `deepseek/phase1f-b-dispatch-readiness-schema-design` |

## 2. Baseline

**Branch baseline:** `main`
**Latest pushed commit:** `ba67edb` — `merge: Phase 1F-A PNPD dispatch readiness design into main`

### Completed capabilities

- Manual dry-run
- JSON dry-run
- Explicit ledger writer (`--write-ledger`)
- Explicit handoff writer (`--write-handoff`)
- Explicit lockfile protection (`--use-lock`, `--lock-dir <path>`)
- Disabled-by-default bounded local scheduler scaffold (`--schedule-once`, `--schedule-interval-ms`, `--schedule-max-runs`, `--scheduler-plan`)
- Dispatch readiness design docs (Phase 1F-A)

### Current blocked capabilities

- Dispatch runtime
- Dispatch flags
- GitHub/API mutation
- Deployment
- Daemonization
- Installer/packaging
- Production scheduling
- Autonomous approval/merge/certification

### Current safety guarantees

- Default dry-run writes nothing
- `--json` dry-run writes nothing
- `--no-write` prevents all local state writes
- All writes are explicit opt-in
- Scheduler is disabled by default, local-only, bounded, lock-gated, non-authoritative
- Validator default / `--phase 0` / `--phase 1b` / `--phase 1c` pass
- Fixtures validate
- Dispatch remains blocked
- AMBER or RED blocks dispatch execution
- `AMBER_NOT_CODEX_AUDITED` is never dispatch-executable
- Owner remains final authority
- Codex audit remains required
- AgentBridge cannot approve, merge, deploy, certify, dispatch, or bypass gates

## 3. Recommended Scope

Phase 1F-B1 is **docs-only**. It proposes schema structure only. It does not create or modify schemas, fixtures, validators, or runtime. It does not add dispatch behavior.

### Future sequence

| Phase | Description |
|-------|-------------|
| **1F-B1** | Docs-only schema proposal (this document) |
| **1F-B2** | Schema definitions only in `.pnpd/dispatch-readiness.schema.json` |
| **1F-B3** | Fixtures only under `tests/fixtures/pnpd/dispatch-readiness/` |
| **1F-B4** | Validator support only (`--phase 1f`) |
| **1F-B5** | Runtime readiness report generation, advisory only |
| Later | Dispatch plan/request formats only (separate approval) |
| Later | Actual dispatch implementation (separate Hermes design, owner approval, DeepSeek implementation, Codex audit, owner final authorization) |

## 4. Schema Placement Recommendation

**Recommended future schema path:** `.pnpd/dispatch-readiness.schema.json`

### Rationale

- Isolates dispatch readiness from orchestrator output
- Avoids polluting existing `.pnpd/orchestrator.schema.json`
- Allows independent validation lifecycle
- Preserves Phase 0 / 1B / 1C compatibility
- Aligns with `.pnpd/` schema home convention

### Alternatives considered

| Approach | Verdict |
|----------|---------|
| Embed in `.pnpd/orchestrator.schema.json` | Rejected — pollutes existing schema; breaks validator inspection patterns |
| Embed in ledger/handoff structures | Rejected — readiness is a distinct concern; ledger/handoff are audit trails, not authority layers |
| Staged hybrid (separate schema first, later orchestrator ref) | **Recommended** — clean separation with future integration potential |

## 5. Top-Level Dispatch Readiness Record

Proposed future top-level fields for a dispatch readiness record:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `schemaVersion` | integer (const: 1) | Yes | Schema version |
| `recordType` | string (const: `"dispatchReadiness"`) | Yes | Record discriminator |
| `recordId` | string | Yes | Unique record identifier |
| `runId` | string | Yes | Correlates with ledger/handoff/lock runId |
| `generatedAt` | string (format: date-time) | Yes | ISO 8601 timestamp |
| `source` | string (const: `"pnpd-orchestrator-dry-run"`) | Yes | Generator source |
| `repo` | object | Yes | Repo identification (id, name, path) |
| `classification` | string | Yes | Current PNPD classification |
| `readiness` | object | Yes | Readiness metadata (see §6) |
| `blockers` | array | Yes | Blocking reasons (see §9) |
| `evidence` | object | Yes | Evidence references (see §10) |
| `approvals` | object | Yes | Approval status (see §11) |
| `audit` | object | Yes | Audit status (see §11) |
| `scope` | object | Yes | Proposed dispatch scope |
| `safety` | object | Yes | Safety assertions (see §6) |
| `scheduler` | object | Yes | Scheduler metadata |
| `authority` | object | Yes | Authority boundaries (see §6) |
| `integrity` | object | Yes | Content hash and canonicalization |

**Clarification:** This is a proposed model only. No schema file is implemented in Phase 1F-B1.

## 6. Required Safety Consts

Future schema must enforce these exact const values:

### Readiness block

```json
{
  "advisoryOnly": true,
  "executesDispatch": false,
  "authorizesExecution": false,
  "productionCertification": false
}
```

### Authority block

```json
{
  "ownerFinalAuthority": true,
  "agentBridgeMayApprove": false,
  "agentBridgeMayMerge": false,
  "agentBridgeMayDeploy": false,
  "agentBridgeMayDispatch": false,
  "agentBridgeMayCertify": false
}
```

### Audit block

```json
{
  "codexRequiredBeforeExecution": true
}
```

### Scheduler block

```json
{
  "autoDispatchAllowed": false
}
```

### Safety block

```json
{
  "githubMutationAllowed": false,
  "deployAllowed": false,
  "externalMutationAllowed": false,
  "secretsAllowed": false
}
```

These are future schema requirements. They are not runtime behavior. They do not authorize execution.

## 7. Readiness State Model

Proposed advisory readiness states for the `readiness.state` field:

| State | Meaning |
|-------|---------|
| `dispatchUnavailable` | Dispatch is not available (no capability) |
| `dispatchBlocked` | One or more hard blockers present |
| `dispatchEligibleForOwnerReview` | Evidence gathered; ready for owner review |
| `dispatchOwnerApprovedPendingCodex` | Owner approved; awaiting Codex audit |
| `dispatchCodexAuditedPendingOwnerFinal` | Codex passed; awaiting owner final decision |
| `dispatchReadyButNotExecuted` | All gates pass but execution has NOT occurred |

### Critical rules

- **All readiness states are advisory.** No state executes dispatch.
- **No readiness state authorizes dispatch.** Only owner final command in a future separately approved runtime phase may execute.
- **`dispatchReadyButNotExecuted` still requires explicit later owner command.** It is not permission to execute.
- **Current Phase 1F-B1 does not implement these states in code.**

### Non-authority rules

- Dispatch readiness is advisory only.
- Readiness is not approval.
- Readiness is not dispatch.
- Readiness is not production certification.
- The scheduler must never auto-dispatch.

## 8. Classification Policy

> Any AMBER or RED state blocks dispatch execution.
>
> `AMBER_NOT_CODEX_AUDITED` may be eligible for owner review, remediation planning, or Codex audit routing only. It must never be treated as dispatch-executable.
>
> Only a future explicitly defined GREEN state, with current ledger/handoff evidence, clean gates, owner approval, Codex audit, and owner final command, could become dispatch-execution eligible in a later separately approved phase.

## 9. Blocker Model

Proposed blocker object structure:

| Field | Type | Description |
|-------|------|-------------|
| `code` | string (enum) | Blocker identifier |
| `description` | string | Human-readable description |
| `source` | string | Where the blocker was detected |

### Recommended blocker enum

```
dirty_tree
unpushed_commits
schema_validation_failed
fixture_validation_failed
dry_run_failed
json_parse_failed
missing_ledger_evidence
missing_handoff_evidence
missing_lock_capability
active_lock_conflict
secret_scan_failed
forbidden_path_detected
state_dir_committed
owner_approval_missing
codex_audit_missing
classification_amber_or_red
classification_amber_not_codex_audited
stale_handoff
stale_ledger_chain
scheduler_unsafe
external_mutation_requested
deploy_requested
github_api_mutation_requested
production_claim_requested
daemon_requested
installer_packaging_requested
scheduler_auto_dispatch_requested
governance_violation
```

**Rule:** If any blockers are present, readiness cannot be treated as execution-eligible.

## 10. Evidence Model

Proposed evidence fields for the `evidence` object:

| Field | Type | Description |
|-------|------|-------------|
| `registryValidated` | boolean | Registry passed validation |
| `outputSchemaValidated` | boolean | Output schema validated |
| `dryRunTextPassed` | boolean | Dry-run text completed |
| `dryRunJsonParsed` | boolean | JSON output parseable |
| `ledgerRecordRef` | string | Reference to ledger record |
| `handoffRecordRef` | string | Reference to handoff record |
| `lockCapability` | boolean | Lock support available |
| `schedulerMode` | string (enum: `disabled`, `once`, `interval`) | Current scheduler mode |
| `securityScan` | object | Security scan summary |
| `forbiddenPathScan` | object | Path scan summary |
| `stateDirScan` | object | State directory scan summary |
| `sourceCommit` | string | Commit SHA at time of evidence |
| `branch` | string | Branch at time of evidence |
| `repoId` | string | Repo identifier |
| `repoPath` | string | Repo filesystem path |
| `staleness` | object | Staleness metadata |
| `gateResults` | array | Per-gate evaluation results |

**Clarification:** Evidence is advisory reference only. Evidence presence does not authorize execution. Evidence should reference validated local artifacts and must not contain secrets.

## 11. Approval, Audit, and Authority Model

### Approval object

| Field | Type | Description |
|-------|------|-------------|
| `ownerApprovalStatus` | string (enum) | Current owner approval state |
| `ownerApprovalRecordRef` | string | Reference to approval record |
| `ownerApprovalTimestamp` | string (date-time) | When approval was granted |

**Owner approval status enum:** `none`, `requested`, `under-review`, `approved`, `rejected`

### Audit object

| Field | Type | Description |
|-------|------|-------------|
| `codexAuditStatus` | string (enum) | Current Codex audit state |
| `codexAuditReportRef` | string | Reference to audit report |
| `codexAuditTimestamp` | string (date-time) | When audit was completed |

**Codex audit status enum:** `not-run`, `pending`, `passed`, `failed`

### Authority rules

- Owner remains final authority
- Codex performs formal audit
- AgentBridge must never claim approval, merge, deploy, dispatch, or certification
- Owner approval and Codex audit statuses are evidence fields, not execution authority

## 12. Scheduler Interaction

The scheduler may only generate advisory readiness evidence in a future phase.

- Scheduler must never auto-dispatch
- Scheduler must never populate executable authority
- Scheduler must never bypass locks
- Scheduler must never bypass Owner/Codex
- Scheduler must not execute agents
- Scheduler must not mutate GitHub/API
- Scheduler must not deploy

**Scheduler mode enum for evidence:** `disabled`, `once`, `interval`

## 13. Forbidden Fields and Unsafe Semantics

Future schema and validator must reject these field names anywhere in readiness records:

```
approvedForDispatch
dispatchNow
executeDispatch
autoDispatch
deployNow
githubMutationToken
apiKey
secret
productionReady
ownerBypassed
codexBypassed
mergeApproved
mergeNow
certProductionReady
bypassGate
bypassOwner
bypassCodex
agentBridgeApproves
agentBridgeApprovedByHermes
agentBridgeCertifies
orchestratorApproved
```

Equivalent unsafe semantics must also be rejected even when renamed.

## 14. Future Fixture Plan

**Future fixture path:** `tests/fixtures/pnpd/dispatch-readiness/`

### Positive fixture proposals

| Fixture | Purpose |
|---------|---------|
| `valid-minimal-dispatch-blocked.json` | Minimal valid record with blockers |
| `valid-eligible-for-owner-review.json` | All gates pass, ready for owner |
| `valid-codex-audited-pending-owner.json` | Codex passed, awaiting owner final |

### Negative fixture proposals

| Fixture | Expected failure |
|---------|-----------------|
| `invalid-missing-advisory-safety-consts.json` | Missing required safety const |
| `invalid-agentbridge-authority-claim.json` | AgentBridge claims approval |
| `invalid-github-api-mutation-allowed.json` | GitHub mutation set to true |
| `invalid-scheduler-auto-dispatch.json` | Scheduler auto-dispatch allowed |
| `invalid-production-ready-claim.json` | Production readiness claimed |
| `invalid-amber-executable.json` | AMBER state treated as executable |
| `invalid-dispatch-execute-named-state.json` | State named to imply executable |
| `invalid-missing-ledger-ref.json` | Missing required evidence reference |
| `invalid-forbidden-field-name.json` | Contains a forbidden field name |

**State:** Fixtures are future work. No fixtures are created in Phase 1F-B1.

## 15. Future Validator Plan

Future validator (`--phase 1f`) should check these invariants:

- All safety const fields must match expected values
- Dispatch execution flags must be false
- No auto-dispatch allowed
- AMBER/RED cannot be dispatch-executable
- `AMBER_NOT_CODEX_AUDITED` cannot be dispatch-executable
- Owner/Codex required before any future execution eligibility
- Forbidden fields must be rejected
- Secrets must be rejected
- Deploy/GitHub mutation permissions must be rejected
- Committed state dir paths must be rejected
- Positive fixtures must pass
- Negative fixtures must fail
- Phase 0 / 1B / 1C validator modes must remain unchanged

**State:** No validator changes are made in Phase 1F-B1.

## 16. Future Phase Breakdown

| Phase | Description | Files touched | Non-goals |
|-------|-------------|---------------|-----------|
| **1F-B1** | Docs-only schema proposal | `docs/pnpd/orchestrator-phase-1f-b-dispatch-readiness-schema-design.md` | No schema, no runtime, no fixtures |
| **1F-B2** | Schema definitions only | `.pnpd/dispatch-readiness.schema.json` | No runtime, no validator changes |
| **1F-B3** | Fixtures only | `tests/fixtures/pnpd/dispatch-readiness/*.json` | No runtime, no validator changes |
| **1F-B4** | Validator support only | `scripts/pnpd-validate-schemas.mjs` | No runtime report generation |
| **1F-B5** | Runtime readiness report, advisory only | `scripts/pnpd-orchestrator-dry-run.mjs` | No execution, no GitHub/API |
| Later | Dispatch plan/request formats | TBD | No execution |
| Later | Actual dispatch implementation | TBD | Requires separate Hermes design, owner approval, DeepSeek implementation, Codex audit, owner final authorization |

**Do not recommend actual dispatch implementation now.**

## 17. Codex Audit Checklist For This Docs Phase

Codex should verify:

- [ ] Only this docs file changed
- [ ] No runtime file changed
- [ ] No schema file changed (`.pnpd/orchestrator.schema.json`, `.pnpd/repos.schema.json`)
- [ ] No validator changed
- [ ] No fixture changed
- [ ] No `.pnpd/dispatch-readiness.schema.json` created
- [ ] No dispatch flags added
- [ ] No execution semantics introduced
- [ ] No authority escalation
- [ ] No GitHub/API/deploy behavior
- [ ] No secrets introduced
- [ ] No production readiness claim
- [ ] Future schema remains proposal only
- [ ] Fixture path is future-only
- [ ] Validator mode `--phase 1f` is future-only
- [ ] AMBER/RED policy is preserved
- [ ] Owner/Codex gates are preserved

## 18. Owner Decisions

Open decisions for owner:

| # | Decision |
|---|----------|
| 1 | Approve docs-only schema proposal |
| 2 | Approve future separate `.pnpd/dispatch-readiness.schema.json` path |
| 3 | Approve readiness state names |
| 4 | Approve blocker codes |
| 5 | Approve required safety consts |
| 6 | Approve evidence field set |
| 7 | Approve future fixture path `tests/fixtures/pnpd/dispatch-readiness/` |
| 8 | Approve future validator mode name `--phase 1f` |
| 9 | Confirm actual dispatch remains blocked |
| 10 | Confirm owner approval required for every future dispatch request |
| 11 | Confirm Codex audit required before every future dispatch execution |
| 12 | Confirm schema definition implementation is deferred until docs/spec approval |

## 19. Recommended Next Step

- After this docs-only proposal, Codex should audit the document.
- Do not proceed to schema definitions until owner approves Phase 1F-B2.
- Do not implement dispatch.
