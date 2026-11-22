# Plume Icons

Soft, rounded icons with a line and a fill version of each, for plain SVG, React (Next.js), Astro and Iconify.
<!-- count:start -->47<!-- count:end --> icons so far, MIT licensed.

**Browse and copy icons:** https://yash-ceo-ai.github.io/plume-icons/

- 24 × 24 grid, 1.8 line, round caps and joins, rounded-square frames.
- Every icon has a `line` version and a `fill` version. The fill cuts details out with a mask, so the holes are see-through on any background.
- One colour: `currentColor`. Icons take the text colour around them.
- Server-rendered by default: the React components work in Server Components, and the Astro component ships no JavaScript.

## Install

```sh
npm install plume-icons
```

## React and Next.js

```tsx
import { Search, Bell, Gear } from 'plume-icons/react';

export default function Toolbar() {
  return (
    <nav>
      <Search size={18} />
      <Bell variant="fill" />
      <Gear strokeWidth={1.6} title="Settings" />
    </nav>
  );
}
```

Each icon is its own component (`Search`, also exported as `SearchIcon` to avoid clashes such as Next's `Link`). Import only what you use and your bundler drops the rest. `<Icon name="search" />` picks an icon by name at run time, but it loads every icon.

| Prop | Default | |
|---|---|---|
| `size` | `24` | Width and height. Any CSS length works (`"1em"`). |
| `variant` | `"line"` | `"line"` or `"fill"`. |
| `strokeWidth` | `1.8` | Line weight on the 24 grid. |
| `title` | none | Accessible name. Without it (or `aria-label`) the icon gets `aria-hidden="true"`. |
| any SVG prop | | `className`, `style`, `onClick`, `ref` and the rest go on the `<svg>`. |

No `'use client'` is needed. The components only use `useId` (so two fill icons on one page never share a mask id), which React allows in Server Components.

## Astro

```astro
---
import Icon from 'plume-icons/astro';
---
<Icon name="search" size={18} />
<Icon name="bell" variant="fill" label="Notifications" />
```

Props: `name`, `size`, `variant`, `strokeWidth`, `label` (accessible name), `class`, and any SVG attribute. `name` is typed, so `astro check` catches a wrong name.

### With astro-icon (Iconify)

If you already use [astro-icon](https://www.astroicon.dev), install Plume under the Iconify name it looks for:

```sh
npm install @iconify-json/plume@npm:plume-icons
```

```js
// astro.config.mjs
import icon from 'astro-icon';
export default { integrations: [icon({ include: { plume: ['search-line', 'search-fill'] } })] };
```

```astro
<Icon name="plume:search-line" />
```

The Iconify collection is also at `plume-icons/plume.json` (prefix `plume`, names `<name>-line` and `<name>-fill`) for any Iconify tool.

## Plain SVG and vanilla JS

Copy a file from the [site](https://yash-ceo-ai.github.io/plume-icons/), or use the files in the package:

```js
import searchUrl from 'plume-icons/svg/line/search.svg';
```

To build HTML strings (vanilla JS, server templates, emails):

```js
import { toSvg } from 'plume-icons';

button.innerHTML = toSvg('search', { size: 18, class: 'icon' }) + 'Search';
```

`toSvg(name, { variant, size, strokeWidth, class, title, attrs })` returns an `<svg>` string with unique mask ids.

## Sizes

Draw at 24. In navigation and buttons use 18 or 20. At 16 and below, a lighter line reads better: `strokeWidth={1.6}`.

## Style rules

Every icon follows these, and `npm run check` enforces the ones a script can check:

- `viewBox="0 0 24 24"`, with 2px of padding, so the drawing sits in the middle 20 × 20.
- The `<svg>` carries `fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`. Shapes inside never set their own `stroke-width`, so `strokeWidth` changes the whole icon.
- Frames are rounded squares with a 5.25 corner radius. Character comes from overlapping shapes (two bubbles, a card behind a card) and dots, not from detail. At most three strokes inside a frame.
- Fill version: the main shape is solid and the details are cut out with a `<mask>` (`maskUnits="userSpaceOnUse"`, white keeps, black cuts). Icons without a closed shape (arrows, carets) use the same drawing for both.
- Colours: only `currentColor` and `none` (and `#fff`/`#000` inside a mask). No opacity, styles, scripts, images or text.
- Names are plain, lowercase and kebab-case: `dashboard`, `caret-down`, `user-plus`.

## Coming from Phosphor or Lucide

<!-- map:start -->
| Plume | Phosphor | Lucide |
|---|---|---|
| `arrow-down` | `arrow-down` | `arrow-down` |
| `arrow-left` | `arrow-left` | `arrow-left` |
| `arrow-right` | `arrow-right` | `arrow-right` |
| `arrow-up` | `arrow-up` | `arrow-up` |
| `arrow-up-right` | `arrow-up-right` | `arrow-up-right` |
| `bell` | `bell` | `bell` |
| `bell-ring` | `bell-ringing` | `bell-ring` |
| `bot` | `robot` | `bot` |
| `brand` | `buildings`, `diamond` | `building-2`, `gem` |
| `calendar` | `calendar-blank`, `calendar` | `calendar` |
| `caret-down` | `caret-down` | `chevron-down` |
| `caret-left` | `caret-left` | `chevron-left` |
| `caret-right` | `caret-right` | `chevron-right` |
| `caret-up` | `caret-up` | `chevron-up` |
| `caret-up-down` | `caret-up-down` | `chevrons-up-down` |
| `chats` | `chats`, `chat-circle-text`, `chat-centered-text` | `messages-square` |
| `check` | `check` | `check` |
| `dashboard` | `layout` | `layout-dashboard`, `layout-panel-left` |
| `dots` | `dots-three` | `ellipsis` |
| `dots-vertical` | `dots-three-vertical` | `ellipsis-vertical` |
| `expand` | `arrows-out` | `expand`, `maximize-2` |
| `external-link` | `arrow-square-out` | `external-link`, `square-arrow-out-up-right` |
| `gear` | `gear`, `gear-six` | `settings`, `cog` |
| `globe` | `globe`, `globe-simple` | `globe`, `earth` |
| `grid` | `squares-four` | `layout-grid` |
| `help` | `question` | `circle-help`, `badge-help` |
| `home` | `house`, `house-simple` | `house`, `home` |
| `info` | `info` | `info`, `badge-info` |
| `link` | `link`, `link-simple` | `link`, `link-2` |
| `list` | `list-bullets` | `list` |
| `list-checks` | `list-checks`, `check-square` | `list-checks`, `square-check` |
| `menu` | `list` | `menu` |
| `minus` | `minus` | `minus` |
| `moon` | `moon` | `moon` |
| `panel-right` | `sidebar` | `panel-right` |
| `plus` | `plus` | `plus` |
| `radar` | `pulse`, `circle-notch` | `radar`, `loader` |
| `search` | `magnifying-glass` | `search` |
| `sidebar` | `sidebar-simple` | `panel-left` |
| `sign-in` | `sign-in` | `log-in` |
| `sign-out` | `sign-out` | `log-out` |
| `sort` | `arrows-down-up` | `arrow-up-down` |
| `sun` | `sun` | `sun` |
| `user` | `user` | `user` |
| `user-plus` | `user-plus` | `user-plus` |
| `users` | `users` | `users` |
| `x` | `x` | `x` |
<!-- map:end -->

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: `npm run new -- <name> --category <c> --tags a,b`, draw both files, `npm run sheet -- <name>` to review, `npm test`.

## Licence

MIT. See [LICENSE](LICENSE).
