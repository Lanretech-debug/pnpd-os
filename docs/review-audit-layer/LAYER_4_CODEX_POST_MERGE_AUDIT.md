# Layer 4 — Codex Post-Merge Audit: Retrospective Drift Check

Codex post-merge audit is a retrospective safety and drift check after merge.

Required for high-risk merges, optional for low-risk docs-only merges.

## High-Risk Categories (Trigger Post-Merge Audit)

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
| 6 | Branch Cleanup | Whether the working branch has been deleted (remote and local). |
| 7 | Lane Closure | Whether the lane is ready to close or follow-up work is required. |

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
