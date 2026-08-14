// @ts-check
// Demo order: 03 — registration (only registration in the suite)
const { test, expect } = require('../../fixtures/demoTest');
const { registerUser } = require('../../helpers/uiFlows');
const { rememberSuiteUser } = require('../../helpers/sharedSession');

/** Manual traceability: TC-REG-001 | Smoke */
test.describe('User Registration @smoke', () => {
  test('TC-UI-REG-001: Successful new user registration with valid data', async ({ page }) => {
    const user = await registerUser(page);
    rememberSuiteUser(user);

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });
});
