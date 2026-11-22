import { defineConfig, devices } from '@playwright/test';

// Smoke tests against the built site (npm run build first). Playwright starts and stops the preview server.
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4329/plume-icons/', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'npx astro preview --port 4329',
    url: 'http://localhost:4329/plume-icons/',
    reuseExistingServer: !process.env.CI,
  },
});
