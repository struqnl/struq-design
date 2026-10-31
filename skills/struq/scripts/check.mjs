#!/usr/bin/env node
// Struq self-check: run it from the project root before you report a build as done.
//
//   node <skill-dir>/scripts/check.mjs
//   node <skill-dir>/scripts/check.mjs --dir ./my-site
//
// It needs no browser and no dependencies. It reads the source and the public folder and prints
// PASS, WARN or FAIL per check, in four groups: images, AI tells, the motion floor, typography,
// plus the plan in STRUQ.md. Every FAIL names the file and line and the fix. Exit code 1 while any
// FAIL remains. Fix, run again, and only report done on "RESULT: PASS".
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const args = process.argv.slice(2);
const dirFlag = args.indexOf("--dir");
const root = resolve(dirFlag >= 0 ? args[dirFlag + 1] : process.cwd());

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "out", "dist", "build", ".turbo", ".vercel", "public", ".claude", ".agents", ".cursor", "coverage"]);
const CODE_EXT = /\.(tsx|ts|jsx|js|mjs|css|mdx)$/;

function walk(dir, acc = []) {
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of names) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, acc);
    else if (CODE_EXT.test(name) && !/\.(config|d)\.(ts|js|mjs)$/.test(name) && !name.endsWith(".d.ts")) acc.push(full);
  }
  return acc;
}

const rel = (p) => relative(root, p).split(sep).join("/");
const isRecipe = (p) => /(^|\/)components\/struq\/|(^|\/)lib\/(gsap|struq-images)\.ts$/.test(rel(p));
const files = walk(root)
  .filter((p) => !/^(scripts|test|tests|e2e)\//.test(rel(p)))
  .map((p) => ({ path: p, rel: rel(p), recipe: isRecipe(p), text: readFileSync(p, "utf8") }));
const own = files.filter((f) => !f.recipe);
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");

const results = [];
const add = (group, status, message, where = []) => results.push({ group, status, message, where });

/** Every non-comment line matching a pattern, as "file:line  snippet". */
function hits(pattern, { scope = files, exclude = null } = {}) {
  const out = [];
  for (const f of scope) {
    const lines = f.text.split(/\r?\n/);
    lines.forEach((line, i) => {
      const t = line.trim();
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*") || t.startsWith("{/*")) return;
      if (pattern.test(line) && !(exclude && exclude.test(line))) {
        out.push(`${f.rel}:${i + 1}  ${t.slice(0, 120)}`);
      }
    });
  }
  return out;
}
const uses = (pattern) => own.some((f) => pattern.test(f.text));

function isImageFile(path) {
  try {
    const buf = readFileSync(path);
    if (buf.length < 8000) return false;
    const a = (s, e) => buf.subarray(s, e).toString("latin1");
    return (
      (a(0, 4) === "RIFF" && a(8, 12) === "WEBP") ||
      (buf[0] === 0xff && buf[1] === 0xd8) ||
      (buf[0] === 0x89 && a(1, 4) === "PNG") ||
      a(4, 12) === "ftypavif"
    );
  } catch {
    return false;
  }
}

if (!existsSync(join(root, "package.json"))) {
  console.error(`FAIL no package.json in ${root}. Run from the project root or pass --dir.`);
  process.exit(2);
}
const pkg = JSON.parse(read("package.json"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const plan = read("STRUQ.md");

/* ------------------------------------------------------------------ IMAGES */
{
  const G = "IMAGES";
  const libFile = ["lib/struq-images.ts", "src/lib/struq-images.ts"].find((p) => existsSync(join(root, p)));
  const pub = join(root, "public");
  const listPublic = (dir, acc = []) => {
    if (!existsSync(dir)) return acc;
    for (const n of readdirSync(dir)) {
      const full = join(dir, n);
      if (statSync(full).isDirectory()) listPublic(full, acc);
      else if (/\.(webp|jpe?g|png|avif|svg)$/i.test(n)) acc.push(full);
    }
    return acc;
  };
  const all = listPublic(pub);
  const realPhotos = all.filter((p) => !p.endsWith(".svg") && isImageFile(p));
  const brokenPhotos = all.filter((p) => !p.endsWith(".svg") && !isImageFile(p));

  if (libFile) {
    const mod = read(libFile);
    const srcs = [...mod.matchAll(/src: "([^"]+)"/g)].map((m) => m[1]);
    const missing = srcs.filter((s) => !existsSync(join(pub, s)));
    const plates = srcs.filter((s) => s.endsWith(".svg"));
    const pack = mod.match(/imagePack = "([^"]+)"/)?.[1] ?? "?";
    if (missing.length) add(G, "FAIL", `${missing.length} image(s) in ${libFile} are not on disk. Run images.mjs ${pack} again.`, missing);
    else if (plates.length === srcs.length) add(G, "WARN", `struq.nl was unreachable: all ${srcs.length} images are fallback plates. Run images.mjs ${pack} again when online.`);
    else if (plates.length) add(G, "WARN", `${plates.length} fallback plate(s) among the pack images. Run images.mjs ${pack} again when online.`, plates);
    else add(G, "PASS", `${srcs.length} beeldbank images from pack "${pack}", each a verified image file`);
  } else if (realPhotos.length >= 3) {
    add(G, "PASS", `${realPhotos.length} image files of the project's own in public/`);
  } else {
    add(G, "FAIL", "No images. Run: node <skill-dir>/scripts/images.mjs <pack-slug> (the pack table is in SKILL.md). The images are free and CC0: no permission needed.");
  }
  if (brokenPhotos.length) add(G, "FAIL", "These image files are not real images (an error page saved as .webp?). Delete them and run images.mjs again.", brokenPhotos.map(rel));

  // Each pack reference (images.card[2], images.card.slice(0, 5)) or own image tag counts once.
  const used = own.reduce((n, f) => n + (f.text.match(/images\.(hero|band|card|column|detail|backdrop)\b|<img\b|src=["'{`]\/images\//g) ?? []).length, 0);
  if (used >= 4) add(G, "PASS", `${used} image placements in the page code`);
  else add(G, "FAIL", `Only ${used} image placement(s). A Struq site carries a hero image and at least three more: use <MediaFrame image={images.card[0]} />.`);

  const localSrc = [];
  for (const f of own) {
    for (const m of f.text.matchAll(/(?:src=|src:\s*)["'`](\/[^"'`?#]+\.(?:webp|jpe?g|png|avif|svg|gif))["'`]/g)) {
      if (!existsSync(join(pub, m[1]))) localSrc.push(`${f.rel}  ${m[1]}`);
    }
  }
  if (localSrc.length) add(G, "FAIL", "Image paths that point at no file in public/:", localSrc);

  const placeholders = hits(
    /\b(Image|Media|Photo|Img)?Placeholder\b|Planned image|placehold\.co|via\.placeholder|picsum\.photos|source\.unsplash|nog te fotograferen|te maken:|foto volgt|beeld volgt|to be shot|image coming soon|photo coming soon/i,
    { scope: own, exclude: /placeholder=["'{]/ },
  );
  const emptyFrames = hits(/<(div|figure|span)\b[^>]*(aspect-|aspectRatio)[^>]*(\/>|>\s*<\/(div|figure|span)>)/, { scope: own });
  const hotlinks = hits(/https?:\/\/(www\.)?struq\.nl\/media\//, { scope: own });
  if (placeholders.length || emptyFrames.length) {
    add(G, "FAIL", "Placeholder or empty frames. A Struq site never ships an empty frame: put a MediaFrame with a pack image in each.", [...placeholders, ...emptyFrames]);
  } else add(G, "PASS", "No placeholder or empty image frames");
  if (hotlinks.length) add(G, "FAIL", "Hotlinked struq.nl images: download them with images.mjs and use the local /images/ path.", hotlinks);

  const credit = uses(/imageCredit|struq\.nl\/beeldbank/);
  if (libFile && !credit) add(G, "WARN", "No image credit. Put imageCredit (\"Beeld: Struq\") in the footer as one quiet text-small link.");
}

/* ------------------------------------------------------------------- TELLS */
// The combined tell list: Struq's tells (StruqVisual lib/consistentie/tells.ts), the deck-slop-audit
// patterns and Roy's own rules, as one list. references/anti-patterns.md has the why and the fix for
// each; this is its executable form. FAIL blocks done; WARN asks for a look.
{
  const G = "TELLS";
  const tell = (name, pattern, fix, opts = {}) => {
    const found = hits(pattern, opts);
    if (found.length) add(G, opts.warn ? "WARN" : "FAIL", `${name}: ${fix}`, found);
    else if (!opts.quietPass) add(G, "PASS", `No ${name.toLowerCase()}`);
  };
  const ownOnly = { scope: own };

  // Type and labels
  tell("Eyebrows and uppercase labels", /\buppercase\b|text-transform:\s*uppercase|\b(eyebrow|kicker|overline)\b/i,
    "small uppercase labels above headings, uppercase marquees and tracked caps are AI tells. Delete the label; the heading, a hairline rule or a jump in scale does the wayfinding.");
  tell("Monospace as a design face", /font-mono|monospace|_Mono\b|\bMono\(|JetBrains|Fira_Code|Space_Mono/,
    "mono is for literal code only. Labels, stats and dates use the text face with tabular-nums.", { exclude: /<(code|pre)\b/ });
  tell("Default faces", /(next\/font|font-family|--font-|--face-|import\s*\{)[^\n]*\b(Inter|Roboto|Arial|Helvetica|Open[ _]Sans|Poppins|Montserrat|Lato|Geist|Space[ _]Grotesk)\b/,
    "set a canon or SKILL.md pairing with canon.mjs type (Inter, Roboto, Arial, Geist and friends read as nobody chose).");
  tell("Heavy display", /(<h1|<h2|font-display|text-display|text-h2|SplitHeadline)[^\n]*font-(bold|extrabold|black|semibold)|font-(bold|extrabold|black|semibold)[^\n]*(<h1|<h2|font-display|text-display|text-h2)/,
    "display runs light (300 to 400); hierarchy from scale, not weight.");
  tell("Numbered sections", />\s*0[1-9]\s*[<./]|['"`]0[1-9]['"`]|`0\$\{/,
    "01, 02, 03 stamped on sections or rows is a tell; keep at most one deliberate oversized numeral.", ownOnly);
  tell("Raw text sizes", /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/, "use the role tokens: text-display, text-h2, text-h3, text-lead, text-body, text-small.", { ...ownOnly, warn: true, quietPass: true });
  tell("Breakpoint size ladders", /text-\w+\s+md:text-\w+\s+lg:text-\w+|p[xy]-\d+\s+md:p[xy]-\d+\s+lg:p[xy]-\d+/, "one fluid root-rem knob; breakpoints change layout, never size.", { ...ownOnly, warn: true, quietPass: true });

  // Colour and surface
  tell("Gradients", /bg-gradient-|bg-linear-|bg-radial|bg-conic|(linear|radial|conic)-gradient\(|\b(from|via|to)-(?!transparent\b)[a-z]+-\d{1,3}\b/,
    "flat surface steps (bg-surface-1, bg-surface-2) and a hairline; never a gradient.", { exclude: /mask/i });
  tell("Gradient text", /bg-clip-text|background-clip:\s*text/, "headlines are ink; hierarchy comes from scale.");
  tell("Tinted translucent fills and glass", /backdrop-blur|backdrop-filter|\bbg-(accent|white|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|surface-\d)(-\d+)?\/\d+/,
    "an opaque surface step. A flat black scrim over a photo is the only translucent fill.");
  tell("Status badges", /\bbg-(green|red|blue|yellow|emerald|amber|lime|sky)-(50|100|200)\b/, "no pastel status chips; say it in the copy.");
  tell("Pills", /rounded-full[^"'`]*\bpx-|\bpx-[^"'`]*rounded-full/, "buttons and labels take the site radius (0 to 4px), never a pill.");
  tell("Live dots", /animate-(ping|pulse)/, "no pulsing dot, above all not in a pill.");
  tell("Blue and purple utilities", /\b(text|bg|border|fill|stroke|ring|outline|decoration|shadow|accent)-(blue|indigo|violet|purple|fuchsia|sky)-\d/,
    "the palette tokens carry every colour; blue and purple only when the brand is that, declared in STRUQ.md.");
  tell("Drop-shadow elevation", /\bshadow-(md|lg|xl|2xl)\b/, "elevation is a tonal surface step plus a hairline.");
  tell("Side-stripe borders", /\bborder-[lr]-([2-9]|\[[2-9])/, "no coloured stripe down a card edge; a hairline or nothing.");

  // Layout and motion
  tell("Identical card grids", /grid-cols-3\b/, "three equal cards in a row read as a template; asymmetric 5/7 splits or hairline rows.", { ...ownOnly, warn: true, quietPass: true });
  tell("Uniform section padding", /\bpy-(16|24)\b/, "padding varies by role (dense 6 to 8rem, breathers 12 to 20rem).", { ...ownOnly, warn: true, quietPass: true });
  tell("Opacity-only entrances", /initial=\{\{\s*opacity:\s*0\s*\}\}|whileInView=\{\{\s*opacity:[^,}]*\}\}/, "every entrance moves AND fades: <Reveal>, or y with autoAlpha.");
  tell("Uniform hovers", /hover:scale-1\d\d\b|transition-all\b/, "one designed hover per element type; never scale-105 plus transition-all on everything.", { ...ownOnly, warn: true, quietPass: true });
  tell("Single-layer parallax", /background-attachment:\s*fixed|\bbg-fixed\b/, "depth needs relative rates: MediaFrame parallax inside its frame.");
  tell("anticipatePin with smooth scroll", /anticipatePin/, "remove it; scrub: 1. With Lenis it jerks the pin on engage.");

  // Icons and content
  tell("Cliche icons and emoji", /<(Sparkles|Rocket|Zap|Lightbulb|Wand|Flame)\b|\b(Sparkles|Rocket|Zap)Icon\b|[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, "no emoji, no sparkle, rocket, lightning, bulb, wand or flame icons.");
  tell("Filler content", /Lorem ipsum|\bAcme\b|John Doe|Jane Doe|SITE_TITLE|SITE_DESCRIPTION|Your journey starts here/i, "real copy for the brief; replace the layout's SITE_TITLE and SITE_DESCRIPTION.");
  tell("Dashes", /[\u2012\u2013\u2014\u2015\u2E3A\u2E3B]|&(mdash|ndash|horbar);|&#(821[0-3]);|&#x201[2-5];/i,
    "em and en dashes read as machine-written copy. Restructure the sentence: a comma, a colon, a full stop, or \"to\" for a range.");
  tell("Generic CTAs", />\s*(Learn more|Get started|Read more|Click here|Discover more|Find out more|Join now|Lees meer|Meer weten|Klik hier|Ontdek meer)\s*</i, "a verb and the thing: \"Reserveer een tafel\", \"Bekijk de projecten\".", { ...ownOnly, warn: true, quietPass: true });
  tell("Generic section headings", />\s*(Features|About Us|Our Services|Why Choose Us|What We Do|Our Story|Capabilities|Onze diensten|Over ons|Waarom kiezen voor ons)\s*</i, "a heading that says something only this business could say.", { ...ownOnly, warn: true, quietPass: true });
  tell("Hype copy", /\b(Unleash|Supercharge|Next-?gen|Seamless|Elevate your|Revolutioni[sz]e|Game-?changer|Cutting-?edge|State-of-the-art|Unparalleled|Next-level|Turbocharge|naadloos|ontgrendel|revolutionair|toekomstbestendig)\b/i, "plain, specific claims from the brief.", { ...ownOnly, warn: true, quietPass: true });

  // Palette hues: blue and purple only when STRUQ.md declares it. Hex and oklch() tokens.
  const css = files.filter((f) => f.rel.endsWith(".css")).map((f) => f.text).join("\n");
  const coolDeclared = /cool hue:\s*declared/i.test(plan);
  const cool = [];
  for (const m of css.matchAll(/--(?:color-)?(surface-\d|ink|ink-muted|accent|accent-ink|accent-2)\s*:\s*(#[0-9a-f]{6}\b|oklch\([^)]*\))/gi)) {
    const v = m[2];
    const o = v.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/i);
    if (o) {
      const L = o[2] ? parseFloat(o[1]) / 100 : parseFloat(o[1]);
      const C = parseFloat(o[3]);
      const H = parseFloat(o[4]);
      if (C > 0.06 && H >= 220 && H <= 320 && L > 0.12 && L < 0.92) cool.push(`--${m[1]}: ${v}`);
      continue;
    }
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) continue;
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    if (h >= 200 && h <= 320 && s > 0.3 && l > 0.12 && l < 0.88) cool.push(`--${m[1]}: ${v} (hue ${Math.round(h)})`);
  }
  // Purple or blue written straight into components, outside the tokens.
  for (const f of own.filter((x) => !x.rel.endsWith(".css"))) {
    for (const m of f.text.matchAll(/#([0-9a-f]{6})\b/gi)) {
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      if (d < 0.25) continue;
      let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
      if (h >= 220 && h <= 320) cool.push(`${f.rel}: #${m[1]} (hue ${Math.round(h)})`);
    }
  }
  if (cool.length && !coolDeclared) add(G, "FAIL", "Blue or purple in the palette. Pick a canon palette that fits (canon.mjs list), or write \"Cool hue: declared because <the brand's own colour>\" in STRUQ.md.", cool);
  else add(G, "PASS", cool.length ? "Cool hue declared in STRUQ.md" : "Palette free of default blue and purple");
}

/* ------------------------------------------------------------------ MOTION */
{
  const G = "MOTION";
  const all = files.map((f) => f.text).join("\n");
  const missing = ["gsap", "lenis"].filter((d) => !deps[d]);
  if (!deps.three && !deps["@react-three/fiber"]) missing.push("three");
  if (missing.length) add(G, "FAIL", `Missing packages: npm install ${missing.join(" ")}`);
  else add(G, "PASS", "gsap, lenis and three installed");

  const lenis = /new Lenis\(|ReactLenis/.test(all) && /gsap\.ticker\.add/.test(all) && /lagSmoothing\(0\)/.test(all);
  const mounted = files.some((f) => /(^|\/)app\/layout\.(tsx|jsx)$/.test(f.rel) && /<SmoothScroll|<ReactLenis/.test(f.text));
  if (lenis && mounted) add(G, "PASS", "Lenis smooth scroll on the GSAP ticker, mounted in the layout");
  else add(G, "FAIL", lenis ? "Lenis is not mounted: wrap {children} in <SmoothScroll> in app/layout.tsx." : "No Lenis on gsap.ticker: run recipes.mjs and mount <SmoothScroll> in app/layout.tsx.");

  if (uses(/<SplitHeadline\b|SplitText\.create|new SplitText/)) add(G, "PASS", "SplitText on the headline");
  else add(G, "FAIL", "The hero headline is not split: set it with <SplitHeadline as=\"h1\">.");

  const reveals = own.reduce((n, f) => n + (f.text.match(/<Reveal\b/g) ?? []).length, 0);
  const masks = uses(/<MediaFrame\b|clipPath|clip-path:\s*inset/);
  if (reveals >= 2 && masks) add(G, "PASS", `Masked image reveals and ${reveals} staggered text reveals`);
  else add(G, "FAIL", `Scroll reveals below the floor (${reveals} <Reveal>, masked images: ${masks ? "yes" : "no"}). Wrap text groups in <Reveal> and every image in <MediaFrame>.`);

  if (uses(/<HorizontalGallery\b|<PinnedZoom\b/) || own.some((f) => /pin:\s*(true|[a-zA-Z"'])/.test(f.text) && /scrub/.test(f.text))) add(G, "PASS", "A pinned or horizontal showpiece");
  else add(G, "FAIL", "No showpiece: place one <HorizontalGallery> or <PinnedZoom> at the act break.");

  const ownGl = own.filter((f) => /WebGLRenderer|<Canvas\b/.test(f.text));
  if (uses(/<HeroCanvas\b/)) add(G, "PASS", "WebGL hero layer (HeroCanvas: poster, DPR cap, reduced motion, pause offscreen)");
  else if (ownGl.length) {
    const t = ownGl.map((f) => f.text).join("\n");
    const gaps = [];
    if (!/setPixelRatio\(\s*Math\.min|dpr=\{?\[/.test(t)) gaps.push("a DPR cap (Math.min(devicePixelRatio, 1.75))");
    if (!/prefers-reduced-motion/.test(t)) gaps.push("a reduced-motion still frame");
    if (!/poster|<Image\b|<img\b|fallback/i.test(t)) gaps.push("a poster behind the canvas");
    if (gaps.length) add(G, "FAIL", `The custom WebGL layer is missing ${gaps.join(", ")}. Or build it inside HeroCanvas as a scene.`, ownGl.map((f) => f.rel));
    else add(G, "PASS", "Custom WebGL hero layer with poster, DPR cap and reduced motion");
  } else add(G, "FAIL", "No WebGL hero layer: put <HeroCanvas scene=\"contours\" /> (or ripple, dots, or the MCP background) behind the hero.");

  if (/prefers-reduced-motion/.test(all)) add(G, "PASS", "prefers-reduced-motion respected");
  else add(G, "FAIL", "Nothing reads prefers-reduced-motion.");

  if (uses(/<MagneticButton\b|<Cursor\b|quickTo/)) add(G, "PASS", "Pointer layer (magnetic CTA or cursor)");
  else add(G, "WARN", "No magnetic CTA or custom cursor. Use <MagneticButton> for the primary CTA unless the genre is a utility.");
}

/* -------------------------------------------------------------------- TYPE */
{
  const G = "TYPE";
  const fams = new Set();
  for (const f of files) {
    for (const m of f.text.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g)) {
      m[1].split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => fams.add(s));
    }
    if (/from\s*["']next\/font\/local["']/.test(f.text)) {
      for (const m of f.text.matchAll(/(\w+)\s*=\s*localFont\(/g)) fams.add(`local:${m[1]}`);
    }
  }
  if (fams.size === 2) add(G, "PASS", `Two faces: ${[...fams].join(" + ")}`);
  else if (fams.size === 1) add(G, "WARN", `One face (${[...fams][0]}). Two faces (display and text) unless STRUQ.md declares a one-family system.`);
  else if (fams.size === 0) add(G, "FAIL", "No web fonts loaded: set the pairing in app/fonts.ts with next/font.");
  else add(G, "FAIL", `${fams.size} faces loaded (${[...fams].join(", ")}). Exactly two: one display, one text.`);

  const css = files.filter((f) => f.rel.endsWith(".css")).map((f) => f.text).join("\n");
  const weight = css.match(/--display-weight:\s*(\d{3})/)?.[1];
  if (weight && Number(weight) <= 400) add(G, "PASS", `Display runs light (${weight})`);
  else if (weight) add(G, "FAIL", `Display weight ${weight}: run it at 300 (400 for a face without a 300).`);
  else if (uses(/font-(light|extralight|thin)/)) add(G, "PASS", "Display runs light");
  else add(G, "WARN", "No light display weight found (--display-weight: 300 in globals.css).");

  if (/html\s*\{[^}]*font-size:\s*clamp\(/.test(css)) add(G, "PASS", "One fluid root-rem knob");
  else add(G, "FAIL", "No fluid root font size: html { font-size: clamp(1rem, 0.92rem + 0.2vw, 1.125rem); }");

  if (/--text-display/.test(css) && uses(/text-display/)) add(G, "PASS", "Display role token in use");
  else add(G, "FAIL", "The headline does not use the display role: font-display text-display.");

  const h1 = own.reduce((n, f) => n + (f.text.match(/<h1\b|<SplitHeadline(?![^>]*as=["'](h2|h3|p)["'])[^>]*>/g) ?? []).length, 0);
  if (h1 >= 1) add(G, "PASS", "The page has its h1");
  else add(G, "FAIL", "No h1 on the page.");
}

/* -------------------------------------------------------------------- PLAN */
{
  const G = "PLAN";
  if (!plan) add(G, "FAIL", "No STRUQ.md in the project root: write the plan and the Build checklist (SKILL.md).");
  else {
    const open = plan.split(/\r?\n/).filter((l) => /^\s*[-*]\s*\[\s\]/.test(l) && !/check\.mjs/.test(l));
    const done = plan.split(/\r?\n/).filter((l) => /^\s*[-*]\s*\[[xX]\]/.test(l)).length;
    if (open.length) add(G, "FAIL", `${open.length} Build checklist item(s) not ticked in STRUQ.md. Do them, then tick them.`, open.map((l) => l.trim()));
    else if (done >= 8) add(G, "PASS", `Build checklist ticked (${done} items)`);
    else add(G, "FAIL", "STRUQ.md has no Build checklist: copy it from SKILL.md and tick each step as you finish it.");
    const need = ["Palette", "Type", "System", "Images"].filter((k) => !new RegExp(`^${k}:\\s*\\S`, "mi").test(plan));
    if (need.length) add(G, "FAIL", `STRUQ.md does not record the canon picks: ${need.map((k) => `${k}:`).join(", ")} (canon.mjs prints each line).`);
    else add(G, "PASS", "Canon picks recorded (palette, type, system, images)");
  }
}

/* ------------------------------------------------------------------ REPORT */
const order = ["IMAGES", "TELLS", "MOTION", "TYPE", "PLAN"];
console.log(`Struq check: ${root}\n`);
for (const g of order) {
  const rows = results.filter((r) => r.group === g);
  if (!rows.length) continue;
  console.log(g);
  for (const r of rows) {
    console.log(`  ${r.status.padEnd(4)}  ${r.message}`);
    for (const w of r.where.slice(0, 8)) console.log(`          ${w}`);
    if (r.where.length > 8) console.log(`          ... and ${r.where.length - 8} more`);
  }
  console.log("");
}
const fails = results.filter((r) => r.status === "FAIL").length;
const warns = results.filter((r) => r.status === "WARN").length;
if (fails) {
  console.log(`RESULT: FAIL (${fails} fail, ${warns} warn). Fix every FAIL, run the check again, and only then report done.`);
  process.exit(1);
}
console.log(`RESULT: PASS${warns ? ` (${warns} warn: read them, fix what applies)` : ""}`);
