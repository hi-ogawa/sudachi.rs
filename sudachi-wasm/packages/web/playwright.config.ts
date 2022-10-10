import type { PlaywrightTestConfig } from "@playwright/test";

const PORT = 3435;

const config: PlaywrightTestConfig = {
  testDir: "./src/e2e",
  use: {
    baseURL: "http://localhost:" + PORT,
    actionTimeout: 5_000,
    navigationTimeout: 5_000,
    // TODO: this makes tests extremely slow and flaky
    // trace: "on",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  webServer: {
    command: "npm run dev:e2e >> dev-e2e.log 2>&1",
    port: PORT,
    reuseExistingServer: true,
  },
};

export default config;
