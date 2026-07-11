# Review & Audit Layer

The PNPD-OS Review & Audit Layer operates five distinct review and audit tiers.

Each layer has a different scope, authority, and escalation path.

**No layer may certify its own work.**

**No layer may suppress, bypass, or silently weaken the layer above it.**

## Layer Overview

| Layer | Agent | Role | Authority |
|-------|-------|------|-----------|
| 1 | DeepSeek | Local autoreview — self-check only | None |
| 2 | Hermes | Operational truth verification | Advisory |
| 3 | Codex | Formal pre-merge audit gate | Advisory |
| 4 | Codex | Post-merge retrospective drift check | Advisory |
| 5 | Owner | Final decision-maker | Final |

## Escalation Chain

```
DeepSeek → Hermes → Codex → Owner
```

AgentBridge sits beneath this chain as the shared file layer that all agents read and write.

## Core Rules

1. DeepSeek can review itself, but DeepSeek cannot certify itself.
2. Hermes verification cannot replace Codex audit.
3. Codex audit cannot override owner decision.
4. Owner override must record rationale and does not turn failed/skipped gates into passed gates.
5. Failed gates stay failed until rerun.
6. Skipped gates stay skipped, blocked, or not-run — never passed.

See individual layer docs for detailed authority boundaries and escalation paths.
