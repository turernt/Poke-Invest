import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

// Helper: inject Supabase session so the dashboard auth guard passes
async function injectSession(page: import("@playwright/test").Page) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gikpqthgpzbsfadvltvt.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const { data } = await sb.auth.signInWithPassword({
    email: process.env.E2E_EMAIL ?? "repoc78948@hotkev.com",
    password: process.env.E2E_PASSWORD ?? "Azerty91$!",
  });
  if (!data.session) throw new Error("Login failed in test setup");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gikpqthgpzbsfadvltvt.supabase.co";
  const ref = new URL(supabaseUrl).hostname.split(".")[0];
  await page.goto("/");
  await page.evaluate(
    ({ session, storageKey }) => localStorage.setItem(storageKey, JSON.stringify(session)),
    { session: data.session, storageKey: `sb-${ref}-auth-token` }
  );
}

test.describe("Dashboard — Vue d'ensemble", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/dashboard");
    await page.waitForSelector(".page-title", { timeout: 10000 });
  });

  test("affiche le titre Vue d'ensemble", async ({ page }) => {
    await expect(page.locator(".page-title")).toContainText("Vue d'ensemble");
  });

  test("affiche les 4 stat cards", async ({ page }) => {
    await expect(page.locator(".stat-card")).toHaveCount(4);
  });

  test("affiche la sidebar avec les 5 liens de navigation", async ({ page }) => {
    const navLinks = page.locator(".sidebar .nav a");
    await expect(navLinks).toHaveCount(6); // 5 pages + Référentiel
  });

  test("le lien Cartes à l'unité navigue correctement", async ({ page }) => {
    await page.click("text=Cartes à l'unité");
    await expect(page).toHaveURL(/cartes_unite/);
    await expect(page.locator(".page-title")).toContainText("Cartes à l'unité");
  });
});

test.describe("Dashboard — Cartes à l'unité", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/dashboard/cartes_unite");
    await page.waitForSelector(".page-title", { timeout: 10000 });
  });

  test("affiche la table d'inventaire", async ({ page }) => {
    await expect(page.locator(".inv-table")).toBeVisible();
  });

  test("le bouton Ajouter ouvre le modal", async ({ page }) => {
    await page.click(".btn-add");
    await expect(page.locator(".modal-overlay.active")).toBeVisible();
    await expect(page.locator(".modal-title")).toContainText("Ajouter");
  });

  test("l'autocomplete suggère des cartes après 2 caractères", async ({ page }) => {
    await page.click(".btn-add");
    await page.waitForSelector(".modal-overlay.active");
    // Type in the carte name input
    const carteInput = page.locator('.modal-overlay input[placeholder*="Dracaufeu"]');
    await carteInput.fill("Char");
    // Wait for suggestions (debounced 300ms + API call)
    await expect(page.locator(".scan-suggestions")).toBeVisible({ timeout: 5000 });
    const count = await page.locator(".scan-suggestions li").count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("cliquer sur une suggestion remplit le formulaire", async ({ page }) => {
    await page.click(".btn-add");
    await page.waitForSelector(".modal-overlay.active");
    const carteInput = page.locator('.modal-overlay input[placeholder*="Dracaufeu"]');
    await carteInput.fill("Charizard");
    await page.waitForSelector(".scan-suggestions li", { timeout: 5000 });
    // Click first suggestion
    await page.locator(".scan-suggestions li").first().click();
    // Carte name should be filled and suggestions hidden
    await expect(page.locator(".scan-suggestions")).not.toBeVisible();
    const value = await carteInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test("la validation empêche la soumission sans nom", async ({ page }) => {
    await page.click(".btn-add");
    await page.waitForSelector(".modal-overlay.active");
    await page.click(".btn-submit");
    // Toast error should appear
    await expect(page.locator(".toast-error, [class*='toast-error']")).toBeVisible({ timeout: 3000 });
  });

  test("les vue liste / galerie basculent", async ({ page }) => {
    await expect(page.locator(".inv-table")).toBeVisible();
    await page.click(".view-btn:last-child"); // gallery button
    await expect(page.locator(".gallery-grid")).toBeVisible();
    await expect(page.locator(".inv-table")).not.toBeVisible();
  });

  test("fermer le modal avec la croix", async ({ page }) => {
    await page.click(".btn-add");
    await page.waitForSelector(".modal-overlay.active");
    await page.click(".modal-close");
    await expect(page.locator(".modal-overlay.active")).not.toBeVisible();
  });
});

test.describe("Dashboard — Navigation entre pages", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/dashboard");
    await page.waitForSelector(".sidebar");
  });

  test("Cartes Gradées charge correctement", async ({ page }) => {
    await page.goto("/dashboard/cartes_pca");
    await expect(page.locator(".page-title")).toContainText("Gradées");
  });

  test("Items Scellés charge correctement", async ({ page }) => {
    await page.goto("/dashboard/items_scelles");
    await expect(page.locator(".page-title")).toContainText("Scellés");
  });

  test("Mastersets charge correctement", async ({ page }) => {
    await page.goto("/dashboard/mastersets");
    await expect(page.locator(".page-title")).toContainText("Mastersets");
  });

  test("Profil charge correctement", async ({ page }) => {
    await page.goto("/dashboard/profile");
    await expect(page.locator(".page-title")).toContainText("Profil");
  });

  test("le toggle de thème bascule dark/light", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector(".sidebar");
    const html = page.locator("html");
    const before = await html.getAttribute("data-theme");
    await page.click(".theme-toggle");
    const after = await html.getAttribute("data-theme");
    expect(after).not.toBe(before);
  });
});
