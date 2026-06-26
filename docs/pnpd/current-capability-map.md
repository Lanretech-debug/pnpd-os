# PNPD Current Capability Map

## Current stable state

| Field | Value |
|-------|-------|
| **Phase** | Phase 1P-L (README adoption prompt implementation) |
| **Current canonical verdict** | `PHASE_1P_L_README_ADOPTION_PROMPT_IMPLEMENTATION_PUSHED_CI_GREEN` |
| **Latest stable commit** | `9ca86d3baa72f71793ef4549c7396bc15bd35cdc` |
| **Branch** | `main` |
| **Node version** | `22` (see `.github/workflows/pnpd-ci.yml`) |
| **Remote CI run** | `28202279266` |
| **Remote CI conclusion** | `success` |
| **known untracked files: none** | confirmed |
| **Repo hygiene** | clean `main` matching `origin/main` |

## Existing capabilities

| Capability | Status | Verification command |
|------------|--------|----------------------|
| Schema validation (Phase 0) | ✅ Complete | `npm run validate` |
| Dry-run orchestrator | ✅ Complete | `npm run dry-run` |
| Phase 1C fixture instance validation | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1c` |
| Dispatch readiness schema | ✅ Complete | `.pnpd/dispatch-readiness.schema.json` |
| Dispatch readiness validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1f` |
| Dispatch readiness fixtures (9 invalid, 3 valid) | ✅ Complete | Validated by `--phase 1f` |
| Runtime readiness schema | ✅ Complete | `.pnpd/runtime-readiness.schema.json` |
| Runtime readiness fixtures (10 invalid, 3 valid) | ✅ Complete | Validated by `--phase 1h` |
| Runtime readiness validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1h` |
| Runtime readiness stdout report | ✅ Complete | `node scripts/pnpd-orchestrator-dry-run.mjs --runtime-readiness` |
| Runtime readiness local write | ✅ Complete | `node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness` |
| Runtime readiness report file validation | ✅ Complete / local read-only validation | `node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report <path>` |
| Runtime readiness CI validation | ✅ Complete | `.github/workflows/pnpd-ci.yml` (Phase 1H-H) |
| Research Discovery schema | ✅ Complete | `.pnpd/research-discovery.schema.json` |
| Research Discovery fixtures (10 invalid, 6 valid) | ✅ Complete | Validated by `--phase 1m` |
| Research Discovery validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1m` |
| Research Discovery standalone artifact validation | ✅ Complete / local read-only | `node scripts/pnpd-validate-schemas.mjs --research-discovery-artifact <path>` |
| Product Delivery framework docs | ✅ Complete | `docs/pnpd/memory-and-product-delivery-framework.md` |
| Product Delivery templates | ✅ Complete | `templates/product/` (14 templates) |
| Product Delivery schema | ✅ Complete | `.pnpd/product-delivery.schema.json` |
| Product Delivery fixtures (10 invalid, 6 valid) | ✅ Complete | `tests/fixtures/pnpd/product-delivery/` (16 files) |
| Product Delivery validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1n` |
| Product Delivery standalone artifact validation | ✅ Complete / local read-only | `node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>` |
| Scheduler scaffold | ✅ Complete | Present in orchestrator (Phase 0 scaffold) |
| Ledger local writer | ✅ Complete | `--write-ledger` flag |
| Handoff local writer | ✅ Complete | `--write-handoff` flag |
| Lockfile support | ✅ Complete | Lockfile validation in orchestrator |
| Quickstart local verification | ✅ Complete | `npm run validate`, `npm run dry-run`, `npm test` |
| Product Delivery Registry schema-instance validation (Phase 1O-R) | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --validate-schema-instance` |
| Product Delivery Registry example discovery (Phase 1O-R) | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1o-example` |
| Product Delivery Registry minimal example fixture (Phase 1O-S) | ✅ Complete | `tests/fixtures/pnpd/product-delivery-registry/examples/example-minimal-registry.json` |
| Product Delivery Registry reconciliation/governance docs (Phase 1O-T) | ✅ Complete | `docs/pnpd/phase-1o-product-delivery-registry-reconciliation.md` |
| Product Delivery Registry validation usage guide (Phase 1O-U) | ✅ Complete | `docs/pnpd/product-delivery-registry-validation-usage.md` |
| Product Delivery Registry package script wrapper design (Phase 1O-V) | ✅ Complete | `docs/pnpd/phase-1o-v-package-script-wrapper-design.md` |
| Product Delivery Registry local package scripts (Phase 1O-W): `validate:pdr`, `validate:pdr:fixtures`, `validate:pdr:examples` | ✅ Complete | `npm run validate:pdr`, `npm run validate:pdr:fixtures`, `npm run validate:pdr:examples` |
| Product Delivery Registry CI integration design (Phase 1O-X) | ✅ Complete | `docs/pnpd/phase-1o-x-ci-integration-design.md` |
| Product Delivery Registry CI validation (Phase 1O-Y): separate `validate:pdr:fixtures` and `validate:pdr:examples` steps | ✅ Complete | `.github/workflows/pnpd-ci.yml` |
| GitHub-app-verified CI green baseline for Phase 1O-Y | ✅ Complete | PNPD CI run `27871552548`, conclusion `success` |
| Bug forecast validator (Phase 1Q) | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1q-bug-forecast` |
| Bug forecast schema (Phase 1Q) | ✅ Complete | `.pnpd/bug-forecast.schema.json` |
| Bug forecast fixtures (Phase 1Q) | ✅ Complete | `tests/fixtures/pnpd/bug-forecast/` |

**Note:** Runtime readiness report file validation (Phase 1J) uses filename-prefix validation only; it does not recompute the full report content hash yet.

## Docs-only governance capabilities

The following governance capabilities are completed as docs-only deliverables. They are **advisory only, non-executable, non-mutating, and do not implement runtime, schema, validators, fixtures, CI enforcement, registry writes, generated state, or AgentBridge authority.**

**Note:** Phase 1Q (bug forecast validator) is listed above under Existing capabilities because it implemented a validator with schema, fixtures, and tests. It is not a docs-only phase.

| Phase | Capability | Status |
|-------|-----------|--------|
| Phase 1N-C | Template adoption/validation decision pack | ✅ Complete — docs-only |
| Phase 1N-D | Product template contract | ✅ Complete — docs-only |
| Phase 1N-E | Product template-to-artifact mapping matrix | ✅ Complete — docs-only |
| Phase 1N-F | Product template conversion boundary and no-parser strategy | ✅ Complete — docs-only |
| Phase 1R-A | Agent novel idea capability harness | ✅ Complete — docs-only |
| Phase 1R-B | Agent novel idea candidate synthetic example | ✅ Complete — docs-only |
| Phase 1R Batch 1 | Agent novelty review pack | ✅ Complete — docs-only |
| Phase 1S Batch 0 | Repo hygiene and deferred scope reconciliation | ✅ Complete — docs-only |
| Phase 1S Batch 1 | Current capability map reconciliation | ✅ Complete — docs-only |
| Phase 1S Batch 2 | Post-canonical baseline doc consistency reconciliation | ✅ Complete — docs-only |
| Phase 1P-G | Teach Skills / Obsidian / Git knowledge layer categorisation design | ✅ Complete — docs-only |
| Phase 1P-H | Git-backed Obsidian-compatible Markdown memory scaffold | ✅ Complete — docs-only scaffold |
| Phase 1P-I | Memory record authoring rules and promotion flow design | ✅ Complete — docs-only governance design |
| Phase 1P-J | Adoption playbook and project memory profile design | ✅ Complete — docs-only adoption design |
| Phase 1P-K | README adoption prompt implementation design | ✅ Complete — docs-only README implementation design |
| Phase 1P-L | README adoption prompt implementation | ✅ Complete — README-only docs implementation |

The docs-only governance phases listed in this section do **not**:

- implement runtime behavior
- implement schema
- implement validators
- create fixtures
- add CI enforcement
- write registry state
- create generated state
- alter AgentBridge authority
- claim production readiness
- claim adoption readiness

Phase 1P-H added a manual Markdown scaffold under `memory/`. This Batch 0 adds one pointer-only canonical baseline record in `memory/00-canonical/baselines/`. Neither the scaffold nor the pointer record supersedes `docs/pnpd/current-capability-map.md`.

Phase 1P-I added the docs-only governance design for memory record authoring rules, promotion flow, lifecycle states, privacy boundaries, cross-project Obsidian adoption boundaries, and canonical-state drift prevention. It does not create memory records, `.obsidian`, automation, schemas, validators, fixtures, CI enforcement, registry writes, generated state, project profiles, Teach Skills, or AgentBridge authority.

Batch reconciliation verdict target: `PHASE_1P_I_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION`.

Phase 1P-J added the docs-only adoption playbook and project memory profile design for safe PNPD-OS project adoption, README-facing adoption prompt design, GitHub-as-authority memory governance, agent memory boundaries, anti-AI-slope rules, project adoption lifecycle states, project memory profile lifecycle states, deferred-scope boundaries, and future README/project-profile implementation strategy. It does not update README, create project profiles, create memory records, create `.obsidian`, implement runtime integration, implement schemas, implement validators, create fixtures, add CI enforcement, write registry state, create generated state, enable deployment, enable dispatch, create Teach Skills, or authorize AgentBridge.

Batch reconciliation verdict target: `PHASE_1P_J_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION`.

Phase 1P-K added the docs-only README adoption prompt implementation design for a future README-only status refresh and public copy-paste PNPD-OS adoption prompt. It designs README prompt placement, adoption assessment instructions, GitHub-as-authority requirements, Obsidian and memory boundaries, anti-AI-slope rules, future README-only file scope, and Codex audit strategy. It does not update README, implement the README prompt, create memory records, create project profiles, create `.obsidian`, implement runtime integration, implement schemas, implement validators, create fixtures, add CI enforcement, write registry state, create generated state, enable deployment, enable dispatch, create Teach Skills, or authorize AgentBridge.

Batch reconciliation verdict target: `PHASE_1P_K_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION`.

Phase 1P-L implemented the README-only adoption prompt update. It refreshed the README status block to the Phase 1P-K Batch 0 baseline and added the public assessment-first `## Adopt PNPD-OS into your project` section with 11 placeholders, 18 receiving-agent instructions, and 13 required output items. It does not update the capability map, create memory records, create project profiles, create `.obsidian`, implement runtime integration, implement schemas, implement validators, create fixtures, add CI enforcement, write registry state, create generated state, enable deployment, enable dispatch, create Teach Skills, or authorize AgentBridge.

Batch reconciliation verdict target: `PHASE_1P_L_BATCH_0_POST_README_IMPLEMENTATION_CANONICAL_STATE_RECONCILIATION`.

## Deferred and blocked boundary

Reference: `docs/pnpd/deferred-scope-reconciliation.md`.

**deferred work is not active backlog.** Deferred items are recorded in the deferred work register. They must not be mistaken for work-in-progress, active backlog state, or eligible implementation.

**blocked work is not eligible implementation.** Blocked items require Owner-authorized Hermes design, missing evidence, or external authority before they can be unlocked. They must not be described as actionable.

**eligible next work is limited to docs-only or confirmed validator-defect work unless Owner authorizes Hermes design.** No implementation batch is eligible merely because it is interesting. No deferred work becomes implementation without Owner-authorized Hermes design.

**no deferred work becomes implementation merely by appearing in the map.** This capability map is descriptive, not authority-granting. Presence in this map does not authorize implementation.

## Batch mode delivery discipline

PNPD-OS now enforces **batch mode** delivery for all future increments.

- **batch mode** is preferred for related docs-only governance controls sharing one risk class
- microphase chains are allowed only when risk classes genuinely differ
- one batch must have one coherent risk class
- one batch must have one allowed file set
- one batch must have one forbidden implementation surface
- one batch must have one audit strategy
- one batch must have one CI verification
- batch mode accelerates delivery without weakening governance
- batch mode must not hide implementation inside docs

## Repo hygiene policy

**known untracked files: none.**

- local dirt must not become permanent background noise
- cleanup must be targeted only
- no broad `git clean -fdx` without explicit Owner authorization
- unknown untracked files must be inspected before deletion
- expected local implementation state is clean `main` matching `origin/main`

## Controlled Unlock capabilities

**Note on superseded phase labels:** Some Controlled Unlock entries below reference older phase designations (e.g., Phase 1Q-A, 1Q-B, 1R-A, 1R-B, 1S-A, 1S-B). These phase labels have been partially superseded by later docs-only governance phases (see Docs-only governance capabilities above). The old labels must not be treated as current authorization. Current authorization comes only from the latest canonical baseline and Owner-approved Hermes design. Runtime consumption of Product Delivery artifacts remains blocked. Automated Product Delivery artifact generation remains blocked. Writer mutation of live Product Delivery Registry state remains blocked. Old labels must not be used to bypass current blocked/deferred registers.

The following capabilities are planned for future implementation through a gated, sequenced roadmap. They are not authorized for immediate implementation by this document. Each unlock requires explicit phase scope, dependency resolution, safety-boundary review, Owner approval, implementation, Codex audit, and GitHub verification before becoming canonical.

| Capability | Status |
|------------|--------|
| Dispatch execution | Controlled Unlock — gated behind Phase 1V-A |
| GitHub/API mutation outside authorized Codex finalization | Controlled Unlock — gated behind Phase 1S-B |
| Deployment | Controlled Unlock — gated behind Phase 1V-B |
| Release packaging | Controlled Unlock — gated behind Phase 1U-B |
| Daemon/watcher | Controlled Unlock — gated behind Phase 1T-A |
| Installer | Controlled Unlock — gated behind Phase 1U-A |
| Production-readiness certification | Controlled Unlock — gated behind Phase 1W-A |
| Runtime consumption of Product Delivery artifacts | Controlled Unlock — gated behind Phase 1R-A |
| Automated Product Delivery artifact generation | Controlled Unlock — gated behind Phase 1R-B |
| Writer mutation of live Product Delivery Registry state | Controlled Unlock — gated behind Phase 1Q-A |
| Artifact hash validation after path-design | Controlled Unlock — gated behind Phase 1Q-B |
| Owner/Codex bypass through delegated-authority design only | Controlled Unlock — gated behind Phase 1S-A |
| AgentBridge approval authority through delegated-authority design only | Controlled Unlock — gated behind Phase 1S-A |

### Internal daemon and dashboard boundary

Phase 1T-A and Phase 1T-B are internal operator-control-plane features.

They must support:

- Codex connector
- Hermes connector
- DeepSeek GUI connector
- Coordination across all three agents from the dashboard
- Dashboard visibility into agent handoffs
- Dashboard visibility into phase baseline
- Dashboard visibility into current repo state
- Dashboard visibility into CI state
- Dashboard visibility into pending approvals
- Dashboard visibility into project adoption state
- Dashboard visibility into Teach Skills / Obsidian / Teach Skill Studio categories

Boundaries:

- internal-use only
- no public SaaS dashboard claim in first implementation
- no automatic deployment by default
- no uncontrolled GitHub/API mutation
- no Owner authority bypass without delegated-authority design

### Teach Skills, Obsidian, and Teach Skill Studio

These are not blocked. They are active roadmap categories.

Phase 1P-G has completed the categorisation and governance design for Teach Skills / Obsidian / Git.
It should be sequenced after Project Profile and Adoption Model.

Roadmap categories:

- Knowledge and Memory Layer: Obsidian
- Skill Authoring Layer: Teach Skills
- Operator Training Layer
- Agent Instruction Layer
- Project Reuse Layer
- Dashboard-visible capability category

No implementation is authorized by the current design.

## Categorised framework roadmap

### Phase 1P — Foundation and classification

- 1P-A Agent orchestration control loop document
- 1P-B PNPD-OS framework classification design
- 1P-C Project profile schema and adoption model
- 1P-D Project adoption dry-run design
- 1P-E Reusable project adoption templates
- 1P-F Existing project adoption map
- 1P-G Teach Skills / Obsidian / Teach Skill Studio categorisation design

### Phase 1Q — Registry and validation

**Note:** Phase 1Q designation now refers to the bug forecast validator (implemented validator/schema/fixture capability, complete). The roadmap items below retain their original design intent but use older sub-phase labels (1Q-A, 1Q-B). These labels must not be treated as current authorization. Current authorization comes from the latest canonical baseline and Owner-approved Hermes design.

- 1Q-A Live Product Delivery Registry writer design (deferred — see deferred scope reconciliation)
- 1Q-B Artifact path and hash validation design (deferred)

### Phase 1R — Artifact pipeline

**Note:** Phase 1R designation now refers to agent novel idea governance (docs-only: 1R-A harness, 1R-B example, Batch 1 review pack — all complete). The roadmap items below retain their original design intent but use older sub-phase labels. These labels must not be treated as current authorization.

- 1R-A Runtime consumption of Product Delivery artifacts (blocked — see blocked work register)
- 1R-B Automated Product Delivery artifact generation (blocked)

### Phase 1S — Agent governance

**Note:** Phase 1S designation now refers to repo hygiene and deferred scope reconciliation (docs-only: Batch 0, Batch 1 — both docs-only governance). The roadmap items below retain their original design intent but use older sub-phase labels.

- 1S-A AgentBridge delegated authority model (blocked — no AgentBridge authority)
- 1S-B Controlled GitHub/API mutation design (deferred)

### Phase 1T — Internal operator control plane

- 1T-A Internal daemon/watcher design
- 1T-B Internal operator dashboard design with Codex, Hermes, and DeepSeek GUI connectors

### Phase 1U — Packaging and installation

- 1U-A Installer design
- 1U-B Release packaging design

### Phase 1V — Execution control

- 1V-A Dispatch execution design
- 1V-B Deployment control design

### Phase 1W — Certification

- 1W-A Production-readiness certification framework

## Verification commands

Copy-paste commands to verify current state locally:

```bash
# Full validation (phases 0, 1b, 1c, 1f, 1n, 1o)
# Phases 1h and 1m run explicitly with the commands below.
npm run validate

# Dry-run orchestrator
npm run dry-run

# Full test (validate + dry-run)
npm test

# Product Delivery Registry fixture validation (21 shape fixtures)
npm run validate:pdr:fixtures

# Product Delivery Registry example validation (1 example fixture)
npm run validate:pdr:examples

# Product Delivery Registry combined validation (fixtures + examples)
npm run validate:pdr

# Research Discovery fixture validation
node scripts/pnpd-validate-schemas.mjs --phase 1m

# Research Discovery standalone artifact validation
node scripts/pnpd-validate-schemas.mjs --research-discovery-artifact <path>

# Product Delivery fixture validation
node scripts/pnpd-validate-schemas.mjs --phase 1n

# Product Delivery standalone artifact validation
node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>

# Phase 1H runtime readiness validator
node scripts/pnpd-validate-schemas.mjs --phase 1h

# Runtime readiness stdout report (no files written)
node scripts/pnpd-orchestrator-dry-run.mjs --runtime-readiness

# Runtime readiness local write (one gitignored file written)
node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness

# Runtime readiness report file validation (read-only)
# First generate a report with --write-runtime-readiness, then:
# REPORT="$(find .pnpd/runtime-readiness -maxdepth 2 -type f -name '*.json' | head -n 1)"
# node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report "$REPORT"
```

## Governance boundaries

PNPD-OS is an AI-assisted software delivery framework for building, governing, validating, coordinating, and scaling SaaS/product systems through controlled agent workflows.

- **Owner remains final authority.** All gates require owner decision for merge and release.
- **Codex audit is required before merge.** Formal audit with full evidence must precede any merge.
- **AgentBridge coordinates only.** It does not approve, merge, deploy, certify, dispatch, or bypass gates.
- **Dispatch remains blocked.** The orchestrator dry-run classifies and recommends; it does not execute.
- **Runtime readiness reports are advisory-only.** They provide evidence for review; they do not authorize any action.
- **Product Delivery artifacts are advisory and planning artifacts.** They do not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, release, production readiness, or gate bypass.
- **Standalone artifact validation is read-only.** Research Discovery and Product Delivery standalone validators create no files.
- **Codex remains auditor/reviewer, not Owner.**
- **AgentBridge remains non-authorizing.**

### Non-readiness boundary

The current canonical state asserts:

- **no production readiness claim**
- **no adoption readiness claim**
- no deployment authorization
- no dispatch authorization
- no certification
- no runtime consumption claim
- no registry write authorization
- no roadmap commitment claim
- no AgentBridge authority
- no generated state

### Hermes intake governance

- Hermes design output requires a fresh session for PNPD phase authority.
- Reused Telegram Hermes sessions are invalid for PNPD design authority.
- Each required Hermes section must appear exactly once.
- Duplicated semantic sections invalidate Hermes output.
- Telegram split markers are tolerated only if semantic content is not duplicated.
- Owner may amend/restate a duplicated Hermes design, but the duplicated output itself is not canonical.

### Hermes model status

Hermes is currently configured to use DeepSeek as its model/provider path for design support.

This does not change agent authority boundaries:

- Hermes remains design/recommendation only.
- DeepSeek GUI remains implementation only.
- Codex remains audit/finalize only when explicitly authorized.
- GitHub App verification remains required before canonical acceptance.

### Hermes Terminal preference

For high-authority PNPD design outputs, Hermes Terminal / raw CLI output is preferred over Telegram when exact structure matters.

Reason: Telegram Hermes previously showed duplication/truncation risk through reused session context.

### Telegram Hermes acceptance

Telegram Hermes output is acceptable only when:

- it uses a fresh session
- semantic section counts pass
- no duplicated sections appear
- no truncated final section appears
- Telegram split markers are ignored only if semantic content is not duplicated

### Model switch caution

Changing Hermes model/provider does not by itself prove the duplication/truncation issue is fixed.

The output path must still pass:

- fresh-session rule
- section-count validation
- no-truncation check
- Owner review

### GitHub App verification governance

- Canonical baseline is accepted only after GitHub App verification.
- Required verification:
  - commit metadata
  - compare against previous baseline
  - changed-file scope
  - final file content on main when relevant
  - GitHub Actions workflow/job conclusion
  - legacy combined status noted if empty or unavailable

## Remote CI evidence

All remote CI runs on `main` branch, all concluded `success`:

| Phase | Run ID | Commit | Duration |
|-------|--------|--------|----------|
| 1G-D | `27469237440` | `07b99261c430511baaf045780748b6929c9e4f8b` | — |
| 1H-A | `27470339994` | `8bfe1cb23951605c9fc469865982797569494904` | — |
| 1H-B | `27491242272` | `165d02651da46ef928b1a70617793e881ddef661` | — |
| 1H-C | `27492801181` | `65fcf98c095c4fa9cd2fd7846be58359ef3ec8f4` | — |
| 1H-D | `27498248995` | `6805e39f2055a593bcbbfe075164403c527323eb` | — |
| 1H-E | `27499358254` | `e834ede24ee97d1220212f22bb53bbdcd815a5a6` | — |
| 1H-F | `27500805917` | `cc19251a766aea617e0c594f8c86f2207a59fce8` | — |
| 1H-G | `27502151932` | `91d4ddd854fc0a8101e20fca0b4a2d002b2ffc56` | 19s |
| 1H-H | `27503401073` | `e37b6867aabb138715ae6b52828165a128916ff9` | 19s |
| 1J | `27508672848` | `f7eb3c1b0370ee225b132d2f7c0816dceb936eaa` | 16s |
| 1N-E | `27653676971` | `2b5093d0a44d3da02928eb22ae40747c7d1b29ff` | 22s |
| 1O-W | `27868965459` | `4efbba56823257ee9fe7e3e1e2178ecd7753b3e8` | — |
| 1O-X | `27870885423` | `8d48a7adff0ecb628933b67dd98a1cd54e739468` | — |
| 1O-Y | `27871552548` | `8b541a143b125940a7392d346e4de612ccee5340` | — |
| 1S Batch 0 | `28089376629` | `6ea9beb88bc0a0f34536cfbf247e67f43a629c07` | — |
| 1P-L | `28202279266` | `9ca86d3baa72f71793ef4549c7396bc15bd35cdc` | — |
