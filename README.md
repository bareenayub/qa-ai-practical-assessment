# QA AI Practical Assessment — Toolshop

Manual test design and Playwright automation for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com) application.

## Repository Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv          # 8 ISTQB-style manual functional test cases
├── PrismStructure/                 # Playwright UI + API automation + reports
│   ├── playwright.config.js
│   ├── playwright/tests/ui, api
│   ├── playwright/pages, api, fixtures
│   └── reports/playwright/
├── project-info.md                 # Application scope, test data, and approach
├── readme.md                       # This file
└── ai-prompts/
    ├── requirements-and-planning.md
    ├── test-design.md
    ├── test-data.md
    ├── automation-and-debugging.md
    └── documentation-and-summary.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Internet access to https://practicesoftwaretesting.com and https://api.practicesoftwaretesting.com

### Automation Setup

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

### Run Tests

```bash
# One command: all API + UI tests (reports auto-generated)
npm run test:all

# Same as above, then open HTML report in browser
npm run test:all:report

# All tests (alias)
npm test

# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression

# UI only (headless Chromium)
npm run test:ui

# UI in visible Chromium window (search/registration pause briefly so you can read the form)
npm run test:ui:headed

# API only
npm run test:api
```

UI specs run in demo order: **01 search → 02 product details** (guest, CSV cases 3–4), then **03 registration → 04 login** (CSV cases 1–2), then **05 cart → 06 checkout → 07 invoice → 08 negative**.

Headed mode adds pauses between tests, slow typing in search, and `slowMo` so the flow is easier to watch. Registration happens once in `03-registration`; later tests log in with that user.

### Manual Testing

1. Open `FunctionalTestCase.csv` in Excel, Google Sheets, or any CSV editor.
2. Execute test cases against https://practicesoftwaretesting.com.
3. Record actual results and defects in your test management tool of choice.

### Execution Reports

After running automation, open the HTML report:

```bash
npm run test:report
```

Reports are also saved to `PrismStructure/reports/playwright/html/` and `results.json`.

## Test Coverage Summary

### Manual (FunctionalTestCase.csv)

| # | Focus Area | Test Case ID | Type |
| --- | --- | --- | --- |
| 1 | User Registration | TC-REG-001 | Smoke |
| 2 | Login | TC-LOG-001 | Smoke |
| 3 | Search Product | TC-SRH-001 | Regression |
| 4 | Product Details | TC-PRD-001 | Regression |
| 5 | Add to Cart | TC-CRT-001 | Smoke |
| 6 | Checkout (COD) | TC-CHK-001 | Smoke |
| 7 | Invoice Verification | TC-INV-001 | Regression |
| 8 | Invalid Login / Cart Update | TC-NEG-001 | Regression |

### UI Automation (8 tests)

| Test ID | Manual Trace | Tag |
| --- | --- | --- |
| TC-UI-REG-001 | TC-REG-001 | @smoke |
| TC-UI-LOG-001 | TC-LOG-001 | @smoke |
| TC-UI-SRH-001 | TC-SRH-001 | @regression |
| TC-UI-PRD-001 | TC-PRD-001 | @regression |
| TC-UI-CRT-001 | TC-CRT-001 | @smoke |
| TC-UI-CHK-001 | TC-CHK-001 | @smoke |
| TC-UI-INV-001 | TC-INV-001 | @regression |
| TC-UI-NEG-001 | TC-NEG-001 | @regression |

### Search vs Product Details (different tests)

| Test | What it validates |
| --- | --- |
| **TC-UI-SRH-001** | Search **results list** — keyword returns matching product cards with name and price |
| **TC-UI-PRD-001** | **Product detail page** — description, stock status, and enabled Add to Cart after opening a product |

Both may use search as a setup step, but they map to separate manual cases (TC-SRH-001 vs TC-PRD-001).

### Why some UI tests take longer

| Test | Typical time | Reason |
| --- | --- | --- |
| TC-UI-INV-001 | ~35s | Full E2E: register → cart → COD checkout → invoice verify |
| TC-UI-CHK-001 | ~32s | Full checkout wizard + double COD confirm |
| TC-UI-NEG-001 | ~12–16s | Two invalid login checks + registration + cart |
| TC-UI-SRH-001 / PRD-001 | ~5–6s | Single-page or short navigation flows |

### API Automation (10 tests)

| Test ID | Manual Trace | Tag |
| --- | --- | --- |
| TC-API-REG-001 | TC-REG-001 | @smoke |
| TC-API-LOG-001 | TC-LOG-001 | @smoke |
| TC-API-CRT-001 | TC-LOG-001 | @smoke |
| TC-API-PRD-001 | TC-PRD-001 | @regression |
| TC-API-SRH-001 | TC-SRH-001 | @regression |
| TC-API-CAR-001 | TC-CRT-001 | @smoke |
| TC-API-INV-001 | TC-CHK-001 | @regression |
| TC-API-INV-002 | TC-INV-001 | @regression |
| TC-API-NEG-001 | TC-NEG-001 | @regression |
| TC-API-NEG-002 | TC-NEG-001 | @regression |

## Test Data

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@practicesoftwaretesting.com | welcome01 |
| Customer 2 | customer2@practicesoftwaretesting.com | welcome01 |

Registration tests generate unique emails via `playwright/fixtures/testData.js`.

## AI-Assisted Workflow

Prompt templates in `ai-prompts/` support requirements analysis, test design, automation debugging, and documentation.

**Start here (plain language):** [`ai-prompts/how-to-use-ai-and-maintain-tests.md`](../ai-prompts/how-to-use-ai-and-maintain-tests.md)

## Assignment Checklist

- [x] Requirement and risk analysis (`project-info.md`, `ai-prompts/requirements-and-planning.md`)
- [x] `project-info.md` with AI workflow documentation
- [x] Manual test suite (`FunctionalTestCase.csv`)
- [x] UI automation tier — Playwright smoke + regression
- [x] API automation tier — Playwright core lifecycle APIs
- [x] Test data strategy (`ai-prompts/test-data.md`, `fixtures/testData.js`)
- [x] Execution reports folder (`reports/playwright/`)
- [x] README with setup and execution instructions
- [x] Full prompt history (`ai-prompts/`)
- [x] Traceability from manual → UI → API tests

## License

Assessment / educational use.
