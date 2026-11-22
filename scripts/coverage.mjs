// Fills app-coverage.json (the Renown app's icons, by Phosphor name) from the "phosphor" lists in icons/meta.json.
// Hand-set entries (like otto-bot -> bot) are kept while that Plume icon exists. Run: npm run coverage
import { readFileSync, writeFileSync } from 'node:fs';
import { readSource } from './lib.mjs';

const root = new URL('..', import.meta.url).pathname;
const { meta } = readSource(`${root}icons`);
const path = `${root}app-coverage.json`;
const cover = JSON.parse(readFileSync(path, 'utf8'));
const byPhosphor = {};
for (const [name, m] of Object.entries(meta)) for (const p of m.phosphor ?? []) byPhosphor[p] ??= name;
for (const ph of Object.keys(cover.icons)) {
  const now = cover.icons[ph];
  cover.icons[ph] = byPhosphor[ph] ?? (now && meta[now] ? now : null);
}
writeFileSync(path, JSON.stringify(cover, null, 2) + '\n');
const done = Object.values(cover.icons).filter(Boolean).length;
console.log(`coverage: ${done} of ${Object.keys(cover.icons).length} app icons drawn`);
