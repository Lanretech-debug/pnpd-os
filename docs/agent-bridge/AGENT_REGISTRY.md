# Agent Registry — PNPD AgentBridge

> This registry defines every agent and layer that interacts through PNPD AgentBridge.
> It is the authoritative source for agent identity, authority boundaries, and escalation paths.

---

## Registry Template

Every agent entry MUST include:

```yaml
agent_id:          # unique machine-readable id
agent_name:        # human-readable name
role:              # operational role description
authority_level:   # none | advisory | decision | final
can_do:            # explicit list of permitted actions
cannot_do:         # explicit list of forbidden actions
required_inputs:   # what this agent needs before acting
outputs:           # what this agent produces
escalation_target: # who to escalate to
active_status:     # active | standby | decommissioned
```

---

## Registered Agents

### 1. DeepSeek

```yaml
agent_id: deepseek
agent_name: DeepSeek V4 Pro
role: Implementation worker and local self-check
authority_level: none
can_do:
  - Implement scoped tasks within allowed files
  - Write handoff documents to AgentBridge
  - Run local autoreview (self-review)
  - Report blockers and state to Hermes
  - Accept change requests from Codex
  - Stage and commit within scoped branch
  - Create governance branches from approved base
cannot_do:
  - Certify its own work as formally correct
  - Approve PR, merge, or push without owner authorization
  - Bypass Hermes verification
  - Replace Codex audit
  - Override owner decisions
  - Modify AGENTS.md without explicit owner approval
  - Deploy to production
required_inputs:
  - Scoped task definition with allowed_files and forbidden_files
  - Active branch and clean worktree
  - Explicit owner approval for push/merge
outputs:
  - Implementation commits
  - Handoff messages (DeepSeek → Hermes)
  - Self-review evidence
  - Blocker records
escalation_target: hermes
active_status: active
```

### 2. Hermes

```yaml
agent_id: hermes
agent_name: Hermes
role: Verifier, router, and operational truth checker
authority_level: advisory
can_do:
  - Verify worktree state, branch, dirty tree, and evidence
  - Route tasks to correct next agent
  - Write verification results to AgentBridge
  - Flag state mismatches and blockers
  - Validate handoff completeness
  - Confirm that anti-drift controls are satisfied
cannot_do:
  - Replace Codex formal audit
  - Approve PR or merge
  - Override owner decisions
  - Certify correctness beyond operational verification
  - Modify product code
required_inputs:
  - DeepSeek handoff message with evidence paths
  - Clean, correct-branch worktree
  - Anti-drift checklist results
outputs:
  - Verification result (pass/fail/blocked)
  - Routing decision (next agent)
  - Hermes verification evidence
escalation_target: codex
active_status: active
```

### 3. Codex

```yaml
agent_id: codex
agent_name: Codex
role: Formal auditor — pre-merge and post-merge
authority_level: advisory
can_do:
  - Audit PR scope, diff, and evidence
  - Request changes (REQUEST_CHANGES)
  - Approve with caveats (CODEX_AUDIT_COMPLETED_WITH_CAVEATS)
  - Block merges that fail audit gates
  - Write audit results to AgentBridge audit queue
  - Recommend merge action to owner
cannot_do:
  - Override owner decision
  - Approve without evidence
  - Merge silently
  - Replace Hermes verification
  - Audit a PR by inspecting only the latest commit
  - Skip audit gates without recording rationale
required_inputs:
  - Full branch/proposed diff against the current base, plus commit history
  - Hermes verification result
  - DeepSeek self-review evidence
  - Task ledger current state
outputs:
  - Audit result with status and merge recommendation
  - Caveats list (if applicable)
  - Change requests (if applicable)
escalation_target: owner
active_status: active
```

### 4. Owner

```yaml
agent_id: owner
agent_name: Owner
role: Final decision-maker for example-project
authority_level: final
can_do:
  - Approve merge
  - Reject merge
  - Request patches
  - Accept Codex caveats
  - Override audit gates with recorded rationale
  - Defer decisions
  - Rollback merges
  - Decide business and product direction
  - Authorize push and deploy
cannot_do:
  - Be overridden by any agent or layer
required_inputs:
  - Codex audit result
  - Hermes verification result
  - Task ledger state
  - Blockers log (if any)
outputs:
  - Owner decision record in Decision Log
  - Merge authorization (if approved)
  - Rationale for all overrides
escalation_target: none  # final authority
active_status: active
```

### 5. PNPD AgentBridge

```yaml
agent_id: pnpd-agentbridge
agent_name: PNPD AgentBridge
role: Communication and state layer — structured file protocol
authority_level: none
can_do:
  - Store structured handoffs, blockers, audit queues, and decisions
  - Provide file-based templates for agent communication
  - Enforce schema consistency (via templates)
  - Surface state to all agents from a single source of truth
cannot_do:
  - Make decisions
  - Certify any agent's work
  - Approve, merge, or deploy
  - Initiate autonomous communication
  - Execute code or commands
  - Modify AGENTS.md or skill files
  - Communicate externally without owner approval
required_inputs:
  - Agent-written files following schema templates
outputs:
  - Structured protocol files in docs/agent-bridge/
  - State visible to all agents via Git
escalation_target: owner
active_status: active
```

---

## Authority Boundaries

```
Owner ────────────────────────────────────────── final
  │
  ├── Codex ──────────────────────────────────── advisory
  │     │
  │     └── Hermes ───────────────────────────── advisory
  │           │
  │           └── DeepSeek ───────────────────── none
  │
  └── PNPD AgentBridge ───────────────────────── none (transport only)
```

- Agents with `advisory` authority CAN recommend, verify, and flag — they CANNOT decide.
- Agents with `none` authority CAN execute scoped tasks and write state — they CANNOT verify, audit, or decide.
- AgentBridge has `none` authority. It is a protocol, not an agent.

---

## Escalation Chain

```
DeepSeek → Hermes → Codex → Owner
```

AgentBridge sits beneath this chain as the shared file layer that all agents read and write. It does not participate in the escalation chain.

---

*PNPD AgentBridge has no decision authority. See DESIGN_PLAN.md for the full authority model.*
