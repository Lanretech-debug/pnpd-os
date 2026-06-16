# PNPD Memory, Owner, and Product Delivery Framework

## Status

**Phase 1N-B — Docs/templates only.** This document describes the PNPD memory architecture, authority model, and product delivery spine. No runtime, no automation, no tooling. The framework is exercised by a human Owner and AI agents following these instructions and templates manually.

## Purpose

This document defines:

1. How PNPD OS explains the closed loop from raw prompting to governed product delivery.
2. The three-tier memory model (Obsidian, PNPD contracts, GitHub).
3. The authority model (Owner, Codex, Hermes, DeepSeek, AgentBridge).
4. The product delivery spine — the phase-by-phase path from idea to delivery readiness.
5. The Pre-PRD Design Tree — a required structure before any PRD is written.
6. The parked idea protocol — capturing strong ideas without disrupting active scope.
7. The scope boundaries — what is explicitly not implemented, not authorized, and not delegated.

## Why this framework exists

PNPD OS is not an AI coding prompt system. It is a **governance operating system** for moving from idea to product delivery with evidence, role separation, memory, audit, and human decision authority.

A solo founder building SaaS faces a specific set of risks:

- Jumping from raw idea to implementation without evidence.
- Treating AI-generated output as authoritative product decisions.
- Losing design rationale and rejected options over time.
- Scope-creeping because every idea feels urgent.
- Confusing AI capability with human product judgment.
- Skipping architecture and infrastructure planning until it is too late.

This framework provides structure, not bureaucracy. Each artifact has a clear purpose. Each phase requires Owner decision before progression. Each role has defined authority boundaries.

## Current implemented state

As of Phase 1N-B, PNPD OS has:

| Capability | Status |
|-----------|--------|
| Prompting loop (AgentBridge) | ✅ Implemented |
| Research Discovery (VertiForge) | ✅ Implemented (docs, templates, schema, fixtures, validator) |
| Standalone Research Discovery artifact validation | ✅ Implemented |
| Schema/fixtures/validator infrastructure | ✅ Implemented (phases 0, 1B, 1C, 1F, 1H, 1M) |
| Orchestrator dry-run | ✅ Implemented |
| Runtime readiness reporting | ✅ Implemented (local read-only) |
| CI validation | ✅ Implemented (GitHub Actions) |
| Codex audit discipline | ✅ Defined and enforced |
| Owner authority gates | ✅ Enforced at every phase |
| Product delivery framework | ⬜ Docs/templates only (this phase) |
| Product delivery schemas/fixtures/validator | ⬜ Future phases 1N-C, 1N-D, 1N-E |
| Memory bridge (Obsidian ↔ GitHub) | ⬜ Not implemented |
| PNPD Teach / Skills Studio | ⬜ Parked — future side project |

## What remains future-only

The following capabilities are explicitly not implemented and not authorized at this phase:

- Obsidian API integration, automated note ingestion, or sync.
- GitHub issue/PR automation.
- Dispatch execution.
- Deployment.
- Daemon/watcher processes.
- Installer or packaging.
- Production-readiness certification.
- Cursor, Claude, or Windsurf integrations.
- PNPD Teach Studio web app or shadcn/ui work.
- MCP server tooling.
- Bootstrap/init tooling.
- Full contentHash recomputation.
- Runtime consumption linking.

## Authority model

PNPD OS operates on strict role separation. No role may perform the function of another role.

### Owner

The **Owner** is a human. The Owner holds:

- **Product judgment** — what to build, for whom, and why.
- **Risk acceptance** — which risks are acceptable at each phase.
- **Business context** — domain knowledge, customer relationships, market understanding.
- **Final decision authority** — to approve, reject, park, or redirect any artifact.
- **Merge/push/release/deployment authorization** — no automated or agent-driven progression.
- **Final responsibility** — accountability for all product and technical decisions.

The Owner is not optional. No artifact, agent, or process may substitute for Owner decision.

### Codex

Codex is an **AI auditor and technical reviewer**. Codex may:

- Perform formal audits of implementation artifacts.
- Review code, schemas, fixtures, and validators for correctness and safety.
- Act as a gate reviewer before Owner merge decisions.
- Provide evidence-based pass/reject/patch recommendations.
- Review governance boundaries and safety constraints.

Codex must NOT:

- Be the Owner.
- Make product or business decisions.
- Authorize merge, push, dispatch, or deployment.
- Certify production readiness.
- Replace human judgment or accountability.

**Codex is not the Owner.** Codex is a formal audit and review role. The Owner remains the final human decision-maker.

### Hermes

Hermes is the **design and scoping role**. Hermes:

- Produces phase designs and scope documents.
- Defines what a phase must and must not include.
- Identifies boundaries, risks, and owner decisions required.
- Does not implement, does not audit, does not authorize.

### DeepSeek

DeepSeek is the **implementation role**. DeepSeek:

- Executes approved phase designs.
- Creates files, code, schemas, fixtures, templates, and docs as specified.
- Runs local gates and reports results.
- Commits to feature branches but does not push or merge.
- Does not design scope, does not audit, does not authorize.

### AgentBridge

AgentBridge is the **state and handoff coordinator**. AgentBridge:

- Manages the prompting loop between human and agents.
- Routes turns to the correct role (Hermes, DeepSeek, Codex).
- Maintains thread state, handoff records, and phase tracking.
- Does not make product decisions, authorize progression, or override Owner gates.
- Does not approve, certify, or deploy.

### GitHub

GitHub serves as **agent-state memory**. GitHub stores:

- Commits, branches, and merge history.
- Schemas, fixtures, and validators.
- CI workflows and audit results.
- Phase documentation and templates.
- Implementation state and merge evidence.
- Machine-checkable artifacts.

### Obsidian

Obsidian serves as **human-facing memory** (conceptual — not automated). Obsidian stores:

- Messy thinking and raw ideas.
- Reading notes and research.
- Personal protocols and project reflections.
- Founder/product judgment.
- Private context and long-term Owner memory.
- Non-machine-validated notes.

Obsidian is not connected to PNPD by automation. The bridge between Obsidian and GitHub is the human Owner, who translates notes into structured PNPD artifacts when ready. No Obsidian sync, API, or tooling is implemented or planned for implementation in the current phase scope.

## Three-tier memory model

PNPD OS operates on three distinct memory layers:

```
Obsidian (human-facing memory)
    │
    │  Human Owner translates notes into structured artifacts
    │  when ready. No automation.
    │
    ▼
PNPD (governed translation / contract layer)
    │
    │  Research Discovery artifacts → Design Tree → PRD → Specs → Handoffs
    │  Schemas, fixtures, validators enforce machine-readable contracts.
    │  Every artifact carries governance boundary notices.
    │
    ▼
GitHub (agent-state memory)
    │
    │  Commits, branches, CI runs, audit records.
    │  Implementation history, merge evidence.
    │  Machine-checkable and auditable.
```

**Layer 1 — Obsidian (human-facing memory)**

- Purpose: Capture raw ideas, messy thinking, personal context.
- User: Human Owner only.
- Validation: None. No machine checking.
- Automation: None. No sync, no API.
- Visibility: Private.

**Layer 2 — PNPD (governed contracts)**

- Purpose: Translate human intent into structured, governed artifacts.
- User: Owner (decision), Hermes (design), DeepSeek (implementation), Codex (audit).
- Validation: Schemas, fixtures, validators, CI.
- Automation: Local validation only. No dispatch, no deployment.
- Visibility: Repository-tracked.

**Layer 3 — GitHub (agent-state memory)**

- Purpose: Store implementation state, audit evidence, and delivery records.
- User: All roles read; only authorized roles write (human merges).
- Validation: CI, Codex audits, Owner review.
- Automation: CI runs on push. No autonomous mutation.
- Visibility: Public or private per repository settings.

## Product delivery spine

The product delivery spine is the phase-by-phase path from raw idea to delivery readiness. Each phase requires Owner decision before progression. No phase may be skipped without explicit Owner authorization.

```
 1. Prompt / Raw Idea
 2. Grill / Interrogation
 3. Research Discovery
 4. Design Tree
 5. Prototype
    │
    ▼ Owner Decision Gate
    │
 6. PRD
 7. Product Spec
 8. Design Spec
 9. Architecture Spec
10. Infrastructure Plan
11. Test Plan
12. Implementation Handoff
    │
    ▼ Owner Decision Gate
    │
13. Implementation (DeepSeek branch)
14. Codex Audit
    │
    ▼ Owner Merge Decision Gate
    │
15. CI Evidence
16. Delivery Readiness
```

### Phase descriptions

| # | Phase | Purpose | Key Question |
|---|-------|---------|-------------|
| 1 | Prompt / Raw Idea | Capture the initial thought. | What sparked this? |
| 2 | Grill / Interrogation | Stress-test the idea before research. | Is this a real problem or just enthusiasm? |
| 3 | Research Discovery | Investigate evidence, uncertainty, and assumptions. | What do we actually know? |
| 4 | Design Tree | Map solution branches before committing to PRD. | What are the possible paths? |
| 5 | Prototype | Build the smallest testable artifact. | Does any branch survive contact with reality? |
| — | Owner Decision Gate | Human judgment on whether to proceed to PRD. | Should we commit resources to this? |
| 6 | PRD | Define what to build, for whom, and why. | What exactly are we building? |
| 7 | Product Spec | Define functional requirements and behavior. | What must it do and not do? |
| 8 | Design Spec | Define UX, UI, and interaction requirements. | How should it look and feel? |
| 9 | Architecture Spec | Define system design and technical boundaries. | How should it be built? |
| 10 | Infrastructure Plan | Define hosting, deployment, scaling, and observability. | How should it run? |
| 11 | Test Plan | Define testing strategy and acceptance gates. | How will we know it works? |
| 12 | Implementation Handoff | Create agent-ready scoped implementation plan. | What exactly should DeepSeek build? |
| — | Owner Decision Gate | Human judgment on whether to proceed to implementation. | Should we build this now? |
| 13 | Implementation | DeepSeek builds on a feature branch. | Implementation per handoff. |
| 14 | Codex Audit | Formal audit of implementation against specs. | Does the implementation match the contract? |
| — | Owner Merge Decision Gate | Human judgment on whether to merge. | Is this ready to ship? |
| 15 | CI Evidence | Automated checks produce audit trail. | What does the machine say? |
| 16 | Delivery Readiness | Final assessment of readiness. | Is this deliverable? |

### Spine principles

1. **No phase may authorize the next phase.** Only the Owner authorizes progression.
2. **No artifact authorizes implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification.** Every artifact carries explicit governance boundary language.
3. **Design before build.** Design Tree before PRD. Architecture before implementation.
4. **Evidence before commitment.** Research Discovery before Design Tree. Prototype before full build.
5. **Human decision at every gate.** No automated progression. No agent-as-Owner.
6. **Explicit non-goals at every phase.** What is out of scope must be stated as clearly as what is in scope.

## Pre-PRD Design Tree

The Design Tree is a required structure that sits between Research Discovery and PRD. It prevents premature PRD creation by forcing the Owner to understand the full solution space before selecting a path.

### Why the Design Tree exists

A common failure mode is writing a PRD for the first solution that comes to mind, without exploring alternatives, rejecting dead ends, or testing assumptions. The Design Tree forces:

- Explicit mapping of solution branches.
- Assumption articulation per branch.
- Prototype ideas per branch.
- Invalidation criteria per branch.
- Explicit rejection of branches with rationale.
- Owner selection of the branch to pursue.
- Clear PRD scope recommendation.

### Design Tree outputs

| Output | Purpose |
|--------|---------|
| Solution branch map | All plausible solution paths identified |
| Assumptions per branch | What must be true for each branch to work |
| Prototype ideas | Smallest test per branch |
| Invalidation criteria | What evidence would kill each branch |
| Rejected branches | Branches explicitly rejected with rationale |
| Selected branch | The branch the Owner chooses to pursue |
| PRD scope recommendation | What the PRD should cover |
| Explicit non-scope | What the PRD must not cover |

### How it links Research Discovery to PRD

```
Research Discovery          Design Tree               PRD
    │                           │                      │
    │  "Here is what we         │  "Here are the       │  "Here is exactly
    │   know and what           │   possible paths.    │   what we are building,
    │   we don't know."         │   This is the one    │   for whom, and why."
    │                           │   we're choosing."   │
```

Research Discovery feeds evidence into the Design Tree. The Design Tree produces a selected branch. The selected branch becomes the scope boundary for the PRD. No PRD is written until the Design Tree is complete and the Owner has made a branch selection.

## Parked idea protocol

Active work must not be disrupted by every good idea. The parked idea protocol captures strong ideas without losing the stream of current work.

### Protocol rules

1. Any idea that arrives while active scope is in progress must be **parked**, not started.
2. Every parked idea must have:
   - A unique idea ID.
   - A status (always `parked` initially).
   - A parked date.
   - A return condition (what must be true before it can be revived).
   - A required prior phase (what must be complete before it can start).
   - A do-not-start list (what must not be built as part of this idea).
   - An Owner note explaining why it matters.
3. Parked ideas may only be revived by explicit Owner decision.
4. Parked ideas do not generate branches, issues, or tasks.
5. Parked ideas do not block active scope.

### Example: PNPD Teach / Skills Studio

| Field | Value |
|-------|-------|
| Idea ID | `parked-pnpd-teach` |
| Status | `parked` |
| Parked date | `2026-06-16` |
| Return condition | Core PNPD OS loop is stable, product delivery framework is validated, Owner decides to revive |
| Required prior phase | Phase 1N (Product Delivery Framework) complete |
| Do-not-start list | shadcn/ui web app, generative UI browser, skills studio web wrapper, MCP tooling, Obsidian sync |
| Why it matters | Governed learning and skill-building is a natural extension of PNPD governance principles |
| Owner note | Parked as a future side project. Must not distract from core PNPD OS delivery. |

## Relationship to VertiForge / Research Discovery

The Product Delivery Framework extends Research Discovery, not replaces it. Research Discovery answers "should we investigate this problem?" The Product Delivery Framework answers "how do we build and deliver a solution?"

Research Discovery feeds evidence into the Design Tree. The Design Tree feeds into PRD. PRD feeds into Product Spec, Architecture Spec, and Implementation Handoff.

All Research Discovery governance rules remain in force:

- Research Discovery artifacts do not authorize implementation.
- Research Discovery artifacts require human Owner decision.
- Research Discovery schemas, fixtures, and validators continue to operate.
- No artifact may bypass Codex audit gates where applicable.

## Relationship to PNPD Teach / Skills Studio

PNPD Teach / Skills Studio is a **parked future side project**. It is not being designed or implemented in the current phase scope. It is mentioned here only as an explicit example of the parked idea protocol.

When and if it is revived, it will follow the same Product Delivery Framework, starting with its own Research Discovery, Design Tree, PRD, and Owner decisions.

## Scope boundaries

### What is in scope for the Product Delivery Framework

- Docs and templates explaining the PNPD memory model, authority model, and delivery spine.
- Fillable templates for each delivery phase artifact.
- Future schemas, fixtures, and validators (phases 1N-C through 1N-E).
- Future capability map and README updates (phase 1N-F).
- Human Owner decision at every phase gate.

### What is explicitly out of scope

The following are **not** part of the Product Delivery Framework and must not be implemented, designed, or claimed as PNPD capabilities at this time:

- Obsidian API integration, automated note ingestion, or sync.
- GitHub issue/PR automation.
- Dispatch execution.
- Deployment.
- Daemon/watcher processes.
- Installer or packaging.
- Production-readiness certification.
- Cursor, Claude, or Windsurf integrations.
- PNPD Teach Studio web app.
- shadcn/ui or generative UI browser work.
- MCP server tooling.
- Bootstrap/init tooling.
- Full contentHash recomputation.
- Runtime consumption linking.
- Making Codex the Owner.
- Relaxing any authority gate.
- Any artifact that claims to authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification.

## Future phase split

The Product Delivery Framework is implemented across multiple phases. Phase 1N-B delivers docs and templates only.

| Phase | Name | Deliverable | Status |
|-------|------|------------|--------|
| 1N-A | Memory/Owner/Product Delivery Framework Design | Hermes design and scoping | ✅ Complete |
| 1N-B | Product Delivery Docs and Templates | Framework doc, 13–15 fillable templates | ⬜ Current |
| 1N-C | Product Delivery Schemas and Fixtures | JSON Schema per artifact, positive/negative fixtures | ⬜ Future |
| 1N-D | Product Delivery Validator | Validator integration into `pnpd-validate-schemas.mjs` | ⬜ Future |
| 1N-E | Standalone Artifact Validation | `--product-delivery-artifact <path>` flag | ⬜ Future |
| 1N-F | Capability Map and README Updates | Update `current-capability-map.md` and `README.md` | ⬜ Future |

### Phase dependency rules

- Phase 1N-C must not begin until 1N-B is complete and Owner-approved.
- Phase 1N-D must not begin until 1N-C is complete and Owner-approved.
- Phase 1N-E must not begin until 1N-D is complete and Owner-approved.
- Phase 1N-F must not begin until 1N-E is complete and Owner-approved.
- No phase may skip Owner decision.
- No phase may expand scope beyond its defined boundary.

## Governance boundary notice

This framework document does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification. Owner decision and Codex audit gates remain required where applicable.

## Related documents

- `docs/vertiforge/research-discovery-mode.md` — VertiForge Research Discovery methodology
- `docs/pnpd/current-capability-map.md` — Current PNPD OS capability inventory
- `docs/pnpd/orchestrator-loop.md` — Orchestrator loop design
- `docs/pnpd/orchestrator-state-machine.md` — Orchestrator state machine
- `docs/pnpd/orchestrator-safety-gates.md` — Safety gate design
- `templates/research/` — Research Discovery fillable templates
- `.pnpd/research-discovery.schema.json` — Research Discovery JSON Schema

## Changelog

| Date | Change | Phase |
|------|--------|-------|
| 2026-06-16 | Initial framework document | 1N-B |
