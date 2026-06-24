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

# TEMPLATE ONLY — Teach Skill

This template is an authorship aid, not an authoritative record.

No automation is authorized.

Owner remains final authority.

## Intended use

Use this template when authoring a Teach Skill artifact under `memory/03-skills/teach-skills/`.

## Required fields

- `type`: `teach-skill`
- `project`: `pnpd-os`
- `phase`: associated phase
- `tags`: skill taxonomy tags
- `privacy`: `repo-governed`
- `git_tracking`: `committed`

## Content body

```markdown
# Skill — <skill-id> — <skill-name>

## Skill type

## Target agent

## Trigger condition

## Input schema

## Output schema

## Example

## Anti-patterns

## Related prompt patterns

## Related audit patterns
```

## Authority boundary

- Teach Skills are authored as committed Markdown under `03-skills/`.
- They may reference prompt patterns and reuse catalog entries.
- No Teach Skill Studio implementation is authorized by this scaffold.
- Skills do not grant implementation authority.

## Promotion or validation requirements

- Separate design, Owner approval, implementation, Codex audit, and GitHub verification before any Teach Skill Studio capability is realized.
