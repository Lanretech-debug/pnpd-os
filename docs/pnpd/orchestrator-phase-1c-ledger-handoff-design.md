# PNPD Orchestrator Loop — Phase 1C Ledger and Handoff Design

## Document Metadata

| Field | Value |
|-------|-------|
| **Status** | `DEEPSEEK_PHASE_1C_LEDGER_HANDOFF_DESIGN_DOC_COMMITTED_AMBER_NOT_CODEX_AUDITED` |
| **Source** | Hermes design/scoping output, captured by DeepSeek |
| **Scope** | Docs-only design capture |
| **Date** | 2025-06-12 |
| **Branch** | `deepseek/phase1c-ledger-handoff-design` |
| **Baseline** | `2213221` — `merge: Phase 1B PNPD schema proposal into main` |

---

## 1. Baseline

Current confirmed state:

- `main` aligned with `origin/main`
- Baseline commit: `2213221`
- Phase 0: complete, merged, pushed
- Phase 1 design doc: complete, Codex-audited, merged, pushed
- Phase 1B schema proposal: complete, Codex-audited, merged, pushed
- Validator passes: default, `--phase 0`, `--phase 1b`
- Dry-run CLI: text and JSON output functional
- Dispatch: disabled (`const: false` in all schemas)
- `scripts/pnpd-orchestrator-dry-run.mjs`: unchanged since Phase 0
- `.pnpd/repos.example.json`: Phase 0-compatible

---

## 2. Phase 1C Scope

Phase 1C defines the **local ledger and handoff design** — a future dry-run extension that can optionally write structured, append-only records to local filesystem directories.

Core characteristics:

- **Local-only.** No network, no GitHub, no API, no remote.
- **Owner-controlled.** Every write path requires an explicit CLI flag.
- **Writes disabled by default.** Dry-run remains the default, zero-write mode.
- **No scheduler.** No background process, no timer, no cron.
- **No daemon.** No process stays resident.
- **No dispatch.** Dispatch remains `const: false`.
- **No GitHub/API mutation.** No remote reads or writes.
- **No deploy.** No deployment path exists.
- **No secrets.** No credential handling, no `.env` parsing.
- **No authority change.** Approval, merge, and audit authority remain with Owner and Codex.

---

## 3. Non-Goals (Explicit)

Phase 1C does **not** include:

- Runtime implementation (this is a docs-only design capture)
- Live scheduler or background process
- Daemon, watcher, or filesystem monitor
- Autonomous dispatch of any kind
- Autonomous commits, merges, or pushes
- GitHub/API mutation (read or write)
- Merge or deploy automation
- Lockfile runtime implementation
- Secrets handling or `.env` parsing
- MCP/A2A runtime integration
- Production configuration
- Cross-repo writes
- Hidden approval or merge-readiness claim path
- Any change to Phase 0 or Phase 1B runtime behavior

---

## 4. Phase 1B Schema Baseline

The following Phase 1B schema fields are relevant to the ledger/handoff design:

### Registry schema (`repos.schema.json`)

| Field | Purpose | Constraint |
|-------|---------|------------|
| `localWrites.allowed` | Future gate for local filesystem writes | `const: false` |
| `scheduler.enabled` | Future scheduler toggle | `const: false` |
| `authority.dispatchAllowed` | Future dispatch guard | `const: false` |
| `authority.externalWritesAllowed` | Future external write guard | `const: false` |
| `secrets.policy` | Secrets handling policy | `const: "deny-all"` |

### Output schema (`orchestrator.schema.json`)

| Field | Purpose | Constraint |
|-------|---------|------------|
| `runId` | Unique identifier per orchestrator invocation | Optional string |
| `schedulerStatus` | Scheduler state | `enum: ["disabled","pending","running","error"]` |
| `lockStatus` (top-level) | Global lock state | `enum: ["unlocked","locked","unknown"]` |
| `lockStatus` (per-repo) | Per-repo lock state | `enum: ["unlocked","locked","stale","unknown"]` |
| `ledgerStatus` | Per-repo ledger health | `enum: ["ok","missing","stale","blocked","unknown"]` |
| `handoffStatus` | Per-repo handoff health | `enum: ["ok","missing","stale","blocked","unknown"]` |
| `authorityFlags` | Explicit authority claim block | All five flags `const: false` |
| `blockedReasons` | Reasons repo is blocked | Array of strings |
| `riskAssessment` | Structured risk output | `{ level, factors[] }` |
| `requiredReviewer` | Named reviewer required | Optional string |

### Authority flags (always `const: false` in schema)

```json
{
  "approvalClaimed": false,
  "mergeClaimed": false,
  "dispatchRequested": false,
  "auditClaimed": false,
  "productionReadinessClaimed": false
}
```

---

## 5. Ledger Model

### Purpose

The ledger is a **chronological audit trail** — a machine-readable, append-only log of every orchestrator inspection for every repo across every run. It records what was observed and when, never what was decided or dispatched.

### Design

| Property | Value |
|----------|-------|
| **Proposed location** | `.pnpd/ledger/YYYY-MM-DD.jsonl` |
| **Scope** | Local repository only |
| **Write mode** | Append-only |
| **Format** | One JSON object per line (JSONL) |
| **Granularity** | One record per repo per orchestrator run |
| **Default behavior** | **No writes.** Requires explicit future `--write-ledger` flag |
| **Automatic commit** | Never. Ledger files are not `git add`'d or committed |
| **Automatic dispatch** | Never. Ledger entries trigger zero actions |
| **Rotation** | Daily by filename (`YYYY-MM-DD.jsonl`) |
| **Retention** | Owner-managed; no automatic cleanup |
| **Cleanup** | Owner-managed; no automatic pruning |
| **Failure mode** | Fail-closed. Any write error aborts without side effects |

### Rationale for JSONL

- Append-only without rewriting the file.
- Line-at-a-time recovery if a write is interrupted.
- Easy to `tail`, `grep`, or stream.
- No dependency on a database.
- No dependency on a JSON parser that must hold the whole file.

---

## 6. Handoff Model

### Purpose

The handoff is an **actionable routing summary** — a structured, pretty-printed JSON file that captures the orchestrator's inspection results for a single repo in a single run, formatted for immediate consumption by the next agent (Hermes or Codex).

### Design

| Property | Value |
|----------|-------|
| **Proposed location** | `.pnpd/handoffs/<repoId>-<runId>.json` |
| **Scope** | Local repository only |
| **Write mode** | Create-only (no overwrite except same run id idempotency) |
| **Format** | Structured JSON, pretty-printed |
| **Granularity** | One file per repo per orchestrator run |
| **Default behavior** | **No writes.** Requires explicit future `--write-handoff` flag |
| **Automatic agent thread** | Never. Handoff files do not create agent threads |
| **GitHub issue/PR comments** | Never. Handoff files never mutate GitHub |
| **Dispatch** | Never. Handoff files never dispatch actions |
| **Authority claims** | Never. Handoff files never claim approval, audit, merge, or production readiness |

---

## 7. Ledger vs Handoff — Distinction

| Dimension | Ledger | Handoff |
|-----------|--------|---------|
| **Purpose** | Chronological audit trail | Actionable routing summary |
| **Audience** | Owner, auditor, future analysis | Next agent (Hermes, Codex) |
| **Format** | JSONL (append-only) | Pretty-printed JSON (one file per run) |
| **Lifecycle** | Accumulates over time | Transient — superseded by next run |
| **Contains decisions?** | No — observations only | No — observations and recommendations only |
| **Contains approval?** | Never | Never |
| **Contains merge readiness?** | Never | Never |
| **Contains dispatch?** | Never | Never |
| **Is an audit?** | No — it is raw data for an auditor | No — it is routing information |

---

## 8. Proposed Record Shapes

### Ledger Entry

```json
{
  "runId": "2025-06-12T09-00-00Z-abc123",
  "timestamp": "2025-06-12T09:00:00.000Z",
  "repoId": "pnpd-os",
  "repoPath": "/Users/lanretech/Projects/pnpd-os",
  "branch": "main",
  "dirty": false,
  "classification": "NEEDS_TRIAGE",
  "dispatchAllowed": false,
  "gates": [
    {"name": "secrets", "status": "pass", "reason": "No secret-like registry fields detected."},
    {"name": "path", "status": "pass", "reason": "Repo path exists."},
    {"name": "git", "status": "pass", "reason": "Path is a Git worktree."}
  ],
  "nextAction": "Hermes verifies repo state, dirty tree, and task scope.",
  "authorityFlags": {
    "approvalClaimed": false,
    "mergeClaimed": false,
    "dispatchRequested": false,
    "auditClaimed": false,
    "productionReadinessClaimed": false
  },
  "blockedReasons": [],
  "riskAssessment": {
    "level": "medium",
    "factors": ["dirty-tree"]
  },
  "requiredReviewer": null,
  "integrity": {
    "schemaVersion": 1,
    "generator": "pnpd-orchestrator",
    "generatorVersion": "1.0.0",
    "contentHash": "sha256-abc123..."
  }
}
```

### Handoff Extension

```json
{
  "from": "pnpd-orchestrator",
  "to": "hermes",
  "repo_id": "pnpd-os",
  "run_id": "2025-06-12T09-00-00Z-abc123",
  "status": "NEEDS_TRIAGE",
  "authority": "coordination/recommendation only",
  "dispatch_allowed": false,
  "authorityFlags": {
    "approvalClaimed": false,
    "mergeClaimed": false,
    "dispatchRequested": false,
    "auditClaimed": false,
    "productionReadinessClaimed": false
  },
  "evidence": {
    "repo_path": "/Users/lanretech/Projects/pnpd-os",
    "branch": "main",
    "dirty_tree": false,
    "gates": ["secrets:pass", "path:pass", "git:pass"]
  },
  "blockedReasons": [],
  "riskAssessment": {
    "level": "medium",
    "factors": ["dirty-tree"]
  },
  "requiredReviewer": null,
  "next_action": "Hermes verifies repo state, dirty tree, and task scope.",
  "integrity": {
    "schemaVersion": 1,
    "generator": "pnpd-orchestrator",
    "generatorVersion": "1.0.0",
    "contentHash": "sha256-def456..."
  }
}
```

**Critical rule:** Both ledger entries and handoff files must **always** show all five authority flags as `false`. No code path may set any flag to `true` in Phase 1C or any earlier phase.

---

## 9. Local Write Allowlist

Future writes are permitted **only** to these directories, and only when explicitly enabled:

| Allowed target | Condition |
|----------------|-----------|
| `.pnpd/ledger/` | Explicit `--write-ledger` flag |
| `.pnpd/handoffs/` | Explicit `--write-handoff` flag |

### Always Denied

| Denied target | Reason |
|---------------|--------|
| Source files (`.js`, `.ts`, `.json`, `.md`, etc.) | No source mutation |
| Schema files (`.pnpd/*.schema.json`) | Schema integrity |
| Scripts (`scripts/`) | No runtime mutation |
| `.git/` | No repo corruption |
| External repos (any path outside repo root) | Scope isolation |
| GitHub/API endpoints | No remote mutation |
| Deployment files | No deploy path |
| `.env` files or secrets files | No credential handling |
| Arbitrary paths outside allowlist | Defense in depth |
| Symlink escapes | Path traversal prevention |
| `..` or absolute paths outside repo root | Path traversal prevention |
| Destructive operations (`rm`, `chmod`, `chown`, `unlink`, `rmdir`) | Data integrity |

---

## 10. Realpath and Path Safety

Before any future write, the implementation must:

1. **Resolve the repo root** via `path.resolve()`.
2. **Resolve the target path** via `fs.realpathSync()` (or async equivalent).
3. **Verify containment**: the resolved target must start with the resolved repo root.
4. **Verify allowlist**: the target must be inside `.pnpd/ledger/` or `.pnpd/handoffs/`.
5. **Reject symlink escapes**: if `realpath` differs from the expected path, fail closed.
6. **Reject `..` segments**: normalize and verify no directory escape.
7. **Reject absolute paths** that point outside the repo root.
8. **Fail closed on ambiguity**: any resolution error or mismatch aborts the write.

```text
Pseudocode (future):
  repoRoot = path.resolve(process.cwd())
  target = path.resolve(repoRoot, requestedPath)
  realTarget = fs.realpathSync(target)

  if (!realTarget.startsWith(repoRoot))       → BLOCKED (path escape)
  if (!isAllowedDir(realTarget))              → BLOCKED (not in allowlist)
  if (containsForbiddenSegment(requestedPath)) → BLOCKED (.., symlink, etc.)
```

---

## 11. File Mutation Policy

| Operation | Policy |
|-----------|--------|
| **Ledger write** | Append-only. Existing lines never modified. |
| **Handoff write** | Create-only. Overwrite permitted only for same `runId` idempotency. |
| **Delete** | Never. Orchestrator does not delete files. |
| **Chmod/chown** | Never. No permission changes. |
| **Rename/copy/move** | Never. No file reorganization. |
| **Source file writes** | Never. No `.js`, `.ts`, `.json`, `.md`, etc. |
| **Writes when repo dirty** | Blocked unless separately owner-approved via explicit flag. |
| **Explicit write flags required** | `--write-ledger`, `--write-handoff` |
| **`--no-write` override** | If present, overrides all write flags. No writes occur. |

---

## 12. CLI Design Proposal (Future)

These flags are **design proposals only**. None are implemented in this docs-only capture.

| Flag | Purpose | Default |
|------|---------|---------|
| `--json` | Output JSON to stdout (already exists) | off |
| `--registry <path>` | Path to registry file (already exists) | `.pnpd/repos.example.json` |
| `--write-ledger` | Enable ledger writes | off |
| `--write-handoff` | Enable handoff writes | off |
| `--ledger-dir <path>` | Override ledger directory | `.pnpd/ledger/` |
| `--handoff-dir <path>` | Override handoff directory | `.pnpd/handoffs/` |
| `--no-write` | Override all write flags — force dry-run | — |
| `--dry-run` | Explicit dry-run (default behavior) | on |

### Defaults (immutable)

- **No writes by default.** Dry-run is the default mode.
- **No scheduler flag.** Scheduler remains a separate future phase.
- **No dispatch flag.** Dispatch remains `const: false`.
- **No GitHub flag.** No remote mutation path.
- **No deploy flag.** No deployment path.

---

## 13. Failure and Recovery Model

Every failure is **fail-closed**: the operation aborts, no partial state is committed, and the owner is notified via exit code and stderr.

| Failure | Classification | Fail-Closed Behavior | Owner Action | Retry? |
|---------|---------------|---------------------|--------------|--------|
| Missing ledger dir | `BLOCKED` | Abort; suggest `mkdir -p` | Create directory manually | Yes |
| Missing handoff dir | `BLOCKED` | Abort; suggest `mkdir -p` | Create directory manually | Yes |
| Permission denied | `BLOCKED` | Abort with errno | Check filesystem permissions | Yes |
| Partial write (crash mid-write) | `BLOCKED` | Last ledger line may be incomplete; next run appends cleanly | Inspect last line; truncate if needed | Yes |
| Disk full | `BLOCKED` | Abort with ENOSPC | Free disk space | Yes |
| Invalid JSON in registry | `BLOCKED` | Abort before any write | Fix registry JSON | Yes |
| Corrupted ledger line (read) | `BLOCKED` | Skip corrupted line; log warning | Inspect and repair ledger | Yes |
| Duplicate run id | `BLOCKED` | Abort (idempotency guard) | Use new run id | Yes (with new id) |
| Dirty repo | `BLOCKED` | Abort unless `--allow-dirty` explicitly set | Commit or stash changes | Yes |
| Missing repo path | `BLOCKED` | Abort; skip repo | Verify repo path in registry | Yes |
| Detached HEAD | `BLOCKED` | Abort; report state | Checkout a branch | Yes |
| Forbidden path detected | `BLOCKED` | Abort with path details | Remove forbidden path from registry | No — fix registry |
| Symlink escape | `BLOCKED` | Abort; refuse write | Remove symlink or fix path | No — fix filesystem |
| Secret detected in output | `BLOCKED` | Abort; redact; do not write | Remove secret from source | No — fix source |
| Write without explicit flag | `BLOCKED` | Skip write silently (or warn) | Add `--write-*` flag | Yes (with flag) |
| Schema validation failure | `BLOCKED` | Abort before any write | Fix schema violation | Yes |
| Interrupted write (SIGTERM) | `BLOCKED` | Last line may be incomplete; ledger is line-at-a-time | Truncate incomplete last line | Yes |

### Recovery Principles

1. **Never delete data.** The orchestrator never cleans up ledger or handoff files.
2. **Idempotent retry.** Same run id + same inputs → same outputs. Handoff overwrite is safe for same run id.
3. **Owner cleans up.** Retention, rotation, and pruning are owner responsibilities.
4. **No automatic repair.** The orchestrator reports problems; it does not fix them.

---

## 14. Security Threat Model

| # | Threat | Risk | Impact | Mitigation | Fail-Closed Rule | Gate |
|---|--------|------|--------|------------|-----------------|------|
| 1 | Secret leakage via handoff | High | Credential exposure | Redact secret-like values before write; `SECRET_VALUE_PATTERN` check | Abort write if secret detected | `secrets` |
| 2 | Prompt injection in handoff | Medium | Agent misdirection | Sanitize free-text fields; strip control characters; minimize user-provided text | Abort on suspicious content | `content-sanitize` |
| 3 | Malicious repo path in registry | Medium | Filesystem escape | `realpath` containment check; path allowlist | Abort on escape | `path-containment` |
| 4 | Symlink escape | High | Write outside repo | `realpath` before write; reject if target differs from expected | Abort on mismatch | `symlink-check` |
| 5 | Path traversal (`../`) | High | Write outside repo | Normalize path; reject `..` segments; verify containment | Abort on traversal | `path-traversal` |
| 6 | Command injection via path/name | Medium | Arbitrary execution | Never shell out with user-provided paths; use `fs` APIs directly | N/A (no shell) | `command-allowlist` |
| 7 | Poisoned registry | Medium | False inspection results | Validate registry against schema before any write; reject unknown fields | Abort on validation failure | `registry-schema` |
| 8 | Ledger tampering | Medium | Audit trail compromise | Append-only prevents deletion; integrity hash enables detection; owner-managed git | Report hash mismatch | `integrity-hash` |
| 9 | Handoff spoofing | Medium | Agent receives forged handoff | Handoff files are local-only; integrity hash; explicit `from` field | Report hash mismatch | `integrity-hash` |
| 10 | Forged approval claim | Critical | Unauthorized merge | All authority flags `const: false` in schema; validator rejects `true` | Abort write; reject input | `authority-flags` |
| 11 | Accidental dispatch | Critical | Unauthorized agent action | `dispatchEnabled: false`, `dispatchAllowed: false` in all schemas | Reject any dispatch field | `dispatch` |
| 12 | Accidental GitHub mutation | Critical | Unauthorized remote change | No GitHub API code path; no `git push`; external writes `const: false` | Reject any external write | `external-writes` |
| 13 | Accidental deploy | Critical | Unauthorized production change | No deploy code path; no deploy fields in schema | Reject any deploy field | `deploy` |
| 14 | Cross-repo contamination | Medium | Wrong repo's data in ledger | Ledger keyed by `repoId`; handoff filename includes `repoId` | Write only to target repo's directories | `repo-isolation` |
| 15 | Runaway file growth | Low | Disk exhaustion | Daily rotation; owner-managed retention; no automatic growth | Warn on large ledger files | `disk-usage` |
| 16 | Disk exhaustion | Medium | Write failure; data loss | Fail-closed on ENOSPC; append-only means existing data preserved | Abort write | `disk-space` |
| 17 | PII leakage | High | Privacy violation | No issue/PR body ingestion in Phase 1C; minimize user-provided text; redact patterns | Abort on detected PII patterns | `redaction` |
| 18 | Production URL leakage | Medium | Infrastructure exposure | No deploy config; no `.env` parsing; no remote reads | Reject URL-like fields pointing to production | `production-url` |
| 19 | Unsafe owner trust in handoff | Medium | Owner acts on stale/incorrect handoff | Authority flags always `false`; handoff explicitly states "recommendation only" | Always mark as advisory | `authority-flags` |

---

## 15. Integrity Model

### Design Principles

- **Simple, dependency-free.** Node.js `crypto` module only (stdlib). No external libraries.
- **Detectable, not provable.** Integrity hash detects tampering; it does not prove authenticity.
- **No signatures.** No cryptographic signatures, no key management, no PKI.
- **No Merkle tree.** No chained hashing across entries.
- **No blockchain.** No distributed consensus.
- **No timestamp authority.** No external time service.

### Proposed Integrity Fields

```json
{
  "integrity": {
    "schemaVersion": 1,
    "generator": "pnpd-orchestrator",
    "generatorVersion": "1.0.0",
    "source": "pnpd-orchestrator-dry-run",
    "contentHash": "sha256-<hex>",
    "previousLedgerHash": "sha256-<hex>"
  }
}
```

| Field | Purpose | Required |
|-------|---------|----------|
| `schemaVersion` | Version of the ledger/handoff record schema | Yes |
| `generator` | Name of the tool that produced the record | Yes |
| `generatorVersion` | Semantic version of the generator | Yes |
| `source` | CLI command or context that produced the record | Yes |
| `contentHash` | SHA-256 of the record's content (minus integrity block) | Yes |
| `previousLedgerHash` | SHA-256 of the previous ledger entry's content (ledger only) | Optional |

### Hash Computation (Future)

```text
content = JSON.stringify(record without integrity block)
hash = sha256(content)
integrity.contentHash = "sha256-" + hex(hash)

For ledger:
  previousLine = last complete line in today's ledger file
  integrity.previousLedgerHash = previousLine.integrity.contentHash
```

---

## 16. Redaction Model

### Values Never Written

| Category | Handling |
|----------|----------|
| Credential values (`sk-...`, `ghp_...`, etc.) | Rejected by `SECRET_VALUE_PATTERN`; write aborted |
| `.env` file contents | Never read; never written |
| API keys, tokens, passwords | Rejected by pattern match |
| Private keys (`-----BEGIN ... PRIVATE KEY-----`) | Rejected by pattern match |
| Real user paths outside repo | Redacted to `<redacted-path>` |
| Issue/PR body text | **Not ingested in Phase 1C** (no GitHub read) |
| User-provided free text in registry | Minimized; sanitized; pattern-checked |

### Redacted Fields in Output

Fields that contain paths outside the repo root are redacted to the form:

```json
{
  "path": "<redacted-path>"
}
```

### Policy Text Exception

Regex literals and policy documentation that contain secret-like patterns (e.g., validator source code, this document) are **not** secrets. The validator's `SECRET_VALUE_PATTERN` regex matches runtime values, not static source text.

---

## 17. Validation Model (Future)

A future ledger/handoff validator should check:

### Record Shape

- Ledger entry conforms to ledger record schema
- Handoff entry conforms to handoff record schema
- Required fields present
- No unknown fields (`additionalProperties: false`)

### Authority Flags

- `approvalClaimed === false`
- `mergeClaimed === false`
- `dispatchRequested === false`
- `auditClaimed === false`
- `productionReadinessClaimed === false`

### Content Safety

- No secret-like values (regex match on all string values)
- No forbidden legacy BricLab path
- No `.env` paths
- No external absolute paths (outside repo root)
- No path traversal (`..` segments)
- No GitHub write fields (`deploy`, `gitPush`, `remoteUrl`)
- No deploy fields
- No approval claim language in free-text fields

### Integrity

- `contentHash` matches recomputed hash
- `schemaVersion` is valid and known
- `generator` is expected
- `previousLedgerHash` matches previous entry (ledger only)

---

## 18. Test Strategy (Design Only)

Tests are designed here but **not implemented** in this docs-only capture.

### Behavioral Tests

| Test | Expected Behavior |
|------|-------------------|
| Default run performs zero writes | No `.pnpd/ledger/` or `.pnpd/handoffs/` files created |
| `--write-ledger` creates ledger file | One JSONL line appended to `.pnpd/ledger/YYYY-MM-DD.jsonl` |
| `--write-handoff` creates handoff file | One JSON file at `.pnpd/handoffs/<repoId>-<runId>.json` |
| `--no-write` overrides `--write-ledger` | Zero writes occur |
| `--no-write` overrides `--write-handoff` | Zero writes occur |
| Ledger is append-only | Second run with same date appends; previous lines unchanged |
| Handoff idempotent for same run id | Second write with same `runId` overwrites safely |
| Path traversal rejected | `../` in path aborts write |
| Symlink escape rejected | Symlink pointing outside repo aborts write |
| Secret-like value rejected | `sk-abc123...` in output aborts write |
| Authority flags always false | Validator rejects any `true` value |
| Dry-run text output unchanged | Phase 0 text output identical with/without write flags |
| Dry-run JSON parseable | `--json` output valid JSON regardless of write flags |
| Phase 0 compatibility | All Phase 0 gates pass with ledger/handoff flags unused |
| Phase 1B validation preserved | `--phase 0` and `--phase 1b` still pass |
| Corrupted ledger line handled | Skip corrupted line; log warning; continue |
| Disk full simulated | Write fails; error reported; no partial state |
| Permission denied simulated | Write fails; error reported; exit code non-zero |

---

## 19. Implementation Phasing

All phases are **future work**. This document covers Phase 1C-1 only.

| Phase | Description | Files Touched | Non-Goals | Gates | Verdict | Codex Audit |
|-------|-------------|---------------|-----------|-------|---------|-------------|
| **1C-1** | Docs-only design capture (this document) | `docs/pnpd/orchestrator-phase-1c-ledger-handoff-design.md` | No code, no schema, no runtime | Diff scope, validator, dry-run, security scans | `AMBER_NOT_CODEX_AUDITED` | Required before merge |
| **1C-2** | Schema proposal for ledger/handoff records | `.pnpd/ledger-record.schema.json`, `.pnpd/handoff-record.schema.json`, validator | No runtime writes, no CLI flags | Schema validation, invariants | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-3** | Validator support for ledger/handoff fixtures | `scripts/pnpd-validate-schemas.mjs` | No runtime writes | Fixture validation, authority flag checks | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-4** | `--write-ledger` behind explicit flag | `scripts/pnpd-orchestrator-dry-run.mjs` (extension) | No handoff writes, no dispatch, no GitHub | Append-only, path allowlist, fail-closed | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-5** | `--write-handoff` behind explicit flag | `scripts/pnpd-orchestrator-dry-run.mjs` (extension) | No dispatch, no GitHub, no authority claim | Create-only, path allowlist, fail-closed | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-6** | Tests and gates | `tests/` | No runtime behavior change | All behavioral tests pass | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-7** | Final handoff and Codex audit | N/A (audit only) | No new code | Full audit checklist | `CODEX_AUDITED` | This IS the audit |

### Phase Dependency Chain

```text
1C-1 (this doc) → 1C-2 (schema) → 1C-3 (validator) → 1C-4 (ledger writes)
                                                       → 1C-5 (handoff writes)
                                                       → 1C-6 (tests)
                                                                            → 1C-7 (audit)
```

---

## 20. Future Codex Audit Checklist

When implementation reaches audit stage (Phase 1C-7), Codex should verify:

### Defaults and Safety

- [ ] No writes by default — dry-run produces zero filesystem side effects
- [ ] `--no-write` overrides all write flags
- [ ] Dry-run output unchanged from Phase 0

### No Autonomous Behavior

- [ ] No scheduler code path
- [ ] No daemon or background process
- [ ] No `setInterval` / `setTimeout` loop
- [ ] No dispatch code path
- [ ] No GitHub API call
- [ ] No `git push`, `git commit`, `git merge`
- [ ] No deploy code path
- [ ] No secret or `.env` file parsing

### Path Safety

- [ ] Ledger writes only inside `.pnpd/ledger/`
- [ ] Handoff writes only inside `.pnpd/handoffs/`
- [ ] `realpath` containment verified before every write
- [ ] Path traversal (`..`) rejected
- [ ] Symlink escape rejected
- [ ] Absolute paths outside repo root rejected

### Data Integrity

- [ ] Ledger is append-only — existing lines never modified
- [ ] Handoff is create-only — overwrite only for same `runId`
- [ ] No file deletion
- [ ] No `chmod`/`chown`
- [ ] No rename/copy/move

### Authority

- [ ] All five authority flags `false` in every output
- [ ] No code path sets any flag to `true`
- [ ] Validator rejects any `true` flag value

### Content Safety

- [ ] Redaction: credential values never written
- [ ] Redaction: token-looking policy text redacted conservatively
- [ ] No issue/PR body text ingested
- [ ] User-provided free text minimized/sanitized

### Integrity

- [ ] `contentHash` present and verifiable
- [ ] `schemaVersion` valid
- [ ] `generator` and `generatorVersion` present

### Compatibility

- [ ] Phase 0 dry-run text output unchanged
- [ ] Phase 0 dry-run JSON output parseable
- [ ] Phase 1B validator passes (all phase flags)
- [ ] `repos.example.json` unchanged
- [ ] No schema regression

### Documentation

- [ ] Docs match implementation
- [ ] CLI `--help` lists new flags with defaults
- [ ] Failure modes documented
- [ ] Recovery procedures documented

---

## 21. Owner Decisions Required

Before Phase 1C proceeds beyond this docs-only capture, Owner must decide:

| # | Decision | Context |
|---|----------|---------|
| 1 | Approve the Phase 1C design direction | This document |
| 2 | Allow docs-only design capture merge to `main` | Gate: Codex audit recommended |
| 3 | Allow future ledger writes behind explicit `--write-ledger` flag | Phase 1C-4 |
| 4 | Allow future handoff writes behind explicit `--write-handoff` flag | Phase 1C-5 |
| 5 | Whether `.pnpd/ledger/` and `.pnpd/handoffs/` should be gitignored | Currently not in `.gitignore` |
| 6 | Whether sample ledger/handoff fixtures are allowed in `tests/` | Phase 1C-6 |
| 7 | Whether issue/PR text remains out of scope until GitHub read threat model | Current scope boundary |
| 8 | Whether lockfile work remains separate Phase 1D | Phase separation |
| 9 | Whether scheduler remains deferred to Phase 1E or later | Phase separation |

---

## 22. Recommended Next Step

1. **Codex docs-only audit** of this document against the baseline at `2213221`.
   - Verify no scope violation.
   - Verify no hidden implementation claims.
   - Verify governance invariants preserved.
2. **Owner review** of audit findings and decisions.
3. If approved: merge this doc to `main`. No runtime implementation begins.

---

## Appendix A: File Manifest (This Capture)

| File | Action |
|------|--------|
| `docs/pnpd/orchestrator-phase-1c-ledger-handoff-design.md` | Created |

No other files are created, modified, or deleted.

---

## Appendix B: Gate Results (Pre-Commit)

All gates must pass before commit. See commit message for gate trace.

| Gate | Expected Result |
|------|----------------|
| `git status --short --branch` | Clean tree on `deepseek/phase1c-ledger-handoff-design` |
| `git diff --name-only` | Only the design doc |
| `git diff --check` | No whitespace issues |
| `node scripts/pnpd-validate-schemas.mjs` | `pnpd schema validation ok` |
| `node scripts/pnpd-validate-schemas.mjs --phase 0` | `pnpd schema validation ok` |
| `node scripts/pnpd-validate-schemas.mjs --phase 1b` | `pnpd schema validation ok` |
| `node scripts/pnpd-orchestrator-dry-run.mjs` | Normal output, no errors |
| `node scripts/pnpd-orchestrator-dry-run.mjs --json \| JSON.parse` | Valid JSON |
| Scope scan (diff only doc file) | No SCOPE_VIOLATION |
| Security scan (secret values) | Policy text and regex literals only |
| Security scan (forbidden path) | No forbidden path usage |
| Runtime scan (executable patterns in doc) | Policy text only |

---

## Appendix C: Governance Invariants (Preserved)

- [x] `dispatchEnabled` remains `const: false`
- [x] `maxParallelThreads` remains `0`
- [x] `mode` remains `dry-run` only
- [x] `authority.dispatchAllowed` remains `const: false`
- [x] `authority.externalWritesAllowed` remains `const: false`
- [x] `scheduler.enabled` remains `const: false`
- [x] `secrets.policy` remains `deny-all`
- [x] `localWrites.allowed` remains `const: false`
- [x] All five authority flags remain `const: false`
- [x] No field grants approval, merge, deploy, dispatch, audit, or production authority
- [x] No GitHub mutation path exists
- [x] No deploy path exists
- [x] No autonomous dispatch path exists
- [x] No scheduler/daemon/watcher exists
- [x] No secret handling exists
- [x] No Phase 0 regression
- [x] No Phase 1B regression
- [x] Codex remains only formal audit authority
- [x] Owner remains final authority
