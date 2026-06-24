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

# Memory — PNPD Git-Backed Obsidian Memory Scaffold

## Purpose

This directory is the Git-backed, Obsidian-compatible, Markdown-first PNPD memory scaffold. It provides the folder structure, templates, and governance boundaries defined by Phase 1P-G (Teach Skills / Obsidian / Git Knowledge Layer Categorisation Design).

Git is the canonical version-control, review, rollback, branch, and audit layer. Obsidian is the human-facing editor and navigation interface only. Committed Markdown files are the source of truth.

This scaffold does not implement schema, validator, fixture, registry writes, dashboard, AgentBridge authority, deployment, dispatch, or Teach Skill Studio.

## Allowed content

- README files describing folder purpose and governance
- Template files as authorship aids (non-executable)
- Future committed Markdown notes after authorization under the appropriate subfolder
- `.gitignore` rules for non-canonical local state

## Forbidden content

- `.obsidian/` directory or any Obsidian config files
- Plugin state, cache, or device-specific state
- Binary attachments unless governed separately
- Private personal notes (never commit)
- Generated PNPD state or registry writes
- Actual baseline records, project profiles, Teach Skills, or handoff records created by this scaffold phase
- Automation, daemon, watcher, or sync code

## Privacy and Git tracking

This root folder is `repo-governed`. All files committed here are CI-visible and machine-readable. No private personal notes may be committed. Private personal notes must not be committed.

Subfolders may have different privacy classifications:

- `00-canonical/`, `01-agents/`, `03-skills/`, `04-governance/`, `99-archive/` — `repo-governed`
- `02-projects/` — `project-governed`
- `05-research/` — `research` (non-canonical unless promoted)
- `90-inbox/` — `scratch` (transient, non-canonical)

## Authority and automation boundary

No automation is authorized. Owner remains final authority.

No AgentBridge authority is created. No registry writes are authorized. No production readiness claim. No adoption readiness claim.

No `.obsidian` directory is created. Future automation is blocked until separately authorized phase.

## Obsidian compatibility

This scaffold is compatible with Obsidian as a Markdown editor and navigation interface. Obsidian must not become the authority layer. Local workspace, cache, and plugin state are not canonical.

No .obsidian directory is created.

## Grounding references

- `docs/pnpd/current-capability-map.md`
- `docs/pnpd/phase-1p-g-teach-skills-obsidian-git-knowledge-layer-design.md`
- `docs/pnpd/project-profile-schema-and-adoption-model.md`
- `docs/pnpd/framework-classification.md`
- `docs/pnpd/memory-and-product-delivery-framework.md`
- `docs/pnpd/deferred-scope-reconciliation.md`
