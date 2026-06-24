# PNPD Deferred Scope Reconciliation

**Status:** docs-only. Advisory only. Non-executable. Non-authoritative. Non-mutating. Not implementation authority. Owner-gated. Codex-gated.

---

## 1. Purpose

This document is a docs-only reconciliation that:

1. records the clean repo hygiene expectation
2. records that known local dirt has been removed
3. reconciles the current canonical capability set
4. separates deferred work from blocked work
5. defines what work is eligible next
6. enforces batch-mode delivery discipline
7. prevents Phase 1R governance work from drifting into endless microphases
8. prevents deferred/blocked work from being mistaken as active backlog
9. prevents future implementation without Owner-authorized Hermes design

This document does not implement runtime behavior, schema, validators, fixtures, CI, registry writes, generated PNPD state, generated idea records, idea generation, template parsing, or template conversion. It claims no production readiness and no adoption readiness.

---

## 2. Baseline

```text
Baseline verdict: PHASE_1R_BATCH_1_AGENT_NOVELTY_REVIEW_PACK_PUSHED_CI_GREEN
Baseline commit: 9caf8d0a3b4773a0d63965c779f29810070c9112
Remote CI run: 28083166676
Remote CI conclusion: success
Local hygiene preflight: CODEX_LOCAL_HYGIENE_PREFLIGHT_CLEAN_PASS
```

- Phase 1R Batch 1 is canonical.
- Local hygiene preflight passed.
- Local known dirt was removed without tracked file changes.
- Phase 1Q remains stopped.
- Template conversion remains closed.
- 1S Batch 0 is not runtime implementation.
- 1S Batch 0 is not schema implementation.
- 1S Batch 0 is not validator implementation.
- 1S Batch 0 is not CI implementation.
- 1S Batch 0 is not registry implementation.
- 1S Batch 0 is not AgentBridge authority implementation.
- 1S Batch 0 is not readiness evidence.

---

## 3. Repo Hygiene Policy

The repo hygiene policy applies to PNPD-OS as a project no longer in early-stage exploration.

- Local dirt must not be tolerated as permanent background noise.
- Known local dirt must be removed before implementation batches.
- Cleanup must be targeted only.
- Broad cleanup commands such as `git clean -fdx` must not be used without explicit Owner authorization.
- Unknown untracked files must be inspected before deletion.
- Cleanup must not create a commit unless tracked files change.
- Expected local implementation state is clean `main` matching `origin/main`.
- repo hygiene is a prerequisite for every batch, not a one-time event.

---

## 4. Known Local Dirt Removal

The following historical dirt was removed by Codex local hygiene preflight:

```text
.DS_Store
.kunsdd/
index.html
```

- removal was local only
- no tracked files changed
- no commit was required
- no push was required
- these files must not be reintroduced
- if they reappear, they should be removed locally before future implementation work

---

## 5. Current Canonical Capability Set

The current canonical capability set consists of docs-only governance artifacts:

- Phase 1Q: bug forecast validator complete
- Phase 1N-C: template adoption/validation decision pack, docs-only
- Phase 1N-D: product template contract, docs-only
- Phase 1N-E: product template-to-artifact mapping matrix, docs-only
- Phase 1N-F: product template conversion boundary and no-parser strategy, docs-only
- Phase 1R-A: agent novel idea capability harness, docs-only
- Phase 1R-B: agent novel idea candidate synthetic example, docs-only
- Phase 1R Batch 1: agent novelty review pack, docs-only

The following capabilities do **not** exist and are not implied:

- no runtime implementation exists for idea generation
- no idea schema exists
- no idea validator exists
- no idea fixtures exist
- no generated idea records exist
- no template parser exists
- no template converter exists
- no Product Delivery Registry production writer exists
- no Product Delivery Registry runtime consumption exists
- no AgentBridge authority change exists
- no production readiness claim exists
- no adoption readiness claim exists

---

## 6. Deferred Work Register

This is the deferred work register. It identifies work that has been discussed, designed, or implied but is not yet authorized for implementation.

| # | Deferred item | Current status | Why deferred | Required unlock authority | Likely future phase type |
|---|---------------|----------------|-------------|--------------------------|--------------------------|
| 1 | idea generator | Not implemented | No schema, no runtime, no registry | Owner-authorized Hermes design | Phase 1S or later |
| 2 | idea schema | Not designed | Blocked by idea generator design | Owner-authorized Hermes design | Pre-implementation design batch |
| 3 | idea validator | Not designed | No schema to validate | Owner-authorized Hermes design | Schema-following batch |
| 4 | idea fixtures | Not created | No schema to fixture | Owner-authorized Hermes design | Test-data batch |
| 5 | generated idea records | Not generated | No generator, no schema, no registry | Owner-authorized Hermes design | Runtime-implementation batch |
| 6 | generated PNPD state | Not generated | No generator, no registry writer | Owner-authorized Hermes design | Runtime-implementation batch |
| 7 | AgentBridge routing authority for ideas | Not changed | No idea records to route | Owner-authorized Hermes design | AgentBridge authority batch |
| 8 | registry writes from templates or ideas | Not implemented | No writer, no schema, no authority | Owner-authorized Hermes design | Registry-writer batch |
| 9 | runtime behavior for template conversion or idea processing | Not implemented | No parser, no converter, no schema | Owner-authorized Hermes design | Runtime-implementation batch |
| 10 | CI enforcement for templates or ideas | Not implemented | Nothing to enforce | Owner-authorized Hermes design | CI-enforcement batch |
| 11 | automatic backlog creation | Not implemented | No registry, no idea records | Owner-authorized Hermes design | Registry-consumer batch |
| 12 | automatic roadmap creation | Not implemented | No registry, no idea records | Owner-authorized Hermes design | Registry-consumer batch |
| 13 | production readiness claim | Not claimed | No runtime implementation | Owner-authorized Hermes design | Readiness-evidence batch |
| 14 | adoption readiness claim | Not claimed | No runtime implementation | Owner-authorized Hermes design | Readiness-evidence batch |
| 15 | template parser | Not implemented | Template conversion remains closed | Owner-authorized Hermes design | Parser-design batch |
| 16 | template converter | Not implemented | Template conversion remains closed | Owner-authorized Hermes design | Converter-design batch |
| 17 | Markdown template validation | Not implemented | No parser to validate against | Owner-authorized Hermes design | Validator-design batch |
| 18 | template-to-JSON automation | Not implemented | No converter, no schema | Owner-authorized Hermes design | Automation batch |
| 19 | Product Delivery Registry production writer | Not implemented | No runtime registry consumption | Owner-authorized Hermes design | Writer-implementation batch |
| 20 | Product Delivery Registry runtime consumption | Not implemented | No production writer, no runtime | Owner-authorized Hermes design | Runtime-implementation batch |

Deferred work must not be described as active backlog. Deferred work must not become eligible without Owner-authorized Hermes design.

---

## 7. Blocked Work Register

This is the blocked work register. Blocked work differs from deferred work in that it has a specific missing prerequisite, missing authority, or missing evidence that prevents even design-level progress.

### 7.1 Idea generator / idea schema / idea validator / idea fixtures

- **Why blocked:** No Owner-authorized Hermes design exists. No schema foundation exists. No validator can be designed before a schema. No fixtures can be created before a schema.
- **Required authority to unlock:** Owner-authorized Hermes design for idea generation scope.
- **Evidence missing:** Hermes design verdict, schema contract, validation strategy.
- **Phase type required:** Pre-implementation design batch.

### 7.2 Generated idea records / generated PNPD state

- **Why blocked:** No generator exists. No `.pnpd` state structure for ideas has been authorized. Generated state implies registry writes, which are not authorized.
- **Required authority to unlock:** Owner-authorized Hermes design plus registry-writer authorization.
- **Evidence missing:** Generator implementation, state schema, registry-writer contract.
- **Phase type required:** Runtime-implementation batch following registry-writer authorization.

### 7.3 AgentBridge routing authority

- **Why blocked:** No idea records exist to route. AgentBridge authority changes require explicit Owner authorization.
- **Required authority to unlock:** Owner-authorized AgentBridge design.
- **Evidence missing:** AgentBridge routing contract, authority change justification.
- **Phase type required:** AgentBridge-authority batch.

### 7.4 Registry writes

- **Why blocked:** No Product Delivery Registry production writer exists. Registry writes from unvalidated sources would corrupt the registry.
- **Required authority to unlock:** Owner-authorized Hermes design for registry-writer.
- **Evidence missing:** Writer implementation, append-mode validation, hash-integrity verification.
- **Phase type required:** Registry-writer batch.

### 7.5 Runtime behavior for template conversion

- **Why blocked:** Template conversion remains closed per Phase 1N-F boundary. No parser exists. No converter exists.
- **Required authority to unlock:** Owner-authorized reopening of template conversion.
- **Evidence missing:** Parser design, converter design, conversion boundary revision.
- **Phase type required:** Template-conversion design batch.

### 7.6 CI enforcement for templates or ideas

- **Why blocked:** Nothing exists to enforce. CI enforcement without a validated runtime target is configuration drift.
- **Required authority to unlock:** Owner-authorized runtime target plus CI design.
- **Evidence missing:** Validated runtime target, CI enforcement contract.
- **Phase type required:** CI-enforcement batch following runtime implementation.

### 7.7 Automatic backlog / roadmap creation

- **Why blocked:** No registry consumer exists. No generated idea records exist. Automatic creation implies roadmap authority, which is not granted.
- **Required authority to unlock:** Owner-authorized registry-consumer design.
- **Evidence missing:** Consumer implementation, roadmap-authority grant.
- **Phase type required:** Registry-consumer batch.

### 7.8 Production / adoption readiness claims

- **Why blocked:** No runtime implementation exists. Readiness claims without runtime evidence are overclaims.
- **Required authority to unlock:** Full runtime implementation plus Owner-authorized readiness review.
- **Evidence missing:** Runtime telemetry, production deployment, adoption data.
- **Phase type required:** Readiness-evidence batch.

### 7.9 Template parser / template converter / Markdown validation / template-to-JSON automation

- **Why blocked:** Template conversion remains closed per Phase 1N-F. No parser strategy has been authorized.
- **Required authority to unlock:** Owner-authorized reopening of template conversion.
- **Evidence missing:** Parser design, converter design, validation strategy, automation contract.
- **Phase type required:** Template-conversion design batch.

### 7.10 Product Delivery Registry production writer / runtime consumption

- **Why blocked:** Writer design exists in docs but production implementation is not authorized. Runtime consumption depends on production writer.
- **Required authority to unlock:** Owner-authorized Hermes design for registry runtime.
- **Evidence missing:** Production writer implementation, runtime consumer implementation.
- **Phase type required:** Registry-runtime batch.

---

## 8. Eligible Next Work Register

This is the eligible next work register. Eligible next work is limited to work that:

- is docs-only work
- is validator-only work only if a real defect is discovered
- is batchable work
- addresses one coherent risk class
- involves no runtime
- involves no registry writes
- involves no generated state
- involves no AgentBridge authority
- involves no readiness claims

### Recommended eligible categories

| # | Category | Constraint |
|---|----------|------------|
| 1 | docs-only governance clarification inside an existing topic area | Must not reopen closed decisions |
| 2 | docs-only deferred scope reconciliation follow-up | Only if baseline changes |
| 3 | validator-only defect fix | Only if a real defect is discovered and confirmed |
| 4 | docs-only template boundary clarification | Only if it does not reopen conversion |
| 5 | docs-only AgentBridge boundary design | Only if explicitly authorized by Owner |

### Rules

- no implementation batch is eligible merely because it is interesting
- no deferred work becomes eligible without Owner-authorized Hermes design
- blocked work must not be described as active backlog
- eligible work must pass batch-mode rule before implementation

---

## 9. Batch Mode Enforcement

Future increments must satisfy batch-mode discipline. Each batch must:

- share one coherent risk class
- define one allowed file list
- define one forbidden implementation surface
- define one audit strategy
- require one final CI verification
- avoid hiding implementation inside docs
- avoid generated state
- avoid roadmap authority
- avoid automatic backlog creation
- avoid mixing docs-only work with runtime/schema/validator/CI unless explicitly designed

Microphase chains are allowed only when risk classes genuinely differ. Related docs-only governance controls should be batched together. Batch mode must accelerate delivery without weakening governance.

---

## 10. Drift Risk Register

This register captures known drift risks and their mitigations.

| # | Risk | Mitigation |
|---|------|------------|
| 1 | local dirt becoming permanent noise | Pre-batch hygiene check; remove known dirt immediately |
| 2 | deferred work mistaken for active backlog | Deferred work register kept current; no active backlog state created |
| 3 | blocked work mistaken for eligible next work | Blocked work register explicitly gates on missing authority/evidence |
| 4 | eligible next work expanding into runtime | Batch-mode enforcement forbids runtime in docs-only batches |
| 5 | eligible next work expanding into registry writes | Batch-mode enforcement forbids registry writes in docs-only batches |
| 6 | eligible next work expanding into CI enforcement | Batch-mode enforcement forbids CI changes in docs-only batches |
| 7 | eligible next work expanding into AgentBridge authority | Batch-mode enforcement forbids AgentBridge authority changes in docs-only batches |
| 8 | batch mode weakening governance by bundling unrelated surfaces | Each batch shares one coherent risk class |
| 9 | generated state creeping into future phases | No generated state rule enforced at every batch gate |
| 10 | schema creep | Schema changes require Owner-authorized Hermes design |
| 11 | validator creep | Validator additions require real defect evidence |
| 12 | CI creep | CI changes require runtime target |
| 13 | runtime creep | Runtime implementation requires Owner-authorized Hermes design |
| 14 | AgentBridge authority creep | AgentBridge authority changes require explicit Owner authorization |
| 15 | Phase 1Q reopening | Phase 1Q remains stopped unless Owner explicitly reopens |
| 16 | template conversion reopening | Template conversion remains closed per Phase 1N-F |
| 17 | idea generator feature creep | Idea generator requires Owner-authorized Hermes design |
| 18 | production readiness overclaim | No readiness claim without runtime evidence |
| 19 | adoption readiness overclaim | No readiness claim without adoption data |
| 20 | roadmap authority creep | Roadmap authority is not granted to any batch |

---

## 11. Stop Conditions

Stop future batch planning if any of the following conditions are triggered:

| # | Trigger | Reason | Next safe action |
|---|---------|--------|-----------------|
| 1 | baseline moves without review | Canonical state may have changed | Reconcile baseline before proceeding |
| 2 | scope expands beyond docs-only or validator-only work without Hermes design | Drift into runtime/schema/CI | Halt; request Hermes design |
| 3 | evidence of defect is invented rather than observed | Validator work must be defect-driven | Halt; require real defect evidence |
| 4 | active backlog state is implied | Backlog implies authority not granted | Halt; clarify that no active backlog exists |
| 5 | roadmap authority is implied | Roadmap authority is not granted | Halt; remove roadmap language |
| 6 | generated records are proposed | No generated state rule violated | Halt; remove generated-record proposal |
| 7 | `.pnpd` state is proposed | No `.pnpd` state generation authorized | Halt; remove `.pnpd` state proposal |
| 8 | schema work appears | Schema requires Hermes design | Halt; require schema-design authorization |
| 9 | validator work appears without real defect evidence | Validators must be defect-driven | Halt; require defect evidence |
| 10 | runtime work appears | Runtime requires Hermes design | Halt; require runtime-design authorization |
| 11 | CI work appears | CI requires runtime target | Halt; require CI-design authorization |
| 12 | registry work appears | Registry requires Hermes design | Halt; require registry authorization |
| 13 | AgentBridge authority work appears | Requires Owner authorization | Halt; require AgentBridge authorization |
| 14 | readiness is claimed | No readiness evidence exists | Halt; remove readiness claim |
| 15 | Phase 1Q is reopened without Owner authorization | Phase 1Q is stopped | Halt; require Owner authorization |
| 16 | template conversion is reopened without Owner authorization | Conversion is closed per Phase 1N-F | Halt; require Owner authorization |
| 17 | local dirt reappears and is ignored | Hygiene policy violated | Remove dirt before proceeding |

---

## 12. Forbidden Implementation In This Phase

### 12.1 Forbidden file edits

Edits to the following files and directories are forbidden in this phase:

- `.pnpd`
- `scripts`
- `templates`
- `tests/fixtures`
- `package.json`
- `package-lock.json`
- `.github/workflows`
- `README.md`
- `docs/pnpd/current-capability-map.md`
- prior 1N-C docs
- prior 1N-D docs
- prior 1N-E docs
- prior 1N-F docs
- prior 1R-A docs
- prior 1R-B docs
- prior 1R Batch 1 docs

### 12.2 Forbidden implementation categories

- schema changes
- validator additions
- fixtures
- runtime code
- CI enforcement
- registry writes
- generated state
- AgentBridge authority changes
- idea generator
- template parser
- template converter
- Markdown template validation
- deployment
- dispatch
- certification
- production readiness claims
- adoption readiness claims
- roadmap commitment claims

### 12.3 Core invariant phrases

> no generated state
>
> no registry write
>
> no AgentBridge authority

---

## 13. Gates And Non-Goals

### Gates

- exact one-file docs-only scope
- no `.pnpd` edits
- no `scripts` edits
- no `templates` edits
- no `tests/fixtures` edits
- no `package.json` edits
- no `package-lock.json` edits
- no `.github/workflows` edits
- no `README.md` edits
- no prior-doc edits
- Owner-gated for any future implementation
- Codex-gated for audit-and-finalize

### Non-goals

- no schema implementation
- no validator implementation
- no runtime implementation
- no registry write
- no generated state
- no AgentBridge authority
- no idea generator implementation
- no template parser
- no template converter
- no readiness claim
- no roadmap commitment claim
