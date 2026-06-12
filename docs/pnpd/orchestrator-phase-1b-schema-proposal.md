# PNPD Orchestrator Phase 1B — Schema Proposal

## Verdict

`PHASE_1B_SCHEMA_PROPOSAL_IMPLEMENTED_AMBER_NOT_CODEX_AUDITED`

## Baseline

- Branch: `deepseek/phase1b-schema-proposal`
- Base commit: `d328aab` (`merge: Phase 1 PNPD orchestrator design into main`)
- Upstream: `origin/main` at `d328aab`

## Hermes Proposal Summary

Hermes returned `HERMES_PHASE_1B_SCHEMA_PROPOSAL_READY` after performing
schema design/scoping only.  The proposal extends the Phase 0 registry and
output schemas with optional fields that describe future capabilities while
preserving all Phase 0 dry-run safety invariants.

Hermes performed no implementation, no file edits, and no branch creation.

## Scope — Schema Only

This branch adds optional schema fields, a validator update, and this design
record.  It does not implement any runtime behavior.

### Files Changed

| File | Change |
|---|---|
| `.pnpd/repos.schema.json` | Extended — optional Phase 1B repo fields |
| `.pnpd/orchestrator.schema.json` | Extended — optional Phase 1B output fields |
| `scripts/pnpd-validate-schemas.mjs` | Extended — Phase 1B invariant checks |
| `docs/pnpd/orchestrator-phase-1b-schema-proposal.md` | This document |

### Files Not Changed

- `scripts/pnpd-orchestrator-dry-run.mjs` — no runtime change
- `.pnpd/repos.example.json` — unchanged; remains Phase 0-compatible
- `tests/` — no test changes
- `.gitignore` — unchanged
- `.pnpd/locks/` — no lock files created
- `.pnpd/ledger/` — no ledger entries created
- `.pnpd/handoffs/` — no handoff records created

## Non-Goals

This branch explicitly does NOT add:

- Scheduler implementation
- Daemon / watcher
- `setInterval` / `setTimeout` loops
- Dispatch implementation
- Lockfile implementation
- Ledger writer
- Handoff writer
- GitHub / API access
- Merge / push / deploy behavior
- MCP / A2A runtime
- Production config
- Autonomous approval path

## Schema Extensions — `.pnpd/repos.schema.json`

### New Optional Per-Repo Fields (all `additionalProperties: false`)

| Field | Purpose | Safety Constraint |
|---|---|---|
| `scheduler` | Placeholder for future scheduler config | `enabled: const: false` |
| `repoConfig` | Human-readable repo metadata | Tags/description only; no code paths |
| `inspection` | Per-repo inspection toggles | Booleans only; no runtime effect |
| `authority` | Explicit authority flags per repo | `dispatchAllowed: const: false`, `externalWritesAllowed: const: false` |
| `secrets` | Secrets policy declaration | `policy: const: "deny-all"` |
| `budget` | Token/cost budget placeholders | Numeric bounds only; no enforcement |
| `risk` | Risk assessment metadata | Enum + notes only |
| `localWrites` | Local filesystem write policy | `allowed: const: false` |

### Invariants Preserved

- `orchestrator.dispatchEnabled` remains `const: false`
- `orchestrator.maxParallelThreads` remains `maximum: 0`
- `orchestrator.mode` remains `enum: ["dry-run"]`
- No field grants approval, merge, deploy, dispatch, audit, or production authority

## Schema Extensions — `.pnpd/orchestrator.schema.json`

### New Optional Top-Level Fields

| Field | Purpose |
|---|---|
| `runId` | Unique run identifier for traceability |
| `schedulerStatus` | Scheduler state (always `"disabled"` in Phase 0/1B) |
| `lockStatus` | Global lock state |

### New Optional Per-Repo Output Fields

| Field | Purpose |
|---|---|
| `lockStatus` | Per-repo lock state |
| `ledgerStatus` | Ledger health indicator |
| `handoffStatus` | Handoff record health |
| `authorityFlags` | Explicit authority assertions (all `const: false`) |
| `blockedReasons` | Reasons repo is blocked from advancement |
| `riskAssessment` | Risk level + contributing factors |
| `requiredReviewer` | Named reviewer if Codex/Owner review is required |

### Authority Flags (all `const: false`)

| Flag | Constraint |
|---|---|
| `approvalClaimed` | `const: false` |
| `mergeClaimed` | `const: false` |
| `dispatchRequested` | `const: false` |
| `auditClaimed` | `const: false` |
| `productionReadinessClaimed` | `const: false` |

### Compatibility

All new fields are optional (not in `required` arrays).  Phase 0 dry-run
output validates unchanged against the extended schema.

## Example Registry Limitation — `.pnpd/repos.example.json`

`.pnpd/repos.example.json` is intentionally unchanged in this docs/schema
proposal. It remains a Phase 0-compatible dry-run registry file.

Reason: the current Phase 0 dry-run CLI still performs broad registry scanning.
Adding otherwise safe Phase 1B demonstration fields such as `secrets` and
`tokenLimit` to the example could create a runtime scanner conflict before the
runtime scanner is explicitly updated in a later owner-approved phase.

This does not hide unsafe behavior. The Phase 1B schema and validator still
define and check the proposed fields, but the existing example registry does not
exercise them yet.

When a future owner-approved runtime or example-update phase is opened, any
Phase 1B fields added to registry examples must remain disabled/safe:

- `scheduler.enabled: false`
- `authority.dispatchAllowed: false`
- `authority.externalWritesAllowed: false`
- `secrets.policy: "deny-all"`
- `localWrites.allowed: false`
- No GitHub write config
- No deploy config
- No secret values
- No `.env` paths
- No forbidden legacy BricLab path

## Validator Extensions — `scripts/pnpd-validate-schemas.mjs`

### Phase 0 Invariants (still enforced)

- `dispatchEnabled === false`
- `maxParallelThreads === 0`
- `mode === "dry-run"`
- `APPROVED_FOR_MERGE` rejected in registry input
- All state enums present
- No secret-like fields/values

### Phase 1B Invariants (new)

- `authority.dispatchAllowed === false` (when present)
- `authority.externalWritesAllowed === false` (when present)
- `scheduler.enabled === false` (when present)
- `secrets.policy === "deny-all"` (when present)
- `localWrites.allowed === false` (when present)
- Authority flags are all `const: false` in schema declarations
- No `.env` paths in registry
- No forbidden legacy BricLab path (`Documents/BricLab Kids`)
- No GitHub write config patterns
- No deploy config patterns
- No path traversal (`../`)

### Phase Flags

- `--phase 0` — run Phase 0 invariant checks only
- `--phase 1b` — run Phase 0 checks and Phase 1B invariant checks
- Default (no flag) — run all checks

## Validation Invariants

1. All schemas use JSON Schema draft 2020-12
2. `additionalProperties: false` is maintained everywhere
3. No field is added that implies runtime dispatch, merge, deploy, or production authority
4. All const-safety fields are validated at both schema and data levels
5. Validator uses Node.js stdlib only — no dependencies

## Security Controls

- Secret-like key names (`token`, `secret`, `password`, `private_key`, `api_key`, etc.) are rejected in registry data
- Secret-like value patterns (`sk-*`, `ghp_*`, `xox*`, `-----BEGIN ... PRIVATE KEY-----`) are rejected
- `.env` paths are rejected
- Path traversal (`../`) in repo paths is rejected
- Legacy BricLab `Documents` path is rejected
- GitHub write, deploy, and production config patterns are rejected

## Governance Controls

- `dispatchEnabled` remains `const: false` in both schemas
- `dispatchAllowed` remains `const: false` in output schema
- `authority.dispatchAllowed` remains `const: false` in registry schema
- `authority.externalWritesAllowed` remains `const: false` in registry schema
- All five authority flags in output schema are `const: false`
- `APPROVED_FOR_MERGE` is rejected in registry input
- Only Codex may perform formal audits
- Only Owner may authorize merge/push

## Codex Audit Requirement

This branch must be formally audited by Codex before any merge to `main`.

Codex must verify:

1. All Phase 0 invariants are preserved
2. No field relaxes `additionalProperties` without justification
3. No field grants dispatch, merge, deploy, or production authority
4. All `const: false` declarations are verified in both schemas
5. Validator checks match schema declarations
6. Example registry remains Phase 0-compatible; Phase 1B example-field omission is documented
7. No runtime code was modified
8. No forbidden files were modified

## Owner Merge Requirement

Owner approval is required before Codex may merge this branch to `main`.

## Remaining Risks

- Schema extensions are forward-looking; future phases must not relax these
  `const: false` guards without explicit Owner authorization and Codex audit
- The validator is a static check only; it does not prevent runtime
  modification of schemas after validation passes
- The example registry does not yet demonstrate Phase 1B fields because the
  Phase 0 dry-run scanner has not been updated for those field names
- Example registry paths reference local filesystems that may not exist on
  other machines; this is intentional for Phase 0/1B

## Next Steps

1. Codex formal audit of this branch
2. Owner review and approval
3. If approved: Codex merges to `main`
4. Next owner-approved phase planning begins from the updated schema baseline
