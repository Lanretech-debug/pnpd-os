# PNPD-OS

A local-first governance and delivery-evidence framework for AI-assisted software work.

## Status

PNPD OS is **v0.1.0, early-stage**. It is a governance and evidence framework, not a runtime product.

- **Latest stable commit:** `f7eb3c1`
- **Remote CI:** run `27508672848`, success, 16s
- **Branch:** `main`
- **Node:** `20`

It does not guarantee correctness, security, or zero drift. It does not replace human review or Owner judgment.

## What PNPD OS is

PNPD OS currently provides:

- local validation scripts
- dry-run orchestration checks
- runtime readiness reports (advisory-only)
- runtime readiness local write
- runtime readiness report file validation
- schema and fixture validation
- governance boundaries
- file/Git-based evidence trails
- role separation between Owner, Hermes, DeepSeek, Codex, and AgentBridge

## What PNPD OS is not

- Not a runtime server.
- Not a deployment tool.
- Not an autonomous agent system.
- Not a CI/CD platform.
- Not production certification.
- Not a package installer.
- Not a replacement for human review.

## Why it exists

PNPD OS was built from real multi-agent / AI-assisted development pain. It prevents governance spirals, self-certification, false progress, and mixed-scope changes. It keeps evidence, review, and owner decisions separated so that AI agents can collaborate without crossing authority boundaries.

## Who it is for

- solo builders using AI coding agents
- small teams using AI-assisted workflows
- maintainers who need disciplined phase gates
- projects where AI agents must not certify their own work
- contributors who need clear local verification

## Quick local verification

```bash
npm run validate
npm run dry-run
npm test
```

These commands validate schemas, fixtures, and dry-run output. They do not dispatch, deploy, or mutate any external system.

See [`docs/quickstart-local.md`](docs/quickstart-local.md) for prerequisites, direct Node fallback commands, and safety notes.

## Core commands

| Command | What it does | What it does not authorize |
|---------|-------------|---------------------------|
| `npm run validate` | Validates all schemas and fixtures (phases 0, 1b, 1c, 1f) | Does not authorize dispatch, merge, or deployment |
| `npm run dry-run` | Runs orchestrator dry-run in text and JSON mode | Does not execute any external action |
| `npm test` | Runs validate + dry-run | Does not authorize any gate bypass |
| `node scripts/pnpd-validate-schemas.mjs --phase 1f` | Validates dispatch readiness schema and 12 fixtures | Does not authorize dispatch |
| `node scripts/pnpd-validate-schemas.mjs --phase 1h` | Validates runtime readiness schema and 13 fixtures | Does not authorize runtime readiness report generation |
| `node scripts/pnpd-orchestrator-dry-run.mjs --runtime-readiness` | Prints runtime readiness JSON to stdout | Writes no files |
| `node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness` | Writes one runtime readiness report file under `.pnpd/runtime-readiness/` | Does not update, delete, or modify existing files |
| `node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report <path>` | Validates a generated runtime readiness report file | Read-only; creates no files |

## Runtime readiness evidence loop

Runtime readiness reports provide advisory-only evidence for Owner and Codex review.

```bash
# Clean any prior generated state
rm -rf .pnpd/runtime-readiness

# Generate and write a report locally
node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness

# Find the generated report file
REPORT="$(find .pnpd/runtime-readiness -maxdepth 2 -type f -name '*.json' | head -n 1)"

# Validate the report file
node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report "$REPORT"

# Clean up generated state
rm -rf .pnpd/runtime-readiness
```

Notes:

- Generated files under `.pnpd/runtime-readiness/` are gitignored and must not be committed.
- Report validation is advisory-only and does not authorize any action.
- Phase 1J validates the filename hash prefix against stored `integrity.contentHash`; it does not recompute the full content hash.

## Current capabilities

| Capability | Status |
|------------|--------|
| Schema validation | Complete |
| Dry-run orchestration | Complete |
| Dispatch readiness validation | Complete |
| Runtime readiness report generation | Complete |
| Runtime readiness local write | Complete |
| Runtime readiness report file validation | Complete |
| Ledger writer (behind explicit flag) | Complete |
| Handoff writer (behind explicit flag) | Complete |
| Lockfile support (behind explicit flag) | Complete |
| Scheduler scaffold (non-dispatching) | Complete |
| CI validation | Complete |

See [`docs/pnpd/current-capability-map.md`](docs/pnpd/current-capability-map.md) for full detail.

## Blocked capabilities

These are intentionally blocked, not "coming soon." Any change requires a separate governed phase, Codex audit, and Owner approval.

- dispatch execution
- GitHub/API mutation
- deployment
- daemon/watcher
- installer
- packaging
- production-readiness certification
- authority escalation
- autonomous agent routing
- Owner/Codex bypass

## Governance model

| Role | Responsibility |
|------|---------------|
| **Owner** | Final authority on all decisions |
| **Hermes** | Design and verification |
| **DeepSeek** | Implementation after Owner approval |
| **Codex** | Formal audit and final review |
| **AgentBridge** | Coordination, handoff, and state support only |

AgentBridge does not approve, merge, deploy, certify, or dispatch.

## Repository map

| Path | Purpose |
|------|---------|
| `README.md` | Project front door |
| `docs/quickstart-local.md` | Local verification guide |
| `docs/pnpd/current-capability-map.md` | Detailed capability inventory |
| `docs/pnpd/runtime-readiness-usage.md` | Runtime readiness command documentation |
| `docs/pnpd/runtime-readiness-consumption-design.md` | Future consumption design (design-only) |
| `.pnpd/*.schema.json` | JSON Schema definitions |
| `tests/fixtures/pnpd/` | Valid and invalid test fixtures |
| `scripts/pnpd-validate-schemas.mjs` | Schema and fixture validator |
| `scripts/pnpd-orchestrator-dry-run.mjs` | Orchestrator dry-run |
| `.github/workflows/pnpd-ci.yml` | CI validation pipeline |

## Deeper docs

- [`docs/quickstart-local.md`](docs/quickstart-local.md)
- [`docs/pnpd/current-capability-map.md`](docs/pnpd/current-capability-map.md)
- [`docs/pnpd/runtime-readiness-usage.md`](docs/pnpd/runtime-readiness-usage.md)
- [`docs/pnpd/runtime-readiness-consumption-design.md`](docs/pnpd/runtime-readiness-consumption-design.md)

## Contributor rules

- No agent certifies its own work.
- Git state is truth.
- Keep phases scoped.
- Do not mix runtime, docs, schema, validator, CI, and distribution work unless a governed phase explicitly allows it.
- Do not commit generated `.pnpd/runtime-readiness/`, `.pnpd/ledger/`, `.pnpd/handoffs/`, or `.pnpd/locks/`.
- Owner approval and Codex audit are required before merge.

## Roadmap / safe next increments

This README and adoption front-door refresh is Phase 1K. Future work must be separately designed, audited by Codex, and approved by the Owner.

Runtime consumption linking, dispatch, deployment, daemonization, installer, packaging, Cursor/Claude integrations, bootstrap tooling, and distribution work are not part of this phase and are not promised.

## License

Apache 2.0 — see [`LICENSE`](LICENSE).
