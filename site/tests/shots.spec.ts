// Review screenshots of the site (not a test): SHOTS=1 npx playwright test shots -> test-results/shots/*.png
import { test } from '@playwright/test';

test.skip(!process.env.SHOTS, 'set SHOTS=1 to take review screenshots');

for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const theme of ['dark', 'light'] as const) {
    test(`shots ${w} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto('./');
      await page.screenshot({ path: `test-results/shots/home-${w}-${theme}.png` });
      await page.click('[data-open="chats"]');
      await page.screenshot({ path: `test-results/shots/detail-${w}-${theme}.png` });
      await page.goto('docs/react/');
      await page.screenshot({ path: `test-results/shots/docs-${w}-${theme}.png` });
    });
  }
}
