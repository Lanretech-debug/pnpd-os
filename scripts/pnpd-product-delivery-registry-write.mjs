#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const REGISTRY_DIR = ".pnpd/product-delivery-registry";
const DEFAULT_REGISTRY_PATH = path.join(REGISTRY_DIR, "registry.json");

// ── Help text ────────────────────────────────────────────────────────────────────

const HELP = `PNPD Product Delivery Registry Writer

Usage:
  node scripts/pnpd-product-delivery-registry-write.mjs --entry-file <path> [--registry <path>] [--write] [--no-write] [--append]

Options:
  --entry-file <path>   Required. Path to a JSON file containing one registry entry object.
  --registry <path>     Optional. Target registry path under .pnpd/product-delivery-registry/. Default: ${DEFAULT_REGISTRY_PATH}
  --write               Optional. Required for filesystem mutation. Without this, dry-run only.
  --no-write            Optional. Overrides --write. Forces dry-run mode.
  --append              Optional. Append mode: add one unique entry to an existing registry.
  --help, -h            Show this help.

Description:
  Creates a new Product Delivery registry file from a single entry JSON.
  The writer composes a full registry object, validates it with the existing
  validator, and writes it atomically.

  Create-only (default): fails if the target registry already exists.
  Append mode (--append): requires existing registry, appends one unique entry.
  No merge, upsert, replace, update, or delete modes.

  Without --write (dry-run): validates inputs, composes registry, prints plan.
  With --write --no-write: --no-write wins, dry-run only.`;

// ── Argument parsing ─────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { registry: null, entryFile: null, write: false, noWrite: false, append: false };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--registry") {
      if (!argv[i + 1]) {
        throw new Error("--registry requires a path argument.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--registry requires a path argument, got: " + argv[i + 1]);
      }
      if (args.registry) {
        throw new Error("--registry specified more than once.");
      }
      args.registry = argv[i + 1];
      i += 1;
    } else if (arg === "--entry-file") {
      if (!argv[i + 1]) {
        throw new Error("--entry-file requires a path argument.");
      }
      if (argv[i + 1].startsWith("-")) {
        throw new Error("--entry-file requires a path argument, got: " + argv[i + 1]);
      }
      if (args.entryFile) {
        throw new Error("--entry-file specified more than once.");
      }
      args.entryFile = argv[i + 1];
      i += 1;
    } else if (arg === "--write") {
      args.write = true;
    } else if (arg === "--no-write") {
      args.noWrite = true;
    } else if (arg === "--append") {
      args.append = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(HELP);
      process.exit(0);
    } else {
      throw new Error("Unknown argument: " + arg);
    }
  }

  if (!args.entryFile) {
    throw new Error("--entry-file is required.");
  }

  return args;
}

// ── Git metadata ─────────────────────────────────────────────────────────────────

function getGitBranch() {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 10000
  });
  if (result.status !== 0) {
    throw new Error("git rev-parse --abbrev-ref HEAD failed: " + (result.stderr || "").trim());
  }
  return result.stdout.trim();
}

function getGitCommit() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 10000
  });
  if (result.status !== 0) {
    throw new Error("git rev-parse HEAD failed: " + (result.stderr || "").trim());
  }
  return result.stdout.trim();
}

function getRepoName() {
  // Try package.json first
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    if (pkg.name && typeof pkg.name === "string" && pkg.name.length > 0) {
      return pkg.name;
    }
  } catch (_) {
    // fall through
  }
  // Fallback to repo directory basename
  return path.basename(ROOT);
}

// ── Path safety ──────────────────────────────────────────────────────────────────

function validateRegistryPath(registryPathArg) {
  // Reject absolute paths
  if (path.isAbsolute(registryPathArg)) {
    throw new Error("Registry path must be repo-relative, got absolute: " + registryPathArg);
  }

  // Reject traversal
  if (registryPathArg.includes("..")) {
    throw new Error("Registry path must not contain .. traversal: " + registryPathArg);
  }

  // Reject URLs
  if (registryPathArg.includes("://")) {
    throw new Error("Registry path must not be a URL: " + registryPathArg);
  }

  // The first writer reserves exactly registry.json as the target filename.
  if (path.basename(registryPathArg) !== "registry.json") {
    throw new Error("Registry path must end with registry.json: " + registryPathArg);
  }

  // Reject characters that enable symlink/shell escapes
  if (registryPathArg.includes("~")) {
    throw new Error("Registry path must not contain ~: " + registryPathArg);
  }

  // Resolve to absolute path
  const resolved = path.resolve(ROOT, registryPathArg);

  // Must be under .pnpd/product-delivery-registry/
  const registryDirResolved = path.resolve(ROOT, REGISTRY_DIR) + path.sep;
  if (!resolved.startsWith(registryDirResolved)) {
    throw new Error("Registry path must be under " + REGISTRY_DIR + "/, got: " + registryPathArg);
  }

  // If .pnpd exists, verify it's not a symlink escaping the repo
  const pnpdPath = path.join(ROOT, ".pnpd");
  try {
    const realPnpd = fs.realpathSync(pnpdPath);
    const rootResolved = path.resolve(ROOT);
    if (!realPnpd.startsWith(rootResolved + path.sep) && realPnpd !== rootResolved) {
      throw new Error(".pnpd symlink escapes repo root");
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    // .pnpd doesn't exist yet, that's OK for now — will be validated on write
  }

  // If .pnpd/product-delivery-registry exists, verify it's not a symlink escape
  const regDirPath = path.join(ROOT, REGISTRY_DIR);
  try {
    const realRegDir = fs.realpathSync(regDirPath);
    const rootResolved = path.resolve(ROOT);
    if (!realRegDir.startsWith(rootResolved + path.sep) && realRegDir !== rootResolved) {
      throw new Error(REGISTRY_DIR + " symlink escapes repo root");
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    // Directory doesn't exist yet, OK
  }

  return { resolved, relativePath: registryPathArg };
}

function validateEntryFilePath(entryPathArg) {
  // Reject missing
  if (!entryPathArg) {
    throw new Error("entry-file path is required");
  }

  // Reject absolute paths
  if (path.isAbsolute(entryPathArg)) {
    throw new Error("Entry-file path must be repo-relative, got absolute: " + entryPathArg);
  }

  // Reject traversal
  if (entryPathArg.includes("..")) {
    throw new Error("Entry-file path must not contain .. traversal: " + entryPathArg);
  }

  // Reject URLs
  if (entryPathArg.includes("://")) {
    throw new Error("Entry-file path must not be a URL: " + entryPathArg);
  }

  // Reject symlink escape chars
  if (entryPathArg.includes("~")) {
    throw new Error("Entry-file path must not contain ~: " + entryPathArg);
  }

  // Resolve
  const resolved = path.resolve(ROOT, entryPathArg);

  // Must be inside repo root
  const rootResolved = path.resolve(ROOT);
  if (!resolved.startsWith(rootResolved + path.sep) && resolved !== rootResolved) {
    throw new Error("Entry-file path must be inside repo root: " + entryPathArg);
  }

  // Must exist
  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Entry file not found: " + entryPathArg);
    }
    throw new Error("Entry file stat error: " + e.message);
  }

  // Must be a regular file
  if (!stat.isFile()) {
    throw new Error("Entry file is not a regular file: " + entryPathArg);
  }

  // Realpath containment check
  let realPath;
  try {
    realPath = fs.realpathSync(resolved);
  } catch (e) {
    throw new Error("Entry file realpath error: " + e.message);
  }

  if (!realPath.startsWith(rootResolved + path.sep) && realPath !== rootResolved) {
    throw new Error("Entry file realpath escapes repo root: " + entryPathArg);
  }

  return { resolved, relativePath: entryPathArg };
}

// ── Timestamp ─────────────────────────────────────────────────────────────────────

function makeTimestamp() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const h = String(now.getUTCHours()).padStart(2, "0");
  const min = String(now.getUTCMinutes()).padStart(2, "0");
  const s = String(now.getUTCSeconds()).padStart(2, "0");
  const ms = String(now.getUTCMilliseconds()).padStart(3, "0");
  return y + "-" + m + "-" + d + "T" + h + ":" + min + ":" + s + "." + ms + "Z";
}

// ── Registry composition ─────────────────────────────────────────────────────────

function composeRegistry(entry, repoInfo, timestamp) {
  return {
    schemaVersion: "1.0.0",
    recordType: "productDeliveryArtifactRegistry",
    registryId: "writer-" + timestamp.replace(/[T:.]/g, "-").replace(/Z$/, ""),
    createdAt: timestamp,
    createdBy: "pnpd-product-delivery-registry-write",
    repo: {
      repoId: repoInfo.name,
      name: repoInfo.name,
      rootRelative: ".",
      branch: repoInfo.branch,
      commit: repoInfo.commit
    },
    governance: {
      advisoryOnly: true,
      authorizesImplementation: false,
      authorizesMerge: false,
      authorizesDispatch: false,
      authorizesDeployment: false,
      authorizesGitHubMutation: false,
      authorizesApiMutation: false,
      certifiesProductionReadiness: false,
      ownerFinalAuthority: true,
      codexIsOwner: false,
      agentBridgeCanApprove: false,
      agentBridgeCanMerge: false,
      agentBridgeCanDispatch: false,
      agentBridgeCanDeploy: false,
      runtimeConsumptionAllowed: false,
      artifactGenerationAllowed: false,
      externalMutationAllowed: false
    },
    entries: [entry]
  };
}

function composeAppendRegistry(existingRegistry, newEntry) {
  // Preserve all top-level metadata from the existing registry.
  // Only the entries array changes: existing order preserved, new entry appended.
  return {
    schemaVersion: existingRegistry.schemaVersion,
    recordType: existingRegistry.recordType,
    registryId: existingRegistry.registryId,
    createdAt: existingRegistry.createdAt,
    createdBy: existingRegistry.createdBy,
    repo: existingRegistry.repo,
    governance: existingRegistry.governance,
    entries: [...existingRegistry.entries, newEntry]
  };
}

// ── Registry validation ───────────────────────────────────────────────────────────

function validateRegistryTemp(tmpPath) {
  // Pass repo-relative path to the validator (it rejects absolute paths)
  const relativePath = path.relative(ROOT, tmpPath);
  const result = spawnSync("node", [
    "scripts/pnpd-validate-schemas.mjs",
    "--product-delivery-registry",
    relativePath
  ], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 30000
  });

  if (result.status !== 0) {
    const output = (result.stdout || "") + (result.stderr || "");
    throw new Error("Registry validation failed:\n" + output.trim());
  }

  return result.stdout;
}

function validateRegistryWithoutRetainedState(registry, finalRegPath) {
  const parentDir = path.dirname(finalRegPath);
  const parentDirPreexisted = fs.existsSync(parentDir);
  const tmpPath = path.join(parentDir, "registry.dry-run.tmp-" + process.pid + ".json");

  try {
    fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(tmpPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
    return validateRegistryTemp(tmpPath);
  } finally {
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    if (!parentDirPreexisted) {
      try { fs.rmdirSync(parentDir); } catch (_) {}
    }
  }
}

// ── Existing registry operations ──────────────────────────────────────────────────

function readExistingRegistry(registryPath) {
  let raw;
  try {
    raw = fs.readFileSync(registryPath, "utf8");
  } catch (e) {
    throw new Error("Failed to read existing registry at " + registryPath + ": " + e.message);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error("Failed to parse existing registry at " + registryPath + ": " + e.message);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Existing registry must contain a JSON object: " + registryPath);
  }

  return data;
}

function validateExistingRegistry(registryPath) {
  const relativePath = path.relative(ROOT, registryPath);
  const result = spawnSync("node", [
    "scripts/pnpd-validate-schemas.mjs",
    "--product-delivery-registry",
    relativePath
  ], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 30000
  });

  if (result.status !== 0) {
    const output = (result.stdout || "") + (result.stderr || "");
    throw new Error("Existing registry validation failed:\n" + output.trim());
  }

  return result.stdout;
}

function checkDuplicateArtifactId(existingRegistry, newEntry) {
  if (!newEntry.artifactId) return;

  const newId = newEntry.artifactId;
  const entries = existingRegistry.entries;
  if (!Array.isArray(entries)) return;

  for (const existing of entries) {
    if (existing && existing.artifactId === newId) {
      throw new Error(
        "Duplicate artifactId '" + newId + "': an entry with this artifactId already exists in the registry. " +
        "Append mode does not overwrite, merge, upsert, or resolve duplicates automatically."
      );
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv);

  // Determine write mode
  const effectiveWrite = args.write && !args.noWrite;

  // ── Validate entry file path ──
  const entryPathInfo = validateEntryFilePath(args.entryFile);

  // ── Read and parse entry JSON ──
  let entry;
  try {
    const raw = fs.readFileSync(entryPathInfo.resolved, "utf8");
    entry = JSON.parse(raw);
  } catch (e) {
    throw new Error("Failed to parse entry file " + args.entryFile + ": " + e.message);
  }

  // ── Validate entry is an object ──
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("Entry file must contain a single JSON object, not an array or primitive: " + args.entryFile);
  }

  // ── Validate registry path ──
  const registryPathArg = args.registry || DEFAULT_REGISTRY_PATH;
  const regInfo = validateRegistryPath(registryPathArg);

  // ── Resolve final registry path ──
  const finalRegPath = regInfo.resolved;

  // ── Get git metadata ──
  let repoInfo;
  try {
    repoInfo = {
      branch: getGitBranch(),
      commit: getGitCommit(),
      name: getRepoName()
    };
  } catch (e) {
    throw new Error("Failed to read git repository metadata: " + e.message);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // APPEND MODE
  // ═══════════════════════════════════════════════════════════════════════════════

  if (args.append) {
    // ── Append mode requires existing registry ──
    if (!fs.existsSync(finalRegPath)) {
      throw new Error(
        "Append mode requires an existing registry at " + registryPathArg + ". " +
        "Use create-only mode (without --append) to create a new registry first."
      );
    }

    // ── Validate existing registry ──
    const existingValidationOutput = validateExistingRegistry(finalRegPath);

    // ── Read existing registry ──
    const existingRegistry = readExistingRegistry(finalRegPath);

    // ── Check duplicate artifactId ──
    checkDuplicateArtifactId(existingRegistry, entry);

    // ── Compose appended registry ──
    const appendedRegistry = composeAppendRegistry(existingRegistry, entry);

    // ── If not writing, print dry-run plan and exit ──
    if (!effectiveWrite) {
      const validated = validateRegistryWithoutRetainedState(appendedRegistry, finalRegPath);
      console.log(validated.trim());
      console.log("");
      console.log("Registry writer append mode — dry run");
      console.log("Existing registry: " + registryPathArg);
      console.log("Entry file: " + args.entryFile);
      console.log("New entry artifactId: " + (entry.artifactId || "(missing)"));
      console.log("Mode: append dry-run (use --write to append entry)");
      console.log("");
      console.log("Registry would contain:");
      console.log("  schemaVersion: " + appendedRegistry.schemaVersion);
      console.log("  registryId: " + appendedRegistry.registryId);
      console.log("  repo: " + appendedRegistry.repo.name + " @" + appendedRegistry.repo.branch + " (" + appendedRegistry.repo.commit.slice(0, 8) + ")");
      console.log("  entries: " + existingRegistry.entries.length + " existing + 1 new = " + appendedRegistry.entries.length);
      console.log("Append dry-run complete. No files changed.");
      process.exit(0);
    }

    // ── APPEND WRITE MODE ──

    const parentDir = path.dirname(finalRegPath);
    const parentDirPreexisted = fs.existsSync(parentDir);

    // Write temp file with appended registry
    const tmpPath = path.join(parentDir, "registry.tmp-" + process.pid + ".json");
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(appendedRegistry, null, 2) + "\n", "utf8");
    } catch (e) {
      throw new Error("Failed to write temp registry file: " + e.message);
    }

    // Validate temp (composed) registry
    try {
      const validated = validateRegistryTemp(tmpPath);
      console.log(validated.trim());
    } catch (e) {
      // Validation failed — delete temp
      try { fs.unlinkSync(tmpPath); } catch (_) {}
      console.error("Registry validation failed. Temp file deleted. Existing registry unchanged.");
      throw e;
    }

    // Atomic rename
    try {
      fs.renameSync(tmpPath, finalRegPath);
    } catch (e) {
      // Try to clean up temp
      try { fs.unlinkSync(tmpPath); } catch (_) {}
      throw new Error("Failed to rename temp registry to " + registryPathArg + ": " + e.message);
    }

    // Report success
    console.log("");
    console.log("Entry appended to registry: " + registryPathArg);
    console.log("  schemaVersion: " + appendedRegistry.schemaVersion);
    console.log("  registryId: " + appendedRegistry.registryId);
    console.log("  new entry artifactId: " + (entry.artifactId || "(missing)"));
    console.log("  entries: " + appendedRegistry.entries.length + " (" + existingRegistry.entries.length + " existing + 1 new)");
    console.log("  repo: " + appendedRegistry.repo.name + " @" + appendedRegistry.repo.branch);
    console.log("Verification: node scripts/pnpd-validate-schemas.mjs --product-delivery-registry " + registryPathArg);
    console.log("Full check: node scripts/pnpd-validate-schemas.mjs --product-delivery-registry " + registryPathArg + " --check-registry-artifacts --verify-registry-artifact-hashes");

    process.exit(0);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CREATE-ONLY MODE (existing behavior — unchanged when --append is absent)
  // ═══════════════════════════════════════════════════════════════════════════════

  const timestamp = makeTimestamp();
  const registry = composeRegistry(entry, repoInfo, timestamp);

  // ── If not writing, print dry-run plan and exit ──
  if (!effectiveWrite) {
    const validated = validateRegistryWithoutRetainedState(registry, finalRegPath);
    console.log(validated.trim());
    console.log("");
    console.log("Registry writer dry-run");
    console.log("Entry file: " + args.entryFile);
    console.log("Target registry: " + registryPathArg);
    console.log("Entry artifactId: " + (entry.artifactId || "(missing)"));
    console.log("Mode: dry-run (use --write to create registry)");
    console.log("");
    console.log("Registry would contain:");
    console.log("  schemaVersion: " + registry.schemaVersion);
    console.log("  registryId: " + registry.registryId);
    console.log("  repo: " + registry.repo.name + " @" + registry.repo.branch + " (" + registry.repo.commit.slice(0, 8) + ")");
    console.log("  entries: 1");
    console.log("Dry-run complete. No files created.");
    process.exit(0);
  }

  // ── WRITE MODE ──

  // Check target does not already exist
  if (fs.existsSync(finalRegPath)) {
    throw new Error("Registry already exists at " + registryPathArg + ". This writer is create-only.");
  }

  // Create parent directory
  const parentDir = path.dirname(finalRegPath);
  const parentDirPreexisted = fs.existsSync(parentDir);
  try {
    fs.mkdirSync(parentDir, { recursive: true });
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw new Error("Failed to create registry directory " + parentDir + ": " + e.message);
    }
  }

  // Verify the created directory is not a symlink escape
  let realParentDir;
  try {
    realParentDir = fs.realpathSync(parentDir);
  } catch (e) {
    throw new Error("Failed to resolve registry parent dir: " + e.message);
  }
  const rootResolved = path.resolve(ROOT) + path.sep;
  if (!realParentDir.startsWith(rootResolved) && realParentDir !== path.resolve(ROOT)) {
    // Created dir resolved outside repo root — clean up
    try { fs.rmdirSync(parentDir); } catch (_) {}
    throw new Error("Registry directory resolved outside repo root");
  }

  // Write temp file
  const tmpPath = path.join(parentDir, "registry.tmp-" + process.pid + ".json");
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
  } catch (e) {
    throw new Error("Failed to write temp registry file: " + e.message);
  }

  // Validate temp registry
  try {
    const validated = validateRegistryTemp(tmpPath);
    console.log(validated.trim());
  } catch (e) {
    // Validation failed — delete temp and parent dir if empty
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    if (!parentDirPreexisted) {
      try { fs.rmdirSync(parentDir); } catch (_) {}
    }
    console.error("Registry validation failed. Temp file deleted. No registry data left.");
    throw e;
  }

  // Atomic rename
  try {
    fs.renameSync(tmpPath, finalRegPath);
  } catch (e) {
    // Try to clean up temp
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    throw new Error("Failed to rename temp registry to " + registryPathArg + ": " + e.message);
  }

  // Report success
  console.log("");
  console.log("Registry created: " + registryPathArg);
  console.log("  schemaVersion: " + registry.schemaVersion);
  console.log("  registryId: " + registry.registryId);
  console.log("  entries: 1");
  console.log("  repo: " + registry.repo.name + " @" + registry.repo.branch);
  console.log("Verification: node scripts/pnpd-validate-schemas.mjs --product-delivery-registry " + registryPathArg);
  console.log("Full check: node scripts/pnpd-validate-schemas.mjs --product-delivery-registry " + registryPathArg + " --check-registry-artifacts --verify-registry-artifact-hashes");

  process.exit(0);
}

// ── Entry point ───────────────────────────────────────────────────────────────────

try {
  main();
} catch (error) {
  console.error("pnpd registry writer failed: " + error.message);
  process.exit(1);
}
