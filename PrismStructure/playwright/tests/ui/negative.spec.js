// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');
const { registerAndLogin, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/**
 * Manual traceability: TC-NEG-001 | Regression
 * Part A: invalid credentials must stay on login and show an error.
 * Part B: valid session + cart quantity guard (uses fresh registration, not demo login retry).
 */
test.describe('Negative Scenarios @regression', () => {
  test('TC-UI-NEG-001: Reject invalid login and prevent invalid cart quantity update', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Part A1 — valid email, wrong password
    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, 'wrong-password-123', { expectSuccess: false });
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).not.toHaveURL(/\/account/);

    // Part A2 — dummy / non-existent email
    await loginPage.open();
    await loginPage.login('not-a-real-user@example.com', 'any-password', { expectSuccess: false });
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).not.toHaveURL(/\/account/);

    // Part B — cart quantity guard (requires authenticated user)
    await registerAndLogin(page);
    await addFirstSearchResultToCart(page, 'Hammer');

    const checkoutPage = await openCart(page);
    await checkoutPage.productQuantity.first().fill('0');
    await checkoutPage.productQuantity.first().blur();
    await expect(checkoutPage.productQuantity.first()).toHaveValue('1');
  });
});
