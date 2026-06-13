# PNPD Orchestrator Phase 1F-A Dispatch Readiness Design

## 1. Status

| Field | Value |
|-------|-------|
| **Status** | `PHASE_1F_A_DISPATCH_READINESS_DOCS` |
| **Source design** | `HERMES_PHASE_1F_DISPATCH_READINESS_DESIGN_READY` |
| **Scope** | Docs-only design capture |
| **Runtime changes** | None |
| **Dispatch implementation** | None |
| **GitHub/API mutation** | None |
| **Deploy behavior** | None |
| **Daemon behavior** | None |
| **Installer/packaging behavior** | None |
| **Date** | 2026-06-13 |
| **Branch** | `deepseek/phase1f-dispatch-readiness-design` |

## 2. Baseline

- **Branch**: `main` aligned with `origin/main`
- **Baseline commit**: `c218142` — `merge: Phase 1E PNPD local scheduler scaffold into main`

### Completed capabilities

| Capability | Status | Phase |
|------------|--------|-------|
| Manual dry-run | GREEN | Phase 0 |
| JSON dry-run | GREEN | Phase 0 |
| Ledger writer (`--write-ledger`) | GREEN | Phase 1C-3B |
| Handoff writer (`--write-handoff`) | GREEN | Phase 1C-3C |
| Lockfile support (`--use-lock`) | GREEN | Phase 1D |
| Bounded local scheduler scaffold | GREEN | Phase 1E |
| Validation (Phase 0/1B/1C) | GREEN | Phase 1C-2C, 1C-2E |
| Fixture instance validation | GREEN | Phase 1C-2D, 1C-2E |

### Currently blocked capabilities

| Capability | Status | Reason |
|------------|--------|--------|
| Dispatch | BLOCKED | Not implemented; requires separate design, owner approval, Codex audit |
| GitHub/API mutation | BLOCKED | Not implemented; external writes `const: false` |
| Deployment | BLOCKED | No deploy path exists |
| Daemonization | BLOCKED | PNPD-OS is a framework, not a runtime |
| Installer/packaging | BLOCKED | Out of scope |
| Production scheduling | BLOCKED | Scheduler is local-only, bounded, advisory |
| Autonomous approval/merge/certification | BLOCKED | Owner and Codex gates are mandatory |

## 3. Dispatch Definitions

This section defines core dispatch terminology for the PNPD governance framework. All definitions are **design-only** — no runtime dispatch implementation exists.

### 3.1 Dispatch Readiness

**Dispatch readiness** is a structured, advisory evidence package indicating that a repo has passed all local gates, has current ledger and handoff records, has a clean security scan, and is theoretically eligible for owner review regarding potential agent dispatch.

Dispatch readiness is **advisory evidence only**. It does not approve, execute, trigger, or authorize anything.

### 3.2 Dispatch Plan

**Dispatch plan** is a future advisory document describing what a hypothetical dispatch would do, what scope it would have, what stop conditions would apply, and what rollback mechanism would be available.

A dispatch plan is **non-executing**. It is a proposal for owner and Codex review, never an instruction.

### 3.3 Dispatch Request

**Dispatch request** is a future owner-initiated or owner-approved structured request to execute a specific, scoped dispatch action against a specific repo at a specific commit, with explicit gates, rollback conditions, and Codex audit evidence.

A dispatch request **does not execute**. It is a formal ask for final owner authorization.

### 3.4 Dispatch Execution

**Dispatch execution** means actual side effects: agent invocation, code mutation, branch operations, or any action that changes state beyond local read-only inspection and approved local ledger/handoff writes.

**Dispatch execution does not exist in PNPD-OS today.** It is strictly out of scope for Phase 1F-A and all currently implemented phases.

### 3.5 Dispatch Result

**Dispatch result** would be the evidence package produced after dispatch execution completes. Since dispatch execution does not exist, dispatch results do not exist.

## 4. Readiness Versus Execution

This distinction is critical to PNPD governance safety:

| Concept | Definition | Executes? | Approves? |
|---------|-----------|-----------|------------|
| **Readiness** | Evidence and gates assessment | No | No |
| **Plan** | Advisory proposal for review | No | No |
| **Request** | Owner-initiated formal ask | No | No |
| **Execution** | Actual side effects | Yes (future only) | No (owner approves first) |
| **Result** | Evidence after execution | N/A (does not exist) | N/A |

Key rules:

- Readiness must never be treated as permission.
- Readiness must not bypass owner or Codex review.
- Readiness must not be triggered automatically by the scheduler.
- A readiness report that passes all gates is still not executable.
- Only explicit owner authorization, after Codex audit, in a future phase with full implementation, could make execution possible.

## 5. Recommended Phase Scope

### Phase 1F-A (this phase)

- **Docs-only.** No runtime implementation.
- No schema implementation.
- No validator changes.
- No fixture changes.
- No dispatch flags added to CLI.
- No agent execution.
- No external mutation.
- No state directories created.

### Future phases

Future phases may consider schemas, fixtures, validators, and advisory runtime readiness reports only after:

1. Separate Hermes design for each sub-phase.
2. Owner explicit approval for each sub-phase.
3. DeepSeek implementation.
4. Codex formal audit.
5. Owner final authorization before any dispatch-execution-capable phase.

## 6. Dispatch Readiness States

These are proposed **advisory-only** future states. None are implemented in Phase 1F-A.

| State | Meaning | Triggers Action? |
|-------|---------|------------------|
| `dispatchUnavailable` | Repo is disabled, missing, or not registered | No |
| `dispatchBlocked` | One or more hard blockers are active | No |
| `dispatchEligibleForOwnerReview` | Gates pass; ready for owner to review evidence | No |
| `dispatchOwnerApprovedPendingCodex` | Owner has reviewed and requests Codex audit | No |
| `dispatchCodexAuditedPendingOwnerFinal` | Codex audit complete; awaits owner final decision | No |
| `dispatchReadyButNotExecuted` | All gates, owner, and Codex clear; execution still requires explicit owner command | **No** |

All states are non-executing. `dispatchReadyButNotExecuted` explicitly does not execute — it means "all prerequisites are met but the final execution step has not been taken."

Current Phase 1F-A does not implement any of these states in code, schema, or runtime.

## 7. Classification Policy

This exact safety rule governs any future dispatch-related classification:

> **Any AMBER or RED state blocks dispatch execution.**
>
> `AMBER_NOT_CODEX_AUDITED` may be eligible for owner review, remediation planning, or Codex audit routing only. It must never be treated as dispatch-executable.
>
> Only a future explicitly defined GREEN state, with current ledger/handoff evidence, clean gates, owner approval, and Codex audit, could become dispatch-execution eligible in a later phase.

This rule must be enforced in every future dispatch-related code path, schema, validator, and documentation.

## 8. Hard Dispatch Blockers

The following conditions are **hard blockers** — any one of them prevents dispatch execution in any future phase:

### Local state blockers

- Dirty working tree (uncommitted changes)
- Unpushed commits, unless a future phase explicitly treats them as part of a local-only advisory review
- Committed runtime state dirs (`.pnpd/ledger/`, `.pnpd/handoffs/`, `.pnpd/locks/`)

### Validation blockers

- Schema validation failure
- Fixture validation failure
- Dry-run failure
- JSON parse failure

### Evidence blockers

- Missing ledger evidence
- Missing handoff evidence
- Stale handoff (age exceeds configured threshold)
- Stale ledger chain (broken hash chain or missing previous hash)

### Lock blockers

- Missing lock capability
- Active lock conflict

### Security blockers

- Failed secret scan
- Forbidden path detected (including legacy BricLab Kids path)
- `.env` path detected

### Authority blockers

- No owner approval
- No Codex audit
- AMBER or RED classification
- `AMBER_NOT_CODEX_AUDITED` classification

### Scope blockers

- External mutation requested
- Deploy requested
- GitHub/API mutation requested
- Production claim requested
- Daemon request
- Installer/packaging request
- Scheduler auto-dispatch request

### Scheduler blockers

- Unsafe scheduler state
- Scheduler attempted auto-dispatch

Any single hard blocker renders dispatch execution ineligible regardless of other passing gates.

## 9. Dispatch Evidence Contract

This section defines the **proposed future structure** of dispatch readiness evidence. This is a design contract only — no schema is implemented in Phase 1F-A.

### Proposed evidence fields

| Field | Type | Description |
|-------|------|-------------|
| `repoId` | string | Repo identifier from registry |
| `repoName` | string | Human-readable repo name |
| `repoPath` | string | Local filesystem path |
| `branch` | string | Current branch at inspection time |
| `commitSha` | string | Current commit SHA at inspection time |
| `classification` | string | Classification from gate evaluation |
| `gateResults` | array | All gate evaluations with status and reason |
| `ledgerRecordRef` | string | Reference to corresponding ledger record |
| `handoffRecordRef` | string | Reference to corresponding handoff record |
| `securityScanSummary` | object | Summary of secret/path/.env scan results |
| `ownerApprovalStatus` | string | Current owner approval state |
| `codexAuditStatus` | string | Current Codex audit state |
| `dispatchScope` | string | Advisory description of what dispatch would do |
| `dispatchTarget` | string | Advisory target (repo, branch, or scope) |
| `rollbackCondition` | string | Condition that would trigger rollback |
| `stopCondition` | string | Condition that would stop dispatch |
| `noSecretsAssertion` | boolean | Must be `true`; asserted after scan |
| `noDeployAssertion` | boolean | Must be `true`; dispatch does not deploy |
| `noGitHubMutationAssertion` | boolean | Must be `true`; dispatch does not mutate remotes |
| `allowedAction` | string | Advisory description of allowed action |
| `blockedAction` | string | Explicitly blocked action |
| `blockReason` | string | Reason for blocked action |
| `expiryPolicy` | string | How long readiness evidence remains valid |
| `stalenessPolicy` | string | When evidence is considered stale |

All fields are advisory. None authorize execution.

## 10. Ledger, Handoff, Lock, and Scheduler Interaction

How existing PNPD capabilities interact with future dispatch readiness:

### Ledger

- The ledger provides an append-only, chronological audit trail of orchestrator inspections.
- Future readiness checks can reference ledger records as evidence that a repo was inspected at a specific time with specific gate results.
- The ledger does not approve, dispatch, or execute.

### Handoff

- Handoff files provide structured, human-readable context for repo state and recommended next actions.
- Future readiness checks can reference handoff records as routing and context evidence.
- Handoff routing is advisory only and never triggers dispatch.

### Lockfile

- Lockfiles prevent overlapping orchestrator runs that could produce conflicting readiness evidence.
- A future readiness check should acquire a lock, inspect, record evidence, and release.
- Lockfiles do not authorize dispatch.

### Scheduler

- The scheduler can produce future advisory readiness checks on a bounded, local-only, lock-gated schedule.
- The scheduler must never auto-dispatch.
- The scheduler must not override locks.
- The scheduler must not bypass owner or Codex gates.
- The scheduler must not execute agents.
- The scheduler must not mutate GitHub/API.
- The scheduler must not deploy.

## 11. Security Boundary

All dispatch readiness design and any future implementation must respect these security boundaries:

### Never allowed

- Secrets, credentials, tokens, or API keys in any readiness record
- External API mutation
- GitHub mutation
- Deployment
- Shell execution
- New child process execution
- State outside approved `.pnpd` local state paths (in future runtime phases)
- Committed runtime state directories
- Forbidden legacy path: `/Users/lanretech/Documents/BricLab Kids`
- Production claims of any kind
- `.env` file references or paths

### Allowed (existing only)

- Local read-only git inspection (Phase 0)
- Append-only ledger writes behind `--write-ledger` (Phase 1C-3B)
- Create-only handoff writes behind `--write-handoff` (Phase 1C-3C)
- Atomic lockfile creation behind `--use-lock` (Phase 1D)
- Bounded, lock-gated local scheduler (Phase 1E)

## 12. Governance Boundary

PNPD governance rules apply to all dispatch readiness design and any future implementation:

- **Owner** remains final authority for all dispatch decisions.
- **Codex** formal audit remains required before any future execution-capable phase.
- **Hermes** design is advisory — it proposes; it does not authorize.
- **DeepSeek** implementation requires explicit owner approval for each phase.
- **AgentBridge** is a communication and state layer only:
  - AgentBridge cannot approve.
  - AgentBridge cannot merge.
  - AgentBridge cannot deploy.
  - AgentBridge cannot certify production readiness.
  - AgentBridge cannot bypass gates.

Dispatch readiness governance invariants:

- Readiness is not approval.
- Readiness is not dispatch.
- Readiness is not production certification.
- A readiness report that passes all gates is still advisory.
- Only the owner may authorize execution.
- Only after Codex audit may execution be considered.

## 13. Future Phase Roadmap

This is a proposed safe sequence. Each phase requires separate Hermes design, owner approval, DeepSeek implementation, and Codex audit.

| Phase | Description | Scope | Execution? |
|-------|-------------|-------|------------|
| **1F-A** | Docs-only dispatch readiness design | This document | No |
| **1F-B** | Schema design proposal for dispatch readiness records | Docs-only schema design | No |
| **1F-C** | Schema definitions only | `.pnpd/orchestrator.schema.json` additions | No |
| **1F-D** | Fixtures and validator support | Fixtures + `--phase 1f` validator | No |
| **1F-E** | Runtime readiness report generation | Advisory report output only | No |
| **1F-F** | Dispatch plan generation | Advisory plan output only | No |
| **1F-G** | Owner-approved dispatch request format | Non-executing request format | No |
| **Later** | Actual dispatch implementation | Separate Hermes design, owner approval, DeepSeek implementation, Codex audit, owner final authorization | **Only after all gates** |

Actual dispatch implementation is not recommended until all preceding phases are complete, audited, and owner-approved.

## 14. Future Schema Notes

- Future dispatch readiness schema work should be a separate, explicitly approved phase (1F-B, 1F-C).
- Future fixtures should live under `tests/fixtures/pnpd/`, matching existing fixture practice, unless a later schema-design phase explicitly approves another path.
- Do not create schemas, validators, or fixtures in Phase 1F-A.
- Existing schemas (`.pnpd/orchestrator.schema.json`, `.pnpd/repos.schema.json`) must not be modified in this phase.

## 15. Codex Audit Checklist For This Docs Phase

Future Codex audit of this document should verify:

- [ ] Only the docs file changed (`docs/pnpd/orchestrator-phase-1f-dispatch-readiness-design.md`)
- [ ] No runtime files changed (`scripts/`, `.pnpd/`, `tests/fixtures/`)
- [ ] Dispatch remains disabled (`dispatchEnabled: const: false` in all schemas)
- [ ] No schema changes
- [ ] No validator changes
- [ ] No fixture changes
- [ ] No CLI flags added
- [ ] No external mutation paths introduced
- [ ] No GitHub/API/deploy behavior described as implemented
- [ ] No daemon/watcher behavior described as implemented
- [ ] No approval, merge, or certification authority granted to AgentBridge
- [ ] Readiness is explicitly described as advisory only
- [ ] Owner and Codex gates are explicitly preserved
- [ ] No production readiness claim
- [ ] Classification policy clearly states AMBER/RED blocks execution
- [ ] Hard blockers list is complete and internally consistent
- [ ] Future roadmap does not recommend immediate dispatch implementation
- [ ] Security boundary is explicit and matches existing PNPD invariants
- [ ] Governance boundary is explicit and matches PNPD-OS-MANIFEST.md

## 16. Owner Decisions

The following decisions are open for owner consideration after this docs-only capture:

1. Approve the docs-only dispatch readiness design direction.
2. Approve the proposed dispatch readiness state names.
3. Approve the hard blockers list.
4. Approve the dispatch evidence contract fields.
5. Confirm that schema definitions (Phase 1F-B) require separate approval before any implementation.
6. Confirm that runtime readiness report generation (Phase 1F-E) is deferred until after schema and fixture phases.
7. Confirm that actual dispatch execution remains blocked indefinitely.
8. Confirm that owner approval is required for every future dispatch.
9. Confirm that Codex audit is required before every future dispatch.
10. Decide whether Phase 1F-B (schema design) should proceed after this doc is audited.

## 17. Recommended Next Step

1. **Codex audit** of this document on `deepseek/phase1f-dispatch-readiness-design`.
2. **Owner review** of audit findings and the 10 open decisions in §16.
3. **Do not proceed** to schema definitions (Phase 1F-B) until owner explicitly approves.
4. **Do not implement** dispatch under any circumstances in this or any currently planned phase.
