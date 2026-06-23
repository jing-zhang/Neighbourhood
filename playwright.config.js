import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/smoke",
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "python3 -m http.server 3000",
    port: 3000,
    timeout: 10000,
    reuseExistingServer: true,
  },
});
