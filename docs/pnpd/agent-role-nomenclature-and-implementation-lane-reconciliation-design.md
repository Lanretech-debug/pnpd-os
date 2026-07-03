# Phase 1P-U — Agent Role Nomenclature and Implementation Lane Reconciliation Design

## Current Status

Status: docs-only Phase 1P-U role nomenclature reconciliation design
Canonical status: advisory until Codex audit, merge, push, CI success, and Owner/GitHub App verification
Runtime authority: none
Repo-wide rename authority: none
Prompt asset rename authority: none
Historical rewrite authority: none
Schema authority: none
Validator authority: none
CI authority: none
Generated state authority: none
Memory write authority: none
Skills/plugins authority: none
Wayfinder authority: none
INDEX.md authority: none
AgentBridge authority: none

## Canonical Baseline

Repository: Lanretech-debug/pnpd-os
Active repo path: /home/lanretech_environment/Projects/pnpd-os
Current canonical commit: 098934b457756e2a1f931861594b8425e2c232a5
Current canonical verdict: PHASE_1P_S_LOCAL_PROMPT_ASSET_P0_FILE_INSTANTIATION_PUSHED_CI_GREEN
Canonical status: PHASE_1P_S_CANONICALIZED
Remote CI run: 28574436640
Remote CI conclusion: success
Remote main verification: main is identical to 098934b457756e2a1f931861594b8425e2c232a5

## Held Phase 1P-T Context

Phase 1P-T is held.
Phase 1P-T is not canonical.
Phase 1P-T finalization is blocked pending role nomenclature reconciliation.
The held Phase 1P-T file is advisory context only, not canonical committed-state authority.
Owner binding correction: PHASE_1P_T_HELD_FILE_IS_ADVISORY_CONTEXT_NOT_CANONICAL_GOVERNING_FILE
Phase 1P-U does not patch Phase 1P-T.
Phase 1P-U does not canonicalize Phase 1P-T.

Known held Phase 1P-T references:

- Phase 1P-T branch: deepseek/phase1p-t-p0-prompt-asset-selection-and-consumption-protocol-design
- Phase 1P-T initial implementation commit: f725634cdc8a60d700ad193113d98f410670ffee
- Phase 1P-T matrix field wording patch commit: e14ecfba27edc50b684558d064266ff25b32ba1b

Incident and failure references:

- CODEX_PHASE_1P_T_CORRECTED_AUDIT_FAILED_P0_ASSET_SELECTION_MATRIX
- DEEPSEEK_PHASE_1P_T_MATRIX_HEADER_LITERAL_NORMALIZATION_PATCH_BLOCKED_BASELINE_OR_HEAD_MISMATCH
- HERMES_INCIDENT_PHASE_1P_T_NON_DESIGN_EXECUTION_PROMPT_ACCEPTED_ROLE_BOUNDARY_BREACH_CONFIRMED

## Problem Statement

PNPD-OS currently contains canonical and semi-canonical wording that blurs the implementation lane by using DeepSeek/OpenCode, DeepSeek, DEEPSEEK_IMPLEMENTATION_PROMPT, and deepseek-implementation-prompt.md as if they are implementation-lane role names.

The canonical PNPD-OS role order must be Hermes → OpenCode → Codex.

DeepSeek must be treated as a model/provider reference or legacy historical token, not as the canonical PNPD-OS implementation role.

## Prior Phase Relationship

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the prompt asset layer.
1P-P defines the idea ordering layer.
1P-Q defines the local prompt asset creation task contract.
1P-R creates the first governed P0 local prompt asset scaffold set.
1P-S instantiates the governed P0 prompt asset scaffolds as separate docs-only files.
1P-T is held pending role nomenclature reconciliation.

Phase 1P-U does not canonicalize Phase 1P-T.
Phase 1P-U does not patch Phase 1P-T.
Phase 1P-U does not authorize Phase 1P-T finalization.
Phase 1P-U defines the role nomenclature reconciliation layer.

## Canonical Role Definitions

Owner = exclusive final authority for approval, merge authorization, canonicalization, and verification acceptance.
Hermes = design, recommendation, advisory, and reconciliation-design lane only.
OpenCode = implementation, patching, repo-command execution, and local diagnostic lane only within Owner-approved task scope.
Codex = audit, re-audit, finalization preparation, and evidence review lane only within Owner-approved task scope.
GitHub/App = remote repository, push, merge, CI, and remote evidence verification lane.

DeepSeek is not the canonical PNPD-OS implementation role.
DeepSeek may appear only as a model/provider reference or preserved historical token unless and until an Owner-approved migration explicitly changes legacy prompt asset names.

## Canonical Role Order

Canonical PNPD-OS agent role order: Hermes → OpenCode → Codex.
Owner remains above all agent roles.
GitHub/App remains the remote evidence and repository authority lane.

## Lane-Boundary Rules

Hermes must not execute implementation, shell execution, Git diagnostic, patch, commit, push, merge, audit, or finalization prompts.

If Hermes receives an implementation, shell execution, Git diagnostic, patch, commit, push, merge, audit, or finalization prompt, Hermes must not execute it. Hermes must return a blocked-state verdict and identify the correct target role.

OpenCode must not produce design approval, Owner approval, Codex audit verdicts, finalization authority, push authority, merge authority, or canonicalization claims.

Codex must not implement patches, broaden implementation scope, self-authorize finalization, self-authorize merge, self-authorize push, or claim canonical status before Owner/GitHub App verification.

No agent may treat model/provider identity as PNPD-OS role authority.

## Blocked Verdicts

- HERMES_BLOCKED_NON_DESIGN_EXECUTION_PROMPT_RECEIVED
- OPENCODE_BLOCKED_NON_IMPLEMENTATION_OR_NON_DIAGNOSTIC_PROMPT_RECEIVED
- CODEX_BLOCKED_NON_AUDIT_OR_FINALIZATION_PROMPT_RECEIVED
- PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_AMBIGUOUS_AUTHORITY
- PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_LEGACY_TOKEN_REWRITE_RISK

## Legacy Token Inventory Model

The following tokens are known canonical and semi-canonical references that use DeepSeek in a role-adjacent context:

- DeepSeek
- DEEPSEEK
- DeepSeek/OpenCode
- OpenCode/DeepSeek
- deepseek
- DEEPSEEK_IMPLEMENTATION_PROMPT
- deepseek-implementation-prompt

Each token is classified into one of the following categories:

- MUST_PRESERVE_HISTORICAL
- MUST_CHANGE_CURRENT_ROLE_WORDING
- MUST_CHANGE_FUTURE_FACING_WORDING
- MIGRATION_CANDIDATE_REQUIRES_OWNER_DECISION
- BLOCKED_UNTIL_OWNER_DECISION

Tokens that appear in historical verdicts, branch names, commit messages, CI run references, or audit evidence are classified MUST_PRESERVE_HISTORICAL.

Tokens that appear in current governance documents as the active implementation-lane role wording are classified MUST_CHANGE_CURRENT_ROLE_WORDING.

Tokens that appear in future-facing design or template text as the assumed implementation role are classified MUST_CHANGE_FUTURE_FACING_WORDING.

Tokens that refer to the prompt asset name DEEPSEEK_IMPLEMENTATION_PROMPT or its file path are classified MIGRATION_CANDIDATE_REQUIRES_OWNER_DECISION.

All migration-adjacent actions are classified BLOCKED_UNTIL_OWNER_DECISION.

## Historical Preservation Rules

Historical verdicts must not be rewritten unless an Owner-approved migration map explicitly authorizes replacement.
Historical branch names must not be rewritten.
Historical commit references must not be rewritten.
Historical CI references must not be rewritten.
Historical audit evidence must not be rewritten.
Phase chronology must remain auditable.

## Future-Facing Correction Rules

Current and future role descriptions should use OpenCode as the canonical implementation lane.
Current and future design contracts should use Hermes → OpenCode → Codex as the canonical agent sequence.
DeepSeek must not be used as the canonical implementation-lane role in future-facing governance text.

## Prompt Asset Migration Question

The following prompt asset references require an Owner decision before any rename or migration:

- DEEPSEEK_IMPLEMENTATION_PROMPT
- docs/pnpd/prompt-assets/p0/deepseek-implementation-prompt.md
- docs/pnpd/prompt-assets/p0/README.md references to DeepSeek
- docs/pnpd/local-prompt-asset-creation-task-contract-design.md references to DeepSeek
- docs/pnpd/local-prompt-assets-p0-scaffold-set.md references to DeepSeek
- docs/pnpd/p0-prompt-asset-selection-and-consumption-protocol-design.md references to DeepSeek/OpenCode

Three options exist for the prompt asset migration:

Option A: preserve legacy asset name and declare OpenCode as canonical role going forward.
- Benefit: zero evidence drift, zero audit disruption, fast to declare.
- Risk: legacy name persists and may confuse future readers.
- Audit implication: no re-audit needed for existing phases.

Option B: create an OpenCode alias while preserving DeepSeek legacy asset file.
- Benefit: provides a forward-facing name without rewriting history.
- Risk: dual naming may cause confusion about which is authoritative.
- Audit implication: requires evidence that alias does not change scope.

Option C: rename the prompt asset and file in a later dedicated migration phase.
- Benefit: fully correct naming going forward.
- Risk: high evidence drift, requires re-audit of every affected phase, high Owner review burden.
- Audit implication: requires a complete migration map and re-audit of all renamed references.

Advisory recommendation: Option A is the safest immediate move because it avoids evidence drift while waiting for Owner decision. Rename should only occur under an explicit migration phase with approved map.

## Phase 1P-T Interaction

Phase 1P-T remains held until role nomenclature reconciliation is designed and Owner-reviewed.
Phase 1P-T must not be finalized while its role-boundary wording is known to conflict with the Owner-approved canonical role model.
Any future Phase 1P-T patch must be routed only to OpenCode, not Hermes.
Any future Phase 1P-T audit must be routed only to Codex, not Hermes or OpenCode.

## No-Drift Rules

Phase 1P-U is design-only.
Phase 1P-U does not authorize implementation.
Phase 1P-U does not authorize repo-wide rename.
Phase 1P-U does not authorize prompt asset file rename.
Phase 1P-U does not authorize runtime prompt loading.
Phase 1P-U does not authorize prompt registry creation.
Phase 1P-U does not authorize automatic prompt routing.
Phase 1P-U does not authorize generated state.
Phase 1P-U does not authorize memory writes.
Phase 1P-U does not authorize skills or plugins.
Phase 1P-U does not authorize docs/solutions creation.
Phase 1P-U does not authorize AgentBridge authority.
Phase 1P-U does not authorize Wayfinder implementation.
Phase 1P-U does not authorize INDEX.md implementation.

## Allowed Future Implementation Shape

If later approved, implementation should be limited first to one docs-only design file:
docs/pnpd/agent-role-nomenclature-and-implementation-lane-reconciliation-design.md

## Forbidden Future Implementation

- repo-wide search-and-replace
- prompt asset file rename
- prompt asset name rename
- branch rename
- historical verdict rewrite
- historical evidence rewrite
- runtime changes
- script changes
- schema changes
- validator changes
- fixture changes
- CI workflow changes
- package changes
- lockfile changes
- generated state writes
- memory writes
- skills creation
- plugins creation
- docs/solutions creation
- AgentBridge authority
- Wayfinder implementation
- INDEX.md implementation
- prompt registry
- automatic prompt routing
- loader/router/dispatcher

## Required Evidence Model

Every role nomenclature reconciliation design must record:

- canonical role model
- canonical role order
- legacy token inventory
- classification of each legacy token hit
- historical preservation map
- future-facing correction map
- prompt asset migration decision record
- Owner approval evidence
- allowed files
- forbidden files
- validation gates
- state gates
- push/merge boundary
- canonicalization boundary

## Required Audit Model

Codex must audit every role nomenclature reconciliation event for:

- no historical evidence rewritten without Owner-approved migration map
- no prompt asset file renamed without Owner approval
- no prompt asset name changed without Owner approval
- Hermes lane preserved
- OpenCode lane preserved
- Codex lane preserved
- Owner authority preserved
- GitHub/App authority preserved
- DeepSeek treated only as model/provider or preserved legacy token
- no runtime prompt loading
- no prompt registry
- no automatic routing
- no generated state
- no memory writes
- no skills/plugins
- no docs/solutions

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
```

Expected forbidden drift result: no output.

Pre-existing canonical repository directories must not be treated as drift. Only diff-relative changes from the current canonical baseline count as Phase 1P-U drift.

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
| Hermes executes OpenCode prompt | Implementation lane is breached, role boundary weakened | Lane-Boundary Rules require Hermes to block non-design prompts | HERMES_BLOCKED_NON_DESIGN_EXECUTION_PROMPT_RECEIVED |
| Hermes executes Codex prompt | Audit and finalization lane is breached | Lane-Boundary Rules require Hermes to block non-design prompts | HERMES_BLOCKED_NON_DESIGN_EXECUTION_PROMPT_RECEIVED |
| OpenCode self-authorizes design approval | Design lane is breached | Lane-Boundary Rules forbid OpenCode from design approval | OPENCODE_BLOCKED_NON_IMPLEMENTATION_OR_NON_DIAGNOSTIC_PROMPT_RECEIVED |
| OpenCode self-authorizes finalization | Finalization lane is breached | Lane-Boundary Rules forbid OpenCode from finalization | OPENCODE_BLOCKED_NON_IMPLEMENTATION_OR_NON_DIAGNOSTIC_PROMPT_RECEIVED |
| Codex implements patch | Implementation lane is breached | Lane-Boundary Rules forbid Codex from implementation | CODEX_BLOCKED_NON_AUDIT_OR_FINALIZATION_PROMPT_RECEIVED |
| Codex self-authorizes canonical status | Owner authority is bypassed | Canonicalization Boundary requires Owner/GitHub App verification | BLOCKED_STATE_PROMPT |
| DeepSeek treated as canonical role | Role boundary is permanently blurred | Canonical Role Definitions declare DeepSeek is not canonical | PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_AMBIGUOUS_AUTHORITY |
| model/provider identity treated as authority | Agent role and model identity are conflated | Lane-Boundary Rules forbid treating model identity as authority | PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_AMBIGUOUS_AUTHORITY |
| historical verdicts rewritten | Audit trail is destroyed | Historical Preservation Rules forbid rewriting without migration map | PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_LEGACY_TOKEN_REWRITE_RISK |
| historical branch names rewritten | Git history is broken | Historical Preservation Rules forbid branch rename | PNPD_ROLE_NOMENCLATURE_RECONCILIATION_BLOCKED_LEGACY_TOKEN_REWRITE_RISK |
| prompt asset file renamed too early | Evidence drift across phases | Prompt Asset Migration Question requires Owner decision first | BLOCKED_STATE_PROMPT |
| prompt asset name renamed too early | Evidence drift across phases | Prompt Asset Migration Question requires Owner decision first | BLOCKED_STATE_PROMPT |
| repo-wide search-and-replace causes evidence drift | Verdicts, evidence, and audit records become inconsistent | Forbidden Future Implementation blocks repo-wide search-and-replace | BLOCKED_STATE_PROMPT |
| Phase 1P-T finalized before nomenclature reconciliation | Phase 1P-T contains role-boundary wording that conflicts with canonical model | Phase 1P-T Interaction requires reconciliation first | BLOCKED_STATE_PROMPT |
| Wayfinder or INDEX.md implemented before role reconciliation | Expands scope without resolving the core nomenclature issue | Forbidden Future Implementation blocks Wayfinder and INDEX.md | BLOCKED_STATE_PROMPT |
| runtime prompt routing introduced by naming correction | Naming fix becomes runtime infrastructure | Forbidden Future Implementation blocks runtime prompt routing | BLOCKED_STATE_PROMPT |

## Canonicalization Boundary

Phase 1P-U becomes canonical only after:

1. Hermes design
2. Owner approval
3. OpenCode implementation
4. Codex audit/finalize
5. Fast-forward merge to main
6. Push to origin
7. Remote CI success
8. Owner/GitHub App verification

Until then, this design is advisory only.

## Final Recommendation

Recommended next safest step: Owner may issue a Codex audit prompt after OpenCode implementation. If audit passes, Owner may decide whether Phase 1P-U can proceed to finalization. Phase 1P-T remains held until this reconciliation path is resolved.
