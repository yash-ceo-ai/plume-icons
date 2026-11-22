// <Icon name="search" />: picks the icon by name at run time. It loads every icon, so prefer the named
// components (import { Search } from 'plume-icons/react') when you know the icon up front.
import { forwardRef, useId } from 'react';
import { icons } from '../data.js';
import { renderIcon } from './create.js';

export const Icon = forwardRef(function PlumeIcon({ name, ...props }, ref) {
  const id = useId();
  const data = icons[name];
  if (!data) {
    if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') console.warn(`plume-icons: unknown icon "${name}"`);
    return null;
  }
  return renderIcon(name, data, props, ref, id);
});
Icon.displayName = 'Icon';
