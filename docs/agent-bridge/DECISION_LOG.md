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
decision_type: "approve_merge"
rationale: "Full rationale explaining why this decision was made."
accepted_risks:
  - "Risk 1: description and mitigation (if any)"
rejected_recommendations:
  - "Codex caveat CV-001: reason for rejecting"
overridden_gates:
  - "gate_name: reason for override"
merge_authorized: true
merge_authorization:
  pr_id: "PR-EXAMPLE"
  branch: "feat/example"
  target: "main"
  base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
  head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
  timestamp: "2026-06-10T12:30:00Z"
next_action: "Specific next action following this decision"
timestamp: "2026-06-10T12:30:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

---

## Decision Types

| Type                 | Meaning                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `approve_merge`      | Approve the PR for merge into target branch                          |
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

If `merge_authorized: true`, the decision MUST include:

```yaml
merge_authorization:
  pr_id: "PR-001"
  pr_url: "https://github.com/org/repo/pull/1"
  branch: "feat/example"
  target: "main"
  base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
  head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
  codex_audit_reference: "ARES-001"
  codex_verdict: "CODEX_AUDIT_COMPLETED"
  required_checks_status: "all_passed"
  approved_merge_method: "squash"  # squash | merge | rebase
  approved_by: "owner"
  approved_at: "2026-06-10T12:45:00Z"
```

Without a merge authorization block, the merge is not authorized even if `merge_authorized: true`.

A merge authorization MUST include a real PR number (`pr_id`). `pr_id: "N/A"` is never valid for merge authorization. Merge authorization is bound to the specific PR, base SHA, head SHA, current Codex audit, and current required-check status. A material head-SHA change invalidates the authorization. The `codex_verdict` field captures the Codex audit outcome (e.g., `CODEX_AUDIT_COMPLETED`, `CODEX_AUDIT_COMPLETED_WITH_CAVEATS`). `approved_merge_method` records the merge strategy (squash, merge commit, or rebase) approved by the owner.

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
codex_audit_reference: "ARES-001"
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
codex_audit_reference: "ARES-001"
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
codex_audit_reference: "ARES-002"
owner_decision_reference: "DEC-003"
authorized_at: "2026-06-10T13:00:00Z"
rationale: "Codex caveat CV-001 flags missing test for edge case X. Edge case X is low-frequency and covered by integration tests in CI. Authorizing PR creation. Merge authorization will be decided after PR checks."
accepted_risks:
  - "CV-001: Missing unit test for edge case X — low risk, integration coverage exists, follow-up task created"
rejected_recommendations: []
next_state: "PR_OPENED"
next_action: "DeepSeek open PR; add follow-up TASK-007 for missing test"
timestamp: "2026-06-10T13:00:00Z"
evidence_refs:
  - "audits/decision-DEC-003.md"
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
codex_verdict: "CODEX_BLOCKED_EXTERNAL"
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
decision_id: "DEC-004"
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
  - "audits/decision-DEC-004.md"
```

---

*The Decision Log is append-only. Decisions are never deleted — only superseded by new decisions with cross-references.*
