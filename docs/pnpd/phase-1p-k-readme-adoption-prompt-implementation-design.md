# Phase 1P-K — README Adoption Prompt Implementation Design

## 1. Purpose

This document designs the future README-only implementation batch that will:

1. Refresh the stale README status block with current canonical baseline values.
2. Add a public copy-paste PNPD-OS adoption prompt for external users.
3. Preserve existing README safety boundaries.
4. Keep the prompt assessment-first.
5. Avoid implying installer, package, CLI, daemon, runtime integration, automatic repo mutation, active AgentBridge integration, production readiness, or adoption readiness.

This phase is a **docs-only design phase**. It does not update README, does not implement the adoption prompt, does not update the capability map, and does not create memory records or project profiles.

## 2. Current canonical baseline

| Field | Value |
|---|---|
| Verdict | `PHASE_1P_J_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION_PUSHED_CI_GREEN` |
| Branch | `main` |
| Canonical commit | `68968d497367dea8fdb8f14dc378e23afb2b0b4c` |
| Remote CI run | `28183763495` |
| Remote CI conclusion | `success` |
| Known untracked files | `none` |

## 3. Risk class and scope

**Risk class:** Docs-only README implementation design.

This phase produces one design document. No files other than the design document are created or modified. No runtime behavior, schema, validator, fixture, CI change, package change, registry write, generated state, or AgentBridge authority is created.

## 4. Why README adoption needs a separate implementation design

The README is the public onboarding surface. Adding an adoption prompt to README is not a simple copy-paste exercise. It requires:

- A design that preserves all existing README safety boundaries.
- A design that keeps the prompt assessment-first and non-authorizing.
- A design that clearly separates the adoption prompt from adoption itself.
- A design that defines forbidden claims, anti-AI-slope rules, and authority boundaries.
- A design that the future DeepSeek implementation batch can follow without ambiguity.
- A design that Codex can audit against before merge.

Phase 1P-J designed the adoption playbook and project memory profile. Phase 1P-K now designs the README-facing surface that connects external adopters to that playbook.

## 5. Current README status problem

The current README status block is stale:

```
Latest stable commit: 2b5093d
Remote CI: run 27653676971, success, 22s
Node: 20
```

The future README implementation should refresh those values to:

```
PNPD OS is v0.1.0, early-stage. It is a governance and evidence framework, not a runtime product.

Latest stable verdict:
PHASE_1P_J_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION_PUSHED_CI_GREEN

Latest stable commit:
68968d497367dea8fdb8f14dc378e23afb2b0b4c

Remote CI:
run 28183763495, success

Branch:
main

Node:
22
```

## 6. README public-surface boundary

README.md is the public onboarding surface. It is not:

- The canonical capability authority (that is `docs/pnpd/current-capability-map.md`).
- A runtime interface.
- An API contract.
- A deployment manifest.
- A certification document.
- A memory record.
- A governance record.
- An authority-granting document.

README exists to onboard humans and AI agents to PNPD-OS. It must remain safe, accurate, and non-authorizing.

## 7. Relationship to Phase 1P-J adoption playbook

Phase 1P-J (`docs/pnpd/phase-1p-j-adoption-playbook-and-project-memory-profile-design.md`) designed:

- The adoption playbook and project memory profile lifecycle.
- README-facing adoption prompt design.
- GitHub-as-authority memory governance.
- Agent memory boundaries.
- Anti-AI-slope rules.
- Project adoption lifecycle states.
- Project memory profile lifecycle states.
- Deferred-scope boundaries.
- Future README/project-profile implementation strategy.

Phase 1P-K is the implementation design for the README-facing portion of that strategy. It translates the Phase 1P-J design into a concrete, auditable future implementation batch specification for README.md only.

Phase 1P-K does **not** implement the project memory profile, memory records, `.obsidian`, or any non-README surface designed in Phase 1P-J.

## 8. Future README-only implementation scope

The future README implementation batch must modify exactly one file:

```
README.md
```

The future README implementation scope is limited to:

1. Updating the README status block with current canonical baseline values.
2. Adding a new section titled:

```markdown
## Adopt PNPD-OS into your project
```

3. Placing that new section after:

```markdown
## Who it is for
```

and before:

```markdown
## Quick local verification
```

No other README changes are authorized in that future batch.

## 9. Future README status refresh requirements

The future implementation must replace the stale status block values with current canonical baseline values from `docs/pnpd/current-capability-map.md`:

- Replace stale commit `2b5093d` with `68968d497367dea8fdb8f14dc378e23afb2b0b4c`.
- Replace stale CI run `27653676971` with `28183763495`.
- Replace `Node: 20` with `Node: 22`.
- Add the latest stable verdict line.
- Add the full commit SHA instead of the short SHA.
- Preserve the existing framing: "PNPD OS is v0.1.0, early-stage. It is a governance and evidence framework, not a runtime product."

The "It does not guarantee correctness, security, or zero drift. It does not replace human review or Owner judgment." line must be preserved.

## 10. Future README adoption prompt placement

The new `## Adopt PNPD-OS into your project` section must be placed:

- **After** the `## Who it is for` section.
- **Before** the `## Quick local verification` section.

This placement ensures:

- The reader understands what PNPD-OS is and who it is for before seeing the adoption prompt.
- The adoption prompt is visible before the quickstart technical commands.
- The flow is: purpose → status → what it is → what it is not → why it exists → who it is for → **adopt it** → verify it → commands.

## 11. Future README adoption prompt content

The new README section must contain a framing paragraph followed by the copy-paste prompt in a fenced code block.

### Framing paragraph

```
Use this prompt with an AI coding agent to assess whether PNPD-OS can be adopted into your project. The prompt is assessment-first and does not authorize repo mutation, installation, deployment, dispatch, generated state, memory record creation, project profile creation, or AgentBridge authority.
```

### Copy-paste prompt

````text
You are helping me assess PNPD-OS adoption for my project.

Project name:
[PROJECT_NAME]

Repo path:
[REPO_PATH]

Remote repo:
[REMOTE_REPO]

Default branch:
[DEFAULT_BRANCH]

Current goal:
[CURRENT_GOAL]

Desired adoption depth:
[DESIRED_ADOPTION_DEPTH]

Allowed file set:
[ALLOWED_FILE_SET]

Forbidden surfaces:
[FORBIDDEN_SURFACES]

Privacy constraints:
[PRIVACY_CONSTRAINTS]

Current known baseline:
[CURRENT_KNOWN_BASELINE]

Current known untracked files:
[CURRENT_KNOWN_UNTRACKED_FILES]

Instructions:

1. Inspect the target repo before proposing changes.
2. Identify the default branch and current HEAD.
3. Inspect existing docs, package files, tests, CI, schemas, runtime files, and generated-state folders.
4. Identify the project purpose and adoption goal.
5. Separate facts from assumptions.
6. Treat GitHub committed main as the canonical authority layer for committed repo state.
7. Treat Owner authorization as required before any file changes.
8. Treat Obsidian only as editor/navigation unless explicitly authorized.
9. Avoid private memory leakage.
10. Do not create memory records until a project memory profile is authorized.
11. Do not create project profiles until a project profile implementation batch is authorized.
12. Do not change runtime, schemas, validators, fixtures, CI, packages, generated state, registry state, deployment, or dispatch unless explicitly authorized.
13. Do not claim production readiness or adoption readiness.
14. Do not imply PNPD-OS has an installer, package, CLI, daemon, or active AgentBridge integration unless separately canonical.
15. Produce a PNPD-OS adoption assessment.
16. Propose the smallest safe first batch.
17. Provide Codex audit criteria before implementation.
18. Require remote CI verification before any canonical adoption claim.

Required output:

1. Project facts found
2. Assumptions and unknowns
3. Current repo baseline
4. Existing governance/docs/test/CI state
5. Risks and privacy boundaries
6. PNPD-OS adoption suitability
7. Smallest safe first batch
8. Allowed file set
9. Forbidden surfaces
10. Required Owner authorization phrase
11. Codex audit criteria
12. GitHub verification plan
13. Clear statement of what is not authorized
````

## 12. Future README adoption prompt placeholders

The adoption prompt must include all of the following placeholders for external adopters to fill in:

- `[PROJECT_NAME]`
- `[REPO_PATH]`
- `[REMOTE_REPO]`
- `[DEFAULT_BRANCH]`
- `[CURRENT_GOAL]`
- `[DESIRED_ADOPTION_DEPTH]`
- `[ALLOWED_FILE_SET]`
- `[FORBIDDEN_SURFACES]`
- `[PRIVACY_CONSTRAINTS]`
- `[CURRENT_KNOWN_BASELINE]`
- `[CURRENT_KNOWN_UNTRACKED_FILES]`

The future implementation must not pre-fill any of these placeholders. They must remain as literal bracket-wrapped placeholders for the external adopter to replace.

## 13. Future README adoption prompt forbidden claims

The adoption prompt must not claim or imply:

- PNPD-OS has an installer.
- PNPD-OS has a package.
- PNPD-OS has a CLI.
- PNPD-OS has a daemon.
- PNPD-OS has active AgentBridge integration.
- PNPD-OS can auto-adopt projects.
- PNPD-OS can create project profiles automatically.
- PNPD-OS can create memory records automatically.
- PNPD-OS can mutate repos without Owner authorization.
- PNPD-OS is production-ready.
- PNPD-OS is adoption-ready.
- The adoption prompt itself constitutes adoption.

## 14. Future README safety boundaries to preserve

The future README implementation must preserve or restate the following boundaries exactly:

```
PNPD-OS is not a runtime server.
PNPD-OS is not a deployment tool.
PNPD-OS is not an autonomous agent system.
PNPD-OS is not a CI/CD platform.
PNPD-OS is not production certification.
PNPD-OS is not a package installer.
PNPD-OS is not a replacement for human review.
```

These boundaries must not be softened, removed, or qualified with exceptions. They are safety invariants.

## 15. Future README wording rules

1. **Assessment-first.** The adoption prompt must be framed as an assessment tool, not an adoption tool.
2. **Non-authorizing.** No wording in the new README section may authorize implementation, merge, deployment, dispatch, or repo mutation.
3. **Placeholder-driven.** All adopter-specific fields must be bracket-wrapped placeholders.
4. **No self-certification.** The prompt must instruct the receiving agent to require Owner authorization, Codex audit, and GitHub verification.
5. **Clear negation.** The prompt must clearly state what it does not authorize.
6. **SaaS-safe.** The prompt must avoid contract/legal language, pricing claims, roadmap promises, or availability SLAs.
7. **Baseline-derived.** Status block values must be derived from `docs/pnpd/current-capability-map.md`, not invented.

## 16. External adopter flow

The external adopter flow is:

1. Adopter reads README and understands what PNPD-OS is.
2. Adopter copies the adoption prompt from the `## Adopt PNPD-OS into your project` section.
3. Adopter fills in the placeholders with their project-specific values.
4. Adopter pastes the filled prompt into their AI coding agent.
5. The agent produces an adoption assessment (not adoption itself).
6. The adopter reviews the assessment.
7. The adopter decides whether to proceed with adoption.
8. If proceeding, the adopter follows the Phase 1P-J adoption playbook for subsequent steps.

## 17. Receiving-agent instructions

The receiving AI agent (the agent that processes the copied prompt) must be instructed to:

1. Inspect the target repo before proposing changes.
2. Separate facts from assumptions.
3. Treat GitHub committed main as canonical authority.
4. Treat Owner authorization as required before file changes.
5. Avoid private memory leakage.
6. Not create memory records or project profiles unless separately authorized.
7. Not change runtime, schemas, validators, fixtures, CI, packages, or generated state unless explicitly authorized.
8. Not claim production readiness or adoption readiness.
9. Not imply PNPD-OS has an installer, package, CLI, daemon, or active AgentBridge.
10. Produce a structured adoption assessment with required output fields.

## 18. Required adoption assessment output

The receiving agent must produce a structured assessment with:

1. Project facts found
2. Assumptions and unknowns
3. Current repo baseline
4. Existing governance/docs/test/CI state
5. Risks and privacy boundaries
6. PNPD-OS adoption suitability
7. Smallest safe first batch
8. Allowed file set
9. Forbidden surfaces
10. Required Owner authorization phrase
11. Codex audit criteria
12. GitHub verification plan
13. Clear statement of what is not authorized

## 19. Required smallest-safe-batch output

The receiving agent must propose the smallest safe first batch. This batch must:

- Be limited to docs-only or assessment-only changes.
- Not create runtime, schema, validator, fixture, CI, package, generated state, registry state, deployment, or dispatch.
- Not create memory records or project profiles.
- Not claim production readiness or adoption readiness.
- Clearly state what files are allowed and what surfaces are forbidden.

## 20. Required Codex audit criteria output

The receiving agent must propose Codex audit criteria for the proposed first batch. These criteria must include:

- Changed-file scope check.
- Forbidden-surface check.
- Phrase check (required present, forbidden absent).
- Boundary preservation check.
- Gate run verification.
- `.obsidian` and `memory/` boundary check.
- Known untracked files verification.

## 21. GitHub-as-authority requirements

The adoption prompt must instruct:

- GitHub committed main is the canonical authority layer for committed repo state.
- GitHub Actions provides CI evidence only, not authority.
- No agent may self-certify.
- Remote CI must be verified before any canonical adoption claim.

## 22. Obsidian boundary requirements

The adoption prompt must instruct:

- Treat Obsidian only as editor/navigation unless explicitly authorized.
- Do not create `.obsidian` directories or config files.
- Obsidian visibility is not authority.
- Local Obsidian state is not canonical.

## 23. Memory boundary requirements

The adoption prompt must instruct:

- Do not create memory records until a project memory profile is authorized.
- Memory is evidence, not authority.
- Local memory files are not canonical until committed, pushed, CI-green, and reconciled.
- Avoid private memory leakage.

## 24. Privacy and redaction requirements

The adoption prompt must instruct:

- Avoid private memory leakage.
- Do not copy private tokens, secrets, API keys, or credentials into any output.
- Do not reference private Obsidian vaults.
- Do not reference private project paths unless explicitly authorized.

## 25. Deferred/blocked-scope requirements

The adoption prompt must instruct:

- Deferred items are not active backlog.
- Blocked items are not eligible implementation.
- The adoption prompt may classify deferred work but must not activate deferred work.
- No deferred work becomes implementation merely by appearing in the assessment.

## 26. Anti-AI-slope requirements

The following anti-AI-slope rules must be embedded in the adoption prompt instructions or stated as design invariants:

```
A README prompt is not adoption.
A copied prompt is not adoption.
A generated assessment is not adoption.
A generated profile is not adoption.
A memory note is not adoption.
Obsidian visibility is not authority.
Local files are not canonical until committed, pushed, CI-green, and reconciled.
No agent may self-certify.
GitHub is the canonical authority layer for committed repo state.
Memory is evidence, not authority.
Owner authorization is required before file changes.
Project adoption requires Owner authorization, Codex audit, GitHub verification, and canonical reconciliation.
Deferred items are not active backlog.
Blocked items are not eligible implementation.
The adoption prompt may classify deferred work but must not activate deferred work.
```

## 27. Authority matrix

| Actor/surface | Authority |
|---|---|
| Owner | final authorization and final decision |
| GitHub committed main | canonical repo state after verification |
| GitHub Actions | CI evidence only |
| Hermes | design only |
| DeepSeek | implementation only |
| Codex | audit/finalize only |
| Obsidian | editor/navigation only |
| README.md | public onboarding surface only |
| memory/ | governed memory surface only |
| docs/pnpd/current-capability-map.md | canonical capability authority |
| AgentBridge | no authority unless separately authorized |
| external project repo | separately governed project state |

## 28. Future implementation allowed file set

Exactly one file:

```
README.md
```

## 29. Future implementation forbidden surfaces

The future README implementation batch must not modify:

- `docs/pnpd/current-capability-map.md`
- `docs/pnpd/phase-1p-k-readme-adoption-prompt-implementation-design.md`
- `docs/pnpd/phase-1p-j-adoption-playbook-and-project-memory-profile-design.md`
- `memory/**`
- `.obsidian/**`
- `.pnpd/**`
- `scripts/**`
- `templates/**`
- `tests/**`
- `tests/fixtures/**`
- `.github/workflows/**`
- `package.json`
- `package-lock.json`
- generated PNPD state
- project profile files
- Teach Skill files
- handoff records
- governance records
- research notes
- inbox notes
- archive notes

## 30. Future DeepSeek implementation gates

The future implementation batch must run these gates before commit:

```bash
cd /Users/lanretech/Projects/pnpd-os
git fetch origin main
git rev-parse origin/main
git status --short --branch
git diff --name-only
git diff --check
git diff --name-only -- docs/pnpd/current-capability-map.md docs/pnpd/phase-1p-k-readme-adoption-prompt-implementation-design.md docs/pnpd/phase-1p-j-adoption-playbook-and-project-memory-profile-design.md memory .obsidian .pnpd scripts templates tests package.json package-lock.json .github/workflows
find . -path '*/.obsidian*' -print
find memory -type f ! -name '*.md' ! -name '.gitignore'
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
git ls-files --others --exclude-standard
```

## 31. Future Codex audit strategy

Codex must verify:

1. Only `README.md` was modified.
2. No forbidden surface was touched.
3. The status block values match `docs/pnpd/current-capability-map.md`.
4. The new `## Adopt PNPD-OS into your project` section is correctly placed.
5. The adoption prompt includes all required instructions, placeholders, and output fields.
6. All README safety boundaries are preserved or restated.
7. All anti-AI-slope rules are present or respected.
8. No forbidden positive claims appear.
9. Required phrases are present.
10. All validation gates pass.
11. `.obsidian` check returns empty.
12. Memory file check returns clean.
13. Known untracked files remain `none`.

## 32. Required phrase checks

The following phrases must appear in this design file:

- `PHASE_1P_K_README_ADOPTION_PROMPT_IMPLEMENTATION_DESIGN`
- `A README prompt is not adoption`
- `A copied prompt is not adoption`
- `A generated assessment is not adoption`
- `GitHub is the canonical authority layer for committed repo state`
- `Memory is evidence, not authority`
- `Owner authorization is required before file changes`
- `Project adoption requires Owner authorization, Codex audit, GitHub verification, and canonical reconciliation`
- `README.md is public onboarding surface only`
- `No README update in this design phase`
- `No production readiness claim`
- `No adoption readiness claim`
- `The adoption prompt may classify deferred work but must not activate deferred work`

## 33. Forbidden positive claims

The following must not appear as positive claims in this design file:

- `README updated`
- `README adoption prompt implemented`
- `PNPD-OS installer implemented`
- `PNPD-OS package implemented`
- `PNPD-OS CLI implemented`
- `AgentBridge integration active`
- `Obsidian vault implemented`
- `.obsidian created`
- `memory records created`
- `project profile created`
- `runtime integration implemented`
- `schema implemented`
- `validator implemented`
- `fixture created`
- `CI enforcement added`
- `registry write enabled`
- `generated state created`
- `deployment enabled`
- `dispatch enabled`
- `production ready`
- `adoption ready`
- `deferred work activated`
- `blocked work implemented`

Boundary negations (e.g., "does not create X", "no Y claim") are acceptable when clearly denying implementation.

## 34. Expected final success verdict

```
PHASE_1P_K_README_ADOPTION_PROMPT_IMPLEMENTATION_DESIGN_PUSHED_CI_GREEN
```
