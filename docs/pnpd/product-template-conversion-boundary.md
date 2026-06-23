# PNPD Product Template Conversion Boundary

## 1. Purpose

This is a docs-only conversion boundary. It follows the Phase 1N-E product template-to-artifact mapping. It defines a preferred no-parser strategy and manual transformation policy that constrain how future template-to-artifact conversion should be designed before any implementation is attempted.

This document does not implement conversion. It does not implement validation. It does not implement a parser. It does not generate JSON artifacts. It does not create registry state. It does not add fixtures. It does not edit templates. It does not change schemas. It does not change CI. It does not add dependencies. It does not claim adoption readiness. It does not claim production readiness.

The conversion boundary is Owner-gated and Codex-gated.

## 2. Baseline

```
Baseline verdict: PHASE_1N_E_PRODUCT_TEMPLATE_TO_ARTIFACT_MAPPING_PUSHED_CI_GREEN
Baseline commit: 554e6f89dbfff6ff29249468298c4a6306b98078
Remote CI run: 28002522588
Remote CI conclusion: success
```

Phase 1N-E is canonical. Phase 1Q remains stopped. 1N-F is not a Phase 1Q continuation. 1N-F is not conversion implementation. 1N-F is not validation implementation. 1N-F is not parser implementation.

## 3. Phase 1N-E Inheritance

Phase 1N-E established the following positions, which remain authoritative for 1N-F:

- mapping is docs-only
- mapping is advisory
- mapping is non-executable
- mapping is non-validating
- mapping is non-converting
- mapping does not parse Markdown
- mapping does not generate JSON
- mapping does not authorize registry writes
- Category E remains valid with zero current rows
- future conversion requires separate governed design

1N-F builds on these positions by defining the conversion boundary and constraining how conversion may be designed. It does not implement conversion, validation, parsing, or artifact generation.

## 4. Conversion Boundary Model

```
templates/product/*.md -> human draft -> human-reviewed transformation decision -> manually prepared JSON artifact -> schema validation -> Owner review -> Codex audit -> registry/advisory evidence if separately authorized
```

This model performs no automatic conversion. This model performs no Markdown parsing. This model performs no registry write. This model performs no dispatch. This model makes no production readiness claim. This model is Owner-gated. This model is Codex-gated.

The boundary is deliberately manual. Every step from human draft to governed artifact requires a human decision. No machine automation replaces human review, Owner approval, or Codex audit. The conversion boundary ensures that templates remain drafting aids while providing a clear path to governed artifacts for those templates that are later selected for conversion through proper governance.

## 5. No-Parser Strategy

This document recommends a no-parser strategy as the preferred starting position for PNPD-OS.

A no-parser strategy means future conversion does not programmatically parse Markdown structure. Instead, a human prepares or reviews a governed JSON artifact using the template as drafting source material. JSON artifacts remain the governed validation target.

Under a no-parser strategy:

- Markdown formatting is not validation input
- Markdown headings are not validation input
- Markdown section order is not validation input
- Markdown completion is not machine-scored
- human review remains required
- Owner approval remains required
- Codex audit remains required

The no-parser strategy does not forbid a parser forever. A parser strategy may be considered in a future Hermes design phase if the no-parser strategy proves insufficient for specific conversion needs. But the burden of proof rests on any proposal to introduce a parser dependency. The PNPD-OS dependency posture is intentionally minimal, and changing it requires Hermes design review, dependency policy assessment, and Owner approval.

This document explicitly uses the exact phrase: no template parser.

## 6. Manual Transformation Policy

Manual transformation means a person may use a completed Markdown template as reference material while preparing a governed JSON artifact. The template guides the author, but the JSON artifact is the governed output.

Manual transformation does not mean:

- copying Markdown into registry state
- treating Markdown as JSON
- treating template completion as artifact completion
- treating a template as validation evidence
- allowing unreviewed conversion
- allowing automatic registry write

Manual transformation requires:

- explicit target artifact type
- explicit schema reference
- Owner review
- Codex audit if material
- no automatic dispatch
- no automatic production/adoption readiness claim

This document explicitly uses the exact phrase: manual transformation.

## 7. Future Conversion Design Inputs

Any later conversion design phase must specify:

- exact template path
- exact target artifact family
- exact target JSON schema or schema family
- whether target artifact is current governed, future governed, documentation-only today, or unknown
- source sections used as human guidance
- required human review role
- unresolved-field handling
- missing-information handling
- evidence boundary
- rollback/disable strategy

None of these are implemented in 1N-F. This document only records the design inputs that a future conversion design must address. No design has been performed. No decisions have been pre-answered.

## 8. Future Conversion Design Outputs

Any later conversion design phase may produce:

- conversion decision document
- mapping checklist
- manual transformation checklist
- JSON artifact authoring guidance
- validation handoff guidance
- Codex audit checklist

It must not produce in 1N-F:

- converter code
- parser code
- JSON artifacts produced by automation
- registry entries
- fixtures
- CI checks
- schema changes
- template rewrites

This document uses the exact phrase: no conversion implementation.

## 9. Validation Boundary

Markdown validation remains forbidden. No template parser exists. No Markdown-to-JSON validation bridge exists. No fixture strategy exists for template content.

Generated JSON artifact validation may be considered later — but only after a governed conversion phase produces JSON artifacts. The existing schema validation pipeline (Phase 1N product-delivery schema, Phase 1O registry schema) already handles JSON validation. JSON artifacts produced through manual transformation would pass through the existing pipeline with no changes.

Preferred future stance:

Validate governed JSON artifacts, not Markdown templates.

No new schema fields are introduced by 1N-F. No validator integration is introduced by 1N-F. No CI enforcement is introduced by 1N-F. No fixture strategy is implemented by 1N-F.

This document explicitly uses the exact phrase: no direct Markdown validation.

## 10. Registry Boundary

Templates are not registry entries. The mapping matrix is not registry evidence. This conversion boundary is not registry evidence. Manual transformation does not authorize registry writes.

Registry writes remain separately governed. Product delivery registry state must not be generated in 1N-F. No `.pnpd/product-delivery-registry` state may be created.

Registry entries are governed by the product delivery registry schema (Phase 1O). Only JSON artifacts that pass schema validation, Owner review, and Codex audit may be considered for registry entry. The conversion boundary described here adds no new registry write path. It provides no shortcut around existing governance.

This document explicitly uses the exact phrase: no registry write.

## 11. CI Boundary

No CI enforcement exists in 1N-F. There are no template conversion checks in CI. There are no template validation checks in CI. There is no parser dependency in CI. There are no package script changes.

Future CI advisory checks — such as checking that a conversion decision document exists before a registry entry is created — require separate Hermes design and Owner approval. CI enforcement for template conversion would be premature before conversion design, conversion implementation, and validation integration exist.

This document explicitly uses the exact phrase: no CI enforcement.

## 12. Contributor And Adoption Implications

- Contributors may use templates for drafting. The conversion boundary does not change this.
- Contributors may consult the mapping matrix. The mapping remains advisory.
- Contributors must not assume templates convert automatically. No automatic conversion path exists.
- Contributors must not assume templates validate. Template content is not machine-validated.
- Contributors must not open PRs adding converters, parsers, validators, fixtures, or CI checks without Owner-authorized Hermes design.
- Onboarding may later explain the manual draft-to-JSON flow. This document may inform onboarding in a future docs-only phase.
- Material changes remain Owner-gated and Codex-gated.

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
- edits to prior 1N-E mapping document
- validator scripts
- parser code
- parser dependencies
- converter code
- JSON artifacts produced by automation
- template rewrites
- template fixtures
- conversion fixtures
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

**1. Implement converter now.**
- Why tempting: Category A templates have clear artifact targets.
- Why rejected now: No conversion design exists. No field mapping rules exist. No Owner authorization exists. Implementing a converter before design would pre-answer governance questions.
- Later phase: Only after Owner-authorized Hermes conversion design.

**2. Implement Markdown parser now.**
- Why tempting: A parser could extract structured data from Markdown.
- Why rejected now: PNPD-OS has no runtime parser dependencies. Adding one requires dependency policy review. The no-parser strategy demonstrates that a parser is not required for conversion.
- Later phase: Only if Hermes design proves a parser is necessary and safe.

**3. Validate Markdown directly now.**
- Why tempting: Could catch drafting errors early.
- Why rejected now: Markdown validation is a different problem than JSON schema validation. No rules, no fixtures, no parser, no integration boundary exist.
- Later phase: Only after Hermes design proves Markdown validation is safe and necessary.

**4. Generate JSON artifacts now.**
- Why tempting: Category A templates could produce draft JSON artifacts.
- Why rejected now: No conversion design exists. Generated JSON without governance creates false artifact evidence. Manual transformation is the safest path.
- Later phase: After conversion design and Owner authorization.

**5. Add conversion fixtures now.**
- Why tempting: Could test conversion correctness.
- Why rejected now: No converter exists. Fixtures without a converter test nothing.
- Later phase: After conversion implementation exists.

**6. Edit templates for conversion now.**
- Why tempting: Could make templates more machine-friendly.
- Why rejected now: Templates are human drafting aids. Editing them for machine convenience before any machine path exists is premature optimization.
- Later phase: Only after conversion design defines required template structure.

**7. Add CI conversion checks now.**
- Why tempting: Could enforce conversion discipline.
- Why rejected now: No conversion exists. No validation exists. CI checks for nonexistent processes create blocking friction with no benefit.
- Later phase: After conversion and validation integration.

**8. Add package scripts now.**
- Why tempting: Could provide a `npm run convert-template` command.
- Why rejected now: No conversion implementation exists. A package script with no backing implementation is misleading.
- Later phase: After conversion implementation.

**9. Change schemas for conversion now.**
- Why tempting: Could add fields to support template-to-artifact mapping.
- Why rejected now: Schema changes require Hermes design, fixture updates, and validator updates. The conversion boundary does not authorize schema changes.
- Later phase: Through normal Hermes schema design phases.

**10. Treat mapping as conversion now.**
- Why tempting: The mapping matrix looks like a conversion specification.
- Why rejected now: Mapping is advisory classification, not conversion logic. Category A does not mean convertible. Conversion requires design, not mapping.
- Later phase: Mapping may inform conversion design, but is not itself conversion.

**11. Treat manual transformation as registry evidence now.**
- Why tempting: A manually prepared JSON artifact seems like registry-ready state.
- Why rejected now: Registry entries require validated artifacts, Owner review, and Codex audit. Manual transformation is a drafting method, not registry authorization.
- Later phase: Registry entries follow their own governance (Phase 1O).

**12. Create product-delivery registry state now.**
- Why tempting: Could demonstrate the full pipeline.
- Why rejected now: Creating registry state without validated artifacts, Owner review, and Codex audit would create false governance evidence.
- Later phase: Registry state is created only through governed phases.

**13. Reopen Phase 1Q.**
- Why tempting: The conversion boundary raises questions about bug forecast artifact conversion.
- Why rejected now: Phase 1Q is stopped. Bug forecast governance is separate. The conversion boundary concerns product delivery (1N track), not bug forecasting (1Q track).
- Later phase: Not applicable unless a real defect is discovered in Phase 1Q schemas, fixtures, or validators.

**14. Claim production or adoption readiness.**
- Why tempting: A conversion boundary looks like delivery infrastructure.
- Why rejected now: Delivery readiness requires validated artifacts, registry entries, and Owner-authorized dispatch. A boundary document provides none of these.
- Later phase: Delivery readiness is a separate gated phase.

## 15. Drift Risk Register

| # | Risk | Mitigation |
|---|---|---|
| 1 | Conversion boundary mistaken for converter | Document explicitly states no conversion implementation. |
| 2 | No-parser strategy mistaken for no-review strategy | Manual transformation requires human review, Owner review, and Codex audit. |
| 3 | Manual transformation mistaken for registry evidence | Manual transformation is a drafting method, not registry authorization. |
| 4 | Mapping matrix mistaken for conversion implementation | Mapping is advisory, not executable. |
| 5 | Generated JSON artifacts created prematurely | No JSON artifacts are generated in 1N-F. |
| 6 | Parser creep | No parser dependency exists. No parser is authorized. No-parser strategy is explicit. |
| 7 | Fixture creep | No fixtures are created. No fixture strategy is implemented. |
| 8 | CI drift | No CI changes. No CI enforcement is added. |
| 9 | Package drift | No package changes. No scripts are added. |
| 10 | Schema drift | No schema edits. No new artifact types are registered. |
| 11 | Template rewrite drift | No template is edited. Templates remain as-is. |
| 12 | Registry authority creep | No registry writes. No registry state is created. |
| 13 | Generated state creep | No `.pnpd` state is generated. |
| 14 | Delivery evidence overclaim | No delivery readiness claim. No production readiness claim. |
| 15 | Adoption readiness overclaim | No adoption readiness claim. |
| 16 | Phase 1Q reopening | 1N-F is product delivery track (1N), not bug forecast track (1Q). |
| 17 | AgentBridge authority creep | No AgentBridge authority changes. |

## 16. Gates And Non-Goals

This phase:

- produces exactly one docs-only file: `docs/pnpd/product-template-conversion-boundary.md`
- makes no schema edits
- makes no validator edits
- makes no parser edits
- makes no converter edits
- makes no template edits
- makes no fixture edits
- makes no package edits
- makes no CI edits
- adds no dependency additions
- creates no generated state
- creates no JSON artifacts produced by automation
- implements no validation
- implements no conversion
- authorizes no registry writes
- makes no adoption readiness claim
- makes no production readiness claim

The conversion boundary is documentation. It is advisory. It constrains future design. It is not a runtime component. It is not a build artifact. It is not a governed registry entry. It is Owner-gated and Codex-gated for any future material change.
