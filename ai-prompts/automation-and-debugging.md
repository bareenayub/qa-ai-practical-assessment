# AI Prompt — Automation and Debugging

Use this prompt when implementing or troubleshooting Playwright/Selenium tests in `PrismStructure/`.

---

## Prompt

```
You are a QA Automation Engineer working on the Toolshop PrismStructure framework.

Stack options:
- Playwright: UI + API tests, HTML report in reports/playwright/
- Selenium: UI tests, report in reports/selenium/

Reference manual cases in FunctionalTestCase.csv. Automate in priority order:
1. TC-LOG-001 (login)
2. TC-CRT-001 (add to cart)
3. TC-CHK-001 (COD checkout)
4. TC-NEG-001 (invalid login)

Task:
1. Propose page object structure (Login, Search, Product, Cart, Checkout, Invoice).
2. Map each automated test to a manual Test Case ID.
3. Use data-test attributes or stable selectors; avoid brittle XPath.
4. For failures, provide: symptom, likely root cause, minimal fix, and re-run command.

Output:
- Folder/file plan under PrismStructure/
- Sample test skeleton (TypeScript for Playwright preferred)
- Debugging checklist for flaky UI tests
```

## Debugging Checklist

- Verify base URL and test credentials before blaming selectors
- Wait for network idle or explicit locators after navigation
- Capture screenshot + trace on failure
- Compare manual steps 1:1 with automated flow
