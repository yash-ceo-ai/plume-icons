// Packs the package the way npm publish would, checks what is inside, installs the tarball in a fresh folder and
// imports every entry point. Run after npm run build: npm run test:pack
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const [info] = JSON.parse(execSync('npm pack --json', { cwd: root, encoding: 'utf8' }));
const files = info.files.map((f) => f.path);
const allowed = (p) => p === 'package.json' || p === 'README.md' || p === 'LICENSE' || p.startsWith('dist/');
const extra = files.filter((p) => !allowed(p));
assert.deepEqual(extra, [], `unexpected files in the package: ${extra.join(', ')}`);
for (const need of ['dist/index.js', 'dist/react/index.js', 'dist/astro/Icon.astro', 'dist/plume.json', 'README.md', 'LICENSE']) {
  assert.ok(files.includes(need), `${need} missing from the package`);
}
console.log(`pack: ${info.filename}, ${files.length} files, ${(info.size / 1024).toFixed(0)} kB packed`);

const tmp = mkdtempSync(join(tmpdir(), 'plume-pack-'));
try {
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ name: 'smoke', private: true, type: 'module' }));
  execSync(`npm install --no-audit --no-fund ${join(root, info.filename)} react@19 react-dom@19`, { cwd: tmp, stdio: 'ignore' });
  writeFileSync(join(tmp, 'smoke.mjs'), `
    import { createElement } from 'react';
    import { renderToString } from 'react-dom/server';
    import { Search } from 'plume-icons/react';
    import { toSvg, iconNames } from 'plume-icons';
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.url);
    const json = require('plume-icons/plume.json');
    const html = renderToString(createElement(Search));
    if (!html.startsWith('<svg') || !toSvg('search').startsWith('<svg') || json.prefix !== 'plume' || !iconNames.length) process.exit(1);
    require.resolve('plume-icons/svg/line/search.svg');
    require.resolve('plume-icons/astro');
    console.log('pack: installed tarball works (' + iconNames.length + ' icons)');
  `);
  execSync('node smoke.mjs', { cwd: tmp, stdio: 'inherit' });
} finally {
  rmSync(tmp, { recursive: true, force: true });
  rmSync(join(root, info.filename), { force: true });
}
