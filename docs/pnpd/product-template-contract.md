# PNPD Product Template Contract

## 1. Purpose

This is a docs-only template contract. It follows the Phase 1N-C product template adoption and validation decision pack. It selects how product Markdown templates relate to governed PNPD artifacts.

This document does not implement validators. It does not implement parsers. It does not edit templates. It does not add fixtures. It does not change schemas. It does not change CI. It does not add dependencies. It does not claim adoption readiness. It does not claim production readiness.

## 2. Baseline

```
Baseline verdict: PHASE_1N_C_TEMPLATE_ADOPTION_VALIDATION_DECISION_PACK_PUSHED_CI_GREEN
Baseline commit: 7865e279bc98e52cd7ce0aa81d828129d7c0ef9e
Remote CI run: 28000787656
Remote CI conclusion: success
```

Phase 1N-C is canonical. Phase 1Q remains stopped. 1N-D is not a Phase 1Q continuation. 1N-D is not template validation implementation.

## 3. Phase 1N-C Inheritance

Phase 1N-C established that:

- independent retrospection is useful input, not authority
- template validation concern is adoption friction, not urgent defect
- direct validator implementation is premature
- no template validation may proceed without a template contract
- templates remain drafting aids until Owner approves a new contract

Phase 1N-D now chooses the template contract. Implementation remains forbidden in this phase.

Phase 1Q must not be reopened. No bug forecast examples, negative examples, validator phases, or governance pack edits are authorized. If any Phase 1Q artifact is touched, the phase is blocked.

## 4. Contract Decision

Four options were considered:

A. human drafting aids only
B. directly machine-validated artifacts
C. source material for future JSON artifacts
D. dual-use documents with structured sections

The selected option is:

Option C: source material for future JSON artifacts

## 5. Options Considered

### Option A: human drafting aids only

- **What it means:** Templates remain forever as human-facing drafting guides. No machine path exists.
- **Why it is tempting:** Safest option. No new dependencies, no parser risk, no CI expansion.
- **What it enables:** Continued low-friction template authoring with zero governance overhead.
- **What it forbids:** Any future template-to-artifact pipeline, automation, or structured extraction.
- **Risk level:** Low immediate risk, medium long-term risk of underusing structured template investment.
- **Needs future implementation:** No, unless the contract is later changed.
- **Recommendation status:** Safest, but underuses templates.

### Option B: directly machine-validated artifacts

- **What it means:** Markdown templates become directly CI-validated artifacts. Parsers and validators are built now.
- **Why it is tempting:** Closes the perceived validation gap immediately.
- **What it enables:** Full CI-gated template correctness with immediate feedback.
- **What it forbids:** Gradual evolution; locks in parser and fixture choices now.
- **Risk level:** High. No parser design, no fixture strategy, no dependency policy.
- **Needs future implementation:** Immediate implementation required.
- **Recommendation status:** Premature and brittle.

### Option C: source material for future JSON artifacts

- **What it means:** Templates remain human drafting aids today, but are designated as source material for future JSON artifact generation. A future governed phase will define the transformation.
- **Why it is tempting:** Balances current drafting utility with a clear future path toward governed artifacts.
- **What it enables:** Templates can later guide or map into JSON product-delivery artifacts under a designed transformation policy.
- **What it forbids:** Direct validation today, parser implementation today, template-as-artifact claims today.
- **Risk level:** Medium, mitigated by explicit gates on future conversion.
- **Needs future implementation:** Yes — a future governed conversion phase.
- **Recommendation status:** Balanced and recommended.

### Option D: dual-use documents with structured sections

- **What it means:** Templates are restructured with machine-parseable sections, serving both human authors and validators simultaneously.
- **Why it is tempting:** Maximizes template utility — one document works for both humans and machines.
- **What it enables:** Concurrent human authoring and machine validation from the same source.
- **What it forbids:** Free-form template sections; requires structured Markdown rules.
- **Risk level:** High until structure and parser rules exist. Risk of premature structure lock-in.
- **Needs future implementation:** Yes — structure design, parser rules, and fixture strategy.
- **Recommendation status:** Tempting, but high-risk until structure and parser rules exist.

## 6. Recommended Contract

Product Markdown templates are source material for future JSON artifacts.

Under this contract:

- product templates are human-facing drafting aids
- product templates are non-authoritative until transformed into governed artifacts
- product templates are source material for future JSON product-delivery artifacts
- product templates are not directly validated today
- product templates are not executable
- product templates are not registry entries
- product templates are not CI-gated
- product templates are not production readiness evidence
- future conversion remains a separate governed phase

## 7. Non-Cyclic Justification

1N-C classified the concern and required a contract.
1N-D chooses the contract.

In this phase:

- no validation is implemented
- no parser logic is implemented
- no template edits are made
- no fixtures are added
- no schema changes are made
- no CI changes are made
- no bug forecast work is reopened

## 8. Scope Boundary

1N-D produces one docs-only contract document.

It must not implement:

- validators
- parsers
- template fixtures
- template conversion
- CI checks
- schema changes
- template rewrites
- package changes
- dependencies

## 9. Product Delivery Template Inventory

Current templates under `templates/product/`:

| Template file | Orientation |
|---|---|
| `architecture-spec.md` | Architecture specification drafting aid |
| `design-spec.md` | Design specification drafting aid |
| `design-tree.md` | Design tree / design document drafting aid |
| `implementation-handoff.md` | Implementation handoff drafting aid |
| `infrastructure-plan.md` | Infrastructure plan drafting aid |
| `owner-decision.md` | Owner decision recording aid |
| `owner-solution-choice.md` | Owner solution choice recording aid |
| `parked-idea.md` | Parked idea recording aid |
| `prd.md` | Product requirements document drafting aid |
| `product-spec.md` | Product specification drafting aid |
| `product-vision-brief.md` | Product vision brief drafting aid |
| `prototype-plan.md` | Prototype plan drafting aid |
| `rejected-options.md` | Rejected options recording aid |
| `test-plan.md` | Test plan drafting aid |

This inventory is for orientation only. The inventory is not validation coverage. The inventory is not a completeness claim. The inventory does not create template-specific rules. The templates are not edited. The templates are not validated by this phase.

## 10. Contract Semantics

Under this contract:

- Markdown template completion is a human drafting action.
- A completed Markdown template is not automatically a PNPD artifact.
- A governed PNPD product-delivery artifact must still satisfy the relevant JSON schema.
- Future conversion may map Markdown sections into JSON fields, but no mapping exists yet.
- Missing Markdown sections are not validation errors today.
- Markdown formatting differences are not validation errors today.
- The contract may later define structured sections, but not in 1N-D.
- no direct Markdown validation
- no template parser
- no CI enforcement

## 11. Artifact Relationship Model

```
templates/product/*.md -> human draft -> future transformation policy -> JSON artifact -> schema validation -> registry/advisory evidence
```

Under this model:

- templates do not bypass schema validation
- templates do not authorize implementation
- templates do not authorize delivery
- templates do not authorize registry writes
- templates do not replace Owner approval
- templates do not replace Codex audit

## 12. Future Validation Implications

Future validation phases may consider:

- template contract schema
- section inventory
- template-to-artifact mapping
- JSON output examples
- no-parser strategy
- parser strategy
- fixture strategy
- validator integration boundary
- CI advisory boundary

None of these are implemented in 1N-D.

## 13. Future Conversion Implications

Future conversion must remain gated.

Any template-to-artifact conversion must define:

- input template path
- output artifact type
- mapping rules
- required Owner review
- Codex audit expectations
- no automatic implementation
- no automatic registry write
- no automatic dispatch
- no production readiness claim

## 14. Contributor And Adoption Implications

Under this contract:

- contributors may use templates to draft product thinking
- contributors must not assume completed templates are validated artifacts
- contributors must not open PRs adding validators without the future validation unlock
- contributors should treat templates as drafting aids until the contract changes
- onboarding may later explain this distinction
- adoption guidance may be future docs-only work
- material changes remain Owner-gated and Codex-gated

## 15. Forbidden Implementation In This Phase

This phase forbids:

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
- validator scripts
- parser code
- parser dependencies
- template rewrites
- template fixtures
- conversion logic
- registry writer changes
- generated PNPD state
- GitHub/API mutation
- AgentBridge authority changes
- runtime behavior
- CI enforcement
- deployment
- dispatch
- certification
- production readiness claims
- adoption readiness claims

## 16. Rejected Ideas

### 1. Keep templates as drafting aids forever without future path

- **Why tempting:** Zero change, zero risk, zero governance overhead.
- **Why rejected now:** Forgoes future template-to-artifact investment. Underuses structured template work.
- **Later phase:** May be reinstated if Owner chooses Option A in a future contract revision.

### 2. Directly validate Markdown now

- **Why tempting:** Closes the perceived validation gap immediately.
- **Why rejected now:** No parser design, no fixture strategy, no dependency policy. Premature.
- **Later phase:** Future validation phase after conversion policy is designed.

### 3. Add structured Markdown rules now

- **Why tempting:** Enables future dual-use without later template rewrites.
- **Why rejected now:** Structure design is a Hermes concern. Premature without conversion semantics.
- **Later phase:** Future structure design phase gated by Owner.

### 4. Add parser dependency now

- **Why tempting:** Unblocks immediate Markdown processing.
- **Why rejected now:** PNPD-OS maintains minimal runtime dependencies. A parser dependency requires a Hermes design and dependency policy review.
- **Later phase:** Dependency addition gated by Hermes design.

### 5. Add fixtures now

- **Why tempting:** Prepares test infrastructure for future validation.
- **Why rejected now:** Fixture strategy cannot be designed before validation semantics. Premature fixtures create maintenance burden.
- **Later phase:** Future fixture phase gated by validation semantics design.

### 6. Edit all templates now

- **Why tempting:** Align templates with future contract expectations early.
- **Why rejected now:** Template edits before conversion semantics are defined risk churn and rework.
- **Later phase:** Template revision phase gated by structure design.

### 7. Convert templates to JSON now

- **Why tempting:** Immediate artifact availability.
- **Why rejected now:** No conversion policy, no mapping rules, no Owner review of conversion semantics.
- **Later phase:** Future conversion phase gated by conversion policy.

### 8. Add CI template checks now

- **Why tempting:** Automates template quality enforcement.
- **Why rejected now:** CI enforcement before the contract and semantics are defined would create blocking friction for template authors.
- **Later phase:** CI advisory boundary gated by validation semantics.

### 9. Treat templates as registry artifacts now

- **Why tempting:** Unified artifact surface.
- **Why rejected now:** Templates are not governed artifacts. Registry entries require JSON schema validation.
- **Later phase:** May be reconsidered after conversion produces valid JSON artifacts.

### 10. Claim completed templates are delivery evidence

- **Why tempting:** Leverages existing template investment for delivery posture.
- **Why rejected now:** Templates are non-authoritative drafting aids. Delivery evidence requires governed artifacts.
- **Later phase:** Templates may contribute to delivery evidence only after governed conversion.

## 17. Drift Risk Register

| Risk | Description |
|---|---|
| contract document mistaken for validation implementation | This document is docs-only. It implements nothing. |
| template inventory mistaken for validation coverage | The inventory is orientation only. It is not a completeness or coverage claim. |
| future conversion language mistaken for current converter | Conversion is a future gated phase. No conversion exists today. |
| Markdown parser creep | No parser is added. No parser dependency is introduced. |
| CI drift | No CI changes are authorized. |
| package drift | No package changes are authorized. |
| fixture explosion | No fixtures are added. |
| template rewrites | No templates are edited. |
| adoption readiness overclaim | This phase does not claim adoption readiness. |
| product delivery artifacts bypassing schema validation | Templates do not bypass schema validation. The artifact relationship model preserves the schema gate. |
| contributor confusion | The contributor implications section defines the boundary. |
| Phase 1Q reopening by mistake | Phase 1Q remains stopped. This phase is 1N-D, not 1Q. |

## 18. Gates And Non-Goals

This phase is gated by:

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
