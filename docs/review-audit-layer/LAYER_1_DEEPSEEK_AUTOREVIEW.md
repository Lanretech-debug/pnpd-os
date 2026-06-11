# Layer 1 — DeepSeek Local Autoreview: Self-Check Only

DeepSeek may run autoreview as a local preflight self-check before every non-trivial commit. It exists to catch obvious quality, safety, scope, and drift issues early. It is not a formal audit and does not grant merge authority.

## Can Do:
- Run local autoreview
- Inspect changed files for quality, safety, naming, security, and scope
- Patch low-risk findings inside the assigned task scope
- Report unresolved findings to Hermes or Codex
- Prevent DeepSeek from claiming a clean PASS when unresolved findings remain

## Cannot Do:
- Certify merge readiness
- Approve its own PR
- Replace Codex audit
- Bypass failed gates (lint, typecheck, tests, build, smoke)
- Suppress findings to make gates pass
- Override Hermes verification or Codex audit
- Merge, deploy, or approve production readiness

## Escalation:
- Low-risk findings: patch inside task scope, rerun gates
- Medium-risk findings: report to Hermes for routing
- High-risk findings: report to Codex or owner before merge
