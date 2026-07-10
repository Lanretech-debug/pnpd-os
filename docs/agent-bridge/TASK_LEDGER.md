# Task Ledger — PNPD AgentBridge

> State machine definition for all tasks tracked through PNPD AgentBridge.
> Every task moves through exactly one state at a time.
> State transitions are governed by anti-drift controls.

---

## State Machine Overview

```
PROPOSED
  ↓
ROUTED
  ↓
IN_PROGRESS
  ↓
IMPLEMENTED
  ↓
RUNTIME_SMOKE_TESTED
  ↓
SELF_REVIEWED
  ↓
HERMES_VERIFIED
  ↓
CODEX_AUDIT_REQUESTED
   ↓
CODEX_AUDIT_COMPLETED
  ↓
OWNER_PR_AUTHORIZED
  ↓
PR_OPENED
  ↓
OWNER_MERGE_APPROVED
  ↓
MERGED
  ↓
POST_MERGE_AUDIT_REQUESTED
  ↓
POST_MERGE_VERIFIED
  ↓
BRANCH_CLEANUP
  ↓
CLOSED

(any state) → BLOCKED
(any pre-merge state) → REQUEST_CHANGES
(any state) → CANCELLED (terminal, lane abandoned)
```

---

## State Definitions

### PROPOSED

- **Meaning:** Task has been proposed but not yet routed to an agent.
- **Who can enter:** Owner or any agent proposing a new task.
- **Required evidence:** Task proposal with scope, allowed_files, forbidden_files.
- **Allowed next states:** `ROUTED`, `CANCELLED`.
- **Forbidden next states:** `IN_PROGRESS`, `IMPLEMENTED`, `MERGED`.

### ROUTED

- **Meaning:** Task assigned to DeepSeek. Implementation may begin.
- **Who can enter:** Owner or Hermes (routing).
- **Required evidence:** Routing decision recorded; scope confirmed.
- **Allowed next states:** `IN_PROGRESS`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `IMPLEMENTED`, `MERGED`.

### IN_PROGRESS

- **Meaning:** DeepSeek is actively implementing.
- **Who can enter:** DeepSeek (after receiving routed task).
- **Required evidence:** Worktree confirmed clean; correct branch confirmed.
- **Allowed next states:** `IMPLEMENTED`, `BLOCKED`, `REQUEST_CHANGES`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.

### IMPLEMENTED

- **Meaning:** Code changes complete. Self-review pending.
- **Who can enter:** DeepSeek.
- **Required evidence:** All commits staged; diff summary available.
- **Allowed next states:** `RUNTIME_SMOKE_TESTED`, `BLOCKED`.
- **Forbidden next states:** `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.

### RUNTIME_SMOKE_TESTED

- **Meaning:** The implementation has been verified at runtime (local dev server, staging, or browser smoke), or the lane has no executable runtime surface. This gate prevents entering self-review or audit without runtime evidence or an approved N/A declaration.
- **Who can enter:** DeepSeek / OpenCode.
- **Required evidence:** Runtime smoke evidence recorded (screenshots, terminal output, console logs, or HTTP response codes proving the app starts and responds) **or** `Runtime Not Applicable` declaration with full N/A evidence contract (runtime_reason, runtime_surface, substitute_evidence, verified_by, verified_at).
- **Allowed next states:** `SELF_REVIEWED`, `BLOCKED`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.
- **Anti-drift:** Runtime smoke is NOT a substitute for self-review, Hermes verification, or Codex audit. It is a prerequisite only. `Runtime Not Applicable` requires substitute evidence and does not skip governance validation.

### SELF_REVIEWED

- **Meaning:** DeepSeek has completed self-review. Ready for Hermes verification.
- **Who can enter:** DeepSeek.
- **Required evidence:** Self-review log with all gates checked; diff summary; handoff to Hermes written.
- **Allowed next states:** `HERMES_VERIFIED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `CODEX_AUDIT_COMPLETED`, `OWNER_PR_AUTHORIZED`, `MERGED`.
- **Anti-drift:** DeepSeek self-review is NOT formal audit. Cannot skip to Codex.

### HERMES_VERIFIED

- **Meaning:** Hermes has verified worktree, branch, evidence, and anti-drift controls.
- **Who can enter:** Hermes.
- **Required evidence:** Hermes verification log; all anti-drift controls checked; clean worktree confirmed.
- **Allowed next states:** `CODEX_AUDIT_REQUESTED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `OWNER_PR_AUTHORIZED`, `MERGED`.
- **Anti-drift:** Hermes verification is NOT Codex audit. Cannot skip to owner decision.

### CODEX_AUDIT_REQUESTED

- **Meaning:** Codex has been requested to perform formal audit.
- **Who can enter:** Hermes (routing to Codex).
- **Required evidence:** Full branch/proposed diff; Hermes verification result; DeepSeek self-review.
- **Allowed next states:** `CODEX_AUDIT_COMPLETED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `OWNER_PR_AUTHORIZED`, `MERGED`.

### CODEX_AUDIT_COMPLETED

- **Meaning:** The independent Codex audit has completed and produced a recorded verdict. This state does not itself authorize PR creation or merge.
- **Who can enter:** Codex.
- **Required evidence:**
  - `codex_audit_reference`
  - `codex_verdict`
  - `audited_base_sha`
  - `audited_head_sha`
  - `audit_timestamp`
  - `runtime_status`
  - `scope_status`
  - `blocking_findings_status`
- **Allowed next states:** `OWNER_PR_AUTHORIZED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `PR_OPENED`, `OWNER_MERGE_APPROVED`, `MERGED`, `CLOSED`.

### OWNER_PR_AUTHORIZED

- **Meaning:** Owner has authorized that a pull request may be created or continued. This is NOT a merge authorization — it never authorizes merge.
- **Who can enter:** Owner.
- **Required evidence:**
  - `owner_pr_authorized`: true
  - `owner_decision_reference`
  - `authorized_branch`
  - `authorized_base_sha`
  - `authorized_head_sha`
  - `codex_audit_reference`
  - `authorized_at`
  - `pr_creation_only`: true
- **Allowed next states:** `PR_OPENED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `OWNER_MERGE_APPROVED`, `MERGED`, `POST_MERGE_AUDIT_REQUESTED`, `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`.
- **Anti-drift:** Owner PR authorization permits creation or continuation of the PR only. It does not authorize merge. Merge requires separate OWNER_MERGE_APPROVED after PR review and checks.

### PR_OPENED

- **Meaning:** A pull request has been opened against the target branch. The PR body documents the scope, test results, runtime evidence, Hermes verification, Codex audit, and Owner authorization trail.
- **Who can enter:** DeepSeek / OpenCode (opens PR).
- **Required evidence:**
  - `pr_number`
  - `pr_url`
  - `base_branch`
  - `base_sha`
  - `head_branch`
  - `head_sha`
  - `draft_or_ready_status`
  - `proposed_diff_reference`
  - `owner_pr_authorization_reference`
  - `opened_at`
- **Allowed next states:** `OWNER_MERGE_APPROVED`, `REQUEST_CHANGES` (if the proposed diff changes materially), `BLOCKED`.
- **Forbidden next states:** `MERGED` (merge requires explicit owner merge authorization), `POST_MERGE_AUDIT_REQUESTED`, `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`.
- **Failure behaviour:** If the PR diff does not match the approved scope, the lane returns to `REQUEST_CHANGES` for correction. If the PR cannot be opened (branch conflict, base divergence), the issue must be resolved before re-entry.
- **Head-Change Rule:** If the PR head changes materially after the recorded Codex audit, the previous audit is stale. Any existing merge authorization is invalid. The lane returns to appropriate self-review, Hermes verification, and Codex audit stages.

### OWNER_MERGE_APPROVED

- **Meaning:** Owner has explicitly authorized the merge of one specific reviewed PR state. This is separate from PR creation authorization. Merge authorization is bound to the actual PR number, base SHA, head SHA, current Codex audit, and current required-check status.
- **Who can enter:** Owner.
- **Required evidence:**
  - `owner_merge_approved`: true
  - `owner_decision_reference`
  - `pr_number`
  - `pr_url`
  - `base_branch`
  - `base_sha`
  - `head_branch`
  - `head_sha`
  - `codex_audit_reference`
  - `required_checks_status`
  - `approved_at`
- **Allowed next states:** `MERGED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `PR_OPENED` (PR already exists), `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`.
- **Anti-drift:** Merge authorization is bound to the recorded PR number, base SHA, head SHA, current Codex audit, and current required-check status. Any material head-SHA change invalidates the previous merge authorization. A new audit and new Owner merge authorization are required before merge. If further changes are required, a new REQUEST_CHANGES cycle must begin from PR_OPENED.

### MERGED

- **Meaning:** PR has been merged into target branch.
- **Who can enter:** DeepSeek or GitHub executes merge after OWNER_MERGE_APPROVED.
- **Required evidence:** Merge commit hash; merge timestamp; owner merge approval reference.
- **Allowed next states:** `POST_MERGE_AUDIT_REQUESTED`.
- **Forbidden next states:** `CLOSED` (post-merge audit is mandatory before closing), reversion to pre-merge states.

### POST_MERGE_AUDIT_REQUESTED

- **Meaning:** Post-merge audit required (all merges — mandatory, not optional).
- **Who can enter:** Auto-triggered by MERGED state (all merges).
- **Required evidence:** Merge commit; risk category; owner decision reference.
- **Allowed next states:** `POST_MERGE_VERIFIED`, `BLOCKED`.
- **Forbidden next states:** `CLOSED` (must complete post-merge audit first).

### POST_MERGE_VERIFIED

- **Meaning:** Codex post-merge audit complete. No issues or follow-ups recorded.
- **Who can enter:** Codex.
- **Required evidence:** Post-merge audit report; rollback recommendation (if any).
- **Allowed next states:** `BRANCH_CLEANUP`, `CANCELLED`.
- **Forbidden next states:** `CLOSED` (branch cleanup is mandatory before closing), `MERGED` (already merged).

### BLOCKED

- **Meaning:** Task cannot proceed due to a blocker.
- **Who can enter:** Any agent.
- **Required evidence:** Blocker record in BLOCKER_LOG.md; blocker ID.
- **Allowed next states:** Return to previous state when blocker resolved; or `CANCELLED` (if lane is abandoned).
- **Forbidden next states:** Any advancement while blocker is unresolved.

### REQUEST_CHANGES

- **Meaning:** Changes requested by Hermes, Codex, or Owner.
- **Who can enter:** Hermes, Codex, or Owner.
- **Required evidence:** Specific change requests listed; handoff back to DeepSeek.
- **Allowed next states:** `IN_PROGRESS` (DeepSeek implements changes); `CANCELLED`.
- **Forbidden next states:** Advancement without addressing change requests.

### BRANCH_CLEANUP

- **Meaning:** Remote and/or local working branches have been cleaned up after successful post-merge verification. The cleanup outcome is recorded, and no branch remains without justification.
- **Who can enter:** DeepSeek / OpenCode (executes); Owner or Hermes (confirms).
- **Required evidence:**
  - `branch_cleanup_status`: one of `completed`, `already_absent`, `not_applicable_with_reason`
  - `local_branch_status`: deleted or verified absent
  - `remote_branch_status`: deleted or verified absent
  - `verification_command_or_source`: the git command or automation that confirms absence
  - `canonical_main_sha`: the target branch SHA after merge
  - `merged_head_reachable_from_main`: confirmed
  - `reason_if_not_applicable`: required when status is `not_applicable_with_reason`
  - `verified_by`: agent or human who confirmed
  - `verified_at`: ISO 8601 timestamp
- **Allowed next states:** `CLOSED`, `BLOCKED`.
- **Forbidden next states:** Reversion to any pre-CLEANUP state.
- **Failure behaviour:** An existing branch must not remain merely for reference. An already-absent branch must not be recreated merely to delete it. A no-branch lane must explicitly record `not_applicable_with_reason` and the reason.

### CANCELLED

- **Meaning:** Task or lane abandoned before completion. No further action. Distinct from CLOSED — a cancelled lane did not reach completion.
- **Who can enter:** Owner.
- **Required evidence:** Cancellation reason recorded; lane abandoned before CLOSED.
- **Allowed next states:** None (terminal state).
- **Forbidden next states:** Reopening requires new task proposal.

### CLOSED

- **Meaning:** Task complete and all gates satisfied. No further action.
- **Who can enter:** Owner.
- **Required evidence:** All required gates passed; merge complete; post-merge audit complete; branch cleanup confirmed.
- **Allowed next states:** None (terminal state).
- **Forbidden next states:** Reopening requires new task proposal.

---

## State Transition Rules

1. States advance forward only through explicit agent action with recorded evidence.
2. `BLOCKED` can be entered from any state and returns to the previous state upon resolution.
3. `REQUEST_CHANGES` can be entered from `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_REQUESTED`, or `CODEX_AUDIT_COMPLETED`.
4. No state may be skipped in the forward path.
5. `CLOSED` is terminal and indicates successful completion. A closed task cannot be reopened — a new task must be proposed.
6. `CANCELLED` is terminal and indicates the lane was abandoned before completion. A cancelled task cannot be reopened — a new task must be proposed.

---

## Anti-Drift Controls

The following controls are enforced at every state transition. Any violation blocks advancement.

### Gate Integrity

1. **Failed gates stay failed until rerun.** A gate that fails must be explicitly rerun and passed. It does not auto-clear.
2. **Skipped gates stay skipped, blocked, or not-run — never passed.** A skipped gate must record the reason. It cannot be retroactively marked as passed.

### Environment Integrity

3. **Dirty tree blocks state advancement.** Any uncommitted changes in the worktree block advancement past `IN_PROGRESS`.
4. **Wrong branch blocks state advancement.** The worktree must be on the expected branch. Cross-branch work blocks advancement.
5. **Cross-worktree contamination blocks state advancement.** Files must belong to the correct worktree. Stale or mixed worktree state blocks advancement.

### PR Integrity

6. **PR scope mismatch triggers Hermes verification.** If the implemented diff does not match the approved scope, Hermes must flag it.
7. **Large changesets must be audited as large changesets, not latest commits only.** Codex must audit the full branch/proposed diff, not just the most recent commit. Squash-merging does not reduce audit scope.

### Branch Integrity

8. **Product and governance branches must not mix.** Product code changes must not live on governance branches. Governance docs must not live on product branches. Violation blocks advancement.

### Security

9. **Secrets must never be written to handoff files.** Any detection of secrets, tokens, keys, or `.env` contents in bridge files blocks advancement immediately.
10. **Handoffs must reference evidence paths, not paste secrets.** Evidence must be file references, never inline content that could contain sensitive data.

### Merge Gate

11. **Merge requires Codex audit or explicit owner override rationale.** No merge without Codex audit result OR a recorded owner override with rationale. A material head-SHA change after Codex audit invalidates the audit — a new audit is required before merge.
12. **Post-merge audit is required for all merges.** No merge may close without a post-merge audit confirming the seven required fields. See `POST_MERGE_QUEUE.md` for high-risk categories (which require additional scrutiny, not triggering).

### Handoff Integrity

13. **Every handoff must end with one next action.** See `HANDOFF_PROTOCOL.md`.

### Certification

14. **No agent certifies its own work.** This is the foundational anti-drift rule. See `DESIGN_PLAN.md`.

---

## Task Ledger Entry Template

See `MESSAGE_SCHEMA.md` — Schema 2: Task Ledger Entry.

Every task ledger entry MUST record the following lifecycle fields. Each field records the transition timestamp and the agent or person who performed the transition.

| Recording Field | State / Event | Required When |
|----------------|---------------|---------------|
| `scopeLocked` | Gate 0 | Before implementation begins |
| `runtimeSmoke` | RUNTIME_SMOKE_TESTED | Before self-review |
| `auditCompleted` | CODEX_AUDIT_COMPLETED / CODEX_REQUEST_CHANGES | After Codex audit |
| `ownerPrAuthorization` | OWNER_PR_AUTHORIZED | Before PR is opened |
| `ownerMergeApproval` | OWNER_MERGE_APPROVED | Before merge |
| `prOpened` | PR_OPENED | Before merge |
| `merge` | MERGED | After merge |
| `verification` | POST_MERGE_VERIFIED | After post-merge audit |
| `cleanup` | BRANCH_CLEANUP | Before CLOSED |
| `closed` | CLOSED | Terminal state (successful completion) |
| `cancelled` | CANCELLED | Terminal state (lane abandoned) |

A task with missing recording fields is incomplete and must not be closed.

---

*Violation of any anti-drift control must result in BLOCKED state with a blocker record in BLOCKER_LOG.md.*
