# PNPD Unified Execution Plan And Taste Gate Design

## Current Status

Status: governance design with normative execution gates and mandatory governance rules
Canonical status: advisory until the full 8-step canonicalization chain completes (design → owner approval → implementation → Codex audit → merge → push → CI success → Owner/GitHub verification)
Runtime authority: none
Schema authority: none
Validator authority: none
CI authority: none
Generated state authority: none
AgentBridge authority: none

## Purpose

This document defines the Unified Execution Plan (UEP) model, the Taste Gate model, and the Execution Gates pipeline for PNPD Phase 1P-M. It establishes how execution-ready governance artifacts are structured, how Definition of Done is bound to evidence, how agent autonomy is bounded, what triggers a check-in, what constitutes exit criteria, how taste-sensitive decisions are gated behind human authority, and the mandatory execution gates that every implementation lane SHALL follow. This is a governance design document. It does not implement runtime behavior, schema changes, validator additions, fixtures, CI enforcement, or any other executable surface. The execution gates and mandatory rules within this document carry normative force for all implementation lanes.

## Baseline

Windows route verdict: CODEX_PNPD_WINDOWS_PROJECT_CREATION_PASS_NO_INSTALL_REQUIRED
Base commit: 537a0609630019c88db23adf9f66d18cb0063b14
origin/main: 537a0609630019c88db23adf9f66d18cb0063b14
lab/main: 537a0609630019c88db23adf9f66d18cb0063b14
Node: v22.22.2
npm: 10.9.7
Install policy: no install required
Known untracked files: none
Generated PNPD state: none

## Problem Statement

PNPD execution phases lack a unified governance artifact that binds purpose, baseline, scope, allowed files, forbidden files, definition of done, validation gates, check-in triggers, exit criteria, and authority boundaries into a single execution contract. Without this, agents drift, scope expands, taste decisions are delegated to LLMs without human review, and phases produce incomplete or uncertifiable output. A Unified Execution Plan model is needed to prevent requirement, design, and implementation drift. A Taste Gate model is needed to ensure qualitative judgments remain under human authority.

## Unified Execution Plan Model

A Unified Execution Plan (UEP) is a single execution-ready governance artifact binding the following fields:

- purpose
- baseline
- decision context
- in-scope work
- out-of-scope work
- allowed files
- forbidden files
- implementation approach
- Definition of Done
- anti-criteria
- validation gates
- check-in triggers
- exit criteria
- Codex audit criteria
- GitHub verification criteria
- Owner approval requirements

### Core Principle

Everything not explicitly allowed by the UEP is forbidden.

### Drift Prevention

The UEP must prevent requirement, design, and implementation drift. Each field serves as a bounded constraint. Any deviation from the UEP during execution requires a new UEP or an Owner-approved scope amendment. Agents may not infer permission from absence. Silence is prohibition.

## Definition Of Done Model

The Definition of Done (DoD) is explicit, evidence-bound, and testable where possible. It is not a checklist — it is tied to acceptance evidence. The Definition of Done includes primary acceptance criteria, secondary acceptance criteria, non-goals, anti-criteria, and acceptance evidence.

### Primary Acceptance Criteria

The primary acceptance criteria are conditions that must be met for the phase to be considered complete. Each criterion must reference observable evidence (file content, gate output, commit SHA).

### Secondary Acceptance Criteria

Conditions that should be met but do not block completion. They are tracked for follow-up phases.

### Non-Goals

Work that is explicitly not part of this phase. Stated to prevent scope creep.

### Anti-Criteria

Conditions that, if present, invalidate completion regardless of primary criteria.

### Required Gates

Validation gates that must pass before completion can be claimed.

### Required Human Review Points

The required human review points include decisions or artifacts that require Owner or designated human review.

### Required Codex Audit Points

The required Codex audit points include artifacts or state that require Codex audit before canonicalization.

### Final Canonicalization Requirements

The final canonicalization requirements are the conditions required for the phase to achieve canonical status (see Canonicalization Boundary).

## Agent Autonomy Threshold

### Continue Conditions

An agent may continue execution only when **all** of the following are true:

- work remains inside approved scope
- allowed file set remains sufficient
- forbidden surfaces remain untouched
- no new requirement emerges
- no ambiguous product/taste decision appears
- gates remain passable
- no authority boundary is crossed

### Stop Conditions

An agent must stop execution when **any** of the following occurs:

- scope expands
- file surface expands
- evidence is missing
- design decision changes
- TASTE_REQUIRED appears
- readiness/deployment/certification language appears
- generated runtime state appears
- registry write appears
- AgentBridge authority appears
- runtime/schema/validator/CI work appears without approval

## Check-In Trigger Model

Check-in triggers define conditions under which an agent must report status and await guidance before continuing.

### Required Check-In Triggers

- baseline moved
- local repo dirty unexpectedly
- untracked files appear
- generated runtime state appears
- allowed file list is insufficient
- implementation requires new file type
- new dependency is needed
- lockfile policy changes
- test or validation gate fails
- requirement conflict appears
- UX/product/taste decision appears
- roadmap/backlog authority would be implied
- deployment/readiness/certification language appears
- old phase labels conflict with current canonical baseline

### Clarification: Generated Runtime State

Generated runtime state means any of the following appear unexpectedly:

- .pnpd/product-delivery-registry
- .pnpd/ledger
- .pnpd/handoffs
- .pnpd/locks

Tracked .pnpd schemas are not generated runtime state. Tracked .pnpd schemas (tracked files under .pnpd/ that are part of the committed repository structure) are not generated runtime state.

## Exit Criteria Model

Exit criteria are split into local completion and canonical completion.

### Local Exit Criteria

Local completion requires **all** of the following:

- exact allowed file set honored
- forbidden file surface untouched
- required phrases present
- negative guardrails absent
- all validation gates pass
- state gates pass
- no untracked files remain
- full 40-character commit SHA exists
- push status clear
- merge status clear
- Codex audit pending or complete
- canonicalization boundary stated

### Canonical Completion

Canonical completion requires later verification:
- Codex audit
- GitHub/App verification
- Owner approval

### Owner Cancellation Contract

Cancellation is an Owner-authorized, unsuccessful termination available only before `MERGED`. Agents may recommend cancellation but cannot authorize it. A valid decision records `decision_type: owner_cancellation`, `owner_cancelled: true`, `owner_decision_reference`, `cancellation_reason`, `last_valid_state`, `unresolved_findings`, `pr_number_if_any`, `pr_state_if_any`, `branch_name_if_any`, `branch_state`, `repository_state`, `required_safety_cleanup`, `cancelled_by`, `cancelled_at`, and `next_state: CANCELLED`.

Eligible predecessors are the repository's active pre-merge states: `PROPOSED`, `ROUTED`, `IN_PROGRESS`, `IMPLEMENTED`, `RUNTIME_SMOKE_TESTED`, `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_REQUESTED`, `CODEX_AUDIT_COMPLETED`, `OWNER_PR_AUTHORIZED`, `PR_OPENED`, `OWNER_MERGE_APPROVED`, `REQUEST_CHANGES`, and `BLOCKED`. `MERGED`, `POST_MERGE_AUDIT_REQUESTED`, `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`, and `CANCELLED` cannot transition to `CANCELLED`. `CANCELLED` is terminal, is neither `PASS` nor `CLOSED`, preserves unresolved findings and safety cleanup, and cannot transition to any state. Mandatory post-merge verification and cleanup cannot be cancelled. `CLOSED` remains reachable only from `BRANCH_CLEANUP`.

## Execution Gates

Every implementation lane SHALL execute the following gates in order. Each gate is a mandatory checkpoint. No gate may be skipped. A lane that fails a gate returns to the appropriate earlier gate.

### Gate 0 — Scope Locked

| Field | Value |
|-------|-------|
| Purpose | Lock the implementation scope before any code is written. Ensure all agents agree on what is in scope, out of scope, allowed files, forbidden files, and exit criteria. |
| Owner | Hermes |
| Entry Criteria | Task contract or UEP exists with explicit scope, allowed files, forbidden files, and boundary conditions. |
| Exit Criteria | Scope is documented, approved by Owner, and branched from canonical main. |
| Evidence Required | UEP or task contract file committed; Owner approval recorded. |
| Failure Behaviour | If scope is ambiguous, Lane returns to proposal phase. If scope is rejected by Owner, Lane enters `CANCELLED` terminal state. `CLOSED` is reserved for lanes that complete all gates successfully. |
| Rollback Behaviour | Scope lock may be amended only by Owner-approved scope amendment. |

### Gate 1 — Implementation Complete

| Field | Value |
|-------|-------|
| Purpose | All code changes for the scoped increment are complete and committed to the working branch. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Scope locked (Gate 0 passed); working branch created from canonical main. |
| Exit Criteria | All in-scope changes implemented; working tree clean; no untracked files remain (except allowed ignores). |
| Evidence Required | `git status --short` shows clean working tree; `git log --oneline` shows scoped commits. |
| Failure Behaviour | If scope was exceeded, return to Gate 0 for scope amendment. If implementation is incomplete, return to implementation. |
| Rollback Behaviour | `git reset --hard` to last known-good commit; re-implement. |

### Gate 2 — Unit Tests Green

| Field | Value |
|-------|-------|
| Purpose | Confirm that all unit tests pass on the working branch before proceeding to integration or runtime verification. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Gate 1 passed. |
| Exit Criteria | All unit tests pass; no new unit test failures beyond pre-existing baselines. |
| Evidence Required | Full `npm test` or equivalent unit test runner output showing pass/fail counts. |
| Failure Behaviour | Lane returns to Gate 1 for test repair. Failed gates stay failed until rerun; new failures must be addressed before re-entry. |
| Rollback Behaviour | Revert failing test commits; re-run gate. |

### Gate 3 — Integration Tests Green

| Field | Value |
|-------|-------|
| Purpose | Confirm that integration tests (cross-module, API, database, or auth-dependent) pass on the working branch. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Gate 2 passed. |
| Exit Criteria | All integration tests pass; no regressions introduced. |
| Evidence Required | Full integration test runner output with pass/fail counts. |
| Failure Behaviour | Lane returns to Gate 1. Integration failures indicate scope drift, missing configuration, or incorrect assumptions — all require implementation repair before re-entry. |
| Rollback Behaviour | Revert integration-affecting commits; re-run gate. |

### Gate 4 — Runtime Evidence Satisfied

| Field | Value |
|-------|-------|
| Purpose | Prove that the implementation runs correctly (or document why runtime evidence is not applicable). This gate requires exactly one valid Runtime Evidence contract. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Gates 1–3 passed. |
| Exit Criteria | Exactly one of: valid **Runtime Verified** contract or valid **Runtime Not Applicable** contract. |
| Evidence Required | **Valid Path A — Runtime Verified:** executable runtime exists, runtime smoke executed, intended observable behaviour confirmed, evidence recorded (screenshots, console logs, HTTP response codes, or recorded terminal output). **Valid Path B — Runtime Not Applicable:** no executable runtime surface exists, explicit reason documented, runtime surface classification, substitute evidence, verifier, timestamp. |
| Failure Behaviour | Lane returns to Gate 1. **Runtime Not Verified** never satisfies Gate 4. Runtime defects or absent evidence are always implementation defects and must be fixed before proceeding. Static checks must never replace runtime evidence where an executable runtime exists. |
| Rollback Behaviour | Revert runtime-breaking commits; re-run Gate 2 and Gate 3 before re-entering Gate 4. |

### Gate 5 — Self Review Complete

| Field | Value |
|-------|-------|
| Purpose | The implementing agent performs a structured self-review against scope, diff, tests, and boundaries before requesting external review. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Gates 1–4 passed. |
| Exit Criteria | Self-review log documents scope check, diff review, test gate results, runtime evidence, and any caveats or assumptions. |
| Evidence Required | Self-review log entry committed or recorded. |
| Failure Behaviour | If self-review reveals unresolved issues, Lane returns to Gate 1 for fixes, then re-runs Gates 2–4. |
| Rollback Behaviour | Revert problematic commits before re-entering Gate 1. |

### (Prerequisite) Hermes Operational Verification — Layer 2

*This is not a numbered gate. It is a mandatory prerequisite invoked between Gate 5 (Self Review) and Gate 6 (Codex Audit).*

| Field | Value |
|-------|-------|
| Purpose | Hermes verifies worktree state, branch, evidence completeness, and anti-drift controls before the lane enters formal Codex audit. |
| Owner | Hermes |
| Entry Criteria | Gate 5 passed; self-review log available. |
| Exit Criteria | Hermes issues one of: `READY_FOR_CODEX_AUDIT`, `REQUEST_CHANGES` (returns to Gate 1), or `BLOCKED` (blocks lane). |
| Evidence Required | Hermes verification log confirming branch, worktree, evidence completeness, and anti-drift checks. |
| Failure Behaviour | `REQUEST_CHANGES` returns lane to Gate 1. `BLOCKED` holds lane until blocker is resolved. |
| Rollback Behaviour | If branch drift or contamination is detected, Hermes may recommend branch recreation before re-entry. |

### Gate 6 — Independent Codex Audit

| Field | Value |
|-------|-------|
| Purpose | Independent formal audit by Codex. Validates implementation, scope fidelity, safety, governance compliance, and runtime evidence. |
| Owner | Codex |
| Entry Criteria | Gate 5 passed; Hermes verification completed; self-review log available; full branch/proposed diff available. |
| Exit Criteria | Codex issues one of: `CODEX_AUDIT_COMPLETED`, `CODEX_AUDIT_COMPLETED_WITH_CAVEATS`, `CODEX_REQUEST_CHANGES`, or `CODEX_BLOCKED`. |
| Evidence Required | Codex audit report documenting verdict, caveats (if any), and merge recommendation. |
| Failure Behaviour | `CODEX_REQUEST_CHANGES` returns Lane to Gate 1. `CODEX_BLOCKED` holds Lane until blocker is resolved. |
| Rollback Behaviour | Revert implementation commits if Codex finds uncorrectable issues; re-propose from Gate 0. |
| Audited Evidence | `codex_audit_reference`, `codex_verdict`, `audited_base_sha`, `audited_head_sha`, `audit_timestamp`, `runtime_status`, `scope_status`, `blocking_findings_status`. |

### Gate 7 — Owner PR Authorization

| Field | Value |
|-------|-------|
| Purpose | Owner reviews the Codex audit result and authorizes PR creation. This is NOT a merge authorization — merge requires separate approval at Gate 9. |
| Owner | Owner |
| Entry Criteria | Gate 6 passed; Codex audit report available. |
| Exit Criteria | Owner issues PR authorization decision with rationale. |
| Evidence Required | Owner PR authorization recorded (GitHub review, signed comment, or owner-decision log). |
| Failure Behaviour | If Owner requests changes, Lane returns to Gate 1. If Owner blocks, Lane enters `BLOCKED` state. If Owner cancels the lane, Lane enters `CANCELLED` terminal state. `CLOSED` is reserved for lanes that complete all gates successfully. |
| Rollback Behaviour | Owner may accept Codex caveats (CODEX_AUDIT_COMPLETED_WITH_CAVEATS). Override rationale must be recorded and does not retroactively pass skipped or failed gates. |

### Gate 8 — Pull Request

| Field | Value |
|-------|-------|
| Purpose | Open a PR to main containing the scoped changes. The PR body references the scope document, test evidence, runtime evidence, Codex audit, and Owner PR authorization. |
| Owner | DeepSeek / OpenCode |
| Entry Criteria | Gate 7 passed (Owner PR authorization). |
| Exit Criteria | GitHub PR is open against main. PR body documents scope, test results, runtime evidence, and audit/PR-authorization trail. |
| Evidence Required | `pr_number`, `pr_url`, `base_branch`, `base_sha`, `head_branch`, `head_sha`, `draft_or_ready_status`, `proposed_diff_reference`, `owner_pr_authorization_reference`, `opened_at`. |
| Failure Behaviour | If PR cannot be opened (branch conflict, base divergence), resolve conflict and re-enter Gate 8. |
| Rollback Behaviour | Close PR without merging; return to Gate 1. |
| Head-Change Rule | If the PR head changes materially after the recorded Codex audit, the previous audit is stale. Any existing merge authorization is invalid. The lane returns to self-review, Hermes verification, and Codex audit stages. |

### Gate 9 — Owner Merge Approval + Merge

| Field | Value |
|-------|-------|
| Purpose | Owner separately authorizes the merge of the open PR, then merge executes. This is a distinct authorization from Gate 7 (PR creation authorization). |
| Owner | Owner (authorises merge); OpenCode or GitHub (executes). |
| Entry Criteria | Gate 8 passed (PR exists); `pr_number` and `pr_url` recorded; `base_sha` recorded; `head_sha` recorded; current audit applies to current head; required checks passed; separate Owner merge authorization recorded. Gate 7 authorization alone is insufficient. |
| Exit Criteria | Owner merge authorization recorded; merge commit exists on main. |
| Evidence Required | Complete Owner merge authorization record (separate from PR authorization): `decision_type: owner_merge_authorization`, `owner_merge_approved: true`, `owner_decision_reference`, `pr_number`, `pr_url`, `base_branch`, `base_sha`, `head_branch`, `head_sha`, `codex_audit_reference`, `codex_verdict`, `required_checks_status`, `approved_merge_method`, `approved_by`, and `approved_at`; merge commit SHA; merged timestamp. `pr_number` cannot be `N/A`. |
| Failure Behaviour | If merge conflicts or CI failures occur, lane returns to Gate 1 for conflict resolution. Owner must re-authorize. |
| Head-Change Invalidation | Merge authorization is bound to the recorded `pr_number`, `base_sha`, `head_sha`, current Codex audit, and current required-check status. Any material head-SHA change invalidates the previous merge authorization. A new audit and new Owner merge authorization are required before merge. |
| Rollback Behaviour | `git revert` the merge commit; create a new branch for fixes. |

### Gate 10 — Post-Merge Verification

| Field | Value |
|-------|-------|
| Purpose | Confirm that the merge did not break main. Verify the merged commit, main SHA, scope fidelity, CI status, and runtime behaviour. Record cleanup eligibility — Gate 10 does NOT perform cleanup or close the lane. |
| Owner | Codex |
| Entry Criteria | Gate 9 passed; merge commit exists on main. |
| Exit Criteria | Post-merge audit records all 17 mandatory fields grouped into seven evidence categories and leaves `lane_closure_ready: false` pending Gate 11. |
| Evidence Required | PR identity: `pr_number`, `pr_url`, `pr_merged_state`. Merge identity: `merge_commit_sha`, `canonical_main_sha`, `merged_scope`. CI evidence: `ci_status`. Runtime evidence: `runtime_status`, `runtime_evidence_reference`. Cleanup evidence: `branch_cleanup_status`, `cleanup_eligibility`, `cleanup_required_actions`, `cleanup_evidence_reference`. Closure evidence: `lane_closure_ready`, `blocking_findings`. Verification attribution: `verified_by`, `verified_at`. All 17 fields across these seven categories are mandatory. Gate 10 may record cleanup as pending but does not perform normal branch deletion or close the lane. |
| Failure Behaviour | If post-merge verification detects critical drift, recommend rollback to Owner. Non-critical drift creates a follow-up issue. Gate 10 must not perform branch deletion, claim final lane closure, or transition directly to CLOSED. |
| Rollback Behaviour | Owner decides: rollback (`git revert`), hotfix, or follow-up. |

### Gate 11 — Branch Cleanup and Closure

| Field | Value |
|-------|-------|
| Purpose | Perform required branch deletion (if applicable), verify one valid cleanup outcome, record cleanup evidence, determine closure eligibility, and transition to CLOSED only after evidence passes. No lane may close without passing Gate 11. |
| Owner | DeepSeek / OpenCode (executes); Owner or Hermes (confirms). |
| Entry Criteria | Gate 10 passed; all 17 mandatory post-merge fields are recorded; post-merge audit confirms no critical drift; cleanup fields recorded at Gate 10. Already-absent and not-applicable outcomes still require Gate 11 verification. |
| Exit Criteria | One valid cleanup outcome recorded with full outcome-specific evidence. Cleanup performed or confirmed. `lane_closure_ready` set to `true`. Lane transitions to `CLOSED` if evidence passes, or `BLOCKED` if it fails. |
| Outcome Evidence | Evidence required depends on the specific cleanup outcome: **completed** — `branch_cleanup_status`: completed, `branch_previously_existed`: true, `branch_name`, `deletion_command_or_authoritative_source`, `local_branch_status_before`: exists, `local_branch_status_after`: deleted, `remote_branch_status_before`: exists, `remote_branch_status_after`: deleted, `canonical_main_sha`, `merged_head_sha`, `merged_head_reachable_from_main`: true, `verified_by`, `verified_at`. **already_absent** — `branch_cleanup_status`: already_absent, `branch_name`, `independent_absence_verification`, `automatic_or_prior_deletion_evidence` (where available), `local_branch_status`: absent, `remote_branch_status`: absent, `canonical_main_sha`, `merged_head_sha`, `merged_head_reachable_from_main`: true, `verified_by`, `verified_at`. **not_applicable_with_reason** — `branch_cleanup_status`: not_applicable_with_reason, `explicit_reason`, `evidence_no_feature_branch_was_used`, `change_delivery_method`, `canonical_main_sha`, `relevant_commit_or_merge_evidence`, `verified_by`, `verified_at`. |
| Failure Behaviour | An existing branch must not remain merely for reference. An already-absent branch must not be recreated. A lane with no feature branch must record `not_applicable_with_reason`. `not_applicable_with_reason` must not be used because cleanup is inconvenient or where a branch existed. Unsupported claims route to `BLOCKED`. If branch cannot be deleted (e.g., branch protection), record exception and escalate to Owner. Gate 11 must not be skipped — it is the only gate that can set `lane_closure_ready: true`. |
| Rollback Behaviour | N/A — branch cleanup is safe once merge is verified. Branch can be recreated from merge commit if needed. |

### Gate Flow Diagram

```
Gate 0  Scope Locked
  ↓
Gate 1  Implementation Complete
  ↓
Gate 2  Unit Tests Green
  ↓
Gate 3  Integration Tests Green
  ↓
Gate 4  Runtime Evidence Satisfied
  ↓
Gate 5  Self Review Complete
  ↓
(Hermes Verification — Layer 2, mandatory prerequisite)
  ↓
Gate 6  Independent Codex Audit
  ↓
Gate 7  Owner PR Authorization
   ↓
Gate 8  Pull Request
   ↓
Gate 9  Owner Merge Approval + Merge
  ↓
Gate 10 Post-Merge Verification (records cleanup eligibility, lane_closure_ready=false)
  ↓
Gate 11 Branch Cleanup and Closure (performs/verifies cleanup, lane_closure_ready=true)
  ↓
        CLOSED (successful completion)
```

---

## Mandatory Governance Rules

There are 11 top-level mandatory governance rules (Rules 1–11). Rule 3a is a subordinate clarification under Rule 3 and is not counted as a separate top-level rule. These rules are mandatory for every implementation lane. They replace any prior advisory language.

### Rule 1 — Runtime Evidence before Audit

No implementation lane may enter Codex audit before Gate 4 (Runtime Evidence Satisfied) is met. Gate 4 is satisfied through one of: Runtime Verified (executable runtime exists and runtime evidence is complete) or Runtime Not Applicable (no executable runtime surface and the complete N/A evidence contract is met). Runtime Not Verified never satisfies Gate 4.

Audit checks implementation, scope, safety, and governance — it never replaces runtime verification. Static checks do not replace runtime evidence for executable work.

### Rule 2 — Runtime Defect Returns Lane to Implementation

Runtime defects discovered after implementation (at any gate from Gate 4 onward) automatically return the lane to Gate 1 (Implementation Complete). The lane must re-pass Gates 2–4 before proceeding.

### Rule 3 — Codex Validates Implementation, Not Runtime

Codex audit validates implementation correctness, scope fidelity, and governance compliance. It does not replace or certify runtime verification.

Every audit must declare exactly one of:

- `Runtime Verified` — runtime smoke evidence was reviewed and is acceptable.
- `Runtime Not Verified` — runtime smoke evidence was missing, insufficient, or not reviewed. When Runtime Not Verified is declared, the Pre-Merge Audit SHALL reject the PR.
- `Runtime Not Applicable` — the lane has no executable runtime surface (governance-only documentation, templates, or non-runnable changes). Requires: explicit reason, affected surface classification, substitute validation evidence, self-review confirmation, Hermes verification, and Codex acceptance during audit. Substitute evidence may include: `npm run validate`, `npm run dry-run`, `npm test`, `git diff --check`, cross-document contradiction analysis, state-machine transition review, or GitHub CI results.

#### Rule 3a — Runtime Status Routing (subordinate to Rule 3)

Every lane must carry `runtime_status`, `runtime_reason`, `runtime_surface`, `runtime_evidence_or_substitute_evidence`, `runtime_verified_by`, and `runtime_verified_at` across all handoffs and ledger entries.

Routing rules:

- **Runtime Verified:** may proceed to Codex audit when evidence is complete.
- **Runtime Not Applicable:** may proceed to Codex audit only when the N/A contract is complete and the surface is genuinely non-executable.
- **Runtime Not Verified:** must not be routed to Codex audit. Hermes must route `Runtime Not Verified` lanes back to implementation.

### Rule 4 — No PR Before Gate 6

No PR may be opened before Gate 6 (Independent Codex Audit) passes. Opening a PR earlier creates premature review overhead and bypasses the implementation-to-audit sequence.

### Rule 5 — Separate Owner PR and Merge Authorizations

Gate 7 (Owner PR Authorization) authorizes PR creation only. Gate 9 (Owner Merge Approval) separately authorizes the merge. No single Owner action may serve both gates. This ensures the Owner has an explicit review opportunity after the PR is open and before the merge.

### Rule 6 — Branch Cleanup is Part of Lane Completion

Branch cleanup (Gate 11) is a required step in every lane. The working branch must be deleted after merge verification completes. An undeleted branch is evidence of an incomplete lane.

### Rule 7 — Lane Completion Requires Post-Merge Verification and Cleanup

No lane is complete until Gate 10 (Post-Merge Verification) and Gate 11 (Branch Cleanup and Closure) both pass. Gate 10 verifies the merge and records cleanup eligibility. Gate 11 performs or confirms branch cleanup and determines closure readiness. Merge alone does not close a lane.

### Rule 8 — Audit Declares Runtime Status

Every Codex audit output must explicitly declare one of `Runtime Verified`, `Runtime Not Verified`, or `Runtime Not Applicable` as part of the audit verdict. A blank or absent runtime field is treated as Runtime Not Verified. A `Runtime Not Applicable` declaration requires substitute evidence per Rule 3.

### Rule 9 — Review Comments Must Distinguish Defect Types

All review and audit comments must classify defects into exactly one of:

- **Implementation defect** — code logic, structure, or correctness issue.
- **Runtime defect** — app behaviour, startup, or integration issue that only manifests at runtime.
- **Governance defect** — scope drift, boundary violation, or process skip.
- **Environment defect** — config, dependency, or infra issue.

No defect may carry multiple classifications. Misclassification is a governance defect.

### Rule 10 — Execution Contracts Declare All Five Mandatory Fields

Every execution contract (task contract, UEP, or equivalent) must explicitly declare:

1. **Executor** — who implements (e.g., DeepSeek, OpenCode).
2. **Auditor** — who audits (e.g., Codex).
3. **Owner** — who approves (e.g., Owner / named human).
4. **Boundary** — allowed files, forbidden files, and scope limits.
5. **Exit Criteria** — conditions that define lane completion.

A contract missing any of the five fields is incomplete. No agent may begin implementation on an incomplete contract.

### Rule 11 — Hermes Before Codex

No implementation lane may enter Codex audit (Gate 6) before Hermes operational verification (Layer 2) confirms all of the following:

- worktree is clean and on the correct working branch
- evidence for Gates 1–5 is complete and recorded
- no anti-drift violation exists (scope, authority, security, branch)
- self-review log is available and complete

Hermes verification is a mandatory prerequisite to Gate 6. It does not replace Codex audit. Hermes may route back to DeepSeek (REQUEST_CHANGES) or forward to Codex (ready for audit). Hermes cannot override Codex findings or owner decisions.

---

## Taste Gate Model

### Definition of Taste

Taste is the ability to consistently make high-quality qualitative judgments where no objective metric exists.

### Taste-Sensitive Work

Taste-sensitive work includes:

- product feel
- brand quality
- naming
- UX judgment
- interface polish
- editorial tone
- narrative quality
- positioning
- trust perception
- "does this feel right?" decisions
- any decision where copying the result is easy but originating the judgment is hard

### Required Label

TASTE_REQUIRED

### Core Rule

LLMs can propose, compare, explain, and imitate taste-sensitive options, but LLMs must not self-certify taste.

### Permitted Actions When TASTE_REQUIRED Appears

Agents may:
- generate options
- compare trade-offs
- reference approved exemplars
- identify inconsistencies

### Forbidden Actions When TASTE_REQUIRED Appears

Agents may not:
- finalize the taste decision
- claim taste approval
- substitute fake metrics
- self-certify taste

### Taste Authority

Taste approval must come from Owner or designated human taste authority.

## Work Archetype Routing Preparation

Archetypes are work modes, not job titles.

### Archetype Labels

- ARCHETYPE_PROTOTYPER
- ARCHETYPE_BUILDER
- ARCHETYPE_SWEEPER
- ARCHETYPE_GROWER
- ARCHETYPE_MAINTAINER

### Archetype Definitions

- Prototyper: creates many new directions and options
- Builder: turns approved direction into production-grade delivery
- Sweeper: simplifies, removes, cleans, optimizes
- Grower: improves adoption, feedback loops, and product-market fit
- Maintainer: secures, stabilizes, scales, and preserves quality

### Future UEP Field

A future UEP field is reserved:

- archetype

Default value: UNSET

### Hard Boundary

This phase reserves the field only. It does not implement routing, validation, runtime behavior, schema, or CI. This phase does not implement validation. This phase does not implement schema. This phase does not implement CI. Archetype routing is a future implementation concern.

## Authority Boundary

### Authority Model

- Owner = final authority
- Hermes = design, orchestration, and operational verification (Layer 2)
- DeepSeek/OpenCode = implementation
- Codex = audit/finalization (pre-merge: Layer 3; post-merge: Layer 4)
- GitHub/App = remote evidence verification

### Responsibilities

- Hermes may design, recommend, and operationally verify (Layer 2). Hermes does not implement this phase, does not audit, and does not merge. Hermes verification (Layer 2) is a mandatory prerequisite between Gate 5 (Self Review) and Gate 6 (Codex Audit). Hermes cannot override Codex findings or Owner decisions.
- DeepSeek/OpenCode implements only within Owner-approved scope.
- Codex audits and finalizes. Codex pre-merge audit (Layer 3) is a mandatory gate before any PR may be opened. Codex post-merge audit (Layer 4) is mandatory for all merges before lane closure.
- Owner approves taste, scope expansion, baseline changes, and canonicalization. Owner may override Codex findings with recorded rationale.

## Forbidden Implementation

This phase does not authorize:

- runtime implementation
- schema changes
- validator additions
- fixtures
- CI enforcement
- registry writes
- generated state
- AgentBridge authority
- idea generator
- template parser
- template converter
- package changes
- lockfile changes
- dependency installation policy changes
- plugin manifest
- skills directory
- deployment
- dispatch
- certification
- production readiness claim
- adoption readiness claim
- roadmap commitment claim

## Drift Risk Register

| Risk | Description | Mitigation |
|------|-------------|------------|
| Scope creep | Agent implements work outside approved scope | UEP explicit in-scope/out-of-scope; stop conditions enforced |
| File surface expansion | Agent creates or modifies files outside allowed set | Allowed/forbidden file lists; git diff --name-only gates |
| Taste bypass | Agent self-certifies taste decisions | Taste Gate model; TASTE_REQUIRED label; human authority required |
| Generated state | Agent creates runtime state unexpectedly | State gates; explicit generated state definition |
| Baseline drift | Commit history diverges from canonical baseline | Check-in triggers on baseline moved |
| Authority confusion | Agent assumes authority it does not have | Authority boundary section; explicit denial of authorities |
| Silent requirement change | New requirement appears without UEP update | Check-in triggers; stop conditions |
| Premature canonical claim | Phase marked canonical without all required steps | Canonicalization boundary; 8-step canonicalization chain |

## Future Implementation Gates

### File Scope Check

```bash
git diff --name-only
```

Expected only:
docs/pnpd/unified-execution-plan-and-taste-gate-design.md

### Forbidden Drift Checks

```bash
git diff -- .pnpd
git diff -- scripts
git diff -- templates
git diff -- tests/fixtures
git diff -- package.json
git diff -- package-lock.json
git diff -- npm-shrinkwrap.json
git diff -- .github/workflows
git diff -- README.md
git diff -- memory
```

Each must produce no output.

### Validation Gates

```bash
git diff --check
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
```

### State Gates

```bash
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks

find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
```

Expected: no output.

## Future DeepSeek Report Contract

### Expected Verdict After Successful Implementation

DEEPSEEK_PHASE_1P_M_UNIFIED_EXECUTION_PLAN_AND_TASTE_GATE_COMMITTED_AMBER_NOT_CODEX_AUDITED

### Required Final Report Fields

1. Verdict
2. Branch
3. Base commit
4. Commit
5. Files changed
6. Unified execution plan model result
7. Definition of Done result
8. Autonomy threshold result
9. Check-in trigger result
10. Exit criteria result
11. Taste Gate result
12. Work archetype preparation result
13. Authority boundary result
14. Forbidden implementation result
15. Drift risk result
16. Gates run
17. State result
18. Known untracked files
19. Push status
20. Merge status
21. Canonicalization boundary
22. Next safest step

### Blocked Verdicts

- DEEPSEEK_PHASE_1P_M_BLOCKED_BASELINE_MOVED — baseline commit changed since UEP was defined
- DEEPSEEK_PHASE_1P_M_BLOCKED_FILE_SCOPE_DRIFT — files outside allowed set were created or modified
- DEEPSEEK_PHASE_1P_M_BLOCKED_GATES_FAILED — one or more validation or state gates failed
- DEEPSEEK_PHASE_1P_M_BLOCKED_GENERATED_STATE — generated runtime state appeared unexpectedly

## Canonicalization Boundary

Phase 1P-M becomes canonical only after:

1. Hermes design
2. Owner approval
3. DeepSeek/OpenCode implementation
4. Codex audit/finalize
5. fast-forward merge to main
6. push to origin
7. remote CI success
8. Owner/GitHub App verification

Until then, this document is advisory only.

## Next Safest Step

After successful DeepSeek implementation:
- Do not push.
- Do not merge.
- Do not claim canonical status.

The next step is Codex audit/finalize from the committed branch.
