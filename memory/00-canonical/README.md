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

# 00-canonical — Canonical Baselines and Evidence

## Purpose

This folder holds canonical baselines, CI evidence, verified verdicts, and authoritative phase records. All content here is `repo-governed`, committed, CI-visible, and machine-readable.

Git is the canonical version-control layer. Committed Markdown files are the source of truth.

## Allowed content

- Phase baseline notes (after formal authorization and GitHub verification)
- CI evidence records (commit SHAs, run IDs, conclusions)
- Verdict records linked to canonical commits
- README files describing folder governance

## Forbidden content

- Actual baseline records created by this scaffold phase (not yet authorized)
- Duplicates of `docs/pnpd/current-capability-map.md` that create drift
- Obsidian config, plugin state, or device-specific state
- Binary attachments
- Private personal notes
- Automation or generated state

## Privacy and Git tracking

`repo-governed`. All content is committed, CI-visible, and machine-readable. No private personal notes may be committed.

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

No AgentBridge authority is created. No registry writes are authorized. No production readiness claim. No adoption readiness claim.

Canonical baseline, CI evidence, and verdict material belongs here only after formal authorization. This phase creates no actual baseline record.

`docs/pnpd/current-capability-map.md` remains the current canonical capability map. This folder must not duplicate canonical records in a way that creates drift.

## Obsidian compatibility

Obsidian is the human-facing editor and navigation interface only. Obsidian must not become the authority layer.
