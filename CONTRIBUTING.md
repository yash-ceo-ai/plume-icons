# Contributing to Plume Icons

## Set up

```sh
npm install
npm test          # style check, build, unit tests
```

## Add an icon

1. Scaffold it:
   ```sh
   npm run new -- map-pin --category places --tags location,pin,address
   ```
   This writes `icons/line/map-pin.svg`, `icons/fill/map-pin.svg` and an entry in `icons/meta.json`.
2. Draw both files by hand (or export from your editor and clean up). Follow the style rules in the README. Add the
   Phosphor and Lucide names it replaces to `phosphor` and `lucide` in `meta.json`.
3. Review it next to its neighbours, at 16, 24 and 48px, dark and light:
   ```sh
   npm run build && npm run sheet -- map-pin home globe
   open .sheet/index.html
   ```
   `npm run sheet -- --png` also writes `.sheet/sheet.png`.
4. `npm run readme` updates the icon count and name table in the README.
5. `npm test` must pass. Open a pull request with a screenshot of the sheet.

Categories: navigation, actions, status, charts, communication, content, files, people, time, devices, media,
commerce, seo, ai, development, places, misc.

## Rules a reviewer checks by eye

- It reads at 16px. If it doesn't, take something away.
- It sits with its neighbours: same weight, same corner softness, similar visual size.
- The fill version has the same outline as the line version.
- It is drawn for Plume, not traced from another set.

## Release (maintainers)

1. Update `CHANGELOG.md` and the version in `package.json`.
2. `git tag v0.x.y && git push --tags`. The release workflow tests, builds and publishes to npm.
