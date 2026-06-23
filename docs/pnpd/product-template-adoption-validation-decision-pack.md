# PNPD Product Template Adoption And Validation Decision Pack

## 1. Purpose

This is a docs-only decision pack. It responds to an independent repository retrospection that raised concerns about product template validation and onboarding friction. The retrospection is useful input but not authoritative.

This document:

- classifies the template-to-schema validation concern
- separates real adoption friction from scope creep
- defines the template contract question
- recommends future validation unlock criteria
- prevents premature validator sprawl
- provides a safe contributor and adoption boundary
- explicitly states that no validator implementation happens in this phase

This phase does not implement validators. It does not change templates. It does not add fixtures. It does not add parser dependencies. It does not change CI. It does not reopen Phase 1Q.

## 2. Baseline

```
Baseline verdict: PHASE_1Q_I_SKEPTIC_BUG_FORECAST_GOVERNANCE_PACK_PUSHED_CI_GREEN
Baseline commit: 6a91769bb909e4c6380a6f5f85ae4f9b786f22d9
Remote CI run: 28000083546
Remote CI conclusion: success
```

Phase 1Q-I is canonical. Phase 1Q should remain stopped unless Owner explicitly chooses a controlled unlock through Hermes design. This 1N-C work is not a Phase 1Q continuation. It belongs to the product delivery and template adoption area under the 1N product delivery track.

## 3. Phase 1Q Stop Check

Phase 1Q is complete and must not be reopened by this phase:

- Do not add more bug forecast examples.
- Do not add more bug forecast negative examples.
- Do not add more bug forecast validator phases.
- Do not alter the bug forecast governance pack.
- Do not alter the Skeptic governance pack.
- Do not reopen Phase 1Q unless a real defect is discovered in the schema, fixtures, or validation behavior.

This 1N-C work concerns product templates and adoption surface only. It is scoped to the product delivery track (1N), not the bug forecast track (1Q).

## 4. Retrospection Claim Assessment

The independent agent raised six claims. This section assesses each.

### Claim 1: template-to-schema validation gap exists

**Classification: partially accurate.** The product templates are Markdown documents that map conceptually to product delivery schemas (PRD, Product Spec, Architecture Spec, Implementation Handoff). A formal template-to-schema validation mechanism does not exist today. However, the templates are drafting aids, not machine-validated artifacts. The "gap" exists only if the contract changes.

### Claim 2: onboarding documentation may be dense

**Classification: partially accurate.** PNPD-OS documentation is substantial and follows a phased delivery model. Contributors unfamiliar with the framework may experience friction. Documentation density is a legitimate adoption concern but is not a defect.

### Claim 3: contributor path friction exists

**Classification: speculative.** The independent agent did not test a contributor path. The claim is plausible but unverified. Without a concrete contributor attempting onboarding, this remains speculative.

### Claim 4: 14 validator scripts should be added

**Classification: rejected as premature scope creep.** There is no template contract, no validation semantics design, and no owner decision on whether templates should be machine-validated at all. Adding 14 validators before answering the template contract question would create technical debt with no clear purpose.

### Claim 5: valid/invalid fixtures should be added for each template

**Classification: rejected as premature.** A fixture strategy cannot be designed before the template contract and validation semantics are defined. Adding fixtures now would pre-answer design questions that belong to Hermes and Owner.

### Claim 6: Markdown validation should be integrated into `scripts/pnpd-validate-schemas.mjs`

**Classification: rejected as premature governance risk.** The main validator script is the canonical PNPD schema validator. Integrating Markdown template validation into it would couple the JSON schema validation surface to template drafting concerns. This coupling could create validator sprawl, complicate the validator's contract, and blur the boundary between machine-validated JSON artifacts and human drafting aids.

## 5. Pain Point Classification

| Pain point | Classification |
|---|---|
| template-to-schema validation gap | adoption friction and roadmap candidate |
| onboarding documentation density | adoption friction |
| contributor path friction | unverified roadmap candidate |
| 14 validator scripts proposal | scope creep |
| template fixture proposal | scope creep |
| validator integration proposal | governance concern |

The external report is useful discovery input, not authority. It identifies potential adoption friction but proposes solutions that exceed current governance boundaries. The solutions belong to future design phases, not immediate implementation.

## 6. Implementation Risk Assessment

Immediate implementation of template validators would be unsafe for these reasons:

- **No template contract exists.** The Owner has not decided whether Markdown templates are drafting aids, machine-validated artifacts, or source material for future JSON artifacts. Implementing validators before this decision pre-answers a governance question.
- **Markdown templates may be human drafting aids only.** The current framework treats templates as structured guides for human authors. Adding machine validation would change the contract without explicit authorization.
- **Parser semantics are undefined.** Validating Markdown against JSON schemas would require either a Markdown parser or a structured extraction layer. Neither is designed.
- **Valid/invalid Markdown fixture model is undefined.** JSON fixture patterns (valid/invalid directories, schema instance validation) do not directly translate to Markdown documents.
- **14 validators would create maintenance burden.** Each validator would need fixture directories, test coverage, and ongoing maintenance. Without a clear purpose, this is technical debt.
- **Integrating Markdown validation into the main validator could create validator sprawl.** The main validator is a schema validator. Adding template validation would blur its contract.
- **Adding a Markdown parser dependency would violate minimal dependency posture unless designed.** PNPD-OS currently has no runtime parser dependencies. Adding one requires a Hermes design and dependency policy review.
- **CI checks would be premature.** CI enforcement of template validation before the contract is decided would create blocking friction for template authors with no clear benefit.

Conclusion: use a docs-only decision pack first. Reserve implementation for a dedicated future phase after the template contract is Owner-approved.

## 7. Product Template Contract Question

The central question this decision pack surfaces is:

Are Markdown product templates intended to be:

- **A.** Human drafting aids only (current default stance).
- **B.** Directly machine-validated artifacts.
- **C.** Source material for future JSON artifacts.
- **D.** Dual-use documents with structured sections suitable for both human authoring and machine extraction.

**Recommended current stance: treat templates as human drafting aids (Option A) until Owner approves a dedicated template contract.**

This decision pack does not decide the template contract. It records the question and defers the decision to Owner through Hermes design. No validation semantics should be implemented in code before Owner approves the contract.

## 8. Candidate Options

| Option | Description | Assessment |
|---|---|---|
| A — No action | Leave the retrospection unaddressed. | Risk of losing useful discovery input. |
| B — Docs-only decision pack | Record the concern, classify claims, define future unlock criteria. | Preserves input without premature implementation. |
| C — Contributor quickstart only | Add a contributor quickstart document. | Useful but premature without template contract clarity. |
| D — Template validation design only | Hermes designs template validation semantics. | Appropriate next step after this decision pack. |
| E — Implement template validation immediately | Add validators, fixtures, parser integration now. | Rejected: premature, no contract, no design. |
| F — Batch docs-only adoption pack | Combine decision pack with quickstart and design. | Could follow this pack but exceeds current scope. |

**Recommended option: B — Docs-only decision pack.** This preserves the concern, classifies the claims, and defines safe future unlock criteria without prematurely building validators.

## 9. Recommended Decision

Phase 1N-C should produce one docs-only decision pack:

- No validators.
- No fixtures.
- No template rewrites.
- No parser dependencies.
- No CI enforcement. This phase explicitly applies: no CI enforcement.
- No changes to existing code, schemas, or templates.

A future validation unlock may be designed only after Owner decides the template contract through a Hermes design phase.

## 10. Future Validation Unlock Criteria

A future template validation phase may be considered only if all of the following are true:

- Owner chooses a template contract (A, B, C, D, or a variant).
- Hermes designs validation semantics for that contract.
- Markdown parsing approach is specified.
- Fixture strategy is specified.
- Validator integration boundary is specified.
- Dependency policy is specified.
- CI behavior is explicitly designed.
- Rollback path is defined.
- Codex audit criteria are defined.

### Possible future unlocks

These are listed as future options only. None is implemented, authorized, or implied by this decision pack. Each requires Hermes design first, Owner authorization, DeepSeek implementation only after approval, Codex audit/finalization, and GitHub verification:

- **template contract design** — Owner decides what templates are and how they relate to schemas.
- **template validation schema design** — Hermes designs how template sections map to schema constraints.
- **Markdown parser/no-parser strategy design** — Hermes determines whether a parser is needed and which one.
- **contributor quickstart design** — A contributor-facing document that reduces onboarding friction.
- **template-to-artifact conversion design** — If templates become source material for JSON artifacts, define the conversion contract.

## 11. Contributor And Adoption Boundary

- Contributor and adopter guidance may be useful later but should follow template contract clarity.
- Guidance should not rewrite PNPD philosophy.
- Guidance should not claim adoption readiness.
- Guidance should not imply templates are validated today.
- Guidance should clearly distinguish "drafting aid" from "validated artifact."
- Any material changes to contributor guidance must remain Owner-gated and Codex-gated.

## 12. Forbidden Implementation In This Phase

This phase must not:

- edit schemas
- edit validators
- edit templates
- edit fixtures
- create new validator scripts
- create new product template fixtures
- change `package.json`
- change `package-lock.json`
- edit CI workflows
- add package scripts
- generate PNPD state
- add runtime behavior
- implement a template parser
- add a Markdown parser dependency
- create a report generator
- perform GitHub/API mutation
- change AgentBridge authority
- claim production readiness
- claim certification
- claim adoption readiness
- reopen Phase 1Q

## 13. Rejected Ideas

### 1. Implement 14 validator scripts immediately

- **Why tempting:** The independent agent identified a gap and proposed a concrete solution.
- **Why rejected now:** No template contract exists. 14 validators would be scope creep creating maintenance burden with no clear purpose.
- **Later phase, if any:** After template contract design and validation semantics design.

### 2. Add valid/invalid fixtures for every template immediately

- **Why tempting:** Fixtures are a proven PNPD pattern for JSON schemas.
- **Why rejected now:** Markdown fixture semantics are undefined. The valid/invalid fixture model does not directly translate.
- **Later phase, if any:** After fixture strategy is designed.

### 3. Integrate Markdown validation into the main validator now

- **Why tempting:** Centralizing validation in one script seems clean.
- **Why rejected now:** Would couple JSON schema validation to template drafting. Blurs validator contract. Governance risk.
- **Later phase, if any:** After validator integration boundary is designed.

### 4. Add Markdown parser dependency now

- **Why tempting:** A parser would enable structured Markdown extraction.
- **Why rejected now:** PNPD-OS has a minimal dependency posture. Adding a parser requires dependency policy review and Hermes design.
- **Later phase, if any:** After parser strategy design and dependency policy review.

### 5. Convert templates to JSON artifacts now

- **Why tempting:** JSON artifacts are machine-validatable today.
- **Why rejected now:** The template contract has not been decided. Templates may remain drafting aids. Conversion is a design decision, not a default.
- **Later phase, if any:** After template contract design and Owner authorization.

### 6. Edit all product templates now

- **Why tempting:** Templates could be improved.
- **Why rejected now:** Editing templates before the contract decision risks rewriting against the wrong contract.
- **Later phase, if any:** After template contract design.

### 7. Add CI checks for template validation now

- **Why tempting:** CI enforcement would catch template drift.
- **Why rejected now:** No CI enforcement is appropriate before the template contract, validation semantics, and fixture strategy are designed. Premature CI checks create blocking friction.
- **Later phase, if any:** After CI behavior design.

### 8. Treat independent agent report as authoritative

- **Why tempting:** The report identified plausible concerns.
- **Why rejected now:** Authority to decide template contracts, validation semantics, and implementation scope rests with Owner, Hermes, Codex, and DeepSeek. External reports are discovery input, not authority.
- **Later phase, if any:** Not applicable. External reports are always advisory.

### 9. Reopen Phase 1Q

- **Why tempting:** Bug forecast is fresh; adding template bug forecasts seems natural.
- **Why rejected now:** Phase 1Q is complete. The bug forecast validator track is stopped. Templates are a product delivery concern, not a bug forecast concern.
- **Later phase, if any:** Only if a real defect is discovered in the bug forecast schema, fixtures, or validation behavior.

### 10. Claim adoption readiness or production readiness

- **Why tempting:** Progress feels adoption-ready.
- **Why rejected now:** PNPD-OS is under active phased development. Adoption readiness and production readiness are Owner-gated claims. This decision pack makes neither.
- **Later phase, if any:** Owner-gated.

## 14. Drift Risk Register

| Risk | Description | Mitigation |
|---|---|---|
| External report causing scope jump | The retrospection proposes 14 validators, fixtures, and integration. | This decision pack classifies claims and rejects premature scope. |
| Template validation becoming validator sprawl | Adding validators before contract clarity creates unmaintainable surface. | Future validation unlock criteria require contract first. |
| Docs-only decision pack mistaken for implementation | A reader may mistake this pack for an implementation authorization. | Section 12 explicitly forbids implementation. |
| Template contract decided without Owner | DeepSeek or Hermes pre-answers the template contract question. | Section 7 defers the contract question to Owner. |
| Markdown parsing dependency creep | A parser dependency added without design review. | Parser strategy is listed as a future unlock requiring Hermes design. |
| CI drift | CI checks for template validation added without design. | No CI enforcement at this stage. |
| Package drift | `package.json` or `package-lock.json` changed for template work. | Package changes explicitly forbidden in Section 12. |
| Fixture explosion | Template fixture directories created without strategy. | No fixtures in this phase. |
| Product templates rewritten prematurely | Templates edited before contract decision. | No template edits in this phase. |
| Contributor quickstart becoming philosophy rewrite | Contributor guidance expands beyond quickstart into philosophy. | Contributor boundary defined in Section 11. |
| Phase 1Q reopening | Bug forecast track reopened for template concerns. | Phase 1Q stop check in Section 3. |
| Adoption readiness overclaim | This pack or future work claimed as adoption-ready. | Adoption readiness is Owner-gated and not claimed. |

## 15. Gates And Non-Goals

### Gates for this phase

- exact one-file docs-only scope
- no schema edits
- no validator edits
- no template edits
- no fixture edits
- no package edits
- no CI edits
- no dependency additions
- no generated state
- no parser implementation
- no validation implementation
- no adoption readiness claim
- no production readiness claim

### Explicit non-goals

- This document does not implement template validators.
- This document does not decide the template contract.
- This document does not change any existing artifact, schema, validator, template, fixture, or workflow.
- This document does not authorize any deployment, dispatch, or certification action.
- This document does not claim, imply, or authorize adoption readiness or production readiness.
