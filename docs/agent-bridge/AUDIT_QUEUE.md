# Audit Queue — PNPD AgentBridge

> Defines how audit requests are queued, formatted, and resolved through PNPD AgentBridge.
> All audits are performed by Codex. No other agent may perform formal audit.

---

## Audit Queue Overview

The audit queue tracks every formal audit request — both pre-merge and post-merge. Each request has a status, assigned auditor (always Codex), and merge recommendation.

---

## Pre-Merge Audit Request Format

```yaml
schema: audit_request
audit_request_id: "AR-001"
audit_type: "pre_merge"
task_id: "TASK-001"
requested_by: "hermes"
assigned_to: "codex"
status: "PENDING_CODEX_FINAL_AUDIT"
pr_id: "PR-EXAMPLE"
branch: "feat/example-feature"
target_branch: "main"
risk_level: "MEDIUM"
files_changed: 12
scope_summary: "Add example auth session support"
evidence:
  - hermes_verification: "audits/hermes-verify-TASK-001.md"
  - deepseek_self_review: "audits/self-review-TASK-001.md"
  - full_diff: "audits/example-diff.txt"
next_action: "Codex perform full pre-merge audit"
timestamp: "2026-06-10T12:00:00Z"
```

---

## Post-Merge Audit Request Format

```yaml
schema: audit_request
audit_request_id: "AR-002"
audit_type: "post_merge"
task_id: "TASK-002"
requested_by: "owner"
assigned_to: "codex"
status: "PENDING_CODEX_FINAL_AUDIT"
merge_commit: "abc123def456"
risk_level: "HIGH"
risk_categories:
  - "auth"
  - "domain_data"
reason_for_post_merge: "Owner override accepted; must verify merged state"
owner_decision_ref: "DEC-005"
evidence:
  - owner_decision: "audits/decision-DEC-005.md"
  - merge_diff: "commit abc123def456"
next_action: "Codex perform post-merge audit"
timestamp: "2026-06-10T12:30:00Z"
```

---

## Codex Audit Status Values

| Status                        | Meaning                                              |
| ----------------------------- | ---------------------------------------------------- |
| `PENDING_CODEX_FINAL_AUDIT`   | Audit requested but not yet started                  |
| `CODEX_AUDIT_COMPLETED`              | Audit passed with no caveats                         |
| `CODEX_REQUEST_CHANGES`              | Audit found issues; changes requested                |
| `CODEX_BLOCKED`                      | Audit cannot proceed due to blocker                  |
| `CODEX_AUDIT_COMPLETED_WITH_CAVEATS` | Audit passed but owner must accept listed caveats    |

---

## Merge Recommendation Values

Codex MUST provide exactly one merge recommendation per audit:

| Recommendation                      | Meaning                                                     |
| ----------------------------------- | ----------------------------------------------------------- |
| `MERGE_OK`                          | PR is safe to merge as-is                                   |
| `MERGE_OK_OWNER_ACCEPTS_CAVEATS`    | PR is safe to merge if owner accepts listed caveats         |
| `DO_NOT_MERGE_REQUEST_CHANGES`      | PR must not merge until listed changes are implemented      |
| `DO_NOT_MERGE_BLOCKED`              | PR is blocked; cannot merge while blocker exists            |

---

## Audit Queue Lifecycle

```
PENDING_CODEX_FINAL_AUDIT
  ↓
  ├── CODEX_AUDIT_COMPLETED           → MERGE_OK or MERGE_OK_OWNER_ACCEPTS_CAVEATS
  ├── CODEX_AUDIT_COMPLETED_WITH_CAVEATS → MERGE_OK_OWNER_ACCEPTS_CAVEATS
  ├── CODEX_REQUEST_CHANGES    → DO_NOT_MERGE_REQUEST_CHANGES
  └── CODEX_BLOCKED            → DO_NOT_MERGE_BLOCKED
```

---

## Audit Result Template

```yaml
schema: audit_result
audit_result_id: "ARES-001"
audit_request_id: "AR-001"
task_id: "TASK-001"
auditor: "codex"
codex_status: "CODEX_AUDIT_COMPLETED_WITH_CAVEATS"
merge_recommendation: "MERGE_OK_OWNER_ACCEPTS_CAVEATS"
caveats:
  - caveat_id: "CV-001"
    description: "Test coverage for edge case X is missing"
    severity: "LOW"
    owner_must_accept: true
change_requests: []
findings:
  - finding: "PR scope matches approved task scope"
    severity: "PASS"
  - finding: "No secrets detected in diff"
    severity: "PASS"
full_pr_audited: true
commits_audited: 3
owner_decision_needed: true
next_action: "Owner review caveat CV-001 and decide merge"
timestamp: "2026-06-10T12:15:00Z"
evidence_refs:
  - "audits/codex-audit-TASK-001.md"
```

---

## Core Rule

> **Codex audit cannot be replaced by DeepSeek self-review or Hermes verification.**

DeepSeek self-review is operational self-check. Hermes verification is operational state check. Neither is a formal audit. Only Codex performs formal audits. The owner may override the audit gate only with explicit recorded rationale.

---

*See HANDOFF_PROTOCOL.md for Hermes → Codex and Codex → Owner routing.*
*See POST_MERGE_QUEUE.md for post-merge audit requirements.*
