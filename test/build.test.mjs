// The build output: a valid Iconify collection, standalone SVGs, core data and toSvg(), and the app coverage list.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { validateIconSet } from '@iconify/utils';
import { icons, iconNames, toSvg } from '../dist/index.js';
import { parse } from '../scripts/lib.mjs';

const dist = new URL('../dist/', import.meta.url);
const iconify = JSON.parse(readFileSync(new URL('plume.json', dist), 'utf8'));
const meta = JSON.parse(readFileSync(new URL('meta.json', dist), 'utf8'));

test('plume.json is a valid Iconify collection', () => {
  assert.doesNotThrow(() => validateIconSet(iconify));
  assert.equal(iconify.prefix, 'plume');
  assert.equal(iconify.width, 24);
  assert.equal(iconify.height, 24);
  assert.equal(iconify.info.total, iconNames.length * 2);
  assert.equal(iconify.info.license.spdx, 'MIT');
});

test('every icon has -line and -fill in Iconify, and every Iconify icon is in a category', () => {
  const inCategory = new Set(Object.values(iconify.categories).flat());
  for (const n of iconNames) {
    for (const v of ['line', 'fill']) {
      assert.ok(iconify.icons[`${n}-${v}`]?.body, `${n}-${v}`);
      assert.ok(inCategory.has(`${n}-${v}`), `${n}-${v} has a category`);
    }
  }
});

test('Iconify bodies carry the stroke style and no unresolved id placeholders', () => {
  for (const [k, { body }] of Object.entries(iconify.icons)) {
    assert.match(body, /^<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">/, k);
    assert.ok(!body.includes('%id%'), k);
  }
});

test('standalone SVG files exist for every icon, parse, and use a 24 viewBox', () => {
  for (const v of ['line', 'fill']) {
    const files = readdirSync(new URL(`svg/${v}/`, dist));
    assert.equal(files.length, iconNames.length);
    for (const f of files) {
      const svg = parse(readFileSync(new URL(`svg/${v}/${f}`, dist), 'utf8'));
      assert.equal(svg.attributes.viewBox, '0 0 24 24', f);
    }
  }
});

test('mask ids in standalone files are unique across the whole set', () => {
  const seen = new Set();
  for (const v of ['line', 'fill']) for (const f of readdirSync(new URL(`svg/${v}/`, dist))) {
    const text = readFileSync(new URL(`svg/${v}/${f}`, dist), 'utf8');
    for (const [, id] of text.matchAll(/<mask id="([^"]+)"/g)) {
      assert.ok(!seen.has(id), `duplicate id ${id}`);
      seen.add(id);
    }
  }
});

test('fill icons that use masks cut real holes (white keeps, black cuts, no fixed colour outside the mask)', () => {
  for (const n of iconNames) {
    const body = icons[n].fill;
    if (!body.includes('<mask')) continue;
    assert.match(body, /fill="#fff"/, n);
    assert.match(body, /(fill|stroke)="#000"/, n);
    const outside = body.replace(/<mask[\s\S]*?<\/mask>/g, '');
    assert.ok(!/#[0-9a-f]{3,6}/i.test(outside), `${n}: colour outside mask`);
  }
});

test('meta lists every icon with a category and tags', () => {
  assert.deepEqual(Object.keys(meta.icons).sort(), [...iconNames].sort());
  for (const [n, m] of Object.entries(meta.icons)) {
    assert.ok(meta.categories.includes(m.category), n);
    assert.ok(m.tags.length > 0, n);
  }
});

test('toSvg() makes unique mask ids, applies options and escapes', () => {
  const a = toSvg('dashboard', { variant: 'fill' });
  const b = toSvg('dashboard', { variant: 'fill' });
  const id = (s) => /<mask id="([^"]+)"/.exec(s)[1];
  assert.notEqual(id(a), id(b));
  assert.ok(a.includes(`url(#${id(a)})`));
  const c = toSvg('search', { size: 18, strokeWidth: 1.6, class: 'nav', title: 'Find <it>', attrs: { 'data-x': '"q"' } });
  assert.match(c, /width="18" height="18"/);
  assert.match(c, /stroke-width="1.6"/);
  assert.match(c, /class="plume plume-search nav"/);
  assert.match(c, /role="img"/);
  assert.match(c, /<title>Find &lt;it><\/title>/);
  assert.match(c, /data-x="&quot;q&quot;"/);
  assert.match(toSvg('search'), /aria-hidden="true"/);
  assert.throws(() => toSvg('nope'), /unknown icon "nope"/);
});

test('app coverage: every icon the Renown app uses has a Plume icon', (t) => {
  const { icons: cover } = JSON.parse(readFileSync(new URL('../app-coverage.json', import.meta.url), 'utf8'));
  for (const [ph, plume] of Object.entries(cover)) if (plume) assert.ok(icons[plume], `${ph} -> ${plume} does not exist`);
  const missing = Object.entries(cover).filter(([, p]) => !p).map(([ph]) => ph);
  if (missing.length) t.todo(`${missing.length} of ${Object.keys(cover).length} app icons not drawn yet`);
});
