---
type: folder-readme
project: pnpd-os
status: scaffold
source: phase-1p-h
privacy: scratch
git_tracking: committed
created: 2026-06-24
updated: 2026-06-24
---

# 90-inbox — Scratch and Inbox

## Purpose

This folder is for scratch and inbox notes — transient, non-canonical material not yet categorised or governed. Inbox content should normally be gitignored or cleared before commit.

No inbox note is created by this scaffold phase.

## Allowed content

- Scratch notes (transient, non-authoritative)
- Draft material not yet ready for categorisation
- README files describing folder governance

## Forbidden content

- Private personal notes (must not be committed)
- Notes that claim canonical authority
- Notes that grant implementation authority
- Generated state or automation output

## Privacy and Git tracking

`scratch`. Transient and non-canonical. Default `git_tracking: gitignored` for content files. This README is committed for scaffold visibility.

Private personal notes must not be committed. Inbox content should normally be gitignored or cleared before commit.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

Inbox notes do not grant implementation authority. Inbox content is scratch and transient. Inbox content is non-canonical.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
