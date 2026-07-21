import { lstat, mkdir, readlink, symlink, unlink } from "node:fs/promises";
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

await mkdir(destinationDirectory, { recursive: true });

for (const skill of skills) {
  const source = resolve(sourceDirectory, skill);
  const destination = resolve(destinationDirectory, skill);

  try {
    const existing = await lstat(destination);

    if (!existing.isSymbolicLink()) {
      throw new Error(`Refusing to replace non-symlink: ${destination}`);
    }

    const target = resolve(dirname(destination), await readlink(destination));
    if (target === source) {
      console.log(`Already linked: ${skill}`);
      continue;
    }

    await unlink(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  await symlink(source, destination, process.platform === "win32" ? "junction" : "dir");
  console.log(`Linked: ${skill}`);
}
