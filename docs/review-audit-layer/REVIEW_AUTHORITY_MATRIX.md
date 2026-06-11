# Review Authority Matrix

> Defines the decision authority of each agent/layer in the PNPD-OS review and audit framework.
> This matrix is normative. No agent may exceed its assigned authority.

---

## Authority Levels

| Level | Meaning |
| ----- | ------- |
| **Final** | Ultimate decision authority — no appeal, no override by any agent |
| **Formal Audit** | Authoritative audit with advisory recommendation only |
| **Verification/Routing** | Operational verification and routing only — not audit, not approval |
| **Self-Review** | Local implementation self-check only — not certification, not approval |
| **Communication/State** | Transport and state recording only — no decision, no audit, no approval |

---

## Authority Matrix

| Agent / Layer    | Role                          | Authority Level            | Can Decide Merge? | Can Override? |
| ---------------- | ----------------------------- | -------------------------- | ----------------- | ------------- |
| Owner            | Final decision-maker          | **Final**                  | Yes               | Yes (any)     |
| Codex            | Formal auditor                | **Formal Audit**           | No (advisory)     | No            |
| Hermes           | Verifier and router           | **Verification/Routing**   | No                | No            |
| DeepSeek         | Implementation worker         | **Self-Review**            | No                | No            |
| AgentBridge      | Communication and state layer | **Communication/State**    | No                | No            |

---

## Core Rules

1. **Owner = final decision authority.** The owner may approve, reject, accept caveats, override gates, or request changes at any time. No agent may override the owner.

2. **Codex = formal audit authority.** Codex performs pre-merge and post-merge audits. Codex may approve, request changes, or block. Codex recommendations are advisory to the owner.

3. **Hermes = verification/routing authority only.** Hermes verifies operational state (branch, dirty tree, evidence completeness, scope match) and routes tasks. Hermes does not audit and does not approve merges.

4. **DeepSeek = implementation/self-review only.** DeepSeek implements scoped tasks and performs local autoreview. DeepSeek self-review is NOT formal audit, NOT certification, and does NOT authorize merge.

5. **AgentBridge = communication/state only.** AgentBridge stores structured handoffs, task state, blockers, and decisions. It has zero decision authority.

6. **No agent can approve its own work.** Every gate requires a different agent. DeepSeek cannot certify its own implementation. Hermes cannot audit what it verified. Codex cannot override the owner.

7. **No agent can merge/publish without owner approval.** Merge authorization is reserved to the owner. Codex recommendation alone is insufficient for merge.

---

## Escalation Path

```
DeepSeek (implement + self-review)
  → Hermes (verify + route)
    → Codex (formal audit)
      → Owner (final decision)
```

Each agent hands off to the next. No agent may skip a layer without owner override and recorded rationale.

---

## Owner Override Rules

The owner may override any gate, but:

- Override does not turn a failed gate into a passed gate — it is recorded as *overridden*.
- Every override must include written rationale in the Decision Log.
- Override for security, auth, or data-access risks should be rare and explicitly documented.
- Post-merge audit is mandatory when pre-merge audit was overridden.

---

*This matrix is normative. Deviation requires a DESIGN_UPDATE record in the Decision Log and owner approval.*
