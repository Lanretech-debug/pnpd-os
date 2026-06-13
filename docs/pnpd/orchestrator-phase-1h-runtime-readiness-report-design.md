# PNPD OS Phase 1H-A Runtime Readiness Report Design

## Status

- **Phase:** `PHASE_1H_A_RUNTIME_READINESS_REPORT_DESIGN_DOC`
- **Hermes verdict:** `HERMES_PHASE_1H_A_RUNTIME_READINESS_REPORT_DESIGN_READY`
- **Baseline:** `main` at `07b9926` (`merge: Phase 1G-D PNPD CI workflow into main`)
- **Remote CI run:** `27469237440` passed (push to `main`, conclusion: `success`)
- **Document type:** Advisory design only
- **Implementation:** None included

## Purpose

Runtime readiness reports are advisory, evidence-based snapshots intended for Owner and Codex review. They collect local and optional remote CI evidence into a single structured view.

These reports:

- Are review aids only.
- Do not approve, merge, deploy, certify, dispatch, or authorize execution.
- Do not replace Codex audit.
- Do not replace Owner approval.
- Do not trigger automated actions.
- Do not mutate external state.

## Non-Purpose

A runtime readiness report is explicitly NOT:

- A dispatch readiness record.
- A production-readiness certificate.
- An Owner approval.
- A Codex audit replacement.
- A scheduler trigger.
- A daemon trigger.
- A deploy trigger.
- GitHub/API mutation permission.
- Dispatch permission.

## Current Baseline

| Item | State |
|------|-------|
| `main` aligned with `origin/main` | Yes |
| Head commit | `07b9926` |
| `package.json` with `validate`, `dry-run`, `test` scripts | Present |
| `docs/quickstart-local.md` | Present |
| README quick local verification section | Present |
| `.github/workflows/pnpd-ci.yml` | Present |
| Remote CI | Passed (run `27469237440`, `success`) |
| Validators (default, `--phase 0`, `1b`, `1c`, `1f`) | All pass |
| Dispatch readiness fixtures (3 positive, 9 negative) | All pass |
| Dry-run (text + JSON) | Passes |
| Dispatch | Blocked, not implemented |
| Runtime readiness reports | Absent |
| Dependencies | None |
| Lockfiles | None |
| State dirs | None committed |
| Deploy | None |
| Daemon | None |
| Installer | None |
| Packaging | None |

## Proposed Phase Split

The runtime readiness report capability is split into governed, auditable phases. Each phase requires owner approval before implementation and Codex audit before merge. Dispatch remains blocked throughout.

### Phase 1H-A: Docs-only design capture (current)

This document. No schemas, fixtures, validators, generators, writes, or CI changes.

- **Owner approval required:** Yes (for this document)
- **Codex audit required:** Yes (before merge)
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-B: Docs-only schema proposal

A standalone Markdown/JSON proposal for the runtime readiness report schema. No `.schema.json` file yet.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-C: Schema definition only

A `.pnpd/runtime-readiness-report.schema.json` with `$id`, `type`, `properties`, `required`, `additionalProperties: false`, `const` safety fields, and forbidden-field validation. No fixtures or validators yet.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-D: Fixture-only implementation

Positive and negative JSON fixtures under `tests/fixtures/pnpd/runtime-readiness-report/`. No validator integration yet.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-E: Validator integration only

Extend `scripts/pnpd-validate-schemas.mjs` with a `--phase 1h` mode that validates runtime readiness report fixtures against the schema. No generator yet.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-F: Local console-only readiness report generation

A read-only generator script that collects local evidence (validator results, dry-run output, git state, package script results) and prints a JSON runtime readiness report to stdout. No filesystem writes by default.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-G: Optional explicit local write flag

An opt-in `--write-report` flag that writes the report to `.pnpd/readiness/` only when explicitly requested. No writes without the flag. Output directory must be git-ignored.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

### Phase 1H-H: Optional CI validation of readiness schema/fixtures

Add the `--phase 1h` validator mode to the CI workflow so that runtime readiness report fixtures are validated on PRs and pushes to `main`.

- **Owner approval required:** Yes
- **Codex audit required:** Yes
- **Dispatch remains blocked:** Yes
- **No production-readiness claim:** Yes

## Runtime Readiness Report Model

The report is an advisory-only JSON object. Every field exists to inform Owner and Codex review. No field authorizes action.

### Required fields

```text
reportVersion          — string, version of the report schema
generatedAt            — ISO 8601 timestamp

repo                   — object
  .id                  — string, short repo identifier
  .name                — string, human-readable repo name
  .path                — string, absolute filesystem path
  .branch              — string, current git branch
  .commit              — string, current HEAD commit hash
  .dirty               — boolean, working tree has uncommitted changes
  .protectedBranch     — boolean, current branch is protected (e.g., main)

source                 — object
  .localOnly           — boolean, report generated from local evidence only
  .remoteCiObserved    — boolean, remote CI run was observed
  .remoteCiRunId       — string or null, CI run identifier
  .remoteCiStatus      — string or null, CI run status
  .remoteCiConclusion  — string or null, CI run conclusion
  .externalApiUsed     — boolean, any external API was called

validation             — object
  .npmValidatePassed                — boolean
  .npmDryRunPassed                  — boolean
  .npmTestPassed                    — boolean
  .validatorPhasesPassed            — array of strings, e.g., ["default","0","1b","1c","1f"]
  .dispatchReadinessFixturesPassed  — boolean

dryRun                 — object
  .classification              — string, e.g., "CODEX_REVIEW_REQUIRED"
  .dispatchEnabled             — boolean
  .dispatchAllowed             — boolean
  .dispatchBlockedReason       — string or null
  .externalWritesImplemented   — boolean
  .maxParallelDispatch         — number

authority              — object
  .ownerApproved                — boolean
  .codexAudited                 — boolean
  .agentBridgeMayApprove        — boolean
  .agentBridgeMayMerge          — boolean
  .agentBridgeMayDeploy         — boolean
  .agentBridgeMayDispatch       — boolean
  .agentBridgeMayCertifyProduction — boolean

safety                 — object
  .secretsPresent              — boolean
  .stateDirsPresent            — boolean
  .deploymentConfigured        — boolean
  .daemonConfigured            — boolean
  .installerConfigured         — boolean
  .githubMutationAllowed       — boolean

readiness              — object
  .status            — string, one of the allowed readiness status values
  .blockers          — array of strings, human-readable blocker descriptions
  .remainingRisks    — array of strings
  .nextSafestStep    — string

integrity              — object
  .contentHash       — string, SHA-256 of the canonicalized report
  .canonicalization  — string, description of canonicalization method
```

## Locked Constants

The following field values must be locked to the stated constants in any valid report. A schema validator for this report must enforce these with `const`.

| Constant | Value | Rationale |
|----------|-------|-----------|
| `advisoryOnly` | `true` | Reports are never executable |
| `authorizesDispatch` | `false` | Reports do not authorize dispatch |
| `authorizesDeployment` | `false` | Reports do not authorize deployment |
| `authorizesMerge` | `false` | Reports do not authorize merge |
| `certifiesProductionReadiness` | `false` | Reports do not certify production |
| `executesDispatch` | `false` | Reports do not execute dispatch |
| `mutatesGitHub` | `false` | Reports do not mutate GitHub/API |
| `usesSecrets` | `false` | Reports do not use secrets |
| `externalWritesAllowed` | `false` | Reports do not allow external writes |
| `ownerFinalAuthority` | `true` | Owner remains final authority |
| `codexAuditRequired` | `true` | Codex audit is required |
| `agentBridgeAuthorityFlags` | `false` | All AgentBridge authority flags must be false |

## Forbidden Field Names

The following field names must never appear in a valid runtime readiness report. Any report containing these fields must be rejected by the schema validator.

| Forbidden field | Reason |
|----------------|--------|
| `approvedForDispatch` | Dispatch is never approved by a report |
| `dispatchApproved` | Dispatch approval is an Owner decision |
| `dispatchNow` | Reports do not trigger immediate dispatch |
| `executeDispatch` | Reports do not execute |
| `deployApproved` | Deployment approval is an Owner decision |
| `productionReady` | Reports do not certify production |
| `productionCertified` | Production certification is an Owner decision |
| `mergeApproved` | Merge approval is an Owner decision |
| `ownerBypassed` | Owner must never be bypassed |
| `codexBypassed` | Codex must never be bypassed |
| `agentBridgeApproved` | AgentBridge must not approve |
| `agentBridgeCanDeploy` | AgentBridge must not deploy |
| `githubMutationEnabled` | GitHub mutation is not enabled |
| `secretsEnabled` | Secrets are not enabled |
| `autoDispatch` | Auto-dispatch is forbidden |
| `autonomousDispatch` | Autonomous dispatch is forbidden |
| `releaseApproved` | Release approval is an Owner decision |

## Semantic Rules

The following rules must be enforced by any validator that processes runtime readiness reports.

- `dispatchEnabled` MUST be `false`.
- `dispatchAllowed` MUST be `false`.
- `externalWritesImplemented` MUST be `false`.
- `maxParallelDispatch` MUST be `0`.
- `ownerApproved` MUST be `false` unless manually supplied as external evidence in a later governed phase.
- `codexAudited` MUST be `false` unless manually supplied as external evidence in a later governed phase.
- `secretsPresent` MUST be `false`.
- `stateDirsPresent` MUST be `false`.
- `deploymentConfigured` MUST be `false`.
- `daemonConfigured` MUST be `false`.
- `installerConfigured` MUST be `false`.
- `githubMutationAllowed` MUST be `false`.
- If `remoteCiObserved` is `true`, `remoteCiConclusion` MUST be `success`.
- If `remoteCiObserved` is `false`, remote CI fields (`remoteCiRunId`, `remoteCiStatus`, `remoteCiConclusion`) MUST be `null`.
- AMBER, RED, and `AMBER_NOT_CODEX_AUDITED` classifications MUST never map to executable dispatch states.
- Runtime readiness status MUST never authorize execution.
- All AgentBridge authority flags (`agentBridgeMayApprove`, `agentBridgeMayMerge`, `agentBridgeMayDeploy`, `agentBridgeMayDispatch`, `agentBridgeMayCertifyProduction`) MUST be `false`.

## Readiness Status Values

Allowed readiness status values. These are advisory states only. None execute dispatch.

| Value | Meaning |
|-------|---------|
| `dispatchUnavailable` | Dispatch infrastructure is not present |
| `dispatchBlocked` | Dispatch is present but blocked (current state) |
| `dispatchEligibleForOwnerReview` | All local gates pass; ready for Owner review |
| `dispatchOwnerApprovedPendingCodex` | Owner has approved; awaiting Codex audit |
| `dispatchCodexAuditedPendingOwnerFinal` | Codex has audited; awaiting Owner final decision |
| `dispatchReadyButNotExecuted` | All gates pass; Owner has not yet authorized execution |

All of these are advisory states. None authorizes dispatch execution. The final dispatch decision rests with the Owner alone.

## Evidence Rules

- **Local evidence** comes from existing validator output, dry-run output, git state (`git status --short --branch`, `git log`), package scripts (`npm run validate`, `npm run dry-run`, `npm test`), and local filesystem checks.
- **Early remote CI evidence** is manually observed only. The CI run ID and conclusion are supplied by a human or recorded from a prior manual observation.
- **Automated remote CI lookup** is deferred to a later governed phase. No GitHub/API access is made in early phases.
- **No network calls** are made by the report generator in early phases.
- **No secrets** are required or consumed.
- **No external service calls** are made.

## Output Format Recommendation

- **Default output:** JSON to stdout in a later generator phase (Phase 1H-F).
- **No filesystem writes** by default.
- **`--no-write`** must mean zero writes (this is the default behavior).
- **`--write-report`** is an optional explicit flag only in a later governed phase (Phase 1H-G).
- **Future output directory**, if approved, should likely be `.pnpd/readiness/`.
- **Any output directory** must be added to `.gitignore` and must not be committed.
- **Markdown summary** is optional later but is not initial generator behavior.

## Safety Boundaries

- No dispatch execution.
- No agent execution.
- No GitHub/API mutation.
- No deployment.
- No daemon/watcher.
- No installer/packaging.
- No secrets.
- No authority escalation.
- No production-readiness claim.
- No scheduler auto-dispatch.
- No bypass of Owner.
- No bypass of Codex.
- No bypass of schema validation.
- No bypass of ledger/handoff evidence.
- No bypass of lockfile safety.

## Governance Boundaries

- **Owner remains final authority.** No report, agent, or process overrides Owner decisions.
- **Codex remains formal auditor.** Codex performs final review before merge. Reports do not replace Codex audit.
- **Hermes does not approve implementation.** Hermes designs and scopes; Owner and Codex govern.
- **DeepSeek does not approve merge.** DeepSeek implements; Owner and Codex govern.
- **AgentBridge does not approve, merge, deploy, certify, dispatch, or bypass gates.** AgentBridge coordinates, records state, prepares handoffs, and supports review.
- **Runtime readiness reports are review aids only.** They inform decisions; they do not make decisions.

## Future Implementation Gates

Every future phase must pass these gates before merge:

- Docs scope check (only allowed files changed)
- Schema parse validation
- Fixture parse validation
- Validator modes pass for the phase
- Phase 1H explicit validator mode passes
- Dry-run text and JSON pass
- All npm scripts pass
- CI workflow preserved and passes
- Forbidden field scan passes
- Secret scan passes
- State-dir scan passes
- No runtime drift unless the phase explicitly allows it
- No dispatch drift
- No package/dependency drift
- Codex audit before merge

## Codex Audit Checklist

Codex must verify every item when auditing this design document and all future Phase 1H artifacts.

- [ ] Exact file scope — only the expected file(s) changed
- [ ] Advisory-only language — no executable or authorizing claims
- [ ] No authority escalation — AgentBridge flags remain `false`
- [ ] No dispatch/deploy/production claims except as prohibitions
- [ ] No secrets — no API keys, tokens, or credentials
- [ ] No external mutation — no GitHub/API write access
- [ ] No GitHub/API access in early phases
- [ ] Locked constants present and correct
- [ ] Forbidden field names present and correct
- [ ] Semantic rules complete
- [ ] Phase split preserves auditability — each phase is independently auditable
- [ ] Existing Phase 1G CI workflow intact
- [ ] All gates pass

## Owner Decisions Required

The Owner must decide on each of the following before Phase 1H proceeds beyond this design document:

1. Approve the Phase 1H path (phases 1H-A through 1H-H).
2. Approve the advisory-only readiness report concept.
3. Approve docs-only as the next step (Phase 1H-B schema proposal).
4. Approve the schema-before-generator sequence (no generator before schema/fixtures/validator).
5. Approve no writes by default (stdout only; `--write-report` is opt-in later).
6. Approve no GitHub/API access in early phases.
7. Confirm dispatch remains blocked.
8. Confirm no production-readiness claim.
9. Confirm Codex audit is required before every merge.
10. Confirm Owner approval is required for every future dispatch-related step.

## Next Safest Step

1. Codex audit of this docs-only design document.
2. Owner reviews the Codex audit findings.
3. Owner decides whether to merge this design document into `main`.
4. If merged, Phase 1H-B (schema proposal) becomes the next governed step.

No schema, fixtures, validator, generator, writes, CI changes, dispatch, deployment, daemonization, installer, packaging, or GitHub/API mutation is included in this phase.
