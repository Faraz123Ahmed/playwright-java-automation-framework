// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    headless: false,
    launchOptions: {
    slowMo: 500
  }

  },

  projects: [
  {
    name: 'Chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome',
      
    },
  },
 ],
});