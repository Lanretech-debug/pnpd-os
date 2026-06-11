# Layer 5 — Owner Final Decision

The owner is the final decision-maker. Agents may advise, verify, audit, or recommend — they may not override the owner.

## The Owner Controls:
- Merge approval
- Business and product priority
- Explicit audit override decisions
- Release timing
- Acceptance of documented caveats
- Rollback decisions

## Decision Types

| Type | Meaning |
|------|---------|
| approve_merge | Approve the PR for merge |
| reject_merge | Reject the PR |
| request_patch | Request specific changes before re-review |
| accept_caveat | Accept a Codex caveat and proceed |
| override_audit_gate | Override a failed/skipped gate with rationale |
| defer | Defer decision |
| rollback | Rollback a merged PR |

## Required Rationale

Every owner decision MUST include:
1. **What** decision was made
2. **Why** this decision (evidence, trade-offs, context)
3. **What risks** are accepted and why
4. **What recommendations** are rejected and why
5. **What gates** are overridden and why

## Owner Override Rule

- The owner may override a pending gate only by explicitly recording the rationale
- Owner override must not hide unresolved risks
- Owner override does not convert failed or skipped checks into passed checks
- Owner override should be rare for product/runtime changes and avoided for secrets, safety, auth, or data access risks
