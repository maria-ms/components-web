import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const registryPath = path.join(packageRoot, "src", "figma-registry.json");
const packagePath = path.join(packageRoot, "package.json");

function fail(message) {
  throw new Error(`figma-registry: ${message}`);
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    fail(`could not parse ${path.relative(packageRoot, filePath)}: ${error.message}`);
  }
}

const registryRaw = await readFile(registryPath, "utf8");
let registry;
try {
  registry = JSON.parse(registryRaw);
} catch (error) {
  fail(`could not parse ${path.relative(packageRoot, registryPath)}: ${error.message}`);
}
const packageJson = await readJson(packagePath);

if (registry.$schema !== "./figma-registry.schema.json") {
  fail('expected "$schema" to be "./figma-registry.schema.json"');
}
if (registry.version !== 1) {
  fail("expected version 1");
}
if (typeof registry.figmaFileKey !== "string" || registry.figmaFileKey.length === 0) {
  fail("figmaFileKey must be a non-empty string");
}
if (
  registry.byFigmaComponentKey === null ||
  typeof registry.byFigmaComponentKey !== "object" ||
  Array.isArray(registry.byFigmaComponentKey)
) {
  fail("byFigmaComponentKey must be an object");
}

const entries = Object.entries(registry.byFigmaComponentKey);
if (entries.length === 0) {
  fail("byFigmaComponentKey must not be empty");
}

const serializedKeys = [...registryRaw.matchAll(/"([a-f0-9]{40})"\s*:/g)].map(
  (match) => match[1]
);
if (new Set(serializedKeys).size !== serializedKeys.length) {
  fail("duplicate Figma component keys in JSON source");
}
if (serializedKeys.length !== entries.length) {
  fail("byFigmaComponentKey must remain a flat key-to-suffix mapping");
}

const seenKeys = new Set();
const targets = new Set();

for (const [figmaComponentKey, target] of entries) {
  if (!/^[a-f0-9]{40}$/.test(figmaComponentKey)) {
    fail(`invalid Figma component key "${figmaComponentKey}"`);
  }
  if (seenKeys.has(figmaComponentKey)) {
    fail(`duplicate Figma component key "${figmaComponentKey}"`);
  }
  seenKeys.add(figmaComponentKey);

  if (typeof target !== "string" || !/^[a-z][a-z0-9-]*$/.test(target)) {
    fail(`invalid package export suffix for "${figmaComponentKey}"`);
  }

  const exportKey = `./${target}`;
  const exportPath = packageJson.exports?.[exportKey];
  if (typeof exportPath !== "string") {
    fail(`missing package export "${exportKey}"`);
  }

  const sourcePath = path.resolve(packageRoot, exportPath);
  try {
    await access(sourcePath);
  } catch {
    fail(`export "${exportKey}" points to a missing source module`);
  }

  const contractPath = path.join(path.dirname(sourcePath), "contract.yaml");
  try {
    await access(contractPath);
  } catch {
    fail(`export "${exportKey}" has no colocated contract.yaml`);
  }

  targets.add(target);
}

console.log(
  `figma-registry: ${entries.length} Figma keys map to ${targets.size} package exports`
);
