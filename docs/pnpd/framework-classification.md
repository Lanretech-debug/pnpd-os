# PNPD-OS Framework Classification

## 1. Purpose

This document classifies PNPD-OS as a framework. It defines:

* what PNPD-OS is
* what it is not yet
* what capabilities are already implemented
* what capabilities are Controlled Unlock
* what plug-and-play means safely in a staged roadmap
* how the framework should mature over time

This document is **classification-only**. It does not implement any new runtime, automation, project adoption, connector, dashboard, daemon, deployment, installer, packaging, certification, or mutation behavior. It creates no execution capability and modifies no code, schemas, fixtures, CI workflow, package manifest, or registry state.

## 2. Current baseline

| Item | Value |
|------|-------|
| Repo | `Lanretech-debug/pnpd-os` |
| Branch | `main` |
| Current repo delivery baseline | `PHASE_1P_A_AGENT_ORCHESTRATION_CONTROL_LOOP_PUSHED_CI_GREEN` |
| Current baseline commit | `f90d68fa8ba71b42f13651d677afba3e80c6202f` |
| Remote CI run | `27874346031` |
| Remote CI conclusion | `success` |
| Known local untracked files | `.DS_Store`, `.kunsdd/`, `index.html` |

Implementation capability baseline is **Phase 1O-Y**. Repo delivery baseline is **Phase 1P-A**.

Controlled Unlock capabilities are planned, gated, sequenced future implementations — not immediate authority. Each unlock requires its own design, Owner approval, scoped implementation, Codex audit, GitHub App verification, and canonical baseline update before it becomes active.

## 3. Framework identity

PNPD-OS is:

> an AI-assisted software delivery framework for building, governing, validating, coordinating, and scaling SaaS/product systems through controlled agent workflows.

PNPD-OS combines:

* controlled agent workflows (Codex, Hermes, DeepSeek)
* product delivery governance
* validation-first delivery
* canonical baseline management
* GitHub App verification
* a project adoption roadmap
* a Controlled Unlock roadmap

PNPD-OS is **more than**:

* a validator-only repo
* an agent handoff chat process
* a pile of Markdown docs
* a CI wrapper

But it is **not yet**:

* a production execution platform
* a deployment engine
* a public dashboard product
* an autonomous mutation system

## 4. Framework layers

PNPD-OS organizes capabilities into the following layers. Each layer has a defined purpose, a current implementation status, and a future relationship to the framework roadmap.

| # | Layer | Purpose | Current status | Future relationship |
|---|-------|---------|----------------|---------------------|
| 1 | **Governance and Authority Layer** | Define who can approve, mutate, certify, and delegate within PNPD-OS workflows | Partially implemented | Full delegated-authority model pending Controlled Unlock design |
| 2 | **Agent Orchestration Layer** | Coordinate Codex, Hermes, and DeepSeek through structured handoffs, phase baselines, and control-loop gates | Implemented | Expands with dashboard visibility and cross-agent connector coordination |
| 3 | **Validation and Schema Layer** | Validate schemas, fixtures, examples, and registry instances before delivery | Implemented | Runtime validation and artifact hash verification pending Controlled Unlock |
| 4 | **Product Delivery Layer** | Define product delivery framework docs, templates, schema, fixtures, and validator | Implemented | Automated artifact generation and runtime consumption pending Controlled Unlock |
| 5 | **Product Delivery Registry Layer** | Maintain canonical registry of product delivery artifacts with schema-instance validation | Partially implemented | Live registry writer, hash integrity verification, and artifact consumption pending Controlled Unlock |
| 6 | **Runtime Readiness Layer** | Validate runtime readiness and produce stdout/local write reports | Partially implemented | Full runtime artifact consumption and deployment handoff pending Controlled Unlock |
| 7 | **Research Discovery Layer** | Validate research discovery outputs | Implemented | Integration with Teach Skills / Obsidian memory layer planned |
| 8 | **Project Adoption Layer** | Profile, assess, and template projects for PNPD-OS adoption | Planned category | Project profile schema and adoption dry-run are next-stage deliverables |
| 9 | **Knowledge and Memory Layer** | Obsidian-integrated memory for agent context, phase baselines, and skill references | Planned category | Future Phase 1P-G categorisation; no implementation in Phase 1P-B |
| 10 | **Skill Authoring Layer** | Teach Skills authoring, categorisation, testing, validation, and reuse | Planned category | Future Teach Skills / Teach Skill Studio implementation; no implementation in Phase 1P-B |
| 11 | **Internal Operator Control Plane Layer** | Internal daemon, dashboard, and connector coordination for operator visibility | Planned category | Internal-use only; future dashboard design and connector integration pending Controlled Unlock |
| 12 | **Execution and Deployment Control Layer** | Controlled dispatch execution, deployment execution, and installer packaging | Controlled Unlock | Gated behind Controlled Unlock gates; no implementation in Phase 1P-B |
| 13 | **Certification Layer** | Production-readiness certification framework | Controlled Unlock | Gated behind Controlled Unlock; no implementation in Phase 1P-B |

Status value definitions:

* **Implemented** — Capability exists, is committed, and passes CI validation.
* **Partially implemented** — Core validation or local write path exists; full runtime, live write, or delegated authority path is not yet implemented.
* **Controlled Unlock** — Planned and gated; requires design, Owner approval, scoped implementation, Codex audit, GitHub App verification, and canonical baseline update before activation.
* **Planned category** — Recognized as a framework layer with future design work planned; no implementation exists yet.
* **Not implemented** — No design or implementation work has begun.

## 5. Current implemented baseline

The following capabilities are implemented and committed in the canonical baseline:

* schema validation
* dry-run orchestrator
* dispatch readiness validation
* runtime readiness validation
* runtime readiness stdout/local write
* research discovery validation
* product delivery framework docs, templates, schema, fixtures, and validator
* product delivery standalone artifact validation
* Product Delivery Registry schema-instance validation
* Product Delivery Registry example discovery
* Product Delivery Registry example fixture
* Product Delivery Registry validation usage guide
* Product Delivery Registry local npm wrappers
* Product Delivery Registry CI validation
* capability map reconciliation
* agent orchestration control loop document
* GitHub App verification process

These implemented capabilities **do not equal** dispatch execution, deployment execution, production certification, public dashboard, installer, or autonomous mutation authority. They are validation, governance, and coordination capabilities — not execution or mutation capabilities.

## 6. What PNPD-OS is not yet

PNPD-OS is **not yet**:

* production-certified
* a deployment engine
* a dispatch execution engine
* an installer
* release-packaged
* a public SaaS dashboard
* an autonomous GitHub/API mutation system
* an Owner-bypass system
* an AgentBridge approval-authority system
* a daemon/watcher
* a runtime Product Delivery artifact consumer
* an automated Product Delivery artifact generator
* a live Product Delivery Registry writer
* an Obsidian-integrated memory layer
* Teach Skills implementation
* Teach Skill Studio

Each of these capabilities is either planned, gated as Controlled Unlock, or part of a future phase. None are active or authorized in the current baseline.

## 7. Framework maturity model

PNPD-OS matures through defined stages. Each stage builds on the previous one and adds new capability categories.

| Stage | Name | Description |
|-------|------|-------------|
| Stage 0 | Validation substrate | Schema validation, fixture validation, dry-run orchestration |
| Stage 1 | Product delivery governance | Product delivery framework docs, templates, schema, validator |
| Stage 2 | Product Delivery Registry validation | Registry schema-instance validation, example discovery, CI integration |
| Stage 3 | Agent orchestration control loop | Agent handoffs, phase baselines, control-loop document, GitHub App verification |
| Stage 4 | Framework classification and project adoption foundation | Framework classification document; prepares project adoption foundation |
| Stage 5 | Project profile / adoption model | Project profile schema, adoption dry-run, reusable templates |
| Stage 6 | Knowledge / skill integration | Teach Skills categorisation, Obsidian memory policy, Teach Skill Studio design |
| Stage 7 | Internal operator control plane | Internal daemon, dashboard, cross-agent connector coordination |
| Stage 8 | Controlled execution / deployment | Dispatch execution, deployment control, installer, release packaging |
| Stage 9 | Production-readiness certification | Certification framework and production-readiness gates |

**Current canonical maturity stage after Phase 1P-B is Stage 4.**

Stage 4 does **not** mean project adoption schema is implemented yet. It means framework classification now exists and prepares the project adoption foundation. Project profile schema and adoption dry-run remain Stage 5 deliverables.

## 8. Plug-and-play definition

### Acceptable meaning at this stage

A project can be profiled, assessed, templated, validated, governed, and routed through PNPD-OS workflows with minimal manual setup. Plug-and-play refers to the *adoption experience* — the ease with which a new project enters the PNPD-OS governance and validation framework.

### Unacceptable meaning at this stage

PNPD-OS does **not** automatically mutate projects, deploy software, approve merges, dispatch actions, or certify production readiness without Controlled Unlock gates. Plug-and-play is an adoption-path concept, not an autonomous-execution concept.

### Future plug-and-play prerequisites

Before PNPD-OS can claim full plug-and-play adoption, the following must be designed and implemented:

* project profile schema
* project adoption dry-run
* reusable templates
* Teach Skills categorisation
* Obsidian / memory policy
* internal dashboard design
* controlled installer / package design
* delegated authority model
* GitHub / API mutation design
* certification framework

Each prerequisite is gated through its own phase design, Owner approval, and Controlled Unlock sequence.

## 9. Internal operator control plane relationship

The internal daemon and dashboard are **future operator-control-plane features**. They are not implemented in the current baseline.

Key design constraints for the operator control plane:

* internal-use only — not a public SaaS product
* future Codex connector
* future Hermes connector
* future DeepSeek GUI connector
* dashboard coordination across all three agents (Codex, Hermes, DeepSeek)
* visibility into agent handoffs
* visibility into phase baseline
* visibility into repo state
* visibility into CI state
* visibility into pending approvals
* visibility into project adoption state
* visibility into Teach Skills / Obsidian / Teach Skill Studio categories
* **no** public SaaS dashboard claim in first implementation
* **no** automatic deployment by default
* **no** uncontrolled GitHub/API mutation
* **no** Owner authority bypass without delegated-authority design

The operator control plane serves the PNPD-OS operator — the human Owner who manages agent workflows — not external users or automated systems. It provides visibility and coordination, not autonomous execution.

## 10. Teach Skills / Obsidian / Teach Skill Studio relationship

Teach Skills, Obsidian, and Teach Skill Studio are **active future framework components**. They are:

* **not blocked** — they remain planned and recognized
* **no implementation in Phase 1P-B** — this document does not implement them
* **future Phase 1P-G categorisation** — design and implementation are sequenced for a later phase

Component relationships:

* **Obsidian** → Knowledge and Memory Layer. Stores agent context, phase baselines, skill references, and canonical state.
* **Teach Skills** → Skill Authoring Layer. Defines how skills are authored, categorised, validated, and reused across agent workflows.
* **Teach Skill Studio** → Skill design, testing, validation, and reuse layer. Provides the authoring environment for Teach Skills.

All three are governed by the agent orchestration control loop and will be dashboard-visible capability categories when the internal operator control plane is implemented.

## 11. Controlled Unlock relationship

Controlled Unlock capabilities are the **framework completion path**, not immediate authority. Each unlock requires:

1. its own design document
2. Owner approval
3. scoped implementation
4. Codex audit
5. GitHub App verification
6. canonical baseline update

The following capabilities are **Controlled Unlock** — planned, gated, and sequenced:

* Live Product Delivery Registry writer
* Artifact hash validation after path-design
* Runtime consumption of Product Delivery artifacts
* Automated Product Delivery artifact generation
* AgentBridge delegated authority
* Controlled GitHub/API mutation
* Internal daemon/watcher
* Internal dashboard
* Installer
* Release packaging
* Dispatch execution
* Deployment control
* Production-readiness certification
* Teach Skills / Obsidian / Teach Skill Studio implementation categories

These are described as: **Controlled Unlock**, **planned**, **gated**, **sequenced**.

They are **not**: blocked forever, implemented, production-ready, or enabled.

## 12. Relationship to existing PNPD documents

This document classifies and frames the existing PNPD document surface. It does **not** edit, replace, or supersede any of:

* `docs/pnpd/current-capability-map.md`
* `docs/pnpd/agent-orchestration-control-loop.md`
* `docs/pnpd/memory-and-product-delivery-framework.md`
* Product Delivery Registry documentation (registry design, validation usage, CI integration, writer design, example instance design, artifact reference validation design, hash integrity verification design, append mode design, data convention)

This document is a **classification layer** that sits alongside the existing documents. It provides the framework identity, layer definitions, maturity model, and boundary statements that those documents implement or reference.

## 13. Non-goals

Phase 1P-B does **not**:

* implement project profile schema
* implement project adoption dry-run
* implement templates
* implement Teach Skills
* implement Obsidian integration
* implement Teach Skill Studio
* implement AgentBridge delegated authority
* implement GitHub/API mutation
* implement daemon/watcher
* implement dashboard
* implement installer
* implement release packaging
* implement dispatch
* implement deployment
* implement production-readiness certification
* modify `package.json`
* modify CI workflow (`.github/workflows/pnpd-ci.yml`)
* modify runtime code
* modify validator code
* modify schemas
* modify fixtures
* modify Product Delivery artifacts
* modify registry state
* modify current capability map (`docs/pnpd/current-capability-map.md`)
* modify agent orchestration control loop (`docs/pnpd/agent-orchestration-control-loop.md`)

## 14. Verification commands

The following commands verify that the repo remains stable and no forbidden files were modified:

```bash
git diff --name-only
git diff --check
git diff -- package.json
git diff -- .github/workflows/pnpd-ci.yml
git diff -- scripts
git diff -- .pnpd
git diff -- tests
git diff -- templates
git diff -- docs/pnpd/current-capability-map.md
git diff -- docs/pnpd/agent-orchestration-control-loop.md

node --check scripts/pnpd-validate-schemas.mjs
node --check scripts/pnpd-product-delivery-registry-write.mjs
node --check scripts/pnpd-orchestrator-dry-run.mjs

npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test

test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks
```

## 15. Status of this document

This document is **classification-only**.

It creates no:

* execution capability
* connector
* dashboard
* daemon
* installer
* package
* mutation authority
* deployment authority
* dispatch authority
* certification authority
* project adoption implementation
* Teach Skills implementation
* Obsidian integration
* Teach Skill Studio
