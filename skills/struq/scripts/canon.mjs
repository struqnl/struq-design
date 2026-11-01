#!/usr/bin/env node
// Struq canon: Struq's own palettes, type pairings and design systems, written into the project.
// This is what keeps a Struq build off the defaults every AI falls back on.
//
//   node <skill-dir>/scripts/canon.mjs list                 every palette, pairing, system and pack
//   node <skill-dir>/scripts/canon.mjs palette <slug>       writes the STRUQ TOKENS block in globals.css
//   node <skill-dir>/scripts/canon.mjs type <slug>          writes app/fonts.ts (Google or Fontshare)
//   node <skill-dir>/scripts/canon.mjs type --display "Fraunces" --body "Urbanist"
//   node <skill-dir>/scripts/canon.mjs system <slug>        prints the section order and its refs
//   add --dir <project> to run from elsewhere
//
// Public API, no account: https://struq.nl/api/assets?filter=palette|typography|design_system
// Node 18 or later, no dependencies. Google faces load through next/font/google (checked against the
// project's own next/font data); faces that are not on Google come from Fontshare as local woff2.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { googleName } from "./font-names.mjs";
import { appendLog } from "./log.mjs";

// STRUQ_API_BASE points a test run at another Struq environment (for example https://staging.struq.nl).
// Real users never set it: the default is production.
const API = `${(process.env.STRUQ_API_BASE || "https://struq.nl").replace(/\/+$/, "")}/api`;
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const root = resolve(opt("--dir") ?? process.cwd());
const [cmd, slugArg] = args.filter((a, i) => !a.startsWith("--") && !["--dir", "--display", "--body", "--accent"].includes(args[i - 1]));

// Struq's own rules win over a canon entry: these faces never ship (SKILL.md, the tell list).
const BANNED = new Set(["Inter", "Roboto", "Arial", "Helvetica", "Open Sans", "Poppins", "Montserrat", "Lato", "Geist", "Space Grotesk", "Geist Mono", "JetBrains Mono", "Space Mono", "IBM Plex Mono", "Roboto Mono"]);
// The text face that replaces a banned one, by the display face it sits under.
const BODY_FOR = { Fraunces: "Urbanist", Newsreader: "Manrope", Sora: "Instrument Sans", Syne: "Hanken Grotesk", Manrope: "Figtree" };
// Commercial faces in the canon, and their free stand-ins.
const STAND_IN = { "Neue Haas Grotesk Text": "General Sans", "Neue Haas Grotesk": "General Sans", "PP Neue Montreal": "General Sans", "Söhne": "General Sans", Canela: "Newsreader", "PP Editorial New": "Instrument Serif", "GT Sectra": "Fraunces" };

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.json();
}
async function canon(filter) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const d = await getJson(`${API}/assets?filter=${filter}&page=${page}`);
    all.push(...(d.items ?? []));
    if (!d.hasMore) break;
  }
  return all;
}

function parseOklch(v) {
  const m = String(v).match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (!m) return null;
  const L = m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  return { L, C: parseFloat(m[2]), H: parseFloat(m[3]) };
}
function hexLightness(v) {
  const m = String(v).match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}
const lightness = (v) => parseOklch(v)?.L ?? hexLightness(v) ?? 0.5;
const isCool = (v) => {
  const o = parseOklch(v);
  return o ? o.C > 0.06 && o.H >= 220 && o.H <= 320 : false;
};

/* ------------------------------------------------------------------ list */
async function list() {
  const [palettes, types, systems] = await Promise.all([canon("palette"), canon("typography"), canon("design_system")]);
  console.log(`PALETTES (${palettes.length}): slug, mood, ground, accent`);
  for (const p of palettes) {
    const c = p.data?.colors ?? {};
    const ground = lightness(c.background) > 0.5 ? "light" : "dark";
    const note = isCool(c.accent) ? "  (blue or purple accent: only for a brand that is that colour)" : "";
    console.log(`  ${p.slug.padEnd(38)} ${(p.data?.mood ?? "").padEnd(36)} ${ground.padEnd(6)}${note}`);
  }
  console.log(`\nPAIRINGS (${types.length}): slug, display + body as Struq builds them`);
  for (const t of types) {
    const plan = planType(t.data.display.name, t.data.body.name);
    console.log(`  ${t.slug.padEnd(28)} ${plan.display} + ${plan.body}${plan.notes.length ? `  (${plan.notes.join("; ")})` : ""}`);
  }
  console.log(`\nDESIGN SYSTEMS (${systems.length}): slug, section order`);
  for (const s of systems) console.log(`  ${s.slug.padEnd(22)} ${(s.data?.silhouette?.sectionOrder ?? []).join(" > ")}`);
  try {
    const packs = await getJson(`${API}/media/packs`);
    console.log(`\nBEELDBANK PACKS (${packs.packCount}): use with images.mjs`);
    for (const p of packs.packs) console.log(`  ${p.slug.padEnd(10)} ${p.description.slice(0, 100)}`);
  } catch (e) {
    console.log(`\nBEELDBANK: ${e.message}`);
  }
}

/* --------------------------------------------------------------- palette */
async function palette(slug) {
  const items = await canon("palette");
  const p = items.find((i) => i.slug === slug);
  if (!p) throw new Error(`Unknown palette "${slug}". Run: canon.mjs list`);
  const c = p.data.colors;
  const dark = lightness(c.background) < 0.5;
  const accentInk = lightness(c.accent) > 0.62 ? (dark ? c.background : c.text) : dark ? c.text : c.background;
  const cssPath = ["app/globals.css", "src/app/globals.css"].map((f) => join(root, f)).find(existsSync);
  if (!cssPath) throw new Error("No app/globals.css. Run recipes.mjs first.");
  let css = readFileSync(cssPath, "utf8");
  const weight = css.match(/--display-weight:\s*(\d{3})/)?.[1] ?? "300";
  const block = `:root {
  /* canon palette: ${p.slug} (${p.data.mood}) */
  --surface-0: ${c.background}; /* the page */
  --surface-1: ${c.surface}; /* one step: panels, the showpiece ground */
  --surface-2: color-mix(in oklch, var(--surface-1), var(--ink) ${dark ? 9 : 7}%); /* image wells, hover grounds */
  --surface-3: color-mix(in oklch, var(--surface-1), var(--ink) ${dark ? 18 : 16}%); /* hairline accents, never text */
  --ink: ${c.text};
  --ink-muted: color-mix(in oklch, var(--ink) ${dark ? 70 : 66}%, var(--surface-0)); /* secondary text */
  --accent: ${c.accent}; /* the one accent: the key CTA, one highlight per screen */
  --accent-ink: ${accentInk}; /* text on the accent */
  --accent-2: ${c.accentAlt ?? c.surface}; /* a second ground, never a second highlight colour */
  --line: color-mix(in oklch, var(--ink) 13%, transparent); /* hairlines */
  --on-photo: ${dark ? c.text : c.background}; /* type over a photo, with a scrim */
  /* the contrast scene: the palette's inverse and field roles when it has them, else text and ground swapped */
  --inverse: ${c.inverse ?? (dark ? c.surface : c.text)};
  --on-inverse: ${c.onInverse ?? c.inverseText ?? (dark ? c.text : c.background)};
  --field: ${c.field ?? c.accent};
  --on-field: ${c.onField ?? c.fieldText ?? accentInk};
  --display-weight: ${weight};
}`;
  const re = /(STRUQ TOKENS[\s\S]*?\*\/\s*):root\s*\{[\s\S]*?\n\}/;
  if (!re.test(css)) throw new Error(`No STRUQ TOKENS block in ${cssPath}. Run recipes.mjs, or merge the block from recipes/app/globals.css.`);
  css = css.replace(re, `$1${block}`);
  if (!css.includes("--color-accent-2")) css = css.replace("  --color-line: var(--line);", "  --color-line: var(--line);\n  --color-accent-2: var(--accent-2);");
  // Projects started before the contrast scene existed get its colour tokens too.
  if (!css.includes("--color-inverse")) {
    css = css.replace("  --color-line: var(--line);", "  --color-line: var(--line);\n  --color-inverse: var(--inverse);\n  --color-on-inverse: var(--on-inverse);\n  --color-field: var(--field);\n  --color-on-field: var(--on-field);");
  }
  writeFileSync(cssPath, css);
  console.log(`Wrote palette ${p.slug} to ${cssPath.replace(root, ".")}`);
  if (isCool(c.accent)) console.log('NOTE blue or purple accent: write "Cool hue: declared because <the brand colour>" in STRUQ.md, or pick a warmer palette.');
  console.log(`STRUQ.md line:  Palette: ${p.slug} (${p.data.mood})`);
  appendLog(root, "Step 4 Canon palette", [
    `canon.mjs wrote palette ${p.slug} (${p.data.mood}) into the STRUQ TOKENS block.`,
    `Ground ${dark ? "dark" : "light"}, accent ${c.accent}.${isCool(c.accent) ? " Blue or purple accent: needs a Cool hue declaration." : ""}`,
  ]);
  console.log("OK palette written");
}

/* ------------------------------------------------------------------ type */
function planType(display, body) {
  const notes = [];
  let d = display;
  let b = body;
  if (STAND_IN[d]) notes.push(`${d} is commercial, ${STAND_IN[d]} stands in`), (d = STAND_IN[d]);
  if (STAND_IN[b]) notes.push(`${b} is commercial, ${STAND_IN[b]} stands in`), (b = STAND_IN[b]);
  if (BANNED.has(d)) notes.push(`${d} is off the Struq list: pick another pairing`), (d = null);
  if (BANNED.has(b)) {
    const swap = BODY_FOR[d] ?? "Urbanist";
    notes.push(`${b} is off the Struq list, ${swap} replaces it`);
    b = swap;
  }
  return { display: d ?? "(none)", body: b, notes, ok: Boolean(d) };
}

function googleData() {
  const p = join(root, "node_modules", "next", "dist", "compiled", "@next", "font", "dist", "google", "font-data.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}

async function fontshare(name, weights) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const css = await fetch(`https://api.fontshare.com/v2/css?f[]=${slug}@${weights.join(",")}&display=swap`, { signal: AbortSignal.timeout(20000) }).then((r) => (r.ok ? r.text() : ""));
  const faces = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((m) => ({
    url: m[1].match(/url\('([^']+\.woff2)'\)/)?.[1],
    weight: m[1].match(/font-weight:\s*(\d+)/)?.[1],
    style: m[1].match(/font-style:\s*(\w+)/)?.[1] ?? "normal",
  })).filter((f) => f.url && f.weight);
  if (!faces.length) return null;
  const dir = join(root, existsSync(join(root, "src", "app")) ? "src/app" : "app", "fonts");
  mkdirSync(dir, { recursive: true });
  const src = [];
  for (const f of faces) {
    const file = `${slug}-${f.weight}${f.style === "italic" ? "-italic" : ""}.woff2`;
    const res = await fetch(f.url.startsWith("//") ? `https:${f.url}` : f.url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) continue;
    writeFileSync(join(dir, file), Buffer.from(await res.arrayBuffer()));
    src.push({ path: `./fonts/${file}`, weight: f.weight, style: f.style });
  }
  return src.length ? src : null;
}

async function faceCode(canonName, role, google) {
  const variable = `--face-${role}`;
  const id = role;
  // The canon's name ("Big Shoulders Display") may be listed by Google under its family ("Big Shoulders").
  const name = googleName(canonName, google) ?? canonName;
  const g = google?.[name];
  if (g) {
    const ident = name.replace(/\s+/g, "_");
    const parts = [`subsets: ["latin"]`];
    const italicOnly = role === "accent";
    if (!g.weights.includes("variable")) {
      const wanted = g.weights.filter((w) => ["300", "400", "500"].includes(w));
      parts.push(`weight: ${JSON.stringify(wanted.length ? wanted : [g.weights[0]])}`);
    }
    const axes = (g.axes ?? []).map((a) => a.tag).filter((t) => ["opsz", "SOFT"].includes(t));
    if (axes.length && g.weights.includes("variable")) parts.push(`axes: ${JSON.stringify(axes)}`);
    if (italicOnly && g.styles.includes("italic")) parts.push(`style: ["italic"]`);
    else if (role === "display" && g.styles.includes("italic")) parts.push(`style: ["normal", "italic"]`);
    parts.push(`variable: "${variable}"`, `display: "swap"`);
    const light = g.weights.includes("300") ? 300 : g.axes?.find((a) => a.tag === "wght")?.min <= 300 ? 300 : 400;
    return { kind: "google", id, ident, family: name, code: `export const ${id} = ${ident}({ ${parts.join(", ")} });`, light };
  }
  const local = await fontshare(canonName, role === "accent" ? ["400"] : ["300", "400", "500"]);
  if (local) {
    const light = local.some((s) => s.weight === "300") ? 300 : 400;
    const src = local.map((s) => `{ path: "${s.path}", weight: "${s.weight}", style: "${s.style}" }`).join(", ");
    return { kind: "local", id, family: canonName, code: `export const ${id} = localFont({ src: [${src}], variable: "${variable}", display: "swap" });`, light };
  }
  return null;
}

async function type(slug) {
  let display = opt("--display");
  let body = opt("--body");
  let accent = opt("--accent");
  let label = "custom";
  if (slug) {
    const items = await canon("typography");
    const t = items.find((i) => i.slug === slug);
    if (!t) throw new Error(`Unknown pairing "${slug}". Run: canon.mjs list`);
    display = t.data.display.name;
    body = t.data.body.name;
    accent = t.data.accent?.name;
    label = t.slug;
  }
  if (!display || !body) throw new Error('Usage: canon.mjs type <slug>, or type --display "Name" --body "Name" [--accent "Name"]');
  const plan = planType(display, body);
  for (const n of plan.notes) console.log(`NOTE ${n}`);
  if (!plan.ok) throw new Error("The display face is off the Struq list. Pick another pairing (canon.mjs list).");
  const google = googleData();
  if (!google) console.log("NOTE next is not installed here, so Google faces cannot be checked; install first for a sure result.");
  const d = await faceCode(plan.display, "display", google);
  const b = await faceCode(plan.body, "body", google);
  if (!d || !b) throw new Error(`Could not load ${!d ? plan.display : plan.body} from Google Fonts or Fontshare. Pick another pairing.`);
  // The italic accent: its own face when the canon names one apart from display and body; the
  // display face's italic otherwise (font-accent falls back to it in globals.css).
  const accentName = accent && !BANNED.has(accent) && accent !== plan.display && accent !== plan.body ? accent : null;
  const a = accentName ? await faceCode(accentName, "accent", google) : null;
  if (accentName && !a) console.log(`NOTE the accent face ${accentName} could not be loaded; the display italic carries the accent word.`);
  const faces = [d, b, a].filter(Boolean);
  const imports = [];
  const gIdents = faces.filter((f) => f.kind === "google").map((f) => f.ident);
  if (gIdents.length) imports.push(`import { ${[...new Set(gIdents)].join(", ")} } from "next/font/google";`);
  if (faces.some((f) => f.kind === "local")) imports.push(`import localFont from "next/font/local";`);
  const file = join(root, existsSync(join(root, "src", "app")) ? "src/app" : "app", "fonts.ts");
  writeFileSync(
    file,
    `// app/fonts.ts: written by the Struq skill (scripts/canon.mjs type). Pairing: ${label}, ${d.family} + ${b.family}${a ? `, accent ${a.family} italic` : ""}.
// Display and body, plus at most the one italic accent face. globals.css maps --face-display to
// font-display, --face-body to font-body and --face-accent to font-accent (the display italic when absent).
${imports.join("\n")}

${faces.map((f) => f.code).join("\n\n")}

/** Every face's CSS variable, for the <html> className in app/layout.tsx. */
export const fontVariables = [${faces.map((f) => f.id).join(", ")}].map((f) => f.variable).join(" ");
`,
  );
  const cssPath = ["app/globals.css", "src/app/globals.css"].map((f) => join(root, f)).find(existsSync);
  if (cssPath) {
    let css = readFileSync(cssPath, "utf8").replace(/--display-weight:\s*\d{3}/, `--display-weight: ${d.light}`);
    if (!css.includes("--font-accent")) {
      css = css.replace(/(\s*--font-body:[^\n]*\n)/, `$1  --font-accent: var(--face-accent, var(--face-display)), ui-serif, Georgia, serif;\n`);
    }
    writeFileSync(cssPath, css);
  }
  console.log(`Wrote ${file.replace(root, ".")}: ${d.family} (${d.kind}) + ${b.family} (${b.kind})${a ? ` + accent ${a.family} italic (${a.kind})` : ""}, display weight ${d.light}`);
  console.log(`STRUQ.md line:  Type: ${label}: ${d.family} + ${b.family}${a ? `, accent ${a.family}` : ""}`);
  appendLog(root, "Step 4 Canon type", [
    `canon.mjs wrote app/fonts.ts: ${d.family} (${d.kind}) over ${b.family} (${b.kind})${a ? `, accent ${a.family} italic` : ""}, pairing ${label}.`,
    `Display weight ${d.light}.${plan.notes.length ? ` Overrides: ${plan.notes.join("; ")}.` : ""}`,
  ]);
  console.log("OK type written");
}

/* ---------------------------------------------------------------- system */
async function system(slug) {
  const items = await canon("design_system");
  const s = items.find((i) => i.slug === slug);
  if (!s) throw new Error(`Unknown design system "${slug}". Run: canon.mjs list`);
  const order = s.data?.silhouette?.sectionOrder ?? [];
  console.log(`${s.slug}: ${order.join(" > ")}`);
  console.log(`refs: palette ${s.data.paletteRef}, typography ${s.data.typographyRef} (your own palette and type picks win when the brief fits them better)`);
  console.log("Struq adds to every order: the hero canvas in the hero, one showpiece at the act break, the designed footer.");
  console.log("proof and story-proof hold only real facts from the brief; faq only questions the brief answers. Drop a section that would need invented content.");
  console.log(`STRUQ.md line:  System: ${s.slug} (${order.join(" > ")})`);
  appendLog(root, "Step 2 Canon system", [`canon.mjs read design system ${s.slug}: ${order.join(" > ")}.`]);
  console.log("OK system read");
}

const run = { list, palette: () => palette(slugArg), type: () => type(slugArg), system: () => system(slugArg) }[cmd];
if (!run) {
  console.error("Usage: canon.mjs list | palette <slug> | type <slug> | system <slug>   [--dir <project>]");
  process.exit(2);
}
run().catch((e) => {
  console.error(`FAIL ${e.message}`);
  process.exitCode = 1;
});
