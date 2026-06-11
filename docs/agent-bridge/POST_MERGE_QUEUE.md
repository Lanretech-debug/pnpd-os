# Post-Merge Queue — PNPD AgentBridge

> Defines when post-merge audit is required, high-risk categories, and post-merge audit templates.
> Post-merge audit is Codex's formal review of a PR after it has been merged into the target branch.

---

## When Post-Merge Audit Is Required

Post-merge audit is required when **any** of the following conditions are true:

1. The PR falls into one or more **high-risk categories** (see below).
2. The owner **overrode** a pre-merge audit gate (e.g., Codex credits unavailable).
3. The merge occurred with **owner override** accepting caveats that warrant post-merge verification.
4. The owner explicitly **requests** post-merge audit for any reason.

If none of these conditions are true, post-merge audit is optional but recommended for sensitive changes.

---

## High-Risk Categories

A PR is high-risk if it touches any of these categories:

| Category                | Examples                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `auth`                  | Authentication, session, login, token handling, OAuth             |
| `domain_data`           | Any domain-specific PII, user data, progress records, profile data      |
| `production_integration`| Production configuration, database changes, integration endpoints     |
| `ai_safety`             | AI/ML model changes, prompt changes, content filtering            |
| `rules_security`        | Security rules, Storage rules, IAM changes       |
| `large_integration_pr`  | PR touching 10+ files across multiple domains                     |
| `owner_override_accepted`| Owner accepted caveats or overrode audit gate                     |

---

## Post-Merge Audit Request Template

```yaml
schema: post_merge_audit_request
audit_request_id: "PMAR-001"
task_id: "TASK-001"
audit_type: "post_merge"
requested_by: "owner"
assigned_to: "codex"
pr_number: "99"
merged_branch: "feat/example-feature"
target_branch: "main"
merge_commit: "abc123def456"
risk_level: "HIGH"
risk_categories:
  - "auth"
  - "domain_data"
reason_for_post_merge_audit: "PR touches auth and domain data categories. Post-merge audit required per policy."
owner_decision_ref: "DEC-001"
status: "POST_MERGE_AUDIT_REQUESTED"
next_action: "Codex post-merge audit of merged diff in target branch"
timestamp: "2026-06-10T12:35:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

---

## Post-Merge Audit Result Template

```yaml
schema: post_merge_audit_result
audit_result_id: "PMARES-001"
audit_request_id: "PMAR-001"
task_id: "TASK-001"
auditor: "codex"
post_merge_status: "POST_MERGE_VERIFIED"
findings:
  - finding: "Merged diff matches approved PR scope"
    severity: "PASS"
  - finding: "No drift introduced in target branch"
    severity: "PASS"
  - finding: "Auth changes correctly scoped to emulator only"
    severity: "PASS"
issues_found: []
rollback_recommended: false
rollback_rationale: ""
follow_up_actions: []
next_action: "Task closed; no further action required"
timestamp: "2026-06-10T12:45:00Z"
evidence_refs:
  - "audits/post-merge-audit-TASK-001.md"
```

---

## Post-Merge Audit Result With Issues

```yaml
schema: post_merge_audit_result
audit_result_id: "PMARES-002"
audit_request_id: "PMAR-002"
task_id: "TASK-002"
auditor: "codex"
post_merge_status: "POST_MERGE_VERIFIED"
findings:
  - finding: "Merged diff generally matches approved scope"
    severity: "PASS"
  - finding: "One file drifted from approved scope: src/config.py line 42"
    severity: "MEDIUM"
issues_found:
  - issue: "Minor drift in config.py — non-critical, adds debug flag"
    severity: "LOW"
    recommendation: "File follow-up cleanup task or revert if undesired"
rollback_recommended: false
rollback_rationale: ""
follow_up_actions:
  - action: "Create TASK-010 to remove debug flag if not needed"
    assigned_to: "deepseek"
    priority: "LOW"
next_action: "Owner review finding; decide on follow-up TASK-010"
timestamp: "2026-06-10T13:00:00Z"
evidence_refs:
  - "audits/post-merge-audit-TASK-002.md"
```

---

## Rollback / Follow-Up Recommendation Format

If Codex recommends rollback or follow-up, use:

```yaml
rollback_recommended: true
rollback_rationale: "Specific reason rollback is recommended, with evidence."
follow_up_actions:
  - action: "Revert merge commit abc123def456"
    assigned_to: "owner"
    priority: "HIGH"
  - action: "Re-audit corrected PR before re-merge"
    assigned_to: "codex"
    priority: "HIGH"
```

---

## Post-Merge Queue Lifecycle

```
MERGED
  ↓
  ├── No high-risk → CLOSED (optional post-merge audit)
  └── High-risk → POST_MERGE_AUDIT_REQUESTED
                    ↓
                    POST_MERGE_VERIFIED
                    ↓
                    CLOSED
```

---

## Core Rules

1. Post-merge audit is **mandatory** for high-risk categories. It is not optional.
2. Post-merge audit reviews the **merged state in the target branch** — not just the PR diff. This catches merge-resolution errors and cross-PR drift.
3. If post-merge audit finds issues, Codex MUST recommend one of: rollback, follow-up patch PR, or accept with caveats.
4. Post-merge audit results go to the **Owner** for decision — never auto-actioned.

---

*See AUDIT_QUEUE.md for pre-merge audit format and Codex status values.*
*See TASK_LEDGER.md for POST_MERGE_AUDIT_REQUESTED and POST_MERGE_VERIFIED states.*
