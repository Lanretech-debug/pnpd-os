# PNPD AgentBridge

> **Communication & State Layer for PNPD-OS**
> Phase 1 — docs-only bootstrap
> Branch: `example-governance-branch`

---

## What PNPD AgentBridge Is

PNPD AgentBridge is a **repo-local, file-based structured communication and state layer** that formalises how agents (DeepSeek, Hermes, Codex, Owner) hand off work, record decisions, track task state, queue audits, and surface blockers.

It replaces the current manual copy-paste workflow with auditable, machine-readable and human-readable files committed to the repo.

It is an extension of PNPD-OS. It is **middleware between agents, not authority over them**.

---

## What PNPD AgentBridge Is Not

- ❌ Not a sixth authority.
- ❌ Not autonomous messaging.
- ❌ Not a replacement for AGENTS.md.
- ❌ Not a replacement for the Review & Audit Layer.
- ❌ Not a replacement for Codex, Hermes, or owner decisions.
- ❌ Not live MCP/A2A.
- ❌ Not deployment/runtime.
- ❌ Not CI/CD.
- ❌ Not silent background agent communication.

---

## Relationship to PNPD-OS

PNPD AgentBridge is the **Communication & State Layer** within PNPD-OS:

```
PNPD-OS Layers:
  Product Strategy Layer     — VertiForge, product docs
  Governance Layer           — AGENTS.md, governed skill evolution
  Communication & State Layer — PNPD AgentBridge (THIS)
  Review & Audit Layer       — Codex, Hermes, audit protocols
  Normalisation Layer        — Project tooling governance
```

---

## Relationship to Review & Audit Layer

- The **Review & Audit Layer** defines **who** reviews, **when**, and with **what authority**.
- **PNPD AgentBridge** defines **how** handoffs, verification, audit requests, decisions, blockers, and post-merge checks are **recorded**.

AgentBridge is the file protocol. The Review & Audit Layer is the authority framework the protocol serves.

---

## Authority Hierarchy

| Agent / Layer    | Role                          | Has Decision Authority? |
| ---------------- | ----------------------------- | ----------------------- |
| Owner            | Final decision-maker          | ✅ Yes — final          |
| Codex            | Formal auditor                | ⚠️ Advisory only        |
| Hermes           | Verifier and router           | ⚠️ Advisory only        |
| DeepSeek         | Implementation worker         | ❌ No                   |
| PNPD AgentBridge | Communication and state layer | ❌ No — transport only  |

**PNPD AgentBridge has zero decision authority.** It stores and routes structured state. It never certifies, approves, merges, or deploys.

---

## Storage Strategy

| Phase | Scope                            | Format                          |
| ----- | -------------------------------- | ------------------------------- |
| 1     | Protocol documentation (current) | Markdown in `docs/agent-bridge/` |
| 2     | Structured task state            | JSON in `.agent-bridge/`        |
| 3     | GitHub PR/Issue comment sync     | API integration                 |
| 4     | CLI helper                       | Shell/Python tool               |
| 5     | MCP/A2A adapter                  | Only after threat model         |

---

## Phase 1 Scope (Current)

Phase 1 delivers the **protocol documentation only**:

| File                   | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `DESIGN_PLAN.md`       | Durable design document                 |
| `README.md`            | This overview                           |
| `AGENT_REGISTRY.md`    | Agent identity and authority templates  |
| `HANDOFF_PROTOCOL.md`  | Routing rules and handoff paths         |
| `MESSAGE_SCHEMA.md`    | 10 structured message templates         |
| `TASK_LEDGER.md`       | State machine and anti-drift controls   |
| `AUDIT_QUEUE.md`       | Pre-merge and post-merge audit queue    |
| `BLOCKER_LOG.md`       | Blocker records and resolution rules    |
| `DECISION_LOG.md`      | Owner decision records and rationale    |
| `POST_MERGE_QUEUE.md`  | Post-merge audit requirements           |

No runtime code. No servers. No live messaging. No automated actions.

---

## Future Phases

- **Phase 2** — `.agent-bridge/` JSON state files for machine-readable task tracking.
- **Phase 3** — GitHub PR/Issue comment sync for cross-repo visibility.
- **Phase 4** — CLI helper for creating and validating bridge files.
- **Phase 5** — MCP/A2A adapter, only after completing a formal threat model and receiving explicit owner approval.

---

## Security Rules

All bridge files MUST comply with:

- ❌ No secrets in bridge files.
- ❌ No `.env` contents.
- ❌ No tokens.
- ❌ No private keys.
- ❌ No production credentials.
- ❌ No hidden command execution.
- ❌ No automatic push.
- ❌ No automatic merge.
- ❌ No automatic deploy.
- ❌ No uncontrolled MCP/A2A bridge.
- ❌ No external write actions without owner approval.
- ✅ All bridge state must be auditable in Git.

---

## Anti-Drift Controls (Summary)

1. No agent certifies its own work.
2. DeepSeek self-review cannot become formal audit.
3. Hermes verification cannot replace Codex audit.
4. Codex audit cannot override owner decision.
5. Owner override must record rationale.
6. Failed gates stay failed until rerun.
7. Skipped gates stay skipped, blocked, or not-run — never passed.
8. Dirty tree blocks state advancement.
9. Wrong branch blocks state advancement.
10. Every handoff must end with one next action.

Full controls in `TASK_LEDGER.md`.

---

## AGENTS.md Wiring (Deferred)

AGENTS.md wiring for AgentBridge should be added **later**, after the base governance PR is merged, or when the owner explicitly approves a small follow-up wiring PR. Do not modify AGENTS.md as part of this Phase 1 bootstrap.

---

*PNPD AgentBridge is a communication/state layer, not decision authority.*
