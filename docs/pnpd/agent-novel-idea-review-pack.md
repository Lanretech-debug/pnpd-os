# PNPD Agent Novel Idea Review Pack

## 1. Purpose

This review pack consolidates related Phase 1R agent-novelty governance controls into one docs-only reference document. It helps Owner, Hermes, DeepSeek, Codex, and future contributors evaluate real novel idea candidates before escalation.

This review pack is:

- docs-only
- advisory only
- non-executable
- non-authoritative
- non-mutating
- not implementation authority
- Owner-gated
- Codex-gated

This review pack does not implement idea generation, create generated idea records, create schemas, create validators, create fixtures, add CI, add dependencies, create registry state, alter AgentBridge authority, reopen Phase 1Q, reopen template conversion, claim adoption readiness, or claim production readiness.

## 2. Baseline

```text
Baseline verdict: PHASE_1R_B_AGENT_NOVEL_IDEA_CANDIDATE_EXAMPLE_PUSHED_CI_GREEN
Baseline commit: 384d732fb6d3864b6cd9285a4af6fec6d82fef3a
Remote CI run: 28081761758
Remote CI conclusion: success
```

Phase 1R-B is canonical. Phase 1Q remains stopped.

1R Batch 1 is not a Phase 1Q continuation. 1R Batch 1 is not a template conversion continuation. 1R Batch 1 is not idea generator implementation. 1R Batch 1 is not schema implementation. 1R Batch 1 is not validator implementation. 1R Batch 1 is not fixture implementation. 1R Batch 1 is not CI implementation. 1R Batch 1 is not runtime implementation.

## 3. Prior Phase Inheritance

Phase 1R-A established:

- novel ideas are candidates, not authority
- novel ideas are advisory only
- ideas are not roadmap commitments
- ideas are not delivery evidence
- ideas do not authorize implementation
- ideas do not authorize registry writes
- ideas do not authorize schema, validator, runtime, CI, or AgentBridge changes
- idea scores are advisory only
- no generated idea records exist
- canonicalization requires Owner, Hermes, DeepSeek, Codex, and GitHub verification

Phase 1R-B established:

- a synthetic example can demonstrate the harness
- the example is not a generated idea record
- the example is not roadmap authority
- the example is not delivery evidence
- the example is not registry evidence
- the example is not implementation approval
- the example is not an active backlog item
- the example is not a roadmap item

## 4. Why Batch Mode Is Required

- microphase delivery is safe but too slow
- related docs-only governance controls should be batched when they share the same risk class
- batching reduces repeated Hermes, DeepSeek, Codex, and CI cycles
- batching must not weaken governance
- batching must not mix unrelated risk surfaces
- batching must not combine docs-only work with schema, validator, runtime, CI, registry, or AgentBridge authority changes
- Phase 1R Batch 1 is appropriate because all included controls share the same risk class: agent novelty governance

## 5. Batch Mode Rule

```text
Batch Mode Rule
```

A docs-only batch may combine multiple related governance controls when all controls share:

- the same risk class
- the same allowed file list
- the same forbidden implementation surface
- the same audit strategy
- the same final CI verification
- the same canonicalization boundary

A batch must not hide implementation inside docs. A batch must not create generated state. A batch must not create roadmap authority. A batch must not create active backlog state. A batch must not weaken Owner, Hermes, DeepSeek, Codex, or GitHub verification gates. If the risk class expands, the batch must stop and split.

## 6. Review Checklist

The review checklist evaluates every novel idea candidate before escalation. Each item includes what to inspect, a pass condition, and a fail condition.

### review checklist

| # | Item | What to Inspect | Pass Condition | Fail Condition |
|---|------|-----------------|----------------|----------------|
| 1 | Baseline reference | Idea references a canonical baseline verdict and commit | Baseline is stated, verifiable, and matches current canonical state | Baseline is missing, stale, or unverifiable |
| 2 | Problem or opportunity clarity | The problem or opportunity the idea addresses | Problem is stated concretely with scope and context | Problem is vague, unbounded, or unverifiable |
| 3 | Novelty claim | What is new relative to the canonical baseline | Novelty is specific, falsifiable, and distinguishable from existing capabilities | Novelty is unstated, tautological, or indistinguishable from existing state |
| 4 | Usefulness claim | Who benefits, how, and why now | Beneficiary and benefit are concrete and separable from novelty | Usefulness is asserted without beneficiary, mechanism, or timing |
| 5 | Beneficiary | The agent, role, or system that gains from the idea | Beneficiary is named and the benefit mechanism is described | Beneficiary is abstract, circular, or conflated with the proposer |
| 6 | Evidence available | Existing support for the idea (data, usage patterns, external sources) | Evidence is listed with provenance and grade | No evidence is provided or all evidence is self-referential |
| 7 | Evidence missing | Gaps that would be needed before implementation | Missing evidence is acknowledged explicitly | All evidence is claimed sufficient without gap analysis |
| 8 | Assumptions | Explicit assumptions the idea depends on | Assumptions are listed and each is tagged as testable or not | Assumptions are hidden, implicit, or presented as facts |
| 9 | Rejected alternatives | Alternatives considered and why rejected | At least one credible alternative is named and rejected with reasoning | No alternatives considered or all dismissed without reasoning |
| 10 | Drift risks | Ways the idea could expand scope or mutate during implementation | Drift risks are named with triggers and mitigations | No drift risks acknowledged or all risks dismissed as impossible |
| 11 | Reversibility | Whether the idea can be rolled back if it proves harmful | Reversibility is assessed: reversible, partially reversible, or irreversible | Reversibility is unaddressed or assumed without analysis |
| 12 | Timing readiness | Why now, not earlier or later | Timing rationale references current baseline state and dependencies | Timing is asserted without baseline or dependency check |
| 13 | Recommended route | Which routing decision applies (see Section 7) | Route is recommended with rationale referencing checklist outcomes | Route is recommended without rationale or contradicts checklist findings |
| 14 | Stop condition | Which stop condition would halt this idea (see Section 9) | At least one applicable stop condition is identified | No stop condition acknowledged |
| 15 | Required authority path | Full authority chain needed if escalated | Authority path is stated: Owner → Hermes → DeepSeek → Codex → GitHub | Authority path is incomplete or skips a required gate |

## 7. Routing Decision Table

The routing decision table determines the disposition of a novel idea candidate after review checklist evaluation.

### routing decision table

| Route | When to Use | What It Permits | What It Does Not Permit | Required Next Authority |
|-------|-------------|-----------------|------------------------|-------------------------|
| A. Reject now | Idea fails multiple checklist items with no credible remediation path | Documenting the rejection reason in review notes | Any further escalation, backlog entry, or implementation | None (terminal) |
| B. Backlog consideration only | Idea passes basic checklist but timing, evidence, or dependencies are insufficient for design | Adding the idea to a consideration list for future re-evaluation | Creating active backlog state, roadmap items, or implementation work | Owner for re-evaluation timing |
| C. Hermes design candidate | Idea passes checklist, has sufficient evidence, and needs structured design before implementation | Hermes produces a design document evaluating feasibility, risk, and integration | DeepSeek implementation, Codex audit, or canonicalization | Owner approves Hermes design |
| D. DeepSeek implementation candidate | Owner-approved Hermes design exists and implementation is authorized | DeepSeek produces a local implementation report with verification evidence | Codex audit, canonicalization, or registry writes | Owner-approved Hermes design |
| E. Codex audit candidate | DeepSeek local implementation report exists and is ready for audit | Codex audits the implementation against the Hermes design and baseline | Canonicalization or merge | DeepSeek local implementation report |
| F. Canonical candidate | Merge, push, remote CI success, and Owner/GitHub verification are all complete | Canonical status in the baseline | None beyond (terminal state) | Owner and GitHub verification |

Backlog consideration only does not create active backlog state. Backlog consideration only does not create a backlog entry. Backlog consideration only does not create a roadmap item. DeepSeek implementation requires Owner-approved Hermes design. Codex audit requires DeepSeek local implementation report. Canonical candidate requires merge, push, remote CI success, and Owner/GitHub verification.

## 8. Evidence Grading Guide

### evidence grading guide

All evidence supporting a novel idea candidate must be graded on the following scale:

```text
0 = no evidence
1 = weak / inferential / synthetic
2 = moderate / internally supported
3 = strong / externally or operationally supported
```

Rules:

- weak evidence cannot justify implementation
- synthetic evidence must be labeled synthetic
- user enthusiasm is not governance authorization
- Owner process authorization is not evidence of usefulness
- market validation must not be claimed without source
- production impact must not be claimed without evidence
- adoption impact must not be claimed without evidence
- if evidence is invented, the review must stop

Evidence grading applies to each evidence item independently. An idea with only grade 0 or grade 1 evidence across all items must not proceed beyond Backlog consideration only. An idea with at least one grade 2 item and no invented evidence may be considered for Hermes design. Grade 3 evidence strengthens but does not replace the authority path.

## 9. Stop Condition Checklist

### stop condition checklist

| # | Stop Trigger | Reason | Next Safe Action |
|---|-------------|--------|------------------|
| 1 | Baseline moved | Review decisions based on a stale baseline may be invalid | Re-anchor to current canonical baseline; restart review |
| 2 | Scope expands beyond the approved docs-only review pack | Scope creep violates the batch boundary | Stop; split into separate batch or phase |
| 3 | Evidence is invented | Fabricated evidence corrupts the governance process | Stop; discard the candidate; log the fabrication |
| 4 | Active backlog state is implied | Backlog consideration only does not create active backlog state | Clarify that no active backlog entry is created |
| 5 | Roadmap authority is implied | Review pack is advisory only; it is not roadmap authority | Reaffirm non-authority boundary |
| 6 | Generated records are created | 1R Batch 1 is docs-only; no generated records are permitted | Delete generated records; return to docs-only scope |
| 7 | `.pnpd` state is created | No `.pnpd` state is permitted in this phase | Delete `.pnpd` state; return to docs-only scope |
| 8 | Schema work appears | Schema implementation is forbidden in this phase | Remove schema work; defer to a later authorized phase |
| 9 | Validator work appears | Validator implementation is forbidden in this phase | Remove validator work; defer to a later authorized phase |
| 10 | Fixture work appears | Fixture implementation is forbidden in this phase | Remove fixture work; defer to a later authorized phase |
| 11 | Runtime work appears | Runtime implementation is forbidden in this phase | Remove runtime work; defer to a later authorized phase |
| 12 | CI work appears | CI implementation is forbidden in this phase | Remove CI work; defer to a later authorized phase |
| 13 | Registry work appears | Registry implementation is forbidden in this phase | Remove registry work; defer to a later authorized phase |
| 14 | AgentBridge authority appears | AgentBridge authority changes are forbidden in this phase | Remove AgentBridge authority changes; defer to a later authorized phase |
| 15 | Readiness is claimed | The review pack does not authorize readiness claims | Remove readiness claim; reaffirm non-authority boundary |
| 16 | Phase 1Q is reopened | Phase 1Q remains stopped | Stop; reaffirm Phase 1Q closure |
| 17 | Template conversion is reopened | Template conversion is stopped | Stop; reaffirm template conversion closure |
| 18 | Implementation is hidden inside documentation | Docs must not conceal implementation behavior | Extract or remove hidden implementation; return to docs-only |

## 10. Escalation Path

```text
Owner -> Hermes design -> DeepSeek implementation -> Codex audit -> GitHub verification -> canonical status
```

- no route skips Owner
- no route skips Hermes when implementation is possible
- no route skips DeepSeek when implementation is required
- no route skips Codex before canonicalization
- no route becomes canonical without GitHub verification
- no score, checklist, or routing table replaces authority

## 11. Non-Authority Boundary

The review pack is:

- not implementation authority
- not roadmap commitment
- not delivery evidence
- not registry evidence
- not generated state
- not active backlog state
- not a schema
- not a validator
- not a fixture
- not runtime behavior
- not CI enforcement
- not AgentBridge authority

The review pack does not authorize:

- implementation
- registry writes
- schema changes
- validator changes
- fixture changes
- runtime changes
- CI changes
- AgentBridge authority changes
- roadmap commitments
- production readiness claims
- adoption readiness claims

## 12. Forbidden Implementation In This Phase

The following are forbidden in Phase 1R Batch 1:

- edits to `.pnpd`
- edits to scripts
- edits to templates
- edits to tests/fixtures
- edits to package.json
- edits to package-lock.json
- edits to `.github/workflows`
- edits to README
- edits to current capability map
- edits to prior 1N-C decision pack
- edits to prior 1N-D template contract
- edits to prior 1N-E mapping document
- edits to prior 1N-F conversion boundary
- edits to prior 1R-A harness
- edits to prior 1R-B example
- validator scripts
- parser code
- converter code
- idea generator code
- idea schema
- idea validator
- idea fixtures
- agent runtime changes
- AgentBridge authority changes
- generated idea records
- generated JSON artifacts
- registry writer changes
- generated PNPD state
- GitHub/API mutation
- CI enforcement
- deployment
- dispatch
- certification
- production readiness claims
- adoption readiness claims
- roadmap commitment claims

## 13. Rejected Ideas

The following ideas were considered and explicitly rejected for Phase 1R Batch 1.

| # | Rejected Idea | Why Tempting | Why Rejected Now | Later Phase, If Any |
|---|---------------|-------------|------------------|---------------------|
| 1 | Continue one microphase per small control | Maximizes granularity and isolation | Too slow; batching same-risk-class docs-only controls does not weaken governance | Not applicable (batch mode replaces this) |
| 2 | Implement idea generator now | Would produce novelty candidates automatically | Idea generation requires schema, validator, and registry foundations not yet authorized | Future phase after registry, schema, and validator are canonical |
| 3 | Create idea schema now | Would formalize idea structure | Schema work is forbidden in docs-only phases; requires Owner design authorization | Future phase after Owner-authorized design |
| 4 | Create idea validator now | Would validate ideas against schema | Validator requires schema; schema is not authorized in this phase | Future phase after schema is canonical |
| 5 | Create idea fixtures now | Would provide test data for validation | Fixtures require schema and validator; neither is authorized in this phase | Future phase after schema and validator are canonical |
| 6 | Create generated idea records now | Would populate the system with real ideas | Generated records require registry state; registry state is forbidden in this phase | Future phase after registry is canonical |
| 7 | Store candidates in `.pnpd` now | Would persist review state | `.pnpd` state creation is forbidden in docs-only phases | Future phase after registry write authorization |
| 8 | Add AgentBridge routing now | Would enable automatic agent dispatch | AgentBridge authority changes are forbidden in docs-only phases; requires design, implementation, and audit | Future phase after full authority path |
| 9 | Add CI checks now | Would enforce review checklist in CI | CI enforcement is forbidden in docs-only phases; CI gates require canonicalized checks | Future phase after review pack is canonical |
| 10 | Treat review checklist as roadmap authority | Would accelerate planning | Review pack is advisory only and must not create roadmap authority | Not applicable (review pack is permanently non-authoritative) |
| 11 | Treat backlog consideration as active backlog | Would simplify tracking | Backlog consideration only does not create active backlog state; active backlog requires separate authorization | Future phase after backlog governance is designed |
| 12 | Claim readiness from review pack | Would signal progress | Readiness claims are forbidden; the review pack does not authorize production or adoption readiness | Not applicable (readiness requires full authority path) |

## 14. Drift Risk Register

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Review pack mistaken for implementation authority | Non-authority boundary (Section 11) explicitly denies implementation authority; phrase "not implementation authority" is canonical |
| 2 | Routing table mistaken for automatic routing | Routing table is advisory only; all routing requires Owner decision |
| 3 | Evidence grading mistaken for approval | Evidence grading is guidance; no grade replaces the authority path |
| 4 | Batch operating rule mistaken for hidden implementation | Batch Mode Rule (Section 5) explicitly forbids hiding implementation inside docs |
| 5 | Stop checklist mistaken for stop-all-work | Stop conditions are specific to review pack scope; they do not halt unrelated work |
| 6 | Generated state creep | Forbidden Implementation (Section 12) explicitly forbids generated PNPD state and `.pnpd` edits |
| 7 | Schema creep | Forbidden Implementation explicitly forbids schema work; stop condition #8 triggers if schema work appears |
| 8 | Validator creep | Forbidden Implementation explicitly forbids validator work; stop condition #9 triggers if validator work appears |
| 9 | Fixture creep | Forbidden Implementation explicitly forbids fixture work; stop condition #10 triggers if fixture work appears |
| 10 | CI drift | Forbidden Implementation explicitly forbids CI enforcement; stop condition #12 triggers if CI work appears |
| 11 | Runtime drift | Forbidden Implementation explicitly forbids runtime work; stop condition #11 triggers if runtime work appears |
| 12 | Registry drift | Forbidden Implementation explicitly forbids registry work; stop condition #13 triggers if registry work appears |
| 13 | AgentBridge authority creep | Forbidden Implementation explicitly forbids AgentBridge authority changes; stop condition #14 triggers |
| 14 | Roadmap commitment claim | Non-authority boundary explicitly denies roadmap commitment authorization |
| 15 | Product readiness overclaim | Non-authority boundary explicitly denies production readiness claims |
| 16 | Adoption readiness overclaim | Non-authority boundary explicitly denies adoption readiness claims |
| 17 | Phase 1Q reopening | Stop condition #16 triggers if Phase 1Q is reopened; baseline states Phase 1Q remains stopped |
| 18 | Template conversion reopening | Stop condition #17 triggers if template conversion is reopened |
| 19 | Microphase mode reverting | Batch Mode Rule documents why batching is appropriate for same-risk-class controls; reversion to microphase would be inefficient without governance gain |
| 20 | Batch mode hiding unrelated scope | Batch must not mix unrelated risk surfaces; if risk class expands, batch must stop and split |

## 15. Gates And Non-Goals

This Phase 1R Batch 1 delivery is bounded by the following gates and non-goals:

- exact one-file docs-only scope
- no `.pnpd` edits
- no scripts edits
- no template edits
- no fixture edits
- no package edits
- no CI edits
- no schema implementation
- no validator implementation
- no fixture implementation
- no idea generator implementation
- no agent runtime implementation
- no AgentBridge authority changes
- no generated idea records
- no generated PNPD state
- no registry write authorization
- no active backlog state
- no roadmap authority
- no delivery evidence
- no registry evidence
- no adoption readiness claim
- no production readiness claim
