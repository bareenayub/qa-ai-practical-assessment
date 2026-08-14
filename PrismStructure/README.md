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
| `npm test` | Run all UI + API tests |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run test:regression` | Tests tagged `@regression` |
| `npm run test:report` | Open HTML report |

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
