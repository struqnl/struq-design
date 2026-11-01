// why: check.mjs is the gate a small model must pass before it may say done. These fixtures pin the
// rules the first Haiku round with 0.3 showed were missing: the approval stop as a logged reply, a
// photo in the hero, a header wordmark, no product modelled from primitives, and the generic CTAs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHECK = fileURLToPath(new URL('../skills/struq/scripts/check.mjs', import.meta.url));

const LOG_OK = `# STRUQ-LOG.md: fixture

## Step 1 Project (1 Nov 2026, 10:00)
Brief received.

## Step 2 Plan (1 Nov 2026, 10:01)
Canon picks written.

## Step 2 Approval (1 Nov 2026, 10:02)
Asked: Akkoord? Heb je een logo, foto's of echte cijfers, stuur ze nu.
Reply: "akkoord, bouw maar"
`;

const HERO_OK = `import { HeroCanvas } from "@/components/struq/HeroCanvas";
import { MediaFrame } from "@/components/struq/MediaFrame";
import { SplitHeadline } from "@/components/struq/SplitHeadline";
import { images } from "@/lib/struq-images";
export function Hero() {
  return (
    <section className="relative">
      <header><a href="/" data-wordmark="">Zout</a></header>
      <HeroCanvas scene="contours" />
      <SplitHeadline as="h1">Vis en groente, van het seizoen.</SplitHeadline>
      <MediaFrame image={images.hero[0]} ratio="4/5" />
    </section>
  );
}
`;

function fixture({ log = LOG_OK, hero = HERO_OK, extra = {} } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'struq-check-'));
  const files = {
    'package.json': JSON.stringify({ name: 'fixture', dependencies: { next: '16.0.0', gsap: '3.15.0', lenis: '1.3.0', three: '0.187.0' } }),
    'STRUQ.md': '# STRUQ.md: fixture\nPalette: x\nType: x\nSystem: x\nImages: pack proof\n\n## Build checklist\n- [x] 1 Project\n- [x] 2 Plan and approval\n',
    'components/site/Hero.tsx': hero,
    ...extra,
  };
  if (log !== null) files['STRUQ-LOG.md'] = log;
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return dir;
}

const run = (dir) => spawnSync(process.execPath, [CHECK, '--dir', dir, '--no-log'], { encoding: 'utf8' }).stdout;
const fails = (out, text) => out.split('\n').some((l) => l.includes('FAIL') && l.includes(text));

test('the approval stop must be logged with the user\'s own reply', () => {
  assert.ok(!fails(run(fixture()), 'Step 2 Approval'));
  const noEntry = LOG_OK.replace(/## Step 2 Approval[\s\S]*$/, '');
  assert.ok(fails(run(fixture({ log: noEntry })), 'Step 2 Approval'));
  const noReply = LOG_OK.replace('Reply: "akkoord, bouw maar"', 'Approval read as given by the build request.');
  assert.ok(fails(run(fixture({ log: noReply })), 'Step 2 Approval'));
});

test('a hero with a WebGL layer also carries a photo', () => {
  assert.ok(!fails(run(fixture()), 'Hero without a photo'));
  const bare = HERO_OK.replace('<MediaFrame image={images.hero[0]} ratio="4/5" />', '');
  assert.ok(fails(run(fixture({ hero: bare })), 'Hero without a photo'));
  // The architect build: photos further down the same page do not count for the hero.
  const later = bare.replace('    </section>\n', '    </section>\n    <section><MediaFrame image={images.band[1]} /></section>\n');
  assert.ok(fails(run(fixture({ hero: later })), 'Hero without a photo'));
});

test('every page has a header wordmark marked data-wordmark', () => {
  assert.ok(!fails(run(fixture()), 'header wordmark'));
  const none = HERO_OK.replace(' data-wordmark=""', '');
  assert.ok(fails(run(fixture({ hero: none })), 'header wordmark'));
});

test('the product is never modelled from primitives', () => {
  assert.ok(!fails(run(fixture()), 'Hand-built product geometry'));
  const bike = 'import * as THREE from "three";\nexport const frame = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.2));\nexport const wheel = new THREE.TorusGeometry(1, 0.1);\n';
  assert.ok(fails(run(fixture({ extra: { 'components/Bike.tsx': bike } })), 'Hand-built product geometry'));
  // The first Haiku round hid its bike in a custom hero scene next to the shipped ones.
  assert.ok(fails(run(fixture({ extra: { 'components/struq/scenes/bakfiets.ts': bike } })), 'Hand-built product geometry'));
});

test('generic CTAs from Struq tells 1.2.0 fail', () => {
  assert.ok(!fails(run(fixture()), 'Generic CTAs'));
  const cta = 'export const C = () => <a href="#contact">Neem contact op</a>;\nexport const D = () => <a href="#m">Meer informatie</a>;\n';
  assert.ok(fails(run(fixture({ extra: { 'components/Cta.tsx': cta } })), 'Generic CTAs'));
});

test('stat banners (20+, 51+, 99%) fail', () => {
  assert.ok(!fails(run(fixture()), 'Stat rows'));
  const stats = 'export const S = () => <div><span>20+</span><span>51+</span><span> 99% </span></div>;\n';
  assert.ok(fails(run(fixture({ extra: { 'components/Stats.tsx': stats } })), 'Stat rows'));
});

test('the hero display line runs at 10vw or more on desktop', () => {
  const big = HERO_OK.replace('<SplitHeadline as="h1">', '<SplitHeadline as="h1" className="text-[19vw] md:text-[16vw]">');
  assert.ok(!fails(run(fixture({ hero: big })), 'Hero display line'));
  const small = HERO_OK.replace('<SplitHeadline as="h1">', '<SplitHeadline as="h1" className="font-display text-display">');
  assert.ok(fails(run(fixture({ hero: small })), 'Hero display line'));
  const opener = 'import { HeroOpener } from "@/components/struq/showpieces/toonstuk-hero-opener";\nimport { images } from "@/lib/struq-images";\nexport const H = () => <><header><a data-wordmark="">Vuur</a></header><HeroOpener image={images.hero[0]} title="Koken op" lead="x" cta={{ href: "#r", label: "Reserveer een tafel" }} /></>;\n';
  assert.ok(!fails(run(fixture({ hero: opener })), 'Hero display line'));
  assert.ok(!fails(run(fixture({ hero: opener })), 'Hero without a photo'));
  // The opener carries the split h1 itself.
  assert.ok(!fails(run(fixture({ hero: opener })), 'No h1'));
  assert.ok(!fails(run(fixture({ hero: opener })), 'not split'));
});

test('every site has one contrast scene, at most two', () => {
  const none = run(fixture());
  assert.ok(fails(none, 'contrast scene'));
  const one = 'export const S = () => <section className="scene-inverse">x</section>;\n';
  assert.ok(!fails(run(fixture({ extra: { 'components/Scene.tsx': one } })), 'contrast scene'));
  // The scene classes defined in globals.css are not scenes on the page.
  const css = ['.scene-inverse { --ink: white; }', '.scene-field { --ink: white; }', '/* scene-inverse or scene-field */', ''].join('\n');
  assert.ok(!fails(run(fixture({ extra: { 'components/Scene.tsx': one, 'app/globals.css': css } })), 'contrast scene'));
  const three = 'export const S = () => <><section className="scene-inverse" /><section className="scene-field" /><section className="scene-inverse" /></>;\n';
  assert.ok(fails(run(fixture({ extra: { 'components/Scene.tsx': three } })), 'contrast scene'));
});
