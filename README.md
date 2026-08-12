# QA AI Practical Assessment — Toolshop

Manual test design and automation scaffold for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com) application.

## Repository Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv          # 8 ISTQB-style manual functional test cases
├── PrismStructure/                 # Playwright/Selenium scaffold (API + UI + reports)
│   ├── README.md
│   ├── playwright/
│   ├── selenium/
│   └── reports/
├── project-info.md                 # Application scope, test data, and approach
├── readme.md                       # This file
└── ai-prompts/
    ├── requirements-and-planning.md
    ├── test-design.md
    ├── automation-and-debugging.md
    └── documentation-and-summary.md
```

## Quick Start

### Manual Testing

1. Open `FunctionalTestCase.csv` in Excel, Google Sheets, or any CSV editor.
2. Execute test cases against https://practicesoftwaretesting.com.
3. Record actual results and defects in your test management tool of choice.

### Automation (Future)

See `PrismStructure/README.md` for the planned Playwright (UI + API) and Selenium layout, including execution report folders.

### AI-Assisted Workflow

Prompt templates in `ai-prompts/` support requirements analysis, test design, automation debugging, and documentation.

## Test Coverage Summary

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

## Contributing

1. Branch from `main` using naming: `feature/<short-description>`.
2. Keep manual cases in sync with automation in `PrismStructure/`.
3. Update `project-info.md` when scope or environment changes.

## License

Assessment / educational use.
