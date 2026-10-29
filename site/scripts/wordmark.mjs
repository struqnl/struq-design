// scripts/wordmark.mjs (brand.md §3):
//   node scripts/wordmark.mjs "Struq" assets/fonts/comfortaa-latin-600-normal.woff -0.02 > brand/logo.svg
// Outlines the name; the brand's flame full stop is appended as its own element so it can take the accent.
import { readFile } from "node:fs/promises";
import opentype from "opentype.js";

const [text, fontPath, trackingEm = "-0.02"] = process.argv.slice(2);
const font = opentype.parse((await readFile(fontPath)).buffer);
const size = 100;
const tracking = Number(trackingEm) * size;

const glyphs = Array.from(text, (ch) => font.charToGlyph(ch));
if (glyphs.some((g) => g.index === 0)) console.error("warning: a character is missing from the font");

let x = 0;
const parts = [];
const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
const grow = (b) => {
  box.x1 = Math.min(box.x1, b.x1); box.y1 = Math.min(box.y1, b.y1);
  box.x2 = Math.max(box.x2, b.x2); box.y2 = Math.max(box.y2, b.y2);
};
// Outline at the origin, then shift: getPath(x, ...) emitted NaN control points for some
// glyphs of this woff (opentype.js), while the same glyph at x = 0 is clean.
const at = (glyph, dx) => {
  const path = glyph.getPath(0, 0, size);
  for (const c of path.commands) for (const k of ["x", "x1", "x2"]) if (typeof c[k] === "number") c[k] += dx;
  return path;
};
// Own serializer: opentype.js toPathData(2) printed NaN for some rounded values.
const n = (v) => (Math.round(v * 100) / 100).toString();
const toD = (path) =>
  path.commands
    .map((c) =>
      c.type === "Z" ? "Z"
      : c.type === "Q" ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
      : c.type === "C" ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
      : `${c.type}${n(c.x)} ${n(c.y)}`
    )
    .join("");
glyphs.forEach((glyph, i) => {
  const path = at(glyph, x);
  const b = path.getBoundingBox();
  if (!b.isEmpty()) grow(b);
  parts.push(toD(path));
  const kern = (glyphs[i + 1] && font.getKerningValue(glyph, glyphs[i + 1])) || 0; // undefined on fonts without kern data
  x += ((glyph.advanceWidth + kern) / font.unitsPerEm) * size + tracking;
});

// The full stop, from the same face, so its weight matches the letters.
const dot = at(font.charToGlyph("."), x);
const db = dot.getBoundingBox();
grow(db);

const vx = Math.floor(box.x1), vy = Math.floor(box.y1);
const vw = Math.ceil(box.x2) - vx, vh = Math.ceil(box.y2) - vy;
console.log(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" fill="currentColor" role="img" aria-label="${text}"><path d="${parts.join(" ")}"/><path data-dot fill="#e4572e" d="${toD(dot)}"/></svg>`
);
