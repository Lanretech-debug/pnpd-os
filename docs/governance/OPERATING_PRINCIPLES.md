# PNPD-OS Operating Principles

1. **No dirty-tree drift** — verify git status before every commit.
2. **No blind git add .** — stage only intended files; scoped commits only.
3. **One short-lived branch per coherent concern** — use feat/, fix/, docs/, chore/, experiment/ prefixes.
4. **Product/runtime work must not mix with governance/docs work** — separate worktrees required.
5. **Git and GitHub are operational truth** — git status overrides agent claims.
6. **Repo-local governance is agent authority** — AGENTS.md and docs/ are the law.
7. **External notes are human memory, not agent authority** — must link back to repo evidence.
8. **Chat transcript is context, not source of truth** — never cite chat as evidence.
9. **Secrets must never be printed or committed** — rg scan before every commit.
10. **Deprecated paths must not be used as source/fallback/import target** — verified via forbidden-path search.
11. **Classify before changing** — dirty tree, branch, phase, risk classification first.
12. **Audit before rename** — naming auditor runs read-only first.
13. **Audit before deletion** — never delete in first pass; classify as ARCHIVE_CANDIDATE first.
14. **Verify before push** — Hermes checks branch, tree, remote before any push.
15. **PR before merge** — Codex audit gate required.
16. **Codex or equivalent auditor reviews before merge/main** — PENDING_CODEX_FINAL_AUDIT if unavailable.
17. **Hermes or equivalent orchestrator verifies state/capability truth** — always verify, never trust.
18. **Owner controls final merge and product decisions** — no agent may merge to main.
19. **Agents improve skills only through governed skill evolution** — Evidence → Lesson → Rule → Verification → Audit → Merge.
20. **No agent may silently rewrite its own authority rules** — AGENTS.md changes require Hermes verification + owner approval.
21. **Product development must not be replaced by endless governance work** — anti-cycle breaker.
22. **Every project must have a current phase, current milestone, and next valuable increment** — see PHASE_MODEL.md.
