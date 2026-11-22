// The style checker accepts a clean icon and names the rule each broken one breaks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDir, rootAttrString } from '../scripts/lib.mjs';

const ROOT = `<svg ${rootAttrString()}>`;
const GOOD_LINE = `${ROOT}<rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5.25"/></svg>`;
const GOOD_FILL = `${ROOT}<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff" stroke="none"/><circle cx="12" cy="12" r="2" fill="#000" stroke="none"/></mask><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5.25" fill="currentColor" mask="url(#cut)"/></svg>`;
const META = { box: { category: 'misc', tags: ['square'] } };

function dirWith({ line = GOOD_LINE, fill = GOOD_FILL, meta = META, name = 'box' } = {}) {
  const d = mkdtempSync(join(tmpdir(), 'plume-check-'));
  mkdirSync(join(d, 'line'));
  mkdirSync(join(d, 'fill'));
  if (line !== null) writeFileSync(join(d, 'line', `${name}.svg`), line);
  if (fill !== null) writeFileSync(join(d, 'fill', `${name}.svg`), fill);
  writeFileSync(join(d, 'meta.json'), JSON.stringify(meta));
  return d;
}
const expectError = (opts, pattern) => {
  const errors = checkDir(dirWith(opts));
  assert.ok(errors.some((e) => pattern.test(e)), `expected an error matching ${pattern}, got:\n${errors.join('\n') || '(none)'}`);
};

test('a clean icon passes', () => {
  assert.deepEqual(checkDir(dirWith()), []);
});

test('the repo icons pass', () => {
  assert.deepEqual(checkDir(new URL('../icons', import.meta.url).pathname), []);
});

test('missing fill variant', () => expectError({ fill: null }, /fill\/box\.svg: missing/));
test('wrong viewBox', () => expectError({ line: GOOD_LINE.replace('0 0 24 24', '0 0 256 256') }, /viewBox="0 0 24 24"/));
test('wrong root stroke width', () => expectError({ line: GOOD_LINE.replace('stroke-width="1.8"', 'stroke-width="2"') }, /stroke-width="1.8"/));
test('square caps', () => expectError({ line: GOOD_LINE.replace('stroke-linecap="round"', 'stroke-linecap="butt"') }, /stroke-linecap="round"/));
test('width on the root', () => expectError({ line: GOOD_LINE.replace('<svg ', '<svg width="24" ') }, /must not have "width"/));
test('hard-coded colour', () => expectError({ line: GOOD_LINE.replace('/>', ' fill="#ff0000"/>') }, /fill="#ff0000" is not allowed/));
test('stroke-width on a child', () => expectError({ line: GOOD_LINE.replace('/>', ' stroke-width="2"/>') }, /must not set stroke-width/));
test('opacity', () => expectError({ line: GOOD_LINE.replace('/>', ' opacity=".5"/>') }, /must not have "opacity"/));
test('style attribute', () => expectError({ line: GOOD_LINE.replace('/>', ' style="fill:red"/>') }, /must not have "style"/));
test('event handler', () => expectError({ line: GOOD_LINE.replace('/>', ' onload="x()"/>') }, /event attribute "onload"/));
test('script element', () => expectError({ line: GOOD_LINE.replace('</svg>', '<script>alert(1)</script></svg>') }, /<script> is not allowed/));
test('image element', () => expectError({ line: GOOD_LINE.replace('</svg>', '<image href="x.png"/></svg>') }, /<image> is not allowed/));
test('mask without user-space units', () => expectError({ fill: GOOD_FILL.replace(' maskUnits="userSpaceOnUse"', '') }, /needs maskUnits="userSpaceOnUse"/));
test('mask reference to nothing', () => expectError({ fill: GOOD_FILL.replace('url(#cut)', 'url(#nope)') }, /has no <mask id="nope">/));
test('colour inside a mask', () => expectError({ fill: GOOD_FILL.replace('fill="#000"', 'fill="#333"') }, /inside <mask>/));
test('not kebab-case', () => expectError({ name: 'BigBox', meta: { BigBox: META.box } }, /kebab-case/));
test('no meta entry', () => expectError({ meta: {} }, /no entry for "box"/));
test('unknown category', () => expectError({ meta: { box: { category: 'shapes', tags: ['x'] } } }, /category "shapes"/));
test('meta for a missing icon', () => expectError({ meta: { ...META, ghost: { category: 'misc', tags: ['x'] } } }, /"ghost" has no SVG files/));
test('empty drawing', () => expectError({ line: `${ROOT}</svg>` }, /draws nothing/));
