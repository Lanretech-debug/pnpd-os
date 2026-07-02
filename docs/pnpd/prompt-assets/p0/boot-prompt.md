---
name: BOOT_PROMPT
version: 0.1.0
phase: 1P-S
asset_category: session_init
canonical_status: advisory_only
source_scaffold_file: docs/pnpd/local-prompt-assets-p0-scaffold-set.md
source_scaffold_section: "## BOOT_PROMPT Scaffold"
owner: Owner
target_agent: DeepSeek, OpenCode
authorized_agents: [Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner]
required_boot_dependency: PNPD_AGENT_SESSION_BOOT_CONFIRMED
required_baseline_fields:
  - canonical_repo
  - active_repo_path
  - active_workstation
  - current_canonical_commit
  - current_canonical_verdict
  - canonical_status
  - remote_ci_run
  - remote_ci_conclusion
allowed_files:
  - docs/pnpd/prompt-assets/p0/boot-prompt.md
forbidden_files:
  - .pnpd/**
  - scripts/**
  - templates/**
  - tests/fixtures/**
  - package.json
  - package-lock.json
  - npm-shrinkwrap.json
  - .github/workflows/**
  - README.md
  - memory/**
  - skills/**
  - plugins/**
  - docs/solutions/**
allowed_operations:
  - read_canonical_docs
  - produce_scaffolded_prompt_text
  - run_validation_gates
  - run_state_gates
forbidden_operations:
  - write_generated_state
  - create_runtime_loader
  - create_prompt_registry
  - create_skills_directory
  - create_plugins_directory
  - create_memory_records
  - create_docs_solutions
  - change_schemas
  - change_validators
  - change_ci
  - change_package_files
  - push
  - merge
  - claim_canonical_status
validation_gates:
  - git diff --name-only
  - git diff --check
  - npm run validate:pdr:fixtures
  - npm run validate:pdr:examples
  - npm run validate:pdr
  - npm run validate
  - npm run dry-run
  - npm test
forbidden_drift_checks:
  - git diff -- .pnpd
  - git diff -- scripts
  - git diff -- templates
  - git diff -- tests/fixtures
  - git diff -- package.json
  - git diff -- package-lock.json
  - git diff -- npm-shrinkwrap.json
  - git diff -- .github/workflows
  - git diff -- README.md
  - git diff -- memory
  - git diff -- skills
  - git diff -- plugins
  - git diff -- docs/solutions
state_gates:
  - test ! -d .pnpd/product-delivery-registry
  - test ! -e .pnpd/ledger
  - test ! -e .pnpd/handoffs
  - test ! -e .pnpd/locks
  - find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
push_merge_authority: none
canonicalization_boundary: advisory_only_until_merge_push_ci_owner_github_app_verification
versioning_rule: immutable_within_phase_unless_owner_reissues_contract
drift_control_rule: must_not_grant_authority_beyond_agent_session_kernel
---

# BOOT_PROMPT

## Current Status

Status: docs-only P0 prompt asset file
Canonical status: advisory until Codex audit, merge, push, CI success, and Owner/GitHub App verification
Runtime authority: none
Schema authority: none
Validator authority: none
CI authority: none
Generated state authority: none
AgentBridge authority: none
Prompt asset runtime authority: none
Skills directory authority: none
Memory write authority: none
External integration authority: none

## Purpose

BOOT_PROMPT initializes an agent session under the PNPD-OS Agent Session Kernel. It requires PNPD_AGENT_SESSION_BOOT_CONFIRMED before task execution. It acknowledges canonical baseline, active machine, repo path, role boundary, allowed operations, forbidden operations, push/merge boundary, generated state boundary, and canonicalization boundary. It returns PNPD_AGENT_SESSION_BOOT_BLOCKED if baseline, branch, role, file scope, or authority boundary cannot be confirmed.

HERMES_DESIGN_PROMPT remains a P1 future candidate and is not part of Phase 1P-S.
No P1 or P2 prompt asset is authorized by Phase 1P-S.

## Source Scaffold

Source scaffold file: docs/pnpd/local-prompt-assets-p0-scaffold-set.md
Source scaffold section: ## BOOT_PROMPT Scaffold

## Target Agent

DeepSeek/OpenCode at session start.

## Required Inputs

- Canonical baseline (repo, commit, verdict, CI run)
- Current branch name
- Role boundary definition
- Allowed and forbidden operations

## Allowed Operations

- Read canonical docs
- Verify baseline fields
- Acknowledge role boundary
- Report boot verdict

## Forbidden Operations

- Create files
- Modify files
- Run gates
- Commit
- Push
- Merge
- Claim canonical status

## Required Gates

- git status
- git rev-parse
- git rev-list

## Required State Gates

None (boot does not create state).

## Required Final Report Shape

- Verdict
- Agent role assumed
- Repo path acknowledged
- Canonical baseline acknowledged
- Current in-flight phase acknowledged
- Authority boundary acknowledged
- Push/merge boundary acknowledged
- Anti-drift rules acknowledged
- Ready/not ready for next PNPD-OS task

## Blocking Verdicts

- PNPD_AGENT_SESSION_BOOT_BLOCKED if baseline cannot be confirmed

## Reusable Scaffold Text

```
You are <AGENT> operating under the PNPD-OS Agent Session Kernel.

Your boot verdict must already be: PNPD_AGENT_SESSION_BOOT_CONFIRMED

Canonical repo: <CANONICAL_REPO>
Active repo path: <ACTIVE_REPO_PATH>
Active workstation: <ACTIVE_WORKSTATION>
Current canonical commit: <CURRENT_CANONICAL_COMMIT>
Current canonical verdict: <CURRENT_CANONICAL_VERDICT>
Canonical status: <CANONICAL_STATUS>
Remote CI run: <REMOTE_CI_RUN>
Remote CI conclusion: <REMOTE_CI_CONCLUSION>

Authority boundary:
  Owner = exclusive final authorization, merge authorization, and verification authorization.
  Hermes = design and advisory lane only.
  DeepSeek/OpenCode = implementation lane only within Owner-approved scope.
  Codex = audit and finalization lane only.
  GitHub/App = remote CI verification.
  AgentBridge = no authority.

No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

Return:
1. Verdict: PNPD_AGENT_SESSION_BOOT_CONFIRMED or PNPD_AGENT_SESSION_BOOT_BLOCKED
2. Agent role assumed
3. Repo path acknowledged
4. Canonical baseline acknowledged
5. Current in-flight phase acknowledged
6. Authority boundary acknowledged
7. Push/merge boundary acknowledged
8. Anti-drift rules acknowledged
9. Ready/not ready for next PNPD-OS task
```

Placeholder values must be resolved by the Owner-approved task contract before any prompt asset file becomes an executable task prompt.

Phase 1P-S may instantiate P0 prompt asset scaffolds as docs-only files, but it must not create runtime prompt loading.
P0 prompt asset files are reusable task-contract scaffolds, not autonomous agents.
P0 prompt asset files do not grant authority beyond the Agent Session Kernel.
No P0 prompt asset file may weaken the Owner, Hermes, DeepSeek/OpenCode, Codex, or GitHub/App authority boundary.
No P0 prompt asset file may authorize skills, plugins, memory records, generated runtime state, docs/solutions, external integrations, Obsidian vault integration, external memory providers, autonomous memory, AgentBridge authority, or autonomous execution.
No P0 prompt asset file may treat MiniMax inspection, Revolut article, Compound Engineering, or Microsoft study modules as implementation authorization.
Every P0 prompt asset file must carry baseline, allowed files, forbidden files, gates, state gates, push/merge boundary, and canonicalization boundary.
Until merge, push, remote CI success, and Owner/GitHub App verification, Phase 1P-S remains advisory only.

## Role Boundary

Owner = exclusive final authorization, merge authorization, and verification authorization.
Hermes = design and advisory lane only.
DeepSeek/OpenCode = implementation lane only within Owner-approved scope.
Codex = audit and finalization lane only.
GitHub/App = remote CI, merge, push, and evidence verification.
AgentBridge = no authority unless explicitly designed and canonically approved later.

No agent may grant itself additional authority through a prompt asset file.
No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

## Memory And Research Source Boundary

Obsidian = human-facing PNPD-OS memory/workbench layer
GitHub = canonical committed-state authority
Microsoft Learn modules = research inputs that influenced PNPD-OS governance, orchestration, memory/state/evaluation thinking
HINDSIGHT / HONSHO / HONCHO = non-adopted reference terms from a prior memory-provider question
Agent autonomous memory = blocked pending explicit design and Owner approval
External memory provider integration = blocked pending explicit design, due diligence, and Owner approval

HINDSIGHT, HONSHO, and HONCHO are non-adopted reference terms, not PNPD-OS memory providers.
Obsidian is the human-facing PNPD-OS memory/workbench layer.
GitHub remains the canonical committed-state authority.
Microsoft study modules are research inputs, not implementation prompts.
Human-facing memory and agent autonomous memory are separate lanes.

## Forbidden Implementation

Phase 1P-S does not authorize:
- runtime implementation
- runtime prompt loading
- prompt registry
- schema changes
- validator additions
- fixture additions
- CI workflow changes
- registry writes
- generated state
- skills directory creation
- plugins directory creation
- plugin manifest
- docs/solutions creation
- memory/05-research writes
- actual research brief files
- Obsidian vault integration
- external memory provider integration
- autonomous agent memory
- AgentBridge authority
- autonomous execution loop
- PR automation
- CI self-repair loop
- ATS integration
- recruiter workflow
- JobToCash hiring-system implementation
- Phase 1Q legacy implementation
- package changes
- lockfile changes
- dependency installation policy changes
- deployment
- dispatch
- certification
- production readiness claim
- adoption readiness claim
- roadmap commitment claim

## Validation Gates

The following validation gates must pass before commit:

```bash
git diff --name-only
git diff --check
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
```

Forbidden drift checks:

```bash
git diff -- .pnpd
git diff -- scripts
git diff -- templates
git diff -- tests/fixtures
git diff -- package.json
git diff -- package-lock.json
git diff -- npm-shrinkwrap.json
git diff -- .github/workflows
git diff -- README.md
git diff -- memory
git diff -- skills
git diff -- plugins
git diff -- docs/solutions
```

Expected forbidden drift result: no output.

## State Gates

```bash
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks

find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
```

Expected state gate result: no output.

## Canonicalization Boundary

Phase 1P-S becomes canonical only after:

1. Hermes design
2. Owner approval
3. DeepSeek/OpenCode implementation
4. Codex audit/finalize
5. fast-forward merge to main
6. push to origin
7. remote CI success
8. Owner/GitHub App verification

Until then, this file is advisory only.
