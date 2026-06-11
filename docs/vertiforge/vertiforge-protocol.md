# VertiForge Protocol

## Purpose

Defines how VertiForge integrates with PNPD-OS and how agents invoke product strategy analysis.

## Scope

VertiForge operates at the **Product Strategy Layer** of PNPD-OS. It does not replace governance, Git discipline, Hermes verification, DeepSeek implementation, or Codex audit.

## Invocation Flow

```
Agent detects product/business need
  │
  ▼
Agent loads VertiForge skill
  │
  ▼
Agent provides product context
  │
  ▼
VertiForge selects output mode (modes 1-12)
  │
  ▼
VertiForge produces structured analysis
  │
  ▼
Hermes or Owner converts analysis into implementation task
  │
  ▼
DeepSeek implements (if applicable)
  │
  ▼
Codex audits implementation for drift
```

## When to Invoke VertiForge

| Scenario | Trigger | Mode |
|----------|---------|------|
| New product idea surfaced | "Should we build X?" | 1 — Opportunity Scan |
| Existing idea needs check | "Is this viable?" | 2 — Idea Validation |
| Mapping vertical operations | "How do they actually work?" | 3 — Workflow Teardown |
| Competitive pressure | "What are others doing?" | 4 — Competitor Teardown |
| Building first version | "What do we build first?" | 5 — MVP Scope |
| Launch planning | "How do we get customers?" | 6 — GTM Playbook |
| Revenue model design | "What should we charge?" | 7 — Pricing & Packaging |
| Fundraising preparation | "How do we pitch this?" | 8 — Pitch / Investor Narrative |
| Pre-investment review | "What could go wrong?" | 9 — Risk Review |
| Sequencing features | "What comes after MVP?" | 10 — Product Roadmap |
| New geography | "Should we expand there?" | 11 — Market Entry Strategy |
| AI capability evaluation | "Can we add AI here?" | 12 — AI-Native Opportunity Review |

## Output Standards

Every VertiForge analysis should contain:

1. **Context summary** — what was asked and what context was provided
2. **Key findings** — top 3-5 findings with evidence labels
3. **Recommendations** — actionable next steps
4. **Open questions** — what needs owner input or further research
5. **Risk flags** — anything that could invalidate the analysis

## Evidence Requirements

- If research tools (web search, market data APIs) are available, VertiForge must use them
- If research tools are unavailable, all market claims must be labelled **hypothesis-level**
- VertiForge must never fabricate market data or competitor facts

## Non-Goals

- Issue Git commands
- Edit runtime code
- Override AGENTS.md
- Approve or merge PRs
- Replace customer validation
- Set security or compliance policy

## Change Management

This protocol may be updated only through governed skill evolution. No agent may silently modify VertiForge's responsibilities or boundaries.
