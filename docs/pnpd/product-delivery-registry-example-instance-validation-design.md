# Product Delivery Registry Example Instance Validation Design

## Status

| Field | Value |
|---|---|
| Phase | `PHASE_1O_Q_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_VALIDATION_DESIGN` |
| Source | `HERMES_PHASE_1O_Q_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_IMPLEMENTATION_READINESS_DESIGN_READY` |
| Status | design-only |
| Implementation | not started |
| Validator change | not implemented in this phase |
| Example fixture | not created in this phase |
| Registry JSON | not created in this phase |
| DeepSeek Verdict (expected) | `DEEPSEEK_PHASE_1O_Q_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_VALIDATION_DESIGN_COMMITTED_AMBER_NOT_CODEX_AUDITED` |
| Commit message (expected) | `docs: add product delivery registry example instance validation design` |
| Branch | `deepseek/phase1o-q-product-delivery-registry-example-instance-validation-design` |

## Purpose

This document designs the validation and discovery readiness path required before a future Product Delivery Registry example fixture can be safely created and tracked. The Phase 1O-G example-instance design is complete, but it left open a critical gate: the current validator does not perform full JSON Schema instance validation against `.pnpd/product-delivery-registry.schema.json`, and it does not discover fixtures outside the hardcoded `positive/` and `negative/` subdirectories. A future example fixture must not be committed before CI can discover it and prove it conforms to the registry schema.

## Background

### 1O-G Is Closed

Phase 1O-G (`PHASE_1O_G_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_DESIGN`) was deferred early in the Product Delivery Registry chain because no registry writer existed. After the create-only writer (1O-M) and append-only writer (1O-O) shipped, 1O-G was revisited via reconciliation (1O-P) and completed. 1O-G documented the shape, entry types, writer strategy, tracking location options, and governance boundaries for a future example instance.

### Remaining Risk From 1O-G

The 1O-G design explicitly noted:

> Arbitrary registry schema-instance validation remains a separate future gate.

Codex confirmed this as the remaining risk: a future example registry fixture would be a new JSON file with no existing validation path. The current validator cannot prove that an arbitrary registry instance conforms to the registry JSON Schema. Creating the example fixture before closing this gap would introduce an untested, unvalidated JSON fixture into the repository.

### This Phase (1O-Q)

This design documents the validator discovery and schema-instance validation changes needed before the example fixture can be created. It does not implement those changes. It does not create any fixture. It defines the future implementation scope, justifies the preferred approach, and provides traceable prerequisites for the example fixture phase.

## Baseline

| Field | Value |
|---|---|
| Branch | `main` |
| Commit | `5c5766cbc8214fcfaecce0831ec59bb3b37e7a88` |
| Short commit | `5c5766c` |
| Commit message | `merge: Phase 1O-G PNPD product delivery registry example instance design into main` |
| Latest closed phase | `PHASE_1O_G_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_DESIGN_PUSHED_REMOTE_CI_PASS` |
| Remote CI workflow | `PNPD CI` |
| Remote CI run ID | `27834921007` |
| Remote CI branch | `main` |
| Remote CI event | `push` |
| Remote CI status | `completed` |
| Remote CI conclusion | `success` |
| Remote CI created | `2026-06-19T15:36:20Z` |
| Remote CI updated | `2026-06-19T15:36:36Z` |

## Current Completed Capabilities

The Product Delivery Registry chain is complete through Phase 1O-G. The completed phases are:

1. `PHASE_1O_A_PRODUCT_DELIVERY_REGISTRY_DESIGN_PUSHED_REMOTE_CI_PASS`
2. `PHASE_1O_B_PRODUCT_DELIVERY_REGISTRY_SCHEMA_PUSHED_REMOTE_CI_PASS`
3. `PHASE_1O_C_PRODUCT_DELIVERY_REGISTRY_FIXTURES_PUSHED_REMOTE_CI_PASS`
4. `PHASE_1O_D_PRODUCT_DELIVERY_REGISTRY_VALIDATOR_PUSHED_REMOTE_CI_PASS`
5. `PHASE_1O_E_PRODUCT_DELIVERY_REGISTRY_LOCAL_STATE_POLICY_PUSHED_REMOTE_CI_PASS`
6. `PHASE_1O_F_PRODUCT_DELIVERY_REGISTRY_DATA_CONVENTION_PUSHED_REMOTE_CI_PASS`
7. `PHASE_1O_G_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_DESIGN_PUSHED_REMOTE_CI_PASS`
8. `PHASE_1O_H_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_DESIGN_PUSHED_REMOTE_CI_PASS`
9. `PHASE_1O_I_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_PUSHED_REMOTE_CI_PASS`
10. `PHASE_1O_J_PRODUCT_DELIVERY_REGISTRY_HASH_INTEGRITY_VERIFICATION_DESIGN_PUSHED_REMOTE_CI_PASS`
11. `PHASE_1O_K_PRODUCT_DELIVERY_REGISTRY_HASH_INTEGRITY_VERIFICATION_PUSHED_REMOTE_CI_PASS`
12. `PHASE_1O_L_PRODUCT_DELIVERY_REGISTRY_WRITER_DESIGN_PUSHED_REMOTE_CI_PASS`
13. `PHASE_1O_M_PRODUCT_DELIVERY_REGISTRY_WRITER_PUSHED_REMOTE_CI_PASS`
14. `PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN_PUSHED_REMOTE_CI_PASS`
15. `PHASE_1O_O_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_PUSHED_REMOTE_CI_PASS`
16. `PHASE_1O_P_PRODUCT_DELIVERY_REGISTRY_NEXT_STEP_RECONCILIATION_READY`

The current capabilities include:

- **Registry schema**: `.pnpd/product-delivery-registry.schema.json` — committed and tracked.
- **Registry fixtures**: Shape, artifact-reference, hash-integrity, writer, and append fixture families.
- **Validator**: `scripts/pnpd-validate-schemas.mjs` — supports `--phase 1o` for fixture validation and `--product-delivery-registry <path>` for standalone registry validation.
- **Artifact-reference validation**: Confirms referenced artifact files exist and are regular files.
- **Hash integrity verification**: Confirms `contentHash` matches referenced file bytes.
- **Create-only writer**: `scripts/pnpd-product-delivery-registry-write.mjs` creates a new registry from a single entry.
- **Append-only writer**: The writer appends additional entries to an existing valid registry.
- **Local state policy**: `.pnpd/product-delivery-registry/` is gitignored and absent.
- **Data convention**: Defines registry data shape and governance constraints.
- **1O-G example-instance design**: Documents future example instance shape, writer strategy, and tracking options.

## Current Fixture Inventory

The Product Delivery Registry fixture suite consists of the following correct counts:

| Fixture family | Count | Description |
|---|---|---|
| Shape positive | 6 | Valid registries exercising different entry types |
| Shape negative | 15 | Invalid registries exercising schema violations |
| Artifact-reference | 3 | Fixtures for artifact reference validation |
| Hash-integrity JSON | 4 | Fixtures for hash integrity verification |
| Hash support file | 1 | Support file for hash integrity tests |
| Writer entry | 4 | Entry fixtures for create-only writer tests |
| Append entry | 2 | Entry fixtures for append-only writer tests |

In summary: 21 shape fixtures (6 positive, 15 negative), 3 artifact-reference fixtures, 4 hash-integrity JSON fixtures, 1 hash support file, 4 writer entry fixtures, and 2 append entry fixtures.

## Current Validator Discovery Model

### Phase 1O (`--phase 1o`)

When invoked with `--phase 1o`, the validator performs fixture-based validation for the Product Delivery Registry. It discovers fixtures as follows:

1. Reads `tests/fixtures/pnpd/product-delivery-registry/positive/*.json`.
2. Reads `tests/fixtures/pnpd/product-delivery-registry/negative/*.json`.
3. Expects exactly 21 fixture files (6 positive, 15 negative).
4. Cross-checks discovered files against the hardcoded `REGISTRY_POSITIVE_FIXTURES` and `REGISTRY_NEGATIVE_FIXTURES` sets.
5. Fails if any expected fixture is missing or any unexpected fixture is present.

The validator currently does **not** discover:

- `examples/` (any subdirectory)
- `extra/` (any subdirectory)
- `generated/` (any subdirectory)
- `writer/` or `writer/append/` subdirectories (these contain entry-level JSON, not full registries; they are ignored by the discovery scan)
- Arbitrary registry fixture paths outside `positive/` and `negative/`

### Hardcoded Fixture Count Enforcement

The validator enforces `fixtureFiles.length !== 21` as a hard failure. This means any change to the number of files in `positive/` or `negative/` — including adding a 7th positive fixture or removing a negative fixture — will break validation. Fixture count changes must be explicit, audited, and reflected in the hardcoded sets.

## Current Standalone Registry Validation Model

### `--product-delivery-registry <path>`

When invoked with `--product-delivery-registry <path>`, the validator performs inline structural, semantic, governance, and security checks on a single registry JSON file. It applies:

- Structural checks: required fields, field types, artifact type enumeration, validation status enumeration.
- Governance checks: all `false`-const fields (`authorizesImplementation`, `codexIsOwner`, `agentBridgeCanApprove`, `runtimeConsumptionAllowed`, `authorizesDeployment`, etc.) and `true`-const fields (`advisoryOnly`, `ownerFinalAuthority`).
- Forbidden-field scan: checks for disallowed top-level and nested properties.
- Security scan: checks for secret-like values (API keys, tokens, private keys).
- Optional artifact-reference validation: `--check-registry-artifacts` confirms each entry's `path` points to an existing regular file.
- Optional hash integrity verification: `--verify-registry-artifact-hashes` computes SHA-256 of referenced files and compares to recorded `contentHash`.

### What It Does Not Do

The standalone registry validation does **not** apply full JSON Schema instance validation against `.pnpd/product-delivery-registry.schema.json`. The inline checks are a manually maintained subset of the schema constraints. This creates the following gap:

- Inline checks may not exactly mirror JSON Schema constraints.
- Inline checks may miss pattern, enum, const, `additionalProperties`, `minItems`, `maxItems`, `$ref`-based, or conditional schema mismatches.
- Inline checks do not prove that an arbitrary registry instance conforms to the canonical schema file.
- If the schema is updated, inline checks must be manually synchronized; there is no automated mechanism to ensure parity.

## Schema-Instance Validation Gap

The gap between inline checks and full JSON Schema instance validation is the core risk that must be closed before an example fixture can be committed.

### Why Inline Checks Are Insufficient

1. **Coverage drift**: Inline checks are maintained separately from the JSON Schema. A schema update does not automatically update the inline checks, and vice versa. Over time, the two may diverge.
2. **Schema constraint gaps**: The JSON Schema defines constraints via `pattern`, `enum`, `const`, `additionalProperties`, `$ref`, `if/then/else`, and nested type definitions. Inline checks implement a subset. Any constraint not manually coded in inline checks is unenforced.
3. **Proof of conformance**: Without JSON Schema validation, there is no automated proof that a registry instance conforms to the canonical schema. Manual review cannot reliably detect all schema violations.
4. **New fixture assurance**: A future example fixture introduces a new JSON file. Validating it exclusively through inline checks provides weaker assurance than validating it against the canonical schema.

### What Schema-Instance Validation Must Achieve

A future schema-instance validation gate must:

1. Load `.pnpd/product-delivery-registry.schema.json` as a JSON Schema document.
2. Load the example registry fixture as a JSON instance.
3. Validate the instance against the schema using a JSON Schema validator.
4. Report all schema violations with clear paths and messages.
5. Be deterministic (same input produces same output).
6. Be local (no network calls, no external services).
7. Resolve all `$ref` references within the schema locally.

## Future Example Fixture Location Options

The 1O-G design identified two tracking location options. This section evaluates each against the current validator discovery model and the schema-instance validation gap.

| Option | Path | Currently discovered by CI? | Validator changes required? | Notes |
|---|---|---|---|---|
| A. Dedicated examples directory | `tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json` | No | Yes — requires discovery path addition | Clean separation from shape fixtures; does not break positive/negative count |
| B. 7th positive fixture | `tests/fixtures/pnpd/product-delivery-registry/positive/example-multi-entry-registry.json` | Partially | Yes — requires hardcoded set update and count change | Changes fixture count from 21 to 22; mixes example with shape fixtures; risks fixture count enforcement breakage |
| C. Docs-only example | `docs/pnpd/` (description-only, no JSON) | No | No | No JSON artifact to validate; no CI coverage; no toolchain provenance |
| D. Generated local-state example | `.pnpd/product-delivery-registry/example-multi-entry-registry.json` | No | Yes — requires generated-state discovery | Gitignored; not tracked; not auditable; defeats the purpose of a tracked example |

### Evaluation

Option A (dedicated `examples/` directory) is the recommended path. It keeps the example separate from the 21 shape fixtures, avoids breaking hardcoded fixture count enforcement, and provides a clean namespace for future examples.

Option B (7th positive fixture) is not recommended because it changes the shape fixture count and mixes example with shape-testing fixtures. The shape fixtures validate basic schema structure; an example fixture validates toolchain composition. These are distinct purposes.

Option C (docs-only) avoids the validation gap entirely but provides no CI coverage and no toolchain provenance. It does not close the risk identified by Codex.

Option D (local state) is not tracked and not auditable.

## Recommended Future Fixture Location

The recommended future location is:

`tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json`

This path:
- Is tracked in the repository.
- Is discoverable by CI once validator discovery is extended.
- Does not disturb the 21 shape fixtures.
- Provides a clear namespace for future additional examples.
- Enables automated schema-instance validation and artifact-reference validation.

This path requires validator discovery support before the fixture is created (see Future Implementation Prerequisites).

## Future Validation Strategy

The future validation path for the example fixture should:

1. **Discovery**: The validator discovers JSON files under `tests/fixtures/pnpd/product-delivery-registry/examples/` (or the chosen path).
2. **Schema-instance validation**: The validator applies full JSON Schema instance validation against `.pnpd/product-delivery-registry.schema.json`.
3. **Inline structural/governance/security checks**: The validator applies the existing `checkRegistryPositiveFixture` and security scans as a defense-in-depth layer.
4. **Artifact-reference validation (optional)**: If the example fixture references external artifact files, `--check-registry-artifacts` confirms they exist and are regular files.
5. **Hash verification (optional)**: If the example fixture records `contentHash` values, `--verify-registry-artifact-hashes` confirms they match referenced file bytes.
6. **Deterministic and local**: All checks run without network access. Output is deterministic.

### Validation Sequence

```
1. Load schema: .pnpd/product-delivery-registry.schema.json
2. Load instance: tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json
3. Validate instance against schema (JSON Schema)
4. Run inline structural/governance/security checks (defense-in-depth)
5. Run optional artifact-reference validation
6. Run optional hash integrity verification
7. Report pass/fail with clear diagnostic messages
```

## JSON Schema Instance Validation Strategy

### Dependency Selection

The repository does not currently include a JSON Schema validator dependency (no `ajv` in `package.json`). The preferred JSON Schema validator for Node.js is `ajv` (Another JSON Schema Validator). However, adding a dependency requires a separate audit and owner approval. This design does not add the dependency.

If `ajv` is approved for use:
- It supports JSON Schema draft 2020-12 (matching the current schema's `$schema`).
- It resolves `$ref` references locally when configured with `addSchema`.
- It provides structured error output with instance paths.
- It is widely used and well-maintained.

If `ajv` is not approved, alternatives include:
- Native Node.js validation using the existing inline-check pattern (weaker, but no new dependency).
- A lightweight manual JSON Schema validator (high implementation cost, high risk of bugs).

### Schema Reference Resolution

The schema file `.pnpd/product-delivery-registry.schema.json` uses `$ref` references to `$defs` within the same document. These are local references (e.g., `#/$defs/repo`, `#/$defs/governance`). A JSON Schema validator must resolve these locally without fetching external schemas. `ajv` supports this natively.

## Proposed Validator Interface Options

| Option | Command | Pros | Cons |
|---|---|---|---|
| A. Extend `--phase 1o` | `--phase 1o` (automatically discovers examples) | No new flag; CI already invokes `--phase 1o` | Changes existing behavior; risks fixture count enforcement breakage; mixes example validation with shape-fixture validation |
| B. New `--phase 1o-example` | `--phase 1o-example` | Explicit opt-in; does not affect existing `--phase 1o`; clear purpose | Requires CI update to invoke new phase; new flag to document |
| C. Extend `--product-delivery-registry` | `--product-delivery-registry <path> --validate-schema-instance` | Reuses existing standalone path; explicit schema-instance flag | Flag proliferation; schema-instance validation should arguably be the default for standalone validation |
| D. Default discovery for examples | No new flag; validator automatically discovers `examples/` in addition to `positive/` and `negative/` | Minimal interface change | Changes existing behavior silently; harder to audit; risks unexpected fixture count changes |

## Recommended Validator Interface

The recommended approach is **Option B: `--phase 1o-example`** with **Option C as fallback**.

### Primary: `--phase 1o-example`

```
node scripts/pnpd-validate-schemas.mjs --phase 1o-example
```

This flag:
- Targets example fixtures under `tests/fixtures/pnpd/product-delivery-registry/examples/`.
- Applies full JSON Schema instance validation against `.pnpd/product-delivery-registry.schema.json`.
- Applies inline structural/governance/security checks as defense-in-depth.
- Can optionally accept `--check-registry-artifacts` and `--verify-registry-artifact-hashes`.
- Does not affect `--phase 1o` behavior.
- Keeps example validation separate from shape-fixture validation.

### Fallback: `--validate-schema-instance`

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json --validate-schema-instance
```

If a new `--phase 1o-example` flag is not preferred, schema-instance validation can be added as an optional flag to the existing `--product-delivery-registry` standalone path. This reuses the existing interface and adds the schema-instance gate as a composable option.

### Justification

Option B is preferred because:
1. It avoids changing the stable `--phase 1o` behavior.
2. It provides an explicit, auditable command for example validation.
3. It can be integrated into CI with a single additional line (`node scripts/pnpd-validate-schemas.mjs --phase 1o-example`).
4. It does not mix example fixtures with shape fixtures.
5. It keeps the fixture count at 21 for `--phase 1o`.

## CI Discovery Strategy

### Current CI

The current `npm run validate` script invokes the validator for multiple phases but does **not** include `--phase 1o` in the default chain. Phase 1O validation is invoked explicitly via `node scripts/pnpd-validate-schemas.mjs --phase 1o`. The `.github/workflows/pnpd-ci.yml` invokes both `npm run validate` and the explicit `--phase 1o` command.

### Future CI Integration

The recommended first implementation for the example validation phase should:

1. **Not** alter `npm run validate` in its initial commit. The `npm run validate` script is stable and should only change when explicitly authorized.
2. Add an explicit CI step: `node scripts/pnpd-validate-schemas.mjs --phase 1o-example`.
3. Run this step after the existing `--phase 1o` step.
4. Document the new step in the implementation commit.

### Separate Integration Gate

CI integration for `--phase 1o-example` should be a separate, explicitly authorized change from the validator implementation itself. This prevents accidental CI scope creep and keeps each change auditable.

## Fixture Count Strategy

The current 21 shape fixture count must not silently change. Future example fixtures under `examples/` should:

1. Be discovered separately from `positive/` and `negative/`.
2. Not increment the `REGISTRY_POSITIVE_FIXTURES` or `REGISTRY_NEGATIVE_FIXTURES` sets.
3. Not affect the `fixtureFiles.length !== 21` enforcement in `--phase 1o`.
4. Have their own expected count (initially 1) enforced in `--phase 1o-example`.
5. If the count changes (e.g., a second example is added), the change must be explicit, audited, and reflected in the hardcoded set for `--phase 1o-example`.

## Future Example Fixture Implementation Prerequisites

Before the example fixture (`tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json`) can be created, the following must be true:

1. Validator discovery for `examples/` is implemented and passing.
2. Schema-instance validation gate is implemented and passing.
3. The target example path is chosen and documented.
4. The CI or explicit gate command (`--phase 1o-example`) is defined and working locally.
5. A Codex audit of the validator implementation is passed.
6. The owner approves example fixture creation.

The example fixture must not be created before all prerequisites are met.

## Future Implementation Sequence

The recommended sequence for closing the validation gap and creating the example fixture:

1. **1O-R**: Validator schema-instance validation and example discovery implementation.
2. **1O-S**: Tracked example registry fixture implementation (generated via create+append writer, validated with the new gates).

This sequence ensures the validation infrastructure exists before the fixture depends on it.

## Future 1O-R Candidate

A future implementation phase that adds schema-instance validation and example discovery to the validator.

| Field | Value |
|---|---|
| Phase | `PHASE_1O_R_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_VALIDATION` |
| Branch | `deepseek/phase1o-r-product-delivery-registry-example-instance-validation` |
| Expected verdict | `DEEPSEEK_PHASE_1O_R_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_VALIDATION_COMMITTED_AMBER_NOT_CODEX_AUDITED` |
| Expected commit message | `feat: add product delivery registry example instance validation` |
| Allowed files | `scripts/pnpd-validate-schemas.mjs` |
| Forbidden files | fixtures, schema, writer, CI, package.json, registry local state, daemon/control harness |
| Scope | Add `--phase 1o-example` flag, example discovery, JSON Schema instance validation, and explicit gate command |
| Does not create | example fixture, registry JSON, local registry state |
| Does not modify | writer code, schema, shape fixtures, package scripts, CI |

## Future 1O-S Candidate

A future implementation phase that creates the tracked multi-entry example registry fixture.

| Field | Value |
|---|---|
| Phase | `PHASE_1O_S_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE` |
| Branch | `deepseek/phase1o-s-product-delivery-registry-example-instance` |
| Expected verdict | `DEEPSEEK_PHASE_1O_S_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_COMMITTED_AMBER_NOT_CODEX_AUDITED` |
| Expected commit message | `test: add product delivery registry example instance fixture` |
| Allowed files | `tests/fixtures/pnpd/product-delivery-registry/examples/example-multi-entry-registry.json` |
| Forbidden files | scripts, schema, writer, CI, package.json, registry local state, daemon/control harness |
| Scope | Generate and commit a multi-entry registry example via create+append writer; validate with `--phase 1o-example` |
| Does not modify | validator code, schema, shape fixtures, package scripts, CI |
| Does not authorize | runtime consumption, dispatch, deployment, GitHub/API mutation, production certification |

## Governance Boundary

The Product Delivery Registry remains advisory-only. Validation does not authorize any downstream action. Specifically:

- Validation does not authorize implementation.
- Validation does not authorize merge.
- Validation does not authorize dispatch.
- Validation does not authorize deployment.
- Validation does not authorize GitHub/API mutation.
- Validation does not certify production readiness.

All governance constants (`authorizesImplementation`, `codexIsOwner`, `agentBridgeCanApprove`, `runtimeConsumptionAllowed`, `authorizesDeployment`, `authorizesMerge`, `authorizesDispatch`, `authorizesGitHubMutation`, `authorizesApiMutation`, `certifiesProductionReadiness`) remain set to `false` in all registry entries, and this design does not relax any of them.

## Runtime Consumption Boundary

Runtime consumption remains blocked. This design phase does not implement a runtime reader, runtime consumer, or runtime integration. The registry continues to serve as a design-time, validation-time, and governance artifact only. Any future runtime consumption requires a separate design and implementation phase with explicit owner authorization.

## Dispatch / Deployment / GitHub API Boundary

Dispatch, deployment, and GitHub/API mutation remain blocked. The Product Delivery Registry does not trigger orchestration dispatch, does not deploy any artifact, and does not mutate any GitHub repository, issue, pull request, or API resource. This boundary is preserved in this design phase.

## Merge / Upsert / Replace / Delete Boundary

Merge, upsert, replace, and delete operations on the Product Delivery Registry remain deferred. The registry writer supports create-only and append-only modes. Any mutation beyond append requires a separate design and implementation phase with explicit owner authorization.

## Product Design Integrity / Asset Decisioning Boundary

Product Design Integrity and Asset Decisioning remain deferred. This design does not implement content validation of referenced artifacts, design consistency checks, or automated design decisioning. These capabilities require separate design phases.

## Daemon / Control Harness Boundary

The daemon/control harness is not next and remains deferred. This design does not implement a persistent process, scheduler, auto-dispatch, or control harness. These capabilities require separate design phases.

## Allowed Files For This Phase

Only one file may be created or modified in this phase:

- `docs/pnpd/product-delivery-registry-example-instance-validation-design.md`

## Forbidden Files For This Phase

The following files and directories must not be created or modified:

- `scripts/pnpd-validate-schemas.mjs`
- `scripts/pnpd-product-delivery-registry-write.mjs`
- `scripts/pnpd-orchestrator-dry-run.mjs`
- `.pnpd/product-delivery-registry.schema.json`
- `.pnpd/product-delivery-registry/`
- `.pnpd/product-delivery-registry/registry.json`
- Any file under `tests/fixtures/pnpd/product-delivery-registry/`
- `package.json`
- `.github/workflows/pnpd-ci.yml`
- `.gitignore`
- `README.md`
- Lockfiles (`package-lock.json`, `yarn.lock`, etc.)
- Generated reports
- Templates
- Examples
- Runtime, orchestrator, scheduler, or daemon files

## No-Drift Statement

This phase does not implement validator discovery.
This phase does not implement schema-instance validation.
This phase does not create an example fixture.
This phase does not create an example registry.
This phase does not create registry JSON.
This phase does not create local registry state.
This phase does not modify writer code.
This phase does not modify validator code.
This phase does not modify schema.
This phase does not modify fixtures.
This phase does not modify package scripts.
This phase does not modify CI.
This phase does not modify runtime/orchestrator.
This phase does not implement runtime consumption; runtime consumption remains blocked.
This phase does not implement dispatch.
This phase does not implement deployment.
This phase does not implement GitHub/API mutation.
This phase does not implement merge.
This phase does not implement upsert.
This phase does not implement replace.
This phase does not implement delete.
This phase does not implement Product Design Integrity.
This phase does not implement Asset Decisioning.
This phase does not implement daemon.
This phase does not implement control harness.
This phase does not claim production readiness.

## Local Gates For This Design Phase

The following local gates apply to this docs-only design phase:

```bash
# Baseline check
test "$(git rev-parse --short HEAD)" = "5c5766c"

# Design doc is the only change
git diff --check main...HEAD
git diff --name-only main...HEAD  # must show only the allowed design doc
git diff --name-status main...HEAD

# No forbidden file drift
! git diff --name-only main...HEAD | grep -E '^(scripts/|tests/|\.pnpd/|package\.json|\.github/|README\.md|templates/|examples/|\.gitignore$)'

# Content grep checks (see post-document gate script)
# No format noise: no emoji, pagination markers, banners
# No stale wording: no "24 shape fixtures", "4 append entry fixtures", etc.

# Registry state absent
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/product-delivery-registry/registry.json

# Existing scripts remain syntactically valid
node --check scripts/pnpd-product-delivery-registry-write.mjs
node --check scripts/pnpd-validate-schemas.mjs
node --check scripts/pnpd-orchestrator-dry-run.mjs

# All existing validation phases pass
node scripts/pnpd-validate-schemas.mjs
node scripts/pnpd-validate-schemas.mjs --phase 0
node scripts/pnpd-validate-schemas.mjs --phase 1b
node scripts/pnpd-validate-schemas.mjs --phase 1c
node scripts/pnpd-validate-schemas.mjs --phase 1f
node scripts/pnpd-validate-schemas.mjs --phase 1h
node scripts/pnpd-validate-schemas.mjs --phase 1m
node scripts/pnpd-validate-schemas.mjs --phase 1n
node scripts/pnpd-validate-schemas.mjs --phase 1o

npm run validate
npm run dry-run
npm test
```

## Remote CI Expectation

Phase 1O-Q is a docs-only change. The existing CI workflow (`pnpd-ci.yml`) validates:

- Schema and fixture validation (`npm run validate`)
- Dry-run orchestration (`npm run dry-run`)
- Phase 1O validation (`node scripts/pnpd-validate-schemas.mjs --phase 1o`)

Since no scripts, fixtures, or schemas change, CI should remain green after merge and push, identical to the baseline commit `5c5766c`.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Over-designing validator implementation | This design specifies "what" but defers "how" to 1O-R; the 1O-R implementer decides exact code structure |
| Creating example fixture before validation gate | Prerequisites section gate fixture creation behind validator implementation; Codex audit checklist includes this gate |
| Changing the 21 fixture count accidentally | Fixture count strategy keeps example fixtures in a separate `examples/` directory with separate discovery and count enforcement |
| Adding `ajv` dependency without audit | JSON Schema instance validation strategy flags the dependency gap; dependency choice is deferred to 1O-R with explicit audit requirement |
| Validating examples outside CI | CI discovery strategy defines an explicit CI step (`--phase 1o-example`) ensuring CI coverage |
| Implying runtime consumption is enabled | Runtime consumption boundary is explicitly stated as blocked; no-drift section restates it |
| Implying production readiness is achieved | Production certification boundary is explicitly stated as blocked; governance constants remain `false` |

## Owner Decisions Required

The following decisions are encoded in this design and require owner acknowledgment:

1. Approve this docs-only validation design.
2. Approve whether 1O-R should implement validator discovery and schema-instance validation.
3. Approve whether the example fixture waits until 1O-R is green and merged.
4. Approve whether schema-instance validation may use `ajv` if not already available (dependency audit required).
5. Confirm `--phase 1o-example` as the preferred validator interface (or select the fallback `--validate-schema-instance`).
6. Confirm `tests/fixtures/pnpd/product-delivery-registry/examples/` as the preferred fixture location.
7. Keep daemon/control harness deferred.
8. Keep merge/upsert/replace/delete deferred.
9. Keep runtime consumption, dispatch, deployment, and GitHub/API mutation blocked.

## Recommended Next Action

Codex formal audit of the Phase 1O-Q docs-only branch `deepseek/phase1o-q-product-delivery-registry-example-instance-validation-design`. After Codex passes, the branch may be merged to `main` and Phase 1O-R implementation may begin.

---

*This document is a design artifact. It does not implement validator changes, create fixtures, modify scripts, or authorize any downstream action.*
