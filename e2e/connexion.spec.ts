import { test, expect } from "@playwright/test";

test.describe("Page connexion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/connexion");
  });

  test("affiche le formulaire de connexion", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("affiche une erreur avec des identifiants invalides", async ({ page }) => {
    await page.fill('input[type="email"]', "faux@exemple.com");
    await page.fill('input[type="password"]', "mauvais_mdp");
    await page.click('button[type="submit"]');
    // Error toast or message should appear
    await expect(
      page.locator('[class*="toast"],[class*="error"],[class*="alert"]').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("lien vers inscription visible", async ({ page }) => {
    await expect(page.locator("text=Créer un compte")).toBeVisible();
  });
});
