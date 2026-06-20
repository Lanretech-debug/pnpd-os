# Phase 1O-X CI Integration Design

## 1. Current Verdict

PHASE_1O_X_CI_INTEGRATION_DESIGN_DRAFTED_PENDING_CODEX_AUDIT

This is a docs-only CI integration design.

It introduces no CI workflow change.
It introduces no package.json change.
It introduces no npm script change.
It introduces no validator behavior.
It introduces no fixture behavior.
It introduces no runtime behavior.
It introduces no production readiness.

## 2. Baseline

- Repo: Lanretech-debug/pnpd-os
- Branch baseline: main
- Baseline commit: 4efbba56823257ee9fe7e3e1e2178ecd7753b3e8
- Baseline verdict: PHASE_1O_W_PACKAGE_SCRIPT_LOCAL_WRAPPERS_PUSHED_CI_GREEN
- Remote CI: PNPD CI run 27868965459, completed, success
- Known local caveat: npm run dry-run may report PASS_WITH_KNOWN_LOCAL_NEEDS_TRIAGE_CAVEAT due to protected main plus known untracked files (.DS_Store, .kunsdd/, index.html)

## 3. Purpose

This design evaluates whether future CI should run the local Product Delivery Registry package scripts added in Phase 1O-W.

This document is planning only and does not authorize CI implementation. Any CI workflow change must be deferred to a later Owner-approved phase. All CI job names, gate placements, and commands described herein are labelled candidate/proposed only.

## 4. Existing Local Script Surface

Phase 1O-W delivered the following package scripts. Each was verified against the current package.json and validator --help output during Phase 1O-X document generation.

- npm run validate:pdr
  Command: npm run validate:pdr:fixtures && npm run validate:pdr:examples

- npm run validate:pdr:fixtures
  Command: node scripts/pnpd-validate-schemas.mjs --phase 1o

- npm run validate:pdr:examples
  Command: node scripts/pnpd-validate-schemas.mjs --phase 1o-example

These scripts are local wrappers over existing validator commands.

They do not accept path arguments.
They do not validate registry artifact paths.
They do not check artifact hashes.
They do not mutate files.

The scripts are not wired into npm run validate, npm run dry-run, or npm test beyond npm run validate:pdr being a separate, explicitly-named script.

## 5. Current CI Position

The current CI workflow at .github/workflows/pnpd-ci.yml was inspected for this design. It contains a single job (validate-and-dry-run) with the following steps:

- Checkout
- Setup Node.js 22
- Show repository status (git status --short --branch)
- Verify schemas and fixtures (npm run validate)
- Run local dry-run (npm run dry-run)
- Validate PNPD runtime readiness schema and fixtures (node scripts/pnpd-validate-schemas.mjs --phase 1h)
- Validate PNPD runtime readiness stdout report
- Validate PNPD runtime readiness local write mode
- Smoke PNPD runtime readiness incompatible flags
- Clean PNPD generated state
- Verify no PNPD state directories
- Verify clean working tree (git diff --exit-code)

No Product Delivery Registry validation step exists in the current CI workflow.

Phase 1O-X does not change CI.
Any future CI wiring must be Owner-approved separately.
This document only defines candidate integration shapes.

## 6. Candidate CI Integration Shapes

All shapes described below are candidate/proposed only. None are implemented in Phase 1O-X. None are authorized.

### Candidate A: Add npm run validate:pdr as a single CI step

Intended purpose: Run both PDR fixture and example validation as one CI step after existing validation gates.

Failure visibility: A single step failure would indicate that either fixture validation or example validation failed, but would not distinguish which without inspecting the step log.

Blast radius: Low. The step runs only the existing local wrapper. It does not change validator behavior, fixtures, or package.json.

Governance risk: Low-Moderate. Adding npm run validate:pdr as a CI step may be misinterpreted as elevating PDR validation to a CI gate, even though it is still a local convenience wrapper. The step name and placement should make clear it is advisory.

Recommendation status: Candidate only. Not recommended as the first choice because failure isolation is coarser than Candidate B.

### Candidate B: Add npm run validate:pdr:fixtures and npm run validate:pdr:examples as separate CI steps

Intended purpose: Run fixture validation and example validation as independent CI steps so that failure isolation is explicit.

Failure visibility: A failure in the fixtures step would immediately signal a shape fixture regression. A failure in the examples step would signal an example fixture regression. The two are independent.

Blast radius: Low. Same wrapper commands as Candidate A, but with clearer failure attribution.

Governance risk: Low. Separate steps are easier to audit and less likely to be misinterpreted as a single monolithic gate.

Recommendation status: Candidate/proposed. This is the recommended future shape if Owner later approves CI integration.

### Candidate C: Do not wire PDR scripts into CI yet; keep them local-only

Intended purpose: Preserve the status quo. PDR scripts remain local-only convenience wrappers. CI continues with its current step set unchanged.

Failure visibility: None in CI. PDR validation failures would only be visible when an operator runs the scripts locally.

Blast radius: Zero. No CI change.

Governance risk: None. No CI authority is asserted for PDR scripts.

Recommendation status: Candidate/proposed. This is the safest current posture and is the de facto state of Phase 1O-X.

No candidate includes executable YAML. No candidate is implemented here.

## 7. Recommended Future CI Shape

If the Owner later approves CI integration, the recommended shape is:

- A future phase may add separate CI steps for npm run validate:pdr:fixtures and npm run validate:pdr:examples, rather than only npm run validate:pdr, because separate steps improve failure isolation.
- The future phase should not expand npm run validate unless separately approved.
- The future phase should not add registry/artifact/hash argument scripts.
- The future phase should not change package.json.
- The future phase should touch only the relevant CI workflow file if Owner approves.

The recommended placement is after the existing verify schemas and fixtures step and before or after the existing runtime readiness steps, depending on whether PDR validation is considered a schema/fixture gate or a separate registry gate. The exact placement must be decided in the implementation phase with Owner guidance.

## 8. Rejected CI Behaviors

The following behaviors are rejected for Phase 1O-X and for any future CI integration unless a later Owner-approved phase explicitly reverses:

- silently expanding npm run validate to include PDR phases
- immediate CI implementation in this phase
- adding argument-taking registry/artifact/hash scripts
- validating live registry state in CI
- generating registry state in CI
- mutating artifacts in CI
- verifying hashes without path design
- dispatch/deployment/release hooks
- production readiness claims
- GitHub/API mutation
- runtime or writer consumption

## 9. Authority and Governance

The following authority chain governs CI integration work:

- Hermes designs.
- Owner approves, amends, or rejects.
- DeepSeek implements only the approved scope.
- Codex audits.
- Codex may merge or push only when the Owner prompt explicitly contains AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED.
- Codex has no standing merge or push authority.
- CI implementation requires a later Owner-approved phase.
- package.json expansion requires a later Owner-approved phase.
- registry/artifact/hash argument behavior requires a later Owner-approved phase.

## 10. Non-Goals

Phase 1O-X explicitly does not:

- no CI workflow change
- no package.json change
- no npm script change
- no validator code change
- no fixture change
- no dependency or lockfile change
- no registry state
- no writer/runtime implementation
- no dispatch
- no deployment/release
- no GitHub/API mutation
- no production readiness
- no Phase 1O-Y work

## 11. Risks

- Design misread as CI authorization. Operators or future agents may treat this design document as authorization to implement CI changes. The document header verdict (DRAFTED_PENDING_CODEX_AUDIT) and repeated candidate/proposed labelling are intended to prevent this, but misinterpretation risk remains.
- CI blast-radius creep. If npm run validate:pdr is later added as a single step and later expanded, the blast radius of a PDR validation failure could grow without explicit review.
- Failure isolation ambiguity if only npm run validate:pdr is used. A single step combining fixtures and examples makes it harder to determine which sub-validation failed without inspecting the step log.
- Script drift if package scripts change before CI implementation. If Phase 1O-W scripts are renamed, re-scoped, or removed before CI integration occurs, any CI design that references the current script names will be stale.
- Documentation drift between usage guide and package.json. The Phase 1O-U usage guide documents validator surfaces directly; the Phase 1O-V wrapper design documents candidate wrappers; Phase 1O-W implemented selected wrappers in package.json; this Phase 1O-X design references the Phase 1O-W wrappers. Any change to the wrapper layer must propagate through all four documents to avoid inconsistency.
- Node.js GitHub Actions deprecation warning remains a separate non-blocking CI hygiene concern. The actions/setup-node@v4 action may produce deprecation notices for older Node.js versions in the future. This is unrelated to PDR CI integration and remains a general CI maintenance item.

## 12. Final Recommendation

Phase 1O-X should remain docs-only.

The recommended next implementation phase, if Owner approves later, is a narrow CI workflow design implementation that adds only explicit PDR validation steps and does not expand npm run validate, package.json, validator code, fixtures, registry state, runtime, writer, dispatch, or deployment behavior.
