// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');
const { buildRegistrationUser } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-CRT-001 (API variant)
 */
test.describe('API Cart @smoke', () => {
  /** @type {ApiClient} */
  let api;
  let cartId;
  let productId;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    const user = buildRegistrationUser();
    await api.register(user);
    await api.login(user.email, user.password);

    const cartResponse = await api.createCart();
    const cart = await cartResponse.json();
    cartId = cart.id;

    const productsResponse = await api.getProducts();
    const products = await productsResponse.json();
    productId = products.data[0].id;
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('TC-API-CAR-001: Add product to cart and verify contents', async () => {
    const addResponse = await api.addProductToCart(cartId, productId, 2);
    expect(addResponse.status()).toBe(200);

    const addBody = await addResponse.json();
    expect(addBody.result).toMatch(/added|updated/i);

    const cartResponse = await api.getCart(cartId);
    expect(cartResponse.status()).toBe(200);

    const cart = await cartResponse.json();
    expect(cart.id).toBe(cartId);

    const items = cart.cart_items || cart.items || cart.cartItems || [];
    if (items.length > 0) {
      expect(items[0].product.id).toBe(productId);
      expect(items[0].quantity).toBe(2);
    }
  });
});
