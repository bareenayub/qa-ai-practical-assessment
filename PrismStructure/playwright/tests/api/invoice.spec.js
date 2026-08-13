// @ts-check
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../api/ApiClient');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-CHK-001, TC-INV-001 (API variant)
 * AC2: Product Selection & Invoice Generation
 */
test.describe('API Invoice @regression', () => {
  /** @type {ApiClient} */
  let api;
  let productId;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    await api.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);

    const productsResponse = await api.getProducts();
    productId = (await productsResponse.json()).data[0].id;
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  async function createCartWithProduct() {
    const cartResponse = await api.createCart();
    expect(cartResponse.status()).toBe(201);
    const cartId = (await cartResponse.json()).id;
    const addResponse = await api.addProductToCart(cartId, productId, 1);
    expect(addResponse.status()).toBe(200);
    return cartId;
  }

  test('TC-API-INV-001: Generate invoice with COD payment details', async () => {
    const cartId = await createCartWithProduct();

    const paymentCheck = await api.checkPayment('cash-on-delivery', {});
    expect(paymentCheck.status()).toBe(200);

    const invoiceResponse = await api.createInvoice(cartId);
    expect(invoiceResponse.status()).toBe(201);

    const invoice = await invoiceResponse.json();
    expect(invoice.id).toBeTruthy();
    expect(invoice.invoice_number).toBeTruthy();
    expect(invoice.billing_street).toBeTruthy();
    expect(Number(invoice.total)).toBeGreaterThan(0);
  });

  test('TC-API-INV-002: List and retrieve invoice by ID', async () => {
    const cartId = await createCartWithProduct();

    const invoiceResponse = await api.createInvoice(cartId);
    expect(invoiceResponse.status()).toBe(201);
    const created = await invoiceResponse.json();

    const listResponse = await api.getInvoices();
    expect(listResponse.status()).toBe(200);
    const list = await listResponse.json();
    expect(list.data.length).toBeGreaterThan(0);

    const detailResponse = await api.getInvoice(created.id);
    expect(detailResponse.status()).toBe(200);
    const detail = await detailResponse.json();
    expect(detail.invoice_number).toBe(created.invoice_number);
    expect(Number(detail.total)).toBeGreaterThan(0);
  });
});
