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

## Mandatory Audit Rules

### Rule 1 — Runtime Evidence Required

Pre-Merge Audit SHALL reject any PR that lacks runtime evidence. Runtime evidence means screenshots, terminal output, console logs, or HTTP response codes proving that the application starts and responds as expected for the scoped changes.

### Rule 2 — Every Audit Must Declare Runtime Status

Every Codex pre-merge audit must explicitly declare exactly one of:

- `Runtime Verified` — runtime smoke evidence was reviewed and is acceptable.
- `Runtime Not Verified` — runtime smoke evidence was missing, insufficient, or not reviewed.
- `Runtime Not Applicable` — the lane has no executable runtime surface. Requires explicit reason, surface classification, substitute validation evidence, self-review confirmation, Hermes verification, and Codex acceptance.

A verdict of `Runtime Not Verified` SHALL produce `DO_NOT_MERGE_REQUEST_CHANGES`.

### Rule 3 — Runtime Not Applicable Evidence Contract

When `Runtime Not Applicable` is declared, the following evidence is required:

| Field | Description |
|-------|-------------|
| `runtime_status` | `Runtime Not Applicable` |
| `runtime_reason` | Why runtime is not applicable (e.g., governance-only docs change) |
| `runtime_surface` | Classification of affected surface (e.g., governance, templates, schemas) |
| `substitute_evidence` | Alternative validation that confirms correctness (e.g., `npm run validate`, `npm run dry-run`, `npm test`, `git diff --check`, cross-doc contradiction analysis, state-machine transition review) |
| `verified_by` | Agent or human who confirmed |
| `verified_at` | ISO 8601 timestamp |

## Can Do:
- Audit the full branch/proposed diff
- Verify scope against task intent
- Review security, auth, data, and safety boundaries
- Review tests, gates, smoke evidence, and skipped checks
- Detect governance contradictions
- Approve, request changes, or block merge readiness
- Declare `Runtime Verified`, `Runtime Not Verified`, or `Runtime Not Applicable` as part of every audit verdict

## Cannot Do:
- Approve without evidence
- Override the owner's final decision
- Merge without owner approval
- Silently waive failed gates or treat skipped checks as passed
- Certify runtime behaviour as production-safe (runtime smoke evidence confirms basic operability, not production readiness)
- Approve a PR with `Runtime Not Verified` status
- Declare `Runtime Not Applicable` without the required evidence contract
