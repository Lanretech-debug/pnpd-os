# Layer 4 — Codex Post-Merge Audit: Mandatory Gate 10 Verification

Codex post-merge audit is a mandatory retrospective safety and drift check after every merge. It satisfies Gate 10 (Post-Merge Verification). No merge may close without Gate 10 recording all 21 mandatory fields grouped into seven evidence categories. Gate 10 records cleanup eligibility with `lane_closure_ready: false`; it does not perform normal branch deletion or close the lane. Cleanup and closure are handled by Gate 11. The lane remains open until Gate 11 verifies cleanup and passes.

## High-Risk Categories (Additional Scrutiny)

| Category | Examples |
|----------|----------|
| auth | Authentication, session, login, token handling |
| domain_data | User data, PII, records, profile data |
| production | Production database, config, environment changes |
| ai_safety | AI/ML model changes, prompt changes, content filtering |
| rules_security | Security rules, IAM changes, access control |
| large_integration_pr | PR touching 10+ files across multiple domains |
| owner_override_accepted | Owner accepted caveats or overrode audit gate |

## Post-Merge Audit Checklist

Every post-merge audit SHALL confirm and record these 21 mandatory fields grouped into seven evidence categories:

| Category | Mandatory fields | Gate 10 meaning |
|----------|------------------|-----------------|
| PR identity | `pr_number`, `pr_url`, `pr_merged_state` | Identifies the merged PR and authoritative state. |
| Merge identity | `merge_commit_sha`, `canonical_main_sha`, `merged_scope` | Binds the audit to the canonical merged state and approved scope. |
| CI evidence | `ci_status` | Records exact-state CI evidence. |
| Runtime evidence | `runtime_status`, `runtime_reason`, `runtime_surface`, `runtime_evidence_or_substitute_evidence`, `runtime_verified_by`, `runtime_verified_at` | Records full canonical runtime evidence or substitute evidence. |
| Cleanup evidence | `branch_cleanup_status`, `cleanup_eligibility`, `cleanup_required_actions`, `cleanup_evidence_reference` | Records pending or observed cleanup state; Gate 11 performs or verifies it. |
| Closure evidence | `lane_closure_ready`, `blocking_findings` | `lane_closure_ready` remains `false` at Gate 10. |
| Verification attribution | `verified_by`, `verified_at` | Identifies the verifier and UTC time. |

A post-merge audit that omits any of the 21 fields is incomplete. Gate 11 must verify one valid cleanup outcome before setting `lane_closure_ready: true`; `already_absent` and `not_applicable_with_reason` still require Gate 11 verification. Only Gate 11 permits `BRANCH_CLEANUP` to transition to `CLOSED`.

## Audit Completion And Lifecycle Routing

`POST_MERGE_VERIFIED` means the mandatory post-merge audit completed and its
findings were recorded. It does not mean zero findings, a clean merged state,
completed cleanup, successful closure, or `lane_closure_ready: true`.

- When `blocking_findings` is empty, `next_state` is `BRANCH_CLEANUP`.
  Non-blocking findings may proceed; zero findings are not required.
- When `blocking_findings` is non-empty, `next_state` is `BLOCKED`, remediation
  is required, Gate 11 is forbidden, and a fresh post-merge verification must
  run after remediation.

Gate 10 always keeps `lane_closure_ready: false`, and Gate 11 remains mandatory.
An audit finding does not require a separate lifecycle state;
`POST_MERGE_ISSUES_FOUND` is not a valid Task Ledger state.

## Can Do:
- Verify main after merge
- Confirm merged code matches the audited PR
- Detect post-merge drift, dependency drift, branch contamination, or broken governance
- Record all 21 mandatory post-merge fields
- Recommend rollback, hotfix, or follow-up audit
- Confirm or recommend branch cleanup

## Cannot Do:
- Silently roll back code
- Override the owner
- Erase pre-merge findings
- Skip any of the 21 mandatory fields
- Close a lane without confirming branch cleanup

## Escalation:
- Post-merge drift → report to Hermes and owner
- Blocking drift → `BLOCKED`, remediation, and fresh post-merge verification
- Non-blocking drift → follow-up issue or PR; may proceed to Gate 11
