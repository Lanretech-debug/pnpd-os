# Product Delivery Registry Artifact Reference Validation Design

## Status

| Field | Value |
|---|---|
| Phase | `PHASE_1O_H_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_DESIGN` |
| Baseline commit | `cb2281a94e75822e8c3886b1af6bbb7b4a682909` |
| Latest closed phase | `PHASE_1O_F_PRODUCT_DELIVERY_REGISTRY_DATA_CONVENTION_PUSHED_REMOTE_CI_PASS` |
| 1O-G status | `DEFERRED` |
| Design type | docs-only |
| Future flag | `--check-registry-artifacts` |
| Runtime consumption | blocked |
| Dispatch | blocked |
| Deployment | blocked |
| GitHub/API mutation | blocked |
| Production certification | blocked |
| Registry writer | blocked |

## Purpose

This document designs a future optional read-only artifact existence validation layer for Product Delivery registry entries. It defines the validation model, the future CLI flag, path resolution rules, failure behavior, reporting expectations, and governance boundaries.

This document does **not** implement the validator. It does **not** modify the schema, fixtures, validator code, package scripts, CI workflow, or any existing file. It is a design artifact only.

When implemented, artifact-reference validation will close a gap in the current registry validator: a registry entry can be structurally valid even when `entry.path` references a file that does not exist on disk. The future `--check-registry-artifacts` flag will provide an opt-in existence check that confirms referenced artifacts are present and are regular files.

## Current Registry Capability

The Product Delivery registry capability as of baseline `cb2281a` includes:

- **Schema**: `.pnpd/product-delivery-registry.schema.json` — committed and tracked.
- **Fixtures**: `tests/fixtures/pnpd/product-delivery-registry/` — 21 JSON files (6 positive, 15 negative).
- **Validator**: `scripts/pnpd-validate-schemas.mjs` — supports `--phase 1o` for fixture validation and `--product-delivery-registry <path>` for standalone registry file validation.
- **Data convention**: `docs/pnpd/product-delivery-registry-data-convention.md` — defines how future registry data should be understood, governed, and constrained.
- **Registry directory**: absent. `.pnpd/product-delivery-registry/` is ignored by `.gitignore` and does not exist.
- **Registry data file**: absent. `.pnpd/product-delivery-registry/registry.json` is reserved but not created.

Current validator capabilities:

- Validates registry JSON shape against the schema contract.
- Validates governance constraints (all authorization, mutation, and runtime fields locked to `false`).
- Validates path syntax and path safety (no absolute, traversal, URL, unsafe host/system paths, or symlink escapes).
- Rejects unsafe fields and claims where implemented.

Current validator does **not**:

- Check that referenced artifact files exist on disk.
- Verify artifact hashes against `contentHash`.
- Validate referenced artifacts with standalone artifact validators (`--product-delivery-artifact`).
- Consume registry data at runtime.
- Dispatch, deploy, mutate GitHub/API, or certify production readiness.

## Current Validation Gap

The current validator checks that each `entry.path` is syntactically valid and safe, but does not confirm that the referenced file actually exists in the repository. This means:

- A registry entry can pass validation even when `entry.path` points to a missing artifact.
- The registry can accumulate stale entries that reference files that were moved, renamed, or deleted.
- The registry's usefulness as an index is weakened when entries can point to nothing.

Future artifact-reference validation should close the existence gap first. Hash verification, artifact content validation, and writer behavior are separate concerns deferred to later phases.

This gap is explicitly documented in the data convention:

> **Artifact existence checks are deferred.** The validator does not confirm that referenced artifact files exist on disk.

Phase 1O-H designs the future validation layer that closes this gap, without implementing it.

## Selected Validation Model

The selected validation model is **Option A — optional read-only existence check only**.

Key characteristics:

- **Read-only**: the future validator inspects the filesystem but does not write, create, modify, delete, or generate anything.
- **Optional**: invoked only when the user explicitly passes `--check-registry-artifacts`. Default behavior is unchanged.
- **Existence only**: confirms that the referenced path exists and is a regular file. Does not compute hashes, validate artifact content, or assess artifact quality.
- **No hash verification**: `contentHash` and `hashAlgorithm` are not consulted during existence checks.
- **No referenced artifact content validation**: standalone artifact validation is not run.
- **No writer**: the future validator does not create, update, or modify registry entries.
- **No runtime consumption**: validation results are for human review only.
- **No dispatch, deployment, GitHub/API mutation, or production certification**: the existence check does not authorize any of these.

The future flag that enables this model is `--check-registry-artifacts`.

## Future Flag

The future validation flag is:

```
--check-registry-artifacts
```

### Validity rules

- **Valid only with**: `--product-delivery-registry <path>`. The flag is meaningless without a registry file to validate.
- **Invalid without**: `--product-delivery-registry`. If passed alone or with any other mode, the validator must fail with a clear error message indicating the flag requires `--product-delivery-registry <path>`.
- **Not valid with**: `--phase 1o`. Phase-based fixture validation must not run artifact-reference checks. Fixture paths may be placeholders and must not be checked against the live filesystem.
- **Not valid with other standalone validator modes**: `--product-delivery-artifact`, `--phase 1n`, `--phase 1m`, `--phase 1h`, `--phase 1f`, `--phase 1c`, `--phase 1b`, `--phase 0`, or no-phase mode must not accept `--check-registry-artifacts`.

### Default behavior

- `--product-delivery-registry <path>` without `--check-registry-artifacts` must behave exactly as it does today. No existence checks are performed.
- `--phase 1o` must continue to validate fixtures only. No existence checks are performed on fixture `entry.path` values.
- `npm run validate` must not invoke artifact-reference validation.
- Existing fixture validation must remain unchanged in behavior and output.

The flag is strictly additive and opt-in. It introduces no new default behavior and alters no existing validation paths.

## Default Behavior Policy

The following behaviors are preserved unchanged:

| Command | Behavior |
|---|---|
| `node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path>` | Registry shape and governance validation only. No artifact existence check. |
| `node scripts/pnpd-validate-schemas.mjs --phase 1o` | Fixture validation only. No artifact existence check. |
| `npm run validate` | All phase validators run. No artifact existence check. |
| `npm run dry-run` | Orchestrator dry-run. No registry consumption. No artifact existence check. |
| `npm test` | Test suite. No artifact existence check. |

The `--check-registry-artifacts` flag is additive. When present with `--product-delivery-registry <path>`, it adds artifact existence checks after the existing shape, governance, and path-safety validation passes. When absent, the existing behavior is unchanged.

## Artifact Path Resolution Policy

When `--check-registry-artifacts` is active and the base registry validation passes, the future validator must:

1. Iterate every `registry.entries[*].path`.
2. Reuse the existing path-safety policy: reject absolute paths, traversal paths (`..`), URL paths (`http://`, `https://`), unsafe host/system paths, and symlink escapes.
3. Resolve each relative path against the repository root.
4. Confirm the resolved path remains inside the repository root (no escape via symlink or resolved parent traversal).
5. Confirm the resolved path exists on disk.
6. Confirm the resolved path is a regular file, not a directory.

Path resolution must use the same repository-root detection as the existing validator. The cwd or any environment variable must not override the repository root for path resolution.

Existing path-safety rules from the current validator apply unchanged: `.pnpd/` paths, `.env` files, Windows drive prefixes, and paths not ending in `.json` remain rejected at the shape-validation stage, before artifact-reference checks run.

## Missing Artifact Behavior

When an `entry.path` resolves to a path that does not exist on disk:

- The artifact-reference validation fails for that entry.
- The validator must collect all missing-path failures across all entries before exiting.
- The validator must exit with a non-zero exit code if any artifact path is missing.
- The validator must **not** attempt to create, generate, fetch, fix, or mutate the missing artifact or the registry entry.
- The validator must **not** remove the entry from the registry.
- The validator must **not** alter the registry data file in any way.

## Directory Path Behavior

When an `entry.path` resolves to a directory rather than a regular file:

- The artifact-reference validation fails for that entry.
- Registry entries must reference files, not directories.
- Directory existence does **not** satisfy the artifact existence requirement.
- The failure must be reported distinctly from missing-path failures so the user can distinguish between "file not found" and "path is a directory."

## Empty Registry Behavior

When a registry has an empty `entries` array:

- Artifact-reference validation passes.
- Total entries checked is zero.
- Total artifact paths found is zero.
- Total missing artifacts is zero.
- Total directory-path failures is zero.
- No special warning or message is required beyond a zero-count summary.

An empty registry is valid and complete. Having no entries to check is not an error.

## Reporting Policy

When `--check-registry-artifacts` is active, the future validator must report:

| Field | Description |
|---|---|
| Total entries checked | Number of entries in `registry.entries` |
| Total artifact paths found | Number of entries whose `path` resolves to an existing regular file |
| Total missing artifacts | Number of entries whose `path` resolves to a non-existent file |
| Total directory-path failures | Number of entries whose `path` resolves to a directory |
| Failing `artifactId` | The `artifactId` of each failing entry |
| Failing `entry.path` | The `entry.path` value of each failing entry |

The report must not:

- Suggest automatic repair or regeneration of missing artifacts.
- Suggest automatic removal of stale entries.
- Generate a new registry file.
- Write any file.
- Call any network endpoint.

The report is output to stdout as part of the validator's normal output. It is for human review only.

## Hash And Integrity Scope

Hash verification is deferred to a later design phase. The `--check-registry-artifacts` flag is scoped to existence only.

Stance:

- `--check-registry-artifacts` does **not** compute file hashes.
- `--check-registry-artifacts` does **not** compare file content against `contentHash`.
- `hashAlgorithm: "none"` remains a valid and acceptable value.
- A registry entry with `hashAlgorithm: "sha256"` and a valid `contentHash` passes artifact-reference validation regardless of whether the hash matches. The existence check does not inspect these fields.
- Future hash verification must be separately designed in its own phase, with its own flag, its own fixtures, its own Codex audit, and its own CI confirmation.
- Existence check does **not** imply integrity verification. Finding a file at the expected path does not confirm its contents are correct or unmodified.

Future hash-verification design must not be conflated with or injected into the existence-check design or implementation.

## Referenced Artifact Content Validation Scope

Standalone referenced artifact content validation is deferred. The `--check-registry-artifacts` flag does **not** run artifact validators.

Stance:

- `--check-registry-artifacts` does **not** invoke `--product-delivery-artifact` on any entry.
- `--check-registry-artifacts` does **not** validate artifact contents, structure, governance fields, or quality.
- `--check-registry-artifacts` does **not** certify that an artifact is well-formed, complete, or correct.
- Future artifact content validation requires separate mapping design: which artifact types map to which validators, how validation results are aggregated, how failures are reported, and how the existence and content checks interact.
- Existence check and content validation are orthogonal concerns. A file may exist without being valid; a file may be valid without existing. The registry must be able to surface both independently.

## Fixture Strategy

Existing registry fixtures remain unchanged. No new fixtures are created in Phase 1O-H.

Current positive fixtures may use placeholder paths (e.g., `docs/product/spec/example-product-spec.json`). These paths may not exist in the repository. This is intentional and acceptable:

- `--phase 1o` must **not** run artifact-reference validation. Placeholder paths in fixtures are never checked against the live filesystem.
- `--product-delivery-registry` with a fixture file would only run artifact-reference checks if `--check-registry-artifacts` is explicitly added. Users who pass the flag against a fixture accept that placeholder paths will fail existence checks.

When the future implementation phase adds artifact-reference validation code, separate fixtures may be introduced. Those fixtures belong in a later implementation phase (1O-I), not this design phase.

Future fixture categories, introduced only in the implementation phase, may include:

- A valid registry with a real artifact path that exists in the repository.
- An invalid registry with a missing artifact path.
- An invalid registry with a directory path where a file is expected.

These categories are named here for design completeness. They must **not** be created in Phase 1O-H.

## Artifact-Reference Governance Policy

Artifact-reference validation is subject to the same governance constraints as all Product Delivery registry operations:

- Artifact-reference validation is **evidence only**. It reports what exists; it does not decide what happens.
- Existence check does **not** certify artifact quality, completeness, or correctness.
- Existence check does **not** authorize implementation of any artifact.
- Existence check does **not** enable dispatch.
- Existence check does **not** enable deployment.
- Existence check does **not** enable GitHub/API mutation.
- Existence check does **not** certify production readiness.
- Existence check does **not** mean standalone artifact validation has passed.
- A passing artifact-reference validation does **not** mean the referenced artifact is correct, safe, complete, or fit for any purpose. It only means the file exists and is a regular file.

The governance model is unchanged: Owner is final human authority, Codex is auditor/reviewer only, AgentBridge coordinates only, and the registry is advisory-only.

## Runtime Consumption Boundary

Runtime consumption remains blocked. The future `--check-registry-artifacts` flag does not change this.

- No orchestrator, agent, scheduler, daemon, or automated process may consume artifact-reference validation results for decisions.
- The future flag is a CLI validation tool for human use, not a runtime API.
- Artifact-reference validation results must not feed into dry-run behavior, dispatch readiness, or any automated gate.
- Any future runtime consumption of registry artifact-reference data requires:
  - A separate Hermes design.
  - Schema or fixture changes if needed.
  - Validator changes if needed.
  - Codex audit.
  - Owner approval.
  - Merge, push, and CI confirmation.

## Dispatch, Deployment, GitHub/API, And Production Boundaries

All operational boundaries remain locked:

- **Dispatch remains blocked.** Artifact-reference validation does not authorize dispatch.
- **Deployment remains blocked.** Artifact-reference validation does not authorize deployment.
- **GitHub/API mutation remains blocked.** Artifact-reference validation does not authorize any remote mutation.
- **Production certification remains blocked.** Artifact-reference validation does not certify production readiness.
- **Registry writer remains blocked.** Artifact-reference validation is read-only and does not create, update, or delete registry entries.

Artifact-reference validation is a local, read-only, opt-in existence check. It does not unlock or authorize any operational gate.

## Product Design Integrity And Asset Decisioning Boundary

Product Design Integrity, anti-AI-slop governance, and Product Design Asset Decisioning are valuable future tracks. They remain out of scope for Phase 1O-H.

- They must **not** be mixed into registry artifact-reference validation.
- Existence checking does **not** validate visual design quality, check design tokens, compare screenshots, or integrate with Figma.
- Future work on design integrity and asset decisioning must follow:
  - Separate Hermes design.
  - Separate DeepSeek implementation.
  - Separate Codex audit.
  - Separate Owner approval, merge, push, and CI confirmation.

## Future Roadmap

| Phase | Scope | Description |
|---|---|---|
| **1O-H** | Docs-only | Artifact reference validation design (this document). |
| **1O-I** | Implementation | Artifact reference validation fixtures and validator code, if approved after Codex audit of 1O-H. |
| **1O-J** | Design | Hash/integrity verification design. |
| **1O-K** | Design | Registry writer design, after read-only validation policy is stable. |
| Later | Design | Runtime consumption design. |
| Separate | Design/impl | Product Design Integrity / Asset Decisioning. |
| Much later | Design/impl | Dispatch, deployment, GitHub/API mutation — each separately governed. |

## Non-Goals

This phase (1O-H) explicitly does **not** deliver:

- No code implementation.
- No validator change.
- No schema change.
- No fixture change.
- No registry data file.
- No registry directory.
- No registry writer.
- No hash verification.
- No referenced artifact content validation.
- No runtime consumption.
- No dispatch.
- No deployment.
- No GitHub/API mutation.
- No production certification.
- No Product Design Integrity implementation.
- No Asset Decisioning implementation.

## Risks And Mitigations

| Risk | Mitigation |
|---|---|
| Design language implies future code is authorized now | Explicit "docs-only" status; "does not implement" language throughout; non-goals list |
| `--check-registry-artifacts` naming confused with standalone artifact validator | Flag name uses "check" and "registry" to distinguish from `--product-delivery-artifact`; docs clarify distinction |
| Design creeps into hash verification | Dedicated "Hash And Integrity Scope" section defers hash work; implementation detail grep gates block hash code |
| Design creeps into artifact content validation | Dedicated "Referenced Artifact Content Validation Scope" section defers content validation |
| Design creeps into writer scope | "Registry writer remains blocked" stated; no write behavior in any section |
| Design implies runtime consumption | "Runtime Consumption Boundary" section explicitly blocks; repeated throughout |
| Fixture placeholder paths confuse reference validation | Fixture strategy section clarifies `--phase 1o` never runs artifact checks; placeholders are intentional |
| Existence check mistaken for artifact correctness | Governance policy explicitly states existence check does not certify quality, correctness, or completeness |
| Reader assumes implementation is complete | Status table and non-goals make clear this is a design-only phase |
| Document scope expands into forbidden file changes | Post-implementation gates verify only the design doc file is changed |
