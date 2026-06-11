# PNPD AgentBridge — Design Plan

> **Status:** Phase 1 (docs-only bootstrap)
> **Branch:** `docs/pnpd-agentbridge`
> **Created:** 2026-06-10
> **Base PR:** `docs/example-protocol/` (example PR)
> **Do not merge into product branches.**

---

## Name

`PNPD AgentBridge`

---

## What PNPD AgentBridge Is

A repo-local, file-based structured communication and state layer that formalises how agents hand off work, record decisions, track task state, queue audits, and surface blockers.

It replaces the current manual copy-paste workflow with auditable, machine-readable and human-readable files committed to the repo.

It is an extension of PNPD-OS that implements middleware between agents, not authority over them.

PNPD AgentBridge is the **Communication & State Layer** of PNPD-OS. It sits between the Governance Layer and the Review & Audit Layer and provides the file-based protocol that agents use to coordinate without requiring a live runtime.

---

## What PNPD AgentBridge Is Not

- Not a sixth authority.
- Not autonomous messaging.
- Not a replacement for AGENTS.md.
- Not a replacement for the Review & Audit Layer.
- Not a replacement for Codex, Hermes, or owner decisions.
- Not live MCP/A2A.
- Not deployment/runtime.
- Not CI/CD.
- Not silent background agent communication.
- Not an autonomous decision-making system.

---

## Problem It Solves

**Current manual workflow:**

```
DeepSeek report → owner copies/pastes to Hermes → Hermes verifies → owner copies result to DeepSeek → DeepSeek patches → owner copies to Codex → Codex audits → owner decides
```

**PNPD AgentBridge workflow:**

```
DeepSeek writes handoff → Hermes reads repo state → Hermes writes verification → Codex reads audit queue → Codex writes audit result → owner records decision
```

Each handoff is a committed file. Every agent reads the same state. No copy-paste, no lost context, no stale memory.

---

## Relationship To PNPD-OS

PNPD AgentBridge extends PNPD-OS as the **Communication & State Layer**.

```
PNPD-OS Layers:
  Product Strategy Layer     — VertiForge, product docs
  Governance Layer           — AGENTS.md, governed skill evolution
  Communication & State Layer — PNPD AgentBridge (THIS)
  Review & Audit Layer       — Codex, Hermes, audit protocols
  Normalisation Layer        — Project tooling governance
```

It does not replace the Product Strategy Layer, Governance Layer, Review & Audit Layer, Normalisation Layer, or AGENTS.md authority.

---

## Relationship To Review & Audit Layer

The Review & Audit Layer defines **who** reviews, **when**, and with **what authority**.

PNPD AgentBridge defines **how** handoffs, verification, audit requests, decisions, blockers, and post-merge checks are **recorded**.

AgentBridge is the file protocol. The Review & Audit Layer is the authority framework that the protocol serves.

---

## Conceptual Grounding

- **MCP-style** context/tool connection is useful later, but too permissive for Phase 1.
- **A2A-style** messaging is useful later, but must not create peer-level uncontrolled autonomy.
- **MPAC-style** shared session/intent/operation/conflict/governance concepts inspire the design.
- **Phase 1** must remain repo-local Markdown files only. No runtime, no servers, no live communication.

Future phases may introduce structured JSON state, GitHub integration, CLI helpers, and controlled MCP/A2A adapters — each only after explicit threat modeling and owner approval.

---

## Authority Model

| Agent / Layer    | Role                                       | Can Do                                                                                    | Cannot Do                                                |
| ---------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| DeepSeek         | Implementation worker and local self-check | Implement scoped tasks, write handoff, run local autoreview                               | Certify itself, approve PR, merge, bypass Hermes/Codex   |
| Hermes           | Verifier and router                        | Verify state, branch, dirty tree, evidence, route next action                             | Replace Codex audit, merge, override owner               |
| Codex            | Formal auditor                             | Audit pre-merge and post-merge, request changes, approve with caveats                     | Override owner, approve without evidence, merge silently |
| Owner            | Final decision-maker                       | Approve merge, accept caveats, override with rationale, decide business/product direction | Be overridden by any agent                               |
| PNPD AgentBridge | Communication and state layer              | Store structured handoffs, blockers, audit queues, decisions                              | Make decisions, certify, approve, merge, deploy          |

---

## Required State Machine

```
PROPOSED
ROUTED
IN_PROGRESS
IMPLEMENTED
SELF_REVIEWED
HERMES_VERIFIED
CODEX_AUDIT_REQUESTED
CODEX_APPROVED
OWNER_APPROVED
MERGED
POST_MERGE_AUDIT_REQUESTED
POST_MERGE_VERIFIED
BLOCKED
REQUEST_CHANGES
CLOSED
```

Full state definitions, transitions, and anti-drift controls are in `TASK_LEDGER.md`.

---

## Required Anti-Drift Controls

1. No agent certifies its own work.
2. DeepSeek self-review cannot become formal audit.
3. Hermes verification cannot replace Codex audit.
4. Codex audit cannot override owner decision.
5. Owner override must record rationale.
6. Failed gates stay failed until rerun.
7. Skipped gates stay skipped, blocked, or not-run — never passed.
8. Dirty tree blocks state advancement.
9. Wrong branch blocks state advancement.
10. Cross-worktree contamination blocks state advancement.
11. PR scope mismatch triggers Hermes verification.
12. Large PRs must be audited as large PRs, not latest commits only.
13. Product and governance branches must not mix.
14. Secrets must never be written to handoff files.
15. Handoffs must reference evidence paths, not paste secrets.
16. Merge requires Codex audit or explicit owner override rationale.
17. Post-merge audit is required for high-risk merges.
18. Every handoff must end with one next action.

---

## Storage Strategy

| Phase | Scope                                         | Format              |
| ----- | --------------------------------------------- | ------------------- |
| 1     | Protocol documentation                        | Markdown in `docs/agent-bridge/` |
| 2     | Structured task state                         | JSON in `.agent-bridge/` |
| 3     | GitHub PR/Issue comment sync                  | API integration     |
| 4     | CLI helper                                    | Shell/Python tool   |
| 5     | MCP/A2A adapter                               | Only after threat model |

Phase 1 (current): docs only.

---

## Target Branch Decision

`CREATE_FOLLOWUP_GOVERNANCE_BRANCH`

**Branch:** `docs/pnpd-agentbridge`

**Reason:** PNPD AgentBridge is substantial and should not bloat preceding PRs. It builds on the Review & Audit Layer from earlier governance PRs and should merge independently after owner review.

---

## Security Requirements

- No secrets in bridge files.
- No `.env` contents.
- No tokens.
- No private keys.
- No production credentials.
- No hidden command execution.
- No automatic push.
- No automatic merge.
- No automatic deploy.
- No uncontrolled MCP/A2A bridge.
- No external write actions without owner approval.
- All bridge state must be auditable in Git.

---

## File Manifest (Phase 1)

| # | File                             | Purpose                                 |
|---|----------------------------------|-----------------------------------------|
| 1 | `DESIGN_PLAN.md`                 | This durable design document            |
| 2 | `README.md`                      | Overview and quick reference            |
| 3 | `AGENT_REGISTRY.md`              | Agent identity and authority templates  |
| 4 | `HANDOFF_PROTOCOL.md`            | Routing rules and handoff paths         |
| 5 | `MESSAGE_SCHEMA.md`              | 10 structured message templates         |
| 6 | `TASK_LEDGER.md`                 | State machine and anti-drift controls   |
| 7 | `AUDIT_QUEUE.md`                 | Pre-merge and post-merge audit queue    |
| 8 | `BLOCKER_LOG.md`                 | Blocker records and resolution rules    |
| 9 | `DECISION_LOG.md`                | Owner decision records and rationale    |
| 10| `POST_MERGE_QUEUE.md`            | Post-merge audit requirements           |

---

*This design will not be materially rewritten without an explicit DESIGN_UPDATE record in the Decision Log and owner approval.*
