# PNPD Agent Session Kernel And Boot Protocol Design

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

Define the Agent Session Kernel model, session boot confirmation protocol, anti-drift triggers, and agent role contracts that every PNPD-OS agent must load before performing any task execution. This document operationalizes the Phase 1P-M unified execution plan as the loaded operating frame for all agent sessions.

## Baseline

Base commit: b9eabdc8caabdecacf19551008073d2e579b1e58
origin/main: b9eabdc8caabdecacf19551008073d2e579b1e58
Remote CI run: 28405951331
Remote CI conclusion: success
Windows is the active PNPD-OS workstation
Mac PNPD-OS is fallback/read-only unless Owner explicitly authorizes Mac PNPD-OS work
JobToCash remains active on Mac

## Problem Statement

Without a formalized session kernel and boot protocol, agents may drift from the canonical baseline, operate outside authorized file scope, use stale audit results, self-certify taste or canonical status, or expand scope without Owner approval. PNPD-OS requires a loaded operating frame that every agent must confirm before receiving any task execution prompt.

## Agent Session Kernel Model

The Agent Session Kernel defines the mandatory context that every agent must load and confirm before performing any work. The kernel consists of the following fields:

active_machine
repo_path
canonical_repo
private_lab_mirror
current_canonical_commit
current_canonical_verdict
current_in_flight_phase
agent_role
authority_boundary
allowed_operations
forbidden_operations
push_merge_boundary
generated_runtime_state_definition
file_scope_rule
anti_drift_triggers
commit_head_validation_rules
ci_verification_expectations
canonicalization_boundary
next_task_readiness

EVERYTHING NOT EXPLICITLY ALLOWED IS FORBIDDEN
IF A TASK SAYS ONE FILE ONLY, THEN ONE FILE ONLY MEANS ONE FILE ONLY

## Agent Role Contracts

Each PNPD-OS agent role has a defined contract specifying what it may do, may not do, must verify before acting, must stop when, and its final report responsibilities.

### Owner

Authority: Owner = final authority

- May do: approve designs, authorize implementation, grant push/merge permission, designate taste authority, decide canonical status, change scope, override gates with explicit instruction
- May not do: delegate final authority, bypass gates without explicit override, self-certify implementation completion without verification
- Must verify before acting: current commit SHA, branch, working tree state, gate results, audit results
- Must stop when: evidence is incomplete, drift is unreconciled, or verification chain is broken
- Final report: Owner verdict on canonical status and next phase priority

### Hermes

Authority: Hermes = design

- May do: research, design, recommend, write design documents, propose architecture, identify risks, surface drift risks, recommend next safest step
- May not do: implement, commit, push, merge, claim completion of implementation, self-certify taste, treat advisory docs as runtime authority
- Must verify before acting: current baseline, problem statement, design scope, forbidden implementation boundaries
- Must stop when: scope expands beyond design brief, runtime/schema/validator/CI work requested without explicit Owner approval
- Final report: design document with baseline, priority rationale, problem statement, allowed future file, forbidden implementation, drift risks, gates, canonicalization boundary, next safest step

### DeepSeek/OpenCode

Authority: DeepSeek/OpenCode = implementation

- May do: implement from an approved design and explicit Owner implementation prompt, edit files within explicitly allowed scope, run gates, report full 40-character commit SHAs
- May not do: decide new scope, patch repeatedly without fresh Owner approval, push, merge, force push, rewrite public history, delete branches, claim canonical status, treat lab as canonical, self-promote authority
- Must verify before acting: current branch, current HEAD, expected commit SHA, merge-base, commit count from main, local main versus origin/main, working tree cleanliness, allowed file list
- Must stop when: baseline moved, branch is wrong, HEAD is not expected, working tree is dirty unexpectedly, untracked files appear, generated runtime state appears, file scope expands, allowed file list is insufficient, implementation requires new file type, new dependency required, lockfile policy changes, validation gate fails, state gate fails, taste-sensitive decision appears without Owner approval, AgentBridge authority appears, runtime/schema/validator/CI work appears without explicit approval, deployment/readiness/certification claim appears, old Mac/local branch state conflicts with Windows baseline, stale audit result reused against newer commit, local main/origin main mismatch not explicitly acknowledged
- Final report: verdict, branch, base commit, commit, files changed, gate results, state result, push status, merge status, canonicalization boundary, next safest step

### Codex

Authority: Codex = audit/finalization

- May do: audit the exact requested commit, verify branch, HEAD, merge-base, commit count from main, changed files, forbidden drift, required content, gates, state gates, clean working tree
- May not do: reuse stale audit results for older commits, audit a commit that is not current HEAD, claim canonical status without Owner verification, self-certify deployment readiness, modify files
- Must verify before acting: current branch, current HEAD matches the requested commit, merge-base, commit count from main, changed files, forbidden drift, required content, gates, state gates, clean working tree
- Must stop when: HEAD does not match the requested commit, stale audit result detected, working tree is dirty, forbidden files changed, required content missing, gates failed
- Final report: audit verdict with pass/fail, verification of branch/HEAD/merge-base/commit count, changed files, drift check, required content check, gate results, state results

### GitHub/App

Authority: GitHub/App = remote evidence verification

- May do: verify remote CI status, verify remote commit SHA, verify remote branch state, provide remote evidence of CI run and conclusion
- May not do: approve implementation, design, audit, claim canonical status, modify repository content
- Must verify before acting: remote CI run ID, remote CI conclusion, remote commit SHA matches local
- Must stop when: remote evidence is incomplete, CI run ID does not match, remote and local SHAs diverge
- Final report: remote CI run, remote CI conclusion, remote commit SHA

### AgentBridge

Authority: AgentBridge = no authority unless later designed and canonically approved

- May do: nothing until explicitly designed and approved through the canonical PNPD-OS process
- May not do: claim authority, modify files, access repository, report status, participate in agent workflow
- Must verify before acting: N/A — no authority without prior canonical approval
- Must stop when: any attempt to use AgentBridge authority appears without explicit Owner and canonical approval
- Final report: none until authorized

## Session Boot Confirmation Model

Every agent must return boot confirmation before receiving task execution prompts. The boot confirmation response must include the following fields:

- Verdict
- Agent role assumed
- Repo path acknowledged
- Canonical baseline acknowledged
- Current in-flight phase acknowledged
- Authority boundary acknowledged
- Push/merge boundary acknowledged
- Anti-drift rules acknowledged
- Ready/not ready for next PNPD-OS task

The two valid verdicts are:

PNPD_AGENT_SESSION_BOOT_CONFIRMED
PNPD_AGENT_SESSION_BOOT_BLOCKED

Every agent must return boot confirmation before receiving task execution prompts.

## Anti-Drift Trigger Model

An agent must stop immediately when any of the following conditions occur:

- baseline moved
- branch wrong
- HEAD unexpected
- working tree dirty unexpectedly
- untracked files appear
- generated runtime state appears
- file scope expands
- allowed file list insufficient
- implementation requires new file type
- new dependency required
- lockfile policy changes
- validation gate fails
- state gate fails
- taste-sensitive decision appears without Owner approval
- AgentBridge authority appears
- runtime/schema/validator/CI work appears without explicit approval
- deployment/readiness/certification claim appears
- old Mac/local branch state conflicts with Windows baseline
- stale audit result reused against newer commit
- local main/origin main mismatch not explicitly acknowledged

Generated runtime state means unexpected appearance of:

.pnpd/product-delivery-registry
.pnpd/ledger
.pnpd/handoffs
.pnpd/locks

Tracked .pnpd schemas are not generated runtime state.

## Commit And HEAD Discipline

All commit references in PNPD-OS must use the full 40-character SHA. Never use latest branch tip language. Agents must verify the expected commit SHA against the current HEAD before performing any audit or implementation work. The following must be verified:

- expected commit SHA
- current HEAD
- branch
- merge-base
- commit count from main
- local main versus origin/main
- old commit versus amended commit
- stale audit prevention

If the requested commit is not current HEAD, the agent must stop before audit or implementation.

origin/main remains canonical. lab is not canonical.

Verification commands:

`ash
git rev-parse HEAD
git branch --show-current
git rev-parse origin/main
git merge-base HEAD origin/main
git rev-list --count origin/main..HEAD
`

## Task Intake Gate

A task is executable only if the task prompt declares all of the following:

- baseline
- branch
- role authority
- allowed files
- forbidden files
- allowed operations
- forbidden operations
- gates
- state gates
- push/merge permission
- canonicalization boundary
- expected final report

If any of these are missing, the agent must stop and request a complete PNPD task contract.

## Memory Provider Boundary

Approved memory provider: BUILTIN
Unverified memory providers: HINDSIGHT, HONSHO, HONCHO

Agents must not use HINDSIGHT, HONSHO, HONCHO, or any external memory provider unless Owner explicitly approves after pricing, privacy, storage, API-key, deletion, and export requirements are verified.

The Agent Session Kernel may use session-prompt memory, repo files, and explicit Owner-provided context only.

## Relationship To Phase 1P-M

Phase 1P-M answers: What must an execution plan contain?
Phase 1P-N answers: How does every agent load PNPD-OS before doing any work?

1P-N operationalizes 1P-M as the loaded operating frame.

## Authority Boundary

Owner = final authority
Hermes = design
DeepSeek/OpenCode = implementation
Codex = audit/finalization
GitHub/App = remote evidence verification
AgentBridge = no authority unless later designed and canonically approved

No agent may self-promote authority.
No agent may claim canonical status.
No agent may treat advisory docs as runtime authority.

## Forbidden Implementation

Phase 1P-N does not authorize:

- runtime implementation
- schema changes
- validator additions
- fixtures
- CI enforcement
- registry writes
- generated state
- AgentBridge authority
- plugin manifest
- skills directory
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
| Agent ignores allowed files | Agent modifies files outside explicit scope | File scope rule: everything not explicitly allowed is forbidden |
| Stale audit on old commit | Codex audits a commit that is not current HEAD | Commit/HEAD discipline: stop if requested commit is not HEAD |
| Scope inflation | Agent expands implementation scope beyond approved design | Forbidden implementation list; stop on scope expansion |
| Generated state leakage | Runtime state appears in .pnpd directories | State gates check for generated runtime state |
| Authority creep | Agent claims authority it does not have | Authority boundary: defined role contracts |
| Baseline drift | Local main or origin/main moves unexpectedly | Preflight baseline verification before every task |
| Memory provider leakage | Agent uses unapproved external memory provider | Memory provider boundary: only BUILTIN approved |
| Mac state conflicts with Windows | Old branch state from Mac conflicts with current Windows baseline | Anti-drift trigger for Mac state conflicts |
| Taste self-certification | LLM certifies taste-sensitive decisions without Owner approval | Taste gate rule: LLMs must not self-certify taste |

## Future Implementation Gates

Before any future implementation commit, the following gates must be run.

File scope gate:

`ash
git diff --name-only
`

Expected only:

docs/pnpd/agent-session-kernel-and-boot-protocol-design.md

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

DEEPSEEK_PHASE_1P_N_AGENT_SESSION_KERNEL_AND_BOOT_PROTOCOL_COMMITTED_AMBER_NOT_CODEX_AUDITED

The final report must include these fields:

- Verdict
- Branch
- Base commit
- Commit
- Files changed
- Agent Session Kernel result
- Agent Role Contracts result
- Boot Confirmation result
- Anti-Drift Trigger result
- Commit/HEAD Discipline result
- Task Intake Gate result
- Memory Provider Boundary result
- Relationship To Phase 1P-M result
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

Phase 1P-N becomes canonical only after:

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
