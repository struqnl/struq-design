#!/usr/bin/env node
// Struq recipes: copy the tested cinematic components into a Next.js App Router project.
//
//   node <skill-dir>/scripts/recipes.mjs                 run from the project root
//   node <skill-dir>/scripts/recipes.mjs --dir ./my-site
//   node <skill-dir>/scripts/recipes.mjs --force         overwrite recipe files you already have
//   node <skill-dir>/scripts/recipes.mjs --no-install    skip the npm install of missing packages
//
// Copies lib/gsap.ts and components/struq/* (SmoothScroll, SplitHeadline, Reveal, MediaFrame,
// HorizontalGallery, PinnedZoom, HeroCanvas with three scenes, MagneticButton, Cursor).
// On a fresh scaffold it also replaces app/globals.css, app/layout.tsx and adds app/fonts.ts with
// the Struq versions, and removes the starter SVGs. A layout or stylesheet you already wrote is
// never overwritten: the script tells you what to merge instead.
// Then it installs whatever is missing of gsap, @gsap/react, lenis, three and @types/three.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { appendLog } from "./log.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const RECIPES = join(here, "..", "recipes");
const args = process.argv.slice(2);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const root = resolve(flagValue("--dir") ?? process.cwd());
const force = args.includes("--force");
const install = !args.includes("--no-install");

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error(`FAIL no package.json in ${root}. Scaffold first: npx create-next-app@latest . --ts --tailwind --app --eslint --yes`);
  process.exit(2);
}
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
if (!deps.next) {
  console.error("FAIL this is not a Next.js project. The recipes target Next.js App Router; for Vite read references/stack-targets.md.");
  process.exit(2);
}

const src = existsSync(join(root, "src", "app")) ? "src" : "";
const appDir = join(root, src, "app");
const at = (...p) => join(root, src, ...p);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const copied = [];
const kept = [];
function place(from, to, { overwrite = force } = {}) {
  if (existsSync(to) && !overwrite) {
    kept.push(relative(root, to));
    return;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied.push(relative(root, to));
}

// 1. The components and the GSAP registry: always ours.
place(join(RECIPES, "lib", "gsap.ts"), at("lib", "gsap.ts"));
for (const file of walk(join(RECIPES, "components", "struq"))) {
  place(file, at("components", "struq", relative(join(RECIPES, "components", "struq"), file)));
}

// 2. The app shell: only over a starter file, never over work.
const notes = [];
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const layoutPath = join(appDir, "layout.tsx");
const layout = read(layoutPath);
if (!layout || /Create Next App|Geist/.test(layout) || force) {
  place(join(RECIPES, "app", "layout.tsx"), layoutPath, { overwrite: true });
} else if (!layout.includes("SmoothScroll")) {
  notes.push("app/layout.tsx is your own: wrap {children} in <SmoothScroll>, add <Cursor />, the `js` class script and the font variables (see the recipe in recipes/app/layout.tsx).");
}
const cssPath = join(appDir, "globals.css");
const css = read(cssPath);
if (!css || (!css.includes("STRUQ TOKENS") && /--background|--foreground|Arial|prefers-color-scheme/.test(css)) || force) {
  place(join(RECIPES, "app", "globals.css"), cssPath, { overwrite: true });
} else if (!css.includes("STRUQ TOKENS")) {
  notes.push("app/globals.css is your own: merge the STRUQ TOKENS block, the @theme roles and the STRUQ MOTION GATE from recipes/app/globals.css.");
}
place(join(RECIPES, "app", "fonts.ts"), join(appDir, "fonts.ts"));

for (const starter of ["next.svg", "vercel.svg", "file.svg", "globe.svg", "window.svg"]) {
  const p = join(root, "public", starter);
  if (existsSync(p)) rmSync(p);
}

// 3. The alias every recipe imports through.
const tsconfig = read(join(root, "tsconfig.json"));
if (tsconfig && !tsconfig.includes('"@/*"')) {
  notes.push('tsconfig.json has no "@/*" path alias: add "paths": { "@/*": ["./' + (src ? "src/" : "") + '*"] } under compilerOptions.');
}

// 4. Packages.
const need = ["gsap", "@gsap/react", "lenis", "three"].filter((d) => !deps[d]);
const needDev = ["@types/three"].filter((d) => !deps[d]);
const run = (list, dev) => {
  if (!list.length) return true;
  const cmd = `npm install ${dev ? "-D " : ""}${list.join(" ")}`;
  if (!install) {
    notes.push(`Run: ${cmd}`);
    return true;
  }
  console.log(`> ${cmd}`);
  const r = spawnSync(cmd, { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) notes.push(`The install failed. Run it yourself: ${cmd}`);
  return r.status === 0;
};
run(need, false);
run(needDev, true);

console.log(`\nCopied ${copied.length} file(s):`);
for (const f of copied) console.log(`  ${f}`);
if (kept.length) console.log(`Kept ${kept.length} existing file(s) (use --force to replace): ${kept.join(", ")}`);
for (const n of notes) console.log(`NOTE ${n}`);
console.log("\nNext: set the palette in globals.css (STRUQ TOKENS), the two faces in app/fonts.ts, the title in app/layout.tsx.");
appendLog(root, "Step 3 Recipes", [
  `recipes.mjs copied ${copied.length} file(s), kept ${kept.length}.`,
  ...(notes.length ? [`Notes: ${notes.join(" ")}`] : []),
]);
console.log("OK recipes ready");
