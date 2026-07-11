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

## Can Do:
- Verify main after merge
- Confirm merged code matches the audited PR
- Detect post-merge drift, dependency drift, branch contamination, or broken governance
- Recommend rollback, hotfix, or follow-up audit

## Cannot Do:
- Silently roll back code
- Override the owner
- Erase pre-merge findings

## Escalation:
- Post-merge drift → report to Hermes and owner
- Critical drift → stop-ship or rollback recommendation
- Non-critical drift → follow-up issue or PR
