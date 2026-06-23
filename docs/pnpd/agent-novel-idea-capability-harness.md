# PNPD Agent Novel Idea Capability Harness

## 1. Purpose

This is a docs-only controlled agent novelty harness. It lets agents propose novel idea candidates within governed boundaries. It does not authorize implementation. It does not create roadmap commitments. It does not create delivery evidence. It does not create registry evidence. It does not implement idea generation. It does not implement agent runtime behavior. It does not alter AgentBridge authority. It does not add schema. It does not add validators. It does not add fixtures. It does not add CI. It does not add dependencies. It does not create generated idea records. It does not create generated PNPD state. It does not claim production readiness. It does not claim adoption readiness.

This harness is advisory only. It is not implementation authority. It is Owner-gated and Codex-gated. Every novel idea candidate must be routed through proper governance before it may become anything more than a documented candidate.

## 2. Baseline

```
Baseline verdict: PHASE_1N_F_PRODUCT_TEMPLATE_CONVERSION_BOUNDARY_PUSHED_CI_GREEN
Baseline commit: 3f6a3710880221feeb7dacc34977a2857673a7d9
Remote CI run: 28003334129
Remote CI conclusion: success
```

Phase 1N-F is canonical. Phase 1Q remains stopped. 1R-A is not a Phase 1Q continuation. 1R-A is not a template conversion continuation. 1R-A is not idea generator implementation. 1R-A is not agent runtime implementation. 1R-A is not schema implementation. 1R-A is not validator implementation. 1R-A is not CI implementation.

## 3. Prior Phase Inheritance

This document inherits the following governance positions.

From Phase 1N-C:

- external or agent retrospection is input, not authority
- implementation must wait for governed design

From Phase 1N-D:

- drafting aids are not governed artifacts by themselves

From Phase 1N-E:

- mapping is advisory and non-executing

From Phase 1N-F:

- conversion boundary is docs-only
- no-parser strategy is preferred
- manual/human review remains required
- no implementation may proceed without Owner-authorized Hermes design and Codex audit

Applied to novel ideas:

- ideas are candidates, not decisions
- ideas are advisory, not authority
- ideas are not roadmap commitments
- ideas are not delivery evidence
- ideas do not authorize implementation
- ideas do not authorize registry writes
- ideas do not authorize CI changes
- ideas do not authorize schema changes
- ideas do not authorize validator changes
- ideas do not authorize runtime changes
- ideas do not authorize AgentBridge authority changes

## 4. Novel Idea Definition

A novel idea candidate is a structured proposal that introduces a potentially useful capability, policy, product direction, governance control, artifact type, workflow, validation surface, or user-facing improvement that is not already canonical in PNPD-OS.

A novel idea candidate must include:

- problem or opportunity
- baseline reference
- proposed idea
- why it is novel
- why it is useful
- expected beneficiary
- evidence available
- assumptions
- rejected alternatives
- drift risks
- minimum next safe step
- required authority path

A novel idea candidate is not:

- implementation
- roadmap commitment
- design approval
- production readiness evidence
- delivery evidence
- registry evidence
- CI evidence
- deployment authorization
- user commitment
- revenue claim
- market proof

Use of the exact phrase `novel idea candidate` signals that the proposal is governed by this harness and has no implementation authority.

## 5. Non-Novel And Forbidden Idea Types

The following do not count as a novel idea candidate:

- repeating already canonical decisions
- restating existing docs
- renaming existing phases without new value
- implementation disguised as idea
- schema changes disguised as idea
- validator changes disguised as idea
- CI changes disguised as idea
- runtime changes disguised as idea
- deployment or dispatch suggestions without governance basis
- product readiness claims without evidence
- adoption readiness claims without evidence
- external report suggestions treated as authority
- agent preference treated as roadmap priority

These are forbidden because they bypass governance under a false label of novelty. A proposal that duplicates existing work, restates settled decisions, or smuggles implementation through the idea harness must be rejected as non-novel.

## 6. Novel Idea Candidate Lifecycle

Every novel idea candidate follows this lifecycle:

1. Observed signal — a user request, gap, limitation, or external report is noticed
2. Candidate idea — the idea is articulated as a structured proposal
3. Evidence-attached candidate — evidence is disclosed and attached
4. Drift-reviewed candidate — drift risks are assessed against governance boundaries
5. Routed candidate — the candidate is assigned a route (reject, backlog, or escalate)
6. Owner-reviewed candidate — the Owner reviews and decides whether to proceed
7. Hermes design candidate — if implementation is possible, Hermes designs the governed approach
8. DeepSeek implementation candidate — only after Owner-approved Hermes design
9. Codex audit candidate — only after DeepSeek local implementation report
10. Canonicalized or rejected — after merge, push, remote CI success, and Owner/GitHub verification

Key constraints:

- most ideas should stop before implementation
- rejection is a valid outcome
- backlog capture is not roadmap commitment
- no idea may skip Owner review
- no idea may skip Hermes design if implementation is possible
- no idea may skip Codex audit before canonicalization

Hermes design is required before any implementation. DeepSeek implementation is permitted only after Owner-authorized Hermes design. GitHub verification is required before canonical status is claimed.

## 7. Idea Evidence Requirements

Every novel idea candidate must disclose:

- exact baseline commit or canonical status at time of proposal
- source of idea (user request, observed gap, agent observation, external report)
- user request or observed gap description
- current limitation that the idea addresses
- evidence supporting usefulness
- evidence missing (explicit gaps)
- assumptions (explicit, enumerated)
- dependency on future phases (if any)
- risks if implemented too early
- rollback or stop condition

If evidence is weak, the idea must be classified as speculative. Speculative candidates may be backlogged but must not proceed beyond routing without stronger evidence. No idea may be routed to Hermes design without disclosed evidence of usefulness. No evidence claim substitutes for Owner review.

## 8. Novelty Scoring Model

This scoring model is advisory only. No score authorizes implementation. Scores inform routing recommendations but do not bind Owner, Hermes, or Codex decisions.

Scoring dimensions:

| Dimension | Description |
|---|---|
| novelty | How new is the idea relative to canonical PNPD-OS? |
| usefulness | How much value does the idea offer to PNPD-OS users? |
| alignment | How well does the idea align with PNPD-OS purpose? |
| evidence strength | How strong is the evidence supporting the idea? |
| implementation risk | What risk does implementation introduce? |
| governance risk | What risk does the idea pose to PNPD governance? |
| drift risk | What risk of scope or authority drift does the idea carry? |
| reversibility | How easily can the idea be rolled back if harmful? |
| timing readiness | Is now the right time for this idea? |
| dependency complexity | How many dependencies does the idea require? |

Score scale:

```
0 = absent
1 = weak
2 = moderate
3 = strong
```

Scoring constraints:

- no score authorizes implementation
- high novelty with low evidence must not proceed
- high usefulness with high governance risk must be routed to Hermes first
- low reversibility requires stronger Owner and Codex gates
- timing readiness must be explicit — a score of 1 or lower on timing readiness should pause routing until conditions change

## 9. Drift And Authority Boundary

Agents operate within strict boundaries when handling novel ideas:

- agents may propose ideas
- agents may not authorize ideas
- agents may not implement ideas
- agents may not convert ideas into roadmap commitments
- agents may not create schemas from ideas
- agents may not create validators from ideas
- agents may not create fixtures from ideas
- agents may not create CI changes from ideas
- agents may not create runtime changes from ideas
- agents may not create registry writes from ideas
- agents may not create generated state from ideas
- agents may not claim an idea is canonical
- agents may not claim product readiness
- agents may not claim adoption readiness
- agents may not treat user enthusiasm as governance approval unless explicit authorization is given

The authority path for any novel idea is exactly:

```
Owner -> Hermes design -> DeepSeek implementation -> Codex audit -> GitHub verification -> canonical status
```

No step may be skipped. No role may substitute for another. No agent may short-circuit this path. This harness is not implementation authority. No registry write is authorized by this harness. Novel idea candidates are advisory only and carry no authority to mutate PNPD-OS state.

## 10. Routing Model

Every novel idea candidate must be assigned to one route:

**A. Reject now**
For ideas that duplicate existing work, create unsafe drift, lack evidence, or violate governance. Rejected ideas are preserved only when useful (see Section 11).

**B. Backlog only**
For ideas with potential but weak timing or unclear value. Backlogged ideas are not roadmap commitments. They are stored for future reconsideration when evidence or timing improves.

**C. Hermes design candidate**
For ideas that may affect policy, architecture, schema, validation, runtime, registry, CI, or agent authority. Hermes design is required before any implementation consideration. The Owner must authorize the Hermes design request.

**D. DeepSeek implementation candidate**
Only after Owner-approved Hermes design. DeepSeek implements the governed design as docs or code per the Hermes specification. DeepSeek does not canonicalize.

**E. Codex audit candidate**
Only after DeepSeek local implementation report. Codex audits the implementation against the Hermes design. Codex may finalize if green. Codex does not invent scope during audit.

**F. Canonical candidate**
Only after merge, push, remote CI success, and Owner/GitHub verification. Canonical status requires all prior gates to be satisfied.

No route bypasses Owner review. No route bypasses Hermes design when implementation is possible. No route bypasses Codex audit before canonicalization.

## 11. Rejection And Preservation Policy

Rejected ideas should be preserved only when useful. Not every rejected idea deserves a permanent record. Preservation is warranted when the idea reveals a genuine gap, exposes a tempting but dangerous path, or may become viable under different conditions.

A rejected idea record should include:

- idea summary
- why tempting
- why rejected
- evidence gap
- drift risk
- possible later trigger
- authority required to reopen

Rejected ideas must not become:

- roadmap commitments
- implementation backlog by default
- delivery evidence
- product requirements
- user promises
- agent obligations

Reopening a rejected idea requires Owner authorization referencing the original rejection record and demonstrating that the rejection conditions have materially changed. No agent may reopen a rejected idea without Owner approval.

## 12. Harness Output Model

When a novel idea candidate is fully documented, it should follow this output model. This output model is docs-only in 1R-A. No schema is created in 1R-A. No validator is created in 1R-A. No fixture is created in 1R-A. No generated candidate records are created in 1R-A.

Required fields for a future novel idea candidate output:

1. Candidate ID — unique identifier within the harness
2. Title — short summary of the idea
3. Baseline — canonical baseline at time of proposal
4. Source signal — user request, gap, limitation, or external report
5. Problem or opportunity — what the idea addresses
6. Proposed idea — what is being proposed
7. Novelty claim — why this is novel in PNPD-OS
8. Usefulness claim — why this would be useful
9. Beneficiary — who benefits from this idea
10. Evidence available — what evidence supports the idea
11. Evidence missing — what evidence is absent
12. Assumptions — explicit assumptions underlying the idea
13. Rejected alternatives — what was considered and rejected
14. Drift risks — governance and scope drift risks
15. Novelty score — advisory score (0-3)
16. Usefulness score — advisory score (0-3)
17. Evidence score — advisory score (0-3)
18. Governance risk score — advisory score (0-3)
19. Reversibility score — advisory score (0-3)
20. Timing readiness — explicit readiness assessment
21. Recommended route — A through F per the routing model
22. Required authority path — the full authority chain required
23. Minimum next safe step — the smallest possible next action
24. Stop condition — when the idea should be abandoned or paused

This output model produces no generated idea records. It is a template, not a schema. It is advisory, not authoritative. Future phases may implement structured capture, but 1R-A does not.

## 13. Agent Role Boundaries

Each PNPD role interacts with the novelty harness within defined boundaries:

**Hermes**
- designs novelty harnesses and idea policies
- reviews ideas routed as Hermes design candidates
- produces governed design specifications
- does not implement

**DeepSeek**
- may implement approved docs/code only after Owner-approved Hermes design
- produces implementation reports for Codex audit
- does not canonicalize

**Codex**
- audits implementation against Hermes design
- finalizes if green
- does not invent scope during audit

**Owner**
- approves direction
- chooses whether to proceed, reject, or backlog each candidate
- authorizes Hermes design requests
- authorizes reopening of rejected ideas

**GitHub App**
- verifies remote state and CI
- provides GitHub verification evidence
- does not design, implement, or audit

**AgentBridge**
- may later route signals to the harness
- has no authority in 1R-A
- may not approve, reject, or route ideas in this phase

**Skeptic**
- may later critique ideas for drift, overreach, or weak evidence
- does not approve or reject by itself
- Skeptic critique is input to Owner review, not authority

## 14. Forbidden Implementation In This Phase

This phase is docs-only. The following are forbidden in 1R-A:

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
- validator scripts
- parser code
- converter code
- idea generator code
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

No generated idea records are created. No registry write is authorized. This harness is advisory only. It is not implementation authority.

## 15. Rejected Ideas

The following ideas were considered and rejected for this phase:

**1. Implement idea generator now**
- Why tempting: automating idea capture would reduce manual proposal effort
- Why rejected now: idea generation is implementation, not docs-only governance. A generator would create generated idea records, which 1R-A forbids.
- Later phase: may be considered after Owner-authorized Hermes design for a generator phase

**2. Add idea schema now**
- Why tempting: a schema would enable structured validation of idea candidates
- Why rejected now: schema creation is implementation. 1R-A is docs-only. No schema changes are authorized.
- Later phase: may be considered after Owner-authorized Hermes design for an idea schema phase

**3. Add idea validator now**
- Why tempting: a validator would enforce candidate completeness
- Why rejected now: validator creation is implementation. 1R-A is docs-only. No validator changes are authorized.
- Later phase: may follow schema creation in a governed validator phase

**4. Add idea fixtures now**
- Why tempting: example candidates would demonstrate the harness
- Why rejected now: fixtures are implementation artifacts. 1R-A forbids fixture creation.
- Later phase: may follow schema and validator phases

**5. Add CI checks for ideas now**
- Why tempting: CI enforcement would catch invalid candidates
- Why rejected now: CI changes are forbidden in 1R-A. CI enforcement implies implementation authority this harness does not have.
- Later phase: may be considered after schema and validator phases, with Owner authorization

**6. Add AgentBridge routing now**
- Why tempting: AgentBridge could automatically route signals to the harness
- Why rejected now: AgentBridge has no authority in 1R-A. Routing is Owner-gated, not agent-automated.
- Later phase: may be considered when AgentBridge governance is designed and authorized

**7. Give agents authority to open roadmap items automatically**
- Why tempting: reducing Owner overhead for routine ideas
- Why rejected now: roadmap commitment requires Owner authority. Agent-automated roadmap changes bypass governance.
- Later phase: permanently rejected. Agent-automated roadmap commitment violates PNPD governance.

**8. Treat high novelty score as implementation approval**
- Why tempting: scoring could streamline routing
- Why rejected now: scores are advisory only. No score authorizes implementation. High novelty with low evidence must not proceed.
- Later phase: permanently rejected. Automated approval violates Owner-gated and Codex-gated governance.

**9. Treat user enthusiasm as canonical authorization**
- Why tempting: user demand signals usefulness
- Why rejected now: user enthusiasm is input, not authority. Governance requires Owner approval, not popularity.
- Later phase: permanently rejected. Enthusiasm is evidence, not authorization.

**10. Treat external reports as authority**
- Why tempting: external reports provide third-party validation
- Why rejected now: external reports are input, not authority. PNPD governance is internal and Owner-gated.
- Later phase: permanently rejected. External authority violates PNPD governance model.

**11. Create generated idea records now**
- Why tempting: storing candidates as structured records would enable tracking
- Why rejected now: 1R-A forbids generated idea records. No generated PNPD state is created in this phase.
- Later phase: may be considered after schema and validator phases, with Owner authorization

**12. Store idea candidates in `.pnpd` now**
- Why tempting: `.pnpd` is the natural location for PNPD state
- Why rejected now: `.pnpd` edits are forbidden in 1R-A. No registry write is authorized.
- Later phase: may be considered after registry governance is designed for idea storage

**13. Let Skeptic approve or reject ideas alone**
- Why tempting: Skeptic role already critiques for drift
- Why rejected now: Skeptic critique is input, not authority. Only Owner may approve or reject.
- Later phase: permanently rejected. Approval authority rests with Owner alone.

**14. Claim product readiness from ideas**
- Why tempting: strong ideas suggest product maturity
- Why rejected now: ideas are candidates, not delivery evidence. Product readiness requires governed evidence, not proposals.
- Later phase: permanently rejected. Idea proposals are never product readiness evidence.

## 16. Drift Risk Register

The following drift risks are identified for the novelty harness:

| # | Risk | Mitigation |
|---|---|---|
| 1 | Novelty harness mistaken for implementation authority | This document explicitly states it is not implementation authority. |
| 2 | Idea score mistaken for approval | Scoring is advisory only. No score authorizes implementation. |
| 3 | Backlog mistaken for roadmap commitment | Backlogged ideas are not commitments. Roadmap requires separate Owner authorization. |
| 4 | Rejected idea mistaken for planned feature | Rejection records explicitly state the idea is rejected, not deferred. |
| 5 | External report authority creep | External reports are input, not authority. This boundary is explicit. |
| 6 | User enthusiasm authority creep | User enthusiasm is evidence, not governance approval. |
| 7 | AgentBridge authority creep | AgentBridge has no authority in 1R-A. Future routing requires governed design. |
| 8 | Generated state creep | No generated idea records. No generated PNPD state. |
| 9 | Schema creep | No schema is created in 1R-A. Future schema requires Hermes design. |
| 10 | Validator creep | No validator is created in 1R-A. Future validators require Hermes design. |
| 11 | Fixture creep | No fixtures are created in 1R-A. |
| 12 | CI drift | No CI changes are made in 1R-A. |
| 13 | Runtime drift | No runtime changes are made in 1R-A. |
| 14 | Registry authority creep | No registry write is authorized. Registry interaction requires separate governance. |
| 15 | Product readiness overclaim | No production readiness claim is made. |
| 16 | Adoption readiness overclaim | No adoption readiness claim is made. |
| 17 | Phase 1Q reopening | 1R-A is not a Phase 1Q continuation. 1Q remains stopped. |
| 18 | Template conversion reopening | 1R-A is not a template conversion continuation. 1N-F is canonical. |
| 19 | Agent autonomy creep | Agents propose; they do not authorize, implement, or canonicalize. |

## 17. Gates And Non-Goals

This phase:

- produces exactly one docs-only file: `docs/pnpd/agent-novel-idea-capability-harness.md`
- makes no `.pnpd` edits
- makes no scripts edits
- makes no template edits
- makes no fixture edits
- makes no package edits
- makes no CI edits
- implements no schema
- implements no validator
- implements no idea generator
- implements no agent runtime
- makes no AgentBridge authority changes
- creates no generated idea records
- creates no generated PNPD state
- authorizes no registry write
- makes no roadmap commitment claims
- makes no adoption readiness claim
- makes no production readiness claim

This harness is a controlled agent novelty document. It is advisory only. It is not implementation authority. It is Owner-gated and Codex-gated. It provides a governed boundary within which PNPD agents may propose novel ideas without creating authority drift, implementation risk, or governance bypass.
