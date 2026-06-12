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
| `OWNER_REVIEW_REQUIRED` | Owner decision or approval is required. | Owner decides approve/patch/reject. |
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
| `OWNER_REVIEW_REQUIRED` | `CODEX_APPROVED` or owner decision pending |
| `DONE` | `CLOSED` |
| `BLOCKED` | `BLOCKED` |
| `WONTFIX` | `CLOSED` with rationale |

The Orchestrator may recommend a mapping, but only the relevant authority layer can record the actual gate result.
