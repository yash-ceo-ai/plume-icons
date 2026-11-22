// Scaffolds a new icon: icons/line/<name>.svg, icons/fill/<name>.svg (a rounded-square starting frame) and a
// meta.json entry. Usage: npm run new -- <name> --category <category> --tags tag1,tag2
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, NAME_RE, rootAttrString } from './lib.mjs';

const dir = new URL('../icons', import.meta.url).pathname;
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const category = opt('category') ?? 'misc';
const tags = (opt('tags') ?? '').split(',').map((t) => t.trim()).filter(Boolean);

const fail = (m) => { console.error(`plume new: ${m}`); process.exit(1); };
if (!name || !NAME_RE.test(name)) fail('give a kebab-case name, e.g. npm run new -- map-pin --category places --tags location,pin');
if (!CATEGORIES.includes(category)) fail(`category must be one of ${CATEGORIES.join(', ')}`);
if (existsSync(join(dir, 'line', `${name}.svg`))) fail(`"${name}" already exists`);

const frame = 'x="3.75" y="3.75" width="16.5" height="16.5" rx="5.25"';
writeFileSync(join(dir, 'line', `${name}.svg`), `<svg ${rootAttrString()}>\n  <rect ${frame}/>\n</svg>\n`);
writeFileSync(
  join(dir, 'fill', `${name}.svg`),
  `<svg ${rootAttrString()}>\n  <mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">\n  <rect width="24" height="24" fill="#fff" stroke="none"/>\n  <circle cx="12" cy="12" r="2" fill="#000" stroke="none"/>\n  </mask>\n  <rect ${frame} fill="currentColor" mask="url(#cut)"/>\n</svg>\n`,
);
const metaPath = join(dir, 'meta.json');
const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
meta[name] = { category, tags: tags.length ? tags : [name], phosphor: [], lucide: [] };
const sorted = Object.fromEntries(Object.keys(meta).sort().map((k) => [k, meta[k]]));
writeFileSync(metaPath, JSON.stringify(sorted, null, 2) + '\n');
console.log(`plume new: icons/line/${name}.svg, icons/fill/${name}.svg and a meta entry. Draw it, then: npm run sheet -- ${name} --png`);
