// Writes .sheet/index.html: every icon, line and fill, at 16, 24 and 48px, on dark and light grounds, for review.
// Usage: npm run sheet [-- name1 name2 ...] (only those icons). Add --png to also save .sheet/sheet.png (Playwright).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { icons } from '../dist/index.js';

const root = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2);
const png = args.includes('--png');
const only = args.filter((a) => !a.startsWith('--'));
const names = only.length ? only : Object.keys(icons);
const svg = (n, v, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[n][v].split('%id%').join(`s${n}${v}${s}-`)}</svg>`;
const cell = (n) => `<div class="c"><div class="r">${[16, 24, 48].map((s) => svg(n, 'line', s)).join('')}</div><div class="r">${[16, 24, 48].map((s) => svg(n, 'fill', s)).join('')}</div><small>${n}</small></div>`;
const grid = names.map(cell).join('');
const html = `<!doctype html><meta charset="utf-8"><title>Plume sheet</title><style>
body{margin:0;font:12px system-ui;display:grid;grid-template-columns:1fr 1fr}
.t{padding:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-content:start}
.d{background:#121110;color:#ecebe9}.l{background:#f3f2f0;color:#121110}
.c{border:1px solid #8884;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;align-items:center}
.r{display:flex;gap:12px;align-items:center}small{opacity:.6}
</style><div class="t d">${grid}</div><div class="t l">${grid}</div>`;
mkdirSync(join(root, '.sheet'), { recursive: true });
writeFileSync(join(root, '.sheet/index.html'), html);
console.log(`sheet: ${names.length} icons -> .sheet/index.html`);

if (png) {
  const { chromium } = await import('@playwright/test');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 2 });
  await p.goto('file://' + join(root, '.sheet/index.html'));
  await p.screenshot({ path: join(root, '.sheet/sheet.png'), fullPage: true });
  await b.close();
  console.log('sheet: .sheet/sheet.png');
}
