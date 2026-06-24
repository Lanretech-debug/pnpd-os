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

# Codex — Audit/Finalize Agent

## Purpose

This folder holds Codex audit reports, finalization records, and audit-phase evidence.

No actual handoff record is created by this scaffold phase.

## Allowed content

- Codex audit reports (after formal authorization)
- Finalization records with explicit pass/reject verdicts
- Audit evidence referenced by canonical baselines

## Forbidden content

- Actual audit records created by this phase
- Audit reports that claim Owner authority
- AgentBridge authority claims
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Codex remains auditor/reviewer, not Owner. Codex audit evidence is authoritative only after GitHub verification and canonical promotion.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
