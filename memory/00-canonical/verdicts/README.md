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

# Verdicts

## Purpose

This folder holds verified verdict records — Hermes design verdicts, DeepSeek implementation verdicts, Codex audit verdicts, and Owner authorization records.

No actual verdict record is created by this scaffold phase.

## Allowed content

- Verdict records created after formal authorization and verification.
- Each record must reference its phase, agent, and canonical commit.

## Forbidden content

- Verdict records without formal authorization
- Duplicates of canonical records in `docs/pnpd/`
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
