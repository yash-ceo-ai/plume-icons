// plume-icons/react renders on the server, gives each fill icon its own mask ids, and handles a11y and props.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import { Search, SearchIcon, Dashboard, Icon, createPlumeIcon } from '../dist/react/index.js';
import * as all from '../dist/react/index.js';
import { iconNames } from '../dist/index.js';
import { pascal } from '../scripts/lib.mjs';

test('renders an SVG with the default attributes', () => {
  const html = renderToString(h(Search));
  assert.match(html, /^<svg /);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /width="24" height="24"/);
  assert.match(html, /stroke-width="1.8"/);
  assert.match(html, /stroke-linecap="round"/);
  assert.match(html, /class="plume plume-search"/);
  assert.match(html, /aria-hidden="true"/);
  assert.equal(SearchIcon, Search);
});

test('size, strokeWidth, className and extra props', () => {
  const html = renderToString(h(Search, { size: 18, strokeWidth: 1.5, className: 'x', 'data-k': 'v', style: { color: 'red' } }));
  assert.match(html, /width="18" height="18"/);
  assert.match(html, /stroke-width="1.5"/);
  assert.match(html, /class="plume plume-search x"/);
  assert.match(html, /data-k="v"/);
  assert.match(html, /style="color:red"/);
});

test('title gives the icon a role and an escaped accessible name', () => {
  const html = renderToString(h(Search, { title: 'Find <things>' }));
  assert.match(html, /role="img"/);
  assert.ok(!html.includes('aria-hidden'));
  assert.match(html, /<title>Find &lt;things&gt;<\/title>/);
  assert.match(renderToString(h(Search, { 'aria-label': 'Find' })), /role="img"/);
});

test('two fill icons on one page get different mask ids, each used by its own shape', () => {
  const html = renderToString(h(Fragment, null, h(Dashboard, { variant: 'fill' }), h(Dashboard, { variant: 'fill' })));
  const ids = [...html.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  for (const id of ids) {
    assert.match(id, /^plume-[A-Za-z0-9_-]+-cut$/);
    assert.ok(html.includes(`url(#${id})`));
  }
  assert.ok(!html.includes('%id%'));
});

test('<Icon name> renders by name and returns nothing for unknown names', () => {
  assert.equal(renderToString(h(Icon, { name: 'search' })), renderToString(h(Search)));
  const warn = console.warn;
  console.warn = () => {};
  try { assert.equal(renderToString(h(Icon, { name: 'nope' })), ''); } finally { console.warn = warn; }
});

test('createPlumeIcon makes custom icons', () => {
  const Dot = createPlumeIcon('dot', { line: '<circle cx="12" cy="12" r="3"/>' }, 'Dot');
  assert.match(renderToString(h(Dot, { variant: 'fill' })), /<circle cx="12" cy="12" r="3"\/>/);
  assert.equal(Dot.displayName, 'Dot');
});

test('every icon has a named component and an Icon alias', () => {
  for (const n of iconNames) {
    assert.ok(all[pascal(n)], pascal(n));
    assert.equal(all[`${pascal(n)}Icon`], all[pascal(n)]);
  }
});

test('the components need no client-only React APIs (safe in Server Components)', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../dist/react/create.js', import.meta.url), 'utf8') + readFileSync(new URL('../dist/react/Icon.js', import.meta.url), 'utf8');
  assert.ok(!src.includes("'use client'"));
  for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useContext', 'useRef']) assert.ok(!src.includes(hook), hook);
});
