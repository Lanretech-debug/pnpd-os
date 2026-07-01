# PNPD Local Prompt Assets P0 Scaffold Set

## Current Status

Status: docs-only P0 prompt asset scaffold set
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

Phase 1P-R creates the first governed P0 local prompt asset scaffold set. It defines reusable prompt scaffolds for the seven P0 assets identified in the Phase 1P-Q task contract. Each scaffold is a reusable task-contract scaffold, not an executable agent or runtime prompt loader. This implementation creates one consolidated docs-only scaffold file. It does not create individual files per asset.

## Canonical Baseline

Canonical repo: Lanretech-debug/pnpd-os
Active repo path: /home/lanretech_environment/Projects/pnpd-os
Active workstation: Windows WSL/Linux
Current canonical commit: 2a9c047f5a649940af001fff729c7aa9b9524d92
Current canonical verdict: PHASE_1P_Q_LOCAL_PROMPT_ASSET_CREATION_TASK_CONTRACT_PUSHED_CI_GREEN
Canonical status: PHASE_1P_Q_CANONICALIZED
Remote CI run: 28508260874
Remote CI conclusion: success
Remote main verification: main is identical to 2a9c047f5a649940af001fff729c7aa9b9524d92

## Governing Contract

Governing contract: docs/pnpd/local-prompt-asset-creation-task-contract-design.md
Phase 1P-Q governs Phase 1P-R.
Phase 1P-R must not weaken the Phase 1P-Q task contract.
Phase 1P-R creates reusable prompt asset scaffolds only.
Phase 1P-R does not create executable agents.
Phase 1P-R does not create runtime prompt loading.
Phase 1P-R does not create skills, plugins, memory records, generated runtime state, docs/solutions, or external integrations.

## Prior Phase Relationship

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the prompt asset layer.
1P-P defines the idea ordering layer.
1P-Q defines the local prompt asset creation task contract.
1P-R creates the first governed P0 local prompt asset scaffold set.

Phase 1P-M created the Unified Execution Plan and Taste Gate model.
Phase 1P-N created the Agent Session Kernel and Boot Protocol.
Phase 1P-O created the skills-local prompt assets and boot handoff design.
Phase 1P-P created the introspection research brief and deferred ideas ordering design.
Phase 1P-Q created the local prompt asset creation task contract design.
Phase 1P-R creates docs-only reusable prompt asset scaffolds.

## P0 Prompt Asset Set

The P0 prompt asset set includes exactly:

- BOOT_PROMPT
- DEEPSEEK_IMPLEMENTATION_PROMPT
- CODEX_AUDIT_PROMPT
- CODEX_FINALIZATION_PROMPT
- OWNER_DECISION_PROMPT
- BLOCKED_STATE_PROMPT
- RECONCILIATION_PROMPT

HERMES_DESIGN_PROMPT is a P1 future candidate and is not part of the Phase 1P-R P0 scaffold set.

No P1 or P2 prompt asset is created by Phase 1P-R.

## Shared Metadata Model

Every P0 prompt asset scaffold must carry the following mandatory metadata fields:

- name
- version
- phase
- asset_category
- canonical_status
- owner
- target_agent
- authorized_agents
- required_boot_dependency
- required_baseline_fields
- allowed_files
- forbidden_files
- allowed_operations
- forbidden_operations
- validation_gates
- forbidden_drift_checks
- state_gates
- push_merge_authority
- canonicalization_boundary
- versioning_rule
- drift_control_rule

These metadata fields are mandatory for every P0 prompt asset scaffold and must not be removed, weakened, or made optional.

Example YAML frontmatter:

```yaml
---
name: <ASSET_NAME>
version: 0.1.0
phase: 1P-R
asset_category: <ASSET_CATEGORY>
canonical_status: advisory_only
owner: Owner
target_agent: <TARGET_AGENT>
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
  - docs/pnpd/local-prompt-assets-p0-scaffold-set.md
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
```

## Shared No-Drift Rules

Prompt asset creation must not create skills, plugins, memory records, generated runtime state, or external integrations.
Prompt assets are reusable task-contract scaffolds, not autonomous agents.
Prompt assets do not grant authority beyond the Agent Session Kernel.
No prompt asset may weaken the Owner, Hermes, DeepSeek/OpenCode, Codex, or GitHub/App authority boundary.
No prompt asset may authorize Phase 1Q legacy implementation, AgentBridge authority, autonomous memory, external memory providers, Obsidian vault integration, or autonomous execution.
No prompt asset may treat MiniMax inspection, Revolut article, Compound Engineering, or Microsoft study modules as implementation authorization.
Every prompt asset must carry baseline, allowed files, forbidden files, gates, state gates, push/merge boundary, and canonicalization boundary.
Until merge, push, remote CI success, and Owner/GitHub App verification, any created prompt asset remains advisory only.
Phase 1P-R creates prompt asset scaffolds, not executable prompt assets.
Phase 1P-R does not authorize prompt runtime loading.

## BOOT_PROMPT Scaffold

BOOT_PROMPT initializes an agent session under the PNPD-OS Agent Session Kernel.
BOOT_PROMPT requires PNPD_AGENT_SESSION_BOOT_CONFIRMED before task execution.
BOOT_PROMPT must acknowledge canonical baseline, active machine, repo path, role boundary, allowed operations, forbidden operations, push/merge boundary, generated state boundary, and canonicalization boundary.
BOOT_PROMPT must return PNPD_AGENT_SESSION_BOOT_BLOCKED if baseline, branch, role, file scope, or authority boundary cannot be confirmed.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | BOOT_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | session_init |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | DeepSeek, OpenCode |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | PNPD_AGENT_SESSION_BOOT_CONFIRMED |
| allowed_files | docs/pnpd/local-prompt-assets-p0-scaffold-set.md |
| forbidden_files | .pnpd/**, scripts/**, templates/**, tests/fixtures/**, package.json, package-lock.json, npm-shrinkwrap.json, .github/workflows/**, README.md, memory/**, skills/**, plugins/**, docs/solutions/** |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_merge_push_ci_owner_github_app_verification |

### Purpose

Initialize an agent session with boot protocol, baseline verification, and preflight acknowledgement.

### Target Agent

DeepSeek/OpenCode at session start.

### Required Inputs

- Canonical baseline (repo, commit, verdict, CI run)
- Current branch name
- Role boundary definition
- Allowed and forbidden operations

### Allowed Operations

- Read canonical docs
- Verify baseline fields
- Acknowledge role boundary
- Report boot verdict

### Forbidden Operations

- Create files
- Modify files
- Run gates
- Commit
- Push
- Merge
- Claim canonical status

### Required Gates

- git status
- git rev-parse
- git rev-list

### Required State Gates

None (boot does not create state).

### Required Final Report Shape

- Verdict
- Agent role assumed
- Repo path acknowledged
- Canonical baseline acknowledged
- Current in-flight phase acknowledged
- Authority boundary acknowledged
- Push/merge boundary acknowledged
- Anti-drift rules acknowledged
- Ready/not ready for next PNPD-OS task

### Blocking Verdicts

- PNPD_AGENT_SESSION_BOOT_BLOCKED if baseline cannot be confirmed

### Scaffold Text

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

### Canonicalization Boundary

Advisory until merged, pushed, CI green, and Owner/GitHub App verified.

## DEEPSEEK_IMPLEMENTATION_PROMPT Scaffold

DEEPSEEK_IMPLEMENTATION_PROMPT instructs the implementation agent to implement only the Owner-approved file scope.
DEEPSEEK_IMPLEMENTATION_PROMPT must not authorize push, merge, canonical status, runtime behavior, generated state, or forbidden files.
DEEPSEEK_IMPLEMENTATION_PROMPT must require validation gates, forbidden drift checks, state gates, and final report.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | DEEPSEEK_IMPLEMENTATION_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | implementation |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | DeepSeek, OpenCode |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | BOOT_PROMPT |
| allowed_files | As defined by Owner-approved scope |
| forbidden_files | .pnpd/**, scripts/**, templates/**, tests/fixtures/**, package.json, package-lock.json, npm-shrinkwrap.json, .github/workflows/**, README.md, memory/**, skills/**, plugins/**, docs/solutions/** |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_merge_push_ci_owner_github_app_verification |

### Purpose

Instruct implementation agent to create exactly one docs-only file within strict scope.

### Target Agent

DeepSeek/OpenCode.

### Required Inputs

- BOOT_PROMPT verdict
- Canonical baseline
- Allowed files
- Forbidden files
- Validation gates
- State gates

### Allowed Operations

- Create exactly one allowed file
- Run validation gates
- Run state gates
- Commit

### Forbidden Operations

- Create unauthorized files
- Modify forbidden paths
- Push
- Merge
- Claim canonical status

### Required Gates

- git diff --name-only
- Forbidden drift checks
- Validation gates
- State gates

### Required State Gates

No generated runtime state.

### Required Final Report Shape

- Verdict
- Branch
- Base commit
- Commit
- Files changed
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

### Blocking Verdicts

- BLOCKED_STATE_PROMPT if file scope, gates, or state gates fail

### Scaffold Text

```
You are DeepSeek/OpenCode operating under the PNPD-OS Agent Session Kernel.

Your boot verdict must already be: PNPD_AGENT_SESSION_BOOT_CONFIRMED

This is a dedicated implementation prompt.

Phase: <PHASE_NAME>
Branch: <BRANCH_NAME>
Base commit: <BASE_COMMIT>

Do not broaden scope.
Do not redesign.
Do not rewrite sections.
Do not edit any file except the allowed file.
Do not create files outside the allowed set.
Do not push.
Do not merge.
Do not claim canonical status.

Allowed file: <ALLOWED_FILES>
Forbidden files: <FORBIDDEN_FILES>

After creating the file, run:
1. git diff --name-only
2. Forbidden drift checks
3. Validation gates
4. State gates

Return the implementation report with:
- Verdict
- Branch
- Base commit
- Commit
- Files changed
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

Expected success verdict: <EXPECTED_VERDICT>
```

### Canonicalization Boundary

Advisory until Codex audit, merge, push, CI success, and Owner/GitHub App verification.

## CODEX_AUDIT_PROMPT Scaffold

CODEX_AUDIT_PROMPT instructs Codex to audit only the implementation commit and not patch.
CODEX_AUDIT_PROMPT must verify file scope, content requirements, forbidden implementation, overclaim scan, validation gates, state gates, and final cleanliness.
CODEX_AUDIT_PROMPT must not authorize push, merge, or canonical status.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | CODEX_AUDIT_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | audit |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | Codex |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | DEEPSEEK_IMPLEMENTATION_PROMPT completion |
| allowed_files | Read-only access to all docs |
| forbidden_files | No write target |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_merge_push_ci_owner_github_app_verification |

### Purpose

Verify implementation stayed inside the narrow contract.

### Target Agent

Codex.

### Required Inputs

- Implementation commit hash
- Allowed files
- Forbidden files
- Gates definition

### Allowed Operations

- Read files
- Run gates
- Report audit verdict

### Forbidden Operations

- Create files
- Modify files
- Commit
- Push
- Merge
- Claim canonical status

### Required Gates

- git diff --name-only
- Forbidden drift checks
- Validation gates
- State gates

### Required State Gates

No generated runtime state.

### Required Final Report Shape

- Verdict
- Branch
- Base commit
- Implementation commit
- Commit count from main
- Files changed
- File scope audit result
- Content audit result
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

### Blocking Verdicts

- BLOCKED_STATE_PROMPT if audit fails

### Scaffold Text

```
You are Codex operating under the PNPD-OS Agent Session Kernel.

Your boot verdict must already be: PNPD_AGENT_SESSION_BOOT_CONFIRMED

This is a dedicated audit prompt.

Phase: <PHASE_NAME>
Branch: <BRANCH_NAME>
Base commit: <BASE_COMMIT>
Implementation commit: <IMPLEMENTATION_COMMIT>

Audit scope: verify only the implementation commit. Do not patch.

Verify:
1. File scope: only allowed files changed
2. Content: all required sections present
3. Forbidden implementation: no unauthorized files
4. No-Drift rules: preserved
5. Overclaim scan: no unauthorized authority claims
6. Validation gates: pass
7. State gates: no generated state

Do not push.
Do not merge.
Do not declare canonical status.

Return the audit report with:
- Verdict
- Branch
- Base commit
- Implementation commit
- Commit count from main
- Files changed
- File scope audit result
- Content audit result
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

Expected success verdict: <EXPECTED_AUDIT_VERDICT>
```

### Canonicalization Boundary

Advisory until Owner authorizes finalization.

## CODEX_FINALIZATION_PROMPT Scaffold

CODEX_FINALIZATION_PROMPT authorizes only final preflight verification, fast-forward merge to local main, post-merge gates, push to origin/main, and finalization report after Owner authorization.
CODEX_FINALIZATION_PROMPT must require fast-forward only and must block non-fast-forward merges.
CODEX_FINALIZATION_PROMPT must not claim canonical status before remote CI success and Owner/GitHub App verification.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | CODEX_FINALIZATION_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | finalization |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | Codex |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | CODEX_AUDIT_PROMPT pass, Owner finalization authorization |
| allowed_files | Read-only access |
| forbidden_files | No write target |
| push_merge_authority | fast-forward merge only, push only after Owner authorization |
| canonicalization_boundary | advisory_only_until_merge_push_ci_owner_github_app_verification |

### Purpose

Prepare finalization after audit pass and Owner authorization.

### Target Agent

Codex.

### Required Inputs

- Audit verdict
- Owner finalization authorization
- Branch state

### Allowed Operations

- Verify preflight gates
- Fast-forward merge to main
- Run post-merge gates
- Push to origin/main
- Report finalization report

### Forbidden Operations

- Non-fast-forward merge
- Claim canonical status
- Create files
- Merge without Owner authorization

### Required Gates

- git diff --check
- Validation gates
- State gates

### Required State Gates

No generated runtime state.

### Required Final Report Shape

- Verdict
- Source branch
- Base commit
- Finalized commit
- Files changed
- Preflight result
- Forbidden drift result
- Pre-merge gates run
- Pre-merge gate results
- Pre-merge state result
- Fast-forward merge result
- Post-merge verification result
- Post-merge gates run
- Post-merge gate results
- Post-merge state result
- Push result
- main HEAD
- origin/main HEAD
- Known untracked files
- Canonicalization boundary
- Next safest step

### Blocking Verdicts

- BLOCKED_STATE_PROMPT if preflight, gates, state, or merge type fails

### Scaffold Text

```
You are Codex operating under the PNPD-OS Agent Session Kernel.

Owner has authorized finalization of Phase <PHASE_NAME>.

Source branch: <BRANCH_NAME>
Base commit: <BASE_COMMIT>
Audit verdict: <AUDIT_VERDICT>

Preflight:
1. git diff --check
2. Validation gates
3. State gates
4. Forbidden drift checks

Merge: fast-forward only to local main.
Block non-fast-forward merges.

Post-merge:
1. Verify main HEAD matches finalized commit
2. Run validation gates
3. Run state gates

Push: push origin/main only after post-merge gates pass.

Do not claim canonical status before remote CI success and Owner/GitHub App verification.

Return the finalization report with:
- Verdict
- Source branch
- Base commit
- Finalized commit
- Files changed
- Preflight result
- Forbidden drift result
- Pre-merge gates run
- Pre-merge gate results
- Pre-merge state result
- Fast-forward merge result
- Post-merge verification result
- Post-merge gates run
- Post-merge gate results
- Post-merge state result
- Push result
- main HEAD
- origin/main HEAD
- Known untracked files
- Canonicalization boundary
- Next safest step
```

### Canonicalization Boundary

Advisory until remote CI success and Owner/GitHub App verification.

## OWNER_DECISION_PROMPT Scaffold

OWNER_DECISION_PROMPT surfaces verified state to the Owner for approve, request changes, or block.
OWNER_DECISION_PROMPT grants no execution authority to any agent.
OWNER_DECISION_PROMPT must preserve Owner as final authority.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | OWNER_DECISION_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | decision |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | Hermes (prepares), Owner (decides) |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | CODEX_AUDIT_PROMPT pass |
| allowed_files | Read-only |
| forbidden_files | No write target |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_owner_decision_rendered |

### Purpose

Surface verified state to Owner for approve, request changes, or block.

### Target Agent

Hermes (prepares), Owner (decides).

### Required Inputs

- Audit verdict
- Implementation report
- Gate results

### Allowed Operations

- Prepare decision summary
- Present options

### Forbidden Operations

- Make final decision
- Override Owner
- Self-certify

### Required Gates

None (decision gate is Owner review).

### Required State Gates

None.

### Required Final Report Shape

- Decision
- Accepted evidence
- Rejected evidence
- Approved next step
- Blocked scope
- Required follow-up
- Canonicalization boundary

### Blocking Verdicts

N/A (Owner decision is final).

### Scaffold Text

```
Subject: Owner decision required for Phase <PHASE_NAME>

Branch: <BRANCH_NAME>
Implementation commit: <IMPLEMENTATION_COMMIT>
Audit verdict: <AUDIT_VERDICT>

Implementation summary:
- Files changed: <FILES_CHANGED>
- Validation gates: <GATE_RESULTS>
- State result: <STATE_RESULT>

Decision options:
1. Approve — authorize finalization
2. Request changes — specify required changes
3. Block — provide blocking reason

Owner decision: <DECISION>
Accepted evidence: <ACCEPTED_EVIDENCE>
Rejected evidence: <REJECTED_EVIDENCE>
Approved next step: <APPROVED_NEXT_STEP>
Blocked scope: <BLOCKED_SCOPE>
Required follow-up: <REQUIRED_FOLLOW_UP>
Canonicalization boundary: <CANONICALIZATION_BOUNDARY>
```

### Canonicalization Boundary

Advisory until Owner decision rendered.

## BLOCKED_STATE_PROMPT Scaffold

BLOCKED_STATE_PROMPT defines the required halt-and-report shape when a contract cannot be satisfied.
BLOCKED_STATE_PROMPT must stop implementation, audit, finalization, or verification when required baseline, file scope, gates, state gates, or authority boundaries fail.
BLOCKED_STATE_PROMPT must not recommend bypassing gates.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | BLOCKED_STATE_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | halt |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | DeepSeek, OpenCode, Codex |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | Any phase |
| allowed_files | Read-only |
| forbidden_files | No write target |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_owner_decision_on_block |

### Purpose

Define required halt-and-report shape when contract cannot be satisfied.

### Target Agent

DeepSeek, OpenCode, Codex.

### Required Inputs

- Current branch
- HEAD
- Blocking reason
- Expected and actual values

### Allowed Operations

- Report block
- Document reason
- Recommend next step

### Forbidden Operations

- Proceed with blocked contract
- Work around block
- Ignore blocking condition

### Required Gates

None (halt state, no gates run).

### Required State Gates

None.

### Required Final Report Shape

- Verdict
- Blocked phase
- Blocked role
- Blocking condition
- Expected value
- Actual value
- Files touched
- Generated state result
- Push status
- Merge status
- Canonicalization boundary
- Next safest step

### Blocking Verdicts

BLOCKED_STATE_PROMPT (self).

### Scaffold Text

```
BLOCKED_STATE_PROMPT — Cannot Proceed

Phase: <PHASE_NAME>
Role: <ROLE>
Branch: <BRANCH_NAME>
HEAD: <HEAD>

Blocking condition: <BLOCKING_CONDITION>
Expected value: <EXPECTED_VALUE>
Actual value: <ACTUAL_VALUE>

Files touched: <FILES_TOUCHED>
Generated state result: <GENERATED_STATE_RESULT>

This contract cannot proceed until the blocking condition is resolved.
Do not bypass gates.
Do not push.
Do not merge.

Return:
- Verdict: BLOCKED_STATE_PROMPT
- Blocked phase
- Blocked role
- Blocking condition
- Expected value
- Actual value
- Files touched
- Generated state result
- Push status
- Merge status
- Canonicalization boundary
- Next safest step
```

### Canonicalization Boundary

Advisory until Owner decision on block.

## RECONCILIATION_PROMPT Scaffold

RECONCILIATION_PROMPT reconciles divergence between implementation reports, audit results, branch state, and Owner decisions.
RECONCILIATION_PROMPT is advisory only and cannot approve, merge, push, or canonicalize.
RECONCILIATION_PROMPT must classify discrepancies as blocking, patch-required, audit-required, finalization-required, or verification-required.

### Asset Metadata

| Field | Value |
|-------|-------|
| name | RECONCILIATION_PROMPT |
| version | 0.1.0 |
| phase | 1P-R |
| asset_category | reconciliation |
| canonical_status | advisory_only |
| owner | Owner |
| target_agent | DeepSeek, OpenCode, Codex |
| authorized_agents | Hermes, DeepSeek, OpenCode, Codex, GitHub_App, Owner |
| required_boot_dependency | Owner change request or detected divergence |
| allowed_files | Read-only |
| forbidden_files | No write target |
| push_merge_authority | none |
| canonicalization_boundary | advisory_only_until_owner_approves_reconciliation |

### Purpose

Reconcile divergence between reports, audit results, branch state, and Owner decisions.

### Target Agent

DeepSeek, OpenCode, Codex.

### Required Inputs

- Implementation report
- Audit report
- Branch state
- Owner decision

### Allowed Operations

- Compare reports
- Identify divergence
- Propose resolution

### Forbidden Operations

- Ignore divergence
- Override Owner decision
- Self-certify reconciliation

### Required Gates

- git diff --name-only
- git diff --check
- Validation gates

### Required State Gates

No generated runtime state.

### Required Final Report Shape

- Verdict
- Inputs compared
- Canonical baseline
- Reported state
- Verified state
- Discrepancy table
- Risk classification
- Required correction
- Forbidden next steps
- Recommended next safest step
- Canonicalization boundary

### Blocking Verdicts

- BLOCKED_STATE_PROMPT if reconciliation cannot be completed

### Scaffold Text

```
RECONCILIATION_PROMPT — Divergence Detected

Phase: <PHASE_NAME>
Branch: <BRANCH_NAME>
Base commit: <BASE_COMMIT>

Inputs compared:
- Implementation report
- Audit report
- Branch state
- Owner decision

Canonical baseline:
  Repo: <CANONICAL_REPO>
  Commit: <CURRENT_CANONICAL_COMMIT>
  Verdict: <CURRENT_CANONICAL_VERDICT>

Reported state: <REPORTED_STATE>
Verified state: <VERIFIED_STATE>

Discrepancies:
| Field | Reported | Verified | Classification |
|-------|----------|----------|----------------|
| ... | ... | ... | ... |

Risk classification:
- blocking
- patch-required
- audit-required
- finalization-required
- verification-required

Required correction: <REQUIRED_CORRECTION>
Forbidden next steps: <FORBIDDEN_NEXT_STEPS>
Recommended next safest step: <RECOMMENDED_NEXT_SAFEST_STEP>

This report is advisory only. It cannot approve, merge, push, or canonicalize.
```

### Canonicalization Boundary

Advisory until Owner approves reconciliation.

## Allowed Use

Allowed use: copy a scaffold into a future Owner-approved PNPD task contract.
Allowed use: fill placeholders only after the Owner defines the phase, branch, baseline, allowed files, forbidden files, gates, state gates, push/merge boundary, and canonicalization boundary.
Allowed use: use scaffolds to reduce prompt drift and preserve PNPD-OS role boundaries.

Placeholder values must be resolved by the Owner-approved task contract before any scaffold becomes an executable prompt.

Recognized scaffold placeholders:
- <PHASE_NAME>
- <BRANCH_NAME>
- <BASE_COMMIT>
- <CURRENT_CANONICAL_COMMIT>
- <CURRENT_CANONICAL_VERDICT>
- <REMOTE_CI_RUN>
- <ALLOWED_FILES>
- <FORBIDDEN_FILES>
- <EXPECTED_HEAD>
- <IMPLEMENTATION_COMMIT>
- <FINALIZED_COMMIT>
- <CI_RUN_ID>

## Forbidden Use

Phase 1P-R does not authorize:

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

Forbidden use: treating any scaffold as executable without an Owner-approved task contract.
Forbidden use: treating any scaffold as runtime memory, runtime configuration, or autonomous agent behavior.
Forbidden use: using placeholders as live values.

## Role Boundary

Owner = exclusive final authorization, merge authorization, and verification authorization.
Hermes = design and advisory lane only.
DeepSeek/OpenCode = implementation lane only within Owner-approved scope.
Codex = audit and finalization lane only.
GitHub/App = remote CI, merge, push, and evidence verification.
AgentBridge = no authority unless explicitly designed and canonically approved later.

No agent may grant itself additional authority through a prompt asset scaffold.
No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

## Storage Boundary

All P0 prompt asset scaffold content must live under docs/pnpd/.
The only allowed implementation file is docs/pnpd/local-prompt-assets-p0-scaffold-set.md.
No other write targets are allowed during Phase 1P-R implementation.

No prompt asset scaffold may reference, create, or depend on skills/, plugins/, memory/, docs/solutions/, .pnpd/ runtime paths, tests/fixtures, scripts, templates, .github/workflows, lockfiles, or package.json except as forbidden paths.

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
git diff -- docs/solutions
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
| Scaffold becomes executable prompt without Owner task contract | Bypasses Owner approval | Allowed Use section requires Owner-approved contract | BLOCKED_STATE_PROMPT |
| Scaffold becomes autonomous agent | Lanes and role boundaries are weakened | Scaffolds are reusable task-contract scaffolds, not autonomous agents | BLOCKED_STATE_PROMPT |
| Scaffold weakens role boundary | Owner, Hermes, DeepSeek, Codex, GitHub roles blurred | Role Boundary section enforces strict role separation | BLOCKED_STATE_PROMPT |
| Scaffold omits canonical baseline | No baseline for drift detection | Shared Metadata Model requires canonical baseline fields | BLOCKED_STATE_PROMPT |
| Scaffold omits allowed/forbidden files | File scope is undefined | Shared Metadata Model requires allowed_files and forbidden_files | BLOCKED_STATE_PROMPT |
| Scaffold omits state gates | Generated state may accumulate | Shared Metadata Model requires state_gates | BLOCKED_STATE_PROMPT |
| Scaffold authorizes push or merge accidentally | Canonicalization boundary is bypassed | push_merge_authority: none in every scaffold | BLOCKED_STATE_PROMPT |
| Scaffold treats research as implementation authority | Research inputs become implementation prompts | Memory And Research Source Boundary section blocks this | BLOCKED_STATE_PROMPT |
| Scaffold imports Compound Engineering directly | External reference becomes implementation directive | Shared No-Drift Rules block external references as authorization | BLOCKED_STATE_PROMPT |
| Scaffold treats MiniMax inspection as PR authorization | Inspection result becomes automation trigger | Shared No-Drift Rules block MiniMax as authorization | BLOCKED_STATE_PROMPT |
| Scaffold authorizes skills directory creation | Scope creeps beyond docs-only | Forbidden Use section blocks skills directory | BLOCKED_STATE_PROMPT |
| Scaffold authorizes memory writes | Generated state leaks into memory/ | Forbidden Use section blocks memory writes | BLOCKED_STATE_PROMPT |
| Scaffold authorizes Obsidian integration | External integration without design | Forbidden Use section blocks Obsidian integration | BLOCKED_STATE_PROMPT |
| Scaffold authorizes external memory provider | External dependency without due diligence | Forbidden Use section blocks external memory provider | BLOCKED_STATE_PROMPT |
| Scaffold authorizes AgentBridge | Unapproved authority escalation | Forbidden Use section blocks AgentBridge authority | BLOCKED_STATE_PROMPT |
| Scaffold becomes Phase 1Q legacy implementation by stealth | Scope creep via scaffold use | Shared No-Drift Rules explicitly block Phase 1Q legacy implementation | BLOCKED_STATE_PROMPT |
| Scaffold claims canonical status before remote CI | Premature canonical status claim | Canonicalization boundary blocks canonical status until full chain completes | BLOCKED_STATE_PROMPT |
| Placeholder values treated as live values | Unresolved placeholders become implicit authorizations | Placeholder resolution requires Owner-approved task contract | BLOCKED_STATE_PROMPT |

## Future Implementation Boundary

Future use of these scaffolds requires a separate Owner-approved PNPD task contract.
Future promotion of P1 assets requires separate Hermes design and Owner approval.
Future creation of actual prompt asset files outside this consolidated scaffold set is not authorized by Phase 1P-R.
Future movement into skills/, plugins/, memory/, docs/solutions/, or runtime loading remains blocked.

## Canonicalization Boundary

Phase 1P-R becomes canonical only after:

1. Hermes design or governing Phase 1P-Q contract
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
