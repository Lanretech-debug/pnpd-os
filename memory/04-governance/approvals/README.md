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

# Approvals

## Purpose

This folder holds Owner approval records, merge authorizations, and release governance decisions.

No approval record is created by this scaffold phase.

## Allowed content

- Owner approval records (after explicit Owner authorization)
- Merge authorization records
- Release governance decisions

## Forbidden content

- Approval records without explicit Owner authorization
- Approvals attributed to Owner without verification
- AgentBridge authority claims
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

All gates require Owner decision for merge and release. Codex audit is required before merge.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
