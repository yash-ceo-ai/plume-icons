// Checks every source icon against the style rules (README "Style rules"). Usage: node scripts/check.mjs [icons-dir]
import { resolve } from 'node:path';
import { checkDir, readSource } from './lib.mjs';

const dir = resolve(process.argv[2] ?? new URL('../icons', import.meta.url).pathname);
const errors = checkDir(dir);
if (errors.length) {
  console.error(`plume check: ${errors.length} problem${errors.length === 1 ? '' : 's'} in ${dir}\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`plume check: ${Object.keys(readSource(dir).files).length} icons pass`);
