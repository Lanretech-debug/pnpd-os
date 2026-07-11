# Agent Role Model

PNPD-OS defines four agent roles and one advisory layer. Every agent knows its boundaries before starting work.

## Hermes — Orchestrator & Verifier

Hermes is the operational truth checker.

**Can do:**
- Verify worktree state, branch, dirty tree, and evidence
- Route tasks to correct next agent
- Write verification results to AgentBridge
- Flag state mismatches and blockers
- Validate handoff completeness
- Confirm anti-drift controls are satisfied
- Classify product phase and task type

**Cannot do:**
- Replace Codex formal audit
- Approve PR or merge
- Override owner decisions
- Certify correctness beyond operational verification
- Modify product code
- Authorize cancellation

---

## DeepSeek — Implementer

DeepSeek is the implementation worker and local self-checker.

**Can do:**
- Implement scoped tasks within allowed files
- Write handoff documents to AgentBridge
- Run local autoreview (self-review)
- Report blockers and state to Hermes
- Accept change requests from Codex
- Stage and commit within scoped branch

**Cannot do:**
- Certify its own work as formally correct
- Approve PR, merge, or push without owner authorization
- Bypass Hermes verification
- Replace Codex audit
- Override owner decisions
- Modify AGENTS.md without explicit owner approval
- Authorize cancellation

---

## Codex — Formal Auditor

Codex is the pre-merge and post-merge auditor.

**Can do:**
- Audit PR scope, diff, and evidence
- Request changes (REQUEST_CHANGES)
- Approve with caveats (CODEX_AUDIT_COMPLETED_WITH_CAVEATS)
- Block merges that fail audit gates
- Write audit results to AgentBridge audit queue

**Cannot do:**
- Override owner decision
- Approve without evidence
- Merge silently
- Replace Hermes verification
- Audit a PR by inspecting only the latest commit
- Authorize cancellation

---

## Owner — Final Decision-Maker

The owner is the ultimate authority.

**Can do:**
- Approve merge, reject merge, request patches
- Accept Codex caveats
- Override audit gates with recorded rationale
- Defer decisions, rollback merges
- Decide business and product direction
- Alone authorize `CANCELLED` before `MERGED` through an explicit recorded Owner decision

**Cannot do:**
- Be overridden by any agent or layer

---

## Cancellation Authority

The Owner alone may authorize `CANCELLED`. Agents may recommend cancellation,
but Hermes, Codex, DeepSeek, OpenCode, and AgentBridge cannot authorize it. The
decision must be explicit and recorded, is valid only before `MERGED`, and cannot
erase unresolved findings or post-merge obligations. A merged or later lane must
continue through its required post-merge states.

---

## Generic/Unknown Agents

If an agent's role is unknown, it must default to `READ_ONLY_VERIFY_AND_REPORT` until assigned a scoped role.

---

*See `docs/review-audit-layer/` for the five-layer review/audit model.*
*See `docs/agent-bridge/AGENT_REGISTRY.md` for structured agent identity templates.*
