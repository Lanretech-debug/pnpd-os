# ADR: PNPD Orchestrator Loop Phase 0

> Status: Phase 0 scaffold, AMBER_NOT_CODEX_AUDITED
> Date: 2026-06-12
> Scope: PNPD OS / AgentBridge

## Decision

PNPD OS may define a safe Orchestrator Loop foundation that coordinates repo inspection, task classification, handoff preparation, and review escalation. Phase 0 is limited to documentation, schemas, example configuration, and a dry-run CLI scaffold.

The Orchestrator may coordinate and recommend; it may not approve, merge, deploy, or bypass gates.

## Non-Goals

Phase 0 does not implement:

- a daemon or forever-running scheduler
- a 5-minute wake loop
- automatic merge
- automatic deployment
- GitHub write actions
- secret reads, secret movement, or secret inference
- owner approval simulation
- Codex audit self-certification
- project-specific repo assumptions in runtime code

## Governance Boundary

AgentBridge remains communication and state only. The Orchestrator Loop is a coordinator that reads configured repo state and produces deterministic briefs. It does not become a sixth authority.

Authority remains:

| Role | Authority |
| --- | --- |
| Owner | Final decision-maker |
| Codex | Formal audit, advisory to owner |
| Hermes | Operational verification and routing |
| DeepSeek | Implementation and self-review |
| AgentBridge | Communication/state only |
| Orchestrator Loop | Coordination/recommendation only |

## Phase 0 Loop Shape

The eventual loop is designed around these steps:

1. Wake on a configured schedule.
2. Load the repo registry.
3. Inspect each registered repo.
4. Check path existence and Git state.
5. Detect configured pending review metadata.
6. Classify work into a PNPD state.
7. Produce an agent-ready handoff brief.
8. Dispatch work only when all safety gates allow it.
9. Escalate ambiguous or risky work to owner/Codex.
10. Record externally authorized decisions and dry-run recommendations in durable handoff/state logs.

Phase 0 implements only steps 2 through 7 as dry-run output. Step 8 is disabled and printed as a blocked future capability.

## Inputs

The Orchestrator reads a repo registry matching `.pnpd/repos.schema.json`. Registry entries describe paths, protected branches, available gates, optional issue/PR metadata sources, and configured pending items.

Phase 0 metadata is intentionally local and declarative. It does not call GitHub APIs, mutate GitHub state, or infer secret-backed settings.

## Outputs

The dry-run CLI prints:

- registry summary
- per-repo path and Git status
- safety gate results
- classified state
- dispatch decision
- one next action
- agent-ready handoff preview

No files are written by the dry-run command.

## Safety Classification

Default result is conservative:

- Missing repo path: `BLOCKED`
- Non-Git path: `BLOCKED`
- Dirty tree: `NEEDS_TRIAGE`
- Protected branch work: `OWNER_REVIEW_REQUIRED`
- Pending Codex review item: `CODEX_REVIEW_REQUIRED`
- Pending owner decision: `OWNER_REVIEW_REQUIRED`
- No blockers and scoped work item present: `READY_FOR_AGENT`
- No work item and no blockers: `DONE`

Dispatch remains disabled in Phase 0, even when the classification is `READY_FOR_AGENT`.

## Future Scheduler

A future 5-minute wake loop must be a separate phase and require:

- threat model update
- owner approval
- lockfile design
- rate-limit and budget controls
- explicit max parallelism
- external action dry-run mode
- audit of all write-capable integrations

Until then, the Orchestrator is manually invoked and dry-run only.

## Decision Record

Phase 0 creates the foundation without changing the PNPD authority model. It makes the future loop auditable before it can act.
