---
title: ""
artifact_type: "design-spec"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Design Spec

> **Template ID:** `product/design-spec`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

Define the UX/UI and interaction requirements for the product. The Design Spec translates the Product Spec into screens, components, states, accessibility requirements, and visual constraints.

---

## When to Use

Use the Design Spec after the Product Spec is stable and before implementation begins. The Design Spec should be clear enough that an implementer can build the interface without guessing.

---

## 1. Screens / Views

<!-- List every screen or view the product requires. -->

| Screen ID | Name | Purpose | Route / Entry Point |
|-----------|------|---------|---------------------|
| SCR-001 | | | |
| SCR-002 | | | |

---

## 2. Component Inventory

<!-- List reusable or key components. -->

| Component | Screens Used | Behaviour | States |
|-----------|-------------|-----------|--------|
| | | | |

---

## 3. States

<!-- For every screen and key component, define states. -->

### SCR-001: [Screen Name]

- **Loading state:** <!-- What the user sees while data loads. -->
- **Empty state:** <!-- What the user sees when there is no data. -->
- **Error state:** <!-- What the user sees on error. -->
- **Success state:** <!-- What the user sees on success. -->
- **Edge case states:** <!-- Any unusual but possible states. -->

---

## 4. User Flows

<!-- Describe key multi-screen flows. -->

### Flow 1: [Name]

**Steps:**
1. User is on [screen]. They see [state].
2. User does [action]. System responds with [behaviour].
3. User arrives at [screen]. Outcome is [state].

---

## 5. Accessibility

<!-- What accessibility requirements apply? -->

- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Colour contrast (WCAG AA minimum)
- [ ] Focus management
- [ ] Semantic HTML
- [ ] Touch target sizing

**Additional notes:**

---

## 6. Responsive Behaviour

<!-- How does the design adapt across viewport sizes? -->

| Breakpoint | Behaviour |
|------------|-----------|
| Mobile (< 768px) | |
| Tablet (768px – 1024px) | |
| Desktop (> 1024px) | |

---

## 7. Content Tone

<!-- What voice and tone should the product use? -->

---

## 8. Visual Constraints

<!-- Brand, colour, typography, spacing, or style constraints. -->

---

## Governance Boundary

This artifact does not authorize implementation, merge, dispatch, deployment, GitHub/API mutation, or production certification. The Design Spec defines visual and interaction requirements; it does not authorise execution.
