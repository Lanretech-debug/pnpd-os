---
title: ""
artifact_type: "test-plan"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Test Plan

> **Template ID:** `product/test-plan`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

Define the testing strategy for the product. The Test Plan ensures that every requirement, user story, and acceptance criterion has a corresponding test or a documented reason for being untested.

---

## When to Use

Use the Test Plan after the Product Spec, Design Spec, and Architecture Spec are stable, and before or alongside the Implementation Handoff. Tests should be designed before or alongside implementation, not retrofitted afterward.

---

## 1. Unit Tests

**Framework:** <!-- Jest / Vitest / Mocha / Other -->

**Coverage targets:**

| Area | Coverage Target |
|------|----------------|
| Business logic | |
| Utilities | |
| Data transforms | |

**Exclusions:** <!-- What is explicitly not unit tested and why? -->

---

## 2. Integration Tests

**Scope:** <!-- What integrations are tested? -->

| Integration | Test Approach | Mocking Strategy |
|-------------|--------------|-----------------|
| | | |

---

## 3. End-to-End (E2E) Tests

**Framework:** <!-- Playwright / Cypress / Other -->

**Critical paths to test:**
1.
2.
3.

---

## 4. Fixture Strategy

<!-- What test fixtures are needed? -->

| Fixture Set | Purpose | Count |
|-------------|---------|-------|
| Positive | | |
| Negative / error | | |
| Boundary / edge case | | |

---

## 5. Manual QA

<!-- What must be tested manually? Why can it not be automated? -->

| Test | Reason for Manual |
|------|-------------------|
| | |

---

## 6. Accessibility Checks

- [ ] Automated accessibility linting
- [ ] Manual keyboard navigation test
- [ ] Manual screen reader test
- [ ] Colour contrast audit

---

## 7. CI Gates

<!-- What tests run in CI? What must pass before merge? -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests (smoke only)
- [ ] Lint
- [ ] Type check
- [ ] Schema validation
- [ ] Build

---

## 8. Acceptance Gates

<!-- What gates must pass before the Owner accepts the product? -->

- [ ] All acceptance criteria met
- [ ] All critical path E2E tests pass
- [ ] Manual QA checklist complete
- [ ] Accessibility checks pass
- [ ] Codex audit passed
- [ ] Owner decision recorded

---

## 9. Known Untested Areas

<!-- What is explicitly not tested? Document the risk. -->

| Area | Reason Not Tested | Risk |
|------|-------------------|------|
| | | |

---

## Governance Boundary

This artifact does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification. The Test Plan defines testing strategy; it does not replace Codex audit or Owner acceptance.
