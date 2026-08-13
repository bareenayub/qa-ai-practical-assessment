// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');
const { buildRegistrationUser } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-REG-001 (API variant)
 * AC1: User Authentication & Cart Creation
 */
test.describe('API User Registration @smoke', () => {
  /** @type {ApiClient} */
  let api;

  test.beforeAll(async () => {
    api = await ApiClient.create();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('TC-API-REG-001: Register a new user via API', async () => {
    const user = buildRegistrationUser();
    const response = await api.register(user);

    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(`Registration failed (${response.status()}): ${errorBody}`);
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(user.email);
    expect(body.id).toBeTruthy();
  });
});
