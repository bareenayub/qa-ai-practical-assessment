# AI Prompts – Test Data

Prompts used to generate and refine test data for UI + API automation.

---

## Entry 1: API Registration Payload

- **Prompt:** What is the correct JSON structure for POST /users/register on the Toolshop API?
- **AI Response Summary:** Registration requires nested `address` object (street, city, state, country, postal_code), unique email, password with uppercase/lowercase/number/symbol, and dob between 18–75 years ago.
- **Validation Notes:** Confirmed against OpenAPI spec at `/docs`. Updated `buildRegistrationUser()` to use nested address and `@example.com` emails.

## Entry 2: UI Registration Form Data

- **Prompt:** Map API registration fields to UI form `data-test` selectors on /auth/register.
- **AI Response Summary:** UI uses flat fields (country, postal_code, etc.) while API uses nested address. Created `buildUiRegistrationUser()` for UI and `buildRegistrationUser()` for API.
- **Validation Notes:** UI registration spec uses flat helper; API specs use nested helper.

## Entry 3: Invoice API Payload

- **Prompt:** Generate invoice POST body for Cash on Delivery checkout.
- **AI Response Summary:** Payload includes billing_street, billing_city, billing_state, billing_country, billing_postal_code, payment_method: "cash-on-delivery", cart_id, payment_details: {}.
- **Validation Notes:** Matches assignment PDF example. Implemented in `buildInvoicePayload()`.

## Entry 4: Default Test Credentials

- **Prompt:** What test accounts are available for the Toolshop demo?
- **AI Response Summary:** customer@practicesoftwaretesting.com / welcome01 and customer2@practicesoftwaretesting.com / welcome01.
- **Validation Notes:** Used for login smoke tests; registration tests always use unique emails.

## Entry 5: Product Search Keywords

- **Prompt:** Suggest stable search keywords for Toolshop catalog tests.
- **AI Response Summary:** "Hammer" and "Pliers" return consistent in-stock results.
- **Validation Notes:** Used in UI search/details/cart tests and API search test.
