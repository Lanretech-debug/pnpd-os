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

# Controlled Unlock

## Purpose

This folder holds Controlled Unlock records — gated capabilities that require explicit phase scope, dependency resolution, safety-boundary review, Owner approval, implementation, Codex audit, and GitHub verification before becoming canonical.

No Controlled Unlock record is created by this scaffold phase.

## Allowed content

- Controlled Unlock records (after Owner authorization and gated review)
- Unlock conditions and dependency documentation

## Forbidden content

- Unlock records without formal authorization
- Records that bypass gated review
- Claims that Controlled Unlock equals current authorization
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Controlled Unlock capabilities are planned for future implementation through a gated, sequenced roadmap. They are not authorized for immediate implementation by this scaffold.

Reference: `docs/pnpd/current-capability-map.md`.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
