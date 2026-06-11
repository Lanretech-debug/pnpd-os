# Product Development Phase Model

Every project under PNPD-OS must have a documented product phase. The current phase is recorded in `docs/PRODUCT_PHASE.md`.

## Phase Definitions

| Phase | Name | Purpose | Required Artifact |
|-------|------|---------|-------------------|
| P0 | Idea Capture | Capture business/product idea, target user, problem, risk | `docs/product/IDEA_BRIEF.md` |
| P1 | Validation Plan | Define who needs it, pain point, willingness to pay | `docs/product/VALIDATION_PLAN.md` |
| P2 | MVP Definition | Define MVP user journey, must-haves, exclusions, success criteria | `docs/product/MVP_SCOPE.md` |
| P3 | Architecture & Data Model | Define stack, routes, entities, auth, safety, service boundaries | `docs/architecture/ARCHITECTURE.md`, `DATA_MODEL.md` |
| P4 | Incremental Build | Build one vertical slice at a time; test each slice | `docs/development/IMPLEMENTATION_PLAN.md` |
| P5 | QA & Release Readiness | Browser smoke, tests, security scan, deployment checklist | `docs/release/RELEASE_READINESS.md` |
| P6 | User Feedback / Validation | Collect real feedback, measure usage, verify fit | `docs/product/FEEDBACK_LOG.md` |
| P7 | Iteration / Scale | Improve, refactor, add analytics, refine business model | `docs/product/ROADMAP.md` |

## Phase Transitions

Phase transitions require:

1. Hermes verification (state, branch, clean worktree)
2. Owner approval

No agent may advance the product phase without owner approval.

## Anti-Cycle Controls

When two or more consecutive governance/setup tasks occur without product phase progress, Hermes must ask:

1. What product/business milestone does this unlock?
2. Is this governance task blocking implementation?
3. Is there already evidence?
4. Can this wait until after the next product increment?
5. What is the smallest valuable product step now?

| Classification | Criteria | Required Response |
|----------------|----------|-------------------|
| CYCLE_RISK_LOW | Single governance/doc task after product milestone | Continue; flag if next is also governance |
| CYCLE_RISK_MEDIUM | Two consecutive governance/doc tasks | Hermes asks: "Does this unlock a product milestone?" |
| CYCLE_RISK_HIGH | Three+ consecutive governance/doc tasks; no product milestone | Stop non-essential governance; force product milestone creation |
| CYCLE_CONFIRMED | Same task repeated 3+ times with zero new evidence; no progress for 7+ days | Escalate to owner |

---

*See `docs/vertiforge/vertiforge-framework.md` for strategy advisory across phases P0-P7.*
