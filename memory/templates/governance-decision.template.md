---
type:
project:
phase:
verdict:
status:
source:
owner_authority:
canonical_commit:
ci_run:
agent:
created:
updated:
tags:
privacy:
git_tracking:
---

# TEMPLATE ONLY — Governance Decision

This template is an authorship aid, not an authoritative record.

No automation is authorized.

Owner remains final authority.

## Intended use

Use this template when recording a governance decision, blocked/deferred scope item, approval, or Controlled Unlock record under `memory/04-governance/`.

## Required fields

- `type`: `governance-decision`
- `project`: `pnpd-os`
- `phase`: associated phase if applicable
- `status`: `draft` | `active` | `blocked` | `deferred` | `approved`
- `owner_authority`: `required`
- `privacy`: `repo-governed`
- `git_tracking`: `committed`

## Content body

```markdown
# Decision — <slug>

## Status

## Background

## Decision

## Rationale

## Scope affected

## Deferred or blocked dependencies

## Review date

## Promotion conditions
```

## Authority boundary

- Governance decisions are authoritative only after Owner approval.
- Deferred items must not be mistaken for active backlog.
- Blocked items must not be described as actionable.
- No deferred work becomes implementation merely by appearing in this record.

## Promotion or validation requirements

- Owner authorization before active status.
- Reference to `docs/pnpd/current-capability-map.md` and `docs/pnpd/deferred-scope-reconciliation.md` for current state.
