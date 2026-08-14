/**
 * Test data helpers for Toolshop UI and API automation.
 * Registration uses unique emails to avoid duplicate-account failures.
 */

const DEFAULT_CUSTOMER = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

const DEFAULT_ADDRESS = {
  country: 'US',
  postal_code: '12345',
  house_number: '101',
  street: '101 Testing Way',
  city: 'New York',
  state: 'New York',
};

/** Fallback search terms when demo catalog stock changes on the live site. */
const IN_STOCK_SEARCH_KEYWORDS = [
  'Saw',
  'Hammer',
  'Screwdriver',
  'Tape',
  'WD-40',
  'Bolt',
  'Drill',
  'Pliers',
];

function uniqueEmail(prefix = 'qa.auto') {
  const stamp = Date.now();
  const random = Math.floor(Math.random() * 10_000);
  return `${prefix}.${stamp}.${random}@example.com`;
}

function buildRegistrationUser(overrides = {}) {
  const { address: addressOverrides, ...rest } = overrides;
  const email = rest.email || uniqueEmail();
  const password = rest.password || 'Pass$w0rd1';

  return {
    first_name: 'QA',
    last_name: 'Automation',
    dob: '1990-01-15',
    phone: '0987654321',
    email,
    password,
    address: {
      street: DEFAULT_ADDRESS.street,
      house_number: DEFAULT_ADDRESS.house_number,
      city: DEFAULT_ADDRESS.city,
      state: DEFAULT_ADDRESS.state,
      country: DEFAULT_ADDRESS.country,
      postal_code: DEFAULT_ADDRESS.postal_code,
      ...addressOverrides,
    },
    ...rest,
  };
}

/** Flat address fields for UI registration form. */
function buildUiRegistrationUser(overrides = {}) {
  const apiUser = buildRegistrationUser(overrides);
  return {
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    dob: apiUser.dob,
    country: apiUser.address.country,
    postal_code: apiUser.address.postal_code,
    house_number: apiUser.address.house_number,
    street: apiUser.address.street,
    city: apiUser.address.city,
    state: apiUser.address.state,
    phone: apiUser.phone,
    email: apiUser.email,
    password: apiUser.password,
  };
}

function buildInvoicePayload(cartId, overrides = {}) {
  return {
    billing_street: 'Zoey Shore',
    billing_city: 'Hesselbury',
    billing_state: 'Florida',
    billing_country: 'TG',
    billing_postal_code: '1234AA',
    payment_method: 'cash-on-delivery',
    cart_id: cartId,
    payment_details: {},
    ...overrides,
  };
}

module.exports = {
  DEFAULT_CUSTOMER,
  DEFAULT_ADDRESS,
  IN_STOCK_SEARCH_KEYWORDS,
  uniqueEmail,
  buildRegistrationUser,
  buildUiRegistrationUser,
  buildInvoicePayload,
};
