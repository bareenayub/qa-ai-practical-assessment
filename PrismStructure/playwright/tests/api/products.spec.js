// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');

/**
 * Manual traceability: TC-SRH-001, TC-PRD-001 (API variant)
 */
test.describe('API Products @regression', () => {
  /** @type {ApiClient} */
  let api;

  test.beforeAll(async () => {
    api = await ApiClient.create();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('TC-API-PRD-001: Retrieve product catalog', async () => {
    const response = await api.getProducts();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  test('TC-API-SRH-001: Search products by keyword', async () => {
    const response = await api.searchProducts('Hammer');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].name.toLowerCase()).toContain('hammer');
  });
});
