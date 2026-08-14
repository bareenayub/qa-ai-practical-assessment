/**
 * Shares one registered user across UI tests in the same Playwright worker.
 * Registration runs once in 01-registration; later tests log in with the same credentials.
 */

const { DEFAULT_ADDRESS } = require('../fixtures/testData');

/** @type {Record<string, string> | null} */
let suiteUser = null;

function withCheckoutAddress(user) {
  return { ...DEFAULT_ADDRESS, ...user, ...(user.address || {}) };
}

function rememberSuiteUser(user) {
  suiteUser = withCheckoutAddress(user);
  return suiteUser;
}

function getSuiteUser() {
  return suiteUser;
}

function clearSuiteUser() {
  suiteUser = null;
}

module.exports = {
  rememberSuiteUser,
  getSuiteUser,
  clearSuiteUser,
  withCheckoutAddress,
};
