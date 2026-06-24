# Phase 1P-I — Memory Record Authoring Rules and Promotion Flow Design

## 1. Purpose

This phase designs the governance model for memory record authoring, review, promotion, supersession, archiving, and rejection inside the PNPD-OS Git-backed Obsidian-compatible memory scaffold.

It defines the full lifecycle of a memory record: how records are drafted, reviewed, promoted to canonical status, superseded by newer records, archived for history, or rejected from the canonical surface.

This document is design-only. It does not create any memory records, modify any scaffold files, or implement any automation.

## 2. Current canonical baseline

```text
Verdict:
PHASE_1P_H_BATCH_0_POST_SCAFFOLD_CANONICAL_STATE_RECONCILIATION_PUSHED_CI_GREEN

Branch:
main

Canonical commit:
b863b0ade7849f3dd4e4d0f1b946ed8d59779d97

Remote CI run:
28132266565

Remote CI conclusion:
success

Known untracked files:
none
```

## 3. Risk class and scope

```text
Docs-only governance design. No runtime, no automation, no .obsidian, no schema, no validator, no fixture, no CI, no package, no registry write, no dashboard, no daemon, no AgentBridge authority, no deployment, no dispatch, no installer.
```

No automation is authorized. No .obsidian directory is created. No registry writes are authorized. No production readiness claim. No adoption readiness claim.

## 4. Design summary

This document encodes the Hermes design for PNPD-OS memory record governance across the following dimensions:

- **Lifecycle states**: eight defined states from `draft` through `rejected`, each with clear entry, exit, and authority gates.
- **Folder-by-folder authoring rules**: every `memory/` subfolder receives explicit rules for allowed record types, forbidden content, allowed lifecycle states, privacy classification, Git-tracking expectation, promotion requirements, and authority boundaries.
- **Record type taxonomy**: records are classified into pointer records, canonical governance records, advisory/pattern records, draft/non-canonical records, archive/history records, and project records.
- **Promotion flow**: a linear, gated pipeline from raw note through Owner authorization, Hermes design, DeepSeek implementation, Codex audit, GitHub push, CI success, and canonical reconciliation.
- **Promotion authority matrix**: a fixed actor-authority table establishing that Owner remains final authority, Hermes is design only, DeepSeek is implementation only, Codex is audit/finalize only, GitHub App is remote verification only, AgentBridge has no authority unless separately authorized, and Obsidian is editor/navigation only.
- **Frontmatter governance**: mandatory fields including `privacy` and `git_tracking` on every record; canonical records require populated `canonical_commit` and `ci_run`.
- **Privacy and redaction rules**: private personal notes must not be committed; a redaction checklist is provided.
- **Drift prevention**: rules preventing duplication of canonical docs, fake metrics, and unauthorized current-state claims.
- **Naming conventions**: stable, lowercase, hyphenated slug patterns for each record type.
- **Archive and supersession rules**: replacement references, link preservation, and rejection handling.
- **Inbox / research / project / Teach Skills / agent handoff rules**: domain-specific governance for each memory zone.
- **Capability-map relationship**: `docs/pnpd/current-capability-map.md` remains the canonical capability authority; memory pointer records support navigation but do not supersede the map.

## 5. Non-goals

This phase explicitly does not:

- create memory records
- modify memory scaffold files
- update `docs/pnpd/current-capability-map.md`
- create `.obsidian`
- create automation
- create schemas, validators, or fixtures
- create CI or package changes
- create registry writes
- create AgentBridge authority
- create dashboard
- create runtime behavior
- create project profiles
- create Teach Skills
- create handoff records
- create governance records
- create research, inbox, or archive notes
- claim production readiness
- claim adoption readiness

No production readiness claim. No adoption readiness claim.

## 6. Source-of-truth rule

Git is the canonical version-control. Obsidian is the human-facing editor and navigation interface only. Committed Markdown files are the source of truth.

docs/pnpd/current-capability-map.md remains the canonical capability authority.

No memory record becomes canonical merely because it exists in memory/.

Additional source-of-truth rules:

- Pointer records support navigation but do not supersede the capability map.
- Local-only notes are not canonical. Only committed, CI-verified, map-reconciled records achieve canonical status.
- Obsidian cannot make records canonical. Obsidian is an editor and navigator; canonical status is granted only through the promotion flow defined in this document.
- If a pointer record conflicts with the canonical map, the canonical map wins until formally reconciled.

## 7. Record lifecycle states

Every memory record exists in exactly one of the following lifecycle states at any given time:

| State | Definition |
|-------|------------|
| **`draft`** | Allowed only in `90-inbox/` or project-governed scratch areas. Not canonical. Should be gitignored or cleared before commit. |
| **`candidate`** | Non-private, clearly non-authoritative note prepared for review. May be committed only if non-private and marked non-authoritative. |
| **`review-ready`** | Prepared for Codex audit but not canonical. Frontmatter must signal non-canonical status. |
| **`approved`** | Owner-authorized in scope and content, but not canonical until committed, audited, pushed, CI-green, and reconciled. |
| **`active`** | Canonical after Owner authorization, Codex audit, GitHub verification, CI success, and capability-map or pointer reconciliation. |
| **`superseded`** | Replaced by a newer canonical record. Must name the replacement record or commit. |
| **`archived`** | Retained historical record. Not active. Not authority for current work. |
| **`rejected`** | Failed audit or Owner rejected. Must not be cited as authority. |

Lifecycle transition rules:

- `draft` → `candidate`: requires content review, privacy check, and non-private classification.
- `candidate` → `review-ready`: requires Owner scope acknowledgment.
- `review-ready` → `approved`: requires Codex audit pass and Owner authorization.
- `approved` → `active`: requires commit, push, remote CI success, and capability-map or pointer reconciliation.
- `active` → `superseded`: requires newer canonical record with replacement reference.
- `active` → `archived`: requires Owner direction and replacement reference if applicable.
- Any state → `rejected`: requires Owner or Codex rejection decision.

## 8. Folder-by-folder authoring rules

### `memory/00-canonical/`

- **Allowed record types**: baseline-pointer, ci-evidence-pointer, verdict-pointer
- **Forbidden**: draft notes, inbox content, research notes, project profiles, Teach Skills, agent handoff records, private content
- **Allowed lifecycle states**: `active`, `superseded`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: full promotion flow through Owner, Codex, CI, and reconciliation
- **Authority boundary**: only records with verified canonical_commit and ci_run may reside here

### `memory/00-canonical/baselines/`

- **Allowed record types**: baseline-pointer
- **Forbidden**: draft notes, private content, research content, implementation notes
- **Allowed lifecycle states**: `active`, `superseded`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference a canonical commit and CI run on main
- **Authority boundary**: pointer records only; canonical baselines live in Git commits and CI evidence

### `memory/00-canonical/ci-evidence/`

- **Allowed record types**: ci-evidence-pointer
- **Forbidden**: draft notes, private content, fabricated CI claims
- **Allowed lifecycle states**: `active`, `superseded`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference an actual remote CI run ID
- **Authority boundary**: no self-reported CI evidence; must be independently verifiable

### `memory/00-canonical/verdicts/`

- **Allowed record types**: verdict-pointer
- **Forbidden**: draft notes, private content, self-granted verdicts
- **Allowed lifecycle states**: `active`, `superseded`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference an Owner-authorized verdict with matching canonical commit
- **Authority boundary**: no agent may self-grant a verdict

### `memory/01-agents/`

- **Allowed record types**: agent-handoff records, pointer records referencing agent-specific outputs
- **Forbidden**: draft notes, private content, self-granted authority claims
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: handoff records must be promoted through Codex audit before becoming canonical
- **Authority boundary**: agent subfolders are per-agent; no agent may write to another agent's folder without authorization

### `memory/01-agents/hermes/`

- **Allowed record types**: agent-handoff (Hermes design outputs)
- **Forbidden**: implementation claims, runtime code, private content
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: Hermes design outputs must be acknowledged by Owner before implementation
- **Authority boundary**: Hermes is design only

### `memory/01-agents/deepseek/`

- **Allowed record types**: agent-handoff (DeepSeek implementation outputs)
- **Forbidden**: design authority claims, self-approved implementations, private content
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: DeepSeek outputs must pass Codex audit before becoming canonical
- **Authority boundary**: DeepSeek is implementation only; cannot approve its own work

### `memory/01-agents/codex/`

- **Allowed record types**: agent-handoff (Codex audit reports)
- **Forbidden**: implementation claims, Owner-level decisions, private content
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: Codex audit reports must be verified remotely (GitHub CI) before adoption
- **Authority boundary**: Codex is audit/finalize only; cannot override Owner

### `memory/01-agents/owner-decisions/`

- **Allowed record types**: owner-decision
- **Forbidden**: agent-authored authority claims, private content not authorized by Owner
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: Owner decisions are authoritative by nature; must still be committed and CI-verified
- **Authority boundary**: only Owner may create records here; agents may not simulate Owner decisions

### `memory/02-projects/`

- **Allowed record types**: project-note, project-adoption-note, project-profile-pointer
- **Forbidden**: private personal notes, unadopted project claims, Teach Skills, canonical governance records
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `project-governed`
- **Git-tracking**: `committed` or `gitignored` per project policy
- **Promotion requirement**: project folders require formal adoption/profile authorization before becoming canonical
- **Authority boundary**: no project folder becomes canonical by existing; project memory is scoped to its project

### `memory/03-skills/`

- **Allowed record types**: prompt-pattern, audit-pattern, implementation-pattern, teach-skill-pointer
- **Forbidden**: runtime code, executable scripts, private content, unimplemented skill claims
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: skill records must pass Owner authorization, Codex audit, and CI verification
- **Authority boundary**: Teach Skill pointers are not Teach Skill Studio; skill records are governance/design only unless separately implemented

### `memory/03-skills/teach-skills/`

- **Allowed record types**: teach-skill-pointer, teach-skill-draft (governance/design only)
- **Forbidden**: implemented skill claims, runtime code, Teach Skill Studio claims, private content
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: full promotion flow required; Teach Skill drafts are not implemented skills
- **Authority boundary**: no skill becomes active until Owner authorization, implementation, Codex audit, GitHub verification, and canonical baseline update

### `memory/03-skills/prompt-patterns/`

- **Allowed record types**: prompt-pattern
- **Forbidden**: private content, implementation code, self-granted authority
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must be reviewed for correctness; not authoritative unless promoted
- **Authority boundary**: advisory only unless promoted through governance

### `memory/03-skills/audit-patterns/`

- **Allowed record types**: audit-pattern
- **Forbidden**: private content, implementation code, self-granted authority
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must be reviewed for correctness; not authoritative unless promoted
- **Authority boundary**: advisory only unless promoted through governance

### `memory/03-skills/implementation-patterns/`

- **Allowed record types**: implementation-pattern
- **Forbidden**: private content, self-granted authority
- **Allowed lifecycle states**: `candidate`, `approved`, `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must be reviewed for correctness; not authoritative unless promoted
- **Authority boundary**: advisory only unless promoted through governance

### `memory/04-governance/`

- **Allowed record types**: governance-decision, blocked-scope-note, deferred-scope-note, controlled-unlock-note, approval records
- **Forbidden**: draft notes, private content, self-granted governance authority
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: governance records must reference Owner action or decision ID
- **Authority boundary**: governance records are authoritative only when Owner-authorized

### `memory/04-governance/blocked/`

- **Allowed record types**: blocked-scope-note
- **Forbidden**: private content, unblocked scope claims
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference blocked scope and blocking condition
- **Authority boundary**: documents blocked scope; does not unblock scope

### `memory/04-governance/deferred/`

- **Allowed record types**: deferred-scope-note
- **Forbidden**: private content, active scope claims
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference deferred scope and deferral rationale
- **Authority boundary**: documents deferred scope; does not activate scope

### `memory/04-governance/approvals/`

- **Allowed record types**: governance-decision (approval records)
- **Forbidden**: private content, fabricated approvals
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference Owner decision or authorization ID
- **Authority boundary**: approvals are authoritative when Owner-granted

### `memory/04-governance/controlled-unlock/`

- **Allowed record types**: controlled-unlock-note
- **Forbidden**: private content, unauthorized unlock claims
- **Allowed lifecycle states**: `active`, `superseded`, `archived`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: must reference the capability being unlocked and the authorization
- **Authority boundary**: documents controlled unlocks; does not grant new authority independently

### `memory/05-research/`

- **Allowed record types**: research-note
- **Forbidden**: canonical claims, production readiness claims, adoption readiness claims, private personal data unless separately authorized
- **Allowed lifecycle states**: `draft`, `candidate`, `review-ready`, `approved`, `archived`
- **Privacy**: `research`
- **Git-tracking**: `committed` (non-private content) or `gitignored` (scratch)
- **Promotion requirement**: research notes are non-canonical unless promoted through governance
- **Authority boundary**: research cannot authorize implementation, claim production readiness, or override project profile or capability map

### `memory/05-research/market/`

- **Allowed record types**: research-note (market)
- **Forbidden**: canonical claims, private user data, implementation authority
- **Allowed lifecycle states**: `draft`, `candidate`, `review-ready`, `approved`, `archived`
- **Privacy**: `research`
- **Git-tracking**: `committed` or `gitignored`
- **Promotion requirement**: same as parent research rules
- **Authority boundary**: market research is non-canonical unless promoted

### `memory/05-research/technical/`

- **Allowed record types**: research-note (technical)
- **Forbidden**: canonical claims, private data, implementation authority
- **Allowed lifecycle states**: `draft`, `candidate`, `review-ready`, `approved`, `archived`
- **Privacy**: `research`
- **Git-tracking**: `committed` or `gitignored`
- **Promotion requirement**: same as parent research rules
- **Authority boundary**: technical research is non-canonical unless promoted

### `memory/05-research/product/`

- **Allowed record types**: research-note (product)
- **Forbidden**: canonical claims, private user data, implementation authority
- **Allowed lifecycle states**: `draft`, `candidate`, `review-ready`, `approved`, `archived`
- **Privacy**: `research`
- **Git-tracking**: `committed` or `gitignored`
- **Promotion requirement**: same as parent research rules
- **Authority boundary**: product research is non-canonical unless promoted

### `memory/90-inbox/`

- **Allowed record types**: inbox-note
- **Forbidden**: private personal notes in committed Git, canonical claims, implementation authority, agent context claims
- **Allowed lifecycle states**: `draft`
- **Privacy**: `scratch`
- **Git-tracking**: `gitignored` (expected); committed only after promotion through review
- **Promotion requirement**: inbox notes must be cleared, gitignored, or promoted through review before becoming anything other than draft
- **Authority boundary**: inbox content must not be treated as canonical context by agents

### `memory/99-archive/`

- **Allowed record types**: archive-note, superseded records
- **Forbidden**: active records, draft notes, private content not previously authorized
- **Allowed lifecycle states**: `superseded`, `archived`
- **Privacy**: `archive`
- **Git-tracking**: `committed`
- **Promotion requirement**: records move here only after supersession or Owner-directed archival
- **Authority boundary**: archived records are historical; not authority for current work

### `memory/templates/`

- **Allowed record types**: template files (authorship aids)
- **Forbidden**: canonical records, active memory records, private content, executable scripts
- **Allowed lifecycle states**: `active` (as templates), `superseded`
- **Privacy**: `repo-governed`
- **Git-tracking**: `committed`
- **Promotion requirement**: templates are authorship aids; they carry no canonical authority on their own
- **Authority boundary**: templates guide authorship; they do not enforce or validate

## 9. Record type taxonomy

### Pointer records

Records that point to canonical artifacts elsewhere (in Git commits, CI runs, or the capability map):

- **`baseline-pointer`**: points to a canonical baseline commit and CI run
- **`ci-evidence-pointer`**: points to a specific remote CI run
- **`verdict-pointer`**: points to an Owner-authorized verdict
- **`project-profile-pointer`**: points to an approved project profile artifact
- **`teach-skill-pointer`**: points to a Teach Skill governance record

Pointer records support navigation but do not supersede the canonical artifacts they reference.

### Canonical governance records

Records that carry governance authority when Owner-authorized and fully promoted:

- **`agent-handoff`**: agent-to-agent or agent-to-Owner handoff report
- **`owner-decision`**: explicit Owner authorization or decision
- **`governance-decision`**: governance ruling or policy decision
- **`blocked-scope-note`**: documentation of blocked capability scope
- **`deferred-scope-note`**: documentation of deferred capability scope
- **`controlled-unlock-note`**: documentation of a controlled capability unlock

### Advisory / pattern records

Records that provide guidance but carry no independent authority:

- **`prompt-pattern`**: reusable prompt structure or technique
- **`audit-pattern`**: reusable audit checklist or methodology
- **`implementation-pattern`**: reusable implementation approach

### Draft / non-canonical records

Records that are explicitly non-authoritative:

- **`inbox-note`**: scratch note in `90-inbox/`; transient and non-canonical
- **`research-note`**: research finding in `05-research/`; non-canonical unless promoted
- **`teach-skill-draft`**: draft Teach Skill design; not an implemented skill

### Archive / history records

- **`archive-note`**: historical record preserved for provenance
- **Superseded record** (any type with status `superseded`): replaced by a newer canonical record

### Project records

- **`project-note`**: project-scoped memory note
- **`project-adoption-note`**: formal project adoption record

Teach Skill records (`teach-skill-pointer`, `teach-skill-draft`) are governance/design records only unless separately implemented through a future Teach Skill Studio phase.

## 10. Promotion flow

The canonical promotion flow is a linear, gated pipeline:

```text
Raw note → candidate note → Owner-approved scope → Hermes design (if needed) → DeepSeek implementation (if file changes are needed) → Codex audit → GitHub push → remote CI success → capability-map or canonical pointer reconciliation → active canonical record
```

Promotion rules:

- No record becomes canonical merely because it exists in `memory/`.
- `docs/pnpd/current-capability-map.md` remains the canonical capability authority unless later Owner-authorized reconciliation changes it.
- Memory pointer records support navigation but do not supersede the map.
- No promotion step may be skipped or self-granted.
- Each gate must be independently verified before proceeding to the next step.

Gate details:

1. **Raw note → candidate note**: content must be non-private, clearly structured, and marked as non-authoritative. Privacy check required.
2. **Candidate note → Owner-approved scope**: Owner must acknowledge the scope and authorize further work. No agent may self-approve scope.
3. **Owner-approved scope → Hermes design (if needed)**: if the work requires design, Hermes produces the design. Hermes is design only.
4. **Hermes design → DeepSeek implementation (if file changes needed)**: if the work requires file changes, DeepSeek implements them. DeepSeek is implementation only.
5. **DeepSeek implementation → Codex audit**: Codex audits the implementation against the design and rules. Codex is audit/finalize only.
6. **Codex audit → GitHub push**: only after Codex audit passes may the work be pushed.
7. **GitHub push → remote CI success**: remote CI must pass. Green CI is necessary but not alone sufficient.
8. **CI success → capability-map or canonical pointer reconciliation**: the capability map or canonical pointers must be updated to reflect the new canonical state.
9. **Reconciliation → active canonical record**: the record is now active and canonical.

## 11. Promotion authority matrix

| Actor       | Authority                                 |
| ----------- | ----------------------------------------- |
| Owner       | final authorization and final decision    |
| Hermes      | design only                               |
| DeepSeek    | implementation only                       |
| Codex       | audit/finalize only                       |
| GitHub App  | remote verification only                  |
| AgentBridge | no authority unless separately authorized |
| Obsidian    | editor/navigation only                    |

Owner remains final authority. Hermes is design only. DeepSeek is implementation only. Codex is audit/finalize only. GitHub App is remote verification only. AgentBridge has no authority unless separately authorized.

Additional authority rules:

- Agents cannot self-promote records. No agent may move its own output through the pipeline without independent verification.
- DeepSeek cannot approve its own implementation. All DeepSeek outputs must pass Codex audit.
- Codex cannot override Owner. Codex audits and reports; final decision authority rests with Owner.
- GitHub green CI is necessary but not alone sufficient for Owner authority. CI success is a gate, not a substitute for Owner authorization.
- Obsidian cannot make records canonical. Obsidian is an editor and navigator, not an authority layer.
- Local-only notes are not canonical. Only committed, pushed, CI-verified, and reconciled records achieve canonical status.

## 12. Frontmatter governance

### Baseline frontmatter fields

Every memory record should include frontmatter appropriate to its type. The following fields form the baseline vocabulary:

```yaml
type:          # record type from the taxonomy (required)
project:       # project slug if project-scoped
phase:         # PNPD phase identifier
verdict:       # canonical verdict string if applicable
status:        # lifecycle state (required)
source:        # originating agent or process
owner_authority:  # Owner authorization reference
canonical_commit: # full SHA of the canonical commit
ci_run:        # remote CI run ID
agent:         # agent that authored the record
created:       # ISO date of creation
updated:       # ISO date of last update
tags:          # array or list of tags
privacy:       # privacy classification (mandatory)
git_tracking:  # Git tracking expectation (mandatory)
```

### Mandatory fields

- `privacy` and `git_tracking` are mandatory on every memory record.
- Canonical records require populated `canonical_commit` and `ci_run`.
- Pointer records require populated target metadata (the commit, CI run, or artifact they point to).
- Draft/candidate records must not fake canonical commit or CI. Falsifying these fields is a governance violation.
- Research records use research-only verdict/status until promoted through governance.
- Governance records must reference Owner action or decision ID in `owner_authority`.
- Archive/superseded records must name replacement record or commit if known.

### Preferred `privacy` values

```text
repo-governed
project-governed
research
scratch
private
archive
```

### Preferred `git_tracking` values

```text
committed
gitignored
forbidden
```

### Privacy-tracking constraint

```text
privacy: private requires git_tracking: forbidden
```

A record classified as `privacy: private` must never be committed to Git. Its `git_tracking` must be `forbidden`. Any committed record with `privacy: private` is a governance violation.

## 13. Privacy and redaction rules

### Core privacy rules

- **Private personal notes must not be committed.** This is a hard rule with no exceptions unless explicitly authorized by Owner for a specific, documented purpose.
- Personal data must not be committed unless explicitly required, minimized, and Owner-authorized.
- Immigration, employment, health, family, finance, addresses, phone numbers, emails, and private life details must not enter repo memory unless explicitly authorized and necessary.
- Research notes must not include private user facts unless separately authorized.
- Project notes must separate business/project knowledge from personal/private context.
- Scratch/inbox notes must be cleared, gitignored, or promoted through review before commit.
- No secrets, API keys, credentials, tokens, or private account data may ever be committed.

### Redaction checklist

Before any memory record enters candidate or later status, the following checklist must be satisfied:

1. **Personal identifiers?** — Names, addresses, phone numbers, emails, government IDs, or other personally identifying information of natural persons not explicitly authorized.
2. **Private user facts?** — Immigration, employment, health, family, financial, or private life details.
3. **Project business content mixed with private content?** — Business facts interleaved with personal context that should be separated.
4. **Credentials/secrets?** — API keys, tokens, passwords, private keys, or account credentials.
5. **Private inbox content?** — Scratch notes, personal reflections, or transient content not suitable for committed memory.

If any item in the checklist is positive, the record must be redacted, split, or reclassified before promotion beyond `draft`.

## 14. Drift-prevention rules

To prevent canonical drift, duplication, and false authority:

- **No record may duplicate full canonical docs.** Memory records should reference canonical docs by path or pointer; they must not contain full copies that can drift independently.
- **Pointer records should point to canonical docs instead of copying them.** The canonical doc is the source of truth; the pointer is a navigation aid.
- **If a pointer conflicts with the canonical map, the canonical map wins until reconciled.** Pointer records are secondary; the capability map is the authoritative surface.
- **Superseded records must name replacement record or commit if known.** Any record marked `superseded` must include a reference to what replaced it.
- **Archived records must preserve provenance.** Origin, authorship, and promotion history must remain traceable.
- **Rejected records must not be cited as authority.** A `rejected` record carries no weight; citing it as if canonical is a governance violation.
- **Avoid fake metrics, fake CI, fake commits, fake approvals.** All claims of commit SHAs, CI runs, and Owner approvals must be independently verifiable.
- **No current-state claim without commit and CI evidence.** Any record claiming to describe the current state of the repo must include a verifiable canonical commit and CI run.

## 15. Naming conventions

Memory record filenames follow stable, lowercase, hyphenated slug patterns:

```text
baseline-<phase-slug>.md
ci-<phase-slug>.md
verdict-<phase-slug>.md
handoff-<target-agent>-<date-slug>.md
decision-<slug>.md
project-<project-slug>.md
project-adoption-<project-slug>.md
project-profile-<project-slug>.md
skill-<skill-id>-<slug>.md
prompt-<pattern-slug>.md
audit-<pattern-slug>.md
implementation-<pattern-slug>.md
blocked-<scope-slug>.md
deferred-<scope-slug>.md
controlled-unlock-<capability-slug>.md
research-<topic-slug>.md
archive-<original-slug>.md
```

### Slug rules

- **Lowercase**: all slugs use lowercase letters.
- **Hyphenated**: words separated by hyphens, not underscores or camelCase.
- **Stable**: once set, a slug should not change unless the record is superseded and the new record gets a new slug.
- **Reversible**: the slug should allow a reader to identify the record type and subject without opening the file.
- **No dates unless date is materially part of identity**: dates in filenames are reserved for records where the date is a meaningful part of the record identity (e.g., handoff records). Do not date-stamp records merely for chronology.
- **No personal/private identifiers unless explicitly authorized**: filenames must not encode personal names, email addresses, or private identifiers.

## 16. Archive and supersession rules

### Supersession

- A record becomes `superseded` when a newer canonical record replaces it.
- The superseded record must name its replacement record or commit in its frontmatter or body.
- A superseded record remains in its original folder unless a later archive process moves it to `99-archive/`.
- Do not move canonical files casually. Movement risks breaking links.

### Archival

- A record becomes `archived` when retained for history but no longer active.
- Archival requires Owner direction.
- Archived records must preserve provenance: original authorship, original folder, promotion history, and reason for archival.
- Do not break links when archiving. If a move is necessary, provide a pointer or redirect.

### Rejection

- Rejected records must not be archived as valid history without Owner direction.
- A `rejected` record is not historical precedent; it is a failed candidate.
- Rejected records may be kept in `90-inbox/` or deleted; they must not appear in canonical folders.

### Safe practices

- Update `status` plus pointer to replacement unless a safe archive move process is later designed.
- Do not delete canonical records without Owner authorization and a documented replacement.

## 17. Inbox rules

### `memory/90-inbox/` governance

- `90-inbox` is scratch, non-canonical, transient.
- `90-inbox` must not contain private personal notes in committed Git.
- Inbox notes must not grant implementation authority. No inbox note may authorize an agent to implement anything.
- Inbox notes must be cleared, gitignored, or promoted through review before commit.
- Inbox content must not be treated as canonical context by agents. Agents must not cite inbox notes as authority for decisions or implementations.
- Do not add `memory/90-inbox/.gitignore` in this phase. The existing `memory/.gitignore` remains unchanged.
- Inbox notes that reach `candidate` status should be moved to the appropriate governed folder, not left in `90-inbox/`.

## 18. Research rules

### `memory/05-research/` governance

**Research notes are non-canonical unless promoted through governance.**

Additional research rules:

- Research cannot claim production readiness or adoption readiness.
- Research must cite sources when external claims are involved. Unattributed factual claims weaken auditability.
- Research must separate facts, assumptions, and recommendations. Readers must be able to distinguish what is known, what is assumed, and what is recommended.
- Research cannot override project profile or capability map. The map and project profiles are authoritative; research may inform them but cannot contradict them without formal reconciliation.
- Research cannot authorize implementation. Research findings may motivate a phase, but only the full promotion flow authorizes implementation.

## 19. Project memory rules

### `memory/02-projects/` governance

- Project folders require formal adoption/profile authorization. A project folder is not canonical merely because a directory exists.
- No project folder becomes canonical by existing. Project memory requires an Owner-authorized project profile or adoption note.
- Project profile pointers must reference approved project profile artifacts.
- Project-governed memory may be committed or gitignored per project policy. Each project may define its own Git-tracking preference within the project-governed boundary.
- Private personal notes do not belong in project memory. Project memory is for project business knowledge, not personal context.

### Supported project ventures

The project memory scaffold supports the following known ventures (this phase creates no folders or profiles):

```text
PNPD-OS
JobToCash
Lernova
Pokedex learning app
Briclab Kids
PNPD-OS Skill Studio
future ventures
```

This phase creates no project folders, project profiles, or project adoption notes.

## 20. Teach Skills rules

### `memory/03-skills/teach-skills/` governance

**Teach Skill drafts are not implemented skills.**

Additional Teach Skills rules:

- Teach Skill pointers are not Teach Skill Studio. Pointers reference governance records; Teach Skill Studio is a separate future authorization for an authoring/testing/reuse environment.
- Teach Skill Studio remains separate future authorization. No Teach Skill record may imply that Teach Skill Studio exists or is available.
- No skill becomes active until Owner authorization, implementation, Codex audit, GitHub verification, and canonical baseline update. The full promotion flow applies to skill records.
- Skill records must not imply runtime availability unless separately implemented through a future phase.
- No Teach Skill files are created in this phase.

## 21. Agent handoff rules

### `memory/01-agents/` governance

- No handoff record is authoritative unless promoted through the full promotion flow.
- Agent reports must identify: branch, base commit, new commit(s), files changed, gates passed, and known untracked files.
- Codex final reports must be verified remotely (GitHub CI) before baseline adoption.
- Owner decisions must be explicit. Implicit or inferred Owner authorization is not valid.
- No agent can silently grant itself new authority. Any authority expansion must be explicit, Owner-authorized, and documented in a governance record.

### Handoff record minimum content

Every agent handoff record should answer:

1. What phase and verdict is this work part of?
2. What was the base (branch, commit)?
3. What files were changed, created, or deleted?
4. What gates were run and what were the results?
5. What known untracked files exist?
6. What remains for the next agent or for Owner decision?
7. Is this work ready for audit, or does it need further action?

## 22. Capability-map relationship

`docs/pnpd/current-capability-map.md` remains the canonical capability authority.

Additional relationship rules:

- Memory pointer records support navigation but do not supersede the map.
- If a memory pointer and the capability map disagree, the capability map is authoritative until formally reconciled.
- After major memory work, a later Batch 0 reconciliation may update the map to reflect new canonical pointers or status changes.
- No memory record changes active capability status without map reconciliation. A record may document work but the capability is not "active" until the map reflects it.

## 23. Existing docs relationship

This document is a governance design. It references but does not edit the following existing artifacts:

```text
docs/pnpd/current-capability-map.md
docs/pnpd/phase-1p-g-teach-skills-obsidian-git-knowledge-layer-design.md
docs/pnpd/project-profile-schema-and-adoption-model.md
docs/pnpd/framework-classification.md
docs/pnpd/memory-and-product-delivery-framework.md
docs/pnpd/deferred-scope-reconciliation.md
memory/README.md
memory/00-canonical/baselines/baseline-phase-1p-h-git-backed-obsidian-memory-scaffold.md
```

No existing document is modified, moved, or deleted by this phase.

## 24. Verification and audit expectations

### Local gates (pre-commit)

The following gates must pass before committing this document:

```bash
git status --short
git fetch origin main
git rev-parse origin/main
git diff --name-only
git diff --check
git ls-files --others --exclude-standard
git diff --name-only -- .obsidian .pnpd scripts templates tests package.json package-lock.json .github/workflows README.md memory
find . -path '*/.obsidian*' -print
find memory -type f ! -name '*.md' ! -name '.gitignore'
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
```

### Expected changed file

```text
docs/pnpd/phase-1p-i-memory-record-authoring-rules-and-promotion-flow-design.md
```

### Expected forbidden-file diff

```text
<empty>
```

### Expected `.obsidian` find

```text
<empty>
```

### Expected invalid memory files

```text
<empty>
```

### Audit expectations for Codex

Codex audit should verify:

1. The document matches the Hermes design intent (all required sections, all required phrases).
2. No forbidden content patterns are present as positive claims.
3. No forbidden files were modified or created.
4. All local gates passed cleanly.
5. The commit is on `main`, based on the correct canonical commit.
6. No merge, no push, no tag was performed.

## 25. Expected final success verdict

```text
PHASE_1P_I_MEMORY_RECORD_AUTHORING_RULES_AND_PROMOTION_FLOW_DESIGN_PUSHED_CI_GREEN
```
