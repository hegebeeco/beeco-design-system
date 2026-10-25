import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  use: { viewport: { width: 1700, height: 2100 } },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  reporter: [["list"], ["html", { open: "never" }]]
});
