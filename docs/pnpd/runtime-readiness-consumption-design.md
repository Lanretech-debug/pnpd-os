# PNPD Runtime Readiness Consumption Design

## Purpose

This document is a **Design-only** artifact. It describes possible future consumption models for runtime readiness reports. It grants no authority and describes no current implementation.

**No implementation is included in this phase.** The described models are not implemented and are design speculation only.

**No authority granted.** This design does not approve dispatch, merge, deployment, production readiness, GitHub/API mutation, or any AgentBridge authority expansion.

## Current relationship to existing artifacts

Runtime readiness reports exist alongside but **separate from** other PNPD artifacts:

- **Ledger records** — separate file-based records under `.pnpd/ledger/`. Ledger records capture gate evaluation evidence. Runtime readiness is not currently consumed by ledger records.
- **Handoff records** — separate file-based records under `.pnpd/handoffs/`. Handoff records capture agent handoff state. Runtime readiness is not currently consumed by handoff records.
- **Dispatch readiness** — a separate schema (`.pnpd/dispatch-readiness.schema.json`) with its own validator (`--phase 1f`). Dispatch readiness captures evidence for potential future dispatch decisions. Runtime readiness is not currently consumed by dispatch readiness validation.
- **Runtime readiness is not currently consumed by any authority gate.** Reports are generated and validated but are not referenced by other artifacts or decision processes.

## Future evidence linking model

Runtime readiness reports may later serve as evidence in broader governance chains:

- **`recordId` cross-reference:** The `recordId` field in runtime readiness reports may later be referenced by ledger record `evidence` fields or handoff record metadata, creating an auditable chain of evidence.
- **`integrity.contentHash` tamper evidence:** The SHA-256 `contentHash` may later provide tamper-evident cross-referencing. A ledger or handoff record could reference a runtime readiness report by its content hash, allowing verification that the referenced report has not been modified.
- **`generatedAt` staleness:** The `generatedAt` timestamp may later support staleness checks, ensuring that evidence referenced in decisions is reasonably current.

## Future staleness model

A possible future staleness model could define thresholds for evidence freshness:

- Reports older than **N hours** (e.g., 4 hours) from `generatedAt` may be considered stale for certain decisions.
- Different decision types may carry different staleness thresholds:
  - Local verification evidence: shorter threshold (e.g., 2 hours)
  - Historical audit evidence: longer threshold or no staleness check
- A future validator could reject stale reports when they are presented as evidence for time-sensitive gates.

**No staleness threshold is currently enforced.** All reports are accepted as valid evidence regardless of age.

## Future validator cross-checks

Possible future validation behaviors that may consume runtime readiness reports:

- **Cross-reference validation:** A future validator could verify that a `recordId` referenced in a ledger or handoff record corresponds to an existing, valid runtime readiness report.
- **Stale evidence rejection:** A future validator could reject ledger or handoff records that reference runtime readiness reports older than the configured staleness threshold.
- **Evidence chain checks:** A future validator could verify that the `contentHash` in a referenced report matches the hash recorded in the referencing artifact, providing tamper-evident chain integrity.

**These are design speculations only.** No cross-check validator is implemented.

## Relationship to dispatch readiness

A future dispatch-readiness validator may consider runtime readiness reports as one component of dispatch evidence:

- A runtime readiness report could be referenced in a dispatch-readiness record's `evidence` section.
- The dispatch-readiness validator could cross-check the runtime readiness report for staleness, content hash integrity, and classification consistency.
- **Dispatch remains blocked regardless of runtime readiness.** Even if a runtime readiness report shows a clean classification, dispatch requires Owner approval and Codex audit — neither of which is satisfied by a runtime readiness report alone.
- **Runtime readiness must never alone authorize dispatch.** A runtime readiness report provides a snapshot of state; dispatch requires a separate, explicit decision process involving Owner and Codex.

## Non-authority warnings

Runtime readiness reports **do not** and **must never**:

- Approve dispatch; reports do not approve dispatch
- Approve merge; reports do not approve merge
- Approve deployment; reports do not approve deployment
- Certify production readiness; reports do not certify production readiness
- Authorize GitHub/API mutation; reports do not authorize GitHub/API mutation
- Bypass Owner gate authority
- Bypass Codex audit requirement

## Out of scope

The following are **out of scope** for runtime readiness consumption design:

- Dispatch execution
- Deployment behavior
- Daemonization or persistent processes
- Installer or packaging tooling
- GitHub/API mutation
- Production-readiness certification
- Schema, validator, or runtime behavior changes
- Authority escalation of any kind
