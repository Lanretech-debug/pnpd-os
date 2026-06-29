# PNPD Unified Execution Plan And Taste Gate Design

## Current Status

Status: docs-only governance design
Canonical status: advisory until Codex audit, merge, push, CI success, and Owner/GitHub verification
Runtime authority: none
Schema authority: none
Validator authority: none
CI authority: none
Generated state authority: none
AgentBridge authority: none

## Purpose

This document defines the Unified Execution Plan (UEP) model and Taste Gate model for PNPD Phase 1P-M. It establishes how execution-ready governance artifacts are structured, how Definition of Done is bound to evidence, how agent autonomy is bounded, what triggers a check-in, what constitutes exit criteria, and how taste-sensitive decisions are gated behind human authority. This is a design document only. It does not implement runtime behavior, schema changes, validator additions, fixtures, CI enforcement, or any other executable surface.

## Baseline

Windows route verdict: CODEX_PNPD_WINDOWS_PROJECT_CREATION_PASS_NO_INSTALL_REQUIRED
Base commit: 537a0609630019c88db23adf9f66d18cb0063b14
origin/main: 537a0609630019c88db23adf9f66d18cb0063b14
lab/main: 537a0609630019c88db23adf9f66d18cb0063b14
Node: v22.22.2
npm: 10.9.7
Install policy: no install required
Known untracked files: none
Generated PNPD state: none

## Problem Statement

PNPD execution phases lack a unified governance artifact that binds purpose, baseline, scope, allowed files, forbidden files, definition of done, validation gates, check-in triggers, exit criteria, and authority boundaries into a single execution contract. Without this, agents drift, scope expands, taste decisions are delegated to LLMs without human review, and phases produce incomplete or uncertifiable output. A Unified Execution Plan model is needed to prevent requirement, design, and implementation drift. A Taste Gate model is needed to ensure qualitative judgments remain under human authority.

## Unified Execution Plan Model

A Unified Execution Plan (UEP) is a single execution-ready governance artifact binding the following fields:

- purpose
- baseline
- decision context
- in-scope work
- out-of-scope work
- allowed files
- forbidden files
- implementation approach
- Definition of Done
- anti-criteria
- validation gates
- check-in triggers
- exit criteria
- Codex audit criteria
- GitHub verification criteria
- Owner approval requirements

### Core Principle

Everything not explicitly allowed by the UEP is forbidden.

### Drift Prevention

The UEP must prevent requirement, design, and implementation drift. Each field serves as a bounded constraint. Any deviation from the UEP during execution requires a new UEP or an Owner-approved scope amendment. Agents may not infer permission from absence. Silence is prohibition.

## Definition Of Done Model

The Definition of Done (DoD) is explicit, evidence-bound, and testable where possible. It is not a checklist — it is tied to acceptance evidence. The Definition of Done includes primary acceptance criteria, secondary acceptance criteria, non-goals, anti-criteria, and acceptance evidence.

### Primary Acceptance Criteria

The primary acceptance criteria are conditions that must be met for the phase to be considered complete. Each criterion must reference observable evidence (file content, gate output, commit SHA).

### Secondary Acceptance Criteria

Conditions that should be met but do not block completion. They are tracked for follow-up phases.

### Non-Goals

Work that is explicitly not part of this phase. Stated to prevent scope creep.

### Anti-Criteria

Conditions that, if present, invalidate completion regardless of primary criteria.

### Required Gates

Validation gates that must pass before completion can be claimed.

### Required Human Review Points

The required human review points include decisions or artifacts that require Owner or designated human review.

### Required Codex Audit Points

The required Codex audit points include artifacts or state that require Codex audit before canonicalization.

### Final Canonicalization Requirements

The final canonicalization requirements are the conditions required for the phase to achieve canonical status (see Canonicalization Boundary).

## Agent Autonomy Threshold

### Continue Conditions

An agent may continue execution only when **all** of the following are true:

- work remains inside approved scope
- allowed file set remains sufficient
- forbidden surfaces remain untouched
- no new requirement emerges
- no ambiguous product/taste decision appears
- gates remain passable
- no authority boundary is crossed

### Stop Conditions

An agent must stop execution when **any** of the following occurs:

- scope expands
- file surface expands
- evidence is missing
- design decision changes
- TASTE_REQUIRED appears
- readiness/deployment/certification language appears
- generated runtime state appears
- registry write appears
- AgentBridge authority appears
- runtime/schema/validator/CI work appears without approval

## Check-In Trigger Model

Check-in triggers define conditions under which an agent must report status and await guidance before continuing.

### Required Check-In Triggers

- baseline moved
- local repo dirty unexpectedly
- untracked files appear
- generated runtime state appears
- allowed file list is insufficient
- implementation requires new file type
- new dependency is needed
- lockfile policy changes
- test or validation gate fails
- requirement conflict appears
- UX/product/taste decision appears
- roadmap/backlog authority would be implied
- deployment/readiness/certification language appears
- old phase labels conflict with current canonical baseline

### Clarification: Generated Runtime State

Generated runtime state means any of the following appear unexpectedly:

- .pnpd/product-delivery-registry
- .pnpd/ledger
- .pnpd/handoffs
- .pnpd/locks

Tracked .pnpd schemas are not generated runtime state. Tracked .pnpd schemas (tracked files under .pnpd/ that are part of the committed repository structure) are not generated runtime state.

## Exit Criteria Model

Exit criteria are split into local completion and canonical completion.

### Local Exit Criteria

Local completion requires **all** of the following:

- exact allowed file set honored
- forbidden file surface untouched
- required phrases present
- negative guardrails absent
- all validation gates pass
- state gates pass
- no untracked files remain
- full 40-character commit SHA exists
- push status clear
- merge status clear
- Codex audit pending or complete
- canonicalization boundary stated

### Canonical Completion

Canonical completion requires later verification:
- Codex audit
- GitHub/App verification
- Owner approval

## Taste Gate Model

### Definition of Taste

Taste is the ability to consistently make high-quality qualitative judgments where no objective metric exists.

### Taste-Sensitive Work

Taste-sensitive work includes:

- product feel
- brand quality
- naming
- UX judgment
- interface polish
- editorial tone
- narrative quality
- positioning
- trust perception
- "does this feel right?" decisions
- any decision where copying the result is easy but originating the judgment is hard

### Required Label

TASTE_REQUIRED

### Core Rule

LLMs can propose, compare, explain, and imitate taste-sensitive options, but LLMs must not self-certify taste.

### Permitted Actions When TASTE_REQUIRED Appears

Agents may:
- generate options
- compare trade-offs
- reference approved exemplars
- identify inconsistencies

### Forbidden Actions When TASTE_REQUIRED Appears

Agents may not:
- finalize the taste decision
- claim taste approval
- substitute fake metrics
- self-certify taste

### Taste Authority

Taste approval must come from Owner or designated human taste authority.

## Work Archetype Routing Preparation

Archetypes are work modes, not job titles.

### Archetype Labels

- ARCHETYPE_PROTOTYPER
- ARCHETYPE_BUILDER
- ARCHETYPE_SWEEPER
- ARCHETYPE_GROWER
- ARCHETYPE_MAINTAINER

### Archetype Definitions

- Prototyper: creates many new directions and options
- Builder: turns approved direction into production-grade delivery
- Sweeper: simplifies, removes, cleans, optimizes
- Grower: improves adoption, feedback loops, and product-market fit
- Maintainer: secures, stabilizes, scales, and preserves quality

### Future UEP Field

A future UEP field is reserved:

- archetype

Default value: UNSET

### Hard Boundary

This phase reserves the field only. It does not implement routing, validation, runtime behavior, schema, or CI. This phase does not implement validation. This phase does not implement schema. This phase does not implement CI. Archetype routing is a future implementation concern.

## Authority Boundary

### Authority Model

- Owner = final authority
- Hermes = design
- DeepSeek/OpenCode = implementation
- Codex = audit/finalization
- GitHub/App = remote evidence verification

### Responsibilities

- Hermes may design and recommend. Hermes does not implement this phase.
- DeepSeek/OpenCode implements only within Owner-approved scope.
- Codex audits and finalizes.
- Owner approves taste, scope expansion, baseline changes, and canonicalization.

## Forbidden Implementation

This phase does not authorize:

- runtime implementation
- schema changes
- validator additions
- fixtures
- CI enforcement
- registry writes
- generated state
- AgentBridge authority
- idea generator
- template parser
- template converter
- package changes
- lockfile changes
- dependency installation policy changes
- plugin manifest
- skills directory
- deployment
- dispatch
- certification
- production readiness claim
- adoption readiness claim
- roadmap commitment claim

## Drift Risk Register

| Risk | Description | Mitigation |
|------|-------------|------------|
| Scope creep | Agent implements work outside approved scope | UEP explicit in-scope/out-of-scope; stop conditions enforced |
| File surface expansion | Agent creates or modifies files outside allowed set | Allowed/forbidden file lists; git diff --name-only gates |
| Taste bypass | Agent self-certifies taste decisions | Taste Gate model; TASTE_REQUIRED label; human authority required |
| Generated state | Agent creates runtime state unexpectedly | State gates; explicit generated state definition |
| Baseline drift | Commit history diverges from canonical baseline | Check-in triggers on baseline moved |
| Authority confusion | Agent assumes authority it does not have | Authority boundary section; explicit denial of authorities |
| Silent requirement change | New requirement appears without UEP update | Check-in triggers; stop conditions |
| Premature canonical claim | Phase marked canonical without all required steps | Canonicalization boundary; 8-step canonicalization chain |

## Future Implementation Gates

### File Scope Check

```bash
git diff --name-only
```

Expected only:
docs/pnpd/unified-execution-plan-and-taste-gate-design.md

### Forbidden Drift Checks

```bash
git diff -- .pnpd
git diff -- scripts
git diff -- templates
git diff -- tests/fixtures
git diff -- package.json
git diff -- package-lock.json
git diff -- npm-shrinkwrap.json
git diff -- .github/workflows
git diff -- README.md
git diff -- memory
```

Each must produce no output.

### Validation Gates

```bash
git diff --check
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
```

### State Gates

```bash
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks

find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
```

Expected: no output.

## Future DeepSeek Report Contract

### Expected Verdict After Successful Implementation

DEEPSEEK_PHASE_1P_M_UNIFIED_EXECUTION_PLAN_AND_TASTE_GATE_COMMITTED_AMBER_NOT_CODEX_AUDITED

### Required Final Report Fields

1. Verdict
2. Branch
3. Base commit
4. Commit
5. Files changed
6. Unified execution plan model result
7. Definition of Done result
8. Autonomy threshold result
9. Check-in trigger result
10. Exit criteria result
11. Taste Gate result
12. Work archetype preparation result
13. Authority boundary result
14. Forbidden implementation result
15. Drift risk result
16. Gates run
17. State result
18. Known untracked files
19. Push status
20. Merge status
21. Canonicalization boundary
22. Next safest step

### Blocked Verdicts

- DEEPSEEK_PHASE_1P_M_BLOCKED_BASELINE_MOVED — baseline commit changed since UEP was defined
- DEEPSEEK_PHASE_1P_M_BLOCKED_FILE_SCOPE_DRIFT — files outside allowed set were created or modified
- DEEPSEEK_PHASE_1P_M_BLOCKED_GATES_FAILED — one or more validation or state gates failed
- DEEPSEEK_PHASE_1P_M_BLOCKED_GENERATED_STATE — generated runtime state appeared unexpectedly

## Canonicalization Boundary

Phase 1P-M becomes canonical only after:

1. Hermes design
2. Owner approval
3. DeepSeek/OpenCode implementation
4. Codex audit/finalize
5. fast-forward merge to main
6. push to origin
7. remote CI success
8. Owner/GitHub App verification

Until then, this document is advisory only.

## Next Safest Step

After successful DeepSeek implementation:
- Do not push.
- Do not merge.
- Do not claim canonical status.

The next step is Codex audit/finalize from the committed branch.
