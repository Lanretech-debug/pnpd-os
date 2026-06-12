# PNPD Orchestrator Loop — Phase 1 Design Proposal

> **Status:** DeepSeek-authored docs-only design capture of Hermes design output
> **Branch:** `deepseek/phase1-design-doc`
> **Date:** 2026-06-12

---

## 1. Verdict

`PHASE_1_DESIGN_DOC_PROPOSED`

This is a **docs-only** commit. It is:

- A DeepSeek-authored capture of the Hermes Phase 1 design proposal
- **Not** implementation
- **Not** a Codex formal audit
- **Not** merge approval
- **Not** a Phase 1 runtime deliverable

Before merge to `main`, Codex formal audit/final review is required unless the owner explicitly waives audit for this documentation-only branch. DeepSeek must not call its own work audited.

---

## 2. Current Baseline

| Item | State |
| ---- | ----- |
| Branch | `main` aligned with `origin/main` |
| Current commit | `5517c50` (`chore: fix Phase 0 whitespace gates`) |
| Phase 0 | Complete, Codex-audited, merged, pushed |
| Runtime mode | Dry-run only |
| Dispatch | Disabled |
| Scheduler | None |
| Daemon | None |
| GitHub mutation | None |
| Deploy path | None |
| MCP/A2A runtime | None |
| Production config | None |
| Autonomous approval path | None |

---

## 3. PNPD Workflow

The correct PNPD OS workflow for all phases:

| Step | Agent | Role |
| ---- | ----- | ---- |
| 1 | Hermes | Design, scoping, orchestration reasoning |
| 2 | Owner | Review and approve direction |
| 3 | DeepSeek | Implementation after owner approval |
| 4 | Codex | Formal audit / final review |
| 5 | Owner | Merge/release approval |
| — | Codex | Merge/push only after explicit owner approval |
| — | Owner | Final authority |

AgentBridge coordinates state and handoffs. The Orchestrator recommends only — it never approves, merges, deploys, or bypasses gates.

---

## 4. Phase 1 Objective

Phase 1 explores a **scheduled-orchestration architecture** for PNPD-OS. The aim is to automate the **inspection cadence**, not the **action authority**.

- Wake-up / scheduled inspection may be automated in a future gated phase
- Approval, dispatch, merge, and deploy **must not** be automated
- The scheduler is disabled by default and must remain owner-gated

---

## 5. Non-Goals (Phase 1)

Phase 1 design does **not** include:

- Live scheduler implementation
- Daemon / background process
- Filesystem watcher
- Autonomous dispatch
- Autonomous commits
- GitHub writes of any kind
- Merge / push / deploy automation
- Secret access or credential handling
- MCP / A2A runtime integration
- Production configuration
- External repository mutation
- Approval authority of any kind

These are explicitly out of scope for Phase 1 and every future phase must re-audit each before enabling.

---

## 6. Capability Boundary

### Allowed (conceptual design only)

- Scheduler scaffold, disabled by default
- One-shot versus scheduled mode concept
- Lockfile design
- Lease model
- Append-only run ledger
- Structured handoff generation
- Retry / backoff strategy
- Rate limits
- Observability output
- Owner-controlled enablement flags

### Blocked (must not design as always-on or autorun)

- Dispatch of any action
- GitHub writes (comments, labels, PRs, settings)
- Merge / deploy automation
- Secret handling or token inference
- Production mutation
- Approval authority
- Cross-repo mutation
- External API writes

---

## 7. Scheduler Model

### Core Design

- **Disabled by default.** No scheduled execution occurs unless the owner explicitly enables it.
- **Owner-controlled enablement.** A future registry field `scheduler.enabled` defaults to `false`.
- **No daemon by default.** The scheduler runs as a one-shot invocation or via an external cron-like trigger. No background process is spawned by PNPD-OS.
- **Local-only execution.** All inspection runs on the local worktree. No remote execution.
- **Minimum interval policy.** Intervals shorter than a configurable floor (e.g., 5 minutes) require an explicit owner gate. "Every 5 minutes" is privileged because it approaches near-real-time and increases risk of runaway loops, GitHub rate-limit exhaustion, and noisy handoff volume.
- **Safe startup/shutdown.** On startup, the scheduler checks for stale locks and exits cleanly if the lockfile is held. On shutdown, it releases its lock and writes a ledger close entry.
- **Crash recovery.** Stale locks are detected by a timeout. The next run cleans up stale locks before proceeding. No automatic lock-breaking without owner acknowledgment.
- **No remote writes.** The scheduler inspects only. It never pushes, commits, or mutates remotes.

---

## 8. Locking and Lease Model

### Lock Types

| Lock | Scope | Purpose |
| ---- | ----- | ------- |
| Global run lock | Per-orchestrator invocation | Prevents concurrent orchestrator runs |
| Per-repo lock | Per registered repository | Prevents concurrent inspection of the same repo |
| Per-task/thread lease | Per agent task or thread | Prevents duplicate agent assignment |

### Lease Rules

- **Stale timeout.** A lease older than a configurable duration (e.g., 30 minutes) is considered stale.
- **Owner unlock path.** Only the owner may manually clear a lock via a documented procedure.
- **Fail-closed.** If a lock cannot be acquired, the operation is skipped (not retried forever). The skip is recorded in the ledger.
- **Duplicate-agent prevention.** A lease includes the agent identity. The orchestrator must not assign a task already leased to another agent.
- **Race conditions.** Lock acquisition uses atomic filesystem primitives (e.g., `mkdir` for directory locks, or `O_EXCL` file creation).
- **TOCTOU risks.** The orchestrator re-checks lock validity immediately before each gated action, not only at acquisition time.
- **Lock metadata.** Each lockfile records: owner PID, agent ID, timestamp, TTL, purpose, and repo/task reference.

---

## 9. Registry Extension Proposal

These are **proposed future schema fields** for the PNPD registry. They are **not implemented** by this docs-only commit. They serve as the design target for a future Phase 1B schema extension.

```yaml
# Proposed additions to registry schema
scheduler:
  enabled: false                     # default disabled
  mode: "one_shot"                   # one_shot | scheduled
  interval_minutes: 60               # minimum interval unless owner-gated
repo_config:
  priority: 1                        # 1 (lowest) to 5 (highest)
  allowed_inspection_commands:       # allowlist for inspection
    - "git status --short --branch"
    - "git log --oneline -5"
  forbidden_commands:                # denylist (always blocked)
    - "git push"
    - "git commit"
    - "rm -rf"
  max_runtime_seconds: 300
  max_retries: 3
  cooldown_minutes: 15
owner_gates:
  owner_approval_required: true
  codex_audit_required: true
policy_flags:
  external_writes_allowed: false     # always false for Phase 1
  dispatch_allowed: false            # always false for Phase 1
  secrets_policy: "block"            # block | redact | allowlist_only
  budget_policy: "fail_closed"       # fail_closed | warn_only
risk:
  tier: "low"                        # low | medium | high | critical
  stale_branch_policy: "report"      # report | block | ignore
```

---

## 10. State Machine Extension Proposal

### Preserved States (must not regress)

- `APPROVED_FOR_MERGE` — cannot be reached by Orchestrator alone; requires owner or Codex
- `DONE` — cannot be reached from any unresolved active state
- `CODEX_REVIEW_REQUIRED` — remains distinct from owner approval
- Hermes planning is not Codex audit
- DeepSeek implementation is not Codex audit

### Proposed New States

| State | Meaning |
| ----- | ------- |
| `SCHEDULED_INSPECTION` | Repo queued for periodic inspection |
| `LOCKED` | Lock held; another agent is active |
| `LEASE_EXPIRED` | Previous lease timed out; cleanup needed |
| `HANDOFF_READY` | Handoff file written; awaiting next agent |
| `OWNER_ACTION_REQUIRED` | Decision or action needed from owner |
| `CODEX_AUDIT_PENDING` | Audit requested but not yet completed |
| `BLOCKED_BY_POLICY` | Blocked by a policy gate (budget, rate, risk) |

These are design proposals only. Implementation requires a separate schema extension phase.

---

## 11. Handoff Model

### Proposed Future Handoff Fields

Each handoff record should carry:

| Field | Type | Purpose |
| ----- | ---- | ------- |
| `run_id` | string | Unique orchestrator run identifier |
| `timestamp` | ISO 8601 | When the inspection ran |
| `repo_id` | string | Registry repo identifier |
| `repo_name` | string | Human-readable repo name |
| `repo_path` | string | Local worktree path |
| `branch` | string | Current branch at inspection time |
| `dirty_state` | bool | Working tree clean or dirty |
| `commit` | string | HEAD commit hash |
| `classification` | string | e.g., `clean`, `dirty`, `stale`, `diverged`, `blocked` |
| `recommended_action` | string | Advisory only — never "merge", "deploy", "approve" |
| `gates` | list | Gates checked and their results |
| `blocked_reasons` | list | If blocked, why |
| `required_reviewer` | string | Codex, owner, or none |
| `codex_audit_required` | bool | Whether Codex audit is triggered |
| `risk_tier` | string | low / medium / high / critical |
| `authority_flags` | list | What this handoff does NOT authorize |
| `ledger_reference` | string | Path to ledger entry |
| `handoff_file_reference` | string | Path to handoff evidence file |

**Critical rule:** A handoff must never claim approval, merge readiness, audit completion, production readiness, or dispatch authority. It is a structured observation, not a decision.

---

## 12. Ledger Design

### Format

- Path: `.pnpd/ledger/YYYY-MM-DD.jsonl`
- Append-only, one JSON object per line
- Local filesystem only — not committed by the Orchestrator
- No secrets, no PII, no inline diff content
- One line per repo inspection per run

### Ownership

- The ledger is machine-written by the Orchestrator (future)
- The owner may review and manually commit selected handoff evidence if desired
- The Orchestrator must never `git add` or `git commit` ledger files

---

## 13. Threat Model

| # | Threat | Impact | Mitigation | Fail-Closed Rule | Required Gate |
|---|--------|--------|------------|------------------|---------------|
| 1 | Runaway loop (infinite rapid re-inspection) | CPU exhaustion, GitHub rate-limit hit, noise flood | Minimum interval, cooldown, rate limits, max runs per invocation | Stop after max runs; require owner reset | `rate_limit_check` |
| 2 | Duplicate agents on same task | Conflicting state, corrupted ledger | Per-task lease with agent identity | Skip if lease held by another agent | `lease_check` |
| 3 | Stale locks blocking all progress | Orchestrator frozen | Stale timeout detection, owner unlock path | Report blocked; do not auto-break without owner | `stale_lock_check` |
| 4 | Poisoned registry (malicious repo config) | Command injection, path traversal | Registry schema validation, allowlist-only commands, no shell interpolation | Fail validation; skip repo | `schema_validate`, `command_allowlist` |
| 5 | Prompt injection from issue/PR text | Agent misdirection | Never pass untrusted text to agent prompt without sanitization boundary | Block repo until reviewed | `input_sanitize` |
| 6 | Malicious branch names | Path traversal, command injection | Validate branch names against safe pattern; reject suspicious names | Skip repo; report | `branch_name_validate` |
| 7 | Malicious file paths in repo metadata | Arbitrary read, path traversal | Resolve and validate all paths against worktree root; reject `..` and symlinks | Skip repo; report | `path_validate` |
| 8 | Secret exfiltration via handoff output | Credential leak | Never parse `.env`; redact paths only; no inline diff content; no token inference | Block if secrets detected in output | `secret_scan` |
| 9 | Accidental deploy trigger | Unauthorized production change | Dispatch disabled; no deploy command in allowlist; no remote mutation | Block all dispatch | `dispatch_disabled` |
| 10 | Unauthorized merge | Bypass of review chain | Merge requires owner approval; Orchestrator cannot approve merge | Block merge recommendation | `merge_gate` |
| 11 | Unauthorized GitHub mutation | Tampering with remote state | No GitHub write token provisioned; no write API calls in code path | Block all GitHub writes | `github_write_disabled` |
| 12 | Hidden approval path | Authority bypass | All state transitions audited; no state can reach APPROVED_FOR_MERGE without owner or Codex | Reject invalid transition | `state_machine_validate` |
| 13 | Cross-repo contamination | Leakage between projects | Per-repo locks; no shared mutable state; separate ledger entries | Isolate per repo | `repo_isolation` |
| 14 | Destructive filesystem action | Data loss | No `rm`, `chmod`, `chown`, `unlink`, `rmdir`, `mv`, `cp` in allowlist | Block destructive commands | `command_allowlist` |
| 15 | Symlink / path traversal via repo path | Read outside worktree | Resolve real paths; reject symlinks outside worktree; validate canonical path | Skip repo; report | `path_validate` |
| 16 | Command injection through repo config fields | Arbitrary execution | Never interpolate registry fields into shell commands; use structured exec with arg arrays | Fail; do not execute | `command_allowlist` |
| 17 | External API write misuse | Unauthorized external mutation | No API write tokens; no write endpoints called; read-only inspection only | Block all API writes | `api_write_disabled` |
| 18 | Compromised agent output claiming audit | False assurance | Agent identity recorded in ledger; no agent can claim Codex status; handoff must not claim audit | Flag and block | `agent_identity_check` |
| 19 | False production-readiness claim | Premature deployment | No production flag in handoff; no deploy recommendation allowed | Block deploy language | `deploy_gate` |

---

## 14. Secrets Policy

| Rule | Enforcement |
| ---- | ----------- |
| No `.env` parsing | Never read, parse, or source `.env` files |
| No credential printing | Redact any detected credential-like strings from output |
| No token inference | Do not attempt to detect or classify token formats |
| No provider-key handling | Never handle `OPENAI_API_KEY`, `GITHUB_TOKEN`, or similar |
| No secret-bearing tasks | Reject tasks that require secrets to complete |
| Redacted path-only reporting | Report file paths only; never inline file contents that may contain secrets |
| Owner-only provisioning | Only the owner provisions tokens, keys, and credentials |
| Block if secrets are required | If a task cannot proceed without a secret, block it and request owner action |

---

## 15. GitHub / API Mutation Policy

| Rule | Enforcement |
| ---- | ----------- |
| No GitHub writes by default | `github_write_enabled: false` at all times for Phase 1 |
| No comments, labels, or PR mutation | No write API endpoints called |
| Read-only GitHub inspection | Requires a separate threat model before enabling even read access |
| Merge never autonomous | Merge always requires owner approval |
| Deploy never autonomous | Deploy always requires owner approval |
| API writes | Require separate threat model, owner approval, and Codex audit before any write endpoint is added |

---

## 16. Filesystem Mutation Policy

| Rule | Enforcement |
| ---- | ----------- |
| Default: no writes | All filesystem mutation blocked unless explicitly allowlisted |
| Future allowlisted paths only | Lockfiles, ledger, handoff evidence in `.pnpd/` only |
| No source modifications | Orchestrator must never edit source files |
| No branch switching | Orchestrator must never `git checkout` or `git switch` |
| No destructive operations | `rm`, `chmod`, `chown`, `unlink`, `rmdir`, `mv`, `cp` blocked |
| Allowlist required | Any future write path must be in an allowlist with associated tests |

---

## 17. Observability and Audit Trail

The Orchestrator must produce:

| Output | Format | Purpose |
| ------ | ------ | ------- |
| Run ledger | `.pnpd/ledger/YYYY-MM-DD.jsonl` | Machine-readable audit trail |
| Structured JSON output | stdout | Per-repo inspection result |
| Human-readable summary | stdout | Quick review by owner |
| Handoff archive | `.pnpd/handoff/` | Evidence for agent handoff |
| Gate evidence | Per-gate result in handoff | Why each gate passed or failed |
| Blocked-reason evidence | In handoff | Why a repo was skipped or blocked |
| Reviewer chain | In handoff metadata | Which agents reviewed |
| Owner decision trail | In decision log | Owner actions and rationale |

**No sensitive output.** Handoff output must not contain secrets, tokens, inline diff content, or PII.

---

## 18. Rate Limits and Budget Controls

| Control | Default | Purpose |
| ------- | ------- | ------- |
| Max repos per run | 20 | Prevent unbounded inspection |
| Max tasks per repo | 5 | Prevent deep inspection loops |
| Max runtime per repo | 300 seconds | Per-repo timeout |
| Max total runtime | 3600 seconds | Per-invocation timeout |
| Max parallelism | 1 | Sequential only for Phase 1 |
| Cooldown per repo | 15 minutes | Minimum gap between inspections of same repo |
| Retry cap | 3 | Max consecutive failures before blocking |
| Backoff | Exponential (1m, 5m, 15m) | After each failure |
| Noisy repo suppression | After 3 failures in cooldown window, block and report | Prevent spam |
| Budget exhaustion | Fail-closed; stop all inspection | Safety over progress |

---

## 19. Failure and Recovery Model

| Scenario | Recovery |
| -------- | -------- |
| Interrupted run | Next run detects stale lock, cleans up, starts fresh |
| Stale lock | Detect by timeout; report to owner; do not auto-break |
| Partial handoff | Detect incomplete handoff file; discard and re-run inspection |
| Invalid registry entry | Skip repo; log error; continue with next repo |
| Dirty tree | Skip repo; report dirty state; do not attempt inspection |
| Missing repo path | Skip repo; log error; do not create or clone |
| Detached HEAD | Skip repo; report state |
| Inaccessible remote | Skip repo; log connectivity error |
| Git command failure | Skip repo; log stderr; do not retry git commands that mutate |
| Schema validation failure | Skip repo; log validation errors |
| Invalid JSON output | Discard output; retry once; if still invalid, skip repo |
| Clock skew | Use monotonic clock for timeouts; report wall-clock drift |
| Corrupted ledger | Detect non-JSONL lines; skip corrupted entry; continue appending |
| Repeated failed inspections | After retry cap, block repo and request owner review |

---

## 20. Test Strategy

The following tests must be designed (and implemented in a future Phase 1 implementation task):

### Schema Tests
- Registry schema validation (valid and invalid inputs)
- State machine transition validation

### Lock/Lease Tests
- Lock acquisition and release
- Stale lock detection
- Concurrent lock prevention
- Lease identity verification

### Default Safety Tests
- Scheduler disabled by default
- Dispatch disabled by default
- No write commands in allowlist

### Gate Tests
- Dirty tree blocks inspection
- `APPROVED_FOR_MERGE` cannot be reached without owner/Codex
- Active state cannot collapse to `DONE`

### Security Tests
- Malicious registry input rejection
- Path traversal rejection
- Command injection rejection
- Prompt injection fixture testing
- No secret in output regression

### Output Tests
- JSON output parseable
- Deterministic output for same input
- Lockfile atomicity
- Ledger integrity (append-only, valid JSONL)

### Budget Tests
- Budget exhaustion triggers fail-closed
- Retry cap enforced
- Cooldown enforced

---

## 21. Migration Path

Phased approach, each gated by owner approval and Codex audit:

| Phase | Scope | Gates |
| ----- | ----- | ----- |
| **1A** | Docs-only design (this commit) | Owner review, Codex audit before merge |
| **1B** | Schema extension proposal | Schema validation, no runtime change |
| **1C** | Local ledger dry-run extension | Append-only, no writes outside `.pnpd/` |
| **1D** | Lockfile prototype | Atomic filesystem ops, fail-closed |
| **1E** | Disabled scheduler scaffold | Scheduler code exists but `enabled: false` hardcoded |
| **1F** | Owner-gated scheduled local inspection | Owner sets `enabled: true`; dispatch still disabled |

No dispatch until a later phase with a separate threat model.
No GitHub writes until a separate threat model with explicit owner approval.

---

## 22. Future DeepSeek Implementation Plan

Each task must be approved by the owner before DeepSeek begins implementation:

| # | Task | Files Likely Touched | Non-Goals | Gates | Codex Audit |
|---|------|---------------------|-----------|-------|-------------|
| 1 | Docs-only design commit | `docs/pnpd/orchestrator-phase-1-design.md` | No code | Docs review | Yes (before merge) |
| 2 | Schema extension proposal | `.pnpd/repos.schema.json`, `.pnpd/orchestrator.schema.json` | No runtime | Schema validation | Yes |
| 3 | Ledger dry-run extension | `scripts/pnpd-orchestrator-dry-run.mjs` | No writes outside `.pnpd/` | Dry-run only, append-only | Yes |
| 4 | Lockfile prototype | `scripts/pnpd-lockfile.mjs` (new) | No dispatch | Atomic ops, fail-closed | Yes |
| 5 | Validation updates | `scripts/pnpd-validate-schemas.mjs` | No runtime change | All tests pass | Yes |
| 6 | Tests/gates | `tests/` | No production config | Gate coverage | Yes |
| 7 | Final handoff | Handoff file | No merge | All evidence collected | Yes |

---

## 23. Future Codex Audit Checklist

When Codex audits future Phase 1 implementation, it must verify:

- [ ] Scheduler is **disabled by default** — no path enables it without owner action
- [ ] No daemon or background process is spawned
- [ ] Dispatch is **disabled** — no code path dispatches any action
- [ ] No GitHub mutation code exists (no writes, no comments, no labels, no PR mutation)
- [ ] No merge or deploy path exists
- [ ] No secret handling, token inference, or `.env` parsing
- [ ] State machine authority is preserved (`APPROVED_FOR_MERGE` unreachable without owner/Codex)
- [ ] Lock/lease safety: atomic acquisition, stale detection, fail-closed
- [ ] All tests/gates pass
- [ ] Documentation is consistent with implementation
- [ ] No Phase 0 regression (dry-run still works, dispatch still disabled)

---

## 24. Owner Decision Matrix

| # | Decision | Options |
|---|----------|---------|
| 1 | Approve this docs-only design capture? | Approve / Request changes |
| 2 | Authorize future schema proposal (Phase 1B)? | Proceed / Defer / Skip |
| 3 | Allow local ledger writes in `.pnpd/ledger/`? | Allow / Deny / Allow with constraints |
| 4 | Allow lockfiles in `.pnpd/`? | Allow / Deny |
| 5 | Defer GitHub read-only inspection? | Defer / Approve with threat model |
| 6 | Allow risk tiers in registry? | Allow / Simplify |
| 7 | Keep Phase 1 runtime-disabled initially? | Yes / Conditional enable |
| 8 | Authorize DeepSeek implementation task sequence? | Approve sequence / Approve one at a time / Defer |

---

## 25. Next Step

1. **Owner** reviews this design document.
2. **Codex** audits/final-reviews before merge to `main`, unless the owner explicitly waives audit for this documentation-only branch.
3. **DeepSeek** must not implement any runtime Phase 1 work until the owner approves the next task.
4. No Phase 1 runtime work starts from this commit.

---

*This document is a design proposal. It is not implementation. It is not audited. It does not authorize merge.*
