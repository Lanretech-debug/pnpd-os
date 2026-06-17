# PNPD Product Delivery Artifact Registry Design

## Status

| Field | Value |
|-------|-------|
| **Phase** | Phase 1O-A |
| **Status** | Design only |
| **Baseline commit** | `9404d0e1e4cdce2fbff2f02cd588ea463e6cd64e` |
| **Remote CI** | PNPD CI run `27664741447`, success |
| **Scope** | local read-only registry/index convention |
| **Runtime consumption** | blocked |
| **Dispatch** | blocked |
| **GitHub/API mutation** | blocked |
| **Production certification** | blocked |

---

## 1. Purpose

Product Delivery artifacts can now be created and validated individually using the standalone artifact validator (`--product-delivery-artifact <path>`). PNPD OS does not yet define a safe registry/index convention for organizing validated Product Delivery artifacts so they can be discovered, tracked, and reviewed at scale.

This design proposes a future registry convention only.

The registry is advisory, read-only, and local-only. It records what exists; it does not decide what happens. The registry does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, release, production readiness, or gate bypass.

---

## 2. Non-goals

The following are explicitly out of scope for this design and all Phase 1O sub-phases unless a separate governed phase explicitly adds them after Codex audit and Owner approval:

- no runtime/orchestrator consumption
- no dispatch
- no deployment
- no GitHub/API mutation
- no artifact generation
- no implementation generation
- no production certification
- no state daemon
- no watcher
- no network calls
- no Obsidian sync
- no PNPD Teach Studio
- no installer/packaging
- no schema implementation in this phase
- no fixtures in this phase
- no validator changes in this phase
- no README/capability map changes in this phase

---

## 3. Current foundation

The following Product Delivery capabilities are stable and complete as of the baseline commit. The registry design builds on them conceptually but does not modify them:

- **Product Delivery framework doc:** `docs/pnpd/memory-and-product-delivery-framework.md`
- **Product Delivery templates:** `templates/product/` (14 templates)
- **Product Delivery schema:** `.pnpd/product-delivery.schema.json`
- **Product Delivery fixtures:** `tests/fixtures/pnpd/product-delivery/` (16 files: 6 valid, 10 invalid)
- **Product Delivery fixture validator:** `node scripts/pnpd-validate-schemas.mjs --phase 1n`
- **Standalone Product Delivery artifact validator:** `node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>`
- **README and capability map** document Product Delivery Mode as of Phase 1N-F
- **CI** is green at `9404d0e`

---

## 4. Registry concept

The proposed registry is:

- a local inventory of Product Delivery artifact metadata
- a list of artifact records
- an index for human review and future validation
- not executable
- not authoritative
- not consumed by runtime
- not linked to dispatch

> The registry records what exists. It does not decide what happens.

---

## 5. Proposed future registry location

**Preferred convention:**

```
.pnpd/product-delivery-registry/registry.json
```

Rationale:

- under `.pnpd/` governance namespace, consistent with schemas and other PNPD state
- separate from templates (`templates/product/`) and fixtures (`tests/fixtures/pnpd/product-delivery/`)
- local-first, no network or external dependency
- easy to validate later with a schema and standalone validator
- can remain gitignored if future write behavior is added, or committed if manual curation is preferred
- should not be created in this phase

**Alternative considered and deferred:**

```
docs/pnpd/product-delivery-registry.json
```

Rejected because `docs/` is for human-authored documentation, not operational data. Registry data is operational metadata that may be validated, scanned, and eventually consumed by tooling. Mixing it with docs blurs the boundary between documentation and operational state.

---

## 6. Proposed future registry shape

The following JSON shape is illustrative only and not implemented. It shows the intended structure for future schema design.

```json
{
  "schemaVersion": "1.0.0",
  "recordType": "productDeliveryArtifactRegistry",
  "registryId": "pnpd-pd-registry",
  "createdAt": "2026-06-17T00:00:00.000Z",
  "createdBy": "owner-identity",
  "repo": {
    "name": "pnpd-os",
    "root": "."
  },
  "governance": {
    "advisoryOnly": true,
    "authorizesImplementation": false,
    "authorizesMerge": false,
    "authorizesDispatch": false,
    "authorizesDeployment": false,
    "authorizesGitHubMutation": false,
    "authorizesApiMutation": false,
    "certifiesProductionReadiness": false,
    "ownerFinalAuthority": true,
    "codexIsOwner": false,
    "agentBridgeCanApprove": false,
    "agentBridgeCanMerge": false,
    "agentBridgeCanDispatch": false,
    "agentBridgeCanDeploy": false
  },
  "entries": [
    {
      "artifactId": "example-prd",
      "artifactType": "prd",
      "phase": "discovery",
      "path": "path/to/artifact.json",
      "validationCommand": "node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact path/to/artifact.json",
      "validationStatus": "valid",
      "validatedAt": "2026-06-17T00:00:00.000Z",
      "createdAt": "2026-06-16T00:00:00.000Z",
      "createdBy": "owner-identity",
      "source": "manual",
      "notes": "Initial PRD for the example feature."
    }
  ]
}
```

**Top-level fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | string | Schema version for the registry document |
| `recordType` | string | Fixed: `productDeliveryArtifactRegistry` |
| `registryId` | string | Human-readable registry identifier |
| `createdAt` | string | ISO 8601 timestamp |
| `createdBy` | string | Identity of the registry creator |
| `repo` | object | Repository metadata |
| `governance` | object | Non-authorizing governance consts |
| `entries` | array | List of artifact entry records |

**Entry fields:**

| Field | Type | Description |
|-------|------|-------------|
| `artifactId` | string | Unique artifact identifier within the registry |
| `artifactType` | string | Artifact type from the Product Delivery type set |
| `phase` | string | Phase the artifact belongs to |
| `path` | string | Relative path to the artifact file under repo root |
| `validationCommand` | string | Command to validate the artifact |
| `validationStatus` | string | One of: `valid`, `invalid`, `notValidated`, `stale`, `unknown` |
| `validatedAt` | string | ISO 8601 timestamp of last validation |
| `createdAt` | string | ISO 8601 timestamp of artifact creation |
| `createdBy` | string | Identity of the artifact creator |
| `source` | string | How the entry was added (e.g., `manual`, `imported`) |
| `notes` | string | Free-form notes for human review |

**Allowed `artifactType` values for machine-validated entries:**

- `prd`
- `productSpec`
- `architectureSpec`
- `implementationHandoff`

Broader template types (Product Vision Brief, Design Tree, Prototype Plan, Design Spec, Infrastructure Plan, Test Plan, Owner Decision, Parked Idea, Rejected Options, Owner Solution Choice) may be added to the registry as non-validated entries only. They must be clearly labeled as not yet machine-validated.

---

## 7. Governance fields

Registry records must include explicit non-authorizing governance fields. The recommended governance object in the registry top level is:

```json
{
  "advisoryOnly": true,
  "authorizesImplementation": false,
  "authorizesMerge": false,
  "authorizesDispatch": false,
  "authorizesDeployment": false,
  "authorizesGitHubMutation": false,
  "authorizesApiMutation": false,
  "certifiesProductionReadiness": false,
  "ownerFinalAuthority": true,
  "codexIsOwner": false,
  "agentBridgeCanApprove": false,
  "agentBridgeCanMerge": false,
  "agentBridgeCanDispatch": false,
  "agentBridgeCanDeploy": false
}
```

Future schema phases must lock these values with JSON Schema `const` so they cannot be overridden at the data level.

In prose: Owner remains final human authority. Codex remains auditor/reviewer, not Owner. AgentBridge remains non-authorizing.

---

## 8. Entry validation status model

The `validationStatus` field tracks the known validation state of each entry.

| Status | Meaning |
|--------|---------|
| `valid` | Standalone artifact validator passed at the recorded timestamp. |
| `invalid` | Validator failed at the recorded timestamp. |
| `notValidated` | No validation run has been recorded for this entry. |
| `stale` | Artifact content changed after the last recorded validation, or the validation timestamp is no longer trusted. |
| `unknown` | Legacy or imported entry without enough evidence to determine status. |

Validation status is evidence only. It does not authorize implementation.

---

## 9. Path policy

Registry entry paths must follow the same safety rules as standalone artifact validation:

- paths must be relative and under the repository root
- paths must end with `.json`
- absolute paths are rejected
- `..` traversal is rejected
- symlink escape is rejected
- private filesystem paths (`/Users/`, `/home/`, `/etc/`, `/var/`, `C:\`) are rejected
- `.env` references are rejected
- no URLs as artifact paths
- no external paths outside the repository

Registry paths refer to local artifact files only. The registry index should not reference files outside the repository root.

---

## 10. Security model

Registry entries must not contain:

- no secrets (API keys, tokens, passwords)
- no private keys (`-----BEGIN ... PRIVATE KEY-----`)
- no `.env` paths or references
- no private workstation paths (`/Users/`, `/home/`, etc.)
- no network URLs as artifact locations
- no executable commands or shell snippets as executable instructions
- no GitHub/API mutation fields
- no deployment fields
- no dispatch target fields
- no production readiness claims

The registry is a metadata index. It should be safe to read at any time and safe to commit if the repository owner chooses to do so.

---

## 11. Relationship to standalone artifact validation

The existing standalone artifact validator is separate from the registry:

```bash
node scripts/pnpd-validate-schemas.mjs --product-delivery-artifact <path>
```

This command validates one Product Delivery artifact file. It does not read, write, or depend on a registry.

Future relationship:

- A future registry validator should verify registry metadata structure and governance consts.
- A future registry validator may optionally confirm that referenced artifact paths are path-safe.
- A future registry validator must not automatically validate every referenced artifact unless separately designed for that purpose.
- Registry validation and artifact validation remain distinct. One validates the index; the other validates the artifact content.

---

## 12. Relationship to runtime/orchestrator

- The runtime/orchestrator must not consume registry data in Phase 1O-A or any Phase 1O sub-phase before runtime consumption is separately designed and approved.
- Runtime consumption remains blocked after 1O-A.
- runtime consumption remains blocked pending separate design, audit, and approval.
- Any future runtime consumption requires separate design, schema, fixtures, validator, Codex audit, and Owner approval.
- Registry presence must not change dry-run behavior.
- Registry presence must not affect dispatch status.

---

## 13. Relationship to AgentBridge

- AgentBridge may reference registry metadata in future planning discussions only after separate Owner approval for that use case.
- AgentBridge must not treat registry entries as approvals.
- AgentBridge must not dispatch, merge, deploy, or mutate based on registry entries.
- Registry entries remain evidence for human review only.

AgentBridge remains non-authorizing. The registry does not change this.

---

## 14. Future phase split

This design proposes the following phased implementation path. Each phase must be separately designed, implemented, audited by Codex, and approved by the Owner. These phases must not be collapsed.

| Phase | Scope | Description |
|-------|-------|-------------|
| **1O-A** | Design only | This document. Registry convention design. |
| **1O-B** | Schema only | Registry JSON schema (`.pnpd/product-delivery-registry.schema.json`). |
| **1O-C** | Fixtures only | Registry test fixtures (valid and invalid). |
| **1O-D** | Validator mode | `--phase 1o` fixture validation in `scripts/pnpd-validate-schemas.mjs`. |
| **1O-E** | Standalone validation | `--product-delivery-registry <path>` standalone registry file validation. |
| **1O-F** | Docs update | README and capability map update to document registry capability. |

Runtime consumption of the registry remains deferred beyond 1O-F and requires a separate governed phase.

---

## 15. Rejected shortcuts

The following shortcuts are explicitly rejected. They must not be implemented without separate design, Codex audit, and Owner approval:

- jumping directly to runtime consumption of the registry
- linking registry to orchestrator behavior
- dispatching from registry entries
- generating implementation from registry entries
- using registry as approval evidence
- adding package scripts before the registry validator exists
- adding CI coverage before schema, fixtures, and validator exist
- adding write behavior before schema and path policy exist
- using registry for production readiness certification
- collapsing multiple sub-phases into a single phase
- treating the registry design as an implementation

---

## 16. Candidate future command names

For future phases only. No such commands are implemented in Phase 1O-A.

**Fixture validation (after schema and fixtures exist):**

```bash
node scripts/pnpd-validate-schemas.mjs --phase 1o
```

**Standalone registry file validation (after validator design):**

```bash
node scripts/pnpd-validate-schemas.mjs --product-delivery-registry <path>
```

These names follow the existing pattern: `--phase 1n` for Product Delivery fixtures, `--product-delivery-artifact` for standalone artifact validation. Using `--phase 1o` and `--product-delivery-registry` keeps the CLI surface consistent and discoverable.

No such commands are implemented in Phase 1O-A.

---

## 17. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Registry becomes a hidden approval mechanism | Governance consts locked to `false`; explicit docs state advisory-only |
| Registry becomes runtime input | Runtime consumption blocked; explicit boundary in relationship section |
| Stale validation evidence | `validationStatus` states track staleness; future hash/timestamp rules can enforce freshness |
| Private paths leak into registry entries | Relative path policy enforced; same path safety rules as artifact validator |
| Scope creep into artifact generation | Generation explicitly blocked in non-goals and rejected shortcuts |
| CI/docs claim future capability as current | README/capability map update deferred until implementation phases complete (1O-F) |
| Registry treated as if it certifies production readiness | Production certification blocked; all governance consts `false` |

---

## 18. Acceptance criteria for Phase 1O-A

- [ ] Only `docs/pnpd/product-delivery-artifact-registry-design.md` added
- [ ] No existing files modified
- [ ] No schema, fixture, validator, runtime, package, CI, or template changes
- [ ] Design says local-only, read-only, advisory-only
- [ ] Design keeps runtime consumption blocked
- [ ] Design keeps dispatch blocked
- [ ] Design keeps GitHub/API mutation blocked
- [ ] Design keeps deployment blocked
- [ ] Design keeps production certification blocked
- [ ] Design preserves Owner final authority
- [ ] Design keeps Codex auditor/reviewer only
- [ ] Design keeps AgentBridge non-authorizing
- [ ] Local validation gates pass (`npm run validate`, `npm test`, `npm run dry-run`)
