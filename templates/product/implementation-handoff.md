---
title: ""
artifact_type: "implementation-handoff"
phase: "1N"
status: "draft"
owner: ""
related_artifacts: []
created_at: ""
updated_at: ""
---

# Implementation Handoff

> **Template ID:** `product/implementation-handoff`
> **Phase 1N-B — Product Delivery Framework**
> **Fillable template. Copy this file into your project workspace and complete each section.**

---

## Purpose

Provide a scoped, agent-ready implementation plan. The Implementation Handoff translates Product Spec, Design Spec, Architecture Spec, and Test Plan into a bounded set of tasks that DeepSeek (implementation agent) can execute safely.

---

## When to Use

Use the Implementation Handoff after all upstream specs are stable and the Owner has authorised implementation. Do not begin implementation without this handoff.

---

## 1. Branch

**Branch name:** <!-- e.g., deepseek/phase-xyz-feature-name -->

**Base branch:** <!-- main -->

---

## 2. Task Scope

<!-- What exactly is being implemented in this handoff? One paragraph. -->

---

## 3. Allowed Files

<!-- List every file that may be created or modified. Be explicit. -->

**Create:**
- `path/to/new/file.ts`

**Modify:**
- `path/to/existing/file.ts`

---

## 4. Forbidden Files

<!-- List files that must not be touched. -->

- `package.json` (unless explicitly listed above)
- `.github/workflows/` (unless explicitly listed above)
- `scripts/` (unless explicitly listed above)
- `tests/fixtures/` (unless explicitly listed above)

---

## 5. Implementation Steps

<!-- Ordered list of implementation steps. Each step should be small, verifiable, and reversible. -->

1.
2.
3.
4.
5.

---

## 6. Local Gates

<!-- What commands must pass locally before commit? -->

```bash
node --check <script-path>
npm run validate
npm test
npm run dry-run
```

---

## 7. Expected Verdict

<!-- What verdict should the implementing agent report? -->

**Expected DeepSeek verdict:** `DEEPSEEK_<PHASE>_<DESCRIPTION>_COMMITTED_AMBER_NOT_CODEX_AUDITED`

---

## 8. Security Scans

<!-- What security checks must pass? -->

- [ ] No secrets in committed files
- [ ] No hardcoded credentials
- [ ] No unsafe dependency versions
- [ ] Input validation present where required

---

## 9. Cleanup

<!-- What temporary files, state dirs, or artifacts must be removed before commit? -->

```bash
rm -rf .pnpd/runtime-readiness .pnpd/ledger .pnpd/handoffs .pnpd/locks
```

---

## 10. Rules

- **Do not push.**
- **Do not merge.**
- **Do not modify files outside the allowed list.**
- **Do not add dependencies unless explicitly required and listed.**
- **Do not modify CI workflows unless explicitly authorised.**
- **Run all local gates before committing.**

---

## Governance Boundary

This artifact does not authorize merge, push, dispatch, deployment, GitHub/API mutation, or production certification. Implementation must stay within the scoped file list. Merge and push require separate Owner authorisation after Codex audit.
