# Product Delivery Registry Hash Integrity Verification Design

## Status

| Field | Value |
|---|---|
| Phase | `PHASE_1O_J_PRODUCT_DELIVERY_REGISTRY_HASH_INTEGRITY_VERIFICATION_DESIGN` |
| Baseline commit | `319f4627b0c31941d0e37f22eca58e192bfc0e34` |
| Latest closed phase | `PHASE_1O_I_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_PUSHED_REMOTE_CI_PASS` |
| Design type | docs-only |
| Future flag | `--verify-registry-artifact-hashes` |
| Dependency flag | `--check-registry-artifacts` |
| Runtime consumption | blocked |
| Dispatch | blocked |
| Deployment | blocked |
| GitHub/API mutation | blocked |
| Production certification | blocked |
| Registry writer | blocked |

## Purpose

This document designs a future optional hash/integrity verification layer for Product Delivery Registry entries. It defines the hash model, the algorithm policy, the future CLI flag, canonicalization rules, failure behavior, reporting expectations, and governance boundaries.

This document does **not** implement the validator. It does **not** modify the schema, fixtures, validator code, package scripts, CI workflow, or any existing file. It is a design artifact only.

When implemented, hash/integrity verification will allow the validator to confirm that a `contentHash` recorded in a registry entry matches the actual raw-byte SHA-256 hash of the referenced artifact file on disk. This provides an additional layer of evidence without certifying artifact quality, correctness, or production readiness.

## Current Registry Capability

The Product Delivery registry capability as of baseline `319f462` includes:

- **Schema**: `.pnpd/product-delivery-registry.schema.json` — committed and tracked.
- **Fixtures**: `tests/fixtures/pnpd/product-delivery-registry/` — 21 schema-shape fixtures (6 positive, 15 negative) plus 3 artifact-reference JSON fixtures and 1 `.gitkeep` support file.
- **Validator**: `scripts/pnpd-validate-schemas.mjs` — supports `--phase 1o` for fixture validation, `--product-delivery-registry <path>` for standalone registry file validation, and `--check-registry-artifacts` for optional artifact reference existence validation.
- **Data convention**: `docs/pnpd/product-delivery-registry-data-convention.md` — defines how registry data should be understood, governed, and constrained.
- **Artifact reference validation**: Implemented via `--check-registry-artifacts`. Confirms referenced artifacts exist on disk and are regular files. Does not verify hashes.
- **Registry directory**: absent. `.pnpd/product-delivery-registry/` is ignored by `.gitignore` and does not exist.
- **Registry data file**: absent. `.pnpd/product-delivery-registry/registry.json` is reserved but not created.

Current validator hash/integrity behavior:

- The validator validates that each entry has a required `integrity` object.
- The validator validates allowed `integrity` fields (`hashAlgorithm`, `contentHash`).
- The validator already rejects `hashAlgorithm: "none"` with a non-null `contentHash`.
- The validator does **not** currently reject `hashAlgorithm: "sha256"` with `contentHash: null`.
- The validator does **not** compute hashes of referenced artifact files.
- The validator does **not** read referenced files for hash purposes.
- The validator does **not** compare computed hashes to `contentHash`.

## Current Hash And Integrity Schema

The schema at `.pnpd/product-delivery-registry.schema.json` defines the `integrity` object in each entry as:

- `integrity.hashAlgorithm`: enum of `"sha256"` and `"none"`.
- `integrity.contentHash`: either a 64-character lowercase hex string (pattern `^[a-f0-9]{64}$`) or `null`.

The schema description states: *"If hashAlgorithm is sha256, contentHash should be a 64-character hex string. If hashAlgorithm is none, contentHash should be null. Semantic rules enforced by future validator."*

This means:

- The schema already supports future SHA-256 verification.
- The schema explicitly delegates hash-algorithm-to-contentHash relationship rules to semantic validation.
- No schema change is needed for the future initial hash verification implementation.

## Current Validator Hash And Integrity Behavior

As of Phase 1O-I, the validator (`scripts/pnpd-validate-schemas.mjs`) handles integrity as follows:

- **Missing integrity object**: rejected at the structural/schema level.
- **Allowed integrity fields**: validated structurally. Unknown extra fields in the integrity object are rejected by the schema's `additionalProperties: false`.
- **`hashAlgorithm: "none"` with non-null `contentHash`**: already rejected by existing semantic validation.
- **`hashAlgorithm: "sha256"` with `contentHash: null`**: not currently rejected. The validator does not enforce the semantic rule that SHA-256 must have a non-null hash.
- **Hash computation**: not performed. The validator never reads referenced artifact files for hash purposes.
- **Hash comparison**: not performed. The validator never compares a computed hash to `contentHash`.

## Decision

- Phase 1O-J is docs-only.
- No code implementation occurs in this phase.
- Future hash/integrity verification implementation is deferred to a later phase, likely Phase 1O-K.
- This decision is consistent with the Product Delivery Registry governance: implementation only proceeds after a Codex audit of the design and an explicit owner decision.

## Selected Hash Model

The future hash model for artifact integrity verification is:

- **Algorithm**: SHA-256, computed on the raw bytes of the referenced artifact file as stored on disk.
- **Input**: the exact file bytes. The validator reads the entire file as a byte buffer and feeds it to the SHA-256 hash function.
- **No JSON parsing**: the file is hashed as a binary blob. Even if the file contains JSON, the hash is computed on the raw bytes, not on parsed and re-serialized content.
- **No semantic normalization**: no whitespace stripping, no field reordering, no encoding conversion.
- **No content validation**: hash computation does not inspect, validate, or interpret the file content.
- **Byte-level determinism**: if the file bytes change in any way (including whitespace, line endings, or encoding), the hash changes. This is by design.

This model is intentionally simple. It answers one narrow question: "Do the bytes on disk match the hash recorded in the registry entry?" It does not answer whether the artifact is valid, correct, or ready for any purpose.

## Canonicalization Policy

- **No canonicalization is applied** before hashing.
- No JSON field ordering normalization.
- No whitespace normalization.
- No line-ending normalization (CRLF, LF, or mixed endings are hashed as-is).
- No text encoding normalization (the file's exact byte encoding is hashed as-is).
- **Raw bytes only**: what is on disk is what is hashed.

This policy avoids silent hash mismatches caused by unexpected canonicalization behavior. If two files differ by even a single byte, they produce different hashes. If an artifact has been re-serialized, reformatted, or had its line endings changed, the recorded `contentHash` must be updated to match.

## hashAlgorithm `none` Policy

When an entry declares `hashAlgorithm: "none"`:

- Hash verification is **skipped** for that entry.
- `contentHash` must be `null`. Non-null `contentHash` with `"none"` is already rejected by the existing validator.
- Skipped entries are counted as **skipped**, not as passed or failed.
- Skipping hash verification does **not** certify artifact quality.
- Skipping hash verification does **not** mean the artifact has been validated.
- `hashAlgorithm: "none"` is a legitimate state for entries where hashes are not recorded, are not yet available, or are intentionally omitted.

## contentHash Policy

The relationship between `hashAlgorithm` and `contentHash` is governed by the following policy:

| `hashAlgorithm` | `contentHash` | Behavior |
|---|---|---|
| `"none"` | `null` | Skip hash verification. Pass at the integrity layer. |
| `"none"` | non-null | Fail. Already semantically rejected by the existing validator. |
| `"sha256"` | 64-character lowercase hex | Verify in future implementation. Compare computed raw-byte SHA-256 to this value. |
| `"sha256"` | `null` | Fail in future implementation. SHA-256 requires a hash value. |
| `"sha256"` | invalid format (not 64 hex chars) | Should be schema-rejected before semantic hash verification. Invalid hex strings or wrong-length strings are rejected by the schema's `pattern` constraint. |

The schema already enforces the `contentHash` format constraint (`^[a-f0-9]{64}$` or `null`). Invalid hash string formats are caught at the schema level and do not reach hash verification.

## Supported Algorithm Policy

- **Supported future verification algorithm**: `sha256` (SHA-256).
- **`none`**: means skip hash verification.
- **All other algorithm values**: rejected by the schema's `enum` constraint on `hashAlgorithm`. The schema only allows `"sha256"` and `"none"`.
- **No algorithm negotiation**: the validator does not select, fall back, or upgrade algorithms.
- **No sha512, blake3, or other algorithms**: not in scope.
- **Any future algorithm addition**: requires a separate schema phase (to extend the enum) and a separate validator phase (to implement the new hash computation). No algorithm is added in Phase 1O-J or the future 1O-K implementation.

## Future Flag Strategy

The future implementation will introduce the flag:

```
--verify-registry-artifact-hashes
```

Flag rules:

- **Valid only with** `--product-delivery-registry <path>`. The flag is meaningless without a registry file to validate.
- **Must require** `--check-registry-artifacts`. Hash verification depends on artifact reference validation: files must be confirmed to exist before hashes are computed. If `--verify-registry-artifact-hashes` is supplied without `--check-registry-artifacts`, the validator should either automatically enable artifact checking or reject the combination as invalid (design decision for 1O-K).
- **Invalid with** `--phase`. Hash verification applies to a single registry file, not to fixture-based phase validation.
- **Invalid with** unrelated standalone validator modes (e.g., `--product-delivery-artifact`, which validates a single artifact schema, not a registry).
- **Default validation unchanged**: running the validator without `--verify-registry-artifact-hashes` preserves existing behavior.
- **`npm run validate` unchanged**: unless a separately approved, later governed phase adds the flag to the default validate script.

## Dependency On Artifact Reference Validation

Hash verification is the third layer in a layered validation model:

1. **Registry shape validation** (schema, governance, path syntax, forbidden fields) — always runs.
2. **Artifact reference existence validation** (`--check-registry-artifacts`) — optional first layer. Confirms referenced paths exist on disk and are regular files.
3. **Hash/integrity verification** (`--verify-registry-artifact-hashes`) — optional second layer. Computes and compares hashes.

Hash verification requires:

- The registry to pass structural validation.
- Each entry with `hashAlgorithm: "sha256"` to reference an existing regular file.
- Missing files and directory paths are rejected at the artifact-reference layer before hash verification is attempted.

If artifact reference validation is not enabled, hash verification cannot proceed. The future implementation must either implicitly enable artifact checking or reject the flag combination.

## Hash Mismatch Behavior

Future behavior when a computed hash does not match `contentHash`:

- **Validation fails** for that entry.
- **Failure report includes**:
  - `artifactId`: the entry's unique identifier.
  - `entry.path`: the repo-relative path to the referenced artifact.
  - Expected hash: the `contentHash` value from the registry entry.
  - Computed hash: the actual SHA-256 hash computed from the file bytes.
- **No absolute local paths** in failure output. The report uses repo-relative paths only.
- **Continue checking remaining entries** where practical. A hash mismatch in one entry does not prevent verification of other entries.
- **Exit non-zero** if any hash mismatch occurs. Non-zero exit signals that integrity verification found at least one discrepancy.

Hash matches produce no per-entry output (silence on success). Only mismatches, skipped entries, and summary statistics are reported.

## Missing Artifact Behavior With Hash Verification

- A missing artifact file fails at the artifact-reference validation layer.
- Hash verification is **not attempted** for missing files.
- No file generation, fetch, download, or repair is attempted.
- The entry is reported as a reference failure, not a hash mismatch.

## Directory Artifact Behavior With Hash Verification

- A directory path fails at the artifact-reference validation layer.
- Hash verification is **not attempted** for directories.
- Registry entries must reference files. The artifact-reference layer enforces this.
- Directories cannot be hashed. The failure is a reference failure, not a hash failure.

## Reporting Policy

Future hash verification reporting:

- **Checked count**: number of entries where hash verification was attempted (i.e., `hashAlgorithm: "sha256"` with an existing regular file).
- **Matched count**: number of entries where the computed hash matched `contentHash`.
- **Mismatch count**: number of entries where the computed hash did not match `contentHash`.
- **Skipped count**: number of entries with `hashAlgorithm: "none"`.
- **Failure details**: each mismatch includes `artifactId` and repo-relative `entry.path`, plus expected and computed hashes.
- **No absolute local path leakage**: all path references in output use repo-relative paths.
- **No quality certification language**: reports describe what was checked and what was found. They do not claim artifacts are valid, correct, safe, or ready.

## Fixture Strategy

This is a future implementation fixture strategy only. No fixtures are created in Phase 1O-J.

### Future fixture directory

```
tests/fixtures/pnpd/product-delivery-registry/hash-integrity/
```

### Future support file

```
tests/fixtures/pnpd/product-delivery-registry/hash-integrity/support/known-content.txt
```

The support file provides a stable byte sequence with a known, precomputed SHA-256 hash. This file serves as the referenced artifact for hash-valid positive fixtures.

### Future fixture categories

- **Positive: hash-valid SHA-256 fixture**. Registry entry references the support file, `hashAlgorithm: "sha256"`, `contentHash` matches the precomputed SHA-256. Expected: hash verification passes.
- **Positive: hash-none skipped fixture**. Registry entry with `hashAlgorithm: "none"` and `contentHash: null`. Expected: hash verification skipped, not failed.
- **Negative: hash mismatch fixture**. Registry entry with `hashAlgorithm: "sha256"`, `contentHash` set to a 64-character hex string that does **not** match the support file's actual SHA-256. Expected: hash verification fails with mismatch reported.
- **Negative: sha256 with null contentHash fixture**. Registry entry with `hashAlgorithm: "sha256"` and `contentHash: null`. Expected: hash verification fails because SHA-256 requires a non-null hash.

### Fixture constraints

- Support file content must be stable. Changing the support file invalidates precomputed hashes.
- Expected hashes must be precomputed and documented in fixture notes or fixture metadata.
- Fixtures must not use secrets, absolute paths, URLs, production claims, or approval claims.
- Fixtures must be introduced only in a later implementation phase (likely Phase 1O-K).

## Schema Strategy

- **No schema changes** in this docs-only phase.
- The schema already supports `"sha256"` and `"none"` for `hashAlgorithm`.
- The schema already supports 64-character lowercase hex strings and `null` for `contentHash`.
- The schema description already delegates hash-to-contentHash relationship rules to semantic validation.
- Relationship constraints (`"sha256"` requires non-null `contentHash`; `"none"` requires `null`) can be enforced semantically first, without schema changes.
- Future schema hardening (e.g., adding `if`/`then` conditional validation for the hash-to-contentHash relationship) may be considered in a separate phase if needed, but is not required for initial hash verification.

## Default Behavior Preservation

- Without `--verify-registry-artifact-hashes`, validator behavior remains **unchanged**.
- `--product-delivery-registry <path>` remains unchanged.
- `--check-registry-artifacts` remains unchanged.
- `--phase 1o` remains unchanged.
- `--phase 0`, `--phase 1b`, `--phase 1c`, `--phase 1f`, `--phase 1h`, `--phase 1m`, `--phase 1n`, and all other phase flags remain unchanged.
- `npm run validate` remains unchanged.
- `npm run dry-run` remains unchanged.
- `npm test` remains unchanged.
- Any change to default behavior requires a separate governed phase, an approved design, and an explicit owner decision.

## Referenced Artifact Content Validation Boundary

Hash verification is **not** artifact content validation. The boundaries are:

- **Hash match does not mean** the artifact is schema-valid. A file can have a correct hash and fail standalone artifact validation.
- **Hash match does not mean** the artifact is quality-approved. Hash integrity is a byte-level property, not a quality assessment.
- **Hash match does not mean** standalone artifact validation passed. The validator is not checking the artifact's JSON structure, governance claims, or semantic rules during hash verification.
- **Artifact content validation remains deferred**. Validating referenced artifact contents with standalone artifact validators (e.g., `--product-delivery-artifact`) is a separate future capability, not part of hash/integrity verification.

This boundary must be preserved in the future implementation. Hash verification and artifact content validation are distinct layers.

## Registry Writer Boundary

- **Registry writer remains blocked**. This phase does not design or authorize a registry writer.
- No registry data is created by hash verification.
- No `.pnpd/product-delivery-registry/registry.json` is created or modified.
- Hash verification is read-only: it reads the registry file, reads referenced artifacts, computes hashes, and reports results. It writes nothing.
- A future registry writer must be separately designed, governed, and approved. It is not part of Phase 1O-J or the future 1O-K hash verification implementation.

## Runtime, Dispatch, Deployment, GitHub/API, And Production Boundaries

All execution, mutation, and certification boundaries remain in place:

- **Runtime consumption remains blocked**. The registry is not consumed at application runtime. Hash verification is a development-time and CI-time validation tool only.
- **Dispatch remains blocked**. Hash verification does not authorize, trigger, or enable orchestration dispatch.
- **Deployment remains blocked**. Hash verification does not authorize, trigger, or enable deployment of any artifact or system.
- **GitHub/API mutation remains blocked**. Hash verification makes no HTTP calls, no API requests, and performs no Git operations beyond local file reads.
- **Production certification remains blocked**. Hash verification does not certify, claim, or imply production readiness. It is evidence only.
- Hash verification does **not** authorize any of these capabilities. It is a validation tool that reports what it finds.

## Product Design Integrity And Asset Decisioning Boundary

- **Product Design Integrity / anti-slop governance** remains a separate future track. It is not part of hash/integrity verification.
- **Product Design Asset Decisioning** remains a separate future track. It is not part of hash/integrity verification.
- Neither capability is designed, implemented, or authorized in Phase 1O-J or the future 1O-K hash verification implementation.
- These are distinct governance domains with their own schemas, validators, and phases.

## Package And CI Policy

- **No package or CI changes** in Phase 1O-J (docs-only).
- No `package.json` changes.
- No `.github/workflows/pnpd-ci.yml` changes.
- No `.gitignore` changes.
- No npm script changes.
- Future hash verification flag (`--verify-registry-artifact-hashes`) should remain **opt-in**.
- No default CI behavior changes unless a later governed phase separately designs and approves CI integration.
- When hash verification is implemented, it may be added to CI as an opt-in step, but never as a mandatory gate unless explicitly designed, audited by Codex, and approved by the owner.

## Future Roadmap

The Product Delivery Registry track, as currently envisioned:

| Phase | Description |
|---|---|
| 1O-A through 1O-I | Completed. Schema, fixtures, validator, data convention, artifact reference validation design and implementation. |
| **1O-J** | **This phase.** Hash integrity verification design doc. Docs-only. |
| 1O-K | Hash integrity verification implementation (future, if approved). Adds `--verify-registry-artifact-hashes` flag, SHA-256 computation, hash comparison, reporting, and hash-integrity fixtures. |
| 1O-L | Registry writer design (future). |
| Later | Runtime consumption design (future). |
| Separate | Product Design Integrity / anti-slop governance. |
| Separate | Product Design Asset Decisioning. |
| Much later | Dispatch, deployment, GitHub/API mutation — all require separate designs, Codex audits, and owner approval. |

All future phases beyond 1O-J are contingent on explicit owner approval and Codex audit.

## Non-Goals

This phase (1O-J) explicitly does **not**:

- Implement any code.
- Change the validator (`scripts/pnpd-validate-schemas.mjs`).
- Change the registry schema (`.pnpd/product-delivery-registry.schema.json`).
- Change or create any fixture files.
- Change `package.json`, CI workflows, `.gitignore`, or npm scripts.
- Create the registry directory (`.pnpd/product-delivery-registry/`).
- Create the registry data file (`.pnpd/product-delivery-registry/registry.json`).
- Create or design a registry writer.
- Implement referenced artifact content validation.
- Authorize or implement runtime consumption.
- Authorize or implement dispatch.
- Authorize or implement deployment.
- Authorize or implement GitHub/API mutation.
- Claim or certify production readiness.
- Implement Product Design Integrity or anti-slop governance.
- Implement Product Design Asset Decisioning.

## Risks And Mitigations

### Risks

1. **Raw-byte hashing may surprise users expecting canonical JSON hashing**. Users familiar with content-addressable JSON systems may expect field ordering and whitespace to be normalized before hashing. Raw-byte hashing means any reformatting changes the hash.

2. **Support file edits can break future fixture hashes**. If the `known-content.txt` support file is edited after precomputing its SHA-256 hash, all positive hash-valid fixtures built on that hash will fail.

3. **Hash match could be mistaken for artifact correctness**. A hash match confirms byte-level integrity of the file as stored. It does not confirm the artifact is semantically valid, governance-compliant, or fit for any purpose. This distinction may be lost on readers unfamiliar with the layered validation model.

4. **Hash verification could be mistaken as required for default validation**. If the flag becomes too prominent, users may assume hash verification is part of standard validation and be confused when it is not enabled by default.

5. **Future implementation could drift into content validation**. The proximity of hash verification to artifact reference validation creates a risk that the implementer adds artifact schema validation under the hash verification flag.

6. **Future implementation could drift into writer/runtime scope**. The temptation to "close the loop" by writing validated hashes back to the registry or consuming registry data at runtime must be resisted.

### Mitigations

1. **Explicit raw-byte policy**: this document states the raw-byte model clearly. The future implementation should document it in help text and error messages.

2. **Stable support fixture policy**: the support file content must be documented as immutable. Fixture notes must record the precomputed expected hash. Any future change to the support file requires corresponding fixture hash updates.

3. **Evidence-only wording**: all reporting uses neutral language ("matched", "mismatch", "skipped"). No quality certification language appears in output.

4. **Opt-in flag**: hash verification is never enabled by default. Users must explicitly opt in with `--verify-registry-artifact-hashes`.

5. **Separate content validation phase**: artifact content validation is explicitly deferred and designed in a separate phase. The hash verification implementation must not import, call, or depend on artifact content validators.

6. **Separate writer/runtime phases**: registry writer, runtime consumption, dispatch, and deployment are each designed in separate phases with their own governance gates.

7. **Codex audit required**: before any implementation phase (1O-K), this design must be audited by Codex. The Codex audit confirms the design is consistent with governance invariants and does not overstep boundaries.
