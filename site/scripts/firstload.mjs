// scripts/firstload.mjs: node scripts/firstload.mjs http://localhost:3207 (performance.md §8)
import { gzipSync } from "node:zlib";

const base = process.argv[2] ?? "http://localhost:3207";
const html = await (await fetch(base + "/")).text();
const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
const THREE = /WebGLRenderer|WebGL2RenderingContext|react-three-fiber/;
let raw = 0, gz = 0;
const hits = [];
for (const s of srcs) {
  const buf = Buffer.from(await (await fetch(new URL(s, base))).arrayBuffer());
  raw += buf.length;
  gz += gzipSync(buf).length;
  if (THREE.test(buf.toString("utf8"))) hits.push(s);
}
console.log(`first-load: ${srcs.length} scripts, ${(raw / 1024).toFixed(1)} kB raw, ${(gz / 1024).toFixed(1)} kB gzip`);
console.log(`three.js in first load: ${hits.length ? hits.join(", ") : "none"}`);
