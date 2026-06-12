# PNPD Orchestrator Loop — Phase 1C-2 Ledger and Handoff Schema Design

## Document Metadata

| Field | Value |
|-------|-------|
| **Status** | `DEEPSEEK_PHASE_1C_2_SCHEMA_DESIGN_DOC_COMMITTED_AMBER_NOT_CODEX_AUDITED` |
| **Source** | Hermes Phase 1C-2 design/scoping output, captured by DeepSeek |
| **Scope** | Docs-only schema design capture |
| **Date** | 2026-06-12 |
| **Branch** | `deepseek/phase1c-2-schema-design` |
| **Baseline** | `0dcda1b` — `merge: Phase 1C PNPD ledger handoff design into main` |
| **Parent Design** | `docs/pnpd/orchestrator-phase-1c-ledger-handoff-design.md` |

---

## 1. Baseline

Current confirmed state:

- `main` aligned with `origin/main`
- Baseline commit: `0dcda1b`
- Phase 0: complete, merged, pushed
- Phase 1 design doc: complete, Codex-audited, merged, pushed
- Phase 1B schema proposal: complete, Codex-audited, merged, pushed
- Phase 1C ledger/handoff design doc: complete, Codex-audited, merged, pushed
- Validator passes: default, `--phase 0`, `--phase 1b`
- Dry-run CLI: text and JSON output functional
- Dispatch: disabled (`const: false` in all schemas)
- Runtime ledger writer: **not implemented**
- Runtime handoff writer: **not implemented**
- `scripts/pnpd-orchestrator-dry-run.mjs`: unchanged since Phase 0
- `.pnpd/repos.example.json`: Phase 0-compatible

---

## 2. Phase 1C-2 Scope

Phase 1C-2 defines the **ledger record and handoff record schemas** as future `$defs` within the PNPD orchestrator output schema. It is a schema design only — no implementation, no validator changes, no fixtures.

Core characteristics:

- **Schema design only.** JSON Schema definitions for ledger entries and handoff records.
- **Docs-only capture.** No schema files are edited in this branch.
- **Future `$defs`.** Definitions designed for `.pnpd/orchestrator.schema.json` but not added yet.
- **Shared definitions.** Common types extracted to shared `$defs` to avoid duplication.
- **No runtime writes.** Ledger and handoff records are schemas, not runtime output.
- **No validator changes.** `--phase 1c` is designed but not implemented.
- **No fixtures.** Fixture strategy is described but not created.
- **No authority changes.** All authority flags remain `const: false`.

---

## 3. Non-Goals

Phase 1C-2 explicitly does **not** include:

| Non-goal | Why |
|----------|-----|
| Ledger writer implementation | Separate future phase (1C-4) |
| Handoff writer implementation | Separate future phase (1C-5) |
| Runtime writes of any kind | Requires explicit CLI flags, not designed here |
| Scheduler implementation | Deferred to Phase 1E |
| Daemon / watcher | Never; PNPD-OS is a framework, not a runtime |
| Autonomous dispatch | Dispatch remains `const: false` |
| GitHub / API mutation | No remote access path exists |
| Merge / push / deploy | No deployment path exists |
| MCP / A2A runtime | AgentBridge is state, not transport |
| Secrets / `.env` parsing | Secrets policy is `deny-all` |
| Lockfile runtime | Separate Phase 1D |
| Cross-repo mutation | Local writes only, single repo per record |
| Hidden approval path | All authority flags `const: false` |
| Schema file edits in this branch | Docs-only capture |
| Validator `--phase 1c` in this branch | Docs-only capture |
| Fixture files in this branch | Docs-only capture |

---

## 4. Existing Schema Baseline

The current `.pnpd/orchestrator.schema.json` defines:

### Top-level output

| Field | Type | Constraint |
|-------|------|------------|
| `mode` | string | `const: "dry-run"` |
| `generatedAt` | string | `format: "date-time"` |
| `registryPath` | string | — |
| `dispatchEnabled` | boolean | `const: false` |
| `runId` | string | Phase 1B, optional |
| `schedulerStatus` | string | Phase 1B, enum: `disabled`/`pending`/`running`/`error` |
| `lockStatus` | string | Phase 1B, enum: `unlocked`/`locked`/`unknown` |
| `repos` | array | Array of `repoResult` |

### Per-repo output (`repoResult`)

| Field | Type | Constraint |
|-------|------|------------|
| `id`, `name`, `path`, `enabled` | required | — |
| `branch`, `dirty` | string\|null / boolean\|null | — |
| `classification` | string | 14-state enum |
| `dispatchAllowed` | boolean | `const: false` |
| `gates` | array | `name`, `status`, `reason` |
| `nextAction` | string | — |
| `handoffPreview` | object | `additionalProperties: true` |
| `lockStatus` | string | Phase 1B, enum |
| `ledgerStatus` | string | Phase 1B, enum: `ok`/`missing`/`stale`/`blocked`/`unknown` |
| `handoffStatus` | string | Phase 1B, enum: `ok`/`missing`/`stale`/`blocked`/`unknown` |
| `authorityFlags` | object | Phase 1B, 5 flags all `const: false` |
| `blockedReasons` | array | Phase 1B |
| `riskAssessment` | object | Phase 1B, `level` + `factors` |
| `requiredReviewer` | string | Phase 1B |

### Validation modes

| Mode | What it validates |
|------|-------------------|
| Default | Phase 0 + Phase 1B invariants |
| `--phase 0` | Phase 0 invariants only |
| `--phase 1b` | Phase 0 + Phase 1B invariants |

### Constraints Phase 1C-2 must preserve

- `dispatchEnabled`: `const: false`
- `dispatchAllowed`: `const: false` (per repo)
- All 5 authority flags: `const: false`
- `mode`: `const: "dry-run"`
- `additionalProperties: false` on all objects
- No deploy, GitHub-write, or production fields
- No `APPROVED_FOR_MERGE` in registry input
- Phase 0 dry-run text and JSON output compatibility
- All existing validator assertions

---

## 5. Proposed Ledger Record Schema

### Design: `$defs.ledgerRecord`

The ledger record is a structured, machine-readable, append-only log entry capturing one orchestrator inspection of one repo during one run. It records **what was observed and when** — never what was decided or dispatched.

### Full schema design

```json
{
  "$defs": {
    "ledgerRecord": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "schemaVersion",
        "recordType",
        "runId",
        "createdAt",
        "source",
        "generatorVersion",
        "repo",
        "git",
        "classification",
        "gates",
        "authorityFlags",
        "integrity"
      ],
      "properties": {
        "schemaVersion": {
          "type": "integer",
          "const": 1
        },
        "recordType": {
          "type": "string",
          "const": "ledger"
        },
        "runId": {
          "type": "string",
          "pattern": "^[a-z0-9][a-z0-9._-]{0,63}$",
          "description": "Unique identifier for this orchestrator run."
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "source": {
          "type": "string",
          "const": "pnpd-orchestrator",
          "description": "Generator identity."
        },
        "generatorVersion": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+(-[a-z0-9.]+)?$",
          "description": "Semver of the orchestrator that produced this record."
        },
        "repo": {
          "$ref": "#/$defs/ledgerRepo"
        },
        "git": {
          "$ref": "#/$defs/ledgerGit"
        },
        "classification": {
          "$ref": "#/$defs/classificationEnum"
        },
        "gates": {
          "type": "array",
          "items": { "$ref": "#/$defs/gateResult" }
        },
        "blockedReasons": {
          "type": "array",
          "items": { "$ref": "#/$defs/blockedReason" }
        },
        "recommendedAction": {
          "type": "string",
          "maxLength": 500,
          "description": "Advisory next action. Not a command or dispatch."
        },
        "requiredReviewer": {
          "$ref": "#/$defs/reviewerEnum"
        },
        "codexAuditRequired": {
          "type": "boolean",
          "description": "Whether this record's classification implies a Codex audit gate."
        },
        "ownerActionRequired": {
          "type": "boolean",
          "description": "Whether this record implies owner must take action."
        },
        "riskAssessment": {
          "$ref": "#/$defs/riskAssessment"
        },
        "authorityFlags": {
          "$ref": "#/$defs/authorityFlags"
        },
        "redactions": {
          "$ref": "#/$defs/redactionSummary"
        },
        "integrity": {
          "$ref": "#/$defs/integrityBlock"
        }
      }
    }
  }
}
```

### Hard constraints

| Constraint | Enforcement |
|------------|-------------|
| `recordType` | `const: "ledger"` |
| `schemaVersion` | `const: 1` |
| `source` | `const: "pnpd-orchestrator"` |
| `additionalProperties` | `false` |
| Authority flags | All 5 `const: false` |
| No secret-bearing fields | Validator rejects `SECRET_VALUE_PATTERN` |
| No deploy fields | Validator rejects `deploy`, `deployment` keys |
| No GitHub write fields | Validator rejects `gitPush`, `gitRemote`, `remoteUrl` |
| No dispatch fields beyond authority flags | Authority flags are dispatch gate, not dispatch trigger |
| Strings bounded | `maxLength` on free-text fields |
| Enums explicit | Classifications, reviewers, risk levels all enumerated |

---

## 6. Proposed Handoff Record Schema

### Design: `$defs.handoffRecord`

The handoff record extends the ledger record with **routing metadata**. It is a structured, actionable summary of what a human or agent needs to know to take the next step. It is **advisory only** — it never approves, dispatches, or claims readiness.

### Full schema design

```json
{
  "$defs": {
    "handoffRecord": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "schemaVersion",
        "recordType",
        "runId",
        "createdAt",
        "source",
        "generatorVersion",
        "repo",
        "git",
        "classification",
        "gates",
        "authorityFlags",
        "integrity",
        "handoff"
      ],
      "properties": {
        "schemaVersion": {
          "type": "integer",
          "const": 1
        },
        "recordType": {
          "type": "string",
          "const": "handoff"
        },
        "runId": {
          "type": "string",
          "pattern": "^[a-z0-9][a-z0-9._-]{0,63}$"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "source": {
          "type": "string",
          "const": "pnpd-orchestrator"
        },
        "generatorVersion": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+(-[a-z0-9.]+)?$"
        },
        "repo": {
          "$ref": "#/$defs/ledgerRepo"
        },
        "git": {
          "$ref": "#/$defs/ledgerGit"
        },
        "classification": {
          "$ref": "#/$defs/classificationEnum"
        },
        "gates": {
          "type": "array",
          "items": { "$ref": "#/$defs/gateResult" }
        },
        "blockedReasons": {
          "type": "array",
          "items": { "$ref": "#/$defs/blockedReason" }
        },
        "recommendedAction": {
          "type": "string",
          "maxLength": 500
        },
        "requiredReviewer": {
          "$ref": "#/$defs/reviewerEnum"
        },
        "codexAuditRequired": {
          "type": "boolean"
        },
        "ownerActionRequired": {
          "type": "boolean"
        },
        "riskAssessment": {
          "$ref": "#/$defs/riskAssessment"
        },
        "authorityFlags": {
          "$ref": "#/$defs/authorityFlags"
        },
        "redactions": {
          "$ref": "#/$defs/redactionSummary"
        },
        "integrity": {
          "$ref": "#/$defs/integrityBlock"
        },
        "handoff": {
          "$ref": "#/$defs/handoffRouting"
        }
      }
    }
  }
}
```

### Handoff-specific hard constraints

| Constraint | Enforcement |
|------------|-------------|
| `recordType` | `const: "handoff"` |
| `handoff.format` | `const: "pnpd-handoff-v1"` |
| Routing is advisory-only | Schema allows routing fields but never interprets them as dispatch |
| No approval claim | `authorityFlags.approvalClaimed` is `const: false` |
| No audit claim | `authorityFlags.auditClaimed` is `const: false` |
| No merge readiness claim | `authorityFlags.mergeClaimed` is `const: false` |
| No production readiness claim | `authorityFlags.productionReadinessClaimed` is `const: false` |
| No dispatch trigger | `authorityFlags.dispatchRequested` is `const: false` |
| No remote target IDs | `routing.to` is local agent enum, not URL or API endpoint |
| Bounded text fields | `maxLength: 1000` on summary, `maxLength: 2000` on context |
| `additionalProperties` | `false` |

---

## 7. Shared Definitions

To avoid duplication between `ledgerRecord` and `handoffRecord`, shared types are extracted to named `$defs`.

### `ledgerRepo`

```json
{
  "ledgerRepo": {
    "type": "object",
    "additionalProperties": false,
    "required": ["id", "name", "path", "enabled"],
    "properties": {
      "id": {
        "type": "string",
        "pattern": "^[a-z0-9][a-z0-9._-]{0,63}$"
      },
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 200
      },
      "path": {
        "type": "string",
        "minLength": 1,
        "maxLength": 1000
      },
      "enabled": {
        "type": "boolean"
      },
      "phase": {
        "type": "string",
        "maxLength": 100
      },
      "governanceProfile": {
        "type": "string",
        "enum": ["standard", "high-risk", "read-only"]
      }
    }
  }
}
```

### `ledgerGit`

```json
{
  "ledgerGit": {
    "type": "object",
    "additionalProperties": false,
    "required": ["branch"],
    "properties": {
      "branch": {
        "type": ["string", "null"]
      },
      "dirty": {
        "type": ["boolean", "null"]
      },
      "commitHash": {
        "type": ["string", "null"],
        "pattern": "^[a-f0-9]{7,40}$|^$",
        "description": "Short or full commit hash, or null if unavailable."
      },
      "detachedHead": {
        "type": "boolean",
        "description": "True if HEAD is detached."
      }
    }
  }
}
```

### `gateResult`

```json
{
  "gateResult": {
    "type": "object",
    "additionalProperties": false,
    "required": ["name", "status", "reason"],
    "properties": {
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 100
      },
      "status": {
        "type": "string",
        "enum": ["pass", "fail", "blocked", "not-run"]
      },
      "reason": {
        "type": "string",
        "maxLength": 500
      }
    }
  }
}
```

### `blockedReason`

```json
{
  "blockedReason": {
    "type": "string",
    "minLength": 1,
    "maxLength": 500
  }
}
```

### `riskAssessment`

```json
{
  "riskAssessment": {
    "type": "object",
    "additionalProperties": false,
    "required": ["level"],
    "properties": {
      "level": {
        "type": "string",
        "enum": ["low", "medium", "high", "unknown"]
      },
      "factors": {
        "type": "array",
        "items": { "type": "string", "maxLength": 200 },
        "maxItems": 20
      }
    }
  }
}
```

### `authorityFlags` (shared)

```json
{
  "authorityFlags": {
    "type": "object",
    "additionalProperties": false,
    "required": [
      "approvalClaimed",
      "mergeClaimed",
      "dispatchRequested",
      "auditClaimed",
      "productionReadinessClaimed"
    ],
    "properties": {
      "approvalClaimed": {
        "type": "boolean",
        "const": false,
        "description": "The orchestrator never claims approval authority."
      },
      "mergeClaimed": {
        "type": "boolean",
        "const": false,
        "description": "The orchestrator never claims merge readiness."
      },
      "dispatchRequested": {
        "type": "boolean",
        "const": false,
        "description": "The orchestrator never requests dispatch."
      },
      "auditClaimed": {
        "type": "boolean",
        "const": false,
        "description": "The orchestrator never claims audit completion."
      },
      "productionReadinessClaimed": {
        "type": "boolean",
        "const": false,
        "description": "The orchestrator never claims production readiness."
      }
    }
  }
}
```

### `redactionSummary`

```json
{
  "redactionSummary": {
    "type": "object",
    "additionalProperties": false,
    "required": ["count"],
    "properties": {
      "count": {
        "type": "integer",
        "minimum": 0
      },
      "paths": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 200
        },
        "maxItems": 50,
        "description": "JSONPath-like references to redacted fields. Values are never stored."
      },
      "kinds": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["secret-value", "token-lookalike", "env-path", "forbidden-path", "pii-lookalike"],
          "maxLength": 50
        },
        "maxItems": 10,
        "description": "Optional. Broad categories of what was redacted. Never the values."
      }
    }
  }
}
```

### `integrityBlock`

```json
{
  "integrityBlock": {
    "type": "object",
    "additionalProperties": false,
    "required": ["contentHash", "canonicalization"],
    "properties": {
      "contentHash": {
        "type": "string",
        "pattern": "^sha256:[a-f0-9]{64}$",
        "description": "SHA-256 hash of the canonicalized record (excluding this integrity block)."
      },
      "previousLedgerHash": {
        "type": ["string", "null"],
        "pattern": "^(sha256:[a-f0-9]{64})?$",
        "description": "Hash of the previous ledger record in the same file, or null for the first record."
      },
      "canonicalization": {
        "type": "string",
        "const": "sorted-json-keys",
        "description": "Algorithm used to produce a stable serialization for hashing."
      },
      "schemaHash": {
        "type": "string",
        "pattern": "^sha256:[a-f0-9]{64}$",
        "description": "Optional. Hash of the schema version used. Deferred to future phase."
      }
    }
  }
}
```

### `reviewerEnum`

```json
{
  "reviewerEnum": {
    "type": "string",
    "enum": ["none", "owner", "codex", "hermes", "deepseek"]
  }
}
```

### `classificationEnum`

```json
{
  "classificationEnum": {
    "type": "string",
    "enum": [
      "DISCOVERED",
      "NEEDS_TRIAGE",
      "NEEDS_INFO",
      "READY_FOR_AGENT",
      "DISPATCHED",
      "IN_PROGRESS",
      "AGENT_DONE",
      "AUTOREVIEW_REQUIRED",
      "CODEX_REVIEW_REQUIRED",
      "OWNER_REVIEW_REQUIRED",
      "APPROVED_FOR_MERGE",
      "DONE",
      "BLOCKED",
      "WONTFIX"
    ]
  }
}
```

### `handoffRouting`

```json
{
  "handoffRouting": {
    "type": "object",
    "additionalProperties": false,
    "required": ["format", "routing"],
    "properties": {
      "format": {
        "type": "string",
        "const": "pnpd-handoff-v1"
      },
      "summary": {
        "type": "string",
        "maxLength": 1000,
        "description": "Human-readable summary of the current state and recommendation."
      },
      "context": {
        "type": "string",
        "maxLength": 2000,
        "description": "Additional context not captured in structured fields."
      },
      "routing": {
        "type": "object",
        "additionalProperties": false,
        "required": ["to"],
        "properties": {
          "to": {
            "type": "string",
            "enum": ["owner", "hermes", "deepseek", "codex", "none"],
            "description": "Advisory routing target. Never a URL, email, or API endpoint."
          },
          "action": {
            "type": "string",
            "maxLength": 200,
            "description": "Suggested action for the recipient. Advisory only."
          },
          "urgency": {
            "type": "string",
            "enum": ["low", "normal", "high", "blocked"],
            "default": "normal"
          }
        }
      }
    }
  }
}
```

### Shared definitions constraints summary

| Definition | Key constraint |
|------------|---------------|
| `ledgerRepo` | `additionalProperties: false`, `path` max 1000 chars |
| `ledgerGit` | `additionalProperties: false`, commit hash pattern `^[a-f0-9]{7,40}$` |
| `gateResult` | `additionalProperties: false`, status enum 4 values |
| `blockedReason` | Max 500 chars |
| `riskAssessment` | `additionalProperties: false`, factors max 20 items |
| `authorityFlags` | `additionalProperties: false`, all 5 flags `const: false` |
| `redactionSummary` | `additionalProperties: false`, paths only, never values |
| `integrityBlock` | `additionalProperties: false`, hash pattern `sha256:<64 hex>` |
| `reviewerEnum` | Enum: `none`/`owner`/`codex`/`hermes`/`deepseek` |
| `classificationEnum` | 14-state enum matching existing classification set |
| `handoffRouting` | `additionalProperties: false`, `to` enum 5 values, no URLs |

---

## 8. Authority Flags

All five authority flags are `const: false` in every context — ledger record, handoff record, and output schema.

| Flag | Value | Meaning |
|------|-------|---------|
| `approvalClaimed` | `false` | The orchestrator does not approve anything. |
| `mergeClaimed` | `false` | The orchestrator does not claim merge readiness. |
| `dispatchRequested` | `false` | The orchestrator does not request dispatch. |
| `auditClaimed` | `false` | The orchestrator does not claim audit completion. |
| `productionReadinessClaimed` | `false` | The orchestrator does not claim production readiness. |

### Why these must remain `const: false`

- **Ledger cannot approve.** A chronological log entry records observations; it has no authority to decide.
- **Handoff cannot audit.** A routing summary suggests next steps; it does not certify correctness.
- **Routing cannot dispatch.** A `routing.to` field names a recipient; it does not trigger an agent.
- **Record cannot claim merge/deploy readiness.** Only the owner (or Codex with owner authorization) may claim readiness.

### Future relaxations

If and only if a future approved phase explicitly authorizes it, an authority flag may be relaxed from `const: false` to a runtime-determined boolean. Any such relaxation must:

1. Be in its own phase with its own threat model.
2. Be owner-approved before implementation.
3. Be Codex-audited before merge.
4. Never relax more than one flag at a time.
5. Never relax without a corresponding gate in the orchestrator loop.

---

## 9. Redaction Schema

### Design principles

- **Paths only.** Redaction records which JSON paths were affected, never the redacted values.
- **Categories, not values.** `kinds` is an optional broad categorization (`secret-value`, `token-lookalike`, `env-path`, `forbidden-path`, `pii-lookalike`).
- **Conservative detection.** Token-looking policy text (e.g., regex literals, documentation examples) should not trigger false-positive redactions, but when in doubt, redact.
- **No `.env` content.** `.env` file paths and content are never ingested.
- **No credential values.** `SECRET_VALUE_PATTERN` matches are rejected at validation time; the record is not written.

### Redaction rules

| What | Rule |
|------|------|
| API key patterns (`sk-...`, `ghp_...`, `xox*`) | Reject record; do not write |
| Private key blocks (`-----BEGIN ... PRIVATE KEY-----`) | Reject record; do not write |
| `.env` file paths | Reject record; do not write |
| Forbidden legacy BricLab path | Reject record; do not write |
| Token-looking policy text | Allow with path redacted if ambiguous |
| User-provided free text | Minimized to maxLength; redacted if pattern matches |

---

## 10. Integrity Schema

### Design principles

- **Node stdlib crypto only.** Future implementation uses `node:crypto` — no external dependencies.
- **Hash pattern.** `sha256:<64 lowercase hex characters>`.
- **Previous ledger hash.** Nullable; `null` for the first record in a ledger file.
- **No signatures.** No key management, no PKI, no trust-on-first-use.
- **No Merkle tree.** Simple linear chain: each record optionally points to the previous record's hash.
- **No blockchain.** No distributed consensus, no proof-of-work, no timestamp authority.
- **No timestamp authority.** `createdAt` is the orchestrator's clock; integrity is about content, not time.

### Canonicalization

`canonicalization` is `const: "sorted-json-keys"`. This means:

1. Serialize the record as JSON.
2. Sort all object keys lexicographically.
3. Remove the `integrity` block (to avoid self-reference).
4. Produce a stable, minified JSON string.
5. SHA-256 hash that string.

### Future additions

`integrity.schemaHash` is deferred. If added later, it would be the SHA-256 of the relevant schema `$defs` block, enabling schema-version-aware validation.

---

## 11. Handoff Routing Schema

### Routing is advisory-only

The `handoff.routing` block suggests who should look at the handoff next and what they might do. It is **not** a dispatch instruction, not an RPC call, not a message queue, and not an event trigger.

### Allowed `routing.to` values

| Value | Meaning |
|-------|---------|
| `owner` | Owner should review and decide. |
| `hermes` | Hermes should verify state and route further. |
| `deepseek` | DeepSeek should implement if owner approves. |
| `codex` | Codex should perform formal audit. |
| `none` | No routing recommendation. |

### Allowed urgency values

| Value | Meaning |
|-------|---------|
| `low` | No time pressure. |
| `normal` | Standard priority. |
| `high` | Attention needed soon. |
| `blocked` | Work cannot proceed until this is resolved. |

### Rules

- **No email.** `routing.to` is a local agent enum, not an email address.
- **No URL.** No remote target, API endpoint, or webhook.
- **No GitHub issue ID.** No cross-system reference required.
- **No API target.** No MCP, A2A, or REST endpoint.
- **No dispatch target.** The orchestrator does not dispatch based on routing.
- **No autonomous action.** Routing is a suggestion to a human or human-initiated agent.
- **No claim that recipient must act automatically.** The recipient (owner, Hermes, etc.) decides whether and how to act.

---

## 12. Validation Invariants

When Phase 1C-2 schemas are eventually implemented, the following invariants must hold:

### Phase 0 invariants (must still pass)

- `dispatchEnabled === false`
- `maxParallelThreads === 0`
- `mode === "dry-run"`
- All 14 classification states present in enum
- No `APPROVED_FOR_MERGE` in registry input
- No secret-like values in registry
- Dry-run text output unchanged
- Dry-run JSON output parseable

### Phase 1B invariants (must still pass)

- `authority.dispatchAllowed === false` (when present in registry)
- `authority.externalWritesAllowed === false` (when present in registry)
- `scheduler.enabled === false` (when present in registry)
- `secrets.policy === "deny-all"` (when present in registry)
- `localWrites.allowed === false` (when present in registry)
- All 5 authority flags `const: false` in output schema
- No deploy config patterns
- No GitHub write config patterns
- No `additionalProperties` relaxation
- No `.env` paths
- No forbidden BricLab path

### Phase 1C-2 invariants (future)

- `ledgerRecord.recordType` is `const: "ledger"`
- `handoffRecord.recordType` is `const: "handoff"`
- Both records have `additionalProperties: false`
- Authority flags all `const: false` in both records
- No secret-like values in any record field
- No `.env` paths in any record field
- No forbidden legacy path in any record field
- No path traversal (`../`) in repo paths
- No GitHub write fields in any record
- No deploy fields in any record
- No approval/merge/audit/dispatch claim
- `handoff.routing.to` is advisory enum only
- `handoff.format` is `const: "pnpd-handoff-v1"`
- `integrity.contentHash` matches pattern `sha256:[a-f0-9]{64}`
- Missing required fields fail validation for sample records

---

## 13. Backward Compatibility

| Concern | Resolution |
|---------|------------|
| Current dry-run output | Unchanged. Ledger/handoff records are future `$defs` only; dry-run output does not include them until a future phase adds the fields. |
| Current `.pnpd/repos.example.json` | Remains valid. No Phase 1C-2 fields added. |
| Existing validator modes (`--phase 0`, `--phase 1b`) | Unchanged. New `--phase 1c` mode is additive. |
| Current `$defs` in orchestrator schema | Unchanged. New `$defs` are added alongside existing ones; existing `repoResult` is not modified. |
| Phase 0/1B behavior | No breaking changes. New `$defs` are reference-only until explicitly wired into output. |
| Dry-run CLI | No new flags. `--write-ledger` and `--write-handoff` are designed but not implemented. |

---

## 14. Security Model

Each threat is assessed with its risk, impact, schema-level mitigation, and recommended validator check.

### Threat: Schema allows secret-bearing text

| Attribute | Value |
|-----------|-------|
| **Risk** | High |
| **Impact** | Credential leakage into ledger/handoff files |
| **Mitigation** | All free-text fields bounded by `maxLength`; `SECRET_VALUE_PATTERN` rejects records with credential-like values |
| **Schema constraint** | `maxLength` on `recommendedAction`, `handoff.summary`, `handoff.context`, `blockedReasons`, `riskAssessment.factors` |
| **Validator check** | Scan all string fields for `SECRET_VALUE_PATTERN`; reject record if found |

### Threat: Handoff summary becomes prompt-injection carrier

| Attribute | Value |
|-----------|-------|
| **Risk** | Medium |
| **Impact** | Malicious text in handoff summary could influence agent behavior if ingested into an LLM prompt |
| **Mitigation** | `handoff.summary` bounded to 1000 chars; `handoff.context` bounded to 2000 chars; routing is advisory-only; recipient decides whether to act |
| **Schema constraint** | `maxLength: 1000` on summary, `maxLength: 2000` on context |
| **Validator check** | Warn (not block) on summary > 80% of maxLength; recommend sanitization |

### Threat: Routing interpreted as dispatch

| Attribute | Value |
|-----------|-------|
| **Risk** | Critical |
| **Impact** | Autonomous agent dispatch based on routing field |
| **Mitigation** | `dispatchRequested` is `const: false`; `routing.to` is enum, not URL/API; no dispatch code path exists |
| **Schema constraint** | `authorityFlags.dispatchRequested` is `const: false`; `routing.to` enum: `owner`/`hermes`/`deepseek`/`codex`/`none` |
| **Validator check** | Assert `dispatchRequested === false`; assert `routing.to` is valid enum |

### Threat: Authority flags omitted

| Attribute | Value |
|-----------|-------|
| **Risk** | High |
| **Impact** | Record accepted without explicit denial of authority |
| **Mitigation** | `authorityFlags` is `required` in both `ledgerRecord` and `handoffRecord`; all 5 flags are `const: false` |
| **Schema constraint** | `required: ["authorityFlags"]`; each flag individually `const: false` |
| **Validator check** | Assert all 5 flags present and `false` |

### Threat: Extra unknown fields bypass constraints

| Attribute | Value |
|-----------|-------|
| **Risk** | Medium |
| **Impact** | Attacker adds `"approvalClaimed": true` in an unknown field or extra property |
| **Mitigation** | `additionalProperties: false` on every object in every record |
| **Schema constraint** | `additionalProperties: false` at every level |
| **Validator check** | Assert no extra properties at any nesting level |

### Threat: Production URL leakage

| Attribute | Value |
|-----------|-------|
| **Risk** | Medium |
| **Impact** | Production URLs or deployment targets exposed in ledger/handoff |
| **Mitigation** | No deploy fields in schema; no `.env` parsing; no remote reads |
| **Schema constraint** | No `deploy`, `deployment`, `productionUrl`, `remoteUrl`, `apiEndpoint` fields |
| **Validator check** | Reject records containing known forbidden field names |

### Threat: Path traversal in repo/redaction paths

| Attribute | Value |
|-----------|-------|
| **Risk** | Medium |
| **Impact** | `../` or symlink escapes could reference files outside the repo |
| **Mitigation** | Path validation: resolve realpath, assert inside repo root, assert inside allowed directory |
| **Schema constraint** | `maxLength: 1000` on paths; pattern restrictions in future |
| **Validator check** | Reject `../` in paths; reject symlink escapes |

### Threat: Forged integrity hash

| Attribute | Value |
|-----------|-------|
| **Risk** | Low |
| **Impact** | Tampered record passes integrity check |
| **Mitigation** | Integrity hash is a tamper-evident marker, not a security guarantee; no signatures, no trust model beyond detection |
| **Schema constraint** | `contentHash` pattern `sha256:[a-f0-9]{64}`; `previousLedgerHash` pattern same or null |
| **Validator check** | Assert hash pattern matches; do not verify content (deferred to runtime) |

### Threat: GitHub/deploy fields hidden in extra properties

| Attribute | Value |
|-----------|-------|
| **Risk** | High |
| **Impact** | Deployment or GitHub write fields smuggled into record |
| **Mitigation** | `additionalProperties: false` prevents unknown fields; validator rejects known forbidden field names |
| **Schema constraint** | `additionalProperties: false` |
| **Validator check** | Assert no `deploy`, `deployment`, `gitPush`, `gitRemote`, `remoteUrl`, `apiEndpoint`, `productionUrl` fields at any nesting level |

---

## 15. Validator Design Proposal

### Future: `--phase 1c` mode

When Phase 1C-2 schemas are implemented, the validator gains a new mode:

```bash
node scripts/pnpd-validate-schemas.mjs --phase 1c
```

This mode would:

1. Run all Phase 0 checks.
2. Run all Phase 1B checks.
3. Validate `$defs.ledgerRecord` shape (required fields, types, `const` values).
4. Validate `$defs.handoffRecord` shape (required fields, types, `const` values).
5. Validate all shared `$defs` (`ledgerRepo`, `ledgerGit`, `gateResult`, `blockedReason`, `riskAssessment`, `authorityFlags`, `redactionSummary`, `integrityBlock`, `reviewerEnum`, `classificationEnum`, `handoffRouting`).
6. Assert `authorityFlags` all `const: false`.
7. Assert no broad `additionalProperties` relaxation.
8. Assert no forbidden fields (`deploy`, `gitPush`, `remoteUrl`, etc.).
9. If fixtures exist, validate sample records against ledger/handoff schemas.
10. Skip record validation gracefully if no fixtures exist.

### Not implemented in this branch

- `--phase 1c` flag does **not** exist yet.
- No validator code is changed in this docs-only capture.
- No schema files are edited in this docs-only capture.
- The validator design is a specification for a future implementation phase (1C-3).

---

## 16. Fixture Strategy

### Design only — not implemented

Future fixtures provide known-good and known-bad sample records for validator testing. They are designed here but not created in this branch.

### Proposed fixture files

| File | Purpose |
|------|---------|
| `tests/fixtures/ledger/valid-entry.json` | Minimal valid ledger record |
| `tests/fixtures/ledger/invalid-authority-flag.json` | Ledger with `approvalClaimed: true` — must fail |
| `tests/fixtures/ledger/invalid-secret.json` | Ledger containing `sk-abc123...` in recommendedAction — must fail |
| `tests/fixtures/ledger/invalid-missing-required.json` | Ledger missing `gates` — must fail |
| `tests/fixtures/ledger/invalid-extra-property.json` | Ledger with unknown field — must fail |
| `tests/fixtures/handoff/valid-handoff.json` | Minimal valid handoff record |
| `tests/fixtures/handoff/invalid-routing-dispatch.json` | Handoff with `dispatchRequested: true` — must fail |
| `tests/fixtures/handoff/invalid-approval-claim.json` | Handoff with `approvalClaimed: true` — must fail |
| `tests/fixtures/handoff/invalid-routing-url.json` | Handoff with `routing.to: "https://..."` — must fail |

### Fixture rules

- **Not created now.** Fixtures require a separate implementation phase (1C-4) with owner approval.
- **Fake data only.** All repo IDs, names, paths, and hashes must be synthetic.
- **No real secrets.** No real tokens, API keys, PII, or sensitive paths.
- **No real repo paths.** Use `/path/to/synthetic-repo` or similar.
- **No production URLs.** Use `https://example.com` or similar if URL-like values are needed for negative tests.
- **Gitignore.** Fixture directory existence does not require `.gitignore` changes unless fixtures grow beyond a handful of files.

---

## 17. Implementation Phasing

Phase 1C-2 is the **schema design capture**. Implementation proceeds in narrow, auditable sub-phases.

| Sub-phase | Description | Likely files touched | Non-goals | Gates | Expected verdict | Codex audit |
|-----------|-------------|---------------------|-----------|-------|------------------|-------------|
| **1C-2A** | Docs-only schema proposal capture (this branch) | `docs/pnpd/orchestrator-phase-1c-2-schema-design.md` | No schema edits, no validator, no fixtures | See §Gates | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-2B** | Schema definitions only | `.pnpd/orchestrator.schema.json` (add `$defs` only) | No runtime, no validator changes, no output wiring | Schema validates; Phase 0/1B invariants pass; `additionalProperties: false` | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-2C** | Validator `--phase 1c` | `scripts/pnpd-validate-schemas.mjs` | No runtime writes, no fixtures | All validator modes pass; Phase 0/1B unchanged | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-2D** | Safe fixtures | `tests/fixtures/ledger/`, `tests/fixtures/handoff/` | No real data, no runtime writes | All fixtures validate; invalid fixtures correctly rejected | `AMBER_NOT_CODEX_AUDITED` | Required |
| **1C-2E** | Final handoff and Codex audit | (no new files) | No changes | Full gate suite; all phases compatible | `CODEX_AUDITED_READY_FOR_OWNER` | By Codex |

---

## 18. Future Codex Audit Checklist

When Phase 1C-2B through 1C-2E are implemented, Codex must verify:

### Schema scope

- [ ] Schema definitions only — no runtime behavior
- [ ] `additionalProperties: false` on every object in every definition
- [ ] `$defs` shared correctly via `$ref` — no copy-paste duplication
- [ ] All `const` values match this design doc

### Authority

- [ ] `authorityFlags`: all 5 flags `const: false`
- [ ] `dispatchEnabled`: `const: false` (unchanged from Phase 0)
- [ ] `dispatchAllowed`: `const: false` (unchanged from Phase 0)
- [ ] No field grants approval, merge, deploy, dispatch, audit, or production authority

### Routing

- [ ] `routing.to` enum: `owner`/`hermes`/`deepseek`/`codex`/`none`
- [ ] No URL, email, API endpoint, or dispatch target in routing
- [ ] `handoff.format` is `const: "pnpd-handoff-v1"`

### Security

- [ ] No secret-bearing fields in any definition
- [ ] No deploy/GitHub-write fields in any definition
- [ ] `maxLength` on all free-text string fields
- [ ] `redactionSummary.paths` — paths only, never values
- [ ] `integrity.contentHash` pattern `sha256:[a-f0-9]{64}`

### Compatibility

- [ ] Phase 0 dry-run text output unchanged
- [ ] Phase 0 dry-run JSON output unchanged and parseable
- [ ] Phase 1B validation still passes
- [ ] `.pnpd/repos.example.json` still valid
- [ ] `validator --phase 0` still passes
- [ ] `validator --phase 1b` still passes

### Docs

- [ ] Docs match schema implementation exactly
- [ ] No stale claims (e.g., "Phase 0 pending")
- [ ] Verdict and status fields accurate

---

## 19. Owner Decisions Required

| # | Decision | Context |
|---|----------|---------|
| 1 | Approve Phase 1C-2 schema design direction | Gate to proceed to 1C-2B |
| 2 | Allow DeepSeek docs-only schema proposal capture | This branch |
| 3 | Allow future `$defs` in `.pnpd/orchestrator.schema.json` | Separate file vs. co-located |
| 4 | Allow future validator `--phase 1c` | Additive mode, no breaking changes |
| 5 | Allow future safe fixtures | `tests/fixtures/ledger/`, `tests/fixtures/handoff/` |
| 6 | Whether ledger/handoff schemas live in orchestrator schema or separate files | `orchestrator.schema.json` vs. `ledger.schema.json` + `handoff.schema.json` |
| 7 | Whether handoff routing remains only `owner`/`hermes`/`deepseek`/`codex`/`none` | Or whether additional agents (VertiForge, etc.) are added |
| 8 | Whether free-text summaries need strict length limits | Current proposal: `summary` 1000, `context` 2000 |
| 9 | Whether integrity hash is required in schema-only phase or deferred | `integrityBlock` is designed but optional to implement in 1C-2B |
| 10 | Whether `classificationEnum` and `authorityFlags` should be extracted to shared `$defs` | Avoids duplication between `repoResult`, `ledgerRecord`, `handoffRecord` |

---

## 20. Recommended Next Step

1. **Codex** performs docs-only formal audit of this design document.
2. **Owner** reviews audit findings and decides on the 10 decision points above.
3. If approved, proceed to **Phase 1C-2B** (schema definitions only) on a new branch.
4. **Do not** begin runtime implementation — this is a schema design only.

---

## Appendix A: Gates (run before commit)

```bash
cd /Users/lanretech/Projects/pnpd-os
git status --short --branch
git diff --name-only
git diff --check

node scripts/pnpd-validate-schemas.mjs
node scripts/pnpd-validate-schemas.mjs --phase 0
node scripts/pnpd-validate-schemas.mjs --phase 1b
node scripts/pnpd-orchestrator-dry-run.mjs
node scripts/pnpd-orchestrator-dry-run.mjs --json | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>JSON.parse(s))"
```

## Appendix B: Scope/security scans (run before commit)

```bash
git diff --name-only | grep -v '^docs/pnpd/orchestrator-phase-1c-2-schema-design.md$' && echo "SCOPE_VIOLATION" || true

grep -R "/Users/lanretech/Documents/BricLab Kids" . --exclude-dir=.git || true

grep -R -E "sk-|ghp_|github_pat_|xoxb-|AKIA|BEGIN PRIVATE KEY|SUPABASE_ACCESS_TOKEN|RESEND_API_KEY|OPENAI_API_KEY|DEEPSEEK_API_KEY|GITHUB_TOKEN" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules || true

grep -R -E "writeFile|appendFile|rm\(|unlink|rmdir|mkdir|rename|copyFile|chmod|chown|git commit|git merge|git push|gh pr|gh api|deploy|watch|daemon|scheduler|dispatch|setInterval|setTimeout|cron" docs/pnpd/orchestrator-phase-1c-2-schema-design.md || true
```
