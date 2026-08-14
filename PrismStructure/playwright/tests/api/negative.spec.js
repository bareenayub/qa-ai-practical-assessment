// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');
const { uniqueEmail } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-NEG-001 (API variant)
 */
test.describe('API Negative Scenarios @regression', () => {
  /** @type {ApiClient} */
  let api;

  test.beforeAll(async () => {
    api = await ApiClient.create();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('TC-API-NEG-001: Reject invalid login credentials', async () => {
    const response = await api.login(uniqueEmail('invalid.user'), 'invalid-password-xyz');

    expect([401, 422]).toContain(response.status());
    expect(api.token).toBeNull();
  });

  test('TC-API-NEG-002: Reject invoice creation without authentication', async () => {
    const cartResponse = await api.createCart();
    const cartId = (await cartResponse.json()).id;

    const unauthClient = await ApiClient.create();
    const invoiceResponse = await unauthClient.createInvoice(cartId);
    expect(invoiceResponse.status()).toBe(401);
    await unauthClient.dispose();
  });
});
