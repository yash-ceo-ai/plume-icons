# Plume Icons

Soft, rounded icons with a line and a fill version of each, for plain SVG, React (Next.js), Astro and Iconify.
<!-- count:start -->105<!-- count:end --> icons so far, MIT licensed.

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
| `alert-circle` | `warning-circle` | `circle-alert` |
| `arrow-down` | `arrow-down` | `arrow-down` |
| `arrow-left` | `arrow-left` | `arrow-left` |
| `arrow-right` | `arrow-right` | `arrow-right` |
| `arrow-up` | `arrow-up` | `arrow-up` |
| `arrow-up-right` | `arrow-up-right` | `arrow-up-right` |
| `arrows-left-right` | `arrows-left-right` | `arrow-left-right` |
| `badge-check` | `seal-check` | `badge-check` |
| `bell` | `bell` | `bell` |
| `bell-ring` | `bell-ringing` | `bell-ring` |
| `bot` | `robot` | `bot` |
| `brand` | `buildings`, `diamond` | `building-2`, `gem` |
| `calendar` | `calendar-blank`, `calendar` | `calendar` |
| `calendar-clock` | `calendar-dots`, `calendar-clock` | `calendar-clock` |
| `caret-down` | `caret-down` | `chevron-down` |
| `caret-left` | `caret-left` | `chevron-left` |
| `caret-right` | `caret-right` | `chevron-right` |
| `caret-up` | `caret-up` | `chevron-up` |
| `caret-up-down` | `caret-up-down` | `chevrons-up-down` |
| `chart-bar` | `chart-bar`, `chart-bar-horizontal` | `chart-column`, `chart-no-axes-column` |
| `chart-line` | `chart-line`, `chart-line-up` | `chart-line`, `chart-spline` |
| `chart-pie` | `chart-pie-slice`, `chart-pie` | `chart-pie` |
| `chats` | `chats`, `chat-circle-text`, `chat-centered-text` | `messages-square` |
| `check` | `check` | `check` |
| `check-circle` | `check-circle` | `circle-check`, `circle-check-big` |
| `circle-dashed` | `circle-dashed` | `circle-dashed` |
| `clock` | `clock` | `clock` |
| `coins` | `coins` | `coins` |
| `copy` | `copy` | `copy` |
| `crown` | `crown`, `crown-simple` | `crown` |
| `cursor` | `cursor`, `navigation-arrow` | `mouse-pointer-2`, `mouse-pointer` |
| `dashboard` | `layout` | `layout-dashboard`, `layout-panel-left` |
| `dots` | `dots-three` | `ellipsis` |
| `dots-vertical` | `dots-three-vertical` | `ellipsis-vertical` |
| `download` | `download-simple`, `download` | `download` |
| `edit` | `note-pencil`, `pencil-simple-line` | `square-pen`, `file-pen-line` |
| `expand` | `arrows-out` | `expand`, `maximize-2` |
| `external-link` | `arrow-square-out` | `external-link`, `square-arrow-out-up-right` |
| `eye` | `eye` | `eye` |
| `filter` | `funnel-simple`, `funnel` | `list-filter`, `filter` |
| `fingerprint` | `fingerprint` | `fingerprint` |
| `flag` | `flag` | `flag` |
| `gear` | `gear`, `gear-six` | `settings`, `cog` |
| `globe` | `globe`, `globe-simple` | `globe`, `earth` |
| `grid` | `squares-four` | `layout-grid` |
| `help` | `question` | `circle-help`, `badge-help` |
| `history` | `clock-counter-clockwise` | `history` |
| `home` | `house`, `house-simple` | `house`, `home` |
| `inbox` | `tray` | `inbox` |
| `info` | `info` | `info`, `badge-info` |
| `key` | `key` | `key-round`, `key` |
| `lightbulb` | `lightbulb` | `lightbulb` |
| `lightning` | `lightning` | `zap` |
| `link` | `link`, `link-simple` | `link`, `link-2` |
| `list` | `list-bullets` | `list` |
| `list-checks` | `list-checks`, `check-square` | `list-checks`, `square-check` |
| `lock` | `lock`, `lock-simple` | `lock` |
| `magic-wand` | `magic-wand` | `wand-sparkles`, `wand` |
| `mail` | `envelope-simple`, `envelope` | `mail` |
| `menu` | `list` | `menu` |
| `minus` | `minus` | `minus` |
| `minus-circle` | `minus-circle` | `circle-minus` |
| `moon` | `moon` | `moon` |
| `panel-right` | `sidebar` | `panel-right` |
| `paperclip` | `paperclip` | `paperclip` |
| `pause` | `pause` | `pause` |
| `pencil` | `pencil-simple`, `pencil` | `pencil` |
| `percent` | `percent` | `percent` |
| `pin` | `push-pin` | `pin` |
| `play` | `play` | `play` |
| `plus` | `plus` | `plus` |
| `radar` | `pulse`, `circle-notch` | `radar`, `loader` |
| `refresh` | `arrow-clockwise`, `arrows-clockwise` | `rotate-cw`, `refresh-cw` |
| `scan` | `scan` | `scan`, `scan-line` |
| `search` | `magnifying-glass` | `search` |
| `send` | `paper-plane-tilt`, `paper-plane-right` | `send` |
| `share` | `share-network` | `share-2` |
| `shield` | `shield` | `shield` |
| `shield-check` | `shield-check` | `shield-check` |
| `sidebar` | `sidebar-simple` | `panel-left` |
| `sign-in` | `sign-in` | `log-in` |
| `sign-out` | `sign-out` | `log-out` |
| `sliders` | `sliders-horizontal`, `faders-horizontal` | `sliders-horizontal`, `settings-2` |
| `smiley` | `smiley` | `smile` |
| `smiley-meh` | `smiley-meh` | `meh` |
| `smiley-sad` | `smiley-sad` | `frown` |
| `sort` | `arrows-down-up` | `arrow-up-down` |
| `sparkle` | `sparkle` | `sparkle`, `sparkles` |
| `spinner` | `spinner`, `circle-notch`, `spinner-gap` | `loader-circle` |
| `stop` | `stop` | `square` |
| `sun` | `sun` | `sun` |
| `table` | `table` | `table`, `table-2` |
| `tag` | `tag`, `tag-simple` | `tag` |
| `target` | `target` | `target` |
| `thumbs-up` | `thumbs-up` | `thumbs-up` |
| `trash` | `trash`, `trash-simple` | `trash-2`, `trash` |
| `trend-down` | `trend-down` | `trending-down` |
| `trend-up` | `trend-up` | `trending-up` |
| `undo` | `arrow-u-up-left`, `arrow-counter-clockwise` | `undo-2` |
| `upload` | `upload-simple`, `upload` | `upload` |
| `user` | `user` | `user` |
| `user-plus` | `user-plus` | `user-plus` |
| `users` | `users` | `users` |
| `warning` | `warning` | `triangle-alert` |
| `x` | `x` | `x` |
<!-- map:end -->

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: `npm run new -- <name> --category <c> --tags a,b`, draw both files, `npm run sheet -- <name>` to review, `npm test`.

## Licence

MIT. See [LICENSE](LICENSE).
