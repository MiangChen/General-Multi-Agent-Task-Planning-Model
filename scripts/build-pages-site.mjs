import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const siteDir = join(rootDir, "_site");

const publicPaths = ["index.html", "views", "notes", "data", "assets", "pdfs"];

async function copyPath(path) {
  await cp(join(rootDir, path), join(siteDir, path), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

await rm(siteDir, { recursive: true, force: true });
await mkdir(siteDir, { recursive: true });

for (const path of publicPaths) {
  await copyPath(path);
}

await writeFile(
  join(siteDir, "robots.txt"),
  [
    "User-agent: *",
    "Disallow: /",
    "",
  ].join("\n"),
  "utf8",
);

await writeFile(join(siteDir, ".nojekyll"), "", "utf8");

console.log(`Prepared GitHub Pages site at ${relative(rootDir, siteDir)}`);
console.log(`Included: ${publicPaths.join(", ")}`);
console.log("Excluded repository-only files such as AGENT_PROMPTS.md, papers/, topics/, findings/, and outputs/.");
