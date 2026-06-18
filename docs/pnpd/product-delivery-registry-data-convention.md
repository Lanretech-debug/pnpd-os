# Product Delivery Registry Data Convention

## Status

| Field | Value |
|---|---|
| Phase | `PHASE_1O_F_PRODUCT_DELIVERY_REGISTRY_DATA_CONVENTION` |
| Baseline commit | `125c37c553eac8788b87a039cbde63ea20e02957` |
| Latest closed phase | `PHASE_1O_E_PRODUCT_DELIVERY_REGISTRY_LOCAL_STATE_POLICY_PUSHED_REMOTE_CI_PASS` |
| Registry data path | `.pnpd/product-delivery-registry/registry.json` |
| Registry data current status | absent |
| Git status | ignored local operational state |
| Runtime consumption | blocked |
| Dispatch | blocked |
| Deployment | blocked |
| GitHub/API mutation | blocked |
| Production certification | blocked |

## Purpose

This document defines the convention for future Product Delivery registry data. It does **not** implement any registry writer, runtime reader, dispatch path, or production gate. It is a docs-only convention that establishes how future registry data should be understood, governed, created, validated, and constrained.

## Current Registry Chain

1. **1O-A** — Product Delivery registry design complete
2. **1O-B** — Product Delivery registry JSON schema complete
3. **1O-C** — Product Delivery registry fixtures complete (21 JSON files: 6 positive, 15 negative)
4. **1O-D** — Product Delivery registry validator complete (`--phase 1o` and `--product-delivery-registry <path>`)
5. **1O-E** — Local-state ignore policy complete (`.gitignore` entry)
6. **1O-F** — Data convention (this document, docs-only)

## Registry Asset Map

| Asset | Path |
|---|---|
| Design doc | `docs/pnpd/product-delivery-artifact-registry-design.md` |
| Schema | `.pnpd/product-delivery-registry.schema.json` |
| Positive fixtures | `tests/fixtures/pnpd/product-delivery-registry/positive/` |
| Negative fixtures | `tests/fixtures/pnpd/product-delivery-registry/negative/` |
| Validator | `scripts/pnpd-validate-schemas.mjs` |
| Ignored local state directory | `.pnpd/product-delivery-registry/` |
| Reserved data file | `.pnpd/product-delivery-registry/registry.json` |

## Reserved Local Registry Data Path

The path `.pnpd/product-delivery-registry/registry.json` is reserved for future Product Delivery registry data.

- **Current status**: absent.
- **Phase 1O-F**: must not create this file.
- **Committing**: must not be committed. It is listed in `.gitignore` under `.pnpd/product-delivery-registry/`.
- **Future creation**: reserved for a future explicit local writer only.

## Local-State Policy

Registry data is **local operational state**, not source-controlled truth:

- It is generated or updated by an explicit local operation.
- It is **not** source-controlled product truth.
- It is **not** source-controlled governance truth.
- The committed schema (`.pnpd/product-delivery-registry.schema.json`) is the source-controlled contract.
- Fixtures are source-controlled examples and tests, not live operational data.
- Registry data is local operational evidence and indexing only. It does not carry authority.

## Git Policy

- `.gitignore` includes `.pnpd/product-delivery-registry/`.
- The ignored directory protects future local registry data from accidental commits.
- `.pnpd/product-delivery-registry.schema.json` is a sibling **file** and remains tracked.
- The ignore rule applies to the **directory**, not the schema file.
- Local state directories (ledger, handoffs, locks, runtime-readiness, product-delivery-registry) must not be committed.

## Schema Location

- `.pnpd/product-delivery-registry.schema.json` is committed and tracked.
- The schema governs the shape of registry data: `recordType`, `schemaVersion`, `governance` constraints, entry structure, artifact-type enums, validation-status enums, integrity metadata.
- The schema is a **sibling file** in the `.pnpd/` directory, not inside `.pnpd/product-delivery-registry/`.
- Ignoring the data directory (`.pnpd/product-delivery-registry/`) does **not** ignore or untrack the schema file.

## Data File Lifecycle

- **Currently**: absent. No registry data file exists.
- **Future writer**: must be explicit-flag-only. No default writes.
- **No auto-generation**: scheduler, daemon, watcher, or background process must not create or update registry data.
- **No implicit updates**: validation (`--phase 1o`) and dry-run (`npm run dry-run`) must not create or modify registry data.
- **Future writer** must be separately designed, implemented, audited, merged, pushed, and CI-confirmed in its own governed phase.

## Validation Policy

A standalone registry file can be validated with:

```bash
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path>
```

Validation means:

- The file parses as JSON.
- The registry shape is checked against the schema contract.
- Path safety is checked (no absolute, traversal, URL, `.env`, `~`, Windows drive prefix, `.pnpd/` paths; must end with `.json`).
- Governance constraints are checked (`advisoryOnly: true`, `ownerFinalAuthority: true`, all authorization/mutation/runtime fields `false`).
- Forbidden-field and security scans are run where implemented.

Validation does **not** mean:

- Referenced artifacts exist on disk.
- Artifact content hashes match.
- Artifact quality is certified.
- Implementation is authorized.
- Dispatch is authorized.
- Deployment is authorized.
- Production readiness is certified.

## Future Writer Policy

Any future registry writer must comply with these rules:

- **Explicit flag only** — no default or automatic writes.
- **Local-only** — no network access, no remote calls.
- **No GitHub/API mutation** — must not push, merge, create PRs, or modify remote state.
- **No dispatch** — must not trigger dispatch or orchestration.
- **No deployment** — must not deploy or release software.
- **No production certification** — must not claim or imply production readiness.
- **No runtime consumption** — must not feed runtime decisions.
- **Validate before write** — must pass `--product-delivery-registry` validation.
- **Validate after write** — written file must be re-validated.
- **No overwrite unless explicitly approved** — must respect existing data.
- **Advisory-only** — registry data remains advisory and does not authorize any action.
- **Separately designed, audited, and approved** — the writer must go through its own Hermes design, DeepSeek implementation, Codex audit, Owner approval, merge, push, and CI confirmation.

## Relationship To Product Delivery Artifacts

- Registry entries **may reference** Product Delivery artifacts by relative path.
- The registry is an **index and evidence aid**, not the artifact itself.
- The registry does **not** replace standalone artifact validation (`--product-delivery-artifact <path>`).
- The registry does **not** certify artifact quality.
- The registry does **not** make artifacts executable.
- The registry does **not** authorize implementation.

## Artifact-Reference Policy

- The current validator checks registry entry `path` fields for shape and safety.
- **Artifact existence checks are deferred.** The validator does not confirm that referenced artifact files exist on disk.
- **Hash verification is deferred.** The validator does not compute or compare content hashes.
- Artifact reference validation is future work and must be separately designed.
- No runtime linkage between registry entries and artifact files exists.

## Integrity And Hash Policy

- The schema supports integrity metadata on every entry (`hashAlgorithm`, `contentHash`).
- `hashAlgorithm` may be `"none"` and `contentHash` may be `null` for current fixtures.
- Full artifact hash verification is **deferred**.
- Future read-only hash verification must be separately designed and must not imply production certification.

## Runtime Consumption Boundary

- **Runtime consumption remains blocked.**
- No orchestrator, agent, or automated process may consume registry data for decisions.
- Registry data is for **human review only** at this stage.
- Any future runtime consumption requires:
  - A separate Hermes design.
  - Schema changes or new fixtures if needed.
  - Validator changes if needed.
  - Codex audit.
  - Owner approval.
  - Merge, push, and CI confirmation.

## Dispatch, Deployment, GitHub/API, And Production Boundaries

- **Dispatch remains blocked.**
- **Deployment remains blocked.**
- **GitHub/API mutation remains blocked.**
- **Production certification remains blocked.**
- Registry data does **not** authorize any of the above.
- These gates can only be unlocked by separate governed phases with Owner approval.

## Product Design Integrity And Anti-Slop Boundary

- Product Design Integrity and anti-AI-slop governance are important future tracks.
- They are **out of scope** for Phase 1O-F.
- They must **not** be mixed into the registry data convention.
- Future design integrity work must follow its own Hermes design, DeepSeek implementation, Codex audit, Owner merge/push, and CI confirmation.
- Design-token schemas, anti-slop validators, visual review tooling, screenshot comparison, and Figma integration are deferred and not defined here.

## Future Roadmap

| Phase | Description |
|---|---|
| 1O-F | Docs-only data convention (this document) |
| 1O-G | Optional example registry instance, if needed |
| 1O-H | Read-only artifact existence / hash validation design |
| 1O-I | Explicit local registry writer design |
| Later | Read-only runtime consumption design |
| Separate track | Product Design Integrity / anti-AI-slop governance |
| Much later | Dispatch, GitHub/API, deployment — each separately governed and still blocked until approved |

## Non-Goals

This phase explicitly does **not** deliver:

- A registry data file
- A registry directory
- An example registry instance
- A registry writer
- A validator change
- A schema change
- A fixture change
- Runtime consumption
- Dispatch
- Deployment
- GitHub/API mutation
- Production certification
- Anti-slop implementation
- CLI/bootstrap tooling
- README or capability map update

## Owner And Codex Authority Model

- **Owner** is the final human authority.
- **Codex** audits and reviews only. Codex is **not** Owner.
- **AgentBridge** coordinates only. AgentBridge does **not** approve, merge, dispatch, deploy, certify, or bypass gates.
- Registry data is advisory-only and **cannot** elevate any agent, process, or data above the Owner's authority.
- No field, entry, or metadata in the registry can override or bypass the governance model.

## Risks And Mitigations

| Risk | Mitigation |
|---|---|
| Wording implies runtime consumption | Explicit blocked-boundary section |
| Wording implies production readiness | "Production certification remains blocked" stated directly; no unsafe claims |
| Wording implies registry authorizes implementation | Advisory-only language throughout; governance fields all `false` |
| Docs drift into future implementation details | Future phases explicitly labeled "later" or "separate track" |
| Docs contradict schema or validator | Validator suite run before commit; manual invariant checks |
| Docs bless GitHub/API mutation | Explicit boundary statement; non-goals list |
| Docs expand into Product Design Integrity / anti-slop scope | Explicit boundary section; "out of scope" declaration |
| Accidental registry data creation | No-write guards; `.gitignore` protection; no code changes |
| Codex not consulted | Codex audit required before merge |
