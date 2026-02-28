import { expect, test } from "@playwright/test";

test.describe("Public pages", () => {
    test("la page d'accueil FR est accessible", async ({ page }) => {
        await page.goto("/fr");
        await expect(page.getByAltText("Kubo Logo").first()).toBeVisible();
    });

    test("la page de login FR expose le formulaire", async ({ page }) => {
        await page.goto("/fr/login");
        await expect(page.locator("#email")).toBeVisible();
        await expect(page.locator("#password")).toBeVisible();
    });

    test("la page register FR est accessible", async ({ page }) => {
        await page.goto("/fr/register");
        await expect(page.getByAltText("Kubo Logo").first()).toBeVisible();
    });
});
