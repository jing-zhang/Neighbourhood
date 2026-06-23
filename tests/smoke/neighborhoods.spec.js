import { test, expect } from "@playwright/test";

test.describe("Neighborhoods smoke tests", () => {
  test("page loads with title and feed panel", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Neighborhoods/);
    await expect(page.locator(".feed-panel")).toBeVisible();
    await expect(page.locator("#map-container")).toBeVisible();
  });

  test("theme toggle switches to dark mode", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.click("[data-theme-toggle]");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme toggle switches back to light mode", async ({ page }) => {
    await page.goto("/");
    await page.click("[data-theme-toggle]");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.click("[data-theme-toggle]");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("feed category filter chips are present", async ({ page }) => {
    await page.goto("/");
    const chips = page.locator("[data-category]");
    await expect(chips).toHaveCount(5);
    await expect(chips.first()).toHaveText("All");
  });

  test("clicking a category filter filters posts", async ({ page }) => {
    await page.goto("/");
    await page.click("[data-category='sale']");
    // Only one post card should be visible
    await expect(page.locator("[data-post-id]")).toHaveCount(1);
    await expect(page.locator("[data-post-id='post-desk-giveaway']")).toBeVisible();
  });

  test("search input filters posts", async ({ page }) => {
    await page.goto("/");
    await page.fill("[data-search-input]", "farmers");
    await expect(page.locator("[data-post-id]")).toHaveCount(1);
    await expect(page.locator("[data-post-id='post-farmers-market']")).toBeVisible();
  });

  test("new post button opens creation modal", async ({ page }) => {
    await page.goto("/");
    await page.click("[data-new-post-button]");
    await expect(page.locator("[data-post-form]")).toBeVisible();
    await expect(page.locator("input[name='title']")).toBeVisible();
    await expect(page.locator("textarea[name='summary']")).toBeVisible();
    await expect(page.locator("select[name='category']")).toBeVisible();
  });

  test("modal close button hides modal", async ({ page }) => {
    await page.goto("/");
    await page.click("[data-new-post-button]");
    await expect(page.locator("[data-post-form]")).toBeVisible();
    await page.click("[data-close-modal]");
    await expect(page.locator("[data-post-form]")).not.toBeVisible();
  });

  test("feed card hover highlight", async ({ page }) => {
    await page.goto("/");
    const postCard = page.locator("[data-post-id='post-bike-light']");
    await postCard.hover();
    // Card should have hover/active state
    await expect(postCard).toHaveClass(/active/);
  });

  test("mobile viewport hides sidebar and shows view toggle", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator(".sidebar")).not.toBeVisible();
    await expect(page.locator(".view-toggle")).toBeVisible();
  });

  test("mobile feed/map toggle switches panel", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Default: feed view
    await expect(page.locator(".feed-panel")).toBeVisible();
    await expect(page.locator(".map-panel")).not.toBeVisible();

    // Switch to map view
    await page.click("[data-view='map']");
    await expect(page.locator(".feed-panel")).not.toBeVisible();
    await expect(page.locator(".map-panel")).toBeVisible();

    // Switch back to feed view
    await page.click("[data-view='feed']");
    await expect(page.locator(".feed-panel")).toBeVisible();
    await expect(page.locator(".map-panel")).not.toBeVisible();
  });
});
