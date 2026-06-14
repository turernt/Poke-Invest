import { test, expect } from "@playwright/test";

test.describe("Homepage publique", () => {
  test("se charge et affiche le CTA", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/PokéInvest|PokeInvest/i);
    // CTA link vers inscription
    await expect(
      page.getByRole("link", { name: /commencer|créer|inscription/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("page CGU accessible", async ({ page }) => {
    await page.goto("/cgu");
    await expect(page.locator("h1")).toContainText(/condition|CGU/i);
  });

  test("page Confidentialité accessible", async ({ page }) => {
    await page.goto("/confidentialite");
    await expect(page.locator("h1")).toContainText(/confidentialit|vie privée/i);
  });

  test("redirige /dashboard vers /connexion si non connecté", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/connexion/);
  });
});
