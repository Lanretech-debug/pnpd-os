# PNPD-OS

> **Project Normalisation & Product Delivery Operating System**

A reusable governance, agent orchestration, review/audit, and product strategy framework for AI-assisted software projects.

---

## What PNPD-OS Is

PNPD-OS is a **framework**, not a runtime. It provides the rules, protocols, state machines, and strategy layers that keep AI-assisted software projects on track — from idea capture through production delivery.

It was built and stress-tested on real multi-agent development workflows, then extracted and generalised for any project.

---

## Four Pillars

| Pillar | Purpose | Location |
|--------|---------|----------|
| **PNPD OS Core** | Governance manifest, operating principles, phase model, repo rules | `PNPD-OS-MANIFEST.md`, `docs/governance/` |
| **AgentBridge** | File-based agent handoff, task state, audit queue, blocker log | `docs/agent-bridge/` |
| **Review & Audit Layer** | Five-layer review/audit authority model with escalation paths | `docs/review-audit-layer/` |
| **VertiForge** | Product strategy advisory — validation, scoring, roadmap, risk | `docs/vertiforge/` |

---

## Who This Is For

- Solo developers building with AI coding assistants who need project discipline
- Small teams adopting agent-assisted workflows
- Open-source maintainers who want clear agent governance
- Founders validating vertical SaaS or industry-specific software ideas

---

## Quick Start

1. Copy `PNPD-OS-MANIFEST.md` into your project as `AGENTS.md`
2. Set your current product phase in `docs/PRODUCT_PHASE.md` using the phase model
3. Wire the Review & Audit Layer roles to your actual agents (or keep the defaults)
4. Create a task using the AgentBridge handoff protocol
5. Run your first gate: Hermes verification → Codex audit → owner decision

---

## Philosophy

- **No agent certifies its own work.** Every gate requires a different agent.
- **Filesystem is truth.** Git state overrides agent claims.
- **Failed gates stay failed.** Skipped gates stay skipped — never silently passed.
- **Owner is final authority.** Agents advise, verify, audit — they do not decide.
- **Governance serves product progress.** Anti-cycle controls prevent governance spirals.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

*PNPD-OS is a framework for project delivery, not a product. It has no runtime, no servers, no live messaging, and no automated merge/deploy authority.*
