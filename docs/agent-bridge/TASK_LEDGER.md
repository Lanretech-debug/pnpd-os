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
IN_PROGRESS | OWNER_PR_AUTHORIZED | PR_OPENED | OWNER_MERGE_APPROVED → REQUEST_CHANGES
REQUEST_CHANGES → IN_PROGRESS | OWNER_PR_AUTHORIZED | PR_OPENED | BLOCKED | CANCELLED
PROPOSED | ROUTED | IN_PROGRESS | IMPLEMENTED | RUNTIME_SMOKE_TESTED | SELF_REVIEWED | HERMES_VERIFIED | CODEX_AUDIT_REQUESTED | CODEX_AUDIT_COMPLETED | OWNER_PR_AUTHORIZED | PR_OPENED | OWNER_MERGE_APPROVED | REQUEST_CHANGES | BLOCKED
  → CANCELLED (Owner-authorized, pre-merge terminal state only)

MERGED | POST_MERGE_AUDIT_REQUESTED | POST_MERGE_VERIFIED | BRANCH_CLEANUP | CLOSED | CANCELLED
  ↛ CANCELLED
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
- **Allowed next states:** `IMPLEMENTED`, `BLOCKED`, `REQUEST_CHANGES`, `CANCELLED`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.

### IMPLEMENTED

- **Meaning:** Code changes complete. Self-review pending.
- **Who can enter:** DeepSeek.
- **Required evidence:** All commits staged; diff summary available.
- **Allowed next states:** `RUNTIME_SMOKE_TESTED`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.

### RUNTIME_SMOKE_TESTED

- **Meaning:** The implementation has been verified at runtime (local dev server, staging, or browser smoke), or the lane has no executable runtime surface. This gate prevents entering self-review or audit without runtime evidence or an approved N/A declaration.
- **Who can enter:** DeepSeek / OpenCode.
- **Required evidence:** Runtime smoke evidence recorded (screenshots, terminal output, console logs, or HTTP response codes proving the app starts and responds) **or** `Runtime Not Applicable` declaration with the canonical six-key N/A evidence contract: `runtime_status`, `runtime_reason`, `runtime_surface`, `runtime_evidence_or_substitute_evidence`, `runtime_verified_by`, `runtime_verified_at`.
- **Allowed next states:** `SELF_REVIEWED`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_AUDIT_COMPLETED`, `MERGED`.
- **Anti-drift:** Runtime smoke is NOT a substitute for self-review, Hermes verification, or Codex audit. It is a prerequisite only. `Runtime Not Applicable` requires substitute evidence and does not skip governance validation.

### SELF_REVIEWED

- **Meaning:** DeepSeek has completed self-review. Ready for Hermes verification.
- **Who can enter:** DeepSeek.
- **Required evidence:** Self-review log with all gates checked; diff summary; handoff to Hermes written.
- **Allowed next states:** `HERMES_VERIFIED`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `CODEX_AUDIT_COMPLETED`, `OWNER_PR_AUTHORIZED`, `MERGED`.
- **Anti-drift:** DeepSeek self-review is NOT formal audit. Cannot skip to Codex.

### HERMES_VERIFIED

- **Meaning:** Hermes has verified worktree, branch, evidence, and anti-drift controls.
- **Who can enter:** Hermes.
- **Required evidence:** Hermes verification log; all anti-drift controls checked; clean worktree confirmed.
- **Allowed next states:** `CODEX_AUDIT_REQUESTED`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `OWNER_PR_AUTHORIZED`, `MERGED`.
- **Anti-drift:** Hermes verification is NOT Codex audit. Cannot skip to owner decision.

### CODEX_AUDIT_REQUESTED

- **Meaning:** Codex has been requested to perform formal audit.
- **Who can enter:** Hermes (routing to Codex).
- **Required evidence:** Full branch/proposed diff; Hermes verification result; DeepSeek self-review.
- **Allowed next states:** `CODEX_AUDIT_COMPLETED`, `BLOCKED`, `CANCELLED`.
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
- **Allowed next states:** `OWNER_PR_AUTHORIZED`, `BLOCKED`, `CANCELLED`.
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
- **Allowed next states:** `PR_OPENED`, `REQUEST_CHANGES`, `BLOCKED`, `CANCELLED`.
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
- **Allowed next states:** `OWNER_MERGE_APPROVED`, `REQUEST_CHANGES` (if the proposed diff changes materially), `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `MERGED` (merge requires explicit owner merge authorization), `POST_MERGE_AUDIT_REQUESTED`, `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`.
- **Failure behaviour:** If the PR diff does not match the approved scope, the lane returns to `REQUEST_CHANGES` for correction. If the PR cannot be opened (branch conflict, base divergence), the issue must be resolved before re-entry.
- **Head-Change Rule:** If the PR head changes materially after the recorded Codex audit, the previous audit is stale. Any existing merge authorization is invalid. The lane returns to appropriate self-review, Hermes verification, and Codex audit stages.

### OWNER_MERGE_APPROVED

- **Meaning:** Owner has explicitly authorized the merge of one specific reviewed PR state. This is separate from PR creation authorization. Merge authorization is bound to the actual PR number, base SHA, head SHA, current Codex audit, and current required-check status.
- **Who can enter:** Owner.
- **Required evidence:**
  - `decision_type`: `owner_merge_authorization`
  - `owner_merge_approved`: true
  - `owner_decision_reference`
  - `pr_number`
  - `pr_url`
  - `base_branch`
  - `base_sha`
  - `head_branch`
  - `head_sha`
  - `codex_audit_reference`
  - `codex_verdict`
  - `required_checks_status`
  - `approved_merge_method`
  - `approved_by`
  - `approved_at`
- **Allowed next states:** `MERGED`, `REQUEST_CHANGES`, `BLOCKED`, `CANCELLED`.
- **Forbidden next states:** `PR_OPENED` (PR already exists), `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`.
- **Anti-drift:** Merge authorization is bound to the recorded PR number, base SHA, head SHA, current Codex audit, and current required-check status. Any material head-SHA change invalidates the previous merge authorization. A new audit and new Owner merge authorization are required before merge. If further changes are required, a new REQUEST_CHANGES cycle must begin from PR_OPENED.

### MERGED

- **Meaning:** PR has been merged into target branch.
- **Who can enter:** DeepSeek or GitHub executes merge after OWNER_MERGE_APPROVED.
- **Required evidence:** Merge commit hash; merge timestamp; owner merge approval reference.
- **Allowed next states:** `POST_MERGE_AUDIT_REQUESTED`.
- **Forbidden next states:** `CANCELLED`, `CLOSED` (post-merge audit is mandatory before closing), reversion to pre-merge states.

### POST_MERGE_AUDIT_REQUESTED

- **Meaning:** Post-merge audit required (all merges — mandatory, not optional).
- **Who can enter:** Auto-triggered by MERGED state (all merges).
- **Required evidence:** Merge commit; risk category; owner decision reference.
- **Allowed next states:** `POST_MERGE_VERIFIED`, `BLOCKED`.
- **Forbidden next states:** `CANCELLED`, `CLOSED` (must complete post-merge audit first).

### POST_MERGE_VERIFIED

- **Meaning:** The mandatory Codex post-merge audit completed and its findings were recorded.
- **Who can enter:** Codex.
- **Required evidence:** Post-merge audit report; rollback recommendation (if any).
- **Allowed next states:** `BRANCH_CLEANUP`, `BLOCKED`.
- **Forbidden next states:** `CANCELLED`, `CLOSED` (branch cleanup is mandatory before closing), `MERGED` (already merged).
- **Routing rule:** No blocking finding routes to `BRANCH_CLEANUP`; any blocking finding routes to `BLOCKED` for remediation.
- **Non-implication:** This state does not mean zero findings, successful closure, completed cleanup, or that closure is ready. Gate 11 remains mandatory.

### BLOCKED

- **Meaning:** Task cannot proceed due to a blocker.
- **Who can enter:** Any agent.
- **Required evidence:** Blocker record in BLOCKER_LOG.md; blocker ID.
- **Allowed next states:** Return to previous state when blocker resolved, subject to the post-merge exception below; or `CANCELLED` only when `last_valid_state` is one of the explicitly eligible pre-merge cancellation predecessors and the complete Owner cancellation contract is recorded. A blocker arising from `MERGED` or any later state cannot route to `CANCELLED`.
- **Forbidden next states:** Any advancement while blocker is unresolved.
- **Post-merge exception:** When `BLOCKED` was entered because Gate 10 recorded blocking findings, remediation must complete and the next eligible state is `POST_MERGE_AUDIT_REQUESTED`, not `POST_MERGE_VERIFIED`. Gate 10 must run again and record fresh findings and evidence. Only a fresh result with empty `blocking_findings` may route to `BRANCH_CLEANUP`. `BLOCKED → POST_MERGE_VERIFIED` is forbidden for a post-merge blocker unless a fresh Gate 10 execution occurred through `POST_MERGE_AUDIT_REQUESTED`.

```text
POST_MERGE_VERIFIED
  → BLOCKED
  → remediation
  → POST_MERGE_AUDIT_REQUESTED
  → fresh Gate 10
  → POST_MERGE_VERIFIED
  → BRANCH_CLEANUP only when blocking_findings is empty
```

### REQUEST_CHANGES

- **Meaning:** Changes requested by Hermes, Codex, or Owner.
- **Who can enter:** Hermes, Codex, or Owner.
- **Required evidence:** Specific change requests listed; handoff back to DeepSeek.
- **Allowed predecessors:** `IN_PROGRESS`, `OWNER_PR_AUTHORIZED`, `PR_OPENED`, `OWNER_MERGE_APPROVED`.
- **Allowed next states:** the correction-appropriate state among `IN_PROGRESS`, `OWNER_PR_AUTHORIZED`, or `PR_OPENED`; otherwise `BLOCKED`, or `CANCELLED` when the cancellation contract is satisfied.
- **Authorization effect:** Entering from `OWNER_MERGE_APPROVED` revokes the prior merge authorization. A material head change requires a fresh Codex audit and a new Owner decision.
- **Forbidden next states:** Merge, closure, or any advancement without addressing the requested changes.
- **Anti-drift:** `REQUEST_CHANGES` grants no merge or closure authority.

### BRANCH_CLEANUP

- **Meaning:** Remote and/or local working branches have been cleaned up after successful post-merge verification. The cleanup outcome is recorded, and no branch remains without justification. Exactly one valid cleanup outcome is required before CLOSED.
- **Who can enter:** DeepSeek / OpenCode (executes); Owner or Hermes (confirms).
- **Required evidence depends on outcome:**

  #### Outcome: `completed`
  A feature branch existed and was removed.
  - `branch_cleanup_status`: `completed`
  - `branch_previously_existed`: `true`
  - `branch_name`: name of the deleted branch
  - `deletion_command_or_authoritative_source`: git command or automation evidence
  - `local_branch_status_before`: `exists`
  - `local_branch_status_after`: `deleted`
  - `remote_branch_status_before`: `exists`
  - `remote_branch_status_after`: `deleted`
  - `canonical_main_sha`: the target branch SHA after merge
  - `merged_head_sha`: the merged head SHA
  - `merged_head_reachable_from_main`: `true`
  - `verified_by`: agent or human who confirmed
  - `verified_at`: ISO 8601 timestamp

  #### Outcome: `already_absent`
  A feature branch was automatically or previously removed before Gate 11.
  - `branch_cleanup_status`: `already_absent`
  - `branch_name`: name of the absent branch
  - `independent_absence_verification`: git command confirming absence
  - `automatic_or_prior_deletion_evidence`: evidence of prior deletion, where available
  - `local_branch_status`: `absent`
  - `remote_branch_status`: `absent`
  - `canonical_main_sha`: the target branch SHA after merge
  - `merged_head_sha`: the merged head SHA
  - `merged_head_reachable_from_main`: `true`
  - `verified_by`: agent or human who confirmed
  - `verified_at`: ISO 8601 timestamp

  #### Outcome: `not_applicable_with_reason`
  No feature branch existed for the lane.
  - `branch_cleanup_status`: `not_applicable_with_reason`
  - `explicit_reason`: why no branch cleanup is applicable
  - `evidence_no_feature_branch_was_used`: confirmation that no branch was created
  - `change_delivery_method`: how changes were delivered (e.g., direct commit to main)
  - `canonical_main_sha`: the target branch SHA after merge
  - `relevant_commit_or_merge_evidence`: commit or merge that delivered the change
  - `verified_by`: agent or human who confirmed
  - `verified_at`: ISO 8601 timestamp

- **Allowed next states:** `CLOSED`, `BLOCKED`.
- **Forbidden next states:** `CANCELLED` and reversion to any pre-CLEANUP state.
- **Failure behaviour:** An existing branch must not remain merely for reference. An already-absent branch must not be recreated merely to delete it. A no-branch lane must explicitly record `not_applicable_with_reason` and the reason. `not_applicable_with_reason` must not be used because cleanup is inconvenient. `not_applicable_with_reason` must not be used where a branch existed. Unsupported or false claims route to `BLOCKED`. Exactly one valid cleanup outcome is required before `CLOSED`.

### CANCELLED

- **Meaning:** Task or lane terminated unsuccessfully before merge. No further lifecycle advancement is permitted; recorded safety cleanup obligations remain visible. Distinct from CLOSED — a cancelled lane did not reach completion.
- **Who can enter:** Owner.
- **Required evidence:** Complete Owner cancellation decision containing:
  - `decision_type`: `owner_cancellation`
  - `owner_cancelled`: `true`
  - `owner_decision_reference`
  - `cancellation_reason`
  - `last_valid_state`
  - `unresolved_findings`
  - `pr_number_if_any`
  - `pr_state_if_any`
  - `branch_name_if_any`
  - `branch_state`
  - `repository_state`
  - `required_safety_cleanup`
  - `cancelled_by`
  - `cancelled_at`
  - `next_state`: `CANCELLED`
- **Allowed next states:** None (terminal state).
- **Forbidden next states:** Every state, including `CLOSED`. Reopening requires a new task proposal.
- **Anti-drift:** Only the Owner may authorize cancellation. Agents may recommend it but cannot authorize it. Cancellation is unsuccessful termination, is not `PASS` or `CLOSED`, does not erase unresolved findings, and must record required safety cleanup. Cancellation is forbidden from `MERGED` and every later state.

### CLOSED

- **Meaning:** Task complete and all gates satisfied. No further action.
- **Who can enter:** Owner.
- **Required evidence:** All required gates passed; merge complete; post-merge audit complete; branch cleanup confirmed.
- **Allowed next states:** None (terminal state).
- **Forbidden next states:** Reopening requires new task proposal.

---

## State Transition Rules

1. States advance forward only through explicit agent action with recorded evidence.
2. `BLOCKED` can be entered from any state and ordinarily returns to the previous state upon resolution. The post-merge exception takes precedence: a blocker recorded by Gate 10 must resume through `POST_MERGE_AUDIT_REQUESTED` and a fresh Gate 10 execution, never directly through the prior `POST_MERGE_VERIFIED` record.
3. `REQUEST_CHANGES` can be entered only from `IN_PROGRESS`, `OWNER_PR_AUTHORIZED`, `PR_OPENED`, or `OWNER_MERGE_APPROVED`.
4. No state may be skipped in the forward path.
5. `CLOSED` is terminal and indicates successful completion. A closed task cannot be reopened — a new task must be proposed.
6. `CANCELLED` is terminal and indicates the lane was abandoned before completion. A cancelled task cannot be reopened — a new task must be proposed.
7. `CANCELLED` may be entered only from these active pre-merge states: `PROPOSED`, `ROUTED`, `IN_PROGRESS`, `IMPLEMENTED`, `RUNTIME_SMOKE_TESTED`, `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_REQUESTED`, `CODEX_AUDIT_COMPLETED`, `OWNER_PR_AUTHORIZED`, `PR_OPENED`, `OWNER_MERGE_APPROVED`, `REQUEST_CHANGES`, and `BLOCKED`.
8. `MERGED`, `POST_MERGE_AUDIT_REQUESTED`, `POST_MERGE_VERIFIED`, `BRANCH_CLEANUP`, `CLOSED`, and `CANCELLED` may not transition to `CANCELLED`. `CANCELLED` may not transition to any state. `CLOSED` remains reachable only from `BRANCH_CLEANUP`.

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
12. **Post-merge audit is required for all merges.** No merge may close without a post-merge audit recording all 17 mandatory fields grouped into seven evidence categories, followed by Gate 11 cleanup verification. See `POST_MERGE_QUEUE.md` for high-risk categories (which require additional scrutiny, not triggering).

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
