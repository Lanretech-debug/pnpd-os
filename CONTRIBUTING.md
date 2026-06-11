# Contributing to PNPD-OS

PNPD-OS is a governance and delivery framework. Contributions are welcome, especially:

- Improvements to protocol clarity
- Additional AgentBridge message schemas
- New VertiForge analysis modes
- Anti-drift control refinements
- Phase model extensions
- Real-world adoption examples

## Contribution Rules

1. **All contributions must follow PNPD-OS governance.** Yes, the framework governs itself.
2. **No agent certifies its own work.** Every PR must pass independent review.
3. **Git over chat.** Evidence must be repo-committed, not referenced from chat transcripts.
4. **Failed gates stay failed.** Skipped gates must record the reason.
5. **Anti-drift controls apply.** See `docs/agent-bridge/TASK_LEDGER.md`.

## Process

1. Open an issue describing the proposed change
2. Create a branch: `feat/`, `fix/`, `docs/`, or `chore/`
3. Implement with scoped commits
4. Self-review using the AgentBridge handoff protocol
5. Request Hermes verification (state/branch/dirty-tree check)
6. Request Codex audit (scope, safety, governance consistency)
7. Owner approves and merges

## Agent Roles for Contributors

| Role | Who | Responsibility |
|------|-----|---------------|
| Implementer | You (or your AI assistant) | Write the change, self-review |
| Verifier | Hermes or equivalent | Check branch, worktree, evidence |
| Auditor | Codex or equivalent human reviewer | Audit scope, governance consistency |
| Owner | Repo maintainer | Final merge decision |

See `PNPD-OS-MANIFEST.md` for the full role model.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.
