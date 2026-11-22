import { test, expect } from '@playwright/test';

test('search filters the grid', async ({ page }) => {
  await page.goto('./');
  expect(await page.locator('#grid li:not([hidden])').count()).toBeGreaterThan(40);
  await page.fill('#q', 'cog');
  await expect(page.locator('#grid li:not([hidden])')).toHaveCount(1);
  await expect(page.locator('#grid li:not([hidden])')).toHaveAttribute('data-name', 'gear');
  await page.fill('#q', 'zzzz');
  await expect(page.locator('#empty')).toBeVisible();
});

test('variant switch shows the fill icons', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-name="bell"] .v-line')).toBeVisible();
  await page.click('[data-variant="fill"]');
  await expect(page.locator('[data-name="bell"] .v-fill')).toBeVisible();
  await expect(page.locator('[data-name="bell"] .v-line')).toBeHidden();
});

test('detail dialog copies SVG, JSX and Astro, and downloads', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  await page.click('[data-open="gear"]');
  await expect(page.locator('#detail')).toBeVisible();
  await expect(page.locator('#d-name')).toHaveText('gear');
  await page.click('[data-copy="svg"]');
  const svg = await page.evaluate(() => navigator.clipboard.readText());
  expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  expect(svg).not.toContain('%id%');
  await page.click('[data-dvariant="fill"]');
  await page.click('[data-copy="jsx"]');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<Gear variant="fill" />');
  await page.click('[data-copy="astro"]');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<Icon name="gear" variant="fill" />');
  const download = page.waitForEvent('download');
  await page.click('[data-download]');
  expect((await download).suggestedFilename()).toBe('gear-fill.svg');
});

test('theme toggle switches and remembers', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.click('[data-theme-toggle]');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('docs pages load and the name map filters', async ({ page }) => {
  for (const p of ['docs/', 'docs/react/', 'docs/astro/', 'docs/svg/', 'docs/iconify/', 'docs/style/', 'docs/migrate/']) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(200);
    await expect(page.locator('article h1')).toBeVisible();
  }
  await page.goto('docs/migrate/');
  await page.fill('#find', 'gear-six');
  await expect(page.locator('#rows tr:not([hidden])')).toHaveCount(1);
});
