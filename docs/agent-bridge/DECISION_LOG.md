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
  pr_number: "99"
  branch: "feat/example"
  target: "main"
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
  pr_number: "99"
  branch: "feat/example"
  target: "main"
  timestamp: "2026-06-10T12:30:00Z"
```

Without a merge authorization block, the merge is not authorized even if `merge_authorized: true`.

---

## Core Rule

> **Owner override does not turn failed or skipped gates into passed gates.**

An overridden gate is recorded as *overridden*, not as *passed*. The gate result remains as-is in the audit record. The override is a separate decision that allows the task to proceed despite the gate result. This preserves audit integrity.

---

## Example Decisions

### Example 1: Approve Merge

```yaml
schema: owner_decision
decision_id: "DEC-001"
task_id: "TASK-001"
owner: "owner"
decision_type: "approve_merge"
rationale: "Codex audit passed with no caveats. Hermes verification clean. PR scope matches approved task. All anti-drift controls satisfied. Proceeding with merge."
accepted_risks: []
rejected_recommendations: []
overridden_gates: []
merge_authorized: true
merge_authorization:
  pr_number: "99"
  branch: "feat/example-feature"
  target: "main"
  timestamp: "2026-06-10T12:30:00Z"
next_action: "DeepSeek merge PR into main"
timestamp: "2026-06-10T12:30:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

### Example 2: Accept Caveat

```yaml
schema: owner_decision
decision_id: "DEC-002"
task_id: "TASK-002"
owner: "owner"
decision_type: "accept_caveat"
rationale: "Codex caveat CV-001 flags missing test for edge case X. Edge case X is low-frequency and covered by integration tests in CI. Accepting caveat. Team will add unit test in follow-up sprint task TASK-007."
accepted_risks:
  - "CV-001: Missing unit test for edge case X — low risk, integration coverage exists, follow-up task created"
rejected_recommendations: []
overridden_gates: []
merge_authorized: true
merge_authorization:
  pr_number: "100"
  branch: "feat/another-feature"
  target: "main"
  timestamp: "2026-06-10T13:00:00Z"
next_action: "DeepSeek merge PR; create follow-up TASK-007 for missing test"
timestamp: "2026-06-10T13:00:00Z"
evidence_refs:
  - "audits/decision-DEC-002.md"
```

### Example 3: Override Audit Gate

```yaml
schema: owner_decision
decision_id: "DEC-003"
task_id: "TASK-003"
owner: "owner"
decision_type: "override_audit_gate"
rationale: "Codex formal audit blocked due to Codex credit exhaustion (BLK-004). This is a docs-only PR with zero runtime impact. Risk of merging without Codex audit is negligible. Overriding audit gate. Post-merge audit will be requested after credits are restored."
accepted_risks:
  - "No formal Codex pre-merge audit — mitigated by: docs-only scope, zero runtime impact, post-merge audit queued"
rejected_recommendations: []
overridden_gates:
  - "codex_audit: Codex credits exhausted; docs-only PR; post-merge audit queued"
merge_authorized: true
merge_authorization:
  pr_number: "N/A"
  branch: "docs/pnpd-agentbridge"
  target: "docs/example-protocol/"
  timestamp: "2026-06-10T14:00:00Z"
next_action: "DeepSeek merge governance docs PR; queue post-merge audit"
timestamp: "2026-06-10T14:00:00Z"
evidence_refs:
  - "audits/decision-DEC-003.md"
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
