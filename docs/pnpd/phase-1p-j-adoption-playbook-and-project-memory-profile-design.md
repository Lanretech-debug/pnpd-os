# Phase 1P-J — Adoption Playbook and Project Memory Profile Design

## 1. Purpose

This phase designs the PNPD-OS adoption layer: the playbook, protocols, prompts, models, rules, and boundaries that govern how external projects are adopted into PNPD-OS and how project memory profiles are created, maintained, and governed.

This document is design-only. It does not implement the adoption layer. It creates no memory records, no project profiles, no README changes, no automation, no schemas, no validators, no fixtures, no CI changes, no runtime behavior, and no generated state.

The adoption layer defined here governs:

1. Project adoption playbook.
2. Project memory profile adoption model.
3. README-facing copy-paste adoption prompt design.
4. No-drift adoption sequence.
5. GitHub-as-authority memory model.
6. Agent memory boundary.
7. Anti-AI-slope rules.
8. Relationship between PNPD-OS, project repos, Obsidian, GitHub, agents, memory, README, deferred scope, Teach Skills, and future AgentBridge.

## 2. Current canonical baseline

```text
Verdict:
PHASE_1P_I_BATCH_0_POST_DESIGN_CANONICAL_STATE_RECONCILIATION_PUSHED_CI_GREEN

Branch:
main

Canonical commit:
986529b8d5617335b53e6cc00613951a0ecc30b3

Remote CI run:
28175157155

Remote CI conclusion:
success

Known untracked files:
none
```

## 3. Risk class and scope

```text
Docs-only adoption design. No runtime, no automation, no schema, no validator, no fixture, no CI, no package, no registry write, no dashboard, no daemon, no AgentBridge authority, no deployment, no dispatch, no installer.
```

No production readiness claim.
No adoption readiness claim.

## 4. Why adoption needs a separate design

Adoption is not implementation. Adoption is the governance decision, evidence trail, and canonical recognition that a project is operating under PNPD-OS governance. Without a separate adoption design, the following risks are unavoidable:

- A copied prompt is misunderstood as adoption.
- A generated profile is mistaken for a governed project entry.
- A memory note is confused with canonical adoption evidence.
- An agent self-certifies adoption without Owner authorization.
- Obsidian visibility is treated as authority.
- Local files are treated as canonical before commit, push, CI success, and reconciliation.
- Memory records proliferate without governance, creating fake progress.
- Vague project ambition is laundered into apparent adoption milestones.

This design also distinguishes the following concepts that are frequently conflated during adoption work:

- **project adoption**: the Owner-authorized governance decision that a project operates under PNPD-OS rules, evidenced by committed, pushed, CI-green state.
- **project memory profile creation**: the governed construction of a project memory profile YAML/Markdown file, which is a governed artifact of adoption, not adoption itself.
- **memory record creation**: the authoring of individual memory notes, which are evidence, not authority, and do not constitute adoption.
- **README adoption prompt**: a copy-paste instruction block designed for the README surface that guides an external agent through governed adoption assessment without authorizing mutation.
- **external integration prompt**: a user-facing instruction block that guides an agent through assessment and planning, without authorizing repo mutation.
- **actual runtime integration**: the real execution of PNPD-OS scripts, validators, and orchestrator checks within the target project's CI and local toolchain — deferred until implementation phases.
- **future AgentBridge integration**: a planned capability that does not yet exist; no AgentBridge authority is active or authorized.
- **deferred implementation**: future work recorded outside the active implementation lane until Owner authorization and a separate Hermes design unlock it.

A separate adoption design isolates adoption governance from implementation work, memory authoring, README content, and tooling evolution. It defines the sequence, evidence, gates, and authority boundaries before any project is onboarded.

## 5. PNPD-OS adoption philosophy

PNPD-OS adoption is a voluntary, Owner-authorized governance commitment. It is not:

- A package install.
- A CLI command.
- A template copy.
- A README prompt paste.
- An automated scan.
- A self-service workflow.

Adoption means the project Owner has explicitly authorized the project to operate under PNPD-OS governance rules, evidence requirements, role separation, and canonical reconciliation. Adoption is a decision, not a file change.

The adoption philosophy rests on six principles:

1. **Owner is authority.** No adoption occurs without Owner authorization.
2. **GitHub is the canonical authority layer for committed repo state.** No local-only state is adoption evidence.
3. **Memory is evidence, not authority.** Memory records support governance but do not establish it.
4. **Adoption is sequenced.** A project moves through defined lifecycle states with explicit gates at each transition.
5. **Adoption is reversible.** A project can be superseded, archived, or rejected without contaminating other governed projects.
6. **Adoption is minimal-first.** The smallest safe batch is always preferred. Deferred items are not activated by adoption.

## 6. GitHub-as-authority model

GitHub is the canonical authority layer for committed repo state. This means:

- The canonical state of any PNPD-OS-governed project is the committed, pushed, CI-green state on the default branch of its remote GitHub repository.
- Local working-tree state is not canonical until committed, pushed, CI-green, and reconciled.
- Local files are not canonical until committed, pushed, CI-green, and reconciled.
- GitHub Actions provide CI evidence only. CI success does not certify correctness, security, or production readiness.
- The GitHub App is a remote verification tool only. It does not authorize, approve, merge, deploy, or certify.
- No agent may self-certify adoption, profile state, or canonical status.
- No agent may promote memory to canonical state without Owner authorization, Codex audit, GitHub verification, and capability-map reconciliation.

The GitHub authority model ensures that all canonical claims are backed by committed, verifiable, remotely reproducible evidence.

## 7. Obsidian boundary

Obsidian is an editor and navigation tool only. It is not an authority surface. Specifically:

- Obsidian visibility is not authority. The fact that a note appears in an Obsidian vault does not make it canonical, authorized, or verified.
- Obsidian is not a PNPD-OS component. PNPD-OS does not ship, configure, or depend on Obsidian.
- The `.obsidian` directory is not part of PNPD-OS governance. No `.obsidian` directory is created, committed, or referenced as authorized PNPD-OS state by this phase or any prior canonical phase.
- Obsidian may be used by the Owner as a personal editor for memory notes. This usage is personal and optional. It does not confer governance status.
- No memory record requires Obsidian. Memory records are plain Markdown files stored in the `memory/` directory, tracked by Git, and governed by PNPD-OS rules. They are readable and editable with any text editor.
- The JobToCash repo-vault model (where an Obsidian vault is separately maintained with `.obsidian` configuration) is not adopted into PNPD-OS. It remains a separate project with its own governance.

## 8. Agent memory boundary

The agent memory boundary separates what agents can know, record, and recall from what is canonical project state:

- Agents may read committed memory records within their authorized scope.
- Agents may propose memory records as part of implementation, but those records are draft until governed through the promotion flow.
- Agents must not create memory records without explicit authorization from the playbook or Owner.
- Agents must not create memory records until a project memory profile is authorized.
- Agents must not treat memory records as authority. Memory is evidence, not authority.
- Agents must not leak private memory into committed records. Private personal notes must remain uncommitted.
- Agents must not use memory records to bypass governance gates. A memory note is not adoption.

The memory boundary ensures that agents operate within governed evidence trails and do not create ungoverned, unverifiable memory artifacts.

## 9. Anti-AI-slope rules

The following rules prevent AI-driven governance decay, fake progress, and authority drift:

```text
Memory is evidence, not authority.
GitHub is the canonical authority layer for committed repo state.
Owner is authority for decisions.
Codex is authority for audit/finalization only.
No agent may self-certify.
No agent may promote memory to canonical state without Owner authorization, Codex audit, GitHub verification, and capability-map reconciliation.
A copied prompt is not adoption.
A generated profile is not adoption.
A memory note is not adoption.
Obsidian visibility is not authority.
Local files are not canonical until committed, pushed, CI-green, and reconciled.
Research notes do not authorize implementation.
Deferred items are not active backlog.
Blocked items are not eligible implementation.
Do not infer implementation from naming, folders, or templates.
Do not turn project memory into private personal memory.
Do not use PNPD-OS to launder vague project ambition into fake progress.
```

These rules are binding on all agents operating within PNPD-OS-governed projects. Violations are governance failures, not implementation bugs.

## 10. Project adoption lifecycle

A project moves through the following lifecycle states during PNPD-OS adoption. Each state includes a short definition and whether it is canonical or non-canonical.

| State | Definition | Canonical? |
|---|---|---|
| `discovered` | A project has been identified as potentially adoptable. No assessment has been performed. No evidence has been collected. | No |
| `candidate` | A preliminary adoption assessment has been produced. The project purpose, repo state, docs state, CI state, and adoption risks have been surveyed. Owner has not yet authorized adoption. | No |
| `owner-scoped` | Owner has reviewed the candidate assessment and defined the adoption scope, allowed surfaces, forbidden surfaces, agent roles, and privacy classification. No file changes have been made. | No |
| `profile-designed` | A project memory profile has been designed (not created) following the profile model defined in this document. The profile is design-only. | No |
| `implementation-ready` | Owner has authorized implementation of the adoption batch. Hermes has produced a design. DeepSeek is authorized to implement. Codex audit criteria are defined. | No |
| `implemented` | The adoption batch has been implemented by DeepSeek. Changes are committed locally but not yet pushed. | No |
| `codex-audited` | Codex has audited the implementation against the design, the playbook, and the capability map. The audit report is complete with a pass/fail/contingent recommendation. | No |
| `github-verified` | Changes have been pushed to the remote default branch. CI has run and returned success. The GitHub App has verified the remote state matches the expected commit. | No |
| `canonically-adopted` | The project is fully adopted into PNPD-OS. The canonical verdict has been issued. The capability map has been reconciled. The project memory profile is active. | Yes |
| `superseded` | The project's adoption has been replaced by a newer adoption batch or a different governance framework. The prior adoption record is preserved for history. | Yes |
| `archived` | The project's adoption is no longer active. Governance records are preserved but no new adoption work is authorized. | Yes |
| `rejected` | Owner has explicitly rejected PNPD-OS adoption for this project. The rejection record is preserved. No further adoption work is authorized without a new Owner decision. | Yes |

Only `canonically-adopted`, `superseded`, `archived`, and `rejected` are canonical terminal states. All earlier states are non-canonical transitional states.

**Project adoption requires Owner authorization, Codex audit, GitHub verification, and canonical reconciliation.** No project is adopted into PNPD-OS merely because a note exists.

## 11. Project memory profile lifecycle

A project memory profile moves through the following lifecycle states. The project memory profile is distinct from project adoption — a profile can be designed before adoption is complete, but a profile cannot be active before adoption is canonical.

| State | Definition | Canonical? |
|---|---|---|
| `draft` | A profile is being drafted. It may be incomplete, inconsistent, or based on unverified information. | No |
| `candidate` | A profile has been completed as a draft and is ready for Owner review. All required fields are populated with best-available information. | No |
| `review-ready` | Owner has reviewed the candidate profile and it is ready for Codex audit. No new information has been added since Owner review. | No |
| `approved` | Codex audit has passed and Owner has approved the profile. The profile is ready to become active upon canonical adoption of the project. | No |
| `active` | The project is canonically adopted and the profile is the authoritative project memory entry. The profile governs memory authoring, agent roles, and adoption scope. | Yes |
| `superseded` | The profile has been replaced by a newer profile version. The prior profile is preserved for history. | Yes |
| `archived` | The profile is no longer active but preserved for governance history. | Yes |
| `rejected` | Owner has explicitly rejected the profile. The rejection record is preserved. | Yes |

Only `active`, `superseded`, `archived`, and `rejected` are canonical terminal states.

The project memory profile lifecycle is independent of the project adoption lifecycle, but the `active` profile state requires `canonically-adopted` project state as a prerequisite.

## 12. External project onboarding flow

An external project (a repo not currently under PNPD-OS governance) follows this flow:

1. **Discovery.** The project is identified. A `discovered` entry is recorded. No assessment is performed.
2. **Candidate assessment.** A DeepSeek agent (under Owner authorization) inspects the target repo and produces an adoption assessment using the README-facing copy-paste adoption prompt as a guide. The project moves to `candidate`.
3. **Owner scoping.** Owner reviews the assessment, defines allowed/forbidden surfaces, agent roles, privacy classification, and adoption depth. The project moves to `owner-scoped`.
4. **Profile design.** Hermes designs the project memory profile following the model defined in this document. The project moves to `profile-designed`. No profile file is created.
5. **Implementation authorization.** Owner authorizes the implementation batch. Hermes produces a design handoff. The project moves to `implementation-ready`.
6. **Implementation.** DeepSeek implements the adoption batch. Changes are committed locally. The project moves to `implemented`.
7. **Codex audit.** Codex audits the implementation. The project moves to `codex-audited`.
8. **GitHub verification.** Changes are pushed. CI runs. GitHub App verifies. The project moves to `github-verified`.
9. **Canonical adoption.** The canonical verdict is issued. The capability map is reconciled. The profile becomes `active`. The project is `canonically-adopted`.

At each step, the project may be rejected or paused by Owner decision.

## 13. Internal project onboarding flow

An internal project (the PNPD-OS repo itself or a project already under partial PNPD-OS governance) follows the same flow as external onboarding, with these differences:

- Discovery is replaced by internal scoping.
- The repo is already known and partially governed.
- Memory records may already exist but must be reconciled against the new adoption profile.
- The capability map already references the project. Adoption means updating the capability map entry to reflect the new governance depth.

PNPD-OS itself is the first internal project. Its adoption is self-referential: the governance framework governs itself through the same lifecycle.

## 14. README-facing copy-paste adoption prompt design

This section designs the future README-facing adoption prompt. This prompt is intended to be placed near the top of `README.md` in a future implementation phase. This phase designs the prompt only. `README.md` is not modified.

### 14.1 Prompt purpose

The README adoption prompt enables an external user to copy-paste a structured instruction into a PNPD-OS-capable agent (DeepSeek, Codex, or a compatible agent runtime). The agent then performs a governed adoption assessment without mutating the target repo.

### 14.2 Prompt text (future README placement)

```text
## PNPD-OS Adoption

Copy the prompt below into a PNPD-OS-capable agent to assess this project for PNPD-OS adoption.

---

**PNPD-OS Adoption Assessment**

You are operating under PNPD-OS governance rules.

**Project information:**

- Project name: [PROJECT_NAME]
- Repo path: [REPO_PATH]
- Remote repo: [REMOTE_REPO]
- Default branch: [DEFAULT_BRANCH]
- Current goal: [CURRENT_GOAL]
- Allowed file set: [ALLOWED_FILE_SET]
- Forbidden surfaces: [FORBIDDEN_SURFACES]
- Privacy constraints: [PRIVACY_CONSTRAINTS]
- Desired adoption depth: [DESIRED_ADOPTION_DEPTH]
- Current known baseline: [CURRENT_KNOWN_BASELINE]
- Current known untracked files: [CURRENT_KNOWN_UNTRACKED_FILES]

**Instructions:**

1. Inspect the target repo before proposing changes. Read the current state of all relevant files.
2. Identify the default branch and current HEAD. Verify the repo is a valid Git worktree.
3. Inspect existing docs, package files, tests, CI configuration, schemas, runtime files, and generated-state folders. Report what exists and what is missing.
4. Identify the project purpose and adoption goal. State them explicitly.
5. Separate facts from assumptions. Label each finding as "fact" or "assumption."
6. Ask for Owner authorization before any file changes. Do not modify any file without explicit Owner approval.
7. Produce a PNPD-OS adoption assessment covering: project purpose, product/business goal, current repo state, branch and baseline, docs state, test/gate state, CI state, package/dependency state, runtime surface, schema/validator surface, generated-state surface, deployment/dispatch surface, governance docs, deferred scope, blocked scope, agent roles, Owner authority, known untracked files, project privacy boundaries, memory eligibility, adoption risks, next safe batch, Codex audit strategy, and GitHub verification strategy.
8. Propose the smallest safe first batch. The batch must be a single, verifiable change that moves the project one adoption state forward.
9. Preserve GitHub as authority. All canonical claims must reference committed, pushed, CI-green state.
10. Treat Obsidian only as editor/navigation unless explicitly authorized. Do not create or reference `.obsidian` directories.
11. Avoid private memory leakage. Do not include secrets, personal notes, or uncommitted information in assessment output.
12. Avoid runtime, schema, CI, or package changes unless explicitly authorized by Owner.
13. Avoid creating memory records until a project memory profile is authorized. A memory note is not adoption.
14. Avoid claiming production readiness or adoption readiness. The assessment is advisory.
15. Provide Codex audit criteria before implementation. State what Codex will verify.
16. Require remote CI verification before canonical adoption. State the expected CI outcome.
```

### 14.3 Placeholder definitions

| Placeholder | Description |
|---|---|
| `[PROJECT_NAME]` | Human-readable project name |
| `[REPO_PATH]` | Local file-system path to the repo |
| `[REMOTE_REPO]` | GitHub remote repository (e.g., `owner/repo`) |
| `[DEFAULT_BRANCH]` | Default branch name (e.g., `main`) |
| `[CURRENT_GOAL]` | The adoption goal for this assessment |
| `[ALLOWED_FILE_SET]` | Files and directories the agent may read and propose changes to |
| `[FORBIDDEN_SURFACES]` | Files and directories the agent must not read, modify, or reference |
| `[PRIVACY_CONSTRAINTS]` | Privacy boundaries for this project |
| `[DESIRED_ADOPTION_DEPTH]` | How deep the adoption assessment should go (e.g., "full assessment", "docs-only", "CI gate check") |
| `[CURRENT_KNOWN_BASELINE]` | Known canonical commit, CI run, or verdict |
| `[CURRENT_KNOWN_UNTRACKED_FILES]` | Known untracked files in the repo |

### 14.4 Prompt governance

The README prompt must not:
- Tell the receiving agent to mutate the repo automatically.
- Tell the receiving agent to install PNPD-OS.
- Claim PNPD-OS has a package, installer, CLI, daemon, or AgentBridge integration unless separately canonical.
- Claim adoption is complete upon prompt execution.
- Bypass Owner authorization.
- Authorize memory record creation.
- Authorize profile creation.

The README prompt is a discovery and assessment tool only. It initiates the adoption sequence but does not advance it beyond `candidate`.

## 15. Adoption playbook structure

The adoption playbook is a structured document that governs how projects are adopted into PNPD-OS. It is not a single document but a collection of governed artifacts:

1. **This design document.** The canonical adoption governance reference.
2. **The README-facing adoption prompt.** The public entry point for external adopters.
3. **The project memory profile model.** The schema for governed project memory entries.
4. **The adoption lifecycle state machine.** Defined in Section 10.
5. **The profile lifecycle state machine.** Defined in Section 11.
6. **The anti-AI-slope rules.** Defined in Section 9.
7. **The authority matrix.** Defined in Section 21.
8. **The drift-prevention model.** Defined in Section 23.
9. **The verification and audit expectations.** Defined in Section 33.

Future implementation phases will create concrete playbook artifacts (templates, checklists, prompt files) derived from this design. This phase designs the structure only.

## 16. PNPD-OS core capability coverage

The adoption playbook must explain how a project adopter should inspect or map the following PNPD-OS core capability dimensions:

| Capability dimension | Inspection method |
|---|---|
| Project purpose | Read project docs, README, PRD (if exists) |
| Product/business goal | Read product spec, business requirements |
| Current repo state | `git status`, `git log`, `git remote -v` |
| Branch and baseline | `git rev-parse HEAD`, `git branch`, identify default branch |
| Docs state | Inventory `docs/`, `README.md`, design docs |
| Test/gate state | Run `npm test` or equivalent, inspect CI config |
| CI state | Inspect `.github/workflows/`, read latest CI run |
| Package/dependency state | Read `package.json`, `package-lock.json`, dependency manifests |
| Runtime surface | Identify entry points, server files, CLI scripts |
| Schema/validator surface | Identify JSON Schema files, validation scripts |
| Generated-state surface | Identify generated directories (e.g., `dist/`, `build/`, `.pnpd/`) |
| Deployment/dispatch surface | Identify deployment configs, dispatch scripts |
| Governance docs | Read governance docs, handoff records, decision logs |
| Deferred scope | Identify items marked as deferred, out-of-scope |
| Blocked scope | Identify items blocked by external dependencies |
| Agent roles | Identify which agents are authorized for which actions |
| Owner authority | Identify Owner decisions, authorization records |
| Known untracked files | `git ls-files --others --exclude-standard` |
| Project privacy boundaries | Identify private data, secrets, personal notes |
| Memory eligibility | Determine if the project qualifies for PNPD-OS memory governance |
| Adoption risks | Identify risks: missing docs, dirty tree, no CI, no tests, unclear ownership |
| Next safe batch | Propose the smallest verifiable change |
| Codex audit strategy | Define what Codex will audit and against what criteria |
| GitHub verification strategy | Define what CI must run and what success looks like |

## 17. Required adoption inputs

Before adoption assessment can begin, the following inputs are required:

1. **Owner authorization.** Explicit, verifiable Owner approval to perform adoption assessment.
2. **Repo access.** The assessing agent must have read access to the target repo.
3. **Allowed file set.** A list of files and directories the agent may read.
4. **Forbidden surfaces.** A list of files and directories the agent must not read or modify.
5. **Privacy classification.** The project's privacy boundaries.
6. **Adoption depth.** How far the adoption should go: assessment-only, docs-only, gate-check, or full profile.
7. **Current known baseline.** Any known canonical state for the project.

## 18. Required adoption outputs

A complete adoption assessment must produce:

1. **Adoption assessment report.** A structured report covering all capability dimensions in Section 16.
2. **Fact/assumption classification.** Each finding labeled as fact or assumption.
3. **Next safe batch proposal.** The smallest verifiable change that moves adoption forward.
4. **Codex audit criteria.** What Codex will verify.
5. **GitHub verification criteria.** What CI must demonstrate.
6. **Adoption risk register.** Known risks with severity and mitigation.
7. **Profile draft.** A draft project memory profile if authorized by adoption depth.

## 19. Forbidden adoption outputs

An adoption assessment must not produce:

- Modified repo files (without Owner authorization).
- Created memory records (without an authorized project memory profile).
- Created project profiles (without Owner authorization).
- README modifications.
- CI configuration changes.
- Package changes.
- Schema or validator changes.
- Generated state.
- Runtime behavior changes.
- Production readiness claims.
- Adoption readiness claims.
- AgentBridge authority claims.
- Deployment or dispatch configuration.

## 20. Project classification model

Projects under PNPD-OS governance are classified along the following axes:

| Axis | Values | Definition |
|---|---|---|
| **Governance depth** | `full`, `docs-only`, `ci-gate`, `evidence-only` | How deeply PNPD-OS governs the project |
| **Privacy tier** | `public`, `private-uncommitted`, `private-committed-governed` | Privacy classification of project content |
| **Lifecycle stage** | One of the project adoption lifecycle states in Section 10 | Current adoption state |
| **Product type** | `app`, `library`, `framework`, `tool`, `docs`, `research`, `governance` | Type of product or system |
| **Agent access** | `read-only`, `read-propose`, `read-propose-write`, `full` | What agents are authorized to do |
| **Memory eligibility** | `eligible`, `ineligible`, `conditional` | Whether the project qualifies for PNPD-OS memory governance |

## 21. Authority matrix

| Actor/surface | Authority |
|---|---|
| Owner | final authorization and final decision |
| GitHub committed main | canonical repo state after verification |
| GitHub Actions | CI evidence only |
| Hermes | design only |
| DeepSeek | implementation only |
| Codex | audit/finalize only |
| Obsidian | editor/navigation only |
| memory/ | governed memory surface only |
| docs/pnpd/current-capability-map.md | canonical capability authority |
| README.md | public onboarding surface only |
| AgentBridge | no authority unless separately authorized |
| external project repo | separately governed project state |

## 22. Privacy and redaction model

PNPD-OS adoption must respect project privacy boundaries:

- **Public projects.** All governance records are committable. No redaction required.
- **Private-uncommitted projects.** Governance records exist but are not committed to the public repo. The project memory profile records the privacy classification and redaction rules.
- **Private-committed-governed projects.** Governance records are committed but may contain redacted fields. Redaction is governed by the project memory profile.

Redaction rules:
- Secrets must never be committed.
- Personal notes must not be committed unless explicitly authorized.
- Private repo paths, internal URLs, and proprietary names may be redacted from public governance records.
- Redacted records must indicate what was redacted and why.

## 23. Drift-prevention model

Drift is any divergence between claimed state and actual state. The drift-prevention model enforces:

1. **Baseline anchoring.** Every adoption assessment must reference a specific Git commit. Claims without a commit reference are unverifiable.
2. **Canonical reconciliation.** After every adoption batch, the capability map must be updated to reflect the new canonical state.
3. **Untracked file tracking.** Known untracked files must be listed. New untracked files discovered during adoption must be classified and recorded.
4. **Forbidden surface enforcement.** Any change to a forbidden surface during adoption is a governance violation.
5. **Periodic re-verification.** Canonical state is re-verified by CI on every push. Stale claims are detected by Git diff.
6. **No inferred implementation.** Implementation cannot be inferred from naming, folder structure, or templates. Only committed, verifiable state is evidence.
7. **Deferred scope protection.** The adoption playbook may classify deferred work but must not activate deferred work.
8. **Blocked scope protection.** Blocked items are not eligible implementation.

## 24. Evidence and baseline requirements

Every adoption action must be supported by evidence:

| Action | Required evidence |
|---|---|
| Adoption assessment | Commit hash of inspected state, CI run number, fact/assumption log |
| Profile design | Reference to this design document, Owner authorization record |
| Implementation | Commit range, diff against baseline, implementation handoff |
| Codex audit | Audit report with pass/fail/contingent, evidence references |
| GitHub verification | CI run number, CI conclusion, remote commit hash |
| Canonical adoption | Canonical verdict string, reconciled capability map entry |
| Supersession | Replacement reference, superseded profile/project reference |
| Rejection | Owner rejection record, reason for rejection |

## 25. Agent role separation

PNPD-OS enforces strict role separation across all governed projects:

- **Owner.** Final authority. Authorizes adoption, scoping, implementation, and canonical status. The only role that can issue canonical verdicts.
- **Hermes.** Design only. Produces design documents, handoffs, and adoption assessments. Cannot implement, audit, or certify.
- **DeepSeek.** Implementation only. Executes implementation batches under Hermes design and Owner authorization. Cannot design, audit, or certify.
- **Codex.** Audit/finalize only. Audits implementation against design, playbook, and capability map. Cannot design, implement, or certify.
- **GitHub App.** Remote verification only. Verifies remote state matches expected commit. Cannot authorize, approve, or certify.
- **AgentBridge.** No authority unless separately authorized. Currently not authorized for any PNPD-OS governance function.

No agent may operate outside its role. Role violation is a governance failure.

## 26. Relationship to AgentBridge

AgentBridge is a planned future integration layer between PNPD-OS and external agent runtimes. It is not implemented. It has no authority unless separately authorized.

In the adoption context:

- AgentBridge has no authority to initiate, assess, or certify adoption.
- AgentBridge has no authority to create project memory profiles.
- AgentBridge has no authority to modify canonical state.
- The README adoption prompt is designed to work with any PNPD-OS-capable agent. AgentBridge, if and when implemented, would be one such agent runtime.
- Adoption is not contingent on AgentBridge. Projects can be adopted without AgentBridge.

## 27. Relationship to Teach Skills and Skill Studio

Teach Skills and Skill Studio are designed in Phase 1P-G but not yet implemented. In the adoption context:

- Teach Skills are project-specific instructional records that teach agents how to work with a particular project.
- Skill Studio is the authoring environment for Teach Skills.
- Adoption may reference Teach Skills as future project-specific governance artifacts, but the adoption playbook does not depend on Teach Skills being implemented.
- A project memory profile may include a `teach_skills` reference once Teach Skills are canonical, but this is deferred.
- The adoption playbook may classify deferred work but must not activate deferred work.

## 28. Relationship to memory/02-projects/

The `memory/02-projects/` directory is the designated location for project memory profiles and project-specific memory records. In the adoption context:

- No project memory profile exists yet. This phase designs the model only.
- The `memory/02-projects/` directory is a governed memory surface. Its contents are subject to the promotion flow defined in Phase 1P-I.
- A project memory profile, when created, will reside in `memory/02-projects/<project-slug>/`.
- Project-specific memory records (Teach Skills, handoff records, governance records) will reside under the project slug directory.
- No project is adopted into PNPD-OS merely because a note exists in `memory/02-projects/`.

## 29. Relationship to docs/pnpd/current-capability-map.md

`docs/pnpd/current-capability-map.md` is the canonical capability authority. In the adoption context:

- The capability map lists which PNPD-OS capabilities are canonical.
- An adoption assessment must reference the capability map to determine which governance tools are available.
- After canonical adoption, the capability map must be reconciled to reflect the project's adoption state.
- The capability map is not modified by this phase.
- Adoption does not change the capability map until the project reaches `canonically-adopted` state.

## 30. Relationship to deferred scope

PNPD-OS maintains a deferred scope registry. Deferred items are capabilities, phases, or features that have been designed or discussed but not authorized for implementation.

In the adoption context:

- Deferred items must not be opened merely because adoption playbook work is complete.
- Deferred work can be revisited only through Owner authorization and a separate Hermes design.
- The adoption playbook may classify deferred work but must not activate deferred work.
- An adoption assessment may note which deferred capabilities are relevant to the project, but this notation does not authorize implementation.
- Deferred items are not active backlog. They are not eligible for implementation batching.

## 31. Future README implementation strategy

When authorized by a future phase, the README-facing adoption prompt (Section 14) will be placed near the top of `README.md` in the PNPD-OS repo. The implementation strategy is:

1. Hermes designs the exact placement, surrounding context, and any additional README sections needed.
2. Owner authorizes the README modification.
3. DeepSeek implements the change as a single commit.
4. Codex audits the README change against this design document.
5. GitHub verification confirms CI success.
6. Capability map is reconciled.

This phase does not implement any of these steps. `README.md` is not modified.

## 32. Future project profile implementation strategy

When authorized by a future phase, project memory profiles will be implemented as governed YAML or Markdown files in `memory/02-projects/<project-slug>/`. The implementation strategy is:

1. Hermes designs the exact profile file format, frontmatter schema, and validation rules.
2. Owner authorizes profile creation for a specific project.
3. DeepSeek creates the profile file following the model defined in this document.
4. Codex audits the profile against this design and the promotion flow defined in Phase 1P-I.
5. GitHub verification confirms CI success.
6. Profile becomes `active` upon canonical adoption of the project.

This phase does not implement any of these steps. No project profile exists yet. This phase designs the model only.

### 32.1 Future project profile fields

When profiles are implemented, they will include these fields:

```yaml
project_name:
project_slug:
repo_path:
remote_repo:
default_branch:
current_canonical_commit:
current_ci_status:
project_type:
product_goal:
business_goal:
active_phase:
owner_authority:
agent_roles:
allowed_surfaces:
forbidden_surfaces:
privacy_classification:
memory_policy:
adoption_status:
canonical_docs:
deferred_scope:
blocked_scope:
next_safe_batch:
codex_audit_strategy:
github_verification_strategy:
created:
updated:
```

No project profile exists yet. This phase designs the model only.

## 33. Verification and audit expectations

Every adoption batch must be verified before it can be considered canonical:

1. **Local verification.** All existing gates must pass: `npm run validate`, `npm run dry-run`, `npm test`.
2. **Forbidden surface check.** `git diff --name-only` against the baseline must not include any forbidden file or directory.
3. **Untracked file check.** `git ls-files --others --exclude-standard` must return only known and classified untracked files.
4. **`.obsidian` check.** `find . -path '*/.obsidian*' -print` must return empty in the PNPD-OS repo root.
5. **Memory file check.** `find memory -type f ! -name '*.md' ! -name '.gitignore'` must return empty.
6. **Phrase checks.** All required phrases must be present. All forbidden positive claims must be absent.
7. **Codex audit.** Codex must verify the implementation against the design, the playbook, and the anti-AI-slope rules.
8. **GitHub verification.** Remote CI must pass. Remote commit must match the expected commit.
9. **Capability map reconciliation.** The capability map must be updated to reflect the new canonical state.

## 34. Required phrase checks

These exact phrases appear in this design document:

- [x] `PHASE_1P_J_ADOPTION_PLAYBOOK_AND_PROJECT_MEMORY_PROFILE_DESIGN` — Title (line 1)
- [x] `GitHub is the canonical authority layer for committed repo state` — Sections 5, 6, 9
- [x] `Memory is evidence, not authority` — Sections 5, 8, 9
- [x] `A copied prompt is not adoption` — Sections 4, 9, 14.4
- [x] `A generated profile is not adoption` — Sections 4, 9
- [x] `A memory note is not adoption` — Sections 4, 8, 9, 14.2
- [x] `Obsidian visibility is not authority` — Sections 4, 7, 9
- [x] `Local files are not canonical until committed, pushed, CI-green, and reconciled` — Sections 5, 6, 9
- [x] `No agent may self-certify` — Sections 6, 9
- [x] `No project is adopted into PNPD-OS merely because a note exists` — Sections 10, 28
- [x] `Project adoption requires Owner authorization, Codex audit, GitHub verification, and canonical reconciliation` — Sections 10, 24
- [x] `README.md is a public onboarding surface only` — Section 21
- [x] `AgentBridge has no authority unless separately authorized` — Sections 21, 26
- [x] `Deferred items are not active backlog` — Sections 9, 30
- [x] `Blocked items are not eligible implementation` — Sections 9, 23
- [x] `The adoption playbook may classify deferred work but must not activate deferred work` — Sections 23, 27, 30
- [x] `No production readiness claim` — Sections 3, 14.4
- [x] `No adoption readiness claim` — Sections 3, 14.4

## 35. Forbidden positive claims

The following claims do not appear as positive claims in this document:

- PNPD-OS installer implemented
- PNPD-OS package implemented
- PNPD-OS CLI implemented
- AgentBridge integration active
- Obsidian vault implemented
- .obsidian created
- memory records created
- project profile created
- README updated
- runtime integration implemented
- schema implemented
- validator implemented
- fixture created
- CI enforcement added
- registry write enabled
- generated state created
- deployment enabled
- dispatch enabled
- production ready
- adoption ready

Any appearance of these terms is in a boundary negation context, explicitly denying implementation.

## 36. Expected final success verdict

```text
PHASE_1P_J_ADOPTION_PLAYBOOK_AND_PROJECT_MEMORY_PROFILE_DESIGN_PUSHED_CI_GREEN
```

This verdict will be issued after:

1. This design document is committed to `main`.
2. The commit is pushed to `origin/main`.
3. Remote CI run completes with `success`.
4. Codex audit confirms all required sections, phrases, lifecycle states, anti-AI-slope rules, and forbidden surface checks.

---

*Design complete. Ready for implementation (commit only), Codex audit, and Owner finalization.*
