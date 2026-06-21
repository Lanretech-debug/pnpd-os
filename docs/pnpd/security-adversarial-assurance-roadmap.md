# PNPD Security and Adversarial Assurance Roadmap

## 1. Purpose

This document is a roadmap only. It defines the governed phase structure for introducing security and adversarial assurance capabilities into PNPD-OS.

This document must not implement:

* schemas
* fixtures
* validators
* scripts
* CI
* scanner wiring
* runtime verification
* evidence generation
* executable agents
* dispatch
* deployment
* certification

It exists solely to provide a linear, auditable plan that the Owner, Codex, and future phases can reference.

## 2. Baseline

This roadmap is written against the following canonical baseline:

* **Verdict:** `PHASE_1P_E_PROJECT_PROFILE_FIXTURES_VALIDATOR_PUSHED_CI_GREEN`
* **Repo:** `Lanretech-debug/pnpd-os`
* **Branch:** `main`
* **Commit:** `c2d12099ee87fd1dff30070eb0f60a88cf4eba05`
* **Commit title:** `test: add project profile fixture validation`
* **Remote CI run:** `27885449044`
* **Remote CI conclusion:** `success`

Phase 1P-E made project profile fixtures and validator support canonical. All subsequent phases, including the security and adversarial assurance phases scoped here, inherit this baseline.

## 3. Problem Statement

PNPD-OS currently validates governance structure, schemas, fixtures, and local validator behavior. It provides a disciplined framework for product delivery registry entries, handoff integrity, and controlled dispatch readiness.

However, PNPD-OS does not yet provide:

* deep security assurance
* adversarial test-quality evidence
* dependency integrity evidence
* runtime verification
* production incident feedback

PNPD-OS provides governance structure and validation discipline, but security and runtime assurance remain future layers. Adding these layers requires a governed, phased approach that does not conflate advisory evidence with production certification.

## 4. Why The Security-Skeptic Proposal Is Valid But Too Large

The security-skeptic-runtime-hardening proposal is strategically useful. It correctly identifies gaps in PNPD-OS assurance coverage and proposes meaningful countermeasures.

However, the proposal as originally scoped is too large to implement as a single PR. It combines:

* new agent role
* new schemas
* new scripts
* CI phases
* external scanners
* SBOM generation
* network dependency checks
* runtime verification
* ephemeral environments
* documentation updates
* validator changes

PNPD-OS must split these concerns into controlled, independently reviewable phases. Each phase must touch only its approved file set and must not introduce side effects outside its scope.

## 5. Security And Adversarial Assurance Model

PNPD-OS security and adversarial assurance is modeled as layered future evidence:

1. **Schema and fixture validation** — structural governance (already canonical)
2. **Bug Forecast Evidence** — mutation survivor findings, property test gaps, design drift, test oracle weakness, failure-mode forecasting
3. **Security Audit Evidence** — threat model, attack surface, security findings, residual risk, AI-generated risk classification
4. **Dependency SBOM Evidence** — dependency inventory, lockfile integrity, hallucinated dependency checks, license and vulnerability visibility
5. **Runtime Verification Evidence** — ephemeral environment results, integration test evidence, contract test evidence, performance baseline evidence, environment destruction proof
6. **Future Controlled Unlock layers** — generator scripts, advisory CI, external scanners, network registry checks, ephemeral runtime verification, production incident feedback loop

Evidence supports review, but does not itself authorize deployment, dispatch, merge, certification, production readiness, or external trust claims. Advisory evidence and production decisions must remain separated by governance gates.

## 6. Skeptic Role Roadmap

Skeptic is a future read-only adversarial role. It is not implemented in this phase and remains disabled until a future dedicated phase designs and validates its role.

### Allowed future behavior

* identify risks
* produce bug forecast reports
* compare design intent against implementation evidence
* flag weak tests
* flag hallucinated dependencies
* flag insecure defaults
* surface evidence gaps

### Forbidden behavior

* writing code
* writing fixes
* approving
* merging
* deploying
* dispatching
* certifying
* mutating artifacts
* granting authority
* bypassing Owner

Skeptic is an advisory participant, not an authorizer. Its outputs are evidence artifacts for human and Codex review, never self-executing decisions.

## 7. Evidence Artifact Roadmap

Four evidence artifact families are planned as future roadmap items. None are implemented in Phase 1Q-A.

### Bug Forecast Evidence

Future purpose:

* mutation survivor findings
* property test gaps
* design drift
* test oracle weakness
* failure-mode forecasting

### Security Audit Evidence

Future purpose:

* threat model
* attack surface
* security findings
* residual risk
* AI-generated risk classification

### Dependency SBOM Evidence

Future purpose:

* dependency inventory
* lockfile integrity
* hallucinated dependency checks
* license and vulnerability visibility

### Runtime Verification Evidence

Future purpose:

* ephemeral environment results
* integration test evidence
* contract test evidence
* performance baseline evidence
* environment destruction proof

These families are defined here for roadmap alignment only. Schemas, fixtures, validators, and generators for each family will be designed and implemented in their respective governed phases.

## 8. Proposed Phase Split

The following governed phases decompose the security-skeptic-runtime-hardening proposal into linear, reviewable steps:

| Phase | Scope |
|-------|-------|
| **1Q-A** | Security and adversarial assurance roadmap, docs-only. |
| **1Q-B** | Skeptic role design, docs-only or schema-only depending on Hermes. |
| **1Q-C** | Bug forecast schema. |
| **1Q-D** | Bug forecast fixtures and validator support. |
| **1Q-E** | Security audit schema. |
| **1Q-F** | Security audit fixtures and validator support. |
| **1Q-G** | Dependency SBOM schema. |
| **1Q-H** | Dependency SBOM fixtures and validator support. |
| **1Q-I** | Runtime verification evidence schema. |
| **1Q-J** | Runtime verification fixtures and validator support. |
| **Later Controlled Unlock phases** | generator scripts, advisory CI, external scanners, network registry checks, ephemeral runtime verification, production incident feedback loop. |

Each phase must touch only its approved file set. Cross-phase side effects are prohibited.

## 9. Explicit Non-Goals

The following are explicitly out of scope for Phase 1Q-A:

* no schemas in 1Q-A
* no fixtures
* no validators
* no scripts
* no package scripts
* no package.json
* no package-lock.json
* no CI workflow edits
* no README marketing
* no capability map update
* no external scanners
* no network calls
* no dependency registry checks
* no runtime verification
* no ephemeral environment
* no evidence generation
* no Skeptic executable agent
* no AgentBridge authority
* no GitHub/API mutation
* no dispatch
* no deployment
* no certification

## 10. Controlled Unlock Relationship

Future security assurance capabilities described in this roadmap are Controlled Unlock candidates.

They require:

* explicit phase design
* Owner approval
* scoped implementation
* Codex audit
* GitHub App verification
* canonical baseline update

They are not blocked forever, but they are not implemented in Phase 1Q-A. Each layer must be separately designed, approved, implemented, audited, and baselined before the next layer opens.

## 11. Runtime And CI Boundary

Phases 1Q-A through 1Q-J remain local-only, read-only, and non-mutating unless a later governed phase explicitly changes that.

CI scanner wiring, external scanner adapters, network checks, and ephemeral runtime verification must wait for later Controlled Unlock phases. Early activation of runtime or network checks would violate the phase boundary and introduce ungoverned side effects.

## 12. Risks

The following risks are identified and must be monitored across all security and adversarial assurance phases:

* **Roadmap misread as approval to implement scanners** — teams may interpret the roadmap as authorization to begin wiring external tools. Phases are governed; no implementation occurs without explicit Owner approval.
* **False-positive fatigue** — automated scanners produce noise. Without triage discipline, findings may overwhelm human reviewers.
* **Human review bottleneck** — evidence artifacts require human or Codex review. Volume must stay proportional to review capacity.
* **Evidence treated as certification** — advisory evidence must not be conflated with production readiness or external compliance claims.
* **Skeptic authority overreach** — Skeptic outputs are advisory, not authorizing. Governance must prevent role creep.
* **Costly runtime checks too early** — ephemeral environments and runtime verification carry compute and time costs. Activation must be governed.
* **Dependency scans misunderstood as live guarantees** — SBOM and vulnerability scans are point-in-time snapshots, not continuous guarantees.
* **Production incident feedback loop deferred too long** — delaying runtime and production feedback beyond the governed phases may leave gaps unobserved.
* **AI agents reviewing AI agents remain fallible** — both generators and reviewers (Skeptic, Codex) are AI systems. Errors can compound.

## 13. Current Status

Phase 1Q-A is roadmap-only. No executable security assurance capability exists yet.

The next implementation should not exceed one docs file. All subsequent phases must be individually designed, approved, and implemented under their own governed scope.

## 14. Next Recommended Phase

**Phase 1Q-B: Skeptic Role Design**

Phase 1Q-B must be Hermes-designed first and must not be implemented directly. It should define:

* Skeptic role contract
* read-only boundary enforcement
* output artifact format
* relationship to Codex and Owner
* forbidden operations
* phase activation criteria

1Q-B inherits this roadmap as its baseline and must not introduce schemas, scripts, or tooling without explicit Owner approval.
