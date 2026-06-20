# PNPD Agent Orchestration Control Loop

## 1. Purpose

This document defines the PNPD-OS agent orchestration control loop.

It covers:

- agent role boundaries
- approved handoff flow
- authority gates
- stop conditions
- canonical verification
- future controlled unlock relationship

PNPD-OS is an AI-assisted software delivery framework for building, governing, validating, coordinating, and scaling SaaS/product systems through controlled agent workflows.

This document is governance-only. It does not implement any new runtime, automation, connector, dashboard, daemon, deployment, or mutation behavior.

## 2. Current baseline

- Repo: `Lanretech-debug/pnpd-os`
- Branch: `main`
- Current repo delivery baseline: `PHASE_1O_Z_CAPABILITY_MAP_RECONCILIATION_PUSHED_CI_GREEN`
- Current baseline commit: `87195af09ce64ac5c3ee463d72bba2833e4edbcf`
- Remote CI run: `27873620135`
- Remote CI conclusion: `success`
- Known local untracked files: `.DS_Store`, `.kunsdd/`, `index.html`

Context:

- Implementation capability baseline is Phase 1O-Y.
- Repo delivery baseline is Phase 1O-Z.
- Controlled Unlock capabilities are planned, gated, sequenced future implementations, not immediate authority.

## 3. Agent role matrix

### Hermes

| Field | Value |
|---|---|
| **Allowed actions** | design, recommendation, structured planning, high-authority docs drafting |
| **Forbidden actions** | implementation, merge, push, GitHub/API mutation, direct repo mutation, deployment, certification, authority grant |
| **Required evidence** | fresh session or Hermes Terminal / raw CLI for high-authority design; section-count validation; no semantic duplication; no truncation; clear Next Safest Step |
| **Stop conditions** | duplicated semantic sections, truncated output, missing required sections, invented implementation authority, stale or reused Telegram session for high-authority output |

### Owner

| Field | Value |
|---|---|
| **Allowed actions** | approve, amend, reject, define implementation scope, grant explicit Codex audit/finalize authority, restate non-duplicated substance from a failed Hermes output |
| **Forbidden actions** | none as final authority, but Owner decisions must still be captured explicitly for auditability |
| **Required evidence** | approval, amendment, or rejection statement; exact branch and full commit SHA when authorizing Codex; allowed file list; forbidden file list where relevant |
| **Stop conditions** | ambiguity in branch, commit, file scope, or authority |

### DeepSeek GUI

| Field | Value |
|---|---|
| **Allowed actions** | implement Owner-approved scope, create branch, edit approved files only, run gates, commit approved changes, produce amber report |
| **Forbidden actions** | push by default, merge by default, scope expansion, modifying forbidden files, inventing authority, bypassing Codex audit, bypassing Owner approval |
| **Required evidence** | branch, base commit, commit SHA, files changed, scope result, gates run, dry-run result, known untracked files, push status, merge status, next safest step |
| **Stop conditions** | scope drift, gate failure, baseline mismatch, generated state leak, forbidden file change, unapproved authority claim |

### Codex

| Field | Value |
|---|---|
| **Allowed actions** | audit exact branch, audit exact full commit SHA, run gates, fast-forward merge if explicitly authorized and green, push main only when explicitly authorized, observe remote CI, report final result |
| **Forbidden actions** | merge/push without `AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED`, short-SHA authorization, scope expansion, non-fast-forward merge unless separately authorized, force push, tag creation, branch deletion, implementation beyond audit/finalize scope |
| **Required evidence** | exact branch, exact full commit SHA, merge-base check, changed-file scope, content audit, compatibility gates, state gates, security/governance scan, remote CI observation, final report |
| **Stop conditions** | commit mismatch, baseline moved, scope drift, audit failure, fast-forward merge failure, push failure, remote CI red |

### GitHub App

| Field | Value |
|---|---|
| **Allowed actions** | external verification, commit metadata verification, compare verification, changed-file scope verification, final file content verification, GitHub Actions job verification |
| **Forbidden actions** | authority grant, implementation, substitution for Owner approval, substitution for Codex audit |
| **Required evidence** | commit metadata, compare against previous baseline, changed-file scope, final file content on main when relevant, GitHub Actions workflow/job conclusion, legacy combined status noted if empty or unavailable |
| **Stop conditions** | scope mismatch, CI mismatch, missing commit, missing final file, unexpected changed files, verification unavailable without fallback evidence |

### AgentBridge

| Field | Value |
|---|---|
| **Allowed actions** | coordinate, carry handoff context, route status between agents, preserve control-loop state |
| **Forbidden actions** | approval authority in current state, dispatch, deployment, merge, push, GitHub/API mutation, Owner/Codex bypass, production certification |
| **Required evidence** | coordination records, handoff context, phase references, authority boundaries |
| **Stop conditions** | approval claim, dispatch claim, deployment claim, bypass claim, authority escalation before Phase 1S-A |

### Future internal daemon/dashboard

| Field | Value |
|---|---|
| **Allowed actions** | future internal operator-control-plane design only; future visibility into repo state, CI state, pending approvals, handoffs, adoption state, and agent connector status |
| **Forbidden actions in current state** | implementation, public SaaS dashboard claim, automatic deployment by default, uncontrolled GitHub/API mutation, Owner bypass, production certification |
| **Required future evidence** | connector handoff records, dashboard-visible state, audit trail, policy-bound authority model after appropriate phases |
| **Stop conditions** | public-surface claim, auto-deployment claim, uncontrolled mutation claim, authority bypass before delegated-authority design |

### Teach Skills / Obsidian / Teach Skill Studio

| Field | Value |
|---|---|
| **Allowed actions** | roadmap categorisation, future controlled design, future coordination under control loop |
| **Forbidden actions in Phase 1P-A** | implementation, integration, connector creation, skill execution, autonomous authority |
| **Required evidence** | Phase 1P-G categorisation, roadmap linkage, future design scope |
| **Stop conditions** | implementation claim in this phase, autonomous authority claim, dashboard integration claim before design |

## 4. Authority model

Owner is final authority.

Hermes is design/recommendation only.

DeepSeek GUI is implementation only for approved scope.

Codex is audit/finalize only when explicitly authorized.

GitHub App is external verification only.

AgentBridge coordinates only in current state.

Future daemon/dashboard must respect the control loop.

Teach Skills, Obsidian, and Teach Skill Studio are active roadmap categories, not current authority surfaces.

Required authority phrase for Codex finalization: `AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED`

Rules:

- No short-SHA authorization.
- No implied standing Codex merge authority.
- No standing GitHub/API mutation authority.
- No model/provider switch removes validation requirements.
- No reused Telegram Hermes session for high-authority design.
- No Owner/Codex bypass before delegated-authority design.
- No AgentBridge approval authority before Phase 1S-A.

## 5. Canonical lifecycle

### A. Baseline verification

- **Purpose:** Confirm current canonical baseline before any phase work begins.
- **Required input:** previous canonical baseline commit SHA, remote CI evidence.
- **Required output:** verified baseline commit, CI run, changed-file scope.
- **Stop conditions:** baseline mismatch, CI red, unexpected changed files.

### B. Hermes design

- **Purpose:** Produce structured design output for Owner review.
- **Required input:** current baseline, phase scope constraints.
- **Required output:** design document with required sections, verdict, and Next Safest Step.
- **Stop conditions:** duplicated sections, truncated output, missing sections, invented authority.

### C. Owner decision

- **Purpose:** Approve, amend, or reject design and define implementation scope.
- **Required input:** Hermes design output, current baseline.
- **Required output:** approval/amendment/rejection statement, allowed files, forbidden files, scope boundaries.
- **Stop conditions:** ambiguous scope, missing commit references, unclear authority.

### D. DeepSeek GUI implementation

- **Purpose:** Implement Owner-approved scope in a feature branch.
- **Required input:** Owner-approved scope, allowed file list, forbidden file list, baseline commit.
- **Required output:** feature branch, committed changes on approved files only, amber report.
- **Stop conditions:** scope drift, gate failure, forbidden file modification, generated state leak.

### E. DeepSeek amber report

- **Purpose:** Report implementation results for Codex audit.
- **Required input:** branch, commits, gates run, files changed.
- **Required output:** structured amber report with all required fields.
- **Stop conditions:** incomplete report, missing evidence, gate failure.

### F. Owner Codex authorization

- **Purpose:** Authorize Codex to audit and finalize.
- **Required input:** exact branch, exact full commit SHA.
- **Required output:** authorization containing `AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED`.
- **Stop conditions:** short-SHA authorization, ambiguous branch/commit, missing authorization phrase.

### G. Codex audit

- **Purpose:** Audit implementation against approved scope.
- **Required input:** exact branch, exact full commit SHA, Owner authorization.
- **Required output:** audit report with all gate results.
- **Stop conditions:** commit mismatch, baseline moved, scope drift, audit failure.

### H. Codex fast-forward merge and push if green

- **Purpose:** Merge and push audited implementation to main.
- **Required input:** audit pass, fast-forward-capable branch, Owner authorization.
- **Required output:** merged main, pushed commit, remote CI triggered.
- **Stop conditions:** merge failure, push failure, non-fast-forward requirement.

### I. Remote CI observation

- **Purpose:** Observe GitHub Actions run for pushed commit.
- **Required input:** pushed commit SHA, CI workflow name.
- **Required output:** CI run ID, job conclusion.
- **Stop conditions:** CI red, CI timeout, CI unavailable.

### J. GitHub App verification

- **Purpose:** Externally verify pushed baseline.
- **Required input:** commit metadata, compare data, CI run evidence.
- **Required output:** verification pass/fail report.
- **Stop conditions:** scope mismatch, CI mismatch, missing evidence.

### K. Canonical baseline update

- **Purpose:** Update canonical baseline to new verified state.
- **Required input:** GitHub App verification pass, CI green, pushed commit.
- **Required output:** new canonical baseline recorded in docs.
- **Stop conditions:** verification failure, CI red, unresolved caveats.

## 6. Hermes intake gate

High-authority Hermes design requires:

- Hermes Terminal / raw CLI preferred.
- Fresh session required if Telegram is used.
- Section-count validation.
- No duplicated semantic sections.
- No truncation.
- Required final Next Safest Step.
- Telegram split markers tolerated only if semantic content is not duplicated.
- Duplicated output rejected unless Owner amends/restates the non-duplicated substance.

Changing Hermes model/provider to DeepSeek does not by itself prove duplication/truncation is fixed. The output path still requires fresh-session, section-count, no-truncation, and Owner review.

## 7. DeepSeek implementation gate

DeepSeek must:

- start from approved baseline
- create approved branch
- modify only approved files
- preserve known untracked files untouched
- run required gates
- commit only after gates pass
- not push
- not merge
- produce amber report

Amber report must include:

1. Verdict
2. Branch
3. Base commit
4. Commit
5. Files changed
6. Scope result
7. Content result
8. Forbidden implementation result
9. Gates run
10. dry-run result
11. Known untracked files
12. Push status
13. Merge status
14. Next safest step

## 8. Codex audit gate

Codex must verify:

- exact branch
- exact full commit SHA
- merge-base against current main
- changed-file scope
- content requirements
- forbidden file drift
- package/workflow/code/schema/fixture state
- compatibility gates
- state gates
- security/governance scan

Codex may only merge/push when:

- `AUDIT_AND_FINALIZE_IF_GREEN_AUTHORIZED` is present
- all gates pass
- merge is fast-forward only
- no baseline drift exists

Codex must stop on:

- commit mismatch
- baseline moved
- scope drift
- audit failure
- merge failure
- push failure
- remote CI red

## 9. GitHub App canonical verification gate

A pushed result becomes canonical only after GitHub App verification.

Required verification:

- commit metadata
- compare against previous baseline
- changed-file scope
- final file content on main when relevant
- GitHub Actions workflow/job conclusion
- legacy combined status noted if empty or unavailable

GitHub App verification does not replace Owner approval or Codex audit.

## 10. Failure verdict taxonomy

### Hermes verdicts

- `HERMES_OUTPUT_REJECTED_AS_DUPLICATED_CONTEXT_CONTAMINATION`
- `HERMES_OUTPUT_REJECTED_AS_TRUNCATED`
- `HERMES_OUTPUT_ACCEPTED_WITH_OWNER_AMENDMENT`

### DeepSeek verdicts

- `DEEPSEEK_SCOPE_DRIFT_BLOCKED`
- `DEEPSEEK_GATES_FAILED`
- `DEEPSEEK_COMMITTED_AMBER_NOT_CODEX_AUDITED`

### Codex verdicts

- `CODEX_PHASE_X_BLOCKED_COMMIT_MISMATCH`
- `CODEX_PHASE_X_BLOCKED_BASELINE_MOVED`
- `CODEX_PHASE_X_BLOCKED_SCOPE_DRIFT`
- `CODEX_PHASE_X_AUDIT_FAILED`
- `CODEX_PHASE_X_AUDIT_PASS_MERGE_BLOCKED`
- `CODEX_PHASE_X_MERGED_PUSH_BLOCKED`
- `PHASE_X_PUSHED_CI_GREEN`
- `PHASE_X_PUSHED_CI_RED`

### GitHub App verdicts

- `GITHUB_APP_VERIFICATION_PASS`
- `GITHUB_APP_VERIFICATION_BLOCKED`
- `GITHUB_APP_VERIFICATION_SCOPE_MISMATCH`
- `GITHUB_APP_VERIFICATION_CI_MISMATCH`

## 11. Controlled Unlock relationship

This control loop governs all future Controlled Unlock phases, including:

- AgentBridge delegated authority
- GitHub/API mutation
- daemon/watcher
- internal dashboard
- installer
- release packaging
- dispatch execution
- deployment control
- production-readiness certification
- runtime consumption of Product Delivery artifacts
- automated Product Delivery artifact generation
- live Product Delivery Registry writer
- artifact hash validation after path-design
- Teach Skills / Obsidian / Teach Skill Studio implementation categories

Controlled Unlock does not mean immediate implementation. Each future unlock requires its own design, Owner approval, scoped implementation, Codex audit, GitHub App verification, and canonical baseline update.

## 12. Future daemon/dashboard implications

The future internal daemon/dashboard must:

- coordinate Codex, Hermes, and DeepSeek GUI connectors
- display agent handoffs
- display current phase baseline
- display repo state
- display CI state
- display pending approvals
- display project adoption state
- display Teach Skills / Obsidian / Teach Skill Studio categories
- preserve audit trails
- remain internal-use only in first implementation

It must not:

- create public SaaS dashboard claims in first implementation
- auto-deploy by default
- mutate GitHub/API without controlled mutation design
- bypass Owner authority without delegated-authority design
- certify production readiness automatically

## 13. Teach Skills and Obsidian implications

Teach Skills, Obsidian, and Teach Skill Studio are:

- not blocked
- active roadmap categories
- governed by the control loop
- future Phase 1P-G categorisation subjects

Map categories:

- Obsidian: Knowledge and Memory Layer
- Teach Skills: Skill Authoring Layer
- Teach Skill Studio: Skill design, testing, validation, and reuse layer
- All three: Operator Training Layer, Agent Instruction Layer, Project Reuse Layer, Dashboard-visible capability category

No implementation in Phase 1P-A.

## 14. Non-goals

Phase 1P-A does not:

- implement AgentBridge authority
- implement GitHub/API mutation
- implement daemon/watcher
- implement dashboard
- implement Teach Skills
- implement Obsidian integration
- implement Teach Skill Studio
- implement project profile schema
- implement installer
- implement dispatch
- implement deployment
- implement certification
- modify package.json
- modify CI workflow
- modify runtime code
- modify validator code
- modify schemas
- modify fixtures
- modify current capability map unless separately authorized

## 15. Verification commands

Commands to verify repo remains stable during this docs-only phase:

```bash
git diff --name-only
git diff --check
git diff -- package.json
git diff -- .github/workflows/pnpd-ci.yml
git diff -- scripts
git diff -- .pnpd
git diff -- tests
git diff -- templates

node --check scripts/pnpd-validate-schemas.mjs
node --check scripts/pnpd-product-delivery-registry-write.mjs
node --check scripts/pnpd-orchestrator-dry-run.mjs

npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test

test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks
```

## 16. Status of this document

This document is governance-only.

It creates no execution capability.
It creates no connector.
It creates no dashboard.
It creates no daemon.
It creates no mutation authority.
It creates no deployment authority.
It creates no certification authority.
