// why: the bakfiets run asked for "Big Shoulders Display", which Google lists as "Big Shoulders",
// and the build fell back to a default pairing. These pin the name resolution, and (online) check
// that every face of every canon pairing loads from Google Fonts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { googleCssUrl, googleName } from '../skills/struq/scripts/font-names.mjs';

test('canon face names resolve to the Google family', () => {
  const data = { 'Big Shoulders': {}, 'Bodoni Moda': {}, Unbounded: {}, 'Instrument Serif': {}, 'Schibsted Grotesk': {} };
  assert.equal(googleName('Big Shoulders Display', data), 'Big Shoulders');
  assert.equal(googleName('Bodoni Moda', data), 'Bodoni Moda');
  assert.equal(googleName('Unbounded', data), 'Unbounded');
  assert.equal(googleName('Instrument Serif', data), 'Instrument Serif');
  assert.equal(googleName('Schibsted Grotesk', data), 'Schibsted Grotesk');
  assert.equal(googleName('General Sans', data), null); // Fontshare, not Google
  assert.equal(googleName('Big Shoulders Display', null), 'Big Shoulders'); // no next/font data: the alias
});

const API = (process.env.STRUQ_API_BASE || 'https://staging.struq.nl').replace(/\/+$/, '');

test('every face of every canon pairing loads from Google Fonts', async (t) => {
  let items;
  try {
    const res = await fetch(`${API}/api/assets?filter=typography`, { signal: AbortSignal.timeout(15000) });
    items = (await res.json()).items;
  } catch {
    t.skip('offline: the canon is unreachable');
    return;
  }
  const names = new Set();
  for (const p of items) for (const role of ['display', 'body', 'accent']) if (p.data?.[role]?.name) names.add(p.data[role].name);
  const FONTSHARE = new Set(['General Sans']);
  for (const name of names) {
    if (FONTSHARE.has(name) || name === 'Inter' || name === 'Space Grotesk') continue;
    const family = googleName(name, null);
    const res = await fetch(googleCssUrl(family), { signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0' } });
    const css = await res.text();
    assert.equal(res.status, 200, `${name} (as ${family}) answered ${res.status}`);
    assert.match(css, /@font-face/, `${name} (as ${family}) returned no @font-face`);
  }
});
