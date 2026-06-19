# Product Delivery Registry Append Mode Design

## Status

**Phase:** `PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN`

**Branch:** `deepseek/phase1o-n-product-delivery-registry-append-mode-design`

**DeepSeek Verdict:** `DEEPSEEK_PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN_COMMITTED_AMBER_NOT_CODEX_AUDITED`

**Hermes Design Verdict:** `HERMES_PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MERGE_WRITER_MODES_DESIGN_READY`

**Expected Codex Verdicts:**

- `CODEX_PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN_PASS`
- `CODEX_PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN_PASS_WITH_PATCHES`
- `CODEX_PHASE_1O_N_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_DESIGN_FAIL`

**Scope:** Docs-only design. No implementation. No code. No fixtures. No CI changes.

**Commit message:** `docs: add product delivery registry append mode design`

**Baseline commit:** `9d4798e457d1608e4f63f69ab79ffdce1f898c7f`

---

## Purpose

This document specifies the design for append-only behavior in the Product Delivery Registry writer. Phase 1O-N is a **docs-only** phase. No append mode is implemented in this phase. Future append implementation is deferred to `PHASE_1O_O_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE` or later.

Append-only is the selected next writer mode after create-only. Merge, upsert, replace, overwrite, and delete remain deferred. This document serves as the source-of-truth design that future implementation phases reference.

---

## Baseline State

**Branch:** `main`

**Commit:** `9d4798e457d1608e4f63f69ab79ffdce1f898c7f`

**Short commit:** `9d4798e`

**Commit message:** `merge: Phase 1O-M PNPD product delivery registry writer into main`

**Remote CI:**

- Workflow: `PNPD CI`
- Run ID: `27803816669`
- Branch: `main`
- Event: `push`
- Status: `completed`
- Conclusion: `success`
- Created: `2026-06-19T03:37:45Z`
- Updated: `2026-06-19T03:38:01Z`
- Duration: `16s`

---

## Current Registry Capability

The Product Delivery Registry chain is complete through Phase 1O-M. The completed phases are:

1. `PHASE_1O_A_PRODUCT_DELIVERY_REGISTRY_DESIGN_PUSHED_REMOTE_CI_PASS`
2. `PHASE_1O_B_PRODUCT_DELIVERY_REGISTRY_SCHEMA_PUSHED_REMOTE_CI_PASS`
3. `PHASE_1O_C_PRODUCT_DELIVERY_REGISTRY_FIXTURES_PUSHED_REMOTE_CI_PASS`
4. `PHASE_1O_D_PRODUCT_DELIVERY_REGISTRY_VALIDATOR_PUSHED_REMOTE_CI_PASS`
5. `PHASE_1O_E_PRODUCT_DELIVERY_REGISTRY_LOCAL_STATE_POLICY_PUSHED_REMOTE_CI_PASS`
6. `PHASE_1O_F_PRODUCT_DELIVERY_REGISTRY_DATA_CONVENTION_PUSHED_REMOTE_CI_PASS`
7. `PHASE_1O_G_PRODUCT_DELIVERY_REGISTRY_EXAMPLE_INSTANCE_DESIGN_DEFERRED`
8. `PHASE_1O_H_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_DESIGN_PUSHED_REMOTE_CI_PASS`
9. `PHASE_1O_I_PRODUCT_DELIVERY_REGISTRY_ARTIFACT_REFERENCE_VALIDATION_PUSHED_REMOTE_CI_PASS`
10. `PHASE_1O_J_PRODUCT_DELIVERY_REGISTRY_HASH_INTEGRITY_VERIFICATION_DESIGN_PUSHED_REMOTE_CI_PASS`
11. `PHASE_1O_K_PRODUCT_DELIVERY_REGISTRY_HASH_INTEGRITY_VERIFICATION_PUSHED_REMOTE_CI_PASS`
12. `PHASE_1O_L_PRODUCT_DELIVERY_REGISTRY_WRITER_DESIGN_PUSHED_REMOTE_CI_PASS`
13. `PHASE_1O_M_PRODUCT_DELIVERY_REGISTRY_WRITER_PUSHED_REMOTE_CI_PASS`

### Fixture and Support File Inventory

The correct inventory for the Product Delivery Registry fixture suite is:

- Shape fixtures: 21 JSON files (6 positive, 15 negative)
- Artifact-reference fixtures: 3 JSON files
- Hash-integrity JSON fixtures: 4 JSON files
- Hash support file: 1 support file (`tests/fixtures/pnpd/product-delivery-registry/hash-integrity/support/known-content.json`)
- Writer entry fixtures: 4 JSON files

**Total:** 33 files (including writer fixtures and support file)

| Category | Count |
|----------|-------|
| Positive shape fixtures | 6 |
| Negative shape fixtures | 15 |
| Artifact-reference fixtures | 3 |
| Hash-integrity JSON fixtures | 4 |
| Hash support file | 1 |
| Writer entry fixtures | 4 |
| **Total** | **33** |

---

## Current Writer Capability

The create-only writer is implemented at `scripts/pnpd-product-delivery-registry-write.mjs`. Its behavior is:

- **Create-only.** The writer creates a new registry. It does not append, merge, upsert, update, or delete.
- **Defaults to no-write.** Without `--write`, the writer dry-runs and produces no retained state.
- **`--write` is required** for filesystem mutation.
- **`--no-write` overrides `--write`.** When both flags are present, the writer dry-runs.
- **Registry path is guarded.** The writer rejects any registry filename other than `registry.json`. It rejects unsafe paths (absolute, traversal, URL).
- **Rejects existing registry.** If `.pnpd/product-delivery-registry/registry.json` exists, the writer fails with a message stating the writer is create-only.
- **No hash computation.** The writer reads `contentHash` from the entry fixture but does not compute or verify hashes.
- **No artifact content validation.** The writer does not inspect, parse, or validate referenced artifact bodies.
- **No network, GitHub/API, or shell calls.** The writer invokes only local `git` metadata and the local `node` validator through `spawnSync` with argument arrays (no shell execution).
- **Atomic temp-file write.** The writer composes the registry into a temp file inside `.pnpd/product-delivery-registry/`, validates it, then atomically renames it to `registry.json`. Temp files are cleaned on failure.
- **Governance constants are preserved.** The writer copies governance defaults from the schema and never sets authority claims to `true`.

---

## Current Append / Merge / Upsert Gap

The create-only writer cannot:

- Add an entry to an existing registry.
- Merge entries from multiple sources.
- Upsert (update-or-insert) entries by `artifactId`.
- Replace existing entries.
- Delete entries.
- Overwrite an entry with a duplicate `artifactId`.

Without append capability, each new registry entry requires recreating the entire registry from scratch. This is acceptable for Phase 1O-M but impractical for incremental workflows where registries grow entry-by-entry across phases.

---

## Design Decision

### Append-only is the selected next writer mode.

The writer will gain an `--append` flag that adds exactly one new entry to an existing registry. This is the next natural increment after create-only.

**Why append-only rather than merge/upsert/replace/delete:**

- Append-only minimizes mutation risk. Existing entries are never changed.
- Append-only preserves entry ordering (existing entries stay in order; new entry goes to the end).
- Append-only avoids the complexity of `artifactId`-based lookup, update, and conflict resolution.
- Append-only keeps the writer simpler and easier to audit.
- Append-only aligns with the registry's purpose as an append-only evidence log.

**What remains deferred:**

- Merge mode (combining two full registries)
- Upsert mode (update-or-insert by `artifactId`)
- Replace mode (in-place entry replacement)
- Overwrite mode (silent duplicate handling)
- Delete mode (entry removal)
- Automatic duplicate `artifactId` resolution

---

## Recommended Phase 1O-N Scope

### Phase 1O-N deliverables

- **Docs-only design.** This single file: `docs/pnpd/product-delivery-registry-append-mode-design.md`

### Phase 1O-N does NOT deliver

- No code changes to `scripts/pnpd-product-delivery-registry-write.mjs`.
- No new fixtures under `tests/fixtures/pnpd/product-delivery-registry/writer/append/`.
- No existing fixture modifications.
- No `package.json` changes.
- No CI/workflow changes (`.github/workflows/pnpd-ci.yml`).
- No runtime/orchestrator changes.
- No registry data or state directories.
- No append mode implementation of any kind.

---

## Rationale

1. **Docs-first discipline.** The design must be reviewed and approved before any implementation investment.
2. **Clear boundary.** Phase 1O-N establishes exactly what append-only means, what it does not mean, and what remains deferred.
3. **Future implementation fidelity.** Phase 1O-O can implement directly from this design without design-by-implementation drift.
4. **Audit trail.** Codex audit of the docs-only phase verifies the design is complete, consistent with the existing writer, and free of scope creep before implementation begins.

---

## Selected Next Writer Mode

**Append-only.**

- Future implementation phase: `PHASE_1O_O_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE`
- Future branch: `deepseek/phase1o-o-product-delivery-registry-append-mode`
- Future expected DeepSeek verdict: `DEEPSEEK_PHASE_1O_O_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE_COMMITTED_AMBER_NOT_CODEX_AUDITED`
- Future expected commit: `feat: add product delivery registry append mode`
- Future flag: `--append`

---

## Append-Only Semantics

### Core behavior

- `--append` requires an **existing** registry at `.pnpd/product-delivery-registry/registry.json`.
- `--append` requires `--entry-file`.
- Without `--write`, append mode dry-runs: validates existing registry, validates the new entry, composes the result, validates the composed registry, reports outcome, and retains no state.
- With `--write`, append mode mutates local registry state by atomically replacing `registry.json` with the composed registry.
- `--no-write` overrides `--write`, forcing dry-run regardless.

### Validation gates

- The existing registry must validate (structural, governance, safety scans) before append.
- The new entry must validate as a registry entry (structural, governance, safety scans) after being composed into the registry.
- The composed registry (existing entries + new entry) must validate before write.

### Duplicate `artifactId` policy

- If the new entry's `artifactId` matches any existing entry in the registry, append **fails**.
- This is a hard failure. The writer does not silently skip, overwrite, or rename.
- The failure message must identify the duplicate `artifactId` and the existing entry's index.

### Entry ordering policy

- Existing entries remain in their current order.
- The new entry is appended to the end of the `entries[]` array.
- No reordering, sorting, or indexing is performed.

### Registry metadata preservation

- All top-level metadata fields from the existing registry are preserved unchanged:
  - `schemaVersion`
  - `recordType`
  - `registryId`
  - `createdAt`
  - `createdBy`
  - `repo` (including `repo.path`, `repo.commit`, `repo.branch`)
  - `governance`
- No `updatedAt` field is added. The schema does not define `updatedAt`, and append mode does not introduce it.
- `repo.commit` and `repo.branch` are not refreshed from current git state. Registry metadata is treated as creation-time evidence.

### Governance preservation

- The governance block from the existing registry is preserved without modification.
- Governance constants (`runtimeConsumptionAllowed: false`, `authorizesImplementation: false`, `authorizesDeployment: false`, `codexIsOwner: false`, `agentBridgeCanApprove: false`) must not be changed.
- Append mode must not relax governance constants.
- Append mode must not make `runtimeConsumptionAllowed` true.
- Append mode must not generate production-readiness claims.

### Hash / `contentHash` policy

- The writer does not compute hashes.
- The writer does not verify `contentHash` values.
- Existing entry `contentHash` values are preserved unchanged.
- The new entry's `contentHash` value (from the entry fixture) is written as-is.

### Referenced artifact content validation boundary

- The writer does not validate referenced artifact content.
- The writer does not parse, inspect, or checksum artifact bodies.
- The writer does not invoke artifact-level validators.
- The writer only verifies that referenced artifact file paths exist (artifact reference existence check), consistent with Phase 1O-I.

### Atomic write strategy

- The composed registry is written to a temp file inside `.pnpd/product-delivery-registry/` with a `.json` extension.
- The temp file is validated using the existing `spawnSync` validator invocation.
- On validation pass, the temp file is atomically renamed to `registry.json`.
- On validation or write failure, the temp file is removed.

### Temp file cleanup policy

- Temp files are cleaned on failure.
- Temp files are cleaned on success (the rename removes the temp path).
- No stale temp files should remain in `.pnpd/product-delivery-registry/` after any successful or failed run.
- Generated state (the `.pnpd/product-delivery-registry/` directory if created solely for temp use) is cleaned if empty after failure.

### Registry path safety

- The registry path `.pnpd/product-delivery-registry/registry.json` is enforced.
- Unsafe paths (absolute, traversal, URL, non-`registry.json` filename) are rejected.
- This guard is inherited from the existing create-only writer.

### Entry-file path safety

- The entry file path from `--entry-file` must be relative.
- Unsafe paths (absolute, traversal, URL) are rejected.
- This guard is inherited from the existing create-only writer.

---

## Mode Matrix

The complete behavior matrix for the writer with `--append`:

| `--append` | `--write` | `--no-write` | Existing registry | Behavior |
|------------|-----------|--------------|-------------------|----------|
| no | no | no | absent | Create-only dry-run, no retained state |
| no | yes | no | absent | Create-only write, creates registry |
| no | yes | no | present | Fail: registry exists, create-only |
| no | * | yes | any | Dry-run, no retained state |
| yes | no | no | absent | Fail: `--append` requires existing registry |
| yes | no | no | present | Append dry-run, no retained state |
| yes | yes | no | present | Append write, atomically replace registry |
| yes | yes | yes | present | Append dry-run (overridden), no retained state |
| yes | * | * | absent | Fail: `--append` requires existing registry |
| yes | yes | no | present, duplicate `artifactId` | Fail: duplicate `artifactId` |
| yes | yes | no | present, invalid existing registry | Fail: existing registry invalid |
| yes | yes | no | present, invalid new entry | Fail: new entry invalid |
| * | * | * | unsafe registry path | Fail: unsafe path |
| * | * | * | unsafe entry path | Fail: unsafe path |

---

## `--append` Flag Policy

- `--append` is a boolean flag. Its presence indicates append mode.
- `--append` cannot be used with create-only semantics. When `--append` is present and no registry exists, the writer fails.
- `--append` without `--entry-file` fails.
- `--append` without `--write` dry-runs.
- `--append` with `--write` and `--no-write` dry-runs (`--no-write` wins).

---

## `--write` / `--no-write` Interaction

- `--write` is required for filesystem mutation in both create-only and append modes.
- `--no-write` overrides `--write` in both modes.
- The default (neither flag) is no-write (dry-run).
- This interaction is unchanged from the existing create-only writer.

---

## Existing Registry Validation Policy

Before append, the existing registry undergoes the same validation as any standalone registry:

1. JSON parse check
2. Structural checks (against `.pnpd/product-delivery-registry.schema.json`)
3. Forbidden-field scan
4. Secret / fake-data scan

If the existing registry fails validation, append is aborted. The writer does not attempt to append to an invalid registry.

---

## New Entry Validation Policy

The new entry is composed into the registry (appended to `entries[]`) and the resulting composed registry is validated using the same full validation pipeline. If the composed registry fails validation, append is aborted and no state is retained.

---

## Duplicate `artifactId` Policy

- The writer checks the new entry's `artifactId` against all existing `entries[].artifactId`.
- If a match is found, the writer fails with a message identifying the duplicate.
- The check is exact string match. No normalization, case-folding, or fuzzy matching.
- Duplicate `artifactId` is a hard failure. No fallback to upsert, overwrite, or skip.

---

## Registry Metadata Preservation Policy

All top-level metadata from the existing registry is preserved:

- `schemaVersion` — preserved
- `recordType` — preserved
- `registryId` — preserved
- `createdAt` — preserved
- `createdBy` — preserved
- `repo` — preserved (all sub-fields: `path`, `commit`, `branch`)
- `governance` — preserved (all sub-fields unchanged)

The following are **not** added or modified:

- No `updatedAt` field is added
- No `repo.commit` refresh
- No `repo.branch` refresh
- No governance constant modification
- No new top-level metadata fields

Registry metadata is treated as creation-time evidence. A separate schema/history phase may introduce `updatedAt` and revision tracking.

---

## Entry Ordering Policy

- Existing entries preserve their array order.
- The new entry is appended to the end of the `entries[]` array.
- No sorting by `artifactId`, `addedAt`, or any other field.
- No re-indexing of entry positions.

---

## Atomic Write Strategy

1. Read and validate the existing `registry.json`.
2. Validate the new entry fixture.
3. Compose the new registry (existing entries + new entry appended).
4. Write the composed registry to a temp file: `.pnpd/product-delivery-registry/registry.tmp-{pid}.json`.
5. Validate the temp file using the existing validator (spawnSync, argument array, no shell).
6. On validation pass: atomically rename temp file to `registry.json`.
7. On failure: remove the temp file. If the `.pnpd/product-delivery-registry/` directory becomes empty, remove it.

---

## Temp File Cleanup Policy

- Temp files use the pattern `registry.tmp-{pid}.json` inside `.pnpd/product-delivery-registry/`.
- Temp files are removed on any failure (validation fail, write error, duplicate `artifactId`, unsafe path).
- On success, the `rename` operation replaces the temp file path with `registry.json`.
- No stale temp files should persist after any writer invocation.
- The cleanup logic from the existing create-only writer is reused.

---

## Registry Path Safety

- The registry target path is hardcoded as `.pnpd/product-delivery-registry/registry.json`.
- The writer rejects any path that is not relative, contains `..`, uses absolute form, or contains URL-like components.
- The registry filename must be exactly `registry.json`.
- This guard is unchanged from the existing create-only writer.

---

## Entry-File Path Safety

- The `--entry-file` argument is validated for safety:
  - Must be relative.
  - Must not contain `..` traversal.
  - Must not be absolute.
  - Must not be a URL.
- This guard is unchanged from the existing create-only writer.

---

## Fixture Strategy

### Phase 1O-N

Phase 1O-N creates **no** fixtures.

### Future Phase 1O-O

Future Phase 1O-O may add append fixtures under:

```
tests/fixtures/pnpd/product-delivery-registry/writer/append/
```

Testing strategy for Phase 1O-O:

- **Happy-path append tests:** Generate an existing registry using the create-only writer (`--write`), then append a new entry with `--append --write`.
- **Duplicate `artifactId` tests:** Generate an existing registry, then attempt to append an entry with the same `artifactId`. Expect failure.
- **Invalid new entry tests:** Reuse existing invalid writer entry fixtures.
- **Invalid existing registry tests:** May require a static invalid registry fixture under `writer/append/`.
- **Hash support file:** Reuse the existing `tests/fixtures/pnpd/product-delivery-registry/hash-integrity/support/known-content.json`. Do not create a duplicate.

### Existing fixture preservation

Existing fixtures under `tests/fixtures/pnpd/product-delivery-registry/` are not modified. New fixtures go in a separate `writer/append/` directory.

---

## Generated Existing Registry vs Static Fixture Decision

Happy-path and duplicate-`artifactId` tests should generate existing registries programmatically using the create-only writer rather than committing static registry fixture files. This ensures:

- The generated registry reflects the current writer output format.
- Tests do not silently pass against stale static fixtures.
- The create-only writer is implicitly smoke-tested during append test setup.

Invalid-existing-registry tests may require a static fixture under `writer/append/` because the create-only writer should never produce an invalid registry. This is the exception, not the norm.

---

## Validation Strategy

### Per-invocation validation

- Validate existing registry before append.
- Validate composed registry (after append) before write.
- Both validations use the same `spawnSync` validator invocation pattern as the create-only writer.

### Future local gates (Phase 1O-O)

After Phase 1O-O append implementation, local gating scripts may run:

- Full artifact reference validation (`--check-registry-artifacts`).
- Hash integrity verification (`--verify-registry-artifact-hashes`).
- These gates run on the composed registry, not inside the writer.
- The writer does not compute hashes.
- The writer does not validate artifact contents.

---

## Hash / `contentHash` Policy

- The writer does not compute `contentHash`.
- The writer does not verify `contentHash` against artifact bytes.
- Existing entry `contentHash` values from the registry are preserved unchanged.
- The new entry's `contentHash` value (from the entry fixture) is written as-is.
- Hash integrity verification is a separate concern handled by the validator, not the writer.

---

## Referenced Artifact Content Validation Boundary

The writer's boundary for artifact validation stops at **existence checking**. The writer:

- Verifies referenced artifact file paths exist (artifact reference check).
- Does not parse, inspect, or validate artifact content.
- Does not compute checksums or verify structural validity of artifacts.
- Does not invoke artifact-type-specific validators.

Full artifact content validation is deferred to a future phase. This boundary is consistent with Phase 1O-I and the create-only writer.

---

## Merge / Upsert / Replace / Delete Deferral

The following writer modes are explicitly deferred beyond Phase 1O-O:

| Mode | Status | Rationale |
|------|--------|-----------|
| Merge | Deferred | Requires semantics for combining two full registries, conflict resolution, and deduplication |
| Upsert | Deferred | Requires `artifactId`-based entry lookup, update-in-place, and partial-field merge logic |
| Replace | Deferred | Requires in-place entry replacement with integrity preservation |
| Overwrite | Deferred | Requires duplicate `artifactId` resolution policy and silent-overwrite safety analysis |
| Delete | Deferred | Requires entry removal with ordering integrity and evidence-preservation policy |

These modes may be addressed in Phase 1O-P or later, each with its own docs-only design phase before implementation.

---

## Registry Writer Governance Boundary

The append-mode writer, like the create-only writer, is a **local operational evidence tool**. It must not:

- Authorize implementation, merge, dispatch, or deployment.
- Enable runtime consumption.
- Call GitHub or any external API.
- Generate production-readiness claims.
- Relax governance constants (`runtimeConsumptionAllowed`, `authorizesImplementation`, `authorizesDeployment`, `codexIsOwner`, `agentBridgeCanApprove`).
- Make any governance field `true` that is `false` in the schema defaults.
- Claim to certify, approve, or authorize anything.

The governance block in the registry remains advisory-only and authority-false.

---

## Runtime Consumption Boundary

Runtime consumption of the Product Delivery Registry is **blocked**. No runtime, orchestrator, scheduler, dispatcher, or other consumer may read the registry and act on it. The registry is a data artifact only. Runtime consumption requires a separate design, approval, and implementation phase. Append mode does not change this.

---

## Dispatch / Deploy / GitHub API / Production Boundary

The following are **blocked** and unchanged by this design:

- Dispatch (automated handoff to external systems)
- Deployment (filesystem or network deployment actions)
- GitHub/API mutation (commits, PRs, releases, issue updates)
- Production certification (claims that any artifact is production-ready)
- Scheduler auto-dispatch

Append mode is a local writer operation. It does not connect to, enable, or authorize any of these capabilities.

---

## Product Design Integrity / Asset Decisioning Boundary

The following capabilities are **deferred** and out of scope for append mode:

- Product Design Integrity (PDI) governance
- Anti-slop governance
- Product Design Asset Decisioning
- PNPD Teach Studio
- Obsidian sync
- Installer/packaging

Append mode does not implement, enable, or depend on any of these.

---

## Package / CI Policy

### Phase 1O-N

- No `package.json` changes.
- No CI/workflow changes.
- No new npm scripts.
- No dependency changes.

### Phase 1O-O (future)

- No `package.json` changes unless a new npm script for append-mode testing is explicitly approved.
- No CI changes unless append fixtures are added and must be validated.
- Existing CI workflow (`pnpd-ci.yml`) covers the existing fixture suite. Append fixtures, if added, will be picked up by the existing `--phase 1o` validation step.

---

## Allowed Files for Phase 1O-N

Exactly one file is created:

- `docs/pnpd/product-delivery-registry-append-mode-design.md`

No other files are created or modified.

---

## Forbidden Files for Phase 1O-N

The following files and directories must not be modified:

- `scripts/pnpd-product-delivery-registry-write.mjs`
- `scripts/pnpd-validate-schemas.mjs`
- `scripts/pnpd-orchestrator-dry-run.mjs`
- `.pnpd/product-delivery-registry.schema.json`
- `package.json`
- `.gitignore`
- `.github/workflows/pnpd-ci.yml`
- `README.md`
- Capability maps
- Templates
- Examples
- `.kunsdd/`
- `.DS_Store`
- `index.html`

The following must not be created:

- `.pnpd/product-delivery-registry/`
- `.pnpd/product-delivery-registry/registry.json`
- Append fixtures
- Lockfiles
- Generated reports
- Local state dirs

Existing files under `tests/fixtures/pnpd/product-delivery-registry/` must not be modified.

---

## Future Local Gates for Phase 1O-O

After Phase 1O-O implementation, the following local gating sequence is expected:

```bash
# Create a registry
node scripts/pnpd-product-delivery-registry-write.mjs \
  --entry-file tests/fixtures/pnpd/product-delivery-registry/writer/entry-valid-sha256.json \
  --write

# Append to it
node scripts/pnpd-product-delivery-registry-write.mjs \
  --entry-file tests/fixtures/pnpd/product-delivery-registry/writer/entry-valid-none.json \
  --append --write

# Validate the composed registry
node scripts/pnpd-validate-schemas.mjs \
  --product-delivery-registry .pnpd/product-delivery-registry/registry.json \
  --check-registry-artifacts \
  --verify-registry-artifact-hashes

# Clean up
rm -rf .pnpd/product-delivery-registry/
```

These gates are not implemented in Phase 1O-N. They are documented as future expectations.

---

## Codex Audit Checklist

When Codex audits this design, the following should be verified:

1. The document is the only file changed on the branch.
2. No forbidden files are modified.
3. No registry state was committed.
4. No append mode code exists.
5. No fixtures were added.
6. No CI or package changes exist.
7. The design clearly states append mode is not implemented in Phase 1O-N.
8. The design specifies `--append` flag policy.
9. The design specifies duplicate `artifactId` failure.
10. The design specifies metadata preservation.
11. The design specifies entry ordering (append to end).
12. The design specifies atomic write with temp file cleanup.
13. The design defers merge, upsert, replace, overwrite, and delete.
14. The design blocks runtime consumption, dispatch, deployment, GitHub/API mutation, and production certification.
15. The design defers Product Design Integrity and Asset Decisioning.
16. The design references the correct fixture inventory (33 files, not 24 shape fixtures).
17. The design identifies the correct future phase (`PHASE_1O_O_PRODUCT_DELIVERY_REGISTRY_APPEND_MODE`).
18. The design does not contain deprecated workflow or verdict language (no `CODEX_PHASE_1O_N_AUDITED_AMBER_AWAITING_OWNER`, no "Squash and merge").
19. The design is plain markdown without emoji, banners, or pagination artifacts.

---

## Remote CI Expectations

Phase 1O-N is a docs-only change. The existing CI workflow (`pnpd-ci.yml`) validates:

- Schema and fixture validation (`npm run validate`)
- Dry-run orchestration (`npm run dry-run`)
- Phase 1O validation (`node scripts/pnpd-validate-schemas.mjs --phase 1o`)

Since no scripts, fixtures, or schemas change, CI should pass identically to the baseline commit `9d4798e`.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Append mode design is incomplete or ambiguous | Codex audit before implementation; design covers all required sections |
| Future implementation diverges from design | Design is the source of truth; Phase 1O-O gates reference this document |
| Append mode introduces governance drift | Design explicitly forbids governance constant changes; audit checklist covers governance preservation |
| Duplicate `artifactId` behavior is underspecified | Design specifies exact-match failure with message; no silent handling |
| Temp file leakage | Design specifies cleanup on failure; inherited from create-only writer pattern |
| Metadata mutation (e.g., `updatedAt` creep) | Design explicitly preserves all metadata; no new fields added |

---

## Owner Decisions Required

The following decisions are encoded in this design and require owner acknowledgment:

1. Append-only is the selected next writer mode (over merge/upsert/replace/delete).
2. Phase 1O-N is docs-only; no implementation.
3. Future implementation is Phase 1O-O.
4. Duplicate `artifactId` is a hard failure (no silent overwrite/upsert).
5. No `updatedAt` field is added.
6. Governance constants are preserved and not relaxed.
7. Hash computation remains outside the writer.
8. Artifact content validation remains deferred.
9. Runtime consumption, dispatch, deployment, GitHub/API mutation, and production certification remain blocked.
10. Product Design Integrity and Asset Decisioning remain deferred.

---

## Recommended Next Action

Codex formal audit of the Phase 1O-N docs-only branch `deepseek/phase1o-n-product-delivery-registry-append-mode-design`. After Codex passes, the branch may be merged to `main` and Phase 1O-O design/implementation may begin.
