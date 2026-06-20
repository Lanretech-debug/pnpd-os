# Phase 1O-V Package Script Wrapper Design

## 1. Current Verdict

**PHASE_1O_V_PACKAGE_SCRIPT_WRAPPER_DESIGN_DRAFTED_PENDING_CODEX_AUDIT**

This is a docs-only design document.

It introduces no package.json change.
It introduces no npm script.
It introduces no validator behavior.
It introduces no CI behavior.
It introduces no runtime behavior.
It introduces no production readiness.

## 2. Baseline

- Repo: Lanretech-debug/pnpd-os
- Branch baseline: main
- Baseline commit: `5c178ed55fd6e04adc2795c345c8ce4361793553`
- Baseline verdict: `PHASE_1O_U_PRODUCT_DELIVERY_REGISTRY_VALIDATION_USAGE_GUIDE_PUSHED_CI_GREEN`
- Remote CI: PNPD CI run `27868035487`, completed, success
- Known local caveat: `npm run dry-run` may report `PASS_WITH_KNOWN_LOCAL_NEEDS_TRIAGE_CAVEAT` due to protected main plus known untracked files (`.DS_Store`, `.kunsdd/`, `index.html`)

## 3. Purpose

This design evaluates whether future package scripts should wrap existing Product Delivery Registry validator surfaces.

This document is planning only and does not authorize implementation. Any future package script implementation requires a later Owner-approved phase.

Phase 1O-V does not modify `package.json`. It does not add npm scripts. It does not change CI, validator code, schemas, or fixtures. It does not create registry state.

## 4. Existing Validator Surfaces

All surfaces below were verified against current `node scripts/pnpd-validate-schemas.mjs --help` output and Phase 1O-U usage guide content. No surface is invented.

Default invocation:

```
node scripts/pnpd-validate-schemas.mjs
```

Phase-based Product Delivery Registry validation:

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

The validator also supports non-registry surfaces (`--runtime-readiness-report`, `--research-discovery-artifact`, `--product-delivery-artifact`, and additional `--phase` values such as `--phase 0`, `--phase 1b`, `--phase 1c`, `--phase 1f`, `--phase 1h`, `--phase 1m`, `--phase 1n`) that are outside the Product Delivery Registry scope of this design.

A separate Product Delivery Registry Writer exists at `scripts/pnpd-product-delivery-registry-write.mjs`. It is governed separately: it operates in dry-run mode by default, requires explicit `--write` for filesystem mutation, supports create-only and append-only modes, and has no merge, upsert, replace, update, or delete modes. The writer is not in scope for Phase 1O-V wrapper design.

## 5. Candidate Package Script Names

All names listed below are candidate names only. None are implemented in Phase 1O-V. None exist in `package.json`. None are intended to exist in `package.json` unless a later Owner-approved phase explicitly adds them.

Candidate names evaluated:

- `validate:pdr`
  Candidate only. Not implemented in Phase 1O-V.

- `validate:pdr:fixtures`
  Candidate only. Not implemented in Phase 1O-V.

- `validate:pdr:examples`
  Candidate only. Not implemented in Phase 1O-V.

- `validate:pdr:registry`
  Candidate only. Not implemented in Phase 1O-V.

- `validate:pdr:artifacts`
  Candidate only. Not implemented in Phase 1O-V.

- `validate:pdr:hashes`
  Candidate only. Not implemented in Phase 1O-V.

No claim is made that these names are appropriate, final, or approved.

## 6. Candidate Script Mapping

Each candidate below describes the validator command it may wrap in a future phase. All commands use code blocks. No markdown tables are used.

### 6.1 `validate:pdr`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --phase 1o
```

Purpose: Run Product Delivery Registry shape fixture validation (schema plus positive and negative shape fixtures).

Risk: Low. The `--phase 1o` flag is stable and exercises 21 shape fixtures (6 positive, 15 negative). No path argument is needed.

Recommendation: Could be a candidate local wrapper in a future phase. Does not need to be included in `npm run validate` unless blast radius is intentionally approved.

### 6.2 `validate:pdr:fixtures`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --phase 1o
```

Purpose: Same as `validate:pdr`. This candidate name emphasizes fixture coverage rather than the phase name.

Risk: Redundant with `validate:pdr`. Introducing both may cause operator confusion.

Recommendation: Do not introduce this candidate unless `validate:pdr` is deemed insufficiently descriptive after Operator review. If introduced, it should mirror `validate:pdr` exactly and not diverge.

### 6.3 `validate:pdr:examples`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --phase 1o-example
```

Purpose: Discover and validate example fixtures under `tests/fixtures/pnpd/product-delivery-registry/examples/`. Current baseline discovers exactly 1 example fixture (`example-minimal-registry.json`).

Risk: Low. The `--phase 1o-example` flag is stable and path-agnostic for discovery. If future phases add multiple examples, the wrapper remains correct.

Recommendation: Could be a candidate local wrapper in a future phase. Does not need to be included in `npm run validate`.

### 6.4 `validate:pdr:registry`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path>
```

Purpose: Validate a standalone registry file at an arbitrary path.

Risk: Medium. This candidate requires argument passing. A package script wrapper `npm run validate:pdr:registry -- <path>` would use the `--` convention to forward arguments, but the operator must know to supply the path. Silently wrapping a fixed path would be incorrect. Without careful design, the wrapper could imply the registry path is known or defaulted.

Recommendation: Do not implement this candidate until argument-passing design is explicitly approved in a later phase. A standalone path validator should not be hidden behind an ambiguous script.

### 6.5 `validate:pdr:artifacts`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --check-registry-artifacts
```

Purpose: Validate that each entry path in the registry points to an existing regular file.

Risk: Medium-High. This candidate inherits the argument-passing risk from `validate:pdr:registry` and adds the artifact-check flag. The operator must supply a valid registry path. The artifact check touches the filesystem and returns different results depending on which files exist at the paths recorded in the registry.

Recommendation: Do not implement this candidate until argument-passing design and artifact-check semantics are explicitly approved in a later phase. Artifact and hash checks require path-sensitive usage and should not be hidden behind ambiguous scripts.

### 6.6 `validate:pdr:hashes`

Candidate only.

Intended command:

```
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path> --check-registry-artifacts --verify-registry-artifact-hashes
```

Purpose: Verify `sha256` contentHash values against actual file bytes for each registry entry.

Risk: High. This candidate requires both a valid registry path and the `--check-registry-artifacts` flag as a prerequisite. Hash verification reads file bytes and computes SHA-256 digests at runtime. Wrapping this in a package script could create confusion about side effects and performance.

Recommendation: Do not implement this candidate until argument-passing design, artifact-check semantics, and hash-verification runtime cost are explicitly approved in a later phase. Hash verification should remain an explicit operator choice, not a convenience default.

## 7. Recommended Future Implementation Shape

Future implementation should be a separate Phase 1O-W or later.

Future implementation should touch `package.json` only if the Owner explicitly approves.

Future implementation should start with local-only scripts. The safest candidates for initial local wrapping are `validate:pdr` (wrapping `--phase 1o`) and `validate:pdr:examples` (wrapping `--phase 1o-example`), because both require no path argument and have stable behavior.

CI integration should remain separate from package script implementation unless the Owner explicitly approves combining them.

`npm run validate` should not be expanded to include Product Delivery Registry phases until the blast radius is intentionally approved. Adding `--phase 1o` or `--phase 1o-example` to the default `npm run validate` chain would change `npm test` behavior and should require explicit governance.

Standalone registry path validation (`--product-delivery-registry <path>`) and its optional flags (`--validate-schema-instance`, `--check-registry-artifacts`, `--verify-registry-artifact-hashes`) require argument-passing design that package scripts handle via `npm run <script> -- <args>`. This convention should be documented explicitly in any future wrapper phase rather than assumed.

## 8. Rejected Script Behaviors

The following behaviors are rejected for any package script wrapper design, now and in any future phase unless a later Owner-approved phase explicitly reverses:

- Automatic runtime consumption of registry state.
- Automatic registry writing (create, append, merge, upsert, replace, update, delete).
- Automatic artifact mutation.
- Automatic hash generation.
- Automatic dispatch.
- GitHub or API mutation.
- Deployment or release hooks.
- Production readiness claims.
- Silently adding `--phase 1o-example` into `npm run validate` without explicit design approval.
- Silently adding any Product Delivery Registry validation into `npm run validate` without explicit design approval.

## 9. Authority and Governance

The following authority chain governs package script wrapper work:

- Hermes designs.
- Owner approves, amends, or rejects.
- DeepSeek implements only the approved scope.
- Codex audits.
- Codex may merge or push only when the Owner prompt explicitly contains `AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED`.
- Codex has no standing merge or push authority.
- Package script implementation requires a later Owner-approved phase.
- CI integration requires a separate Owner-approved phase unless explicitly combined later.
- Phase 1O-V is docs-only and introduces no implementation.

## 10. Non-Goals

Phase 1O-V explicitly does not:

- Modify `package.json`.
- Add any npm script.
- Modify validator code.
- Modify schemas.
- Modify fixtures.
- Modify CI.
- Add dependencies.
- Create lockfiles.
- Create registry state (no `.pnpd/product-delivery-registry/`).
- Implement writer behavior.
- Implement runtime consumption.
- Implement merge, upsert, replace, or delete.
- Implement Product Design Integrity.
- Implement Asset Decisioning.
- Implement dispatch.
- Implement deployment, release, or production behavior.
- Implement daemon or control harness.
- Implement scheduler or installer.
- Introduce GitHub or API mutation.
- Push.
- Merge.
- Start Phase 1O-W.

## 11. Risks

The following risks are identified for future package script wrapper implementation:

- **Candidate name path dependency.** If a candidate name is later adopted, operators and CI pipelines that reference it become path-dependent on that name. Renaming or deprecating a wrapper later requires migration.
- **Future package script drift from validator help/output.** If the validator adds, renames, or removes flags, any wrapper that hard-codes those flags must be updated. Wrappers created in a later phase will need a maintenance contract.
- **CI blast radius.** If Product Delivery Registry scripts are later wired into `npm run validate`, the `npm test` surface changes. This could cause CI failures for unrelated work if registry fixtures are extended or registry paths change.
- **Argument-passing ambiguity.** Standalone registry validation requires a path argument. The `npm run <script> -- <args>` convention works but is not obvious to all operators. Misuse could produce confusing errors.
- **Confusion between local convenience scripts and governance authority.** A wrapper script is a convenience, not a governance check. Operators may mistakenly treat `npm run validate:pdr` as an authoritative gate, when the validator itself reports advisory governance checks that do not authorize any action.

## 12. Final Recommendation

Phase 1O-V should remain docs-only.

The recommended next implementation phase, if the Owner approves later, is a narrow package.json local-wrapper phase (Phase 1O-W or later) that:

- Adds only explicitly selected scripts (candidates `validate:pdr` and `validate:pdr:examples` as the safest starting set).
- Does not change CI.
- Does not expand `npm run validate`.
- Documents the `npm run <script> -- <args>` convention for any path-argument scripts added later.
- Waits for separate Owner approval before adding standalone registry, artifact-check, or hash-verification wrappers.
