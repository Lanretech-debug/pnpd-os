# PNPD Orchestrator Safety Gates

> Status: Phase 0 scaffold, AMBER_NOT_CODEX_AUDITED

Every Orchestrator action is gated before dispatch. In Phase 0, gates are evaluated for dry-run reporting only.

## Core Rule

The Orchestrator may coordinate and recommend; it may not approve, merge, deploy, or bypass gates.

## Gate Matrix

| Gate | Blocks When | Phase 0 Behavior |
| --- | --- | --- |
| Dirty tree gate | `git status --porcelain` is non-empty. | Classify as `NEEDS_TRIAGE`; no dispatch. |
| Secrets gate | Registry or handoff metadata appears to contain secrets. | Classify as `BLOCKED`; do not print suspect values. |
| Protected branch gate | Work would run directly on `main`, `master`, or configured protected branches. | Classify as `OWNER_REVIEW_REQUIRED`; no dispatch. |
| Production deploy gate | Task requests deploy, release, or production mutation. | Classify as `OWNER_REVIEW_REQUIRED`; no dispatch. |
| Owner approval gate | Action needs owner authority. | Escalate; do not simulate approval. |
| Codex audit gate | Formal audit is required or missing. | Escalate to `CODEX_REVIEW_REQUIRED`; do not self-certify. |
| Budget/rate-limit gate | Configured limits are exceeded or missing for external actions. | Block external action. |
| Max parallel thread gate | Dispatch would exceed configured concurrency. | Block dispatch. |
| Lockfile gate | Another task lock exists for the repo/task. | Classify as `BLOCKED`; no duplicate agent. |
| External write gate | GitHub, Git, cloud, or deployment write would occur. | Block in Phase 0; future phases require explicit owner approval and dry-run support. |

## Secrets Handling

The Orchestrator must not read `.env` files, credential stores, private keys, or auth headers. It must not print secret-like values. Phase 0 only scans the registry structure for suspicious field names or values and reports the JSON path, not the value.

Examples of blocked registry fields:

- `token`
- `apiKey`
- `secret`
- `password`
- `privateKey`
- `authorization`

## Lockfile Design

Phase 0 does not create lockfiles. Future phases may use lockfiles only after owner approval and a threat model update.

Minimum future lockfile requirements:

- repo ID
- task ID
- owning agent/thread ID
- created timestamp
- expiry timestamp
- safe stale-lock recovery path
- no secrets

## External Actions

Every external action must support dry-run. The default is no external writes.

Allowed in Phase 0:

- local registry read
- local path existence check
- local `git` read commands
- dry-run output to stdout

Not allowed in Phase 0:

- GitHub issue/PR mutation
- branch push
- merge
- deployment
- package publishing
- secret lookup
- daemon scheduling
- agent thread creation
