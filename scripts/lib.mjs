// Shared helpers for check.mjs and build.mjs: read the source icons, parse them, enforce the style rules, serialise.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { optimize } from 'svgo';

export const VARIANTS = ['line', 'fill'];
export const VIEWBOX = '0 0 24 24';
export const STROKE_WIDTH = '1.8';
/** The attributes every source file's <svg> carries, exactly (README "Style rules"). */
export const ROOT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: VIEWBOX,
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': STROKE_WIDTH,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
export const CATEGORIES = [
  'navigation', 'actions', 'status', 'charts', 'communication', 'content', 'files', 'people', 'time',
  'devices', 'media', 'commerce', 'seo', 'ai', 'development', 'places', 'misc',
];
export const NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const SHAPE = ['fill', 'stroke', 'mask', 'fill-rule', 'clip-rule'];
const ALLOWED = {
  path: ['d', ...SHAPE],
  circle: ['cx', 'cy', 'r', ...SHAPE],
  ellipse: ['cx', 'cy', 'rx', 'ry', ...SHAPE],
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry', ...SHAPE],
  line: ['x1', 'y1', 'x2', 'y2', ...SHAPE],
  polyline: ['points', ...SHAPE],
  polygon: ['points', ...SHAPE],
  g: [...SHAPE],
  defs: [],
  mask: ['id', 'maskUnits', 'x', 'y', 'width', 'height'],
};
const PAINT = new Set(['currentColor', 'none']);
const MASK_PAINT = new Set(['#fff', '#000', 'white', 'black', 'none']);

/** Parse SVG text into svgo's XAST (root node). Throws on malformed XML. */
export function parse(text) {
  let ast;
  optimize(text, { plugins: [{ name: 'plume-grab', fn: (root) => { ast = root; return null; } }] });
  const svg = ast.children.find((n) => n.type === 'element');
  if (!svg) throw new Error('no <svg> element');
  return svg;
}

/** Minify path data and numbers without touching structure, ids or paint. */
export function minify(text) {
  return optimize(text, {
    multipass: true,
    plugins: ['removeComments', 'removeMetadata', 'removeEditorsNSData', 'cleanupNumericValues', 'convertPathData'],
  }).data;
}

/** Style-rule errors for one parsed file (empty when it passes). */
export function checkSvg(svg) {
  const errors = [];
  if (svg.name !== 'svg') errors.push('root element must be <svg>');
  for (const [k, v] of Object.entries(ROOT_ATTRS)) {
    if (svg.attributes[k] !== v) errors.push(`<svg> needs ${k}="${v}" (found ${svg.attributes[k] === undefined ? 'nothing' : `"${svg.attributes[k]}"`})`);
  }
  for (const k of Object.keys(svg.attributes)) if (!(k in ROOT_ATTRS)) errors.push(`<svg> must not have "${k}"`);

  const maskIds = new Set();
  const refs = [];
  let shapes = 0;
  const walk = (node, inMask) => {
    for (const child of node.children ?? []) {
      if (child.type === 'text' && child.value.trim()) errors.push('text content is not allowed');
      if (child.type !== 'element') continue;
      const allowed = ALLOWED[child.name];
      if (!allowed) { errors.push(`<${child.name}> is not allowed`); continue; }
      for (const [k, v] of Object.entries(child.attributes)) {
        if (k === 'stroke-width') errors.push(`<${child.name}> must not set stroke-width (it comes from <svg>, so strokeWidth can change it)`);
        else if (k.startsWith('on')) errors.push(`event attribute "${k}" is not allowed`);
        else if (!allowed.includes(k)) errors.push(`<${child.name}> must not have "${k}"`);
        else if (k === 'fill' || k === 'stroke') {
          const ok = inMask ? MASK_PAINT : PAINT;
          if (!ok.has(v)) errors.push(`${k}="${v}" is not allowed ${inMask ? 'inside <mask> (use #fff, #000 or none)' : '(use currentColor or none)'}`);
        } else if (k === 'mask') {
          const m = /^url\(#([\w-]+)\)$/.exec(v);
          if (!m) errors.push(`mask="${v}" must be url(#id)`);
          else refs.push(m[1]);
        }
      }
      if (child.name === 'mask') {
        if (inMask) errors.push('<mask> inside <mask> is not allowed');
        const id = child.attributes.id;
        if (!id) errors.push('<mask> needs an id');
        else if (maskIds.has(id)) errors.push(`duplicate mask id "${id}"`);
        else maskIds.add(id);
        const want = { maskUnits: 'userSpaceOnUse', x: '0', y: '0', width: '24', height: '24' };
        for (const [k, v] of Object.entries(want)) if (child.attributes[k] !== v) errors.push(`<mask id="${id}"> needs ${k}="${v}"`);
        walk(child, true);
      } else {
        if (!inMask && child.name !== 'g' && child.name !== 'defs') shapes++;
        walk(child, inMask);
      }
    }
  };
  walk(svg, false);
  for (const r of refs) if (!maskIds.has(r)) errors.push(`mask url(#${r}) has no <mask id="${r}">`);
  for (const id of maskIds) if (!refs.includes(id)) errors.push(`<mask id="${id}"> is never used`);
  if (shapes === 0) errors.push('the icon draws nothing');
  return errors;
}

/** Every icon in a source folder: { name: { line, fill } } file texts, plus the meta file. */
export function readSource(dir) {
  const files = {};
  for (const v of VARIANTS) {
    const sub = join(dir, v);
    if (!existsSync(sub)) continue;
    for (const f of readdirSync(sub)) {
      if (!f.endsWith('.svg')) continue;
      const name = f.slice(0, -4);
      (files[name] ??= {})[v] = readFileSync(join(sub, f), 'utf8');
    }
  }
  const metaPath = join(dir, 'meta.json');
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
  return { files, meta };
}

/** All errors for a source folder, as "path: message" strings. */
export function checkDir(dir) {
  const { files, meta } = readSource(dir);
  const errors = [];
  const add = (where, msg) => errors.push(`${where}: ${msg}`);
  for (const name of Object.keys(files).sort()) {
    if (!NAME_RE.test(name)) add(name, 'name must be kebab-case: lowercase letters and digits, starting with a letter');
    for (const v of VARIANTS) {
      const where = `${v}/${name}.svg`;
      const text = files[name][v];
      if (text === undefined) { add(where, `missing (every icon needs ${VARIANTS.join(' and ')})`); continue; }
      let svg;
      try { svg = parse(text); } catch (e) { add(where, `cannot be parsed: ${e.message}`); continue; }
      for (const e of checkSvg(svg)) add(where, e);
    }
    const m = meta[name];
    if (!m) add('meta.json', `no entry for "${name}"`);
    else {
      if (!CATEGORIES.includes(m.category)) add('meta.json', `"${name}" has category "${m.category}"; use one of ${CATEGORIES.join(', ')}`);
      if (!Array.isArray(m.tags) || m.tags.length === 0) add('meta.json', `"${name}" needs at least one tag`);
      for (const k of ['phosphor', 'lucide']) if (m[k] !== undefined && !Array.isArray(m[k])) add('meta.json', `"${name}".${k} must be a list`);
    }
  }
  for (const name of Object.keys(meta)) if (!files[name]) add('meta.json', `"${name}" has no SVG files`);
  return errors;
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Serialise an element's children; mask ids become `%id%<id>` so each render can make them unique. */
export function innerMarkup(svg) {
  const out = (node) => {
    if (node.type !== 'element') return '';
    let attrs = '';
    for (const [k, v] of Object.entries(node.attributes)) {
      let val = v;
      if (node.name === 'mask' && k === 'id') val = `%id%${v}`;
      if (k === 'mask') val = v.replace(/url\(#([\w-]+)\)/, 'url(#%id%$1)');
      attrs += ` ${k}="${esc(val)}"`;
    }
    const kids = (node.children ?? []).map(out).join('');
    return kids ? `<${node.name}${attrs}>${kids}</${node.name}>` : `<${node.name}${attrs}/>`;
  };
  return (svg.children ?? []).map(out).join('');
}

export const rootAttrString = (strokeWidth = STROKE_WIDTH) =>
  Object.entries({ ...ROOT_ATTRS, 'stroke-width': strokeWidth }).map(([k, v]) => `${k}="${v}"`).join(' ');

export const pascal = (name) => name.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
