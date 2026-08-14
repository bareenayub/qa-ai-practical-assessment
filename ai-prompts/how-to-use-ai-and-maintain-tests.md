# How to Use AI for This Project (Plain Language Guide)

This guide explains how AI was used to build the Toolshop QA assessment, where humans should review or fix things, and how to run everything with one command.

---

## What AI Helped Create

| Area | What was generated | Human review needed? |
| --- | --- | --- |
| Manual tests | `FunctionalTestCase.csv` (8 cases) | Yes — confirm steps match real app behavior |
| UI automation | Page objects + 8 Playwright UI specs | Yes — selectors and checkout wizard steps |
| API automation | `ApiClient.js` + 10 API specs | Yes — payload shape from API docs |
| Documentation | README, `project-info.md`, this file | Yes — keep dates and results current |
| Debugging | Login, invoice, COD double-confirm fixes | Yes — demo site changes over time |

**Rule of thumb:** AI is fast at scaffolding. A QA engineer must still validate against the live app at https://practicesoftwaretesting.com.

---

## Where to Fix Things When Tests Break

| Symptom | Likely file to edit |
| --- | --- |
| Login fails or wrong redirect | `playwright/pages/LoginPage.js`, `playwright/helpers/uiFlows.js` |
| Registration form fields changed | `playwright/pages/RegisterPage.js`, `fixtures/testData.js` |
| Search or product page changed | `playwright/pages/HomePage.js`, `ProductPage.js` |
| Checkout / COD / invoice issues | `playwright/pages/CheckoutPage.js`, `InvoicePage.js` |
| API 401 / wrong payload | `playwright/api/ApiClient.js`, `fixtures/testData.js` |
| Test too slow or flaky | `playwright/helpers/uiFlows.js`, individual `tests/ui/*.spec.js` |
| Reports not generated | `playwright.config.js` reporter section |

---

## Good AI Prompts for Maintenance

1. **"Read the failure in `reports/playwright/results.json` and fix the smallest change in the page object."**
2. **"Compare `FunctionalTestCase.csv` TC-CHK-001 with `checkout.spec.js` and list gaps."**
3. **"Run only `TC-UI-INV-001` headed and suggest why payment method assertion failed."**
4. **"Add a regression test for invalid email login without changing passing smoke tests."**

Avoid prompts like *"rewrite the whole framework"* unless you want large, risky diffs.

---

## Invalid Login — Expected Behavior

The negative test (`TC-UI-NEG-001`) checks that:

- Wrong password → **error message**, stay on `/auth/login`, **no** account access
- Fake email → same behavior
- Only **after** those checks does Part B register a **new** valid user for the cart test

If you watch headed mode and see a login **after** the error, that is Part B starting — not the invalid login succeeding.

---

## Search vs Product Details — Not the Same Test

| Test | ID | What it checks |
| --- | --- | --- |
| Search | TC-UI-SRH-001 | Keyword search → results **list** shows name + price |
| Product details | TC-UI-PRD-001 | Click a product → **detail page** shows description, stock, Add to Cart |

Both use search as a setup step, but they validate **different pages** and **different acceptance criteria** from the manual CSV.

---

## One Command — API + UI + Reports

From `PrismStructure/`:

```bash
npm run test:all
```

This runs **all 18 tests** (10 API + 8 UI). Reports are written automatically to:

- `reports/playwright/html/index.html`
- `reports/playwright/results.json`

Open the HTML report:

```bash
npm run test:report
```

Or run tests and open the report in one step:

```bash
npm run test:all:report
```

---

## Visible Browser (Chromium Window)

Terminal runs use headless Chromium (faster). To **see** the browser:

```bash
npm run test:ui:headed
```

Search and registration include a short pause in headed mode so typed text is visible before submit.

---

## Assignment Readiness (≈90% Checklist)

| Requirement | Status | Evidence |
| --- | --- | --- |
| Manual test cases (5–8) | Done | `FunctionalTestCase.csv` (8 cases) |
| UI automation (smoke + regression) | Done | 8 specs with `@smoke` / `@regression` |
| API automation | Done | 10 specs, auth/cart/invoice/negative |
| Page-object / Prism structure | Done | `playwright/pages/`, `helpers/` |
| Test data strategy | Done | `fixtures/testData.js`, `ai-prompts/test-data.md` |
| Execution reports | Done | HTML + JSON under `reports/playwright/` |
| Traceability manual → auto | Done | IDs in spec comments + README tables |
| AI workflow documented | Done | `ai-prompts/`, this file, `project-info.md` |
| README setup & run instructions | Done | Root `README.md`, `PrismStructure/README.md` |
| All tests passing | Verify locally | `npm run test:all` |

**Remaining human steps before submission:** run full suite once, attach or commit latest `results.json`, and skim the HTML report for green status.
