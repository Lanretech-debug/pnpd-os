---
type: folder-readme
project: pnpd-os
status: scaffold
source: phase-1p-h
privacy: repo-governed
git_tracking: committed
owner_authority: required
created: 2026-06-24
updated: 2026-06-24
---

# 01-agents — Agent Records

## Purpose

This folder holds agent-specific handoffs, verdicts, implementation reports, and audit reports. Each agent subfolder (Hermes, DeepSeek, Codex) plus Owner decisions has its own space.

No actual handoff record is created by this scaffold phase.

## Allowed content

- Agent handoff notes (after formal authorization)
- Agent-specific verdicts, implementation reports, and audit reports
- Owner decision records
- README files describing folder governance

## Forbidden content

- Actual handoff records created by this phase (not yet authorized)
- Records that override Owner authority
- AgentBridge authority claims
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable. No private personal notes may be committed.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Agent notes do not override Owner authority. Codex audit/finalization evidence remains authoritative only after GitHub verification and canonical promotion.

Future Hermes, DeepSeek, Codex, and Owner decision notes may be stored here after authorization.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
