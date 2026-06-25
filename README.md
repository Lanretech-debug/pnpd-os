# PNPD-OS

A local-first governance and delivery-evidence framework for AI-assisted software work.

## Status

PNPD OS is **v0.1.0, early-stage**. It is a governance and evidence framework, not a runtime product.

- **Latest stable verdict:** `PHASE_1P_K_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION_PUSHED_CI_GREEN`
- **Latest stable commit:** `89f392927ed5c6f0e8a3926e4007d7887b965bc7`
- **Remote CI:** run `28201754089`, success
- **Branch:** `main`
- **Node:** `22`

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
- Product Delivery templates, schema, fixtures, and validators
- standalone Product Delivery artifact validation (read-only)
- standalone Research Discovery artifact validation (read-only)

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

## Adopt PNPD-OS into your project

Use this prompt with an AI coding agent to assess whether PNPD-OS can be adopted into your project. The prompt is assessment-first and does not authorize repo mutation, installation, deployment, dispatch, generated state, memory record creation, project profile creation, or AgentBridge authority.

```text
You are helping me assess PNPD-OS adoption for my project.

Project name:
[PROJECT_NAME]

Repo path:
[REPO_PATH]

Remote repo:
[REMOTE_REPO]

Default branch:
[DEFAULT_BRANCH]

Current goal:
[CURRENT_GOAL]

Desired adoption depth:
[DESIRED_ADOPTION_DEPTH]

Allowed file set:
[ALLOWED_FILE_SET]

Forbidden surfaces:
[FORBIDDEN_SURFACES]

Privacy constraints:
[PRIVACY_CONSTRAINTS]

Current known baseline:
[CURRENT_KNOWN_BASELINE]

Current known untracked files:
[CURRENT_KNOWN_UNTRACKED_FILES]

Instructions:

1. Inspect the target repo before proposing changes.
2. Identify the default branch and current HEAD.
3. Inspect existing docs, package files, tests, CI, schemas, runtime files, and generated-state folders.
4. Identify the project purpose and adoption goal.
5. Separate facts from assumptions.
6. Treat GitHub committed main as the canonical authority layer for committed repo state.
7. Treat Owner authorization as required before any file changes.
8. Treat Obsidian only as editor/navigation unless explicitly authorized.
9. Avoid private memory leakage.
10. Do not create memory records until a project memory profile is authorized.
11. Do not create project profiles until a project profile implementation batch is authorized.
12. Do not change runtime, schemas, validators, fixtures, CI, packages, generated state, registry state, deployment, or dispatch unless explicitly authorized.
13. Do not claim production readiness or adoption readiness.
14. Do not imply PNPD-OS has an installer, package, CLI, daemon, or active AgentBridge integration unless separately canonical.
15. Produce a PNPD-OS adoption assessment.
16. Propose the smallest safe first batch.
17. Provide Codex audit criteria before implementation.
18. Require remote CI verification before any canonical adoption claim.

Required output:

1. Project facts found
2. Assumptions and unknowns
3. Current repo baseline
4. Existing governance/docs/test/CI state
5. Risks and privacy boundaries
6. PNPD-OS adoption suitability
7. Smallest safe first batch
8. Allowed file set
9. Forbidden surfaces
10. Required Owner authorization phrase
11. Codex audit criteria
12. GitHub verification plan
13. Clear statement of what is not authorized
```

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
| `npm run validate` | Runs the repo validation script (phases 0, 1b, 1c, 1f, 1n; phases 1h and 1m remain explicit commands) | Does not authorize dispatch, merge, deployment, or implementation |
| `npm run dry-run` | Runs orchestrator dry-run in text and JSON mode | Does not execute any external action |
| `npm test` | Runs validate + dry-run | Does not authorize any gate bypass |
| `node scripts/pnpd-validate-schemas.mjs --phase 1f` | Validates dispatch readiness schema and 12 fixtures | Does not authorize dispatch |
| `node scripts/pnpd-validate-schemas.mjs --phase 1h` | Validates runtime readiness schema and 13 fixtures | Does not authorize runtime readiness report generation |
| `node scripts/pnpd-validate-schemas.mjs --phase 1m` | Validates Research Discovery schema and 16 fixtures (6 valid, 10 invalid) | Does not authorize dispatch, merge, deployment, or implementation |
| `node scripts/pnpd-validate-schemas.mjs --research-discovery-artifact <path>` | Validates a standalone Research Discovery artifact file | Read-only; creates no files; does not authorize dispatch, merge, deployment, or implementation |
| `node scripts/pnpd-validate-schemas.mjs --phase 1n` | Validates Product Delivery schema and 16 fixtures (6 valid, 10 invalid) | Does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production readiness |
| `node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>` | Validates a standalone Product Delivery artifact file | Read-only; creates no files; artifact remains advisory only |
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

## Product Delivery Mode

Product Delivery Mode turns product thinking into governed artifacts before implementation.
It is a structured product spine: idea → design tree → PRD → specs → implementation handoff.
It is supported by templates, JSON schema, fixtures, and machine validation.

Artifact types supported by the templates:

- Product Vision Brief
- Design Tree
- Prototype Plan
- PRD
- Product Spec
- Design Spec
- Architecture Spec
- Infrastructure Plan
- Test Plan
- Implementation Handoff
- Owner Decision
- Parked Idea
- Rejected Options
- Owner Solution Choice

Machine-validated Product Delivery artifact types:

- PRD
- Product Spec
- Architecture Spec
- Implementation Handoff

Resources:

| Resource | Path | Details |
|----------|------|----------|
| Templates | `templates/product/` | 14 templates covering the full product spine |
| Schema | `.pnpd/product-delivery.schema.json` | JSON Schema (Draft 2020-12) |
| Fixtures | `tests/fixtures/pnpd/product-delivery/` | 16 files (6 valid, 10 invalid) |

Verification:

```bash
# Validate Product Delivery fixtures
node scripts/pnpd-validate-schemas.mjs --phase 1n

# Validate a standalone Product Delivery artifact
node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact path/to/artifact.json

# Full repo validation (includes --phase 1n)
npm run validate

# Full local test
npm test
```

Standalone artifact validation rules:

- Path must be relative and under the repository root.
- File must end with `.json`.
- Absolute paths, `..` traversal, and symlink escape are rejected.
- Secrets, private filesystem paths, and `.env` references are rejected.
- Unsafe authority claims are rejected.

Governance boundary:

- Product Delivery artifacts are advisory and planning artifacts.
- They do not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, release, production readiness, or gate bypass.
- Owner remains final human authority.
- Codex remains auditor/reviewer, not Owner.
- AgentBridge remains non-authorizing.
- Standalone artifact validation is read-only and creates no files.

Deferred (not implemented):

- Runtime consumption/linking of Product Delivery artifacts
- Automated artifact generation
- Dispatch execution
- GitHub/API mutation
- Deployment/release
- Production certification
- PNPD Teach Studio implementation
- Obsidian sync
- Installer/packaging

## Current capabilities

| Capability | Status |
|------------|--------|
| Schema validation | Complete |
| Dry-run orchestration | Complete |
| Dispatch readiness validation | Complete |
| Runtime readiness report generation | Complete |
| Runtime readiness local write | Complete |
| Runtime readiness report file validation | Complete |
| Research Discovery schema and fixtures | Complete |
| Research Discovery validator mode | Complete |
| Research Discovery standalone artifact validation | Complete |
| Product Delivery templates | Complete |
| Product Delivery schema | Complete |
| Product Delivery fixtures | Complete |
| Product Delivery validator mode | Complete |
| Product Delivery standalone artifact validation | Complete |
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
- runtime consumption/linking of Product Delivery artifacts
- automated Product Delivery artifact generation

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
| `templates/product/` | Product Delivery templates |
| `.pnpd/product-delivery.schema.json` | Product Delivery JSON schema |
| `tests/fixtures/pnpd/product-delivery/` | Product Delivery fixtures |
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
- [`docs/pnpd/memory-and-product-delivery-framework.md`](docs/pnpd/memory-and-product-delivery-framework.md)

## Contributor rules

- No agent certifies its own work.
- Git state is truth.
- Keep phases scoped.
- Do not mix runtime, docs, schema, validator, CI, and distribution work unless a governed phase explicitly allows it.
- Do not commit generated `.pnpd/runtime-readiness/`, `.pnpd/ledger/`, `.pnpd/handoffs/`, or `.pnpd/locks/`.
- Owner approval and Codex audit are required before merge.

## Roadmap / safe next increments

This README and adoption front-door refresh is Phase 1N-F. Future work must be separately designed, audited by Codex, and approved by the Owner.

Runtime consumption linking, dispatch, deployment, daemonization, installer, packaging, Cursor/Claude integrations, bootstrap tooling, and distribution work are not part of this phase and are not promised.

## License

Apache 2.0 — see [`LICENSE`](LICENSE).
