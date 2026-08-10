# Decision Log — PNPD AgentBridge

> Records every owner decision. The Decision Log is the authoritative record of owner intent.
> No agent may override a recorded owner decision.

---

## Owner Decision Format

```yaml
schema: owner_decision
decision_id: "DEC-001"
task_id: "TASK-001"
owner: "owner"
decision_type: "request_patch"
rationale: "Full rationale explaining why this decision was made."
accepted_risks:
  - "Risk 1: description and mitigation (if any)"
rejected_recommendations:
  - "Codex caveat CV-001: reason for rejecting"
overridden_gates:
  - "gate_name: reason for override"
merge_authorized: false
next_action: "DeepSeek apply the requested patch and return through verification"
timestamp: "2026-06-10T12:30:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

---

## Decision Types

These are decision types (values of `decision_type`), not Task Ledger lifecycle states. A single owner decision may reference but does not replace lifecycle state.

| Type                 | Meaning                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `owner_merge_authorization` | Approve one exact PR head for merge into the target branch    |
| `owner_cancellation` | Unsuccessfully terminate an unmerged lane with retained findings     |
| `reject_merge`       | Reject the PR; task may close or return for rework                   |
| `request_patch`      | Request specific changes before re-review                            |
| `accept_caveat`      | Accept a Codex caveat and proceed with merge                         |
| `override_audit_gate`| Override a failed or skipped audit gate with recorded rationale      |
| `defer`              | Defer decision to a later time                                       |
| `rollback`           | Rollback a merged PR                                                 |

---

## Required Rationale

Every owner decision MUST include a `rationale` field that explains:

1. **What** decision was made.
2. **Why** this decision (evidence, trade-offs, context).
3. **What risks** are accepted and why they are acceptable.
4. **What recommendations** (if any) are rejected and why.
5. **What gates** (if any) are overridden and why.

No owner decision is valid without rationale.

---

## Accepted Risks

When the owner accepts risks (e.g., from Codex caveats), each accepted risk must be listed with:

- Risk description.
- Why the risk is acceptable.
- Mitigation (if any) that reduces the risk.

---

## Rejected Recommendations

When the owner rejects a recommendation (from Codex, Hermes, or any advisory agent), each rejection must include:

- The recommendation being rejected.
- Reason for rejection.

---

## Override Audit Gate

When the owner overrides a failed or skipped gate, the override must include:

- Which gate was overridden.
- Why the gate result is being set aside.
- What compensating control (if any) replaces it.

---

## Merge Authorization

`owner_merge_authorization` is the decision type. `OWNER_MERGE_APPROVED` is the lifecycle state entered by that decision. Every active `OWNER_MERGE_APPROVED` lifecycle record MUST include this complete contract:

```yaml
decision_type: "owner_merge_authorization"
owner_merge_approved: true
owner_decision_reference: "DEC-002"
pr_number: "PR-001"
pr_url: "https://github.com/org/repo/pull/1"
base_branch: "main"
base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
head_branch: "feat/example"
head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-002"
codex_verdict: "CODEX_AUDIT_COMPLETED"
required_checks_status: "all_passed"
approved_merge_method: "squash"  # squash | merge | rebase
approved_by: "owner"
approved_at: "2026-06-10T12:45:00Z"
```

Omission of any field means merge is not authorized.

A merge authorization MUST include a real `pr_number`; `N/A` is never valid. The current audit and required checks must apply to the exact `head_sha`. Any material head change invalidates both the audit and merge authorization, requiring a new audit and Owner merge decision. `approved_merge_method` records the Owner-approved strategy.

## Owner Cancellation

Only the Owner may authorize cancellation; agents may recommend it but cannot authorize it. Cancellation is unsuccessful termination, not `PASS` or `CLOSED`, and cannot occur after `MERGED`. It does not erase unresolved findings or required safety cleanup. `CANCELLED` is terminal. Any accepted caveats or owner-override decisions that triggered the `owner_override_accepted` high-risk category (defined in `POST_MERGE_QUEUE.md`) remain recorded and are not nullified by cancellation.

```yaml
decision_type: "owner_cancellation"
owner_cancelled: true
owner_decision_reference: "DEC-006"
cancellation_reason: "Owner ended the lane before merge because its scope is no longer required."
last_valid_state: "PR_OPENED"
unresolved_findings:
  - "LOW: follow-up documentation clarification remains unresolved"
pr_number_if_any: "PR-001"
pr_state_if_any: "OPEN"
branch_name_if_any: "feat/example"
branch_state: "retained_pending_safety_cleanup"
repository_state: "clean_worktree; main unchanged"
required_safety_cleanup:
  - "Close the unmerged PR only with separate Owner authority"
  - "Retain the branch until evidence is archived"
cancelled_by: "owner"
cancelled_at: "2026-06-10T15:30:00Z"
next_state: "CANCELLED"
```

---

## Core Rule

> **Owner override does not turn failed or skipped gates into passed gates.**

An overridden gate is recorded as *overridden*, not as *passed*. The gate result remains as-is in the audit record. The override is a separate decision that allows the task to proceed despite the gate result. This preserves audit integrity.

---

## Example Decisions

### Example 1a: Owner PR Authorization

```yaml
schema: owner_pr_authorization
decision_id: "DEC-001"
task_id: "TASK-001"
owner: "owner"
decision_type: "owner_pr_authorization"
owner_pr_authorized: true
pr_creation_only: true
authorized_branch: "feat/example-feature"
authorized_base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
authorized_head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-002"
owner_decision_reference: "DEC-001"
authorized_at: "2026-06-10T12:30:00Z"
rationale: "Codex audit passed with no caveats. Hermes verification clean. PR scope matches approved task. PR may be opened."
accepted_risks: []
rejected_recommendations: []
next_state: "PR_OPENED"
next_action: "DeepSeek open PR against main"
timestamp: "2026-06-10T12:30:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

### Example 1b: Owner Merge Authorization

```yaml
schema: owner_merge_authorization
decision_id: "DEC-002"
task_id: "TASK-001"
owner: "owner"
decision_type: "owner_merge_authorization"
owner_merge_approved: true
pr_number: "PR-001"
pr_url: "https://github.com/org/repo/pull/1"
base_branch: "main"
base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
head_branch: "feat/example-feature"
head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-002"
codex_verdict: "CODEX_AUDIT_COMPLETED"
required_checks_status: "all_passed"
approved_merge_method: "squash"
approved_by: "owner"
owner_decision_reference: "DEC-002"
approved_at: "2026-06-10T12:45:00Z"
rationale: "All checks passed. Codex audit completed. PR scope matches approved task. Proceeding with merge."
accepted_risks: []
rejected_recommendations: []
next_state: "MERGED"
next_action: "DeepSeek merge PR into main; Codex queue mandatory post-merge audit"
timestamp: "2026-06-10T12:45:00Z"
evidence_refs:
  - "audits/decision-DEC-002.md"
```

### Example 2: Owner PR Authorization with Caveat Acceptance

```yaml
schema: owner_pr_authorization
decision_id: "DEC-003"
task_id: "TASK-002"
owner: "owner"
decision_type: "owner_pr_authorization"
owner_pr_authorized: true
pr_creation_only: true
authorized_branch: "feat/another-feature"
authorized_base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
authorized_head_sha: "ghi789jkl012"
codex_audit_reference: "ARES-001"
codex_verdict: "CODEX_AUDIT_COMPLETED"
owner_decision_reference: "DEC-003"
authorized_at: "2026-06-10T13:00:00Z"
rationale: "Codex caveat CV-001 flags missing test for edge case X. Edge case X is low-frequency and covered by integration tests in CI. Authorizing PR creation. Merge authorization will be decided after PR checks."
accepted_risks:
  - "CV-001: Missing unit test for edge case X — low risk, integration coverage exists, follow-up task created"
accepted_by_owner: true
caveat_acceptance_reference: "DEC-003"
caveats_accepted_at: "2026-06-10T13:00:00Z"
rejected_recommendations: []
next_state: "PR_OPENED"
next_action: "DeepSeek open PR; add follow-up TASK-007 for missing test"
timestamp: "2026-06-10T13:00:00Z"
evidence_refs:
  - "audits/decision-DEC-003.md"
  - "audits/ARES-001-caveat-acceptance.md"
```

### Example 3: Override Audit Gate (Merge Authorization)

```yaml
schema: owner_merge_authorization
decision_id: "DEC-004"
task_id: "TASK-003"
owner: "owner"
decision_type: "owner_merge_authorization"
owner_merge_approved: true
pr_number: "PR-001"
pr_url: "https://github.com/org/repo/pull/1"
base_branch: "main"
base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
head_branch: "example-governance-branch"
head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-003"
codex_verdict: "CODEX_BLOCKED"
required_checks_status: "all_passed"
approved_merge_method: "merge"
approved_by: "owner"
owner_decision_reference: "DEC-004"
approved_at: "2026-06-10T14:00:00Z"
rationale: "Codex formal audit blocked due to Codex credit exhaustion (BLK-004). This is a docs-only PR with zero runtime impact. Overriding audit gate. Post-merge audit will be requested after credits are restored."
accepted_risks:
  - "No formal Codex pre-merge audit — mitigated by: docs-only scope, zero runtime impact, post-merge audit queued"
rejected_recommendations: []
next_state: "MERGED"
next_action: "DeepSeek merge governance docs PR; queue post-merge audit"
timestamp: "2026-06-10T14:00:00Z"
evidence_refs:
  - "audits/decision-DEC-004.md"
```

### Example 4: Reject Merge

```yaml
schema: owner_decision
decision_id: "DEC-005"
task_id: "TASK-004"
owner: "owner"
decision_type: "reject_merge"
rationale: "Codex audit found CRITICAL issue: production credential in diff. Codex status: CODEX_BLOCKED. Merge rejected. Task must be reworked to remove credential and rotate exposed secret."
accepted_risks: []
rejected_recommendations: []
overridden_gates: []
merge_authorized: false
next_action: "DeepSeek remove credential, rotate secret, re-self-review, resubmit to Hermes"
timestamp: "2026-06-10T15:00:00Z"
evidence_refs:
  - "audits/decision-DEC-005.md"
```

---

*The Decision Log is append-only. Decisions are never deleted — only superseded by new decisions with cross-references.*
