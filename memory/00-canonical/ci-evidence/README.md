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

# CI Evidence

## Purpose

This folder holds CI evidence records — remote CI run IDs, commit SHAs, workflow conclusions, and GitHub verification metadata.

No actual CI evidence record is created by this scaffold phase.

## Allowed content

- CI evidence notes created after GitHub App verification and CI green.
- Each record must reference its run ID, commit SHA, and conclusion.

## Forbidden content

- CI evidence records without GitHub verification
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
