// Installs and builds examples/astro and examples/next against the current dist/, then checks their HTML:
// every icon rendered, mask ids unique, no unresolved placeholders. Run after npm run build: npm run test:examples
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const { iconNames } = await import(join(root, 'dist/index.js'));
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ASTRO_TELEMETRY_DISABLED: '1' } });

function checkHtml(label, html) {
  const ids = [...html.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate mask ids`);
  for (const id of ids) assert.ok(html.includes(`url(#${id})`), `${label}: mask ${id} unused`);
  assert.ok(!html.includes('%id%'), `${label}: unresolved %id%`);
  for (const n of iconNames) assert.ok(html.includes(`plume plume-${n}`), `${label}: ${n} missing`);
  console.log(`${label}: ${iconNames.length} icons, ${ids.length} unique mask ids`);
}

for (const ex of ['astro', 'next']) {
  const dir = join(root, 'examples', ex);
  // install-links=true (.npmrc) copies plume-icons from the repo root, so reinstall it to pick up the new dist/.
  run('npm install --no-audit --no-fund', dir);
  run('npm install --no-audit --no-fund --no-save plume-icons@file:../..', dir);
  if (ex === 'astro') {
    run('npx astro check', dir);
    run('npx astro build', dir);
    const html = readFileSync(join(dir, 'dist/index.html'), 'utf8');
    checkHtml('examples/astro', html);
    assert.match(html, /id="ai:plume:search-line"/, 'astro-icon did not render plume:search-line');
    assert.match(html, /role="img" aria-label="Search"/);
  } else {
    run('npx next build', dir);
    const html = readFileSync(join(dir, 'out/index.html'), 'utf8');
    checkHtml('examples/next', html);
    assert.match(html, /id="client"/, 'client component missing');
    assert.match(html, /<title>Search<\/title>/);
  }
}
console.log('examples: ok');
