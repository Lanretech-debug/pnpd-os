# Message Schema — PNPD AgentBridge

> Structured templates for every message type in PNPD AgentBridge.
> All templates use YAML-style key-value pairs. No secrets in examples.
> Every task-scoped schema includes task identification fields.

---

## Common Task Identification Fields

Every schema that relates to a task MUST include:

```yaml
task_id:              # unique task identifier, e.g. "TASK-001"
project:              # project name, e.g. "example-project"
branch:               # git branch name
worktree:             # absolute worktree path
pr_number:            # GitHub PR number — "N/A" only before PR is opened; must be a real PR number from OWNER_MERGE_APPROVED onward
pr_url:               # GitHub PR URL, required once PR is opened
current_agent:        # agent currently responsible
next_agent:           # agent to receive this message
status:               # current task state from TASK_LEDGER.md
scope:                # brief task scope description
allowed_files:        # list of files this task may touch
forbidden_files:      # list of files this task must not touch
gates_run:            # gates that have been executed
gates_skipped:        # gates that were skipped (never "passed")
evidence:             # file paths to evidence, never inline content
blockers:             # list of blocker IDs blocking this task
risk_level:           # LOW | MEDIUM | HIGH | CRITICAL
codex_status:         # Codex audit status if applicable
owner_decision_needed: # true | false
runtime_status:       # Runtime Verified | Runtime Not Verified | Runtime Not Applicable
runtime_reason:       # Why runtime is or is not applicable
runtime_surface:      # Classification of affected surface
runtime_evidence_or_substitute_evidence: # Paths to runtime or substitute evidence
runtime_verified_by:  # Agent or human who confirmed runtime
runtime_verified_at:  # ISO 8601 timestamp of runtime verification
next_action:          # single next action for the receiving agent
timestamp:            # ISO 8601 UTC, e.g. "2026-06-10T12:00:00Z"
commit_hash:          # git commit hash at time of message
```

---

## Schema 1: Agent Registry Entry

```yaml
schema: agent_registry_entry
agent_id: "deepseek"
agent_name: "DeepSeek V4 Pro"
role: "Implementation worker and local self-check"
authority_level: "none"
can_do:
  - "Implement scoped tasks within allowed files"
  - "Write handoff documents to AgentBridge"
cannot_do:
  - "Certify its own work as formally correct"
  - "Approve PR, merge, or push without owner authorization"
required_inputs:
  - "Scoped task definition"
  - "Clean worktree on correct branch"
outputs:
  - "Implementation commits"
  - "Handoff messages"
escalation_target: "hermes"
active_status: "active"
```

---

## Schema 2: Task Ledger Entry

```yaml
schema: task_ledger_entry
task_id: "TASK-001"
project: "example-project"
branch: "example-governance-branch"
worktree: "/path/to/project-worktree"
pr_number: "N/A"
current_agent: "deepseek"
next_agent: "hermes"
status: "IMPLEMENTED"
scope: "Bootstrap PNPD AgentBridge Phase 1 docs"
allowed_files:
  - "docs/agent-bridge/*.md"
forbidden_files:
  - "AGENTS.md"
  - "skills/example-skill/*"
  - "docs/product/*"
  - "docs/brain/*"
  - "src/*"
  - "config/example-config/*"
gates_run:
  - "scope_check"
  - "forbidden_files_check"
  - "self_review"
gates_skipped:
  - "integration_test"  # reason: docs-only, no runtime
evidence:
  - "audits/self-review-TASK-001.md"
  - "audits/diff-TASK-001.txt"
blockers: []
risk_level: "LOW"
runtime_status: "Runtime Not Applicable"
runtime_reason: "Governance-only docs, no executable surface"
runtime_surface: "Governance templates and protocols"
runtime_evidence_or_substitute_evidence: "audits/substitute-evidence-TASK-001.md"
runtime_verified_by: "deepseek"
runtime_verified_at: "2026-06-10T11:55:00Z"
codex_status: "PENDING_CODEX_FINAL_AUDIT"
owner_decision_needed: true
next_action: "Hermes verify branch, dirty tree, evidence completeness"
timestamp: "2026-06-10T12:00:00Z"
commit_hash: "abc123def456"
```

---

## Schema 3: Handoff Message

```yaml
schema: handoff_message
handoff_id: "HO-001"
task_id: "TASK-001"
from: "deepseek"
to: "hermes"
status: "SELF_REVIEWED"
summary: "AgentBridge Phase 1 docs complete. Self-review passed."
evidence:
  - self_review: "audits/self-review-TASK-001.md"
  - diff: "audits/diff-TASK-001.txt"
  - file_list: "audits/files-TASK-001.txt"
gates_run:
  - "scope_check"
  - "forbidden_files_check"
  - "no_secrets_scan"
gates_skipped:
  - "integration_test"  # reason: docs-only, no runtime
runtime_status: "Runtime Not Applicable"
runtime_reason: "Governance-only documentation changes"
runtime_surface: "AgentBridge protocols and governance templates"
runtime_evidence_or_substitute_evidence: "npm run validate, npm run dry-run, npm test, git diff --check"
runtime_verified_by: "deepseek"
runtime_verified_at: "2026-06-10T11:55:00Z"
blockers: []
next_action: "Hermes verify branch, dirty tree, evidence completeness"
timestamp: "2026-06-10T12:00:00Z"
commit_hash: "abc123def456"
```

---

## Schema 4: Verification Result

```yaml
schema: verification_result
verification_id: "VER-001"
task_id: "TASK-001"
verifier: "hermes"
verification_type: "pre_codex_operational_check"
result: "PASS"  # PASS | FAIL | BLOCKED
checks:
  - check: "branch_correct"
    result: "PASS"
    detail: "Branch is example-governance-branch"
  - check: "dirty_tree"
    result: "PASS"
    detail: "Working tree clean"
  - check: "allowed_files_only"
    result: "PASS"
    detail: "Only docs/agent-bridge/* touched"
  - check: "no_secrets"
    result: "PASS"
    detail: "No tokens, keys, or .env content found"
  - check: "handoff_complete"
    result: "PASS"
    detail: "next_action present and valid"
failed_checks: []
skipped_checks: []
blockers: []
runtime_status: "Runtime Not Applicable"
runtime_reason: "Governance-only lane, no executable runtime surface"
runtime_surface: "Governance documentation and templates"
runtime_evidence_or_substitute_evidence: "npm run validate, npm run dry-run, npm test, git diff --check"
runtime_verified_by: "deepseek"
runtime_verified_at: "2026-06-10T11:55:00Z"
routing_decision: "codex"
next_action: "Codex formal pre-merge audit of full branch/proposed diff"
evidence_refs:
  - "audits/hermes-verify-TASK-001.md"
timestamp: "2026-06-10T12:05:00Z"
commit_hash: "def456abc789"
```

---

## Schema 5: Audit Request

```yaml
schema: audit_request
audit_request_id: "AR-001"
task_id: "TASK-001"
audit_type: "pre_merge"  # pre_merge | post_merge
requested_by: "hermes"
assigned_to: "codex"
pr_number: "N/A"
branch: "example-governance-branch"
base_branch: "docs/example-protocol/"
pr_size: "SMALL"  # SMALL | MEDIUM | LARGE
risk_level: "LOW"
risk_categories: []  # auth, domain_data, production_integration, ai_safety, rules_security
evidence:
  - herm_verification: "audits/hermes-verify-TASK-001.md"
  - deepseek_self_review: "audits/self-review-TASK-001.md"
  - task_ledger: "TASK-001"
  - runtime_evidence: "audits/runtime-evidence-TASK-001.md"
status: "PENDING_CODEX_FINAL_AUDIT"
runtime_status: "Runtime Not Applicable"
runtime_reason: "Governance-only documentation changes"
runtime_surface: "AgentBridge protocols and governance templates"
runtime_evidence_or_substitute_evidence: "npm run validate, npm run dry-run, npm test, git diff --check"
runtime_verified_by: "deepseek"
runtime_verified_at: "2026-06-10T11:55:00Z"
next_action: "Codex audit full branch/proposed diff and record result"
timestamp: "2026-06-10T12:05:00Z"
commit_hash: "def456abc789"
```

---

## Schema 6: Audit Result

```yaml
schema: audit_result
audit_result_id: "ARES-001"
audit_request_id: "AR-001"
task_id: "TASK-001"
auditor: "codex"
codex_status: "CODEX_AUDIT_COMPLETED_WITH_CAVEATS"
merge_recommendation: "MERGE_OK_OWNER_ACCEPTS_CAVEATS"
caveats:
  - id: "CV-001"
    description: "AGENTS.md wiring deferred to follow-up PR"
    severity: "LOW"
    accepted_by_owner: false
findings:
  - finding: "All 10 files present and schema-compliant"
    severity: "INFO"
  - finding: "Anti-drift controls encoded across all protocol docs"
    severity: "INFO"
  - finding: "No secrets, no runtime code, no AGENTS.md modification"
    severity: "PASS"
change_requests: []
blockers: []
runtime_status: "Runtime Not Applicable"
runtime_reason: "Governance-only documentation changes with no executable runtime surface"
runtime_surface: "AgentBridge protocols and governance templates"
runtime_evidence_or_substitute_evidence: "npm run validate, npm run dry-run, npm test, git diff --check"
runtime_verified_by: "DeepSeek self-review"
runtime_verified_at: "2026-06-10T12:10:00Z"
next_action: "Owner review Codex audit result and authorize PR creation (not merge)"
timestamp: "2026-06-10T12:15:00Z"
evidence_refs:
  - "audits/codex-audit-TASK-001.md"
```

---

## Schema 7: Blocker Record

```yaml
schema: blocker_record
blocker_id: "BLK-001"
task_id: "TASK-001"
severity: "HIGH"  # LOW | MEDIUM | HIGH | CRITICAL
blocker_type: "environment"
blocker_owner: "environment"  # deepseek | hermes | codex | owner | environment | github | unknown
title: "Java 17 not available in environment"
description: "Project requires Java 17 but environment has Java 11 installed."
discovered_by: "deepseek"
discovered_at: "2026-06-10T10:00:00Z"
affected_gates:
  - "build"
  - "unit_test"
resolution: "Install Java 17 via SDKMAN or request environment update."
resolved: false
resolved_by: ""
resolved_at: ""
next_action: "Owner approve environment change or provide Java 17 path"
```

---

## Schema 8a: Owner PR Authorization

```yaml
schema: owner_pr_authorization
decision_id: "DEC-001"
task_id: "TASK-001"
owner: "owner"
decision_type: "owner_pr_authorization"
owner_pr_authorized: true
pr_creation_only: true
authorized_branch: "governance/execution-gates-patch"
authorized_base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
authorized_head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-001"
owner_decision_reference: "DEC-001"
authorized_at: "2026-06-10T12:30:00Z"
rationale: "Codex audit passed. Governance-only scope. PR may be opened."
accepted_risks: []
rejected_recommendations: []
next_state: "PR_OPENED"
next_action: "DeepSeek open PR against main with full lifecycle metadata"
timestamp: "2026-06-10T12:30:00Z"
evidence_refs:
  - "audits/decision-DEC-001.md"
```

## Schema 8b: Owner Merge Authorization

```yaml
schema: owner_merge_authorization
decision_id: "DEC-002"
task_id: "TASK-001"
owner: "owner"
decision_type: "owner_merge_authorization"
owner_merge_approved: true
pr_number: "PR-001"
pr_url: "https://github.com/Lanretech-debug/pnpd-os/pull/1"
base_branch: "main"
base_sha: "4ba519f10e0f465876e88b8f9cc7ab227cc2bb6b"
head_branch: "governance/execution-gates-patch"
head_sha: "26a725577ccda1a43a726b320a70cee3b90bad2a"
codex_audit_reference: "ARES-001"
required_checks_status: "all_passed"
owner_decision_reference: "DEC-002"
approved_at: "2026-06-10T12:45:00Z"
rationale: "All checks passed. Codex audit completed. PR scope matches approved task. Merge authorized."
accepted_risks: []
rejected_recommendations: []
next_state: "MERGED"
next_action: "DeepSeek execute merge; Codex queue mandatory post-merge audit"
timestamp: "2026-06-10T12:45:00Z"
evidence_refs:
  - "audits/decision-DEC-002.md"
```

---

## Schema 9: Post-Merge Audit Request

```yaml
schema: post_merge_audit_request
audit_request_id: "PMAR-001"
task_id: "TASK-001"
audit_type: "post_merge"
requested_by: "owner"
assigned_to: "codex"
pr_number: "PR-001"
merged_branch: "governance/execution-gates-patch"
target_branch: "main"
merge_commit: "ghi789jkl012"
risk_level: "MEDIUM"
risk_categories:
  - "rules_security"  # example only — actual risk depends on PR
reason_for_post_merge_audit: "Owner override accepted; verify merged state in target branch"
owner_decision_ref: "DEC-002"
status: "POST_MERGE_AUDIT_REQUESTED"
next_action: "Codex post-merge audit of merged diff in target branch"
timestamp: "2026-06-10T12:50:00Z"
```

---

## Schema 10: Post-Merge Audit Result

```yaml
schema: post_merge_audit_result
audit_result_id: "PMARES-001"
audit_request_id: "PMAR-001"
task_id: "TASK-001"
auditor: "codex"
post_merge_status: "POST_MERGE_VERIFIED"
findings:
  - finding: "Merged diff matches approved PR scope"
    severity: "PASS"
  - finding: "No drift introduced in target branch"
    severity: "PASS"
issues_found: []
rollback_recommended: false
rollback_rationale: ""
follow_up_actions: []
next_action: "Post-merge verification passed. Branch cleanup is now required. Lane remains open until cleanup evidence recorded."
timestamp: "2026-06-10T12:45:00Z"
evidence_refs:
  - "audits/post-merge-audit-TASK-001.md"
```

---

## Schema 11: Branch Cleanup Record

```yaml
schema: branch_cleanup_record
cleanup_id: "CLN-001"
task_id: "TASK-001"
pr_number: "PR-001"
branch_cleanup_status: "completed"  # completed | already_absent | not_applicable_with_reason
local_branch_status: "deleted"
remote_branch_status: "deleted"
verification_command_or_source: "git branch -d governance/execution-gates-patch && git push origin --delete governance/execution-gates-patch"
canonical_main_sha: "ghi789jkl012"
merged_head_reachable_from_main: true
reason_if_not_applicable: ""
verified_by: "opencode"
verified_at: "2026-07-10T12:00:00Z"
next_action: "Record BRANCH_CLEANUP state in task ledger; lane ready for CLOSED"
timestamp: "2026-07-10T12:00:00Z"
evidence_refs:
  - "audits/cleanup-CLN-001.md"
```

---

## Schema Validation Rules

1. Every task-scoped schema MUST include all common task identification fields.
2. `next_action` MUST be a single, concrete action — never empty, never multiple.
3. `evidence` fields MUST reference file paths, never contain inline content.
4. `gates_skipped` MUST record the reason — never silently omitted.
5. No secrets, tokens, keys, or `.env` contents anywhere in any message.
6. All timestamps MUST be ISO 8601 UTC.

---

*See HANDOFF_PROTOCOL.md for routing rules and TASK_LEDGER.md for valid state transitions.*
