# VertiForge Research Discovery Mode

## Status

**Docs/templates only.** This document describes a research methodology and provides templates. No runtime, no automation, no tooling. Research Discovery Mode is exercised by a human (Owner) or an AI agent following these instructions manually.

## What it is

Research Discovery Mode is a problem-first research methodology within VertiForge. It provides a structured process for discovering, investigating, and validating real problems before committing to a solution, product, or build.

It complements the existing 12 VertiForge output modes by adding a dedicated research layer that sits before and alongside product strategy analysis.

## What it is not

- Not a runtime or automated research tool.
- Not a web scraper or data aggregator.
- Not a replacement for customer conversations.
- Not a replacement for domain expertise.
- Not a substitute for market data or competitive intelligence tools.
- Not a product decision engine — the Owner remains the final decision-maker.

## Why it exists

Product strategy without disciplined research produces:

- Solutions looking for problems.
- Unvalidated assumptions treated as facts.
- Missed failure patterns from prior work.
- Decisions made on weak or biased evidence.
- Scope creep driven by enthusiasm rather than evidence.

Research Discovery Mode forces problem-first thinking, evidence labelling, source discipline, and structured owner decision-making. It is the research complement to VertiForge's existing strategy output modes.

## The five research phases

Research Discovery Mode is organised into five phases. Each phase has a corresponding fillable template under `templates/research/`.

| # | Phase | Template | Purpose |
|---|-------|----------|---------|
| 1 | **Problem Discovery** | `problem-discovery.md` | Identify and define a real problem worth investigating |
| 2 | **Source Review** | `source-review.md` | Assess the credibility, relevance, and insight of a single source |
| 3 | **Experiment Log** | `experiment-log.md` | Design, run, and learn from a lightweight test or probe |
| 4 | **Failure Mining** | `failure-mining.md` | Extract lessons from a past failure or blocked attempt |
| 5 | **Owner Decision** | `owner-decision.md` | Synthesise evidence into a structured owner-level decision |

These phases are not strictly linear. A research cycle may move between them as evidence accumulates.

## When to invoke Research Discovery Mode

Invoke Research Discovery Mode when the task involves:

- Discovering or defining a new problem to investigate.
- Reviewing a source of evidence (article, interview, data, observation).
- Designing or running a lightweight experiment to test an assumption.
- Analysing a past failure for reusable lessons.
- Making an owner-level decision that requires structured evidence synthesis.

## How it fits with VertiForge modes

Research Discovery Mode feeds into the existing 12 VertiForge output modes:

| Research Phase | Typical VertiForge Follow-on |
|----------------|------------------------------|
| Problem Discovery | Mode 1 — Opportunity Scan, Mode 2 — Idea Validation |
| Source Review | Mode 4 — Competitor Teardown, Mode 3 — Workflow Teardown |
| Experiment Log | Mode 2 — Idea Validation, Mode 5 — MVP Scope |
| Failure Mining | Mode 9 — Risk Review, Mode 2 — Idea Validation |
| Owner Decision | Mode 5 — MVP Scope, Mode 6 — GTM Playbook, Mode 10 — Product Roadmap |

Research Discovery Mode does not replace any VertiForge mode. It provides the structured research inputs that make those modes more rigorous.

## Integration with PNPD-OS

Research Discovery Mode belongs to the **Product Strategy Layer** of PNPD-OS, alongside the rest of VertiForge.

| PNPD-OS Phase | Research Discovery Mode Contribution |
|---------------|--------------------------------------|
| P0 — Idea Capture | Problem Discovery, Source Review |
| P1 — Validation Plan | Experiment Log, Failure Mining |
| P2 — MVP Definition | Owner Decision (scope decisions) |

## Evidence labelling

Every claim in a Research Discovery Mode artifact must carry one of these labels:

- **Known fact** — verified by evidence provided or cited.
- **Assumption** — reasonable inference given context; not yet verified.
- **Unknown** — gap that affects the analysis.
- **Research needed** — requires external research, tools, or owner input.
- **Owner decision** — requires human judgement and cannot be resolved by research alone.

This labelling discipline is mandatory. It prevents AI agents from fabricating facts or presenting assumptions as evidence.

## Research quality standards

When reviewing sources or logging experiments, apply these standards:

1. **Source attribution** — Every claim must trace to a named, citable source.
2. **Evidence strength** — Rate evidence as strong, moderate, weak, or anecdotal.
3. **Bias awareness** — Identify potential bias in every source (funding, affiliation, selection, confirmation).
4. **Recency** — Note when the evidence was collected; stale evidence should be flagged.
5. **Relevance** — Connect each source explicitly to the problem under investigation.
6. **Falsifiability** — Frame hypotheses so they can be disproven, not just confirmed.

## Safety boundaries

Research Discovery Mode must not:

- Fabricate market data, competitor facts, or user quotes.
- Present assumptions as known facts.
- Overstate evidence strength.
- Push the Owner toward a solution without adequate problem validation.
- Substitute for real customer conversations or domain expertise.
- Override Codex audit, Hermes verification, or PNPD governance.
- Authorise product decisions — the Owner is the final decision-maker.

## Template inventory

All templates are under `templates/research/`:

| Template | File | Description |
|----------|------|-------------|
| Problem Discovery | `templates/research/problem-discovery.md` | Define a problem, its affected users, current workarounds, and evidence quality |
| Source Review | `templates/research/source-review.md` | Assess a single source for credibility, relevance, bias, and actionable insight |
| Experiment Log | `templates/research/experiment-log.md` | Design and log a lightweight experiment to test a hypothesis |
| Failure Mining | `templates/research/failure-mining.md` | Extract root causes and lessons from a past failure |
| Owner Decision | `templates/research/owner-decision.md` | Synthesise evidence into a structured owner decision |

## How to use the templates

1. Copy the relevant template from `templates/research/` into your project workspace.
2. Fill in each section with the best available evidence.
3. Label every claim with its evidence class (known fact, assumption, unknown, research needed, owner decision).
4. Date and sign (or record the agent) each entry.
5. Store completed templates in your project's research directory.
6. Reference completed templates when invoking VertiForge output modes.

## Non-goals

- Automate research or web scraping.
- Replace customer discovery interviews.
- Generate market sizing from thin data.
- Create a research database or search engine.
- Integrate with external APIs or data sources.
- Authorise product or build decisions.

## Change management

This methodology may be updated only through governed phase changes. No agent may silently expand Research Discovery Mode's scope, add automation, or change its safety boundaries.
