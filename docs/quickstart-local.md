# PNPD OS Local Quickstart

## Purpose

This guide shows how to verify PNPD OS locally with read-only validation and dry-run commands.

These commands validate schemas, fixtures, and dry-run output. They do not dispatch agents, mutate GitHub/API state, deploy, or certify production readiness.

## Prerequisites

- Git
- Node.js 20 or newer
- No npm dependencies are required
- No secrets are required

Because this repo currently has no dependencies, you do not need to run `npm install` for local verification.

## Clone

```bash
git clone <repo-url>
cd pnpd-os
```

Replace `<repo-url>` with the repository URL you use for PNPD OS.

## Verify schemas and fixtures

```bash
npm run validate
```

This runs the schema validator across the current supported validation modes, including dispatch-readiness fixture validation.

Expected high-level result: the command exits successfully and reports passing validation.

## Run local dry-run

```bash
npm run dry-run
```

This runs the PNPD dry-run in text mode and JSON mode, then parses the JSON output.

Expected high-level result: the command exits successfully and reports that dispatch remains disabled.

## Run full local verification

```bash
npm test
```

This runs:

```bash
npm run validate
npm run dry-run
```

Use this as the quickest local confidence check before proposing a change.

## Direct Node fallback

If npm scripts are unavailable, run the underlying Node commands directly:

```bash
node scripts/pnpd-validate-schemas.mjs
node scripts/pnpd-validate-schemas.mjs --phase 0
node scripts/pnpd-validate-schemas.mjs --phase 1b
node scripts/pnpd-validate-schemas.mjs --phase 1c
node scripts/pnpd-validate-schemas.mjs --phase 1f
node scripts/pnpd-orchestrator-dry-run.mjs
node scripts/pnpd-orchestrator-dry-run.mjs --json
```

## Safety boundaries

* Default dry-run writes nothing.
* Package scripts do not write `.pnpd/ledger/`, `.pnpd/handoffs/`, or `.pnpd/locks/`.
* Dispatch is blocked and not implemented.
* Runtime readiness reports are not implemented.
* No secrets are required.
* No GitHub/API mutation occurs.
* No deployment occurs.
* No daemon or watcher is started.
* These commands do not certify production readiness.

## Troubleshooting

Check your Node version:

```bash
node --version
```

Use Node.js 20 or newer.

If local state directories exist from explicit writer or lock tests, remove them before verification:

```bash
rm -rf .pnpd/ledger .pnpd/handoffs .pnpd/locks
```

If an npm script fails, run the direct Node fallback commands above to identify which validation or dry-run step failed.

Before committing, check the working tree:

```bash
git status --short --branch
```

The local state directories are ignored by `.gitignore` and should not be committed.

## Scope / What is not implemented

This quickstart is for local verification only.

It does not enable:

* dispatch runtime
* agent execution
* runtime readiness report generation
* GitHub/API mutation
* deployment
* daemon or watcher behavior
* CI

CI is deferred to a later governed phase.
