---
title: ""
artifact_type: "owner-decision"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Owner Decision

> **Template ID:** `product/owner-decision`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

Record a human Owner decision. Every phase gate in PNPD requires an explicit Owner decision before proceeding. This template captures what was decided, what evidence was reviewed, what alternatives were considered, what risk was accepted, and what is authorised next.

---

## When to Use

Use this template at every phase gate where the Owner must decide whether to proceed, revise, park, or kill. Examples:

- After Research Discovery: proceed to Design Tree?
- After Design Tree: proceed to prototype?
- After prototype: proceed to PRD?
- After PRD: proceed to specs?
- After specs: proceed to implementation?
- After Codex audit: merge?
- After CI evidence: delivery readiness?

---

## 1. Decision

<!-- What decision is being made? One sentence. -->

- [ ] **Proceed** to the next authorised phase.
- [ ] **Revise** the current artifact before proceeding.
- [ ] **Park** this work for later.
- [ ] **Kill** this work permanently.

---

## 2. Evidence Reviewed

<!-- What evidence, artifacts, test results, or audit findings were reviewed before making this decision? -->

1.
2.
3.

---

## 3. Alternatives Considered

<!-- What alternative paths were considered and why were they rejected? -->

| Alternative | Why Rejected |
|-------------|-------------|
| | |

---

## 4. Risk Accepted

<!-- What risks are explicitly accepted by proceeding? -->

1.
2.

---

## 5. Constraints

<!-- What constraints apply to the next phase? -->

1.
2.

---

## 6. Next Authorised Phase

<!-- What phase or action is authorised? Be specific. -->

**Authorised:**

**Phase gate:** <!-- e.g., Phase 1N-C, Design Spec, Implementation Handoff, Merge -->

---

## 7. What Is NOT Authorised

<!-- What must NOT happen as a result of this decision? Be explicit. -->

- [ ] No merge without separate Owner authorisation.
- [ ] No push without separate Owner authorisation.
- [ ] No dispatch.
- [ ] No deployment.
- [ ] No GitHub/API mutation.
- [ ] No production certification.
- [ ] No scope expansion beyond what is listed above.

---

## 8. Signature

**Owner:** <!-- Name or identifier -->

**Date:** <!-- YYYY-MM-DD -->

---

## Governance Boundary

This artifact records a human decision. It does not authorise implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification beyond what is explicitly listed in Section 6. The Owner remains accountable for the decision and its consequences.
