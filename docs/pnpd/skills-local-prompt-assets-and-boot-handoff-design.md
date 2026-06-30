# PNPD Skills-Local Prompt Assets And Boot Handoff Design

## Current Status

Status: docs-only governance design
Canonical status: advisory until Codex audit, merge, push, CI success, and Owner/GitHub verification
Runtime authority: none
Schema authority: none
Validator authority: none
CI authority: none
Generated state authority: none
AgentBridge authority: none

## Purpose

Phase 1P-O designs the reusable local prompt asset layer that carries the Agent Session Kernel into agent sessions consistently. It defines the boot handoff sequence, task contract inheritance rules, prompt drift prevention controls, and role-specific prompt assets. This phase creates a docs-only design for the local prompt asset layer that enables consistent agent session startup, boot confirmation, and task contract acceptance across all PNPD-OS agents.

Key concepts:
- reusable local prompt asset layer
- Agent Session Kernel
- boot handoff
- task contract inheritance
- prompt drift prevention
- role-specific prompt assets
- docs-only design

## Baseline

Base commit: 3a10ddfd4be4be0c636788da9160512b527e312d
origin/main: 3a10ddfd4be4be0c636788da9160512b527e312d
Remote CI run: 28426257073
Remote CI conclusion: success
Windows is the active PNPD-OS workstation
Mac PNPD-OS is fallback/read-only unless Owner explicitly authorizes Mac PNPD-OS work
JobToCash remains active on Mac

## Problem Statement

Without a standardized local prompt asset layer, each agent session must reconstruct the operating frame from scratch. This leads to inconsistent boot behavior, missing baseline fields, incorrect authority assumptions, and prompt drift across sessions. A reusable prompt asset layer is needed to carry the Agent Session Kernel (defined in Phase 1P-N) into every agent session with consistent boot handoff, task contract inheritance, and drift prevention.

## Prompt Asset Layer Model

The Prompt Asset Layer (PROMPT_ASSET_LAYER) defines the structure and governance rules for reusable prompt assets that carry the Agent Session Kernel into agent sessions. Each prompt asset is a reusable template that includes:

purpose
asset_category
owning_phase
target_agent
required_boot_dependency
required_baseline_fields
required_role_boundary
required_allowed_operations
required_forbidden_operations
required_gates
required_state_gates
required_final_report_shape
canonicalization_boundary
versioning_rule
drift_control_rule

Governance rules:

Each asset version is tied to a canonical baseline commit
No asset may omit required baseline fields
No asset may expand scope
No asset may imply authority not granted by the kernel

## Prompt Asset Categories

Eight prompt asset categories are defined:

### BOOT_PROMPT

purpose: Initialize agent session and request boot confirmation
intended user: Owner
target agent: Any PNPD-OS agent
when used: At the start of every agent session before any task execution
required inputs: current canonical commit, current in-flight phase, agent role, baseline fields
forbidden use: Task execution, scope expansion, authority claims, push/merge operations
expected output: PNPD_AGENT_SESSION_BOOT_CONFIRMED or PNPD_AGENT_SESSION_BOOT_BLOCKED

### HERMES_DESIGN_PROMPT

purpose: Request Hermes design work for a new phase or capability
intended user: Owner
target agent: Hermes
when used: When a new design phase is needed
required inputs: problem statement, priority rationale, baseline, forbidden implementation boundaries
forbidden use: Implementation, commit, push, merge, claiming completion
expected output: Design document with baseline, priority rationale, problem statement, allowed future file, forbidden implementation, drift risks, gates, canonicalization boundary, next safest step

### DEEPSEEK_IMPLEMENTATION_PROMPT

purpose: Request DeepSeek/OpenCode implementation of an approved design
intended user: Owner
target agent: DeepSeek/OpenCode
when used: After Hermes design and Owner approval
required inputs: approved design, baseline, branch, allowed files, forbidden files, allowed operations, forbidden operations, gates, state gates, push/merge permission, canonicalization boundary, expected final report
forbidden use: Scope expansion, repeated patching without fresh Owner approval, push, merge, force push, claiming canonical status
expected output: Implementation commit, gate results, state results, full 40-character SHA

### CODEX_AUDIT_PROMPT

purpose: Request Codex audit of a specific implementation commit
intended user: Owner
target agent: Codex
when used: After implementation commit is created
required inputs: target commit SHA, branch, expected file scope, required content phrases, forbidden drift boundaries
forbidden use: Modifying files, push, merge, claiming canonical status
expected output: Audit verdict with pass/fail, verification of branch/HEAD/merge-base/commit count, changed files, drift check, required content check, gate results, state results

### CODEX_FINALIZATION_PROMPT

purpose: Request Codex finalization after green audit
intended user: Owner
target agent: Codex
when used: After green Codex audit, when Owner authorizes finalization
required inputs: Owner finalization authorization, green Codex audit, clean local gates, clean state gates, fast-forward merge eligibility, remote CI verification
forbidden use: Pushing or merging during audit-only prompts, finalization without Owner authorization
expected output: Fast-forward merge to main, push to origin, verification of remote CI

Codex may push and merge only after explicit Owner finalization authorization, green Codex audit, clean local gates, clean state gates, fast-forward merge eligibility, and remote CI verification requirements are satisfied.
Codex must not push or merge during audit-only prompts.

### RECONCILIATION_PROMPT

purpose: Request reconciliation of audit-target, HEAD, branch, merge-base, or baseline discrepancies
intended user: Owner
target agent: Codex, with support from Hermes and DeepSeek/OpenCode
when used: When any agent reports a discrepancy that prevents audit, implementation, or finalization
required inputs: discrepancy description, current state, expected state, affected fields
forbidden use: Silently accepting discrepancies, proceeding without Owner awareness
expected output: Reconciliation evidence, corrected state, re-verification

Codex is the primary reconciliation agent for audit-target, HEAD, branch, merge-base, local main versus origin/main, remote CI, and finalization-state discrepancies.
Hermes may design reconciliation plans. DeepSeek/OpenCode may implement Owner-approved reconciliation patches. Codex audits and verifies reconciliation evidence.

### BLOCKED_STATE_PROMPT

purpose: Report blocked state when an agent cannot proceed
intended user: Agent
target agent: Owner
when used: When an agent encounters a stop condition and cannot proceed
required inputs: blocked verdict, blocked reason, current state, expected state
forbidden use: Continuing execution while blocked
expected output: Blocked verdict, drift description, next safest step

### OWNER_DECISION_PROMPT

purpose: Request Owner decision on a blocked state, taste-sensitive decision, or scope question
intended user: Agent
target agent: Owner
when used: When an agent needs Owner input to proceed
required inputs: question, options, recommendation, impact analysis
forbidden use: Self-certifying taste, proceeding without Owner decision
expected output: Owner decision with explicit instruction

## Role-Specific Boot Assets

Each PNPD-OS agent role has a defined boot asset that carries the Agent Session Kernel into the agent session.

### Hermes Boot Asset

role authority: Hermes = design
role limits: Design only. Cannot implement, commit, push, merge, claim completion of implementation, self-certify taste, or treat advisory docs as runtime authority.
allowed operations: research, design, recommend, write design documents, propose architecture, identify risks, surface drift risks, recommend next safest step
forbidden operations: implement, commit, push, merge, claim completion of implementation, self-certify taste, treat advisory docs as runtime authority
required preflight checks: current baseline, problem statement, design scope, forbidden implementation boundaries
stop conditions: scope expands beyond design brief, runtime/schema/validator/CI work requested without explicit Owner approval
required report fields: design document with baseline, priority rationale, problem statement, allowed future file, forbidden implementation, drift risks, gates, canonicalization boundary, next safest step

### DeepSeek/OpenCode Boot Asset

role authority: DeepSeek/OpenCode = implementation
role limits: Implementation only within Owner-approved scope. Cannot decide new scope, patch repeatedly without fresh Owner approval, push, merge, force push, rewrite public history, delete branches, claim canonical status, treat lab as canonical, self-promote authority.
allowed operations: implement from approved design, edit files within explicitly allowed scope, run gates, report full 40-character commit SHAs
forbidden operations: decide new scope, patch repeatedly without fresh Owner approval, push, merge, force push, rewrite public history, delete branches, claim canonical status, treat lab as canonical, self-promote authority
required preflight checks: current branch, current HEAD, expected commit SHA, merge-base, commit count from main, local main versus origin/main, working tree cleanliness, allowed file list
stop conditions: baseline moved, branch wrong, HEAD unexpected, working tree dirty unexpectedly, untracked files appear, generated runtime state appears, file scope expands, allowed file list insufficient, implementation requires new file type, new dependency required, lockfile policy changes, validation gate fails, state gate fails, taste-sensitive decision appears without Owner approval, AgentBridge authority appears, runtime/schema/validator/CI work appears without explicit approval, deployment/readiness/certification claim appears, old Mac/local branch state conflicts with Windows baseline, stale audit result reused against newer commit, local main/origin main mismatch not explicitly acknowledged
required report fields: verdict, branch, base commit, commit, files changed, gate results, state result, push status, merge status, canonicalization boundary, next safest step

### Codex Boot Asset

role authority: Codex = audit/finalization
role limits: Audit and finalization only. Cannot modify files, claim canonical status without Owner verification, self-certify deployment readiness, push or merge during audit-only prompts.
allowed operations: audit the exact requested commit, verify branch, HEAD, merge-base, commit count from main, changed files, forbidden drift, required content, gates, state gates, clean working tree; push and merge only after explicit Owner finalization authorization, green Codex audit, clean local gates, clean state gates, fast-forward merge eligibility, and remote CI verification requirements are satisfied
forbidden operations: reuse stale audit results for older commits, audit a commit that is not current HEAD, claim canonical status without Owner verification, self-certify deployment readiness, modify files, push or merge during audit-only prompts
required preflight checks: current branch, current HEAD matches the requested commit, merge-base, commit count from main, changed files, forbidden drift, required content, gates, state gates, clean working tree
stop conditions: HEAD does not match the requested commit, stale audit result detected, working tree is dirty, forbidden files changed, required content missing, gates failed
required report fields: audit verdict with pass/fail, verification of branch/HEAD/merge-base/commit count, changed files, drift check, required content check, gate results, state results

### GitHub/App Boot Asset

role authority: GitHub/App = remote evidence verification
role limits: Remote evidence verification only. Cannot approve implementation, design, audit, claim canonical status, modify repository content.
allowed operations: verify remote CI status, verify remote commit SHA, verify remote branch state, provide remote evidence of CI run and conclusion
forbidden operations: approve implementation, design, audit, claim canonical status, modify repository content
required preflight checks: remote CI run ID, remote CI conclusion, remote commit SHA matches local
stop conditions: remote evidence is incomplete, CI run ID does not match, remote and local SHAs diverge
required report fields: remote CI run, remote CI conclusion, remote commit SHA

### Owner Boot Asset

role authority: Owner = final authority
role limits: Final authority. Cannot delegate final authority, bypass gates without explicit override, self-certify implementation completion without verification.
allowed operations: approve designs, authorize implementation, grant push/merge permission, designate taste authority, decide canonical status, change scope, override gates with explicit instruction
forbidden operations: delegate final authority, bypass gates without explicit override, self-certify implementation completion without verification
required preflight checks: current commit SHA, branch, working tree state, gate results, audit results
stop conditions: evidence is incomplete, drift is unreconciled, verification chain is broken
required report fields: Owner verdict on canonical status and next phase priority

## Boot Handoff Model

The boot handoff sequence defines how an agent session is initialized and how the task contract is accepted. The sequence is:

1. Owner provides BOOT_PROMPT asset to agent.
2. Agent loads Agent Session Kernel.
3. Agent returns PNPD_AGENT_SESSION_BOOT_CONFIRMED or PNPD_AGENT_SESSION_BOOT_BLOCKED.
4. If confirmed, Owner sends task-specific prompt.
5. Agent verifies task contract completeness through the Task Intake Gate.
6. If contract complete, agent returns PNPD_TASK_CONTRACT_ACCEPTED and executes.
7. If contract incomplete, agent returns PNPD_TASK_CONTRACT_BLOCKED_INCOMPLETE and stops.

The four boot and task verdicts are:

PNPD_AGENT_SESSION_BOOT_CONFIRMED
PNPD_AGENT_SESSION_BOOT_BLOCKED
PNPD_TASK_CONTRACT_ACCEPTED
PNPD_TASK_CONTRACT_BLOCKED_INCOMPLETE

## Task Contract Inheritance

Every task-specific prompt inherits the following fields from the Agent Session Kernel and boot asset:

- active machine
- repo path
- canonical repo
- private lab mirror
- current canonical commit
- current canonical verdict
- current in-flight phase
- target branch
- role authority
- allowed files
- forbidden files
- gates
- state gates
- push/merge permission
- expected final report shape
- canonicalization boundary

Task prompts must not omit or contradict inherited kernel fields.

## Prompt Drift Prevention

The following controls prevent prompt drift:

- Full 40-character SHA required
- No latest branch tip language
- No vague file scope
- No implied push/merge permission
- No implied authority expansion
- No external memory provider by default
- No task execution before boot confirmation
- No audit unless requested commit equals current HEAD
- No finalization unless Codex audit is green
- No canonical status without remote CI success and Owner/GitHub App verification
- No taste-sensitive self-certification
- TASTE_REQUIRED label mandatory

## Local Asset Storage Boundary

The current phase creates one file only:

docs/pnpd/skills-local-prompt-assets-and-boot-handoff-design.md

This phase does not create actual prompt asset files.
This phase does not create a skills directory.
This phase does not create a plugins directory.

Actual prompt asset creation is future work and must be separately approved by the Owner through the standard Hermes design, Owner approval, DeepSeek/OpenCode implementation, and Codex audit/finalize pipeline.

## Future Asset File Shape

Actual prompt asset files, when separately approved, should include these metadata fields:

- id
- title
- category
- target_agent
- required_boot_verdict
- canonical_baseline_required
- allowed_operations
- forbidden_operations
- required_inputs
- expected_outputs
- gates
- state_gates
- blocked_verdicts
- canonicalization_boundary

This is a design recommendation only. No schema implementation is authorized in this phase.

## Memory Provider Boundary

Approved memory provider: BUILTIN
Unverified memory providers: HINDSIGHT, HONSHO, HONCHO

Agents must not use HINDSIGHT, HONSHO, HONCHO, or any external memory provider unless Owner explicitly approves after pricing, privacy, storage, API-key, deletion, and export requirements are verified.

The local prompt asset system may reference session-prompt memory, repo files, and explicit Owner-provided context only.

The local prompt asset system must not require external memory.

## Relationship To Prior Phases

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the reusable prompt asset layer.

Phase 1P-M created the Unified Execution Plan and Taste Gate model.
Phase 1P-N created the Agent Session Kernel and Boot Protocol.
Phase 1P-O designs the reusable local prompt asset layer that carries the kernel into agent sessions consistently.

## Authority Boundary

Owner = final authority
Hermes = design
DeepSeek/OpenCode = implementation
Codex = audit/finalization
GitHub/App = remote evidence verification
AgentBridge = no authority unless explicitly designed and canonically approved later

No agent may self-promote authority.
No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

## Forbidden Implementation

Phase 1P-O does not authorize:

- runtime implementation
- schema changes
- validator additions
- fixture additions
- CI enforcement
- registry writes
- generated state
- actual prompt asset creation
- skills directory creation
- plugins directory creation
- plugin manifest
- AgentBridge authority
- memory-provider integration
- external memory storage
- package changes
- lockfile changes
- dependency installation policy changes
- deployment
- dispatch
- certification
- production readiness claim
- adoption readiness claim
- roadmap commitment claim

## Drift Risk Register

| Risk | Description | Mitigation |
|------|-------------|------------|
| Agent skips boot | Agent begins task execution without boot confirmation | Boot confirmation required before every task prompt |
| Prompt asset omits baseline fields | Asset lacks required canonical baseline fields | Each asset version is tied to a canonical baseline commit; no asset may omit required baseline fields |
| Authority creep in asset | Asset implies authority not granted by the kernel | No asset may imply authority not granted by the kernel |
| Stale commit in task prompt | Task prompt references outdated canonical baseline | Full 40-character SHA required; preflight baseline verification before every task |
| Scope inflation via asset | Asset expands implementation scope beyond approved design | No asset may expand scope; forbidden implementation list enforced |
| Generated state leakage | Runtime state appears in .pnpd directories | State gates check for generated runtime state |
| Memory provider leakage | Agent uses unapproved external memory provider | Memory provider boundary: only BUILTIN approved |
| Boot handoff confusion | Agent misinterprets boot handoff sequence | Defined 7-step boot handoff model with exact verdicts |
| Task contract incomplete | Task prompt omits required kernel fields | Task contract inheritance with stop-and-request rule |
| Mac/Windows baseline conflict | Old branch state from Mac conflicts with current Windows baseline | Anti-drift trigger for Mac state conflicts |
| Codex finalization authority ambiguity | Codex may push/merge without explicit Owner authorization | Codex may push and merge only after explicit Owner finalization authorization, green Codex audit, clean local gates, clean state gates, fast-forward merge eligibility, and remote CI verification |
| Reconciliation role ambiguity | No clear primary reconciliation agent | Codex is the primary reconciliation agent for discrepancies |

## Future Implementation Gates

Before any future implementation commit, the following gates must be run.

File scope gate:

`ash
git diff --name-only
`

Expected only:

docs/pnpd/skills-local-prompt-assets-and-boot-handoff-design.md

Forbidden drift checks:

`ash
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
`

Each must produce no output.

Existing validation gates:

`ash
git diff --check
npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test
`

State gates:

`ash
test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks

find .pnpd -maxdepth 2 -type d \( -name product-delivery-registry -o -name ledger -o -name handoffs -o -name locks \) -print
`

Expected state gate result: no output.

## Future DeepSeek Report Contract

After implementation, DeepSeek/OpenCode must return the following verdict:

DEEPSEEK_PHASE_1P_O_SKILLS_LOCAL_PROMPT_ASSETS_AND_BOOT_HANDOFF_COMMITTED_AMBER_NOT_CODEX_AUDITED

The final report must include these fields:

- Verdict
- Branch
- Base commit
- Commit
- Files changed
- Prompt Asset Layer result
- Prompt Asset Categories result
- Role-Specific Boot Assets result
- Boot Handoff Model result
- Task Contract Inheritance result
- Prompt Drift Prevention result
- Local Asset Storage Boundary result
- Future Asset File Shape result
- Memory Provider Boundary result
- Relationship To Prior Phases result
- Authority Boundary result
- Forbidden Implementation result
- Drift Risk result
- Gates run
- State result
- Known untracked files
- Push status
- Merge status
- Canonicalization boundary
- Next safest step

## Canonicalization Boundary

Phase 1P-O becomes canonical only after:

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

After successful implementation, the next step is Codex audit/finalize from the committed branch. Do not push. Do not merge. Do not claim canonical status.
