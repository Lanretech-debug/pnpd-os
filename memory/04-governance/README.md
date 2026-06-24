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

# 04-governance — Governance Records

## Purpose

This folder holds governance decisions, blocked/deferred scope records, approvals, and Controlled Unlock records.

This scaffold references existing PNPD docs but does not duplicate them. No governance decision is created by this phase.

## Allowed content

- Governance decision notes (after Owner authorization)
- Blocked scope records
- Deferred scope records
- Approval records
- Controlled Unlock records
- README files describing folder governance

## Forbidden content

- Actual governance records created by this phase
- Records that override Owner authority
- Deferred items described as actionable or active backlog
- Blocked items described as eligible implementation
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. Committed, CI-visible, machine-readable. No private personal notes may be committed.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

`docs/pnpd/current-capability-map.md` and `docs/pnpd/deferred-scope-reconciliation.md` remain grounding references for current governance state. No deferred item becomes implementation merely by appearing in this scaffold.

Committed Markdown files are the source of truth. Obsidian is the human-facing editor and navigation interface only.

## Obsidian compatibility

Obsidian-compatible Markdown. No `.obsidian` directory is created.
