import { lstat, readlink, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = resolve(packageDirectory, "skills");
const destinationDirectory = resolve(homedir(), ".codex", "skills");
const skills = [
  "create-figma-component-page",
  "implement-figma-web-component",
];

for (const skill of skills) {
  const source = resolve(sourceDirectory, skill);
  const destination = resolve(destinationDirectory, skill);

  try {
    const existing = await lstat(destination);

    if (!existing.isSymbolicLink()) {
      throw new Error(`Refusing to remove non-symlink: ${destination}`);
    }

    const target = resolve(dirname(destination), await readlink(destination));
    if (target !== source) {
      throw new Error(`Refusing to remove a symlink not owned by this package: ${destination}`);
    }

    await unlink(destination);
    console.log(`Unlinked: ${skill}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`Not linked: ${skill}`);
      continue;
    }
    throw error;
  }
}
