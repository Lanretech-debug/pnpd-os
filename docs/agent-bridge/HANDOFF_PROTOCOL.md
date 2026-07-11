# Handoff Protocol — PNPD AgentBridge

> Defines how agents hand off work through PNPD AgentBridge.
> Every handoff is a committed file. Every handoff ends with one next action.

---

## Purpose of Handoff

A handoff transfers task state, evidence, and routing from one agent to the next. It ensures every agent reads the same structured state from the repo — no copy-paste, no lost context, no stale chat memory.

---

## When Each Agent Writes a Handoff

| Agent    | Writes Handoff When…                                                    |
| -------- | ----------------------------------------------------------------------- |
| DeepSeek | Implementation complete + self-review done; or blocked and needs routing |
| Hermes   | Verification complete (pass, fail, or blocked); routes to next agent    |
| Codex    | Audit complete; routes result to Owner or back to DeepSeek              |
| Owner    | Decision recorded; routes to DeepSeek (patches) or closes task          |

---

## Required Handoff Paths

### DeepSeek → Hermes

**Trigger:** Implementation done. Self-review complete.

```yaml
handoff:
  from: deepseek
  to: hermes
  task_id: "TASK-001"
  status: IMPLEMENTED | SELF_REVIEWED
  evidence:
    - self_review_log: "path/to/self-review.md"
    - diff_summary: "path/to/diff-summary.txt"
  blockers: []
  next_action: "Hermes verify branch, dirty tree, evidence completeness"
```

### Hermes → DeepSeek

**Trigger:** Verification failed or change requested. Routes task back.

```yaml
handoff:
  from: hermes
  to: deepseek
  task_id: "TASK-001"
  status: REQUEST_CHANGES | BLOCKED
  evidence:
    - herm_verification: "path/to/hermes-verification.md"
    - failed_gates: ["dirty_tree", "wrong_branch"]
  blockers:
    - blocker_id: "BLK-001"
  next_action: "DeepSeek fix dirty tree, re-self-review, resubmit"
```

### Hermes → Codex

**Trigger:** Hermes verification passed. Ready for formal audit.

```yaml
handoff:
  from: hermes
  to: codex
  task_id: "TASK-001"
  status: HERMES_VERIFIED
  evidence:
    - herm_verification: "path/to/hermes-verification.md"
    - deepseek_self_review: "path/to/deepseek-self-review.md"
    - task_ledger_entry: "TASK-001"
  blockers: []
  next_action: "Codex formal pre-merge audit of full branch/proposed diff"
```

### Codex → DeepSeek

**Trigger:** Codex requested changes. Routes back for patches.

```yaml
handoff:
  from: codex
  to: deepseek
  task_id: "TASK-001"
  status: REQUEST_CHANGES
  evidence:
    - codex_audit: "path/to/codex-audit.md"
    - change_requests: ["CR-001: fix X", "CR-002: add test for Y"]
  blockers: []
  next_action: "DeepSeek implement Codex change requests, re-self-review"
```

### Codex → Owner (PR Authorization)

**Trigger:** Audit complete. Owner decides whether PR creation/continuation is authorized.

```yaml
handoff:
  from: codex
  to: owner
  task_id: "TASK-001"
  status: CODEX_AUDIT_COMPLETED
  evidence:
    - codex_audit: "path/to/codex-audit.md"
    - codex_status: "CODEX_AUDIT_COMPLETED"
    - runtime_status: "Runtime Verified | Runtime Not Verified | Runtime Not Applicable"
    - runtime_reason: "Why runtime is or is not applicable"
    - runtime_surface: "Affected surface classification"
    - runtime_evidence_or_substitute_evidence: "path/to/runtime-evidence.md"
    - runtime_verified_by: "deepseek"
    - runtime_verified_at: "2026-06-10T12:00:00Z"
    - caveats: ["Caveat 1: item", "Caveat 2: item"]
  blockers: []
  next_action: "Owner review audit result and authorize PR creation (not merge)"
```

### Codex → Owner (Merge Authorization Request)

**Trigger:** PR is open and live metadata is recorded. Owner separately decides whether that exact PR state may merge.

This request presents the exact PR state and asks the Owner for a separate
decision. It carries no merge authority, cannot set
`owner_merge_approved: true`, and cannot route merge execution.

```yaml
handoff:
  from: codex
  to: owner
  task_id: "TASK-001"
  status: PR_OPENED
  owner_merge_approved: false
  merge_authority_present: false
  may_route_merge_execution: false
  evidence:
    - codex_audit: "path/to/codex-audit.md"
    - pr_number: "PR-001"
    - pr_url: "https://github.com/org/repo/pull/1"
    - base_branch: "main"
    - base_sha: "abc123def456"
    - head_branch: "governance/example"
    - head_sha: "ghi789jkl012"
    - codex_audit_reference: "ARES-001"
    - required_checks_status: "all_passed"
    - runtime_status: "Runtime Verified | Runtime Not Verified | Runtime Not Applicable"
    - runtime_evidence_or_substitute_evidence: "path/to/runtime-evidence.md"
  blockers: []
  next_action: "Owner review current PR state and authorize merge (separate from PR authorization)"
```

### Owner / AgentBridge → Authorized Merge Executor (Owner Merge Authorization Handoff)

This is the only merge-authorization handoff that may route merge execution.
AgentBridge may carry the Owner's recorded decision, but it does not create or
approve that decision.

```yaml
handoff:
  from: "owner | agent_bridge"
  to: authorized_merge_executor
  task_id: "TASK-001"
  status: OWNER_MERGE_APPROVED
  decision_type: owner_merge_authorization
  owner_merge_approved: true
  owner_decision_reference: "DEC-004"
  pr_number: "PR-001"
  pr_url: "https://github.com/org/repo/pull/1"
  base_branch: "main"
  base_sha: "abc123def456"
  head_branch: "governance/example"
  head_sha: "ghi789jkl012"
  codex_audit_reference: "ARES-001"
  codex_verdict: PASS
  required_checks_status: all_passed
  approved_merge_method: squash
  approved_by: owner
  approved_at: "2026-06-10T14:00:00Z"
  may_route_merge_execution: true
  next_action: "Authorized merge executor verifies the exact PR state and executes only the approved merge method"
```

Rules:

- The PR must exist, and `pr_number` must not be `N/A`.
- `base_branch`, `base_sha`, `head_branch`, and `head_sha` must match the live PR exactly.
- `codex_audit_reference` and `codex_verdict` must apply to the recorded `head_sha`.
- `required_checks_status` must show the required checks passing for the recorded `head_sha`.
- A material head change invalidates this handoff and requires a fresh Codex audit and Owner decision.
- A stale or incomplete handoff cannot route merge execution.
- Only a complete handoff with `owner_merge_approved: true` may route merge execution.

| Handoff | Purpose | Owner approval present? | May route merge execution? |
| --- | --- | --- | --- |
| Merge Authorization Request | Ask Owner for decision | No | No |
| Owner Merge Authorization Handoff | Carry completed Owner approval | Yes | Yes |

### Owner → Post-Merge Audit

**Trigger:** Owner merge approval recorded and merge executed. Post-merge audit is mandatory for all merges. Risk level affects verification depth only.

```yaml
handoff:
  from: owner
  to: codex
  task_id: "TASK-001"
  status: MERGED
  post_merge_audit_required: true
  risk_level: "MEDIUM"
  evidence:
    - owner_decision: "path/to/decision-log.md"
    - merge_commit: "abc123def"
    - pr_number: "PR-001"
    - pr_url: "https://github.com/org/repo/pull/1"
    - head_sha: "ghi789jkl012"
    - codex_audit_reference: "ARES-001"
  next_action: "Codex post-merge audit of merged diff in target branch"
```

### Owner → Cancelled

**Trigger:** Before `MERGED`, the Owner decides to end the lane unsuccessfully. Agents may recommend cancellation but cannot authorize it.

```yaml
handoff:
  from: owner
  to: agent_bridge
  task_id: "TASK-001"
  status: CANCELLED
  decision_type: owner_cancellation
  owner_cancelled: true
  owner_decision_reference: "DEC-005"
  cancellation_reason: "Owner ended the lane before merge because its scope is no longer required."
  last_valid_state: PR_OPENED
  unresolved_findings:
    - "LOW: follow-up documentation clarification remains unresolved"
  pr_number_if_any: "PR-001"
  pr_state_if_any: OPEN
  branch_name_if_any: "governance/execution-gates-patch"
  branch_state: retained_pending_safety_cleanup
  repository_state: "clean_worktree; main unchanged"
  required_safety_cleanup:
    - "Close the unmerged PR only with separate Owner authority"
  cancelled_by: owner
  cancelled_at: "2026-06-10T15:30:00Z"
  next_state: CANCELLED
  next_action: "Record CANCELLED as terminal and preserve unresolved findings and safety cleanup obligations"
```

Cancellation is not `PASS` or `CLOSED`, does not erase unresolved findings, cannot occur after `MERGED`, and is terminal. It records safety cleanup obligations without authorizing those actions.

---

## Required Evidence Per Handoff

Every handoff MUST reference specific evidence file paths — never paste evidence inline.

| Evidence Type        | Example Path                          | Required By                |
| -------------------- | ------------------------------------- | -------------------------- |
| Self-review log      | `audits/self-review-TASK-001.md`      | DeepSeek → Hermes          |
| Diff summary         | `audits/diff-TASK-001.txt`            | DeepSeek → Hermes          |
| Hermes verification  | `audits/hermes-verify-TASK-001.md`    | Hermes → Codex             |
| Codex audit          | `audits/codex-audit-TASK-001.md`      | Codex → Owner (PR auth)    |
| Codex audit          | `audits/codex-audit-TASK-001.md`      | Codex → Owner (merge auth) |
| PR metadata          | `audits/pr-metadata-TASK-001.md`      | Codex → Owner (merge auth) |
| Check status         | `audits/check-status-TASK-001.md`     | Codex → Owner (merge auth) |
| Owner merge authorization | `audits/decision-TASK-001.md`    | Owner / AgentBridge → authorized executor |
| Owner decision       | `audits/decision-TASK-001.md`         | Owner → Post-Merge         |
| Post-merge audit     | `audits/post-merge-audit-TASK-001.md` | Codex → Owner              |

---

## Forbidden Handoffs

The following handoff paths are **never permitted**:

| From     | To       | Reason                                                    |
| -------- | -------- | --------------------------------------------------------- |
| DeepSeek | Codex    | Must pass Hermes verification first                       |
| DeepSeek | Owner    | Must pass Hermes + Codex before owner decision            |
| Hermes   | Owner    | Codex audit must precede owner decision                   |
| Codex    | (merge)  | Codex cannot merge; only owner authorizes merge           |
| Any agent| (deploy) | No agent may deploy without explicit owner authorization  |

---

## Every Handoff Ends With One Next Action

Rule: every handoff message MUST include exactly one `next_action` field specifying the immediate next step for the receiving agent.

Examples:

- `"Hermes verify branch, dirty tree, evidence completeness"`
- `"DeepSeek implement Codex change requests, re-self-review"`
- `"Codex formal pre-merge audit of full branch/proposed diff"`
- `"Owner review audit result and authorize PR creation (not merge)"`
- `"Owner review current PR state and authorize merge (separate from PR authorization)"`
- `"Codex post-merge audit of merged diff in target branch"`

Handoffs without a `next_action` are **invalid** and must be rejected by the receiving agent.

---

## Core Rule

> **No agent certifies its own work.**

DeepSeek self-review is not certification. Hermes verification is not Codex audit. Codex audit is not owner decision. Every gate requires a different agent.

---

*See MESSAGE_SCHEMA.md for full handoff message template.*
