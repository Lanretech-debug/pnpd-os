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

# TEMPLATE ONLY — Baseline Note

This template is an authorship aid, not an authoritative record.

No automation is authorized.

Owner remains final authority.

## Intended use

Use this template when creating a canonical baseline note to record a verified phase, CI evidence, and commit reference.

## Required fields

- `type`: `baseline`
- `phase`: PNPD phase identifier (e.g. `1P-G`)
- `verdict`: exact phase verdict string
- `canonical_commit`: full commit SHA verified by GitHub App
- `ci_run`: remote CI run ID
- `privacy`: `repo-governed`
- `git_tracking`: `committed`

## Content body

```markdown
# Baseline — <phase-slug>

## Verdict

## Canonical commit

## CI evidence

## Changed files

## Audit summary

## Promotion conditions
```

## Authority boundary

- This note is canonical only after GitHub verification and CI green.
- It must not claim implementation authority beyond what the phase delivered.
- It must not claim production or adoption readiness.

## Promotion or validation requirements

- GitHub App verification of commit metadata, changed files, and CI conclusion.
- Owner authorization before merge and canonical promotion.
- Codex audit before finalization.
