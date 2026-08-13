// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');
const { buildRegistrationUser, DEFAULT_CUSTOMER } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-LOG-001 (API variant)
 * AC1: User Authentication & Cart Creation
 */
test.describe('API Authentication @smoke', () => {
  /** @type {ApiClient} */
  let api;

  test.beforeAll(async () => {
    api = await ApiClient.create();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('TC-API-LOG-001: Login and obtain bearer token', async () => {
    const response = await api.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    expect(body.token_type.toLowerCase()).toBe('bearer');
    expect(api.token).toBeTruthy();
  });

  test('TC-API-CRT-001: Create a new cart with bearer token', async () => {
    const user = buildRegistrationUser();
    const registerResponse = await api.register(user);
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await api.login(user.email, user.password);
    expect(loginResponse.status()).toBe(200);

    const cartResponse = await api.createCart();
    expect(cartResponse.status()).toBe(201);

    const cart = await cartResponse.json();
    expect(cart.id).toBeTruthy();
  });
});
