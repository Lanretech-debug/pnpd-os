---
type: baseline-pointer
project: pnpd-os
phase: 1p-h
verdict: PHASE_1P_H_GIT_BACKED_OBSIDIAN_MEMORY_SCAFFOLD_PUSHED_CI_GREEN
status: active
source: Hermes
owner_authority: required
canonical_commit: bbd9700c60627574a4389861aadff826fcce26cb
ci_run: 28130153767
agent: Hermes
created: 2026-06-24
updated: 2026-06-24
tags:
  - pnpd-os
  - phase-1p-h
  - baseline-pointer
  - memory-scaffold
privacy: repo-governed
git_tracking: committed
---

# Phase 1P-H Baseline Pointer — Git-backed Obsidian Memory Scaffold

This is a canonical pointer to `docs/pnpd/current-capability-map.md`, not a duplicate canonical map.

Phase 1P-H implemented the manual Markdown scaffold under `memory/`. The scaffold is Git-backed and Obsidian-compatible, but it is not an Obsidian vault implementation.

## Canonical reference

- Canonical verdict: `PHASE_1P_H_GIT_BACKED_OBSIDIAN_MEMORY_SCAFFOLD_PUSHED_CI_GREEN`
- Canonical commit: `bbd9700c60627574a4389861aadff826fcce26cb`
- Remote CI run: `28130153767`
- Remote CI conclusion: `success`
- Canonical map authority: `docs/pnpd/current-capability-map.md`

## Boundary

Owner remains final authority.

No automation is authorized.

No AgentBridge authority is created.

No registry writes are authorized.

No production readiness claim.

No adoption readiness claim.

Obsidian is the human-facing editor and navigation interface only.

Committed Markdown files are the source of truth.

No .obsidian directory is created.

## Non-goals

This pointer record does not create:

- schema
- validator
- fixture
- runtime behavior
- registry writes
- AgentBridge authority
- dashboard behavior
- deployment
- dispatch
- project profile
- Teach Skill
- handoff record
- governance decision
- Obsidian vault implementation
- `.obsidian` directory

## Drift control

This file points to the canonical map. It must not copy the full capability map, long audit reports, implementation reports, or CI logs.

If this pointer conflicts with `docs/pnpd/current-capability-map.md`, the map remains the canonical capability authority until a later Owner-authorized reconciliation changes that.
