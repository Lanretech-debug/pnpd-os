# PNPD Project Profile Schema and Adoption Model

## 1. Purpose

This document designs the Project Profile Schema and Adoption Model for PNPD-OS.

It defines how PNPD-OS records:

* project identity
* repo/source location
* product type
* lifecycle stage
* PNPD adoption status
* allowed automation level
* authority boundaries
* agents involved
* validation posture
* Product Delivery relationship
* Product Delivery Registry relationship
* memory/knowledge policy
* Teach Skills / Obsidian / Teach Skill Studio relationship
* project adoption recommendations
* Controlled Unlock constraints

This document is design-only and creates no schema, fixtures, validator support, adoption dry-run, project profile, mutation authority, deployment authority, or certification authority.

## 2. Current baseline

The following baseline reflects the state of PNPD-OS at the time this design document is written.

* Repo: `Lanretech-debug/pnpd-os`
* Branch: `main`
* Current repo delivery baseline: `PHASE_1P_B_FRAMEWORK_CLASSIFICATION_PUSHED_CI_GREEN`
* Current baseline commit: `08b23ce1e974427932d408d9ed5f633fdcae0685`
* Remote CI run: `27874877422`
* Remote CI conclusion: `success`
* Known local untracked files: `.DS_Store`, `.kunsdd/`, `index.html`

Contextual state:

* Project Adoption Layer is currently a planned category.
* Stage 5 is reserved for project profile/adoption model.
* Plug-and-play means profiled, assessed, templated, validated, governed, and routed through PNPD-OS workflows with minimal manual setup.
* Plug-and-play does not mean automatic mutation, deployment, approval, dispatch, or certification.

## 3. Project profile purpose

The project profile is the canonical project entry record for PNPD-OS adoption.

It must answer:

* What is this project?
* Where is the repo?
* What product/system type is it?
* What stage is it in?
* What PNPD-OS capabilities are already adopted?
* What adoption gaps remain?
* What agents are allowed to act?
* What automation level is allowed?
* What Product Delivery artifacts exist or are needed?
* What Product Delivery Registry status applies?
* What memory/knowledge policy applies?
* What next PNPD setup steps are recommended?

The project profile is the single source of truth for routing, validation, and governance during PNPD adoption.

## 4. Future schema shape

This section outlines the recommended future JSON shape for the project profile schema. It is a design sketch, not a schema implementation. No JSON schema is produced in Phase 1P-C.

Top-level fields:

| Field | Purpose | First-schema recommendation | Safety notes |
|-------|---------|----------------------------|--------------|
| schemaVersion | Version of the project profile schema | Required | Must be immutable once set for a profile |
| profileId | Unique identifier for the project profile | Required | Must be stable across updates |
| projectName | Human-readable project name | Required | Should match the primary repo or product name |
| projectSlug | URL-safe kebab-case identifier | Required | Used for file paths, routing, registry lookups |
| projectAliases | Alternative names or historical names | Optional | Helps with migration and discovery |
| projectOwner | Owner entity or individual | Required | Must be a real owner; no placeholder ownership |
| repo | Repository/source location object | Required | At least one source must be specified |
| product | Product classification object | Required | See section 6 for product model |
| lifecycle | Lifecycle stage and maturity object | Required | See section 7 for lifecycle model |
| pnpdAdoption | PNPD adoption status and evidence object | Required | See section 8 for adoption model |
| authority | Authority and delegation object | Required | See section 9 for authority model |
| agents | Agent/surface configuration object | Required | See section 11 for agent model |
| automation | Automation level and actions object | Required | See section 10 for automation model |
| validation | Validation posture object | Required | See section 12 for validation model |
| productDelivery | Product Delivery relationship object | Optional | See section 13 for Product Delivery relationship |
| productDeliveryRegistry | Product Delivery Registry relationship object | Optional | See section 14 for registry relationship |
| memoryAndKnowledge | Memory and knowledge policy object | Optional | See section 15 for memory and knowledge model |
| teachSkills | Teach Skills status object | Optional | See section 16 for Teach Skills model |
| riskAndCompliance | Risk and compliance classification object | Optional | See section 17 for risk and compliance model |
| adoptionRecommendations | Advisory recommendations object | Optional | See section 18 for adoption recommendations model |
| controlledUnlocks | Controlled Unlock tracking object | Required | See section 19 for Controlled Unlock model |
| audit | Audit trail object | Required | See section 20 for audit model |

### Non-normative illustrative pseudo-shape

The following is a non-normative illustration only. It is not a schema, not a fixture, and not a validator input.

```
{
  schemaVersion:          string,
  profileId:              string,
  projectName:            string,
  projectSlug:            string,
  projectAliases:         string[],
  projectOwner:           string,
  repo:                   RepoObject,
  product:                ProductObject,
  lifecycle:              LifecycleObject,
  pnpdAdoption:           PnpdAdoptionObject,
  authority:              AuthorityObject,
  agents:                 AgentsObject,
  automation:             AutomationObject,
  validation:             ValidationObject,
  productDelivery:        ProductDeliveryObject | null,
  productDeliveryRegistry: ProductDeliveryRegistryObject | null,
  memoryAndKnowledge:     MemoryAndKnowledgeObject | null,
  teachSkills:            TeachSkillsObject | null,
  riskAndCompliance:      RiskAndComplianceObject | null,
  adoptionRecommendations: AdoptionRecommendationsObject | null,
  controlledUnlocks:      ControlledUnlocksObject,
  audit:                  AuditObject
}
```

## 5. Repo/source model

The `repo` object records the canonical source location for a project.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| provider | Required | `github`, `gitlab`, `local`, `unknown` |
| repoFullName | Required | e.g. `Lanretech-debug/pnpd-os` |
| defaultBranch | Required | e.g. `main` |
| localPath | Required | Absolute or workspace-relative path |
| remoteUrl | Required | HTTPS or SSH clone URL |
| visibility | Required | `private`, `public`, `internal`, `unknown` |
| primaryLanguage | Recommended | e.g. `javascript`, `typescript` |
| packageManager | Recommended | e.g. `npm`, `yarn`, `pnpm` |
| ciProvider | Recommended | e.g. `github-actions` |
| productionEnvironment | Optional (first version) | Defer until deployment framework exists |
| stagingEnvironment | Optional (first version) | Defer until deployment framework exists |

## 6. Product model

The `product` object classifies the project's product or system type.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| productType | Required | See product type values below |
| domain | Recommended | Business or technical domain |
| targetUsers | Recommended | Intended user audience |
| targetMarket | Optional | Geographic or vertical market |
| complianceContext | Optional | Regulatory or industry compliance needs |
| dataSensitivity | Recommended | `low`, `medium`, `high`, `unknown` |
| revenueModel | Optional | Monetization approach |
| criticality | Recommended | `low`, `medium`, `high`, `critical`, `unknown` |
| userImpact | Optional | Scale and severity of user-facing impact |

Product type values:

* `saas` — Software-as-a-Service product
* `internal_tool` — Internal tooling or operational system
* `learning_app` — Educational or learning application
* `marketplace` — Multi-sided marketplace platform
* `content_platform` — Content publishing or distribution platform
* `automation_tool` — Workflow or process automation tool
* `data_ai_system` — Data-intensive or AI-driven system
* `unknown` — Type not yet classified

### Classification guidance (illustrative only — no actual profiles created)

* **JobToCash**: likely `saas` or `marketplace` depending on design
* **Lernova AI**: likely `learning_app` with `data_ai_system` characteristics
* **Pokedex learning app**: likely `learning_app`
* **Briclab Kids**: likely `learning_app`
* **Yoruba.com**: likely `content_platform` or `learning_app`

These are classification examples only. Phase 1P-C does not create actual project profiles for these projects.

## 7. Lifecycle model

The `lifecycle` object records the project's development stage and maturity.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| stage | Required | See lifecycle stage values below |
| maturity | Required | See maturity values below |
| releaseStatus | Recommended | `unreleased`, `internal`, `beta`, `public`, `unknown` |
| productionReadinessClaim | Required | Must be `false` unless the future production-readiness certification framework passes |
| lastVerifiedBaseline | Required | String identifier referencing last known good baseline |
| lastVerifiedCiRun | Recommended | CI run number or identifier |
| lastVerifiedCommit | Required | Full commit SHA of last verified baseline |
| currentKnownRisks | Recommended | Array of known risk descriptions |

Lifecycle stage values:

* `idea` — Concept stage, no code or minimal prototype
* `prototyping` — Early exploration and prototyping
* `alpha` — Core functionality under active development
* `beta` — Feature-complete or near-complete, in testing
* `production` — Live with real users
* `deprecated` — No longer actively maintained

Maturity values:

* `exploratory` — Rapid iteration, unstable APIs
* `development` — Active development toward stability
* `stable` — Predictable changes, established patterns
* `maintenance` — Minimal changes, bug fixes only

### Safety rule

`productionReadinessClaim` must be `false` unless the future production-readiness certification framework passes. No project profile may claim production readiness until a certification gate exists and is passed.

## 8. PNPD adoption model

The `pnpdAdoption` object tracks how far a project has progressed through PNPD-OS adoption.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| adoptionStatus | Required | See adoption statuses below |
| adoptedLayers | Required | Array of PNPD layers already adopted |
| missingLayers | Required | Array of PNPD layers not yet adopted |
| activePhase | Recommended | Current active PNPD phase identifier |
| nextRecommendedPhase | Recommended | Advisory next phase |
| adoptionMode | Required | See adoption modes below |
| adoptionBlockers | Required | Explicit array of blocking conditions |
| adoptionEvidence | Required (above `discovery`) | Evidence substantiating the claimed status |

Adoption statuses:

* `not_started` — No PNPD adoption activity
* `discovery` — Initial assessment underway
* `profile_created` — Project profile record exists
* `validation_ready` — Validation commands configured and passing locally
* `product_delivery_ready` — Product Delivery framework surfaces adopted
* `registry_ready` — Product Delivery Registry active
* `governed` — Full governance model applied
* `controlled_unlock_pending` — Awaiting Controlled Unlock approval
* `certified` — Full PNPD certification achieved (future-only)

Adoption modes:

* `greenfield` — New project built with PNPD from start
* `brownfield` — Existing project adopting PNPD incrementally
* `migration` — Project migrating tooling/process into PNPD
* `integration` — Project integrating PNPD alongside existing systems
* `eval` — Evaluation only, no commitment to full adoption

### Safety rules

* `certified` remains future-only until production-readiness certification framework exists.
* Adoption evidence must be required for any claim above `discovery`.
* Adoption blockers must be explicit. No empty blocker arrays for statuses above `discovery` unless genuinely unblocked.

## 9. Authority model

The `authority` object defines who and what can act on the project.

| Field | Classification | Safe default |
|-------|---------------|-------------|
| ownerRequired | Required | `true` |
| ownerApprovalRequiredFor | Required | Array of actions requiring owner approval |
| codexAuditRequiredFor | Required | Array of actions requiring Codex audit |
| allowedAgentRoles | Required | Array of allowed agent role identifiers |
| delegatedAuthorityStatus | Required | `none` |
| agentBridgeAuthority | Required | `false` |
| githubMutationPolicy | Required | `blocked_except_explicit_codex_finalization` |
| deploymentPolicy | Required | `blocked` |
| dispatchPolicy | Required | `blocked` |

This model must align with `docs/pnpd/agent-orchestration-control-loop.md`. Authority boundaries defined here constrain agent behavior defined in the agent model (section 11).

## 10. Automation model

The `automation` object defines what level of automated action is permitted.

| Field | Classification | Safe default |
|-------|---------------|-------------|
| automationLevel | Required | See automation levels below |
| allowedAutomationActions | Required | Explicit list of allowed automated actions |
| blockedAutomationActions | Required | Explicit list of blocked automated actions |
| requiresOwnerApproval | Required | Array of actions gated on owner approval |
| requiresCodexAudit | Required | Array of actions gated on Codex audit |
| requiresGithubVerification | Required | Array of actions gated on GitHub verification |

Automation levels:

* `none` — No automated actions permitted
* `advisory_only` — Recommendations only, no mutations
* `local_validation_only` — Local validation commands permitted
* `docs_generation_only` — Documentation generation permitted
* `branch_commit_only` — Branch creation and commit permitted within scope
* `codex_finalize_only` — Codex-audited finalization permitted
* `controlled_mutation` — Controlled mutation permitted under governance
* `dispatch_enabled` — Dispatch actions permitted (not currently active)
* `deployment_enabled` — Deployment actions permitted (not currently active)

### Safety rules

* Higher automation levels are Controlled Unlock only.
* Current safe default is `advisory_only` or `local_validation_only` unless explicitly approved.
* `dispatch_enabled` and `deployment_enabled` are not currently active.

## 11. Agent model

The `agents` object configures each agent/surface that interacts with the project.

### Hermes

| Field | Recommendation |
|-------|---------------|
| enabled | `true` |
| role | Design and recommendation only |
| allowedActions | `[design, recommend, assess, classify]` |
| forbiddenActions | `[mutate, deploy, dispatch, certify, finalize_without_codex]` |
| evidenceRequired | Design documents, assessment reports |
| stopConditions | Scope boundary reached, owner approval required, Codex audit gate |

### DeepSeek GUI

| Field | Recommendation |
|-------|---------------|
| enabled | `true` |
| role | Implementation only for approved scope |
| allowedActions | `[implement_in_scope, validate_locally, commit_in_scope, document]` |
| forbiddenActions | `[mutate_out_of_scope, deploy, dispatch, certify, finalize_without_codex]` |
| evidenceRequired | Scope verification, diff evidence, gate results |
| stopConditions | Scope boundary reached, forbidden file detected, gate failure |

### Codex

| Field | Recommendation |
|-------|---------------|
| enabled | `true` (when explicitly authorized) |
| role | Audit and finalize only when explicitly authorized |
| allowedActions | `[audit, verify, finalize_if_authorized]` |
| forbiddenActions | `[mutate_without_audit, deploy, dispatch, initiate_changes]` |
| evidenceRequired | Audit trail, verification results, finalization evidence |
| stopConditions | Audit failure, missing authorization, evidence gap |

### GitHub App

| Field | Recommendation |
|-------|---------------|
| enabled | `true` (external verification) |
| role | External verification only |
| allowedActions | `[verify_ci, verify_commit, verify_pr_status]` |
| forbiddenActions | `[mutate_code, initiate_pr, merge, deploy]` |
| evidenceRequired | CI run results, commit verification |
| stopConditions | CI failure, verification mismatch |

### AgentBridge

| Field | Recommendation |
|-------|---------------|
| enabled | `false` (current state) |
| role | Coordinate only in current state |
| allowedActions | `[coordinate]` |
| forbiddenActions | `[delegate_authority, mutate, deploy, dispatch]` |
| evidenceRequired | Coordination logs |
| stopConditions | Authority boundary, unimplemented capability |

### Future Dashboard

| Field | Recommendation |
|-------|---------------|
| enabled | `false` (planned, not implemented) |
| role | Planned, internal-use only, no current authority |
| allowedActions | `[]` (none currently) |
| forbiddenActions | `[all]` |
| evidenceRequired | N/A |
| stopConditions | Not implemented |

## 12. Validation model

The `validation` object records the project's validation posture.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| requiredCommands | Required | Array of validation commands required for this project |
| lastLocalValidation | Recommended | Timestamp and result of last local validation run |
| lastRemoteCi | Recommended | CI run number and conclusion of last remote CI |
| schemaValidationStatus | Recommended | `pass`, `fail`, `not_applicable`, `pending_future_validator` |
| fixtureValidationStatus | Recommended | `pass`, `fail`, `not_applicable`, `pending_future_validator` |
| dryRunStatus | Required | `PASS`, `PASS_WITH_KNOWN_LOCAL_NEEDS_TRIAGE_CAVEAT`, `FAIL` |
| testStatus | Recommended | `pass`, `fail`, `not_applicable`, `needs_triage` |
| knownLocalCaveats | Required | Explicit array of known local caveats |

### Dry-run caveat handling

Dry-run results must surface caveats explicitly. A `PASS_WITH_KNOWN_LOCAL_NEEDS_TRIAGE_CAVEAT` result means the dry-run exited zero but reported issues attributable only to known local untracked files or protected main branch conditions — not to the change under validation.

Schema and fixtures will be validated by future validator extension, not in Phase 1P-C.

## 13. Product Delivery relationship

The `productDelivery` object tracks whether the project has adopted Product Delivery framework surfaces.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| frameworkDocsPresent | Required | `true` or `false` |
| templatesPresent | Required | `true` or `false` |
| schemaPresent | Required | `true` or `false` |
| fixturesPresent | Required | `true` or `false` |
| validatorPresent | Required | `true` or `false` |
| artifactValidationStatus | Recommended | Overall validation status for artifacts |
| artifacts | Required | Array of artifact identifiers present |
| missingArtifacts | Required | Array of artifact identifiers missing |
| recommendedArtifacts | Recommended | Array of artifact identifiers recommended for next adoption step |

This relationship tracks adoption status of Product Delivery framework surfaces. It does not generate artifacts in Phase 1P-C.

## 14. Product Delivery Registry relationship

The `productDeliveryRegistry` object tracks the project's relationship with the Product Delivery Registry.

| Field | Classification | Safe default |
|-------|---------------|-------------|
| registryMode | Required | `none`, `example_only`, `local_read_only`, or `controlled_writer_pending` |
| registryPresent | Required | `true` or `false` |
| registryPath | Optional | Path to registry instance if present |
| schemaInstanceValidation | Optional | Validation status of registry instance against schema |
| exampleDiscovery | Optional | Whether example instances have been discovered |
| artifactReferences | Optional | Array of artifact references tracked in registry |
| hashValidationStatus | Required | `pending_path_design` |
| liveWriterStatus | Required | `not_implemented` |

No live writer or hash validation is implemented in the current baseline. Registry interaction is limited to local read-only inspection and example discovery.

## 15. Memory and knowledge model

The `memoryAndKnowledge` object defines how the project handles persistent context and knowledge.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| obsidianPolicy | Required | Policy for Obsidian integration (future) |
| memorySources | Required | Array of canonical memory source identifiers |
| canonicalContextSources | Required | Array of paths or references to canonical context |
| sensitiveContextPolicy | Required | How sensitive project context is handled |
| projectNotesPath | Optional | Path to project notes directory or vault |
| skillReferences | Optional | Array of skill reference identifiers |

### Clarifications

* Obsidian integration is not implemented yet.
* Memory policy should be designed before direct integration.
* Sensitive project context must be handled deliberately and should not be assumed safe for every agent.

## 16. Teach Skills model

The `teachSkills` object tracks the project's relationship with the Teach Skills framework.

| Field | Classification | Safe default |
|-------|---------------|-------------|
| enabled | Required | `false` |
| categoryStatus | Required | `active_roadmap` |
| requiredSkills | Optional | Array of skill identifiers the project needs |
| availableSkills | Optional | Array of skill identifiers already available |
| missingSkills | Optional | Array of skill identifiers missing |
| skillStudioStatus | Required | `not_implemented` |
| validationPolicy | Required | `future` |

Teach Skills and Teach Skill Studio are active future categories but not implemented in Phase 1P-C.

## 17. Risk and compliance model

The `riskAndCompliance` object classifies the project's risk posture.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| complianceContexts | Recommended | Array of applicable compliance frameworks |
| dataSensitivity | Required | `low`, `medium`, `high`, `unknown` |
| safetyRisks | Recommended | Array of safety-related risk descriptions |
| operationalRisks | Recommended | Array of operational risk descriptions |
| aiRisks | Recommended | Array of AI-specific risk descriptions |
| deploymentRisks | Recommended | Array of deployment risk descriptions |
| mitigationNotes | Recommended | Notes on mitigation approaches |

This model helps classify projects like JobToCash, Lernova AI, Pokedex learning app, Briclab Kids, and Yoruba.com, but this phase must not create actual profiles for those projects.

## 18. Adoption recommendations model

The `adoptionRecommendations` object provides advisory guidance for the next PNPD adoption steps.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| recommendedNextPhase | Required | Advisory next phase identifier |
| missingPnpdFiles | Required | Array of PNPD files not yet present |
| recommendedTemplates | Recommended | Array of recommended template identifiers |
| recommendedValidationCommands | Recommended | Array of recommended validation commands |
| controlledUnlockWarnings | Required | Array of Controlled Unlock warnings |
| humanReviewNotes | Recommended | Notes for human reviewer |

Recommendations are advisory and do not authorize implementation, mutation, dispatch, deployment, or certification.

## 19. Controlled Unlock model

The `controlledUnlocks` object tracks what capabilities have been requested and unlocked.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| requestedUnlocks | Required | Array of unlock identifiers requested |
| allowedUnlocks | Required | Array of unlock identifiers allowed |
| blockedUntilPhase | Required | Array mapping blocked unlocks to required phases |
| dependencyNotes | Recommended | Notes on unlock dependencies |
| ownerApprovalStatus | Required | Per-unlock owner approval status |
| codexAuditStatus | Required | Per-unlock Codex audit status |
| githubVerificationStatus | Required | Per-unlock GitHub verification status |

This model is advisory only until each unlock phase is designed and approved. Unlocks are tracked but not executable in Phase 1P-C.

## 20. Audit model

The `audit` object provides traceability for the project profile itself.

| Field | Classification | Safe default / guidance |
|-------|---------------|------------------------|
| createdAt | Required | ISO 8601 timestamp of profile creation |
| updatedAt | Required | ISO 8601 timestamp of last profile update |
| createdBy | Required | Identity of profile creator |
| lastReviewedBy | Required | Identity of last reviewer |
| lastReviewedAt | Required | ISO 8601 timestamp of last review |
| baselineCommit | Required | Full commit SHA of the baseline this profile references |
| baselineVerdict | Required | Verdict string of the referenced baseline |
| evidenceLinks | Recommended | Array of links to supporting evidence |
| notes | Optional | Free-form audit notes |

### Safety

No fake timestamps in future fixtures unless schema defines placeholder examples carefully. Audit fields must support traceability without inventing evidence.

## 21. Schema implementation recommendation

Recommended sequencing:

* **1P-C**: docs-only project profile schema and adoption model design (this phase)
* **1P-D**: project profile JSON schema
* **1P-E**: fixtures and validator support
* **1P-F**: project adoption dry-run design/implementation
* **1P-G**: reusable project adoption templates / existing-project adoption map / Teach Skills categorisation, depending on follow-up design

Schema, fixtures, validator support, templates, and adoption dry-run are deferred.

## 22. Future adoption dry-run relationship

Project adoption dry-run is a future Stage 5/6 capability.

It will eventually:

* consume the project profile schema
* run validation commands
* produce adoption recommendations
* simulate automation settings
* surface known local caveats
* identify Controlled Unlock warnings

It is not implemented in Phase 1P-C.

## 23. Non-goals

Phase 1P-C must not:

* implement JSON schema
* implement fixtures
* implement validator changes
* implement project adoption dry-run
* implement templates
* create project profiles for real projects
* edit package.json
* edit CI workflow
* edit runtime/orchestrator code
* edit Product Delivery Registry state
* edit current capability map
* edit agent orchestration control loop
* edit framework classification
* implement Obsidian integration
* implement Teach Skills
* implement Teach Skill Studio
* implement daemon/dashboard
* implement AgentBridge delegated authority
* implement GitHub/API mutation
* implement dispatch
* implement deployment
* implement certification

## 24. Verification commands

The following commands verify that Phase 1P-C is scoped correctly:

```bash id="tb39re"
git diff --name-only
git diff --check
git diff -- package.json
git diff -- .github/workflows/pnpd-ci.yml
git diff -- scripts
git diff -- .pnpd
git diff -- tests
git diff -- templates
git diff -- docs/pnpd/current-capability-map.md
git diff -- docs/pnpd/agent-orchestration-control-loop.md
git diff -- docs/pnpd/framework-classification.md

node --check scripts/pnpd-validate-schemas.mjs
node --check scripts/pnpd-product-delivery-registry-write.mjs
node --check scripts/pnpd-orchestrator-dry-run.mjs

npm run validate:pdr:fixtures
npm run validate:pdr:examples
npm run validate:pdr
npm run validate
npm run dry-run
npm test

test ! -d .pnpd/product-delivery-registry
test ! -e .pnpd/ledger
test ! -e .pnpd/handoffs
test ! -e .pnpd/locks
```

## 25. Status of this document

This document is design-only.

It creates no:

* JSON schema
* fixtures
* validator support
* adoption dry-run
* template
* project profile
* execution capability
* connector
* dashboard
* daemon
* installer
* package
* mutation authority
* deployment authority
* dispatch authority
* certification authority
* Obsidian integration
* Teach Skills implementation
* Teach Skill Studio
