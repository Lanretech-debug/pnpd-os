# Phase 1P-T — P0 Prompt Asset Selection and Consumption Protocol Design

## Current Status

Status: docs-only Phase 1P-T repair after Phase 1P-U canonicalization
Canonical status: advisory until Codex audit, merge, push, CI success, and Owner/GitHub App verification
Phase 1P-U canonical status: PHASE_1P_U_CANONICALIZED
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
Phase 1P-T remains held until this repaired design is audited and finalized.

## Canonical Baseline

Repository: Lanretech-debug/pnpd-os
Active repo path: /home/lanretech_environment/Projects/pnpd-os
Current canonical base: 4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b
Phase 1P-U canonical status: PHASE_1P_U_CANONICALIZED
Remote CI run for 1P-U: 28664860390
Remote CI conclusion for 1P-U: success

## Prior Phase Relationship

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the prompt asset layer.
1P-P defines the idea ordering layer.
1P-Q defines the local prompt asset creation task contract.
1P-R creates the first governed P0 local prompt asset scaffold set.
1P-S instantiates the governed P0 prompt asset scaffolds as separate docs-only files.
1P-U defines the canonical role nomenclature and implementation lane model.

Phase 1P-M created the Unified Execution Plan and Taste Gate model.
Phase 1P-N created the Agent Session Kernel and Boot Protocol.
Phase 1P-O created the skills-local prompt assets and boot handoff design.
Phase 1P-P created the introspection research brief and deferred ideas ordering design.
Phase 1P-Q created the local prompt asset creation task contract design.
Phase 1P-R created docs-only reusable P0 prompt asset scaffolds.
Phase 1P-S created canonical docs-only P0 prompt asset files.
Phase 1P-U established Hermes → OpenCode → Codex as the canonical role order, OpenCode as the canonical implementation lane, and DeepSeek as a model/provider reference only.

1P-T defines the P0 prompt asset selection and consumption protocol.

## Historical Context

These historical references are preserved for chronology and auditability and do not grant current role, implementation, merge, push, or canonicalization authority.

Held historical Phase 1P-T branch: deepseek/phase1p-t-p0-prompt-asset-selection-and-consumption-protocol-design
Historical initial implementation commit: f725634cdc8a60d700ad193113d98f410670ffee
Historical matrix field wording patch commit: e14ecfba27edc50b684558d064266ff25b32ba1b
Prior Codex audit failure: CODEX_PHASE_1P_T_CORRECTED_AUDIT_FAILED_P0_ASSET_SELECTION_MATRIX

## Governing Canonical Files

The following files govern Phase 1P-T and must not be modified by this phase:

- docs/pnpd/local-prompt-asset-creation-task-contract-design.md
- docs/pnpd/local-prompt-assets-p0-scaffold-set.md
- docs/pnpd/prompt-assets/p0/README.md
- docs/pnpd/prompt-assets/p0/boot-prompt.md
- docs/pnpd/prompt-assets/p0/deepseek-implementation-prompt.md
- docs/pnpd/prompt-assets/p0/codex-audit-prompt.md
- docs/pnpd/prompt-assets/p0/codex-finalization-prompt.md
- docs/pnpd/prompt-assets/p0/owner-decision-prompt.md
- docs/pnpd/prompt-assets/p0/blocked-state-prompt.md
- docs/pnpd/prompt-assets/p0/reconciliation-prompt.md

## Problem Statement

Phase 1P-S created canonical docs-only P0 prompt asset files, but it did not define how those assets are selected for a concrete PNPD task or how they are consumed within a task contract. Without a formal selection and consumption protocol, prompt assets risk being used as runtime authorities, agents may self-select assets without Owner approval, placeholders may be treated as live values, and the role boundary may be weakened. Phase 1P-T defines a manual, Owner-approved protocol that governs how P0 prompt assets are selected, resolved, bound, delivered, executed, audited, and finalized. Phase 1P-U is recorded with canonical status PHASE_1P_U_CANONICALIZED.

## Definition Of Prompt Asset Consumption

Prompt asset consumption means manually selecting a canonical docs-only P0 prompt asset, resolving its placeholders through an Owner-approved PNPD task contract, and using the resolved text as task-scoped instruction material. It does not mean runtime loading, automatic execution, prompt registry lookup, autonomous prompt chaining, or agent self-authorization.

The protocol defines seven distinct steps within consumption:

- **Selection**: Choosing the appropriate P0 prompt asset for the task stage.
- **Resolution**: Replacing placeholders with values from the Owner-approved task contract.
- **Binding**: Recording the baseline, scope, gates, and boundaries that the consumption event is tied to.
- **Delivery**: Manually providing the resolved prompt text to the target agent.
- **Execution**: The target agent performs only the approved task scope.
- **Audit**: Codex verifies that consumption stayed within the contract.
- **Canonicalization**: The full chain completes with merge, push, CI, and Owner/GitHub App verification.

Only the Owner-approved task contract may convert a prompt asset scaffold into a task-specific prompt.

## P0 Asset Selection Matrix

Prompt asset selection is determined by task type, role boundary, required inputs, forbidden uses, and required final report evidence.

The P0 Asset Selection Matrix defines the seven canonical P0 prompt assets, their file paths, selection authority, target roles, valid use cases, required inputs, forbidden uses, and required final report evidence.

| Asset Name | Canonical File Path | Allowed Selecting Authority | target_role | valid_use_case | required_inputs | forbidden_uses | required_final_report_evidence |
|---|---|---|---|---|---|---|---|
| BOOT_PROMPT | docs/pnpd/prompt-assets/p0/boot-prompt.md | Owner (Hermes may recommend) | DeepSeek, OpenCode | Initialize agent session with boot protocol and baseline verification | Canonical baseline, branch, role boundary | Create files, modify files, run gates, commit, push, merge, claim canonical status | Boot verdict with baseline fields |
| DEEPSEEK_IMPLEMENTATION_PROMPT | docs/pnpd/prompt-assets/p0/deepseek-implementation-prompt.md | Owner (Hermes may recommend) | DeepSeek, OpenCode | Create exactly one docs-only file within strict Owner-approved scope | BOOT_PROMPT verdict, canonical baseline, allowed files, forbidden files, gates | Create unauthorized files, modify forbidden paths, push, merge, claim canonical status | Implementation verdict with file scope, gate results, state result |
| CODEX_AUDIT_PROMPT | docs/pnpd/prompt-assets/p0/codex-audit-prompt.md | Owner (Hermes may recommend) | Codex | Audit implementation commit against contract scope | Implementation commit, allowed files, forbidden files, gates | Create files, modify files, commit, push, merge, claim canonical status | Audit verdict with file scope result, gate results, overclaim scan |
| CODEX_FINALIZATION_PROMPT | docs/pnpd/prompt-assets/p0/codex-finalization-prompt.md | Owner only | Codex | Finalize after audit pass and Owner authorization | Audit verdict, Owner finalization authorization, branch state | Push, merge, CI edit, and canonical claim are forbidden unless explicitly authorized by an Owner-approved finalization task contract; canonical status still requires remote CI success and Owner/GitHub App verification. | Finalization verdict with preflight, merge, post-merge, and push results |
| OWNER_DECISION_PROMPT | docs/pnpd/prompt-assets/p0/owner-decision-prompt.md | Owner only | Owner | Surface verified state for approve, request changes, or block | Audit verdict, implementation report, gate results | Make final decision, override Owner, self-certify | Owner decision with approve, request changes, or block |
| BLOCKED_STATE_PROMPT | docs/pnpd/prompt-assets/p0/blocked-state-prompt.md | Any role (halt only, not implementation authority) | DeepSeek, OpenCode, Codex | Halt and report when contract cannot be satisfied | Current branch, HEAD, blocking reason, expected and actual values | Proceed with blocked contract, work around block, ignore blocking condition | Blocked state verdict with blocking condition |
| RECONCILIATION_PROMPT | docs/pnpd/prompt-assets/p0/reconciliation-prompt.md | Owner (Hermes may recommend) | DeepSeek, OpenCode, Codex | Reconcile divergence between reports, audit, branch state, and Owner decisions | Implementation report, audit report, branch state, Owner decision | Ignore divergence, override Owner decision, self-certify reconciliation | Reconciliation verdict with divergence list and resolution |

HERMES_DESIGN_PROMPT remains a P1 future candidate and is not part of Phase 1P-T.

No P1 or P2 prompt asset is authorized by Phase 1P-T.

Matrix rules:
- allowed_selecting_authority = Owner for every task-scoped asset selection.
- Hermes may recommend, but Hermes may not approve selection.
- BLOCKED_STATE_PROMPT may be invoked by any role only as a halt/report shape, not as implementation authority.
- RECONCILIATION_PROMPT target role must include Codex.
- No row may imply that an asset file itself grants authority.

## Prompt Asset Consumption Lifecycle

1. Owner identifies the PNPD task need.
2. Owner or Hermes recommends the appropriate P0 prompt asset.
3. Owner approves the asset selection.
4. The task contract binds the asset to the current canonical baseline.
5. Placeholder values are resolved from the Owner-approved task contract.
6. The resolved prompt text is delivered manually into the agent session.
7. The target agent executes only the approved task scope.
8. Codex audits the result against the selected asset, task contract, and canonical baseline.
9. GitHub/App verifies merge, push, remote CI, and evidence.
10. Canonical status is claimed only after Owner/GitHub App verification.

No step may be automated by Phase 1P-T.

## Placeholder Resolution Protocol

All P0 prompt assets use the following canonical placeholder tokens:

<PHASE_NAME>
<BRANCH_NAME>
<BASE_COMMIT>
<CURRENT_CANONICAL_COMMIT>
<CURRENT_CANONICAL_VERDICT>
<REMOTE_CI_RUN>
<ALLOWED_FILES>
<FORBIDDEN_FILES>
<EXPECTED_HEAD>
<IMPLEMENTATION_COMMIT>
<FINALIZED_COMMIT>
<CI_RUN_ID>

Placeholder values must be resolved by the Owner-approved task contract before any prompt asset file becomes a task-specific instruction prompt.

Unresolved placeholders are safe only inside docs-only prompt asset scaffolds; they must not be treated as live task values.

Resolved placeholders do not grant new authority; they only bind a prompt asset to an already-approved task scope.

## Baseline Binding Protocol

Every prompt asset consumption event must record the following binding evidence:

- selected_prompt_asset_name
- selected_prompt_asset_file
- selected_prompt_asset_version
- current_canonical_commit
- current_canonical_verdict
- canonical_status
- base_commit
- target_branch
- allowed_files
- forbidden_files
- validation_gates
- state_gates
- push_merge_boundary
- canonicalization_boundary
- Owner approval evidence

If baseline verification fails, the consumption event must return:

P0_PROMPT_ASSET_CONSUMPTION_BLOCKED_BASELINE_UNVERIFIED

## Owner Approval Boundary

Only the Owner may approve prompt asset selection for a concrete PNPD task.
Hermes may recommend a prompt asset, but Hermes may not approve its use.
OpenCode, Codex, GitHub/App, and AgentBridge may not self-select prompt assets as task authority.
A prompt asset file is not authority by itself; authority comes only from the Owner-approved PNPD task contract.

## Agent Role Boundary

Hermes may recommend or design prompt asset usage, but must not execute implementation, patching, auditing, finalization, push, merge, or canonicalization.
OpenCode may implement approved docs-only patches and run local diagnostics, but must not produce Codex audit verdicts, finalization authority, push authority, merge authority, or canonicalization claims.
Codex may audit, re-audit, prepare finalization, and review evidence, but must not implement patches or claim canonical status before Owner/GitHub App verification.
Owner remains above all agent roles.

Owner = exclusive final authorization, prompt asset selection approval, merge authorization, and verification authorization.
Hermes = design, recommendation, and advisory lane only.
OpenCode = canonical implementation lane only within Owner-approved prompt asset and task scope.
Codex = audit and finalization lane only within Owner-approved prompt asset and task scope.
GitHub/App = remote CI, merge, push, and evidence verification.
AgentBridge = no authority unless explicitly designed and canonically approved later.

No agent may grant itself additional authority through prompt asset consumption.
No agent may treat a prompt asset file as runtime authority.
No agent may treat a prompt asset file as permission to expand scope.

## Runtime Boundary

Phase 1P-T may define manual prompt asset selection and consumption, but it must not create runtime prompt loading.
P0 prompt assets remain docs-only reusable scaffolds, not executable runtime components.
No prompt asset may be loaded automatically by scripts, tests, CI, agents, plugins, memory systems, or external services.
No prompt asset consumption event may create a prompt registry, loader, dispatcher, router, plugin manifest, agent manifest, or execution pipeline.

## Storage Boundary

Future implementation may create exactly one docs-only design file at docs/pnpd/p0-prompt-asset-selection-and-consumption-protocol-design.md.

Future implementation must not create:
- runtime files
- generated state files
- registry files
- prompt index files intended for runtime loading
- plugin manifests
- agent manifests
- schema files
- validator files
- fixture files
- CI workflow files
- package files
- lockfiles
- memory records
- Obsidian vault files
- docs/solutions files

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

## Phase 1P-U Dependency

1P-U defines the canonical role nomenclature and implementation lane model.
The canonical PNPD-OS role order is Hermes → OpenCode → Codex.
OpenCode is the canonical implementation lane.
DEEPSEEK_IMPLEMENTATION_PROMPT is a preserved legacy asset name, not a canonical implementation role.
deepseek-implementation-prompt.md is a preserved legacy file name, not a canonical implementation role.
DeepSeek may appear only as a model/provider reference or preserved historical token.
Owner remains the final authority for approval, merge authorization, canonicalization, and verification acceptance.
GitHub/App remains the remote repository, push, merge, CI, and remote evidence verification lane.

## No-Drift Rules

Phase 1P-T defines prompt asset selection and consumption as a manual Owner-approved task-contract process, not a runtime capability.
Prompt asset consumption must not create runtime prompt loading, prompt registries, autonomous prompt routing, or agent self-authorization.
P0 prompt assets remain reusable task-contract scaffolds, not autonomous agents.
Phase 1P-T does not authorize runtime prompt loading.
Phase 1P-T does not authorize prompt registry creation.
Phase 1P-T does not authorize automatic prompt routing.
Phase 1P-T does not authorize generated state.
Phase 1P-T does not authorize memory writes.
Phase 1P-T does not authorize skills or plugins.
Phase 1P-T does not authorize docs/solutions creation.
Phase 1P-T does not authorize Wayfinder implementation.
Phase 1P-T does not authorize INDEX.md implementation.
No prompt asset may grant authority beyond the Agent Session Kernel or the Owner-approved PNPD task contract.
No prompt asset consumption event may weaken the Owner, Hermes, OpenCode, Codex, or GitHub/App authority boundary.
No prompt asset consumption event may authorize skills, plugins, memory records, generated runtime state, docs/solutions, external integrations, Obsidian vault integration, external memory providers, autonomous memory, AgentBridge authority, or autonomous execution.
No prompt asset consumption event may treat MiniMax inspection, Revolut article, Compound Engineering, or Microsoft study modules as implementation authorization.
Until merge, push, remote CI success, and Owner/GitHub App verification, any future Phase 1P-T implementation remains advisory only.

## Allowed Future Implementation Shape

Future Phase 1P-T implementation may create a docs-only selection and consumption protocol design file at docs/pnpd/p0-prompt-asset-selection-and-consumption-protocol-design.md. Future implementation may refine the selection matrix, lifecycle steps, evidence model, audit model, or verification model within that single file. Future implementation must not expand into runtime, registry, loader, dispatcher, or autonomous territory without a separate Owner-approved PNPD task contract.

## Forbidden Future Implementation

Phase 1P-T does not authorize:

- runtime implementation
- runtime prompt loading
- automatic prompt asset selection
- prompt registry
- prompt loader
- prompt router
- prompt dispatcher
- agent manifest
- plugin manifest
- schema changes
- validator additions
- fixture additions
- CI workflow changes
- registry writes
- generated state
- skills directory creation
- plugins directory creation
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

## Required Evidence Model

Every prompt asset consumption event must record:

- selected_prompt_asset_name
- selected_prompt_asset_file
- selected_prompt_asset_version
- selection_recommender
- selection_approver
- Owner approval statement
- phase name
- branch name
- base commit
- current canonical commit
- current canonical verdict
- remote CI run for current canonical baseline
- allowed files
- forbidden files
- resolved placeholders
- unresolved placeholders remaining
- validation gates
- state gates
- forbidden drift checks
- push/merge authority
- canonicalization boundary
- target agent
- final report shape

If required evidence is missing, the consumption event must return:

P0_PROMPT_ASSET_CONSUMPTION_BLOCKED_REQUIRED_EVIDENCE_MISSING

## Required Audit Model

Codex must audit every prompt asset consumption event for:

- asset selected from canonical P0 set
- asset file path valid
- Owner approval present
- baseline verified
- placeholders resolved from task contract
- no unresolved live placeholders in task-specific prompt
- allowed files preserved
- forbidden files preserved
- role boundary preserved
- runtime boundary preserved
- no prompt registry created
- no prompt loader created
- no autonomous prompt routing created
- no generated PNPD state written by this phase
- validation gates run
- state gates run
- no canonical claim before push, CI, and Owner/GitHub App verification

If audit fails, Codex must return:

CODEX_P0_PROMPT_ASSET_CONSUMPTION_AUDIT_BLOCKED_OR_FAILED

## Required GitHub/App Verification Model

After finalization, GitHub/App must verify:

- origin/main equals finalized commit
- remote CI run exists
- remote CI conclusion is success
- remote CI job validate-and-dry-run completed successfully
- generated-state cleanup completed successfully
- no PNPD state directories verified
- clean working tree verified

Future pushed-green verdict shape:

PHASE_1P_T_P0_PROMPT_ASSET_SELECTION_AND_CONSUMPTION_PROTOCOL_PUSHED_CI_GREEN

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

Corrected forbidden drift checks:

```bash
git diff --name-only main..HEAD -- .pnpd
git diff --name-only main..HEAD -- scripts
git diff --name-only main..HEAD -- templates
git diff --name-only main..HEAD -- tests/fixtures
git diff --name-only main..HEAD -- package.json
git diff --name-only main..HEAD -- package-lock.json
git diff --name-only main..HEAD -- npm-shrinkwrap.json
git diff --name-only main..HEAD -- .github/workflows
git diff --name-only main..HEAD -- README.md
git diff --name-only main..HEAD -- memory
git diff --name-only main..HEAD -- skills
git diff --name-only main..HEAD -- plugins
git diff --name-only main..HEAD -- docs/solutions
git diff --name-only main..HEAD -- docs/pnpd/local-prompt-asset-creation-task-contract-design.md
git diff --name-only main..HEAD -- docs/pnpd/local-prompt-assets-p0-scaffold-set.md
git diff --name-only main..HEAD -- docs/pnpd/prompt-assets/p0
```

Expected forbidden drift result: no output.

Pre-existing canonical repository directories must not be treated as drift. Only diff-relative changes from the current canonical baseline count as Phase 1P-T drift.

## State Gates

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
|---|---|---|---|
| Prompt asset consumption becomes runtime loading | Shifts from manual Owner-approved process to automatic execution | Runtime Boundary section blocks runtime loading | BLOCKED_STATE_PROMPT |
| Prompt asset consumption becomes automatic prompt selection | Bypasses Owner approval | Owner Approval Boundary requires Owner selection approval | BLOCKED_STATE_PROMPT |
| Prompt asset consumption becomes prompt registry | Creates runtime lookup infrastructure | Runtime Boundary blocks registry creation | BLOCKED_STATE_PROMPT |
| Prompt asset consumption becomes autonomous prompt routing | Agents self-navigate between assets without Owner | Consumption Lifecycle requires Owner at every selection step | BLOCKED_STATE_PROMPT |
| Agent self-selects prompt asset without Owner approval | Role boundary is weakened, Owner authority bypassed | Owner Approval Boundary blocks agent self-selection | BLOCKED_STATE_PROMPT |
| Hermes recommendation is treated as Owner approval | Advisory lane becomes authorization lane | Owner Approval Boundary distinguishes recommend from approve | BLOCKED_STATE_PROMPT |
| Codex audit prompt is treated as implementation authority | Audit lane becomes execution lane | Agent Role Boundary enforces strict role separation | BLOCKED_STATE_PROMPT |
| Prompt asset file grants authority by itself | File is treated as runtime permission | Owner Approval Boundary states asset file is not authority by itself | BLOCKED_STATE_PROMPT |
| Resolved placeholders grant new scope | Resolution becomes scope expansion | Placeholder Resolution Protocol states placeholders do not grant new authority | BLOCKED_STATE_PROMPT |
| Unresolved placeholders are treated as live values | Incomplete resolution becomes implicit authorization | Placeholder Resolution Protocol requires resolution before task use | BLOCKED_STATE_PROMPT |
| Prompt asset consumption weakens role boundaries | Owner, Hermes, DeepSeek, Codex, GitHub roles blurred | Agent Role Boundary enforces strict role separation | BLOCKED_STATE_PROMPT |
| Prompt asset consumption bypasses Agent Session Kernel | Boot protocol is skipped | Consumption Lifecycle starts with Owner task need, not agent self-boot | BLOCKED_STATE_PROMPT |
| Prompt asset consumption authorizes push or merge accidentally | Canonicalization boundary is bypassed | Baseline Binding Protocol records push/merge boundary | BLOCKED_STATE_PROMPT |
| Prompt asset consumption creates generated state | Runtime state leaks outside docs-only scope | State Gates detect generated state | BLOCKED_STATE_PROMPT |
| Prompt asset consumption writes to memory | Agent memory becomes unauthorized persistence | Memory And Research Source Boundary blocks memory writes | BLOCKED_STATE_PROMPT |
| Prompt asset consumption creates skills or plugins | Scope creeps beyond docs-only protocol | Forbidden Future Implementation blocks skills/plugins | BLOCKED_STATE_PROMPT |
| Prompt asset consumption creates docs/solutions | Documentation scope creeps without design | Forbidden Future Implementation blocks docs/solutions | BLOCKED_STATE_PROMPT |
| Prompt asset consumption creates CI/schema/validator changes | Infrastructure scope creeps | Forbidden Future Implementation blocks CI/schema/validator changes | BLOCKED_STATE_PROMPT |
| Prompt asset consumption treats research sources as implementation authority | Research inputs become implementation prompts | Memory And Research Source Boundary blocks research as authorization | BLOCKED_STATE_PROMPT |
| Prompt asset consumption authorizes AgentBridge | Unapproved authority escalation | Forbidden Future Implementation blocks AgentBridge authority | BLOCKED_STATE_PROMPT |
| Prompt asset consumption becomes Phase 1Q legacy implementation by stealth | Scope creep via consumption protocol | No-Drift Rules explicitly block Phase 1Q legacy implementation | BLOCKED_STATE_PROMPT |
| Pre-existing canonical directory is mistaken for Phase 1P-T drift | False positive drift detection | Validation Gates note pre-existing directories are not drift | BLOCKED_STATE_PROMPT |

## Canonicalization Boundary

Phase 1P-T becomes canonical only after:

1. Hermes design
2. Owner approval
3. OpenCode implementation
4. Codex audit/finalize
5. fast-forward merge to main
6. push to origin
7. remote CI success
8. Owner/GitHub App verification

Until then, this design is advisory only.

## Final Recommendation

Phase 1P-T defines the manual Owner-approved prompt asset selection and consumption protocol for the seven canonical P0 prompt assets. The protocol preserves role boundaries, prevents runtime expansion, and ensures every consumption event is bound to a verified canonical baseline with recorded evidence. Future implementation may refine the protocol within this single docs-only file, but no step in the protocol may be automated without a separate Owner-approved PNPD task contract. The recommended next safest step is Codex audit after the OpenCode implementation commit.
