# Blocker Log — PNPD AgentBridge

> Defines blocker records, severity levels, ownership, and resolution rules.
> Any agent can raise a blocker. Only the blocker owner (or Owner) can resolve it.

---

## Blocker Record Format

```yaml
schema: blocker_record
blocker_id: "BLK-001"
task_id: "TASK-001"
severity: "HIGH"  # LOW | MEDIUM | HIGH | CRITICAL
blocker_type: "environment"
blocker_owner: "environment"  # deepseek | hermes | codex | owner | environment | github | unknown
title: "Brief blocker title"
description: "Detailed description of what is blocked and why."
discovered_by: "deepseek"
discovered_at: "2026-06-10T10:00:00Z"
affected_gates:
  - "build"
  - "unit_test"
resolution: "Clear, actionable resolution steps."
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "Specific next action to resolve the blocker"
```

---

## Severity Values

| Severity   | Meaning                                                       | Examples                                             |
| ---------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `LOW`      | Minor inconvenience. Work can continue with workaround.       | Missing optional tool, cosmetic issue.               |
| `MEDIUM`   | Non-blocking but degrades quality or slows progress.          | Missing test dependency, flaky CI step.              |
| `HIGH`     | Blocks a gate or task but has known resolution path.          | Java version mismatch, PAT scope insufficient.       |
| `CRITICAL` | Blocks all progress. No workaround. Requires owner escalation.| Production credential leak, security vulnerability.  |

---

## Blocker Owners

| Owner         | When Used                                                         |
| ------------- | ----------------------------------------------------------------- |
| `deepseek`    | Implementation issue within DeepSeek scope; DeepSeek can resolve  |
| `hermes`      | Verification or routing issue; Hermes can resolve                 |
| `codex`       | Audit scope or evidence issue; Codex can clarify                  |
| `owner`       | Requires owner decision (e.g., budget, priority, override)        |
| `environment` | Environment issue (Java version, missing SDK, disk space)         |
| `github`      | GitHub API, PAT, permissions, or PR infrastructure issue          |
| `unknown`     | Blocker cause not yet diagnosed; ownership TBD                   |

---

## Resolution Rules

1. A blocker is **active** until `resolved: true` with a `resolved_by` and `resolved_at` timestamp.
2. Only the `blocker_owner` (or the Owner) may mark a blocker as resolved.
3. The resolution MUST describe what was done — not just "fixed".
4. A resolved blocker does not auto-advance the task. The blocked agent must re-attempt the gate.
5. If a blocker cannot be resolved, it must be escalated to `owner` with a recommendation (e.g., defer, close task, accept risk).

---

## Example Blocker Records

### Example 1: Java 17 Blocker

```yaml
schema: blocker_record
blocker_id: "BLK-001"
task_id: "TASK-001"
severity: "HIGH"
blocker_type: "environment"
blocker_owner: "environment"
title: "Java 17 not available in environment"
description: "Project requires Java 17 to build and run unit tests. Current environment has Java 11 installed. Build gate fails."
discovered_by: "deepseek"
discovered_at: "2026-06-10T10:00:00Z"
affected_gates:
  - "build"
  - "unit_test"
resolution: "Install Java 17 via SDKMAN: sdk install java 17.0.9-tem"
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "Owner approve environment change or provide Java 17 path"
```

### Example 2: PAT Scope Blocker

```yaml
schema: blocker_record
blocker_id: "BLK-002"
task_id: "TASK-002"
severity: "HIGH"
blocker_type: "permissions"
blocker_owner: "github"
title: "GitHub PAT lacks required scopes for PR creation"
description: "Current PAT has repo:read only. PR creation requires repo:write scope. Cannot open PR."
discovered_by: "deepseek"
discovered_at: "2026-06-10T11:00:00Z"
affected_gates:
  - "pr_creation"
resolution: "Generate new PAT with repo scope or add repo:write to existing PAT."
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "Owner create PAT with repo scope and provide to DeepSeek"
```

### Example 3: Dirty Tree Blocker

```yaml
schema: blocker_record
blocker_id: "BLK-003"
task_id: "TASK-003"
severity: "HIGH"
blocker_type: "worktree"
blocker_owner: "deepseek"
title: "Dirty worktree blocks Hermes verification"
description: "Uncommitted changes detected in worktree. Anti-drift control 3: dirty tree blocks state advancement."
discovered_by: "hermes"
discovered_at: "2026-06-10T12:00:00Z"
affected_gates:
  - "hermes_verification"
resolution: "Commit or stash uncommitted changes. Ensure clean git status before resubmitting."
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "DeepSeek clean worktree and resubmit for verification"
```

### Example 4: Codex Credit Unavailable Blocker

```yaml
schema: blocker_record
blocker_id: "BLK-004"
task_id: "TASK-004"
severity: "CRITICAL"
blocker_type: "resource"
blocker_owner: "owner"
title: "Codex credit exhausted — cannot perform formal audit"
description: "Codex API credit pool is exhausted. Formal audit cannot proceed. This is a gating requirement for merge."
discovered_by: "hermes"
discovered_at: "2026-06-10T13:00:00Z"
affected_gates:
  - "codex_audit"
resolution: "Owner must either (a) add Codex credits, (b) accept risk and override audit gate with rationale, or (c) defer task."
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "Owner decide: add credits, override audit gate, or defer task"
```

---

## Blocker Lifecycle

```
Raised (by any agent)
  ↓
Triaged (blocker_owner assigned, severity set)
  ↓
  ├── Resolved (blocker_owner marks resolved; gate re-attempted)
  └── Escalated (to owner if unresolvable)
        ↓
        Owner Decision (defer, override, close task, accept risk)
```

---

*All blockers must be recorded in the Blocker Log. No task may advance past a blocker without resolution or explicit owner override.*
