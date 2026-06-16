---
title: ""
artifact_type: "prd"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Product Requirements Document (PRD)

> **Template ID:** `product/prd`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

Define what the product must do, for whom, and why. The PRD is the authoritative scope document that all downstream specs, designs, architecture, and implementation must align with. It is not a spec — it defines requirements, not implementation details.

---

## When to Use

Use the PRD after:

- Research Discovery has validated that a real problem exists.
- The Design Tree has selected a solution branch.
- A prototype (if needed) has tested the branch's core assumptions.
- The Owner has decided to commit to building.

Do not write a PRD without completing the steps above. A PRD without prior evidence and solution exploration is a wish list, not a requirements document.

---

## 1. User

<!-- Who is the primary user? What role, context, and needs define them? Reference the Product Vision Brief. -->

---

## 2. Problem

<!-- What problem does this product solve? One paragraph. Reference Research Discovery artifacts. -->

---

## 3. Goals

<!-- What does the product achieve? List measurable outcomes. -->
1.
2.
3.

---

## 4. Non-Goals

<!-- What does this product explicitly NOT achieve? What adjacent problems, features, or use cases are out of scope? -->
1.
2.
3.

---

## 5. Scope

### In Scope

<!-- What capabilities, features, and use cases are included? -->

### Out of Scope (for this version)

<!-- What is explicitly excluded from this version but may be considered later? -->

---

## 6. User Journeys

<!-- Describe the key user journeys. What does the user do from start to finish? -->

### Journey 1: [Name]

**Steps:**
1.
2.
3.

**Success outcome:**

### Journey 2: [Name]

**Steps:**
1.
2.
3.

**Success outcome:**

<!-- Add more journeys as needed. -->

---

## 7. Requirements

<!-- List each requirement with a unique ID. Use the format REQ-001, REQ-002, etc. -->

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| REQ-001 | | Must / Should / Could | |
| REQ-002 | | Must / Should / Could | |

---

## 8. Success Criteria

<!-- How will you know the product is successful? Define measurable criteria. -->
1.
2.
3.

---

## 9. Risks

<!-- What are the biggest risks to delivery or success? -->

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| | Low / Medium / High | Low / Medium / High | |

---

## 10. Dependencies

<!-- What external systems, services, knowledge, or resources does this product depend on? -->

---

## 11. Acceptance Criteria (Owner-level)

<!-- What must be true for the Owner to accept this product as done? -->
1.
2.
3.

---

## 12. Owner Decision

- [ ] **PRD accepted. Proceed to Product Spec and Design Spec.**
- [ ] **PRD needs revision before proceeding.**
- [ ] **PRD rejected. Return to Design Tree or Research Discovery.**

**Rationale:**

---

## Governance Boundary

This artifact does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification. The PRD defines requirements; it does not authorise their execution. Only the Owner decides when to proceed from PRD into specification, design, and implementation.
