# PNPD Current Capability Map

## Current stable state

| Field | Value |
|-------|-------|
| **Phase** | Phase 1J |
| **Latest stable commit** | `f7eb3c1` |
| **Branch** | `main` |
| **Node version** | `20` |
| **Remote CI run** | `27508672848` |
| **Remote CI conclusion** | `success` |
| **Remote CI duration** | `16s` |
| **Remote CI commit** | `f7eb3c1b0370ee225b132d2f7c0816dceb936eaa` |

## Existing capabilities

| Capability | Status | Verification command |
|------------|--------|----------------------|
| Schema validation (Phase 0) | ✅ Complete | `npm run validate` |
| Dry-run orchestrator | ✅ Complete | `npm run dry-run` |
| Phase 1C fixture instance validation | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1c` |
| Dispatch readiness schema | ✅ Complete | `.pnpd/dispatch-readiness.schema.json` |
| Dispatch readiness validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1f` |
| Dispatch readiness fixtures (9 invalid, 3 valid) | ✅ Complete | Validated by `--phase 1f` |
| Runtime readiness schema | ✅ Complete | `.pnpd/runtime-readiness.schema.json` |
| Runtime readiness fixtures (10 invalid, 3 valid) | ✅ Complete | Validated by `--phase 1h` |
| Runtime readiness validator | ✅ Complete | `node scripts/pnpd-validate-schemas.mjs --phase 1h` |
| Runtime readiness stdout report | ✅ Complete | `node scripts/pnpd-orchestrator-dry-run.mjs --runtime-readiness` |
| Runtime readiness local write | ✅ Complete | `node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness` |
| Runtime readiness report file validation | ✅ Complete / local read-only validation | `node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report <path>` |
| Runtime readiness CI validation | ✅ Complete | `.github/workflows/pnpd-ci.yml` (Phase 1H-H) |
| Scheduler scaffold | ✅ Complete | Present in orchestrator (Phase 0 scaffold) |
| Ledger local writer | ✅ Complete | `--write-ledger` flag |
| Handoff local writer | ✅ Complete | `--write-handoff` flag |
| Lockfile support | ✅ Complete | Lockfile validation in orchestrator |
| Quickstart local verification | ✅ Complete | `npm run validate`, `npm run dry-run`, `npm test` |

**Note:** Runtime readiness report file validation (Phase 1J) uses filename-prefix validation only; it does not recompute the full report content hash yet.

## Blocked capabilities

The following capabilities are **explicitly blocked** and not implemented:

| Blocked capability | Status |
|--------------------|--------|
| dispatch execution | Blocked — no runtime dispatch |
| GitHub/API mutation | Blocked — no GitHub API calls |
| deployment | Blocked — no deploy behavior |
| Daemon/watcher | Blocked — no persistent process |
| Installer | Blocked — no installation package |
| Packaging | Blocked — no release packaging |
| production-readiness certification | Blocked — no production certification |
| Authority escalation | Blocked — AgentBridge cannot escalate |
| AgentBridge approval authority | Blocked — AgentBridge coordinates only |
| Owner/Codex bypass | Blocked — no gate bypass possible |

## Verification commands

Copy-paste commands to verify current state locally:

```bash
# Full validation (phases 0, 1b, 1c, 1f)
npm run validate

# Dry-run orchestrator
npm run dry-run

# Full test (validate + dry-run)
npm test

# Phase 1H runtime readiness validator
node scripts/pnpd-validate-schemas.mjs --phase 1h

# Runtime readiness stdout report (no files written)
node scripts/pnpd-orchestrator-dry-run.mjs --runtime-readiness

# Runtime readiness local write (one gitignored file written)
node scripts/pnpd-orchestrator-dry-run.mjs --write-runtime-readiness

# Runtime readiness report file validation (read-only)
# First generate a report with --write-runtime-readiness, then:
# REPORT="$(find .pnpd/runtime-readiness -maxdepth 2 -type f -name '*.json' | head -n 1)"
# node scripts/pnpd-validate-schemas.mjs --runtime-readiness-report "$REPORT"
```

## Governance boundaries

- **Owner remains final authority.** All gates require owner decision for merge and release.
- **Codex audit is required before merge.** Formal audit with full evidence must precede any merge.
- **AgentBridge coordinates only.** It does not approve, merge, deploy, certify, dispatch, or bypass gates.
- **Dispatch remains blocked.** The orchestrator dry-run classifies and recommends; it does not execute.
- **Runtime readiness reports are advisory-only.** They provide evidence for review; they do not authorize any action.

## Remote CI evidence

All remote CI runs on `main` branch, all concluded `success`:

| Phase | Run ID | Commit | Duration |
|-------|--------|--------|----------|
| 1G-D | `27469237440` | `07b99261c430511baaf045780748b6929c9e4f8b` | — |
| 1H-A | `27470339994` | `8bfe1cb23951605c9fc469865982797569494904` | — |
| 1H-B | `27491242272` | `165d02651da46ef928b1a70617793e881ddef661` | — |
| 1H-C | `27492801181` | `65fcf98c095c4fa9cd2fd7846be58359ef3ec8f4` | — |
| 1H-D | `27498248995` | `6805e39f2055a593bcbbfe075164403c527323eb` | — |
| 1H-E | `27499358254` | `e834ede24ee97d1220212f22bb53bbdcd815a5a6` | — |
| 1H-F | `27500805917` | `cc19251a766aea617e0c594f8c86f2207a59fce8` | — |
| 1H-G | `27502151932` | `91d4ddd854fc0a8101e20fca0b4a2d002b2ffc56` | 19s |
| 1H-H | `27503401073` | `e37b6867aabb138715ae6b52828165a128916ff9` | 19s |
| 1J | `27508672848` | `f7eb3c1b0370ee225b132d2f7c0816dceb936eaa` | 16s |
