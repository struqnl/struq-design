// why: the first Haiku round put freight containers on a family cargo bike and flour on a fish
// restaurant. These pin the pack rule Struq's MCP uses (sector word, then product launch, then
// halide) and the alt filter that keeps a pack's off-subject photos out of a site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitImages, packForBrief } from '../skills/struq/scripts/packs.mjs';

test('a sector word picks its pack, as whole words', () => {
  assert.equal(packForBrief('Zout, een visrestaurant in Amsterdam-Noord'), 'proof');
  assert.equal(packForBrief('Architectenbureau in Rotterdam: woningbouw en oude fabriekspanden'), 'datum');
  assert.equal(packForBrief('A small bakery in Utrecht'), 'proof');
  assert.equal(packForBrief('Logistiek: een distributiecentrum met magazijn'), 'transit');
});

test('vehicles never pull a brief to freight; a launch without a sector gets vitrine', () => {
  assert.equal(packForBrief('Lancering van een elektrische bakfiets voor gezinnen en bezorgers in Utrecht'), 'vitrine');
  assert.equal(packForBrief('We launch a new e-bike'), 'vitrine');
  assert.notEqual(packForBrief('De bakfiets voor bezorgers'), 'transit');
});

test('anything else falls back to halide', () => {
  assert.equal(packForBrief('Een website voor ons'), 'halide');
});

const proofImages = [
  { slot: 'hero', alt: 'Lege eetzaal met gedekte tafels voor aanvang', description: '' },
  { slot: 'hero', alt: 'Houten werkbank bestoven met meel en rustend deeg', description: '' },
  { slot: 'card', alt: 'Linnen schort met meelafdrukken aan een haak', description: '' },
  { slot: 'card', alt: 'Zwartgeblakerde ovengroenten op een handgemaakt bord', description: '' },
  { slot: 'detail', alt: 'Grove zeezoutkristallen op donker keramiek', description: '' },
];

test('a fish restaurant does not get the bakery photos of the proof pack', () => {
  const { keep, dropped } = fitImages('proof', 'Zout, een visrestaurant met vis en groente van het seizoen', proofImages);
  assert.deepEqual(keep.map((i) => i.alt).sort(), [proofImages[0].alt, proofImages[3].alt, proofImages[4].alt].sort());
  assert.equal(dropped.length, 2);
});

test('a bakery keeps them, and brief words rank the best fit first', () => {
  const { keep } = fitImages('proof', 'Bakkerij met zuurdesembrood en meel uit de molen', proofImages);
  assert.equal(keep.length, proofImages.length);
  assert.equal(keep.filter((i) => i.slot === 'hero')[0].alt, proofImages[1].alt);
});
