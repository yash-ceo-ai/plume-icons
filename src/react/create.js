// React renderer shared by every Plume icon component. Works in Server and Client Components:
// it only uses forwardRef and useId, which React allows on the server.
import { createElement, forwardRef, useId } from 'react';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Render one icon. `data` is { line, fill } inner markup; `%id%` marks mask ids that must be unique per render. */
export function renderIcon(name, data, props, ref, reactId) {
  const { size = 24, variant = 'line', strokeWidth = 1.8, title, className, children: _children, ...rest } = props;
  const body = (data[variant] ?? data.line).split('%id%').join(`plume-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}-`);
  const labelled = Boolean(title || rest['aria-label'] || rest['aria-labelledby']);
  return createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: ['plume', `plume-${name}`, className].filter(Boolean).join(' '),
    ...(labelled ? { role: 'img' } : { 'aria-hidden': 'true' }),
    ...rest,
    ref,
    dangerouslySetInnerHTML: { __html: (title ? `<title>${esc(title)}</title>` : '') + body },
  });
}

/** Make a component for one icon. Used by the generated files in ./icons/ and for custom icons. */
export function createPlumeIcon(name, data, displayName) {
  const Component = forwardRef(function PlumeIcon(props, ref) {
    return renderIcon(name, data, props, ref, useId());
  });
  Component.displayName = displayName ?? name;
  return Component;
}
