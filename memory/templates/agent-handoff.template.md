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

# TEMPLATE ONLY — Agent Handoff

This template is an authorship aid, not an authoritative record.

No automation is authorized.

Owner remains final authority.

## Intended use

Use this template when recording an agent handoff between Hermes, DeepSeek, Codex, or the Owner.

## Required fields

- `type`: `agent-handoff`
- `agent`: target agent (e.g. `Hermes`, `DeepSeek`, `Codex`)
- `source`: authoring agent
- `phase`: associated phase identifier
- `privacy`: `repo-governed`
- `git_tracking`: `committed`

## Content body

```markdown
# Handoff — <source-agent> → <target-agent>

## Handoff date

## Scope

## Deliverables

## Handoff conditions

## Acceptance criteria

## Blockers
```

## Authority boundary

- Agent handoffs are advisory coordination records.
- They do not override Owner authority.
- They do not grant AgentBridge authority or bypass governance gates.

## Promotion or validation requirements

- Fresh session for design authority when Hermes is involved.
- No duplicated semantic sections.
- Owner review before acceptance.
