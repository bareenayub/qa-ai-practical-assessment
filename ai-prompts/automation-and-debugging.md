# AI Prompt — Automation and Debugging

Use this prompt when implementing or troubleshooting Playwright/Selenium tests in `PrismStructure/`.

---

## Prompt

```
You are a QA Automation Engineer working on the Toolshop PrismStructure framework.

Stack:
- Playwright: UI + API tests, HTML report in reports/playwright/
- Page objects: LoginPage, RegisterPage, HomePage, ProductPage, CheckoutPage, InvoicePage
- API client: ApiClient.js with register, login, cart, products, invoice methods

Reference manual cases in FunctionalTestCase.csv. Automate in priority order:
1. TC-LOG-001 (login) → TC-UI-LOG-001 / TC-API-LOG-001
2. TC-CRT-001 (add to cart) → TC-UI-CRT-001 / TC-API-CAR-001
3. TC-CHK-001 (COD checkout) → TC-UI-CHK-001 / TC-API-INV-001
4. TC-NEG-001 (invalid login) → TC-UI-NEG-001 / TC-API-NEG-001

Key fixes discovered:
- Use testIdAttribute: 'data-test' in playwright.config.js
- COD requires TWO clicks on [data-test="finish"] with payment-success-message between
- API registration needs nested address object
- Add to cart via POST /carts/{cartId} with {product_id, quantity}
- token_type returns lowercase "bearer"

Output:
- Folder/file plan under PrismStructure/
- Sample test skeleton (JavaScript for Playwright)
- Debugging checklist for flaky UI tests
```

## Debugging Checklist

- Verify base URL and test credentials before blaming selectors
- Wait for network idle or explicit locators after navigation
- Capture screenshot + trace on failure
- Compare manual steps 1:1 with automated flow
