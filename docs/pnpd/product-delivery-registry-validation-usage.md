# Product Delivery Registry Validation Usage Guide

## 1. Current Verdict

**PHASE_1O_U_PRODUCT_DELIVERY_REGISTRY_VALIDATION_USAGE_GUIDE_DRAFTED_PENDING_CODEX_AUDIT**

This is a docs-only usage guide. It introduces no validator behavior, no runtime behavior, and no production readiness.

## 2. Baseline

- **Repo:** Lanretech-debug/pnpd-os
- **Branch baseline:** main
- **Baseline commit:** `317c3f2795750da1f43bb8ec77a582084edb4e15`
- **Baseline verdict:** `PHASE_1O_T_PRODUCT_DELIVERY_REGISTRY_RECONCILIATION_PUSHED_CI_GREEN`
- **Remote CI:** PNPD CI run `27865961917`, completed, conclusion: success
- **Known local caveat:** `npm run dry-run` may report `NEEDS_TRIAGE` locally when main is protected and known untracked files (`.DS_Store`, `.kunsdd/`, `index.html`) make the worktree dirty. Remote CI is the source of truth for pushed baseline status.

## 3. Purpose

This guide provides an operator-facing reference for Product Delivery Registry validation surfaces already present in the repo. It covers current usage only and must not be treated as runtime, dispatch, deployment, or production authority.

## 4. Validator Surfaces

All surfaces below are verified by current `--help` output and runtime execution.

Default validator invocation:

```
node scripts/pnpd-validate-schemas.mjs
```

Product Delivery Registry validation phases:

```
node scripts/pnpd-validate-schemas.mjs --phase 1o
node scripts/pnpd-validate-schemas.mjs --phase 1o-example
```

Standalone registry path validation with optional flags:

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path>
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --validate-schema-instance
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --check-registry-artifacts
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --check-registry-artifacts --verify-registry-artifact-hashes
```

The validator also supports non-registry surfaces (`--runtime-readiness-report`, `--research-discovery-artifact`, `--product-delivery-artifact`, and additional `--phase` values) that are outside the Product Delivery Registry scope of this guide.

A separate Product Delivery Registry Writer exists at `scripts/pnpd-product-delivery-registry-write.mjs`. It is governed separately: it operates in dry-run mode by default, requires explicit `--write` for filesystem mutation, supports create-only and append-only modes, and has no merge, upsert, replace, update, or delete modes. Its usage is not covered in this validation-only guide and is not claimed as production-ready.

## 5. Common Usage Patterns

### Default Validator Run

Runs all default invariants (Phase 0 + Phase 1B + Phase 1C). This does not include Product Delivery Registry validation.

```
node scripts/pnpd-validate-schemas.mjs
```

### Phase 1O Shape Fixture Validation

Validates the registry schema and all shape fixtures (positive and negative).

```
node scripts/pnpd-validate-schemas.mjs --phase 1o
```

Reports: schema pass/fail, positive fixture counts, negative fixture rejection counts, forbidden-field scan, security scan.

### Phase 1O Example Fixture Validation

Discovers and validates example fixtures under the examples directory.

```
node scripts/pnpd-validate-schemas.mjs --phase 1o-example
```

Reports: number of examples discovered, pass/fail per example, summary counts.

### Standalone Registry Path Validation

Validates a registry file at an arbitrary path using the registry schema and governance rules.

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry path/to/registry.json
```

### Schema-Instance Validation

Performs structural schema validation of a registry JSON against the registry JSON Schema.

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry path/to/registry.json --validate-schema-instance
```

### Artifact Reference Validation

Checks that each entry path in the registry points to an existing regular file.

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry path/to/registry.json --check-registry-artifacts
```

### Hash Verification Validation

Requires `--check-registry-artifacts`. For each entry with an `integrity.contentHash` using `sha256`, verifies the hash against the actual file bytes.

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry path/to/registry.json --check-registry-artifacts --verify-registry-artifact-hashes
```

## 6. Fixture Taxonomy

The test fixtures under `tests/fixtures/pnpd/product-delivery-registry/` are organized into distinct categories.

### Shape Fixtures

Shape fixtures test the validator against curated valid and invalid registry shapes. They are exercised by `--phase 1o`.

- **Positive fixtures (6):** `positive/empty-registry.json`, `positive/one-architecture-spec-entry.json`, `positive/one-implementation-handoff-entry.json`, `positive/one-prd-entry.json`, `positive/one-product-spec-entry.json`, `positive/one-stale-entry.json`
- **Negative fixtures (15):** Files under `negative/` covering absolute paths, governance violations, extra properties, invalid validation status, missing fields, path traversal, schema version mismatch, secret-like fields, unsupported artifact types, URL paths, and forbidden authority claims such as `productionReady`, `runtimeConsumptionAllowed`, `agentBridgeCanApprove`, `authorizesImplementation`, and `codexIsOwner`.

Total shape fixtures: 21 (6 positive, 15 negative).

### Example Fixtures

Example fixtures are valid illustrative registries under `examples/`. They are exercised by `--phase 1o-example`.

- **Current baseline:** exactly one example fixture.
- **Path:** `tests/fixtures/pnpd/product-delivery-registry/examples/example-minimal-registry.json`

The `examples/` directory is for valid illustrative examples only. Negative test cases remain covered by shape fixtures under `--phase 1o`.

### Artifact Reference Fixtures

Located under `artifact-reference/`. These test `--check-registry-artifacts` behavior with positive (existing file) and negative (directory, missing file) cases. These fixtures are not exercised by `--phase 1o` or `--phase 1o-example`.

### Hash Integrity Fixtures

Located under `hash-integrity/`. These test `--verify-registry-artifact-hashes` behavior with valid SHA-256 hashes, hash mismatches, null hashes with SHA-256 algorithm, and skipped-none entries. A support file (`support/known-content.json`) provides known-content bytes for hash verification. These fixtures are not exercised by `--phase 1o` or `--phase 1o-example`.

### Writer Fixtures

Located under `writer/`. These support the Product Delivery Registry Writer script and are not exercised by the validator phases documented in this guide. Their usage is governed separately.

### Registry State

Phase 1O-U creates no registry state. No `.pnpd/product-delivery-registry/` directory is required for validation. The validator reads registry paths passed via `--product-delivery-registry` and does not create, mutate, or write to any registry state.

## 7. Example Fixture Behavior

The `--phase 1o-example` flag discovers example fixtures under `tests/fixtures/pnpd/product-delivery-registry/examples/`.

The current baseline has exactly one example fixture: `example-minimal-registry.json`. It passes validation (1 passed, 0 failed).

The historical zero-example behavior (0 discovered, no fixtures found) existed before Phase 1O-S and validated that the validator handles an empty examples directory correctly. That behavior is preserved in the validator but the current baseline always has at least one example fixture.

The `examples/` directory is intended for valid illustrative examples only. It is not a location for negative test cases.

## 8. Registry State and Path Boundaries

Phase 1O-U creates no registry state. No `.pnpd/product-delivery-registry/` state is required or created by this guide or by the validator.

Validation can read a registry file passed by `--product-delivery-registry`. The validator does not automatically write, mutate, dispatch, or consume registry state.

Artifact paths in fixtures and examples are illustrative references. They are only validated for existence when `--check-registry-artifacts` is explicitly invoked and only verified for hash integrity when `--verify-registry-artifact-hashes` is additionally invoked.

## 9. Authority and Governance

Validator outputs are advisory governance checks. They report validation status but do not authorize any action.

- Codex audit is audit-only by default.
- Local merge requires separate Owner authorization.
- Push requires separate Owner authorization.
- No automatic merge/push authority exists.
- No dispatch, deployment, GitHub/API mutation, or production readiness is introduced by the validator or this guide.

## 10. Non-Goals

This guide introduces no behavior changes. Specifically:

- No code changes.
- No schema changes.
- No fixture changes.
- No package/CI changes.
- No writer/runtime implementation.
- No registry state.
- No dispatch.
- No deployment/release.
- No GitHub/API mutation.
- No production readiness.
- No Phase 1O-V work.

## 11. Troubleshooting Notes

- `npm run dry-run` may exit 0 but report `NEEDS_TRIAGE` locally when main is protected and known untracked files make the working tree dirty. This is expected and not a validation failure. Known untracked files: `.DS_Store`, `.kunsdd/`, `index.html`.
- Remote CI is the source of truth for pushed baseline status after authorized push.
- If a command output differs from what this guide describes, inspect current validator help/output with `node scripts/pnpd-validate-schemas.mjs --help` before changing behavior. This guide is a snapshot and may become stale if the validator is updated in a future governed phase.

## 12. Final Statement

Phase 1O-U documents existing Product Delivery Registry validation usage. It does not introduce behavior.
