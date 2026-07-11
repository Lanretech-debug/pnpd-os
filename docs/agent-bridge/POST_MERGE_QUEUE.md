# Post-Merge Queue — PNPD AgentBridge

> Defines post-merge audit policy, high-risk categories requiring additional scrutiny, and post-merge audit templates.
> Post-merge audit is Codex's formal review of a PR after it has been merged into the target branch.

---

## When Post-Merge Audit Is Required

Post-merge audit is **required for all merges**. No merge may close without Gate 10 recording all 17 mandatory fields grouped into seven evidence categories and Gate 11 verifying cleanup.

The seven categories and 17 fields are: PR identity (`pr_number`, `pr_url`, `pr_merged_state`); merge identity (`merge_commit_sha`, `canonical_main_sha`, `merged_scope`); CI evidence (`ci_status`); runtime evidence (`runtime_status`, `runtime_evidence_reference`); cleanup evidence (`branch_cleanup_status`, `cleanup_eligibility`, `cleanup_required_actions`, `cleanup_evidence_reference`); closure evidence (`lane_closure_ready`, `blocking_findings`); and verification attribution (`verified_by`, `verified_at`).

High-risk categories (see below) trigger **additional scrutiny** within the post-merge audit — not the audit itself, which is mandatory regardless.

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
pr_number: "PR-EXAMPLE"
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
pr_number: "PR-001"
pr_url: "https://github.com/org/repo/pull/1"
pr_merged_state: "MERGED"
merge_commit_sha: "abc123def456"
canonical_main_sha: "abc123def456"
merged_scope: "matches_approved_scope"
ci_status: "all_passed"
runtime_status: "Runtime Verified"
runtime_evidence_reference: "audits/runtime-TASK-001.md"
branch_cleanup_status: "pending"
cleanup_eligibility: "eligible"
cleanup_required_actions:
  - "Verify one valid cleanup outcome at Gate 11"
cleanup_evidence_reference: "pending_gate_11"
lane_closure_ready: false
blocking_findings: []
verified_by: "codex"
verified_at: "2026-06-10T12:45:00Z"
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
next_action: "Post-merge verification passed. Branch cleanup is now required. Lane remains open until cleanup evidence recorded."
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
pr_number: "PR-002"
pr_url: "https://github.com/org/repo/pull/2"
pr_merged_state: "MERGED"
merge_commit_sha: "def456ghi789"
canonical_main_sha: "def456ghi789"
merged_scope: "minor_drift_found"
ci_status: "all_passed"
runtime_status: "Runtime Verified"
runtime_evidence_reference: "audits/runtime-TASK-002.md"
branch_cleanup_status: "pending"
cleanup_eligibility: "blocked"
cleanup_required_actions:
  - "Owner decides disposition of the config drift"
cleanup_evidence_reference: "pending_gate_11"
lane_closure_ready: false
blocking_findings:
  - "Minor config.py drift requires Owner disposition"
verified_by: "codex"
verified_at: "2026-06-10T13:00:00Z"
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
POST_MERGE_AUDIT_REQUESTED — Gate 10 begins (mandatory — all merges)
  ↓
POST_MERGE_VERIFIED — Gate 10 complete; records cleanup eligibility (lane_closure_ready=false)
  ↓
BRANCH_CLEANUP — Gate 11 performs/verifies cleanup; sets lane_closure_ready=true
  ↓
CLOSED — terminal state, successful completion only
```

---

## Core Rules

1. Post-merge audit is **mandatory** for all merges. It is never optional.
2. Post-merge audit reviews the **merged state in the target branch** — not just the PR diff. This catches merge-resolution errors and cross-PR drift.
3. If post-merge audit finds issues, Codex MUST recommend one of: rollback, follow-up patch PR, or accept with caveats.
4. Post-merge audit results go to the **Owner** for decision — never auto-actioned.
5. Gate 10 records all 17 mandatory fields, keeps `lane_closure_ready: false`, may record cleanup as pending, performs no normal branch deletion, and never closes the lane.
6. Gate 11 performs or verifies exactly one cleanup outcome (`completed`, `already_absent`, or `not_applicable_with_reason`). Even already-absent and not-applicable outcomes require Gate 11 verification. Only Gate 11 may set `lane_closure_ready: true` and permit `BRANCH_CLEANUP` to transition to `CLOSED`.

---

*See AUDIT_QUEUE.md for pre-merge audit format and Codex status values.*
*See TASK_LEDGER.md for POST_MERGE_AUDIT_REQUESTED and POST_MERGE_VERIFIED states.*
