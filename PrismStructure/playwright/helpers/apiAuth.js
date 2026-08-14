/**
 * Reliable API authentication for the shared demo environment.
 * Avoids flaky DEFAULT_CUSTOMER lockouts (401/423) by registering a unique user when needed.
 */

const { expect } = require('@playwright/test');
const { buildRegistrationUser, DEFAULT_CUSTOMER } = require('../fixtures/testData');

const FALLBACK_CUSTOMER = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01',
};

async function authenticateApi(api) {
  for (const customer of [DEFAULT_CUSTOMER, FALLBACK_CUSTOMER]) {
    const response = await api.login(customer.email, customer.password);
    if (response.status() === 200) {
      return customer;
    }
  }

  const user = buildRegistrationUser();
  const registerResponse = await api.register(user);
  expect(registerResponse.status()).toBe(201);

  const loginResponse = await api.login(user.email, user.password);
  expect(loginResponse.status()).toBe(200);

  return user;
}

/** Register a new user and log in — used when login itself is under test. */
async function registerAndLoginApi(api) {
  const user = buildRegistrationUser();
  const registerResponse = await api.register(user);
  expect(registerResponse.status()).toBe(201);

  const loginResponse = await api.login(user.email, user.password);
  expect(loginResponse.status()).toBe(200);

  return user;
}

module.exports = {
  authenticateApi,
  registerAndLoginApi,
};
