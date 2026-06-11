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
SELF_REVIEWED
  ↓
HERMES_VERIFIED
  ↓
CODEX_AUDIT_REQUESTED
  ↓
CODEX_APPROVED
  ↓
OWNER_APPROVED
  ↓
MERGED
  ↓
POST_MERGE_AUDIT_REQUESTED
  ↓
POST_MERGE_VERIFIED
  ↓
CLOSED

(any state) → BLOCKED
(any pre-merge state) → REQUEST_CHANGES
```

---

## State Definitions

### PROPOSED

- **Meaning:** Task has been proposed but not yet routed to an agent.
- **Who can enter:** Owner or any agent proposing a new task.
- **Required evidence:** Task proposal with scope, allowed_files, forbidden_files.
- **Allowed next states:** `ROUTED`, `CLOSED`.
- **Forbidden next states:** `IN_PROGRESS`, `IMPLEMENTED`, `MERGED`.

### ROUTED

- **Meaning:** Task assigned to DeepSeek. Implementation may begin.
- **Who can enter:** Owner or Hermes (routing).
- **Required evidence:** Routing decision recorded; scope confirmed.
- **Allowed next states:** `IN_PROGRESS`, `BLOCKED`, `CLOSED`.
- **Forbidden next states:** `IMPLEMENTED`, `MERGED`.

### IN_PROGRESS

- **Meaning:** DeepSeek is actively implementing.
- **Who can enter:** DeepSeek (after receiving routed task).
- **Required evidence:** Worktree confirmed clean; correct branch confirmed.
- **Allowed next states:** `IMPLEMENTED`, `BLOCKED`, `REQUEST_CHANGES`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_APPROVED`, `MERGED`.

### IMPLEMENTED

- **Meaning:** Code changes complete. Self-review pending.
- **Who can enter:** DeepSeek.
- **Required evidence:** All commits staged; diff summary available.
- **Allowed next states:** `SELF_REVIEWED`, `BLOCKED`.
- **Forbidden next states:** `HERMES_VERIFIED`, `CODEX_APPROVED`, `MERGED`.

### SELF_REVIEWED

- **Meaning:** DeepSeek has completed self-review. Ready for Hermes verification.
- **Who can enter:** DeepSeek.
- **Required evidence:** Self-review log with all gates checked; diff summary; handoff to Hermes written.
- **Allowed next states:** `HERMES_VERIFIED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `CODEX_APPROVED`, `OWNER_APPROVED`, `MERGED`.
- **Anti-drift:** DeepSeek self-review is NOT formal audit. Cannot skip to Codex.

### HERMES_VERIFIED

- **Meaning:** Hermes has verified worktree, branch, evidence, and anti-drift controls.
- **Who can enter:** Hermes.
- **Required evidence:** Hermes verification log; all anti-drift controls checked; clean worktree confirmed.
- **Allowed next states:** `CODEX_AUDIT_REQUESTED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `OWNER_APPROVED`, `MERGED`.
- **Anti-drift:** Hermes verification is NOT Codex audit. Cannot skip to owner decision.

### CODEX_AUDIT_REQUESTED

- **Meaning:** Codex has been requested to perform formal audit.
- **Who can enter:** Hermes (routing to Codex).
- **Required evidence:** Full PR diff; Hermes verification result; DeepSeek self-review.
- **Allowed next states:** `CODEX_APPROVED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `OWNER_APPROVED`, `MERGED`.

### CODEX_APPROVED

- **Meaning:** Codex has completed audit. Result may include caveats.
- **Who can enter:** Codex.
- **Required evidence:** Codex audit report; merge recommendation; caveats list (if any).
- **Allowed next states:** `OWNER_APPROVED`, `REQUEST_CHANGES`, `BLOCKED`.
- **Forbidden next states:** `MERGED` (merge requires owner, not Codex).

### OWNER_APPROVED

- **Meaning:** Owner has reviewed and approved the merge.
- **Who can enter:** Owner.
- **Required evidence:** Owner decision record with rationale; merge authorization.
- **Allowed next states:** `MERGED`, `BLOCKED`.
- **Forbidden next states:** Reversion to any pre-approval state without new REQUEST_CHANGES.

### MERGED

- **Meaning:** PR has been merged into target branch.
- **Who can enter:** Owner (authorizes merge); DeepSeek or GitHub executes.
- **Required evidence:** Merge commit hash; merge timestamp.
- **Allowed next states:** `POST_MERGE_AUDIT_REQUESTED`, `CLOSED`.
- **Forbidden next states:** Reversion to pre-merge states.

### POST_MERGE_AUDIT_REQUESTED

- **Meaning:** Post-merge audit required (high-risk PR).
- **Who can enter:** Owner (requests); auto-triggered for high-risk categories.
- **Required evidence:** Merge commit; risk category; owner decision reference.
- **Allowed next states:** `POST_MERGE_VERIFIED`, `BLOCKED`.
- **Forbidden next states:** `CLOSED` (must complete post-merge audit first).

### POST_MERGE_VERIFIED

- **Meaning:** Codex post-merge audit complete. No issues or follow-ups recorded.
- **Who can enter:** Codex.
- **Required evidence:** Post-merge audit report; rollback recommendation (if any).
- **Allowed next states:** `CLOSED`.
- **Forbidden next states:** `MERGED` (already merged).

### BLOCKED

- **Meaning:** Task cannot proceed due to a blocker.
- **Who can enter:** Any agent.
- **Required evidence:** Blocker record in BLOCKER_LOG.md; blocker ID.
- **Allowed next states:** Return to previous state when blocker resolved; or `CLOSED`.
- **Forbidden next states:** Any advancement while blocker is unresolved.

### REQUEST_CHANGES

- **Meaning:** Changes requested by Hermes, Codex, or Owner.
- **Who can enter:** Hermes, Codex, or Owner.
- **Required evidence:** Specific change requests listed; handoff back to DeepSeek.
- **Allowed next states:** `IN_PROGRESS` (DeepSeek implements changes); `CLOSED`.
- **Forbidden next states:** Advancement without addressing change requests.

### CLOSED

- **Meaning:** Task complete and all gates satisfied. No further action.
- **Who can enter:** Owner.
- **Required evidence:** All required gates passed; merge complete (if applicable); post-merge audit complete (if required).
- **Allowed next states:** None (terminal state).
- **Forbidden next states:** Reopening requires new task proposal.

---

## State Transition Rules

1. States advance forward only through explicit agent action with recorded evidence.
2. `BLOCKED` can be entered from any state and returns to the previous state upon resolution.
3. `REQUEST_CHANGES` can be entered from `SELF_REVIEWED`, `HERMES_VERIFIED`, `CODEX_AUDIT_REQUESTED`, or `CODEX_APPROVED`.
4. No state may be skipped in the forward path.
5. `CLOSED` is terminal. A closed task cannot be reopened — a new task must be proposed.

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
7. **Large PRs must be audited as large PRs, not latest commits only.** Codex must audit the full PR diff, not just the most recent commit. Squash-merging does not reduce audit scope.

### Branch Integrity

8. **Product and governance branches must not mix.** Product code changes must not live on governance branches. Governance docs must not live on product branches. Violation blocks advancement.

### Security

9. **Secrets must never be written to handoff files.** Any detection of secrets, tokens, keys, or `.env` contents in bridge files blocks advancement immediately.
10. **Handoffs must reference evidence paths, not paste secrets.** Evidence must be file references, never inline content that could contain sensitive data.

### Merge Gate

11. **Merge requires Codex audit or explicit owner override rationale.** No merge without Codex audit result OR a recorded owner override with rationale.
12. **Post-merge audit is required for high-risk merges.** See `POST_MERGE_QUEUE.md` for high-risk categories.

### Handoff Integrity

13. **Every handoff must end with one next action.** See `HANDOFF_PROTOCOL.md`.

### Certification

14. **No agent certifies its own work.** This is the foundational anti-drift rule. See `DESIGN_PLAN.md`.

---

## Task Ledger Entry Template

See `MESSAGE_SCHEMA.md` — Schema 2: Task Ledger Entry.

---

*Violation of any anti-drift control must result in BLOCKED state with a blocker record in BLOCKER_LOG.md.*
