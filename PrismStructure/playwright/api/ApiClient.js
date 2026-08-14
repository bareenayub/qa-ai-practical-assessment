/**
 * REST API client for Toolshop (https://api.practicesoftwaretesting.com).
 */

const { request: playwrightRequest } = require('@playwright/test');
const { buildInvoicePayload } = require('../fixtures/testData');

const API_BASE_URL = 'https://api.practicesoftwaretesting.com';

class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} [requestContext]
   */
  constructor(requestContext) {
    this.request = requestContext;
    this.token = null;
  }

  static async create() {
    const requestContext = await playwrightRequest.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
      timeout: 45_000,
    });
    return new ApiClient(requestContext);
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async register(user) {
    const response = await this.request.post('/users/register', {
      data: user,
    });
    return response;
  }

  async login(email, password) {
    const response = await this.request.post('/users/login', {
      data: { email, password },
    });
    if (response.ok()) {
      const body = await response.json();
      this.token = body.access_token;
    }
    return response;
  }

  async createCart() {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await this.request.post('/carts', {
          headers: this.authHeaders(),
          timeout: 30_000,
        });
      } catch (error) {
        const isTimeout = /timeout/i.test(String(error.message));
        if (!isTimeout || attempt === maxAttempts) {
          throw error;
        }
      }
    }

    throw new Error('createCart failed after retries');
  }

  async getCart(cartId) {
    return this.request.get(`/carts/${cartId}`, {
      headers: this.authHeaders(),
    });
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    return this.request.post(`/carts/${cartId}`, {
      headers: this.authHeaders(),
      data: { product_id: productId, quantity },
    });
  }

  async updateCartQuantity(cartId, productId, quantity) {
    return this.request.put(`/carts/${cartId}/product/quantity`, {
      headers: this.authHeaders(),
      data: { product_id: productId, quantity },
    });
  }

  async searchProducts(query) {
    return this.request.get('/products/search', {
      params: { q: query },
    });
  }

  async getProducts() {
    return this.request.get('/products');
  }

  async getProduct(productId) {
    return this.request.get(`/products/${productId}`);
  }

  async checkPayment(paymentMethod = 'cash-on-delivery', paymentDetails = {}) {
    return this.request.post('/payment/check', {
      data: {
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      },
    });
  }

  async createInvoice(cartId, overrides = {}) {
    return this.request.post('/invoices', {
      headers: this.authHeaders(),
      data: buildInvoicePayload(cartId, overrides),
    });
  }

  async getInvoices() {
    return this.request.get('/invoices', {
      headers: this.authHeaders(),
    });
  }

  async getInvoice(invoiceId) {
    return this.request.get(`/invoices/${invoiceId}`, {
      headers: this.authHeaders(),
    });
  }

  async dispose() {
    await this.request.dispose();
  }
}

module.exports = { ApiClient, API_BASE_URL };
