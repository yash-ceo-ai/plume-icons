// Rewrites the generated parts of README.md (icon count and the Phosphor / Lucide name table) from icons/meta.json.
// Run after adding icons: npm run readme. CI fails if README.md is out of date.
import { readFileSync, writeFileSync } from 'node:fs';
import { readSource } from './lib.mjs';

const root = new URL('..', import.meta.url).pathname;
const { meta } = readSource(`${root}icons`);
const names = Object.keys(meta).sort();
const path = `${root}README.md`;
let readme = readFileSync(path, 'utf8');
const swap = (key, body) => {
  const re = new RegExp(`(<!-- ${key}:start -->)[\\s\\S]*?(<!-- ${key}:end -->)`);
  if (!re.test(readme)) throw new Error(`README.md has no ${key} markers`);
  readme = readme.replace(re, `$1${body}$2`);
};
swap('count', String(names.length));
const rows = names.map((n) => `| \`${n}\` | ${(meta[n].phosphor ?? []).map((p) => `\`${p}\``).join(', ')} | ${(meta[n].lucide ?? []).map((p) => `\`${p}\``).join(', ')} |`);
swap('map', `\n| Plume | Phosphor | Lucide |\n|---|---|---|\n${rows.join('\n')}\n`);
writeFileSync(path, readme);
console.log(`readme: ${names.length} icons`);
