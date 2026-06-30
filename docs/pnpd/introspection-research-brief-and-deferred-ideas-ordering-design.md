# PNPD Introspection Research Brief And Deferred Ideas Ordering Design

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

Phase 1P-P designs the idea ordering layer for introspection, research briefs, deferred ideas, blocked ideas, newly unblocked ideas, rejected ideas, and next capability candidates. It defines how introspection findings, research briefs, deferred ideas, blocked ideas, newly unblocked ideas, rejected ideas, and next capability candidates are ordered, classified, and governed. This phase creates a docs-only design for the idea ordering layer.

Key concepts:
- idea ordering layer
- introspection findings
- research briefs
- deferred ideas
- blocked ideas
- newly unblocked ideas
- rejected ideas
- next capability candidates
- docs-only design

## Baseline

Base commit: 91ffd8660c8a8f05fb7a47aba372cea8973ae484
origin/main: 91ffd8660c8a8f05fb7a47aba372cea8973ae484
Remote CI run: 28428396367
Remote CI conclusion: success
Windows is the active PNPD-OS workstation
Mac PNPD-OS is fallback/read-only unless Owner explicitly authorizes Mac PNPD-OS work
JobToCash remains active on Mac

## Problem Statement

Without a formal idea ordering layer, capabilities, research findings, and deferred concepts accumulate without governance. Ideas may drift between lanes without evidence, research briefs may be mistaken for implementation prompts, blocked ideas may resurface without unblocking evidence, and rejected ideas may return as zombie tasks. PNPD-OS requires an idea ordering model that classifies every candidate by lane, requires evidence for lane transitions, and prevents drift.

## Introspection Research Brief Model

The Introspection Research Brief (INTROSPECTION_RESEARCH_BRIEF) defines a structured record for capturing observations, insights, risks, and decisions that arise during agent sessions and phase work. Each brief includes:

purpose
source
context
problem_observed
insight_captured
evidence_strength
affected_phase
affected_agent
risk_category
decision_needed
recommendation
status
next_safest_step

Statuses:

introspection
research_brief
design_input
implementation_prompt
audit_evidence
finalization_evidence

Governance rules:

Research briefs are not implementation prompts.
Implementation prompts require explicit Owner approval and a complete PNPD task contract.
Audit evidence must come from Codex audit output, CI evidence, or verified GitHub/App evidence.
Finalization evidence must include merge, push, remote CI success, and Owner/GitHub App verification.

## Idea Ordering Model

The Idea Ordering model defines eight lanes that every candidate idea or capability must be classified into. Each lane has defined meaning, entry criteria, exit criteria, allowed agent action, forbidden agent action, required evidence, required Owner decision, and next safest step.

### NOW

meaning: Highest-priority candidate after Owner approval and complete PNPD task contract
entry criteria: Owner approval, complete PNPD task contract, clear scope, clean gates
exit criteria: Implementation commit, Codex audit pass, merge, push, CI success, Owner/GitHub verification
allowed agent action: Implement from approved design with complete task contract
forbidden agent action: Execute without Owner approval and complete task contract
required evidence: Hermes design, Owner approval, Codex audit, CI success, GitHub verification
required Owner decision: Explicit approval of implementation scope and task contract
next safest step: Create implementation branch and complete PNPD task contract

NOW does not mean automatically executable.
NOW means highest-priority candidate after Owner approval and complete PNPD task contract.
Ideas are not executable merely because they are useful.

### NEXT

meaning: Priority candidate awaiting Owner decision or dependency resolution
entry criteria: Identified as valuable, dependency partially satisfied, design may be needed
exit criteria: Owner decision to promote to NOW
allowed agent action: Research, design, gather evidence
forbidden agent action: Implement without Owner approval
required evidence: Design document, dependency analysis, risk assessment
required Owner decision: Decision to promote to NOW or defer
next safest step: Prepare design and gather dependency evidence

### DEFERRED

meaning: Known valuable but not actionable now due to dependency, priority, or capacity
entry criteria: Owner decision to defer, clearly identified reason
exit criteria: Revisit trigger fires and Owner agrees to reassess
allowed agent action: Log, monitor revisit trigger, maintain awareness
forbidden agent action: Implement without reassessment and Owner approval
required evidence: Deferral reason, dependency, priority score, revisit trigger
required Owner decision: Agreement to defer and set revisit trigger
next safest step: Document deferral and set revisit trigger

### BLOCKED

meaning: Cannot proceed due to unresolved dependency, missing authority, or unverified evidence
entry criteria: Identified blocker with no clear resolution path
exit criteria: Blocking dependency resolved, evidence gathered, Owner decision to unblock
allowed agent action: Gather unblocking evidence, design resolution plan
forbidden agent action: Treat as unblocked without unblocking evidence and Owner decision
required evidence: Blocking reason, required unblocking evidence, current status
required Owner decision: Decision to unblock or maintain blocked
next safest step: Gather unblocking evidence, seek Owner decision

### UNBLOCKED

meaning: Previously blocked idea whose blocking dependency has been resolved
entry criteria: Blocking dependency satisfied, evidence gathered, Owner decision to unblock
exit criteria: Placed into appropriate lane (NOW, NEXT, DEFERRED, etc.)
allowed agent action: Propose lane placement, update record
forbidden agent action: Self-certify as NOW without Owner approval and task contract
required evidence: Evidence of unblocking, remaining risks, recommended lane
required Owner decision: Decision on lane placement
next safest step: Place into appropriate lane with Owner approval

### REJECTED

meaning: Evaluated and explicitly declined for adoption
entry criteria: Owner decision to reject with evidence
exit criteria: Reconsideration condition met (if any)
allowed agent action: Record rejection, monitor reconsideration condition
forbidden agent action: Reintroduce without Owner-defined reconsideration condition
required evidence: Rejection reason, evidence, decision authority
required Owner decision: Explicit rejection with reconsideration condition (if applicable)
next safest step: Record reason and reconsideration condition

### RESEARCH_ONLY

meaning: Requires evidence gathering, synthesis, and review before any lane promotion
entry criteria: Identified as potentially valuable but evidence insufficient
exit criteria: Evidence gathered and Owner agrees to promote to a decision lane
allowed agent action: Research, gather evidence, synthesize findings
forbidden agent action: Treat as implementation candidate without Owner approval
required evidence: Research findings, evidence quality assessment, recommendation
required Owner decision: Decision to promote, defer, block, or reject
next safest step: Complete research and present to Owner

### OWNER_TASTE_REQUIRED

meaning: Taste-sensitive decision that requires Owner or designated human taste authority
entry criteria: Taste-sensitive decision identified (TASTE_REQUIRED label)
exit criteria: Owner taste decision rendered
allowed agent action: Propose options, compare, explain, and imitate taste-sensitive options
forbidden agent action: Self-certify taste
required evidence: Options with analysis, taste comparison, recommendation
required Owner decision: Final taste decision
next safest step: Present options to Owner for taste decision

## Blocked Idea Model

The Blocked Idea (BLOCKED_IDEA) defines a structured record for ideas that cannot proceed due to unresolved dependencies, missing authority, or unverified evidence. Each blocked idea includes:

idea_name
blocked_reason
blocking_dependency
blocking_phase
evidence_required_to_unblock
agent_allowed_to_reassess
Owner_decision_required
unblocking_verdict
next_lane_after_unblocking

Verdicts:

PNPD_IDEA_BLOCKED
PNPD_IDEA_UNBLOCKED

## Deferred Idea Model

The Deferred Idea (DEFERRED_IDEA) defines a structured record for ideas that are known valuable but not actionable now due to dependency, priority, or capacity. Each deferred idea includes:

idea_name
deferral_reason
deferral_date_or_phase
dependency
priority_score
revisit_trigger
risk_if_ignored
risk_if_executed_early
next_review_phase

Verdict:

PNPD_IDEA_DEFERRED

## Rejected Idea Model

The Rejected Idea (REJECTED_IDEA) defines a structured record for ideas that have been evaluated and explicitly declined for adoption. Each rejected idea includes:

idea_name
rejection_reason
evidence
decision_authority
reconsideration_condition
status

Verdict:

PNPD_IDEA_REJECTED

Governance rule:

Rejected ideas must not return as zombie tasks without Owner-defined reconsideration conditions.

## Newly Unblocked Idea Model

The Newly Unblocked Idea (NEWLY_UNBLOCKED_IDEA) defines a structured record for ideas whose blocking dependency has been resolved. Each newly unblocked idea includes:

idea_name
previous_blocked_reason
dependency_now_satisfied
evidence_of_unblocking
current_lane
required_next_design_phase
required_implementation_gate
remaining_risks

Verdict:

PNPD_IDEA_UNBLOCKED_READY_FOR_ORDERING

## Priority Scoring Model

Ideas are scored using the following criteria:

- dependency readiness
- governance value
- drift reduction value
- implementation risk
- reversibility
- Owner urgency
- blocker removal value
- downstream unlock value

Scoring outputs:

P0_CRITICAL
P1_NEXT
P2_DEFERRED
P3_RESEARCH_ONLY
P4_REJECTED_OR_BLOCKED

## Candidate Idea Queue

Every known candidate idea or capability is classified below with its current lane and rationale.

actual local prompt asset creation

Lane: UNBLOCKED / NEXT/NOW_CANDIDATE
Rationale: Designed in Phase 1P-O, eligible for implementation once Owner issues a complete PNPD task contract.
Actual local prompt asset creation is UNBLOCKED and NEXT/NOW_CANDIDATE, but not executable until Owner issues a complete PNPD task contract.

governed learning capture

Lane: DEFERRED
Rationale: Valuable but requires prompt asset layer and idea ordering to be operational first.

Skeptic operationalization

Lane: DEFERRED
Rationale: Requires existing Skeptic role documentation to be reviewed and integrated.

Work Archetype Routing

Lane: DEFERRED
Rationale: Requires prompt asset layer and routing design before implementation.

portable plugin architecture

Lane: DEFERRED
Rationale: High-value but depends on prompt asset layer stability and agent session kernel maturity.
portable plugin architecture = DEFERRED

HTML output option

Lane: DEFERRED
Rationale: Nice-to-have output format, not a governance priority.
HTML output option = DEFERRED

AgentBridge authority

Lane: BLOCKED
Rationale: Blocked by design requirement and Owner decision. Not authorized without explicit design and canonical approval.
AgentBridge authority remains BLOCKED.

memory-provider due diligence

Lane: RESEARCH_ONLY / NOT_IMPLEMENTATION
Rationale: Requires evidence gathering, synthesis, review, and Owner approval through a complete PNPD task contract before any lane promotion.
Memory-provider due diligence is RESEARCH_ONLY until evidence is gathered and Owner approves any next lane.
Memory-provider due diligence is RESEARCH_ONLY / NOT_IMPLEMENTATION.
Memory-provider due diligence is research-only until evidence is gathered, synthesized, reviewed, and Owner approves any next lane through a complete PNPD task contract.

introspection research brief ledger

Lane: DEFERRED
Rationale: Requires this design to be canonical before creating actual ledger files.

deferred idea ledger

Lane: DEFERRED
Rationale: Requires this design to be canonical before creating actual ledger files.

blocked idea ledger

Lane: DEFERRED
Rationale: Requires this design to be canonical before creating actual ledger files.

reconciliation prompt asset

Lane: DEFERRED
Rationale: Requires prompt asset layer implementation before creation.

Owner decision prompt asset

Lane: DEFERRED
Rationale: Requires prompt asset layer implementation before creation.

blocked-state prompt asset

Lane: DEFERRED
Rationale: Requires prompt asset layer implementation before creation.

Non-adopted memory-provider reference cleanup

Lane: NOW / GOVERNANCE_CORRECTION
Rationale: HINDSIGHT, HONSHO, and HONCHO must be explicitly classified as non-adopted references to prevent accidental roadmap inclusion.
Non-adopted memory-provider reference cleanup = NOW / GOVERNANCE_CORRECTION

Obsidian human-facing memory/workbench

Lane: UNBLOCKED / ALREADY_SELECTED_HUMAN_MEMORY_LAYER
Rationale: Owner-selected human-facing memory/workbench layer.
Obsidian is the human-facing PNPD-OS memory/workbench layer.

Microsoft study synthesis

Lane: RESEARCH_INPUT / ALREADY_STUDIED
Rationale: Microsoft Learn modules studied and applied as research inputs.
Microsoft study modules are research inputs, not implementation prompts.

Memory-provider reference classification:

HINDSIGHT / HONSHO / HONCHO = NON_ADOPTED_REFERENCE / DO_NOT_ADOPT / DO_NOT_ROADMAP
HINDSIGHT, HONSHO, and HONCHO are non-adopted reference terms, not PNPD-OS memory providers.
HINDSIGHT / HONSHO / HONCHO must not appear as adopted, deferred, blocked-but-planned, or roadmap memory providers.

## Corrected Memory Model

The corrected PNPD-OS memory model is:

Obsidian = human-facing PNPD-OS memory/workbench layer
GitHub = canonical committed-state authority
Microsoft Learn modules = research inputs that influenced PNPD-OS governance, orchestration, memory/state/evaluation thinking
HINDSIGHT / HONSHO / HONCHO = non-adopted reference terms from a prior memory-provider question
Agent autonomous memory = blocked pending explicit design and Owner approval
External memory provider integration = blocked pending explicit design, due diligence, and Owner approval

Obsidian-specific rules:

Obsidian is Owner-operated and human-readable.
Obsidian does not grant agents autonomous memory authority.
Obsidian does not authorize runtime memory integration.
Obsidian does not authorize external agent memory provider use.
Obsidian vault path verification remains required before any active repository or automation integration.

## Microsoft Study Source Treatment

Microsoft Learn modules studied by the Owner are classified as:

STUDY_SOURCE_MATERIAL
RESEARCH_INPUTS

Research applications:

Microsoft governance, guardrails, and operations research is a research input for risk-based autonomy, human-in-the-loop approvals, least-privilege controls, observability, auditability, and operational reliability.
Microsoft multi-agent orchestration research is a research input for agent responsibility boundaries, workflow orchestration, branch/workflow/permission isolation, conflict resolution, attribution, handoffs, and recovery.
Microsoft memory, state, and evaluation research is a research input for short-term memory, long-term memory, external memory, persistent state, context drift, state across tools, evaluation signals, and quality gates.

Governance rules:

Microsoft research inputs do not authorize implementation.
Research briefs are not implementation prompts.

Microsoft study modules do not authorize:

- runtime authority
- schema authority
- validator authority
- CI authority
- AgentBridge authority
- external memory provider approval
- implementation authorization

## No-Drift Rule

The following rules prevent idea ordering drift:

- No idea may move from deferred, blocked, research-only, or rejected into implementation without an explicit Owner decision and a complete PNPD task contract.
- Ideas are not executable merely because they are useful.
- Research briefs are not implementation prompts.
- No lane promotion without evidence.
- No treating blocked ideas as unblocked without unblocking evidence.
- Human-facing memory and agent autonomous memory are separate lanes.
- No external memory provider may be adopted without explicit Owner approval and a complete PNPD task contract.
- No memory-related idea may enter implementation merely because it was mentioned in prior discussion.

## Relationship To Prior Phases

1P-M defines the execution contract.
1P-N defines the session kernel.
1P-O defines the prompt asset layer.
1P-P defines the idea ordering layer.

Phase 1P-M created the Unified Execution Plan and Taste Gate model.
Phase 1P-N created the Agent Session Kernel and Boot Protocol.
Phase 1P-O created the skills-local prompt assets and boot handoff design.
Phase 1P-P orders introspection, research briefs, deferred ideas, blocked ideas, unblocked ideas, and next capability candidates.

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

Phase 1P-P does not authorize:

- runtime implementation
- schema changes
- validator additions
- fixture additions
- CI enforcement
- registry writes
- generated state
- actual idea ledger creation
- actual research brief files
- actual prompt asset files
- skills directory creation
- plugins directory creation
- plugin manifest
- AgentBridge authority
- autonomous agent memory
- external memory provider integration
- Obsidian vault integration
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
| Idea skips ordering | Idea enters implementation without lane classification | Every idea must be classified into a lane before work |
| Deferred idea resurfaces without context | Deferred idea returns without deferral context | Deferred idea record with revisit trigger and dependency |
| Blocked idea treated as unblocked | Idea moves forward without unblocking evidence | Blocked idea model requires evidence and Owner decision |
| Research brief becomes implementation prompt | Research finding treated as executable task | Research briefs are not implementation prompts |
| Rejected idea returns as zombie task | Rejected idea reintroduced without reconsideration condition | Rejected idea model requires reconsideration condition |
| Low-priority idea gains loudness | Low-priority idea promoted through repetition rather than evidence | Priority scoring model with defined criteria |
| Agent self-certifies taste | Agent makes taste-sensitive decision without Owner | TASTE_REQUIRED label mandatory; agents must not self-certify taste |
| AgentBridge authority creeps in | Agent uses AgentBridge without design approval | AgentBridge remains BLOCKED |
| Lane promotion without contract | Idea moves lane without complete PNPD task contract | No lane promotion without evidence; no execution without contract |
| Introspection findings lost | Observations and insights are not captured | Introspection Research Brief model with defined fields |
| NOW interpreted as automatic execution | Agent executes NOW idea without Owner approval | NOW does not mean automatically executable |
| Memory-provider research treated as implementation | Research on memory providers treated as adoption | Memory-provider due diligence = RESEARCH_ONLY / NOT_IMPLEMENTATION |
| Mentioned memory provider becomes accidental roadmap item | Casual mention treated as planned adoption | HINDSIGHT/HONSHO/HONCHO = NON_ADOPTED_REFERENCE / DO_NOT_ADOPT / DO_NOT_ROADMAP |
| Human-facing memory confused with agent autonomous memory | Obsidian treated as agent memory system | Human-facing memory and agent autonomous memory are separate lanes |
| Microsoft study source treated as implementation authority | Research inputs treated as authorization | Microsoft research inputs do not authorize implementation |

## Future Implementation Gates

Before any future implementation commit, the following gates must be run.

File scope gate:

`ash
git diff --name-only
`

Expected only:

docs/pnpd/introspection-research-brief-and-deferred-ideas-ordering-design.md

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

DEEPSEEK_PHASE_1P_P_INTROSPECTION_RESEARCH_BRIEF_AND_DEFERRED_IDEAS_ORDERING_COMMITTED_AMBER_NOT_CODEX_AUDITED

The final report must include these fields:

- Verdict
- Branch
- Base commit
- Commit
- Files changed
- Introspection Research Brief result
- Idea Ordering result
- Blocked Idea result
- Deferred Idea result
- Rejected Idea result
- Newly Unblocked Idea result
- Priority Scoring result
- Candidate Idea Queue result
- Corrected Memory Model result
- Microsoft Study Source Treatment result
- No-Drift Rule result
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

Phase 1P-P becomes canonical only after:

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
