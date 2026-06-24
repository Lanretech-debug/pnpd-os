# Phase 1P-G — Teach Skills / Obsidian / Git Knowledge Layer Categorisation Design

## 1. Purpose

This phase designs how PNPD-OS categorises and governs:

- **Obsidian** as the Knowledge and Memory Layer
- **Git** as canonical version-control and audit layer
- **Teach Skills** as the Skill Authoring Layer
- **Teach Skill Studio** as future authoring/testing/reuse environment

This document is design-only and does not implement any component.

## 2. Current canonical baseline

```text
Verdict:
PHASE_1S_BATCH_2_POST_CANONICAL_BASELINE_DOC_CONSISTENCY_RECONCILIATION_PUSHED_CI_GREEN

Branch:
main

Canonical commit:
4663ea9576703661028ea50e17dce853b8887526

Remote CI run:
28123459573

Remote CI conclusion:
success

Known untracked files:
none
```

Owner remains final authority.

## 3. Risk class and scope

`Docs-only design document. No runtime, no automation, no schema, no validator, no fixture, no CI change, no package change, no registry write, no vault creation, no generated state.`

## 4. Design summary

This document encodes the Hermes design for the PNPD-OS knowledge layer categorisation:

- Obsidian is the human-facing Knowledge and Memory Layer.
- Git is the canonical version-control and audit surface.
- Teach Skills is the Skill Authoring Layer.
- Teach Skill Studio is a future authoring/testing environment.
- The design defines folder categorisation, frontmatter, naming, privacy, and config-tracking policy.
- It does not implement any component, schema, validator, vault, or automation.

## 5. Non-goals

This phase explicitly does not:

- create an Obsidian vault
- create `.obsidian`
- create any Teach Skill files
- create schema
- create validator
- create fixtures
- create generated state
- create dashboard behavior
- create daemon/watcher behavior
- create Git/API mutation
- create AgentBridge authority
- claim production readiness
- claim adoption readiness

## 6. Source-of-truth rule

`Git is the canonical version-control, review, rollback, branch, and audit surface. Obsidian is the human-facing editor and navigation interface only. Committed Markdown files in the repository are the source of truth. Future automation must read committed Markdown only.`

## 7. Obsidian role

- Obsidian is an editor/navigation interface.
- Obsidian must not become the authority layer.
- Local workspace/cache/plugin state must not be treated as canonical.
- Obsidian memory is only canonical when represented as committed Markdown under a future authorized structure.

## 8. Git role

- Git provides versioning, auditability, review, rollback, and branch discipline.
- Git history is the durable memory chain.
- Future automation must read committed files only.
- Local-only notes and app state are not canonical.

## 9. Cross-functional memory categories

The following cross-functional memory categories are defined:

- canonical baselines
- CI evidence
- Owner decisions
- Hermes design verdicts
- DeepSeek implementation reports
- Codex audit/finalization reports
- project profiles
- project adoption notes
- Teach Skills
- prompt patterns
- audit patterns
- implementation patterns
- governance decisions
- blocked/deferred scope
- research notes
- reusable product/project knowledge

## 10. Proposed future vault/folder model

This folder model is design-only and non-implemented. No folders are created by this phase.

```text
00-canonical/
01-agents/
02-projects/
03-skills/
04-governance/
05-research/
90-inbox/
99-archive/
```

Folder definitions:

- `00-canonical/` — Phase baselines, CI evidence, canonical commit references, baseline verdicts. This is the authoritative record of what has been verified and committed.
- `01-agents/` — Agent-specific handoffs, verdicts, implementation reports, and audit reports. One entry per agent turn or handoff.
- `02-projects/` — Project profiles, project adoption notes, project-specific knowledge. Organised per project slug.
- `03-skills/` — Teach Skills, prompt patterns, audit patterns, implementation patterns, and reuse catalog entries.
- `04-governance/` — Governance decisions, blocked/deferred scope, Owner decisions, and Controlled Unlock records.
- `05-research/` — Research notes, discovery artifacts, reusable product/project knowledge not yet bound to a phase.
- `90-inbox/` — Scratch/inbox notes not yet categorised or governed. No canonical authority.
- `99-archive/` — Archived notes retained for history but no longer active.

Governance rule: Not every folder needs content immediately. The structure represents target shape only.

## 11. Frontmatter convention

Required future fields for canonical committed Markdown notes:

```yaml
type:
project:
phase:
verdict:
status:
source:
owner_authority:
canonical_commit:
ci_run:
agent:
created:
updated:
tags:
privacy:
git_tracking:
```

Additional fields may be added in future phases, but omission of required canonical fields must require documented justification.

No actual note files are created by this phase.

## 12. Naming convention

Stable filename patterns:

- Phase baselines: `baseline-<phase-slug>.md`
- Agent handoffs: `handoff-<target-agent>-<date-slug>.md`
- Projects: `project-<project-slug>.md`
- Teach Skills: `skill-<skill-id>-<slug>.md`
- Prompt patterns: `prompt-<pattern-slug>.md`
- Governance decisions: `decision-<slug>.md`
- Research notes: `research-<topic-slug>.md`

Slugs must be stable, reversible, lowercase, and hyphenated.

## 13. Privacy and Git-tracking boundary

- **repo-governed canonical notes**: committed, CI-visible, machine-readable. Default `privacy: repo-governed`, `git_tracking: committed`.
- **project-governed working notes**: may be committed or gitignored per project policy. Default `privacy: project-governed`.
- **private personal notes**: never assumed safe for commit; default `git_tracking: forbidden`. No private note commits without explicit Owner authorization.
- **scratch/inbox notes**: transient; default `git_tracking: gitignored`, `privacy: scratch`.
- **archived notes**: repo history; committed by default if they were canonical.

No private note commits without explicit Owner authorization.

## 14. Obsidian config policy

The following are forbidden from canonical Git unless separately authorized:

- `.obsidian/workspace.json`
- `.obsidian/workspace-mobile.json`
- `.obsidian/cache/`
- plugin `data.json`
- plugin `main.js`
- plugin `manifest.json`
- local graph/index files
- device-specific state
- appearance/theme config
- local plugin cache

No `.obsidian` directory is created in this phase.

## 15. Attachment policy

- Binary attachments are discouraged in canonical PNPD memory.
- If necessary in the future, attachments must be isolated under `attachments/<project-slug>/`.
- Attachments require explicit governance.
- No attachment policy is implemented here.
- No binary file is added in this phase.

## 16. Relationship to Project Profile

Mapping of this design to the Project Profile model:

- `memoryAndKnowledge.obsidianPolicy` maps to this design's Obsidian/Git boundary.
- `memoryAndKnowledge.memorySources` maps to canonical categories and folder model.
- `memoryAndKnowledge.canonicalContextSources` maps to `00-canonical/`.
- `memoryAndKnowledge.projectNotesPath` maps to `02-projects/<project-slug>/`.
- `teachSkills` status maps to `03-skills/` and Teach Skill naming convention.

## 17. Relationship to Teach Skills

- Teach Skills are future committed Markdown artifacts under `03-skills/`.
- They use `teach-skill` type and taxonomy tags.
- They may reference prompt patterns and reuse catalog entries.
- No Teach Skill files are created.
- No Teach Skill Studio implementation is authorized.

## 18. Relationship to Teach Skill Studio

- Teach Skill Studio is a future Skill Authoring Layer capability.
- It is not implemented.
- It requires separate design, Owner approval, implementation, Codex audit, GitHub verification, and canonical baseline update.

## 19. Relationship to future dashboard/operator control plane

- Future dashboard may display Obsidian memory categories, phase baselines, handoffs, and Teach Skills taxonomy.
- No dashboard behavior, API route, connector, daemon, watcher, or control-plane code is implemented.
- Dependency remains separately authorized Phase 1T-B or later.

## 20. Future automation boundary

No Git/API mutation, vault-writing automation, registry writes, sync daemons, note ingesters, validators, template parsers, generated memory, or AgentBridge authority changes are authorized.

Future automation is blocked until separate authorized phase.

## 21. Grounding in existing PNPD documents

This design references the following existing documents as grounding sources only. This phase does not edit or supersede them:

- `docs/pnpd/current-capability-map.md`
- `docs/pnpd/project-profile-schema-and-adoption-model.md`
- `docs/pnpd/framework-classification.md`
- `docs/pnpd/memory-and-product-delivery-framework.md`

## 22. Verification and audit expectations

Required local gates:

```bash
git diff --name-only
git diff --check
git diff -- .obsidian .pnpd scripts templates tests package.json package-lock.json .github/workflows README.md
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
```

Expected `git diff --name-only` result:

```text
docs/pnpd/phase-1p-g-teach-skills-obsidian-git-knowledge-layer-design.md
```

## 23. Expected final success verdict

`PHASE_1P_G_TEACH_SKILLS_OBSIDIAN_GIT_KNOWLEDGE_LAYER_CATEGORISATION_DESIGN_PUSHED_CI_GREEN`

---

**Required phrase attestation:**

This document contains:

- `docs-only`
- `Git is the canonical version-control`
- `Obsidian is the human-facing editor and navigation interface only`
- `Committed Markdown files in the repository are the source of truth`
- `design-only and non-implemented`
- `No automation`
- `blocked until separately authorized`
- `no production readiness claim`
- `no AgentBridge authority`
- `Owner remains final authority`
