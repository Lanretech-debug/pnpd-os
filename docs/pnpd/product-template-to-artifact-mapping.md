# PNPD Product Template-to-Artifact Mapping

## 1. Purpose

This is a docs-only mapping matrix. It follows the Phase 1N-D product template contract. It maps product Markdown templates to possible future artifact families.

This document does not implement conversion. It does not implement validation. It does not implement a parser. It does not edit templates. It does not add fixtures. It does not change schemas. It does not change CI. It does not add dependencies. It does not claim adoption readiness. It does not claim production readiness.

The mapping is advisory only. It is non-executable. It is non-validating. It is non-converting. It is Owner-gated. It is Codex-gated.

## 2. Baseline

```
Baseline verdict: PHASE_1N_D_PRODUCT_TEMPLATE_CONTRACT_PUSHED_CI_GREEN
Baseline commit: 93a11fececdea81584fc997435c1bd146ab40212
Remote CI run: 28001211539
Remote CI conclusion: success
```

Phase 1N-D is canonical. Phase 1Q remains stopped. 1N-E is not a Phase 1Q continuation. 1N-E is not conversion implementation. 1N-E is not validation implementation.

## 3. Phase 1N-D Inheritance

Phase 1N-D established the following, which remain authoritative for 1N-E:

- product Markdown templates are human drafting aids
- product Markdown templates are source material for future JSON artifacts
- completed Markdown templates are not governed PNPD artifacts by themselves
- no direct Markdown validation exists
- no template parser exists
- no CI enforcement exists
- no template-to-artifact conversion exists
- any future conversion requires a separate governed phase

This phase does not alter any of those positions. It builds on them to provide an advisory mapping matrix that may inform future conversion and validation designs, without implementing any of them.

## 4. Mapping Relationship Model

```
templates/product/*.md -> human draft -> template-to-artifact mapping policy -> future transformation policy -> JSON artifact -> schema validation -> registry/advisory evidence
```

This mapping is advisory only. It does not perform conversion. It does not authorize implementation. It does not authorize registry writes. It does not bypass schema validation. It does not replace Owner approval. It does not replace Codex audit.

The mapping matrix that follows is documentation. It has no runtime effect. It generates no JSON. It enforces no rules. It is a reference for future design phases only.

## 5. Mapping Categories

Every template is assigned one of the following mapping categories:

**A. Direct future source candidate:**
A template appears likely to source one governed artifact family later. The template sections map conceptually to the target artifact's JSON schema fields. A future conversion phase could map this template to a single governed artifact type with relatively low design friction.

**B. Partial future source candidate:**
A template may source part of a governed artifact or several artifact fields later. The template does not cleanly map to a single artifact family. Future conversion would require field-level mapping decisions and may produce partial or multi-artifact output.

**C. Supporting context only:**
A template may inform a governed artifact but should not map directly. It provides narrative, reasoning, or decision context that a human would use while drafting a governed artifact. Direct machine mapping would distort the template's purpose.

**D. No mapping yet:**
A template has no safe mapping until future design. Its purpose, structure, or target artifact family is unclear or undefined. Premature mapping would risk inaccurate artifact generation.

**E. Retired or duplicate candidate:**
A template may overlap with another template and needs later review before mapping. It may be a candidate for retirement, consolidation, or explicit differentiation from another template.

## 6. Product Delivery Artifact Families

The following artifact families are recognized at a high level. This section does not change any schema. It does not invent new schema fields. It does not claim all families are currently implemented. It does not claim documentation-only families are validated today.

| Artifact family | Description | Current governed status |
|---|---|---|
| Idea brief / raw idea capture | Early-stage product idea or vision capture | documentation-only today |
| Research discovery | Findings from market, user, or technical research | documentation-only today |
| Design tree | Hierarchical design decision tree | documentation-only today |
| PRD | Product requirements document | current governed artifact |
| Product specification | Detailed product behavior specification | current governed artifact |
| Design specification | Detailed design decisions and rationale | documentation-only today |
| Architecture specification | System architecture and security boundaries | current governed artifact |
| Infrastructure plan | Infrastructure, deployment, and operations plan | documentation-only today |
| Test plan | Testing strategy, coverage, and scenarios | documentation-only today |
| Implementation handoff | Implementation constraints and forbidden actions | current governed artifact |
| Release readiness | Release criteria and readiness assessment | documentation-only today |
| Feedback log | Collected feedback on delivered artifacts | documentation-only today |
| Roadmap | Product delivery timeline and sequencing | documentation-only today |
| Product delivery registry entry | Registry record of a validated artifact | current governed artifact |

Currently governed artifact types (prd, productSpec, architectureSpec, implementationHandoff) have JSON schemas, fixtures, and validators in this repository. All other families are documentation-only today and require future Hermes design before they become governed artifact types.

## 7. Product Template Inventory

Current templates under `templates/product/`, discovered from the local filesystem:

```
architecture-spec.md
design-spec.md
design-tree.md
implementation-handoff.md
infrastructure-plan.md
owner-decision.md
owner-solution-choice.md
parked-idea.md
prd.md
product-spec.md
product-vision-brief.md
prototype-plan.md
rejected-options.md
test-plan.md
```

This inventory is read-only. It is for orientation only. It is not validation coverage. It is not a completeness claim beyond current repo state. It does not create template-specific parser rules. It does not create template-specific validation rules. It does not create template fixtures.

No template is edited by this phase.

## 8. Mapping Matrix

| Template path | Template purpose summary | Recommended mapping category | Possible future artifact family | Current governed status | Required future design before conversion | Notes / risk |
|---|---|---|---|---|---|---|
| `prd.md` | Product requirements document with goals, non-goals, user stories, and success metrics | A — Direct future source candidate | PRD | current governed artifact | Field-level mapping spec; Owner review gate | Strongest direct mapping candidate. Template fields align with product-delivery PRD schema. |
| `product-spec.md` | Detailed product behavior specification with acceptance criteria and out-of-scope behaviors | A — Direct future source candidate | Product specification | current governed artifact | Field-level mapping spec; Owner review gate | Strong direct mapping candidate. Template sections map to productSpec schema fields. |
| `architecture-spec.md` | System architecture specification with security boundaries and component diagram | A — Direct future source candidate | Architecture specification | current governed artifact | Field-level mapping spec; Owner review gate | Strong direct mapping candidate. Template covers security boundaries required by architectureSpec schema. |
| `implementation-handoff.md` | Implementation constraints, forbidden files, no-merge/no-push rules | A — Direct future source candidate | Implementation handoff | current governed artifact | Field-level mapping spec; Owner review gate | Strong direct mapping candidate. Template aligns with implementationHandoff schema. |
| `design-spec.md` | Detailed design decisions and rationale | B — Partial future source candidate | Design specification | documentation-only today | Schema design for designSpec; mapping rules; artifact family governance decision | Partial candidate: design decisions could inform PRD, product spec, or architecture spec. No governed designSpec schema exists. |
| `design-tree.md` | Hierarchical design decision tree | B — Partial future source candidate | Design tree | documentation-only today | Schema design for designTree; mapping rules; artifact family governance decision | Partial candidate: tree structure does not map cleanly to flat JSON schema. May need special handling. |
| `infrastructure-plan.md` | Infrastructure, deployment, and operations plan | B — Partial future source candidate | Infrastructure plan | documentation-only today | Schema design for infrastructurePlan; mapping rules; artifact family governance decision | Partial candidate: could inform architecture spec or implementation handoff fields. |
| `test-plan.md` | Testing strategy, coverage plan, and test scenarios | B — Partial future source candidate | Test plan | documentation-only today | Schema design for testPlan; mapping rules; artifact family governance decision | Partial candidate: testing concerns may span multiple artifact types. |
| `product-vision-brief.md` | Early-stage product vision and problem statement | C — Supporting context only | Idea brief / raw idea capture | documentation-only today | Artifact family governance decision before mapping | Supporting context: narrative document. Should inform PRD drafting rather than map directly. |
| `prototype-plan.md` | Prototype scope, hypotheses, and success criteria | C — Supporting context only | unknown / needs later design | documentation-only today | Artifact family governance decision before mapping | Supporting context: prototype plans inform implementation decisions but do not produce governed artifacts directly. |
| `owner-decision.md` | Owner-level product decision record with rationale | C — Supporting context only | unknown / needs later design | documentation-only today | Artifact family governance decision before mapping | Supporting context: governance record. Owner decisions are context for PRD and product spec, not artifacts themselves. |
| `owner-solution-choice.md` | Owner solution choice with trade-off analysis | C — Supporting context only | unknown / needs later design | documentation-only today | Artifact family governance decision before mapping | Supporting context: trade-off analysis informs design decisions. Not a direct artifact source. |
| `parked-idea.md` | Parked product ideas for future consideration | D — No mapping yet | unknown / needs later design | documentation-only today | Artifact family decision; parking policy before mapping | No mapping yet: parked ideas are intentionally deferred. Mapping now would contradict their parking status. |
| `rejected-options.md` | Rejected product options with rejection rationale | D — No mapping yet | unknown / needs later design | documentation-only today | Artifact family decision; rejection evidence policy before mapping | No mapping yet: rejected options serve as decision evidence. Mapping would risk treating rejections as active artifacts. |

## 9. Non-Mapping Cases

The following cases identify where mapping must not happen yet, either because the template's purpose would be distorted or because mapping would imply capabilities that do not exist:

**Templates too broad:** `product-vision-brief.md` covers too wide a scope to map to a single artifact family. Forcing a direct mapping would lose the narrative value of the template.

**Overlapping templates:** `design-spec.md` and `design-tree.md` both address design concerns. Mapping both independently before clarifying their relationship risks duplicate or contradictory artifact output.

**Narrative-only support templates:** `owner-decision.md` and `owner-solution-choice.md` are governance records. They document Owner intent. Mapping them to governed artifacts would conflate decision authority with artifact production.

**Unclear JSON target:** `prototype-plan.md` and `parked-idea.md` have no clear JSON artifact family. Mapping before defining the target artifact type would create false precision.

**Templates requiring schema changes before mapping:** `test-plan.md` and `infrastructure-plan.md` would need new schema definitions before any mapping is meaningful. Mapping them now would implicitly claim schema readiness.

**Templates that could cause false delivery evidence claims:** `rejected-options.md` if mapped would incorrectly appear to be a delivery artifact. Rejected options are decision evidence, not delivery evidence.

**Templates where mapping would imply validation before validation exists:** Any template mapped to a non-governed artifact family implicitly creates an expectation that the artifact type is validated. This is false until schemas, fixtures, and validators exist.

**Templates where mapping would imply conversion before conversion exists:** Category A templates (prd, product-spec, architecture-spec, implementation-handoff) are the closest to convertible, but no converter exists. Even for these, mapping is advisory, not a conversion guarantee.

## 10. Future Conversion Boundary

Conversion is not implemented in 1N-E.

This document uses the exact phrase: no conversion implementation.

Any future conversion phase must define:

- exact template input path
- exact output JSON artifact type
- field mapping rules
- required field policy
- optional field policy
- unresolved-field behavior
- missing-section behavior
- Owner review gate
- Codex audit gate
- no automatic implementation
- no automatic registry write
- no automatic dispatch
- no production readiness claim
- rollback/disable path

Until a future conversion phase is Owner-authorized and Hermes-designed, no template content may be automatically transformed into any governed artifact. Templates remain human drafting aids only, as established in Phase 1N-D.

## 11. Future Validation Boundary

Validation is not implemented in 1N-E.

This document uses the exact phrases: no direct Markdown validation. No template parser. No CI enforcement.

Any future validation phase must define:

- whether Markdown itself is validated
- whether generated JSON is validated only
- whether a no-parser strategy is possible
- whether a parser strategy is necessary
- fixture strategy
- validator integration boundary
- CI advisory boundary
- dependency policy
- failure behavior
- audit criteria

**Preferred future stance:**

Prefer validating generated JSON artifacts rather than directly validating Markdown, unless a later Hermes design proves Markdown validation is safe and necessary. This preference follows from the Phase 1N-D contract position that templates are source material for future JSON artifacts. The JSON artifacts — once generated through a governed conversion phase — would pass through the existing schema validation pipeline, which already has schemas, fixtures, and validators for current governed artifact types. Direct Markdown validation would introduce a new validation surface, new parser dependencies, and new fixture patterns that do not exist today. The burden of proof for adding direct Markdown validation rests on a future Hermes design.

## 12. Contributor And Adoption Implications

- Contributors may use templates for drafting. This mapping matrix does not change that.
- Contributors may reference the mapping matrix to understand likely future artifact relationships. The matrix is a planning aid, not a commitment.
- Contributors must not assume completed templates are validated artifacts. Completion of a template creates no governed state.
- Contributors must not assume mapping equals conversion. A Category A mapping does not mean the template is automatically convertible.
- Contributors must not open PRs implementing parsers or validators without Owner-authorized Hermes design. The mapping matrix is not authorization to build.
- Onboarding may later explain the draft-to-artifact path. This matrix may inform onboarding documentation in a future docs-only phase.
- Material changes remain Owner-gated and Codex-gated. No mapping category change, new artifact family designation, or conversion path may be implemented without explicit Owner approval through Hermes design.

## 13. Forbidden Implementation In This Phase

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
- edits to prior 1N-D template contract
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

## 14. Rejected Ideas

**1. Implement template-to-JSON conversion now.**
- Why tempting: Four templates have clear governed artifact targets.
- Why rejected now: No conversion semantics, no field mapping rules, no Owner authorization, no Hermes design. Conversion would pre-answer governance questions.
- Later phase: Only after Owner-authorized Hermes conversion design.

**2. Directly validate Markdown now.**
- Why tempting: Could catch template drafting errors early.
- Why rejected now: No parser, no validation rules, no fixture strategy. Markdown validation is a different problem than JSON schema validation.
- Later phase: Only after Hermes design proves Markdown validation is safe and necessary.

**3. Add parser dependency now.**
- Why tempting: Enables Markdown-to-JSON extraction.
- Why rejected now: PNPD-OS has no runtime parser dependencies. Adding one requires dependency policy review and Hermes design.
- Later phase: Dependency policy review in a future design phase.

**4. Add mapping fixtures now.**
- Why tempting: Could test mapping correctness.
- Why rejected now: No conversion exists. Fixtures without a converter test nothing.
- Later phase: After conversion implementation exists.

**5. Edit templates to match mapping now.**
- Why tempting: Could make templates more machine-friendly.
- Why rejected now: Templates are human drafting aids. Changing them for machine convenience before any machine path exists is premature optimization.
- Later phase: Only after conversion design defines required template structure.

**6. Change product-delivery schema now.**
- Why tempting: Could add artifact families referenced in the mapping.
- Why rejected now: Schema changes require Hermes design, fixture updates, and validator updates. The mapping is advisory only and does not authorize schema expansion.
- Later phase: Through normal Hermes schema design phases.

**7. Add CI checks for mapping now.**
- Why tempting: Could enforce mapping consistency.
- Why rejected now: No CI enforcement exists for templates (per 1N-D contract). Adding CI for the mapping would be enforcement without a governed artifact to enforce against.
- Later phase: After conversion and validation phases establish CI integration boundaries.

**8. Treat mapping as registry evidence now.**
- Why tempting: The mapping matrix looks authoritative.
- Why rejected now: The mapping is advisory documentation. Registry entries require validated JSON artifacts. Mapping without artifacts is not evidence.
- Later phase: Registry evidence comes from validated artifacts, not from mapping matrices.

**9. Claim mapped templates are governed artifacts now.**
- Why tempting: Category A templates have strong conceptual alignment with governed artifact types.
- Why rejected now: Templates are Markdown. Governed artifacts are validated JSON. Alignment is not equivalence. Claiming governance would bypass the entire validation pipeline.
- Later phase: Only after conversion produces validated JSON artifacts.

**10. Claim mapping proves delivery readiness.**
- Why tempting: A completed mapping matrix looks like delivery infrastructure.
- Why rejected now: Delivery readiness requires validated artifacts, registry entries, and Owner-authorized dispatch. A mapping matrix provides none of these.
- Later phase: Delivery readiness is a separate gated phase.

**11. Reopen Phase 1Q.**
- Why tempting: The mapping raises questions about bug forecast templates.
- Why rejected now: Phase 1Q is stopped. Bug forecast governance is separate. The template mapping concerns product delivery (1N track), not bug forecasting (1Q track).
- Later phase: Not applicable unless a real defect is discovered in Phase 1Q schemas, fixtures, or validators.

**12. Treat independent retrospection as authority.**
- Why tempting: The external agent raised useful concerns.
- Why rejected now: The retrospection is useful input (per 1N-C), not authority (per 1N-D). The mapping matrix follows the 1N-D contract, not external proposals.
- Later phase: External input may inform future design phases but does not authorize implementation.

## 15. Drift Risk Register

| # | Risk | Mitigation |
|---|---|---|
| 1 | Mapping document mistaken for converter | Document explicitly states no conversion implementation. |
| 2 | Mapping matrix mistaken for validation coverage | Matrix explicitly states no validation implementation. |
| 3 | Mapping category mistaken for schema status | Categories are advisory labels, not schema governance states. |
| 4 | Future artifact family invented as current artifact | Section 6 explicitly classifies governance status of each family. |
| 5 | Template inventory mistaken for completeness claim | Inventory is read-only discovery, not a completeness guarantee. |
| 6 | Parser creep | No parser dependency exists. No parser is authorized. |
| 7 | Fixture creep | No fixtures are created. No fixture strategy is implemented. |
| 8 | CI drift | No CI changes. No CI enforcement is added. |
| 9 | Schema drift | No schema edits. No new artifact types are registered. |
| 10 | Template rewrite drift | No template is edited. Templates remain as-is. |
| 11 | Registry authority creep | Mapping is advisory, not registry evidence. No registry writes. |
| 12 | Delivery evidence overclaim | No delivery readiness claim. No production readiness claim. |
| 13 | Adoption readiness overclaim | No adoption readiness claim. |
| 14 | Phase 1Q reopening | 1N-E is product delivery track (1N), not bug forecast track (1Q). |
| 15 | External report authority creep | Mapping follows 1N-D contract, not external proposals. |

## 16. Gates And Non-Goals

This phase:

- produces exactly one docs-only file: `docs/pnpd/product-template-to-artifact-mapping.md`
- makes no schema edits
- makes no validator edits
- makes no template edits
- makes no fixture edits
- makes no package edits
- makes no CI edits
- adds no dependency additions
- creates no generated state
- implements no parser
- implements no validation
- implements no conversion
- authorizes no registry writes
- makes no adoption readiness claim
- makes no production readiness claim

The mapping matrix is documentation. It is advisory. It is a reference for future design phases. It is not a runtime component. It is not a build artifact. It is not a governed registry entry. It is Owner-gated and Codex-gated for any future material change.
