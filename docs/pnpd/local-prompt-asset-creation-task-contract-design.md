# PNPD Local Prompt Asset Creation Task Contract Design

## Current Status

Status: docs-only task-contract design
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

## Purpose

Phase 1P-Q defines the task-contract design for future local prompt asset creation. It specifies which prompt assets may be created first, what metadata each must carry, what files are allowed and forbidden, what gates must pass before commit, and what the audit and verification contracts require. This phase creates a docs-only task-contract design for future local prompt asset creation. It does not create actual prompt asset files.

## Canonical Baseline

Canonical repo: Lanretech-debug/pnpd-os
Active repo path: /home/lanretech_environment/Projects/pnpd-os
Active workstation: Windows WSL/Linux
Current canonical commit: 0e6bef3b16ad395321341904fad0e777d79364a4
Current canonical verdict: PHASE_1P_P_INTROSPECTION_RESEARCH_BRIEF_AND_DEFERRED_IDEAS_ORDERING_DESIGN_PUSHED_CI_GREEN
Canonical status: PHASE_1P_P_CANONICALIZED
Remote CI run: 28500070131
Remote CI conclusion: success
Remote main verification: main is identical to 0e6bef3b16ad395321341904fad0e777d79364a4

## Prior Phase Relationship

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the prompt asset layer.
1P-P defines the idea ordering layer.

Phase 1P-M created the Unified Execution Plan and Taste Gate model.
Phase 1P-N created the Agent Session Kernel and Boot Protocol.
Phase 1P-O created the skills-local prompt assets and boot handoff design.
Phase 1P-P created the introspection research brief and deferred ideas ordering design.

## 1P-P Priority Acknowledgement

actual local prompt asset creation = UNBLOCKED / NEXT/NOW_CANDIDATE

Actual local prompt asset creation is the next safest PNPD-OS capability candidate, but it is not executable without a complete PNPD task contract.

Phase 1P-Q creates the task-contract design for future local prompt asset creation.
Phase 1P-Q does not create actual prompt asset files.
Phase 1P-Q does not create skills, plugins, memory records, generated runtime state, or external integrations.

## Problem Statement

Without a formal task-contract design for local prompt asset creation, prompt assets risk being created without consistent metadata, without gates, without drift controls, and without a clear canonicalization boundary. Prompt assets may drift into autonomous agent behavior, may weaken the role boundary, and may claim authority they do not have. Phase 1P-Q defines a single reusable task-contract scaffold with mandatory metadata, required gates, and a strict canonicalization boundary that every future prompt asset creation phase must follow.

## First-Safe Prompt Asset Inventory

The first-safe prompt asset inventory defines the P0 set of prompt assets that are eligible for creation in the first implementation phase after Phase 1P-Q becomes canonical. Each asset is a reusable task-contract scaffold, not a runtime agent.

HERMES_DESIGN_PROMPT is a P1 future candidate and is not part of the first-safe implementation set.

### BOOT_PROMPT

BOOT_PROMPT initializes an agent session under the PNPD-OS Agent Session Kernel.

- asset_name: BOOT_PROMPT
- asset_category: session_init
- purpose: Initialize an agent session with boot protocol, baseline verification, and preflight gates
- target_agent: DeepSeek, OpenCode
- required_boot_dependency: PNPD-OS Agent Session Kernel
- required_baseline_fields: branch, HEAD, main, origin/main, commit count, working tree state, untracked files
- required_role_boundary: Agent must not claim canonical status, must not push, must not merge
- required_allowed_operations: Read baseline, verify preflight, report boot verdict
- required_forbidden_operations: Create files, modify files, run gates, commit, push, merge, claim authority
- required_gates: git status, git rev-parse, git rev-list
- required_state_gates: None (boot does not create state)
- required_final_report_shape: Boot verdict with baseline fields
- canonicalization_boundary: Advisory until full canonicalization chain completes
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not expand scope beyond boot verification

### DEEPSEEK_IMPLEMENTATION_PROMPT

DEEPSEEK_IMPLEMENTATION_PROMPT instructs the implementation agent to create exactly one docs-only task-contract file and nothing else.

- asset_name: DEEPSEEK_IMPLEMENTATION_PROMPT
- asset_category: implementation
- purpose: Instruct implementation agent to create exactly one docs-only file within strict scope
- target_agent: DeepSeek, OpenCode
- required_boot_dependency: BOOT_PROMPT
- required_baseline_fields: Canonical baseline, allowed files, forbidden files, gates
- required_role_boundary: Agent must not broaden scope, must not create unauthorized files, must not push, must not merge
- required_allowed_operations: Create exactly one allowed file, run gates, commit
- required_forbidden_operations: Create unauthorized files, modify forbidden paths, push, merge, claim canonical status
- required_gates: git diff --name-only, forbidden drift checks, validation gates, state gates
- required_state_gates: No generated runtime state
- required_final_report_shape: Implementation verdict with file scope, gate results, state result
- canonicalization_boundary: Advisory until Codex audit, merge, push, CI, Owner verification
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not create files outside allowed set

### CODEX_AUDIT_PROMPT

CODEX_AUDIT_PROMPT instructs the audit agent to verify that implementation stayed inside the narrow contract.

- asset_name: CODEX_AUDIT_PROMPT
- asset_category: audit
- purpose: Verify implementation stayed inside the narrow contract
- target_agent: Codex
- required_boot_dependency: DEEPSEEK_IMPLEMENTATION_PROMPT completion
- required_baseline_fields: Implementation commit, allowed files, forbidden files, gates
- required_role_boundary: Auditor must not modify files, must not push, must not merge
- required_allowed_operations: Read files, run gates, report audit verdict
- required_forbidden_operations: Create files, modify files, commit, push, merge, claim canonical status
- required_gates: git diff --name-only, forbidden drift checks, validation gates, state gates
- required_state_gates: No generated runtime state
- required_final_report_shape: Audit verdict with file scope result, gate results, overclaim scan
- canonicalization_boundary: Advisory until Owner authorizes finalization
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not expand audit scope into implementation

### CODEX_FINALIZATION_PROMPT

CODEX_FINALIZATION_PROMPT prepares finalization only after Codex audit passes and Owner authorizes finalization.

- asset_name: CODEX_FINALIZATION_PROMPT
- asset_category: finalization
- purpose: Prepare finalization after audit pass and Owner authorization
- target_agent: Codex
- required_boot_dependency: CODEX_AUDIT_PROMPT pass, Owner finalization authorization
- required_baseline_fields: Audit verdict, Owner authorization, branch state
- required_role_boundary: Finalizer must not push, merge, or claim canonical status
- required_allowed_operations: Verify gates, report finalization readiness
- required_forbidden_operations: Push, merge, claim canonical status, create files
- required_gates: git diff --check, validation gates, state gates
- required_state_gates: No generated runtime state
- required_final_report_shape: Finalization verdict with readiness confirmation
- canonicalization_boundary: Advisory until merge, push, CI, Owner/GitHub verification
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not finalize without audit pass and Owner authorization

### OWNER_DECISION_PROMPT

OWNER_DECISION_PROMPT surfaces the verified state to the Owner for approve, request changes, or block.

- asset_name: OWNER_DECISION_PROMPT
- asset_category: decision
- purpose: Surface verified state to Owner for approve, request changes, or block
- target_agent: Hermes (prepares), Owner (decides)
- required_boot_dependency: CODEX_AUDIT_PROMPT pass
- required_baseline_fields: Audit verdict, implementation report, gate results
- required_role_boundary: Agent must not self-approve, must not override Owner decision
- required_allowed_operations: Prepare decision summary, present options
- required_forbidden_operations: Make final decision, override Owner, self-certify
- required_gates: None (decision gate is Owner review)
- required_state_gates: None
- required_final_report_shape: Owner decision with approve, request changes, or block verdict
- canonicalization_boundary: Advisory until Owner decision rendered
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not present incomplete or unverified state

### BLOCKED_STATE_PROMPT

BLOCKED_STATE_PROMPT defines the required halt-and-report shape when a contract cannot be satisfied.

- asset_name: BLOCKED_STATE_PROMPT
- asset_category: halt
- purpose: Define required halt-and-report shape when contract cannot be satisfied
- target_agent: DeepSeek, OpenCode, Codex
- required_boot_dependency: Any phase
- required_baseline_fields: Current branch, HEAD, blocking reason, blocking verdict
- required_role_boundary: Agent must stop and report, must not proceed
- required_allowed_operations: Report block, document reason, recommend next step
- required_forbidden_operations: Proceed with blocked contract, work around block
- required_gates: None (halt state, no gates run)
- required_state_gates: None
- required_final_report_shape: BLOCKED_STATE_PROMPT with blocking verdict
- canonicalization_boundary: Advisory until Owner decision on block
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not allow workaround of blocked state

### RECONCILIATION_PROMPT

RECONCILIATION_PROMPT reconciles divergence between implementation reports, audit results, branch state, and Owner decisions.

- asset_name: RECONCILIATION_PROMPT
- asset_category: reconciliation
- purpose: Reconcile divergence between reports, audit results, branch state, and Owner decisions
- target_agent: DeepSeek, OpenCode, Codex
- required_boot_dependency: Owner change request or detected divergence
- required_baseline_fields: Implementation report, audit report, branch state, Owner decision
- required_role_boundary: Agent must reconcile, not override
- required_allowed_operations: Compare reports, identify divergence, propose resolution
- required_forbidden_operations: Ignore divergence, override Owner decision, self-certify reconciliation
- required_gates: git diff --name-only, git diff --check, validation gates
- required_state_gates: No generated runtime state
- required_final_report_shape: Reconciliation verdict with divergence list and resolution
- canonicalization_boundary: Advisory until Owner approves reconciliation
- versioning_rule: Version 0.1.0 initial
- drift_control_rule: Must not reconcile by ignoring divergence

## Prompt Asset Metadata Model

Every prompt asset must carry the following mandatory metadata fields:

- name
- version
- phase
- canonical_status
- owner
- authorized_agents
- allowed_files
- forbidden_files
- validation_gates
- forbidden_drift_checks
- state_gates
- push_merge_authority
- canonicalization_boundary

These metadata fields are mandatory and must not be removed, weakened, or made optional.

Example YAML frontmatter:

```yaml
---
name: <ASSET_NAME>
version: 0.1.0
phase: 1P-Q
canonical_status: advisory_only
owner: Owner
authorized_agents: [DeepSeek, OpenCode, Codex, Hermes]
allowed_files:
  - docs/pnpd/local-prompt-asset-creation-task-contract-design.md
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
state_gates:
  - test ! -d .pnpd/product-delivery-registry
  - test ! -e .pnpd/ledger
  - test ! -e .pnpd/handoffs
  - test ! -e .pnpd/locks
  - find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
push_merge_authority: none
canonicalization_boundary: advisory_only_until_merge_push_ci_owner_verification
---
```

## Allowed Implementation File Set

The only allowed implementation file is docs/pnpd/local-prompt-asset-creation-task-contract-design.md.

No other write targets are allowed during Phase 1P-Q implementation.

## Forbidden Implementation

Phase 1P-Q does not authorize:

- runtime implementation
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
- actual prompt asset files
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

## Role Boundary

Owner = exclusive final authorization, merge authorization, and verification authorization.
Hermes = design and advisory lane only.
DeepSeek/OpenCode = implementation lane only within Owner-approved scope.
Codex = audit and finalization lane only.
GitHub/App = remote CI, merge, push, and evidence verification.
AgentBridge = no authority unless explicitly designed and canonically approved later.

No agent may grant itself additional authority through a prompt asset.
No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

## Storage Boundary

All prompt asset task-contract design content must live under docs/pnpd/.

No prompt asset may reference, create, or depend on skills/, plugins/, memory/, docs/solutions/, .pnpd/ runtime paths, tests/fixtures, scripts, templates, .github/workflows, lockfiles, or package.json except as forbidden paths.

## No-Drift Rules

Actual local prompt asset creation is the next safest PNPD-OS capability candidate, but it is not executable without a complete PNPD task contract.
Prompt asset creation must not create skills, plugins, memory records, generated runtime state, or external integrations.
Prompt assets are reusable task-contract scaffolds, not autonomous agents.
Prompt assets do not grant authority beyond the Agent Session Kernel.
No prompt asset may weaken the Owner, Hermes, DeepSeek/OpenCode, Codex, or GitHub/App authority boundary.
No prompt asset may authorize Phase 1Q legacy implementation, AgentBridge authority, autonomous memory, external memory providers, Obsidian vault integration, or autonomous execution.
No prompt asset may treat MiniMax inspection, Revolut article, Compound Engineering, or Microsoft study modules as implementation authorization.
Every prompt asset must carry baseline, allowed files, forbidden files, gates, state gates, push/merge boundary, and canonicalization boundary.
Until merge, push, remote CI success, and Owner/GitHub App verification, any created prompt asset remains advisory only.

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

## DeepSeek Implementation Contract

After implementation, DeepSeek/OpenCode must return the following report:

- Verdict
- Branch
- Base commit
- Commit
- Files changed
- Prompt Asset Inventory result
- Prompt Asset Metadata result
- Allowed File Scope result
- Forbidden Implementation result
- No-Drift Rule result
- Validation Gates run
- Validation Gate results
- State Gate result
- Known untracked files
- Push status
- Merge status
- Canonicalization boundary
- Next safest step

Expected DeepSeek success verdict:

DEEPSEEK_PHASE_1P_Q_LOCAL_PROMPT_ASSET_CREATION_TASK_CONTRACT_COMMITTED_AMBER_NOT_CODEX_AUDITED

DeepSeek/OpenCode must not push or merge.

## Codex Audit Contract

After DeepSeek implementation, Codex must return the following audit report:

- Verdict
- Branch
- Base commit
- Implementation commit
- Commit count from main
- Files changed
- File scope audit result
- Prompt Asset Inventory audit result
- Prompt Asset Metadata audit result
- Forbidden Implementation audit result
- No-Drift audit result
- Overclaim scan result
- Validation gates run
- Validation gate results
- State result
- Known untracked files
- Push status
- Merge status
- Canonicalization boundary
- Next safest step

Expected Codex success verdict:

CODEX_PHASE_1P_Q_LOCAL_PROMPT_ASSET_CREATION_TASK_CONTRACT_AUDIT_PASS_READY_FOR_OWNER_FINALIZE_AUTHORIZATION

Codex must not push, merge, or declare canonical status.

## GitHub App Verification Contract

After finalization, GitHub/App verification must confirm:

- origin/main equals finalized commit
- remote CI run exists
- remote CI conclusion is success
- remote CI job validate-and-dry-run completed successfully
- generated-state cleanup completed successfully
- no PNPD state directories verified
- clean working tree verified

Final pushed-green verdict shape:

PHASE_1P_Q_LOCAL_PROMPT_ASSET_CREATION_TASK_CONTRACT_PUSHED_CI_GREEN

Only Owner/GitHub App verification may confirm the final pushed-green state.

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

The following forbidden drift checks must produce no output:

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
```

Expected forbidden drift result: no output.

## State Gates

The following state gates must pass before commit:

```bash
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks

find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
```

Expected state gate result: no output.

## Drift Risk Register

| Risk | Why It Matters | Mitigation | Blocking Verdict If Violated |
|------|---------------|------------|------------------------------|
| Prompt asset becomes autonomous agent | Lanes and role boundaries are weakened | Mandatory role boundary in every asset; assets are reusable scaffolds, not autonomous agents | BLOCKED_STATE_PROMPT |
| Prompt asset weakens role boundary | Owner, Hermes, DeepSeek, Codex, GitHub roles blurred | Enforce Owner=final, Hermes=design, DeepSeek=implement, Codex=audit, GitHub=verify | BLOCKED_STATE_PROMPT |
| Prompt asset omits canonical baseline | No baseline for drift detection | Mandatory canonical baseline field | BLOCKED_STATE_PROMPT |
| Prompt asset omits allowed/forbidden files | File scope is undefined | Mandatory allowed_files and forbidden_files fields | BLOCKED_STATE_PROMPT |
| Prompt asset omits state gates | Generated state may accumulate | Mandatory state_gates field | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes push or merge accidentally | Canonicalization boundary is bypassed | push_merge_authority: none in every asset | BLOCKED_STATE_PROMPT |
| Prompt asset treats research as implementation authority | Research inputs become implementation prompts | Memory and Research Source Boundary section; no prompt asset may treat research as authorization | BLOCKED_STATE_PROMPT |
| Prompt asset imports Compound Engineering directly | External reference becomes implementation directive | No prompt asset may treat external references as implementation authorization | BLOCKED_STATE_PROMPT |
| Prompt asset treats MiniMax inspection as PR authorization | Inspection result becomes automation trigger | No prompt asset may treat MiniMax inspection as PR authorization | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes skills directory creation | Scope creeps beyond docs-only | Forbidden Implementation section blocks skills directory creation | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes memory writes | Generated state leaks into memory/ | Forbidden Implementation section blocks memory writes | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes Obsidian integration | External integration without design | Forbidden Implementation section blocks Obsidian integration | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes external memory provider | External dependency without due diligence | Forbidden Implementation section blocks external memory provider | BLOCKED_STATE_PROMPT |
| Prompt asset authorizes AgentBridge | Unapproved authority escalation | Forbidden Implementation section blocks AgentBridge authority | BLOCKED_STATE_PROMPT |
| Prompt asset becomes Phase 1Q implementation by stealth | Scope creep via prompt asset name | No-Drift Rules explicitly block Phase 1Q legacy implementation | BLOCKED_STATE_PROMPT |
| Prompt asset claims canonical status before remote CI | Premature canonical status claim | Canonicalization boundary blocks canonical status until full chain completes | BLOCKED_STATE_PROMPT |

## Canonicalization Boundary

Phase 1P-Q becomes canonical only after:

1. Hermes design
2. Owner approval
3. DeepSeek/OpenCode implementation
4. Codex audit/finalize
5. fast-forward merge to main
6. push to origin
7. remote CI success
8. Owner/GitHub App verification

Until then, this document is advisory only.

## Next Safest Step

Recommended next safest step: Codex audit after DeepSeek/OpenCode implementation commit.
