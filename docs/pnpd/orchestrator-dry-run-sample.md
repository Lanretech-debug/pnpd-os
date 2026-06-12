# PNPD Orchestrator Dry-Run Sample

Command:

```bash
node scripts/pnpd-orchestrator-dry-run.mjs --registry .pnpd/repos.example.json
```

Sample output shape:

```text
PNPD Orchestrator Dry Run
Mode: dry-run
Registry: /absolute/path/.pnpd/repos.example.json
Dispatch enabled: false
Generated at: 2026-06-12T00:00:00.000Z

Repo: PNPD OS (pnpd-os)
  Path: /absolute/path
  Enabled: true
  Branch: codex/phase0-orchestrator-loop
  Dirty: false
  Classification: CODEX_REVIEW_REQUIRED
  Dispatch allowed: false
  Gates:
    - secrets: pass - No secret-like registry fields detected.
    - path: pass - Repo path exists.
    - git: pass - Path is a Git worktree.
    - branch: pass - Current branch: codex/phase0-orchestrator-loop
    - dirty-tree: pass - Working tree is clean.
    - protected-branch: pass - Current branch is not protected.
    - external-writes: pass - No external writes are implemented in Phase 0.
    - budget-rate-limit: not-run - No external actions are implemented in Phase 0.
    - max-parallel-threads: pass - Maximum parallel dispatch is fixed at 0 in Phase 0.
    - lockfile: not-run - Phase 0 does not create or consume lockfiles.
    - dispatch: blocked - Dispatch is disabled in Phase 0 dry-run mode.
  Next action: Codex formal review of the Phase 0 scaffold before any merge decision.
  Handoff preview:
    to: codex
    status: CODEX_REVIEW_REQUIRED
    next_action: Codex formal review of the Phase 0 scaffold before any merge decision.
```

The actual timestamp, path, branch, and dirty-tree result depend on the local checkout.
