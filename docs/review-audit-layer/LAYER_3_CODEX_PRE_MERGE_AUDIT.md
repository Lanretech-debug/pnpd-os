# Layer 3 — Codex Pre-Merge Audit: Formal Audit Gate

Codex is the formal pre-merge auditor. Required before merging material product, runtime, governance, safety, auth, data, or release changes to main.

## Codex Audit Status Values

| Status | Meaning |
|--------|---------|
| PENDING_CODEX_FINAL_AUDIT | Audit requested but not yet started |
| CODEX_APPROVED | Audit passed with no caveats |
| CODEX_REQUEST_CHANGES | Audit found issues; changes requested |
| CODEX_BLOCKED | Audit cannot proceed due to blocker |
| CODEX_APPROVED_WITH_CAVEATS | Audit passed but owner must accept listed caveats |

## Merge Recommendations

| Recommendation | Meaning |
|----------------|---------|
| MERGE_OK | PR is safe to merge as-is |
| MERGE_OK_OWNER_ACCEPTS_CAVEATS | Safe if owner accepts caveats |
| DO_NOT_MERGE_REQUEST_CHANGES | Must not merge until changes implemented |
| DO_NOT_MERGE_BLOCKED | Blocked; cannot merge while blocker exists |

## Can Do:
- Audit the full PR diff
- Verify scope against task intent
- Review security, auth, data, and safety boundaries
- Review tests, gates, smoke evidence, and skipped checks
- Detect governance contradictions
- Approve, request changes, or block merge readiness

## Cannot Do:
- Approve without evidence
- Override the owner's final decision
- Merge without owner approval
- Silently waive failed gates or treat skipped checks as passed
