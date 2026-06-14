# PNPD-OS

> **Project Normalisation & Product Delivery Operating System**
> **Version:** v0.1.0 — early-stage governance and orchestration documentation framework

A reusable governance, agent orchestration, review/audit, and product strategy framework for AI-assisted software projects.

---

## Version Status

PNPD OS is currently **v0.1.0**. It is an **early-stage governance and orchestration documentation framework**. It does not guarantee correctness, security, compliance, or zero drift. It does not replace human review or owner judgment.

## Public Release Gate

Public release or visibility changes require:

1. clean verification,
2. Codex pre-publication audit,
3. final owner approval.

Do not publish or change visibility based only on implementation or self-review.

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

## Quick local verification

PNPD OS can be verified locally with the npm scripts in `package.json`:

```bash
npm run validate
npm run dry-run
npm test
```

See [`docs/quickstart-local.md`](docs/quickstart-local.md) for prerequisites, direct Node fallback commands, and safety notes.

Dispatch remains blocked; these commands validate schemas/fixtures and run local dry-run checks only.

For current PNPD capabilities and runtime readiness usage, see [`docs/pnpd/current-capability-map.md`](docs/pnpd/current-capability-map.md) and [`docs/pnpd/runtime-readiness-usage.md`](docs/pnpd/runtime-readiness-usage.md).

---

## Philosophy

- **No agent certifies its own work.** Every gate requires a different agent.
- **Filesystem is truth.** Git state overrides agent claims.
- **Failed gates stay failed.** Skipped gates stay skipped — never silently passed.
- **Owner is final authority.** Agents advise, verify, audit — they do not decide.
- **Governance serves product progress.** Anti-cycle controls prevent governance spirals.
- **Orchestrator is coordination only.** It may coordinate and recommend; it may not approve, merge, deploy, or bypass gates.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

*PNPD-OS is a framework for project delivery, not a product. It has no runtime, no servers, no live messaging, and no automated merge/deploy authority.*
