# PNPD Orchestrator State Machine

> Status: Phase 0 scaffold, AMBER_NOT_CODEX_AUDITED

The Orchestrator state model classifies work so agents can decide what to inspect next. It does not grant authority to advance work past PNPD review gates.

## States

| State | Meaning | Typical Next Action |
| --- | --- | --- |
| `DISCOVERED` | Work or repo signal found but not classified. | Triage scope and evidence. |
| `NEEDS_TRIAGE` | Signal exists but needs human or verifier triage. | Hermes verifies state and scope. |
| `NEEDS_INFO` | Required evidence is missing. | Request missing context. |
| `READY_FOR_AGENT` | Work is scoped and safe to hand to an implementation agent. | Prepare DeepSeek handoff. |
| `DISPATCHED` | Work has been handed to an agent. | Wait for agent report. |
| `IN_PROGRESS` | Agent is actively working. | Monitor lock and handoff state. |
| `AGENT_DONE` | Agent reports work complete. | Route to verification. |
| `AUTOREVIEW_REQUIRED` | Local self-review gate is needed. | Run available autoreview/check gate. |
| `CODEX_REVIEW_REQUIRED` | Formal Codex audit is required. | Route to Codex with full evidence. |
| `OWNER_REVIEW_REQUIRED` | Owner decision or approval is required. Must carry `pending_owner_decision_type` to discriminate the awaited decision (e.g., `owner_pr_authorization`, `owner_merge_authorization`, `cancellation`, `accept_caveat`, `override_gate`). | Owner decides approve/patch/reject. |
| `APPROVED_FOR_MERGE` | Owner has approved merge after required gates. | Merge may occur outside AgentBridge authority. |
| `DONE` | No current action is needed. | Keep durable record. |
| `BLOCKED` | Work cannot proceed. | Record blocker and stop advancement. |
| `WONTFIX` | Work is intentionally not pursued. | Record rationale. |

## Phase 0 Transition Rules

Phase 0 dry-run may only propose transitions. It must never write task state as passed, dispatched, approved, merged, or done on behalf of an authority layer.

Allowed dry-run recommendations:

| From | Recommended To | Required Evidence |
| --- | --- | --- |
| `DISCOVERED` | `NEEDS_TRIAGE` | Repo signal and reason. |
| `NEEDS_TRIAGE` | `NEEDS_INFO` | Missing evidence list. |
| `NEEDS_TRIAGE` | `READY_FOR_AGENT` | Clean repo, scoped task, no blocked gates. |
| `READY_FOR_AGENT` | `CODEX_REVIEW_REQUIRED` | Review item or audit gate required. |
| Any | `OWNER_REVIEW_REQUIRED` | Protected branch, approval gate, or ambiguous risk. |
| Any | `BLOCKED` | Missing repo, non-Git path, lock conflict, or unsafe gate. |
| Any | `DONE` | No pending task and all inspected gates are clear. |

Every transition to `OWNER_REVIEW_REQUIRED` MUST record `pending_owner_decision_type` with one of: `owner_pr_authorization`, `owner_merge_authorization`, `cancellation`, `accept_caveat`, `override_gate`. A missing or ambiguous `pending_owner_decision_type` blocks the transition.

When the Owner fulfills the pending decision, the resulting Orchestrator state and AgentBridge state depend on the decision type:

| `pending_owner_decision_type` | Owner Decides → Orchestrator State | Owner Decides → AgentBridge State |
|---|---|---|
| `owner_pr_authorization` | `APPROVED_FOR_MERGE`*, or return to `OWNER_REVIEW_REQUIRED` if conditions unmet | `OWNER_PR_AUTHORIZED` (if approved); `REQUEST_CHANGES` or `BLOCKED` otherwise |
| `owner_merge_authorization` | `APPROVED_FOR_MERGE` | `OWNER_MERGE_APPROVED` (if approved); `REQUEST_CHANGES` or `BLOCKED` otherwise |
| `cancellation` | `DONE` or `BLOCKED` | `CANCELLED` (only when pre-merge and Owner cancellation contract complete) |
| `accept_caveat` | `OWNER_REVIEW_REQUIRED` (if further authorization needed) or `APPROVED_FOR_MERGE` | Followed by `owner_merge_authorization` or `owner_pr_authorization` as needed |
| `override_gate` | `OWNER_REVIEW_REQUIRED` (if further authorization needed) or `APPROVED_FOR_MERGE` | Followed by the appropriate authorization decision |

\* `APPROVED_FOR_MERGE` means the Orchestrator classifies the work as approved; actual merge execution and post-merge obligations are governed by `docs/agent-bridge/TASK_LEDGER.md` and `docs/agent-bridge/POST_MERGE_QUEUE.md`.

Forbidden Phase 0 transitions:

- `READY_FOR_AGENT` to `DISPATCHED`
- `CODEX_REVIEW_REQUIRED` to `APPROVED_FOR_MERGE`
- `OWNER_REVIEW_REQUIRED` to `APPROVED_FOR_MERGE`
- any state to `DONE` when a gate is failed, skipped without reason, or ambiguous
- any state to merge/deploy behavior

## Relationship To AgentBridge Task Ledger

The Orchestrator state model is a front-door classification layer. It does not replace `docs/agent-bridge/TASK_LEDGER.md`.

Mapping guidance:

| Orchestrator State | AgentBridge State |
| --- | --- |
| `DISCOVERED` | `PROPOSED` |
| `NEEDS_TRIAGE` | `PROPOSED` or `ROUTED` |
| `READY_FOR_AGENT` | `ROUTED` |
| `IN_PROGRESS` | `IN_PROGRESS` |
| `AGENT_DONE` | `IMPLEMENTED` or `SELF_REVIEWED` |
| `CODEX_REVIEW_REQUIRED` | `CODEX_AUDIT_REQUESTED` |
| `OWNER_REVIEW_REQUIRED` | `CODEX_AUDIT_COMPLETED` or owner decision pending |
| `DONE` | `CLOSED` only when the Gate 11 closure contract below is complete |
| `BLOCKED` | `BLOCKED` |
| `WONTFIX` | `CANCELLED` only when the Owner cancellation contract below is complete |

The Orchestrator may recommend a mapping, but only the relevant authority layer can record the actual gate result.

### Evidence-Gated Terminal Mapping

`DONE` may recommend `CLOSED` only when all of the following are recorded:

- `current_state: BRANCH_CLEANUP`
- `gate_11_evidence_complete: true`
- `exactly_one_cleanup_outcome_verified: true`
- `lane_closure_ready: true`
- `blocking_findings: none`
- `owner_closure_decision_recorded: true`

If any field is missing or false, the Orchestrator must not recommend `CLOSED`.
It must recommend `BLOCKED` or `OWNER_DECISION_REQUIRED`, as appropriate.
Generic executor completion, successful validation, merge completion, or
post-merge audit completion is not sufficient for `CLOSED` and is not a
substitute for Gate 11 evidence.

`WONTFIX` may recommend `CANCELLED` only when the last valid AgentBridge state is
an eligible pre-merge cancellation state, no merge occurred, explicit Owner
cancellation authority and complete cancellation evidence are recorded, required
safety cleanup is recorded, and `next_state: CANCELLED`. If that evidence is
incomplete, recommend `OWNER_DECISION_REQUIRED` or `BLOCKED`; do not recommend
`CANCELLED`. If the lane is `MERGED` or later, cancellation is forbidden and the
remaining post-merge obligations continue. See
`docs/agent-bridge/TASK_LEDGER.md` for the authoritative transition contracts.
