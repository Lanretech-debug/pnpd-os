# PNPD Skeptic and Bug Forecast Governance Pack

## 1. Purpose

This is a docs-only governance pack. It follows the completed bug forecast validator track (1Q-C through 1Q-H). It defines boundaries for Skeptic artifacts and bug forecast reports.

This document does not:

- activate Skeptic
- add runtime behavior
- add CI behavior
- create a generator
- claim production readiness
- certify anything
- implement anything
- change any existing file other than this document

It is advisory-only, non-executable, Owner-gated, and Codex-gated. It exists to provide a governed policy boundary that future phases can reference when Skeptic or bug forecast consumption is explicitly authorized.

## 2. Baseline

```
Baseline verdict: PHASE_1Q_H_BUG_FORECAST_AUDIT_SURFACE_PUSHED_CI_GREEN
Baseline commit: 39ea9f75c20f9820440314281d921cf7b0baa3d3
Remote CI run: 27999569298
Remote CI conclusion: success
```

Completed bug forecast validator track summary:

- 1Q-C: bug forecast schema
- 1Q-D: bug forecast fixtures and standalone validation
- 1Q-E: zero-example discovery
- 1Q-F: one valid synthetic example
- 1Q-G: isolated negative examples
- 1Q-H: read-only audit summary

## 3. Non-Cyclic Transition From Validator Track

The bug forecast validator track is complete. Phase 1Q-I must not add another validator phase. It must not add examples. It must not add negative examples. It must not add fixtures. It must not change schema.

Phase 1Q-I moves from validator infrastructure to governance boundaries. This transition is intentional: the validator track proved that the schema, fixtures, examples, and audit surface are canonical and green. Further work belongs in governance, not in another validator micro-phase.

Reopening the validator track is allowed only if a real defect is discovered in the schema, fixtures, or validation behavior. Adding coverage for its own sake is not a real defect.

## 4. Authority Model

Owner remains final authority.
Codex remains audit/finalization authority.
Hermes remains design authority.
DeepSeek remains implementation authority.
Skeptic remains advisory and non-executable.
GitHub App remains verification/evidence authority.
AgentBridge has no delegated authority unless explicitly unlocked later.

Skeptic may not:

- approve
- merge
- push
- deploy
- dispatch
- certify
- create runtime effects
- override Owner
- override Codex
- override Hermes
- override DeepSeek implementation boundaries

Skeptic artifacts, including bug forecast reports, are advisory inputs. They do not bind any authority. They do not gate any workflow. They inform; they do not control.

## 5. Skeptic Artifact Consumption Policy

### Allowed consumption

- human review of bug forecast reports
- Codex audit review
- Owner decision support
- Hermes design input
- DeepSeek implementation caution
- local validator acceptance as schema evidence

### Forbidden consumption

- automatic implementation
- automatic fix
- automatic merge
- deployment authorization
- dispatch authorization
- certification
- production readiness claim
- runtime behavior
- hidden scoring
- automatic blocking CI gate
- automatic issue creation
- automatic PR creation

Consumption must remain advisory-only and Owner/Codex-gated. No agent, script, or workflow may treat a Skeptic artifact as an executable trigger, a gate condition, or a deployment signal.

## 6. Bug Forecast Report Authoring Policy

### Allowed provenance labels

Per the bug forecast schema, allowed `producedBy` values are:

- `manual_review`
- `codex`
- `skeptic`

### Label usage rules

- `manual_review` — may be used for human-authored or synthetic examples. Synthetic examples using this label must clearly state they are synthetic.
- `codex` — may be used only when Codex actually authors or audits the artifact. Do not use for placeholders or hypotheticals.
- `skeptic` — may be used only after Skeptic is explicitly activated in a future approved phase. Do not use for placeholders. Do not use before activation.

### Forbidden provenance practices

- Do not fake provenance.
- Do not imply an artifact is machine-generated unless a generator exists and is approved.
- Do not imply an artifact is real if it is synthetic.
- Synthetic artifacts must clearly say synthetic.
- Advisory artifacts must clearly say advisory.
- Reports must not contain secrets, customer data, health data, payment data, bank data, production URLs, access credentials, or private credentials.
- Reports must not embed regulated personal data.

## 7. Skeptic Activation Boundary

Skeptic is not executable now. No Skeptic config may be added in Phase 1Q-I.

Before Skeptic can become executable, a future Hermes design must define:

- allowed input artifact types
- allowed output artifact types
- permitted read-only paths
- forbidden write paths
- no merge authority
- no push authority
- no deployment authority
- no dispatch authority
- no certification authority
- no runtime side effects
- no GitHub/API mutation
- no generated PNPD state unless separately approved
- provenance rules
- redaction rules
- Owner/Codex review gates
- failure behavior
- rollback/disable path

Until that design is approved by Owner and implemented by DeepSeek in a dedicated phase, Skeptic remains a documented role with no executable presence in the repository beyond its role design document.

## 8. Advisory CI Integration Boundary

Advisory CI integration is not implemented now. No CI enforcement exists for bug forecast reports.

Future advisory CI design may consider:

- surfacing validator summary output
- surfacing bug forecast report validation output
- non-blocking advisory annotations
- Owner/Codex review routing
- no CI enforcement at this stage
- no deployment impact
- no certification impact
- no runtime execution

CI must not become:

- automatic approval
- automatic rejection
- production readiness signal
- deployment authority
- dispatch authority
- certification authority

The exact phrase applies: no CI enforcement.

## 9. Forbidden Claims And Actions

The following claims and actions are forbidden at this phase and are not authorized by this governance pack:

- no production readiness — this pack does not declare, imply, or authorize any production readiness
- no deployment — this pack does not authorize any deployment action
- no dispatch — this pack does not authorize any dispatch action
- no certification — this pack does not certify any artifact, schema, or behavior
- no report generation — this pack does not create a bug forecast report generator
- no Skeptic execution — this pack does not activate Skeptic as an executable agent
- no runtime consumption — this pack does not authorize any runtime consumption of bug forecast reports
- no CI enforcement — this pack does not add any CI gate, check, or enforcement
- no automatic implementation — no tool, script, or workflow may use bug forecast findings to automatically change code
- no automatic fix — findings are advisory input, not repair instructions
- no automatic merge — findings do not authorize any merge action
- no automatic issue creation — this pack does not create GitHub issues from bug forecast reports
- no automatic PR creation — this pack does not create pull requests from bug forecast reports

## 10. Required Provenance Labels

The bug forecast schema defines three `producedBy` provenance labels:

- `manual_review`
- `codex`
- `skeptic`

### When each label may be used

- `manual_review`: always permitted. Use for human-authored reports, synthetic examples, and manual inspection artifacts.
- `codex`: permitted only when Codex actually authors or audits the report. Not permitted for placeholder or hypothetical reports.
- `skeptic`: permitted only after Skeptic is explicitly activated in a future approved phase. Not permitted before activation.

### When each label must not be used

- Do not use `codex` for reports that Codex did not write or audit.
- Do not use `skeptic` before Skeptic activation.
- Do not use any label deceptively.

### Why fake provenance is forbidden

Fake provenance undermines audit integrity. If a report claims `codex` provenance but was written by a different agent or by hand, the audit trail is corrupted. Codex audit and Owner review depend on accurate provenance to assess trustworthiness.

### Why synthetic artifacts must identify themselves

Synthetic artifacts are not real findings. They are test fixtures, examples, or design illustrations. If a synthetic artifact does not clearly say it is synthetic, a reviewer may mistakenly treat it as evidence of a real defect or as evidence of operational safety. Both errors are harmful.

### Why advisory artifacts must not pretend to be evidence of operational readiness

Advisory artifacts express opinion, forecast, or caution. They do not prove anything about production behavior. Treating an advisory artifact as operational evidence creates false confidence. The distinction between advisory input and operational evidence must be explicit.

## 11. Evidence Handling Rules

- Evidence references should be minimal.
- Raw sensitive material must not be embedded in bug forecast reports.
- Evidence should use paths, summaries, or synthetic references where possible.
- Evidence must not include private credentials.
- Evidence must not include regulated personal data.
- Evidence must not include health, payment, bank, or immigration data.
- Evidence must not include production secrets.
- Redaction must be explicit when applied.
- `containsSensitiveData` must remain `false` for synthetic artifacts.

## 12. Review And Escalation Rules

- Owner decides whether advisory findings matter. Skeptic findings are input to Owner judgment, not a substitute for it.
- Codex audits technical correctness and scope. Codex may validate that findings are well-formed, correctly scoped, and free of hallucinated claims.
- Hermes designs future boundary changes. If the governance boundary defined here needs adjustment, Hermes produces a design for Owner review.
- DeepSeek implements only approved scoped work. DeepSeek must not expand the governance boundary unilaterally.
- Skeptic, once activated later, remains advisory. Activation does not change Skeptic's role from advisory to authoritative.
- Any request to move from advisory to executable behavior requires a new Hermes design and Owner authorization. No agent may make this transition implicitly.

## 13. Stop Condition

Phase 1Q-I closes the governance pack. After canonicalization:

- Phase 1Q should stop unless Owner explicitly chooses one controlled unlock.
- No further bug forecast validator work unless a real defect is discovered in the schema, fixtures, or validation behavior.
- No further governance pack expansions unless Owner authorizes a specific scope extension.
- Adding coverage for completeness is not a defect and does not justify reopening the track.

## 14. Future Phase Candidates

The following are listed as future options only. None is implemented, authorized, or implied by this governance pack. Each requires Hermes design first, Owner authorization, DeepSeek implementation only after approval, Codex audit/finalization, and GitHub verification:

- Skeptic config design
- report authoring schema design
- advisory CI design
- runtime consumption design

## 15. Gates And Non-Goals

### Gates for this phase

- exact one-file docs-only scope
- no schema edits
- no validator edits
- no fixture edits
- no examples edits
- no package edits
- no CI edits
- no runtime edits
- no Skeptic config
- no generator
- no scanner
- no network
- no generated state

### Explicit non-goals

- This document does not make Skeptic executable.
- This document does not create a bug forecast report generator.
- This document does not add CI integration.
- This document does not authorize any deployment, dispatch, or certification action.
- This document does not change any existing artifact, schema, validator, fixture, or workflow.
- This document does not claim, imply, or authorize production readiness.
