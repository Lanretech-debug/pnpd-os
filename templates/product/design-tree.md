---
title: ""
artifact_type: "design-tree"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Design Tree

> **Template ID:** `product/design-tree`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

A Pre-PRD solution branch map. Before writing a PRD, the Owner must understand the shape of possible solution paths. The Design Tree answers: what solution branches exist, which are plausible, which are rejected, what assumptions each carries, what prototype would test each branch, and what the PRD should focus on.

---

## When to Use

Use the Design Tree after Research Discovery has established that a problem is worth exploring, and before writing a PRD. The Design Tree prevents premature PRD creation by forcing the Owner to survey the solution landscape first.

---

## 1. Problem Statement

<!-- Summarise the problem identified during Research Discovery. One paragraph. Include a link to the Research Discovery artifact if one exists. -->

---

## 2. Solution Branches

<!-- List every plausible solution branch. For each branch, fill the template below. -->

### Branch A: [Name]

**Description:** <!-- One paragraph describing this solution approach. -->

**Assumptions:**
<!-- What must be true for this branch to work? List each assumption explicitly. -->
1.
2.
3.

**Prototype Idea:** <!-- What is the smallest prototype that could test this branch? -->

**Invalidation Criteria:** <!-- What evidence would kill this branch? Be specific and testable. -->

**Risks:** <!-- What are the biggest risks or unknowns for this branch? -->

---

### Branch B: [Name]

**Description:**

**Assumptions:**
1.
2.
3.

**Prototype Idea:**

**Invalidation Criteria:**

**Risks:**

---

<!-- Add more branches as needed (C, D, E...) -->

---

## 3. Rejected Branches

<!-- List branches that were considered and explicitly rejected. For each, state why. -->

| Branch | Rejection Reason |
|--------|------------------|
| | |

---

## 4. Selected Branch

**Branch selected for prototype:** <!-- Branch A / B / C / ... -->

**Owner rationale:** <!-- Why was this branch selected over others? -->

**Prototype scope:** <!-- What prototype will be built to test this branch? Link to prototype plan. -->

---

## 5. PRD Scope Recommendation

**What should the PRD cover:** <!-- Based on the selected branch and planned prototype, what scope should the PRD define? -->

**What must remain explicitly out of scope for the PRD:** <!-- List capabilities, features, or use cases that the PRD should not include. -->

---

## 6. Owner Decision

- [ ] **Selected branch confirmed. Proceed to prototype planning.**
- [ ] **Design Tree incomplete. Return to solution branches.**
- [ ] **No viable branch found. Park or kill the problem.**
- [ ] **Skip prototype and proceed directly to PRD (requires strong evidence).**

**Rationale:**

---

## Governance Boundary

This artifact does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification. The Design Tree is a scoping and decision tool. Only the Owner selects the branch and authorises the next phase.
