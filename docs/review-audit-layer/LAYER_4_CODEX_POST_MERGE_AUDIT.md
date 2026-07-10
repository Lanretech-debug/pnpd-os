# Layer 4 — Codex Post-Merge Audit: Mandatory Gate 10 Verification

Codex post-merge audit is a mandatory retrospective safety and drift check after every merge. It satisfies Gate 10 (Post-Merge Verification). No merge may close without a post-merge audit confirming the seven required fields. Gate 10 records cleanup eligibility and lane closure readiness — it does not perform cleanup or close the lane. Cleanup and closure are handled by Gate 11. The lane remains open until Gate 11 passes.

## High-Risk Categories (Additional Scrutiny)

| Category | Examples |
|----------|----------|
| auth | Authentication, session, login, token handling |
| data | User data, PII, records, profile data |
| production | Production database, config, environment changes |
| ai_safety | AI/ML model changes, prompt changes, content filtering |
| rules_security | Security rules, IAM changes, access control |
| large_integration_pr | PR touching 10+ files across multiple domains |
| owner_override_accepted | Owner accepted caveats or overrode audit gate |

## Post-Merge Audit Checklist

Every post-merge audit SHALL confirm and record the following seven fields:

| # | Field | Description |
|---|-------|-------------|
| 1 | Merged SHA | The merge commit SHA on the target branch. |
| 2 | Main SHA | The updated main branch SHA after merge. |
| 3 | Scope Check | Whether the merged changes match the approved scope. |
| 4 | CI Status | Whether CI checks passed on the merge commit. |
| 5 | Runtime Status | Whether runtime smoke evidence exists and is consistent with pre-merge evidence. |
| 6 | Branch Cleanup | Whether the working branch has been deleted (remote and local). Gate 10 records the cleanup eligibility and status — actual branch deletion is performed by Gate 11. |
| 7 | Lane Closure | Whether the lane is ready to close or follow-up work is required. At Gate 10, `lane_closure_ready` is `false`. Gate 11 sets it to `true` after cleanup evidence passes. |

A post-merge audit that omits any of the seven fields is incomplete.

## Can Do:
- Verify main after merge
- Confirm merged code matches the audited PR
- Detect post-merge drift, dependency drift, branch contamination, or broken governance
- Record all seven post-merge confirmation fields
- Recommend rollback, hotfix, or follow-up audit
- Confirm or recommend branch cleanup

## Cannot Do:
- Silently roll back code
- Override the owner
- Erase pre-merge findings
- Skip any of the seven required confirmation fields
- Close a lane without confirming branch cleanup

## Escalation:
- Post-merge drift → report to Hermes and owner
- Critical drift → stop-ship or rollback recommendation
- Non-critical drift → follow-up issue or PR
