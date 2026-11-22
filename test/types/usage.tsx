// Type test (npm run test:types): good usage compiles, and every @ts-expect-error line must really be an error.
import { Search, SearchIcon, Icon, createPlumeIcon, type IconName, type PlumeIconProps } from 'plume-icons/react';
import { toSvg, icons, iconNames } from 'plume-icons';

export const ok = [
  <Search key="1" />,
  <SearchIcon key="2" size={18} variant="fill" strokeWidth={1.6} className="x" title="Find" onClick={() => {}} />,
  <Icon key="3" name="caret-down" aria-label="Open" />,
];
const name: IconName = 'gear';
const props: PlumeIconProps = { size: '1em', variant: 'line' };
export const strings: string[] = [toSvg(name, { variant: 'fill', size: 16 }), icons.search.line, ...iconNames];
export const Custom = createPlumeIcon('dot', { line: '<circle cx="12" cy="12" r="3"/>' });
export const custom = <Custom {...props} />;

// @ts-expect-error unknown icon name
export const bad1 = <Icon name="not-an-icon" />;
// @ts-expect-error variant is line or fill
export const bad2 = <Search variant="duotone" />;
// @ts-expect-error unknown icon name
toSvg('not-an-icon');
