# PNPD-OS-MANIFEST.md — Project Governance Manifest

This repository operates under the **Project Normalisation and Product Delivery Operating System (PNPD-OS)**.

PNPD-OS is a reusable governance-and-delivery framework that bridges technical governance with product progress. It provides:

- A product development lifecycle (P0-P7) parallel to the repo lifecycle
- Project entry state handlers for common starting conditions
- A universal normalisation checklist
- Anti-cycle controls that detect when agents are running in place
- Governed skill evolution for durable learning
- Clear agent role separation
- A product strategy advisory layer (VertiForge) for market analysis, opportunity scoring, and business model design

Every agent must know the current product phase and next milestone before starting work. See `docs/governance/PHASE_MODEL.md`.

---

## PNPD AgentBridge

PNPD AgentBridge is the repo-local communication and state layer for PNPD-OS agent workflows. It defines how agents record handoffs, task state, audit requests, blocker logs, owner decisions, and post-merge verification queues.

AgentBridge is not an authority layer. It does not approve, certify, merge, deploy, audit, override agents, or replace this manifest. Authority remains with the Review & Audit Layer: Owner is final decision-maker, Codex is formal auditor, Hermes is verifier/router, and DeepSeek is implementer/self-check only.

Use `docs/agent-bridge/README.md` as the entry point whenever a task requires multi-agent handoff, task-state tracking, audit routing, blocker logging, owner decision logging, or post-merge verification.

The PNPD Orchestrator Loop may coordinate and recommend; it may not approve, merge, deploy, or bypass gates. Any scheduler, dispatch loop, external write integration, or agent-thread automation requires a separate owner-approved phase and must preserve the Review & Audit Layer authority chain.

---

## Agent Role Model

### Hermes (Orchestrator)

Hermes is the orchestrator, verifier, state truth checker, research synthesiser, product phase classifier, governance router, subagent coordinator, and anti-cycle monitor.

Hermes must verify before trusting. Hermes decides whether the next task belongs to: product discovery (P0-P2), product planning (P2-P3), implementation (P4), QA (P5), governance or docs, GitHub/repo normalisation, business validation (P6-P7), or release preparation (P5-P7).

### DeepSeek (Implementer)

DeepSeek is the implementation worker, docs/governance patcher, local execution worker, report writer, and smoke-test executor.

DeepSeek may implement scoped increments but must stay inside task boundaries.

### Codex (Auditor)

Codex is the final auditor, review lane, merge-readiness reviewer, code safety reviewer, and PR auditor.

Codex unavailability means: PENDING_CODEX_FINAL_AUDIT. Codex should not be the first planner — Codex audits the plan and implementation later.

### Owner

Owner is the product/business decision-maker, final merge approver, account/token provider, manual tester where needed, value judge, and business priority owner.

### VertiForge (Product Strategy Advisor)

VertiForge is a vertical SaaS strategy advisor (optional, task-triggered), product/business consulting specialist, market/competition/opportunity analyst, pricing/GTM/business model designer, fundraising narrative consultant, and anti-cycle product milestone advisor.

VertiForge is **advisory only** — it does not control implementation, Git, merge, or governance decisions. It must not fabricate market data or override compliance/safety constraints.

See `docs/vertiforge/README.md` for trigger conditions, analysis framework, and output modes.

### Generic/Unknown Agents

If an agent's role is unknown, it must default to READ_ONLY_VERIFY_AND_REPORT until assigned a scoped role.

---

## Capability Matrix

| Capability | Agent can do | Required safety rule | Escalation |
|------------|-------------|----------------------|------------|
| Read-only chat | Reason only | Must request evidence from file/git/GitHub | Hermes |
| File read | Inspect files | Cite exact paths; never display .env contents | Hermes |
| Shell | Run safe commands | No destructive commands; list first; verify before exec | Owner for destructive |
| Git inspect | Inspect branch/history/status | No mutation; report exact output | Hermes |
| Git commit | Stage/commit | No git add .; scoped files only; verify dirty tree first | Codex audit |
| Git push | Push branches | Verify remote/base first; never force push | Owner/Codex |
| GitHub inspect | View repo/PRs/branches | No mutation; gh API read-only endpoints | Hermes |
| GitHub mutate | Push/PR/settings | Verify remote/base; owner approval required | Owner/Codex |
| Browser | Smoke-test UI | Exact route/result evidence; separate SDK proof from browser proof | Report |
| Code edit | Patch files | Allowed files only; run tests after; no silent governance mix | Test gate + audit |
| Subagent spawn | Delegate tasks | Strict scope; verify output; never delegate meta-governance | Hermes |
| Memory/Notes | Update notes | Not repo authority; must link to repo evidence | Owner review |
| Product strategy | Assess market, opportunity, pricing, GTM, business model | Advisory only; no Git, implementation, merge, or governance authority; label assumptions clearly | Owner |

---

## Execution Gates

Every implementation lane SHALL follow the 12-gate execution pipeline defined in `docs/pnpd/unified-execution-plan-and-taste-gate-design.md`. The pipeline makes runtime verification mandatory before any audit, and branch cleanup mandatory before lane closure.

---

## Review & Audit Layer

PNPD-OS operates five distinct review and audit layers. Each layer has a different scope, authority, and escalation path.

**No layer may certify its own work. No layer may suppress, bypass, or silently weaken the layer above it.**

DeepSeek can review itself, but DeepSeek cannot certify itself.

### Layer 1 — DeepSeek Local Autoreview: Self-Check Only

DeepSeek may run autoreview as a local preflight self-check before every non-trivial commit. It exists to catch obvious quality, safety, scope, and drift issues early. It is not a formal audit.

### Layer 2 — Hermes Verification: Operational Truth

Hermes verifies operational truth — state, scope, and evidence verification.

### Layer 3 — Codex Pre-Merge Audit: Formal Audit Gate

Codex is the formal pre-merge auditor. Required before merging material changes to main.

### Layer 4 — Codex Post-Merge Audit: Retrospective Drift Check

Retrospective safety and drift check after merge. Mandatory for every merged lane. Risk level determines the depth of verification and evidence scrutiny only — it never determines whether verification occurs.

Required lifecycle:
MERGED
→ POST_MERGE_AUDIT_REQUESTED
→ POST_MERGE_VERIFIED
→ BRANCH_CLEANUP
→ CLOSED

### Layer 5 — Owner Final Decision

The owner is the final decision-maker. Agents may advise, verify, audit, or recommend — they may not override the owner.

### Review Authority Matrix

| Agent / Layer | Role | Can Do | Cannot Do |
| --- | --- | --- | --- |
| DeepSeek local autoreview | Self-check and preflight reviewer | Inspect local changes, run local autoreview, patch low-risk scoped issues, report unresolved findings | Certify merge readiness, approve own PR, bypass failed gates, override Hermes/Codex |
| Hermes verification | Operational truth verifier | Verify branch, scope, files, dirty tree, evidence, reports, and route tasks | Certify final merge readiness, approve merges, override Codex |
| Codex pre-merge audit | Formal audit gate | Audit full PR, review drift, safety, tests, governance consistency, and merge readiness | Approve without evidence, bypass its own findings, override owner |
| Codex post-merge audit | Retrospective drift check | Verify merged main, detect integration drift, recommend rollback or follow-up | Silently roll back, override owner, erase pre-merge caveats |
| Owner | Final decision-maker | Approve merge, accept or reject caveats, request more review, decide product/business priority | Be overridden by any agent or automated process |
| PNPD AgentBridge | Communication/state layer for handoffs and workflow state | Record handoffs, task state, audit queue entries, blocker records, owner decisions, and post-merge verification queue entries | Approve, certify, merge, deploy, audit, override agents, or replace AGENTS.md |
| PNPD Orchestrator Loop | Coordination/recommendation layer for repo inspection and handoff preparation | Inspect registered repo state, classify work, recommend next actions, and prepare dry-run handoff briefs | Approve, merge, deploy, bypass gates, grant authority, or satisfy owner/Codex review by itself |

---

## PNPD-OS Operating Principles

1. **No dirty-tree drift** — verify git status before every commit.
2. **No blind git add .** — stage only intended files; scoped commits only.
3. **One short-lived branch per coherent concern** — use feat/, fix/, docs/, chore/, experiment/ prefixes.
4. **Product/runtime work must not mix with governance/docs work** — separate worktrees required.
5. **Git and GitHub are operational truth** — git status overrides agent claims.
6. **Repo-local governance is agent authority** — AGENTS.md and docs/ are the law.
7. **External notes are human memory, not agent authority** — must link back to repo evidence.
8. **Chat transcript is context, not source of truth** — never cite chat as evidence.
9. **Secrets must never be printed or committed** — rg scan before every commit.
10. **Deprecated paths must not be used** — verified via forbidden-path search.
11. **Classify before changing** — dirty tree, branch, phase, risk classification first.
12. **Audit before rename** — naming auditor runs read-only first.
13. **Audit before deletion** — never delete in first pass; classify as ARCHIVE_CANDIDATE first.
14. **Verify before push** — Hermes checks branch, tree, remote before any push.
15. **PR before merge** — Codex audit gate required.
16. **Codex or equivalent auditor reviews before merge/main** — PENDING_CODEX_FINAL_AUDIT if unavailable.
17. **Hermes or equivalent orchestrator verifies state/capability truth** — always verify, never trust.
18. **Owner controls final merge and product decisions** — no agent may merge to main.
19. **Agents improve skills only through governed skill evolution** — Evidence → Lesson → Rule → Verification → Audit → Merge.
20. **No agent may silently rewrite its own authority rules** — AGENTS.md changes require Hermes verification + owner approval.
21. **Product development must not be replaced by endless governance work** — anti-cycle breaker.
22. **Every project must have a current phase, current milestone, and next valuable increment** — see PHASE_MODEL.md.

---

## Product Development Phase Model

Every project must have a documented product phase.

| Phase | Name | Purpose | Required Artifact |
|-------|------|---------|-------------------|
| P0 | Idea Capture | Capture business/product idea, target user, problem, risk | docs/product/IDEA_BRIEF.md |
| P1 | Validation Plan | Define who needs it, pain point, willingness to pay | docs/product/VALIDATION_PLAN.md |
| P2 | MVP Definition | Define MVP user journey, must-haves, exclusions, success criteria | docs/product/MVP_SCOPE.md |
| P3 | Architecture & Data Model | Define stack, routes, entities, auth, safety, service boundaries | docs/architecture/ARCHITECTURE.md, DATA_MODEL.md |
| P4 | Incremental Build | Build one vertical slice at a time; test each slice | docs/development/IMPLEMENTATION_PLAN.md |
| P5 | QA & Release Readiness | Browser smoke, tests, security scan, deployment checklist | docs/release/RELEASE_READINESS.md |
| P6 | User Feedback / Validation | Collect real feedback, measure usage, verify fit | docs/product/FEEDBACK_LOG.md |
| P7 | Iteration / Scale | Improve, refactor, add analytics, refine business model | docs/product/ROADMAP.md |

Phase transitions require Hermes verification + owner approval.

See `docs/governance/PHASE_MODEL.md` for the full phase model with anti-cycle controls.

---

## VertiForge Advisory Role

| Phase | VertiForge Mode | VertiForge Contribution |
|-------|-----------------|------------------------|
| P0 — Idea Capture | Opportunity Scan (1), Idea Validation (2) | Market sizing, competitor landscape, opportunity scoring |
| P1 — Validation Plan | Validation (2), Competitor Teardown (4), Risk Review (9) | Validation plan structure, competitive whitespace analysis, risk register |
| P2 — MVP Definition | Workflow Teardown (3), MVP Scope (5), Pricing (7) | MVP scope definition, workflow maps, pricing strategy |
| P6 — User Feedback | Validation (2), Risk Review (9) | Business hypothesis review, validation analysis |
| P7 — Iteration/Scale | Roadmap (10), Market Entry (11), AI-Native Review (12) | Product roadmap sequencing, market expansion strategy, AI opportunity analysis |

See `docs/vertiforge/vertiforge-framework.md` for the full 12 output modes.

---

## Anti-Cycle Controls

### Cycle Symptoms

- Repeated governance changes without product milestone progress (2+ consecutive governance-only commits)
- Repeated audits of same issue after zero-hit evidence
- Repeated remote/base checks after verification
- Repeated "setup" tasks without implementation
- Repeated report-only commits with no new decision
- SDK proof overclaimed as browser proof
- No current product milestone documented

### Classification

| Classification | Criteria | Required Response |
|----------------|----------|-------------------|
| CYCLE_RISK_LOW | Single governance/doc task after product milestone | Continue; flag if next is also governance |
| CYCLE_RISK_MEDIUM | Two consecutive governance/doc tasks | Hermes asks: "Does this unlock a product milestone?" |
| CYCLE_RISK_HIGH | Three+ consecutive governance/doc tasks; no product milestone | Stop non-essential governance; force product milestone creation |
| CYCLE_CONFIRMED | Same task repeated 3+ times with zero new evidence; no progress for 7+ days | Escalate to owner |

### Cycle Breaker Questions

When two or more consecutive governance/setup tasks occur, Hermes must ask:
1. What product/business milestone does this unlock?
2. Is this governance task blocking implementation?
3. Is there already evidence?
4. Can this wait until after the next product increment?
5. What is the smallest valuable product step now?

When three or more consecutive governance/setup tasks occur without product progress, Hermes should call VertiForge to define the next product milestone.

---

## Delivery Format

Every task must finish with:
- Files changed
- Tests run
- Safety implications
- Naming implications
- Git/repo implications
- Known gaps
- Next recommended action

---

*PNPD-OS is a governance framework. It defines how agents coordinate — it does not execute code, merge PRs, deploy software, or replace human decision-making.*
