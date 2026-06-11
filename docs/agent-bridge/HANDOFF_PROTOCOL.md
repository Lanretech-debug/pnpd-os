# Handoff Protocol — PNPD AgentBridge

> Defines how agents hand off work through PNPD AgentBridge.
> Every handoff is a committed file. Every handoff ends with one next action.

---

## Purpose of Handoff

A handoff transfers task state, evidence, and routing from one agent to the next. It ensures every agent reads the same structured state from the repo — no copy-paste, no lost context, no stale chat memory.

---

## When Each Agent Writes a Handoff

| Agent    | Writes Handoff When…                                                    |
| -------- | ----------------------------------------------------------------------- |
| DeepSeek | Implementation complete + self-review done; or blocked and needs routing |
| Hermes   | Verification complete (pass, fail, or blocked); routes to next agent    |
| Codex    | Audit complete; routes result to Owner or back to DeepSeek              |
| Owner    | Decision recorded; routes to DeepSeek (patches) or closes task          |

---

## Required Handoff Paths

### DeepSeek → Hermes

**Trigger:** Implementation done. Self-review complete.

```yaml
handoff:
  from: deepseek
  to: hermes
  task_id: "TASK-001"
  status: IMPLEMENTED | SELF_REVIEWED
  evidence:
    - self_review_log: "path/to/self-review.md"
    - diff_summary: "path/to/diff-summary.txt"
  blockers: []
  next_action: "Hermes verify branch, dirty tree, evidence completeness"
```

### Hermes → DeepSeek

**Trigger:** Verification failed or change requested. Routes task back.

```yaml
handoff:
  from: hermes
  to: deepseek
  task_id: "TASK-001"
  status: REQUEST_CHANGES | BLOCKED
  evidence:
    - herm_verification: "path/to/hermes-verification.md"
    - failed_gates: ["dirty_tree", "wrong_branch"]
  blockers:
    - blocker_id: "BLK-001"
  next_action: "DeepSeek fix dirty tree, re-self-review, resubmit"
```

### Hermes → Codex

**Trigger:** Hermes verification passed. Ready for formal audit.

```yaml
handoff:
  from: hermes
  to: codex
  task_id: "TASK-001"
  status: HERMES_VERIFIED
  evidence:
    - herm_verification: "path/to/hermes-verification.md"
    - deepseek_self_review: "path/to/deepseek-self-review.md"
    - task_ledger_entry: "TASK-001"
  blockers: []
  next_action: "Codex formal pre-merge audit of full PR diff"
```

### Codex → DeepSeek

**Trigger:** Codex requested changes. Routes back for patches.

```yaml
handoff:
  from: codex
  to: deepseek
  task_id: "TASK-001"
  status: REQUEST_CHANGES
  evidence:
    - codex_audit: "path/to/codex-audit.md"
    - change_requests: ["CR-001: fix X", "CR-002: add test for Y"]
  blockers: []
  next_action: "DeepSeek implement Codex change requests, re-self-review"
```

### Codex → Owner

**Trigger:** Audit complete. Owner decision needed.

```yaml
handoff:
  from: codex
  to: owner
  task_id: "TASK-001"
  status: CODEX_AUDIT_REQUESTED | CODEX_APPROVED
  evidence:
    - codex_audit: "path/to/codex-audit.md"
    - codex_status: "CODEX_APPROVED_WITH_CAVEATS"
    - merge_recommendation: "MERGE_OK_OWNER_ACCEPTS_CAVEATS"
    - caveats: ["Caveat 1: item", "Caveat 2: item"]
  blockers: []
  next_action: "Owner review caveats and decide merge/patch/reject"
```

### Owner → Post-Merge Audit

**Trigger:** Owner approved merge on high-risk PR. Post-merge audit needed.

```yaml
handoff:
  from: owner
  to: codex
  task_id: "TASK-001"
  status: MERGED
  post_merge_audit_required: true
  risk_category: "auth"
  evidence:
    - owner_decision: "path/to/decision-log.md"
    - merge_commit: "abc123def"
  next_action: "Codex post-merge audit of merged diff in target branch"
```

---

## Required Evidence Per Handoff

Every handoff MUST reference specific evidence file paths — never paste evidence inline.

| Evidence Type        | Example Path                          | Required By                |
| -------------------- | ------------------------------------- | -------------------------- |
| Self-review log      | `audits/self-review-TASK-001.md`      | DeepSeek → Hermes          |
| Diff summary         | `audits/diff-TASK-001.txt`            | DeepSeek → Hermes          |
| Hermes verification  | `audits/hermes-verify-TASK-001.md`    | Hermes → Codex             |
| Codex audit          | `audits/codex-audit-TASK-001.md`      | Codex → Owner              |
| Owner decision       | `audits/decision-TASK-001.md`         | Owner → Post-Merge         |
| Post-merge audit     | `audits/post-merge-audit-TASK-001.md` | Codex → Owner              |

---

## Forbidden Handoffs

The following handoff paths are **never permitted**:

| From     | To       | Reason                                                    |
| -------- | -------- | --------------------------------------------------------- |
| DeepSeek | Codex    | Must pass Hermes verification first                       |
| DeepSeek | Owner    | Must pass Hermes + Codex before owner decision            |
| Hermes   | Owner    | Codex audit must precede owner decision                   |
| Codex    | (merge)  | Codex cannot merge; only owner authorizes merge           |
| Any agent| (deploy) | No agent may deploy without explicit owner authorization  |

---

## Every Handoff Ends With One Next Action

Rule: every handoff message MUST include exactly one `next_action` field specifying the immediate next step for the receiving agent.

Examples:

- `"Hermes verify branch, dirty tree, evidence completeness"`
- `"DeepSeek implement Codex change requests, re-self-review"`
- `"Codex formal pre-merge audit of full PR diff"`
- `"Owner review caveats and decide merge/patch/reject"`
- `"Codex post-merge audit of merged diff in target branch"`

Handoffs without a `next_action` are **invalid** and must be rejected by the receiving agent.

---

## Core Rule

> **No agent certifies its own work.**

DeepSeek self-review is not certification. Hermes verification is not Codex audit. Codex audit is not owner decision. Every gate requires a different agent.

---

*See MESSAGE_SCHEMA.md for full handoff message template.*
