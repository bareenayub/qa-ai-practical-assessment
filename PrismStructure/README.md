# PrismStructure — Playwright Automation

Playwright UI and API automation for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com), following the Prism page-object pattern.

## Folder Layout

```
PrismStructure/
├── playwright.config.js
├── package.json
├── playwright/
│   ├── api/ApiClient.js          # REST API helper
│   ├── fixtures/testData.js      # Shared test data
│   ├── helpers/uiFlows.js        # Reusable login / cart flows
│   ├── helpers/demoPause.js      # Short pause in headed mode for visibility
│   ├── pages/                    # Page objects (UI)
│   └── tests/
│       ├── ui/                   # 8 UI tests (@smoke / @regression)
│       └── api/                  # 10 API tests (@smoke / @regression)
└── reports/playwright/           # HTML + JSON execution reports
```

## Prerequisites

- Node.js 18+
- npm

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

## Run Tests

| Command | Description |
| --- | --- |
| `npm run test:all` | **One command:** all API + UI tests; reports auto-saved |
| `npm run test:all:report` | Run all tests, then open HTML report |
| `npm test` | Same as `test:all` |
| `npm run test:ui` | UI tests only (headless Chromium) |
| `npm run test:ui:headed` | UI tests in visible Chromium (search/register pause briefly) |
| `npm run test:api` | API tests only |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run test:regression` | Tests tagged `@regression` |
| `npm run test:report` | Open last HTML report |

## Reports

After execution, reports are generated at:

- **HTML:** `reports/playwright/html/index.html`
- **JSON:** `reports/playwright/results.json`

## Traceability

| Manual ID | UI Test | API Test |
| --- | --- | --- |
| TC-REG-001 | TC-UI-REG-001 | TC-API-REG-001 |
| TC-LOG-001 | TC-UI-LOG-001 | TC-API-LOG-001 |
| TC-SRH-001 | TC-UI-SRH-001 | TC-API-SRH-001 |
| TC-PRD-001 | TC-UI-PRD-001 | TC-API-PRD-001 |
| TC-CRT-001 | TC-UI-CRT-001 | TC-API-CAR-001 |
| TC-CHK-001 | TC-UI-CHK-001 | TC-API-INV-001 |
| TC-INV-001 | TC-UI-INV-001 | TC-API-INV-002 |
| TC-NEG-001 | TC-UI-NEG-001 | TC-API-NEG-001 |

## Notes

- Playwright uses `data-test` as the test ID attribute (not `data-testid`).
- COD checkout requires **two Confirm clicks** on the payment step.
- API registration uses a nested `address` object and unique `@example.com` emails.
- **TC-UI-SRH-001** = search results list; **TC-UI-PRD-001** = product detail page (different manual cases).
- Invalid login tests assert error message and **no** redirect to `/account`.
- Maintenance guide: [`../ai-prompts/how-to-use-ai-and-maintain-tests.md`](../ai-prompts/how-to-use-ai-and-maintain-tests.md)
