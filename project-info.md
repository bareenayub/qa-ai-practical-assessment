# Project Information — QA AI Practical Assessment

## Application Under Test

| Field | Value |
| --- | --- |
| **Application** | Practice Software Testing — Toolshop |
| **Type** | E-commerce web application (demo) |
| **Primary URL** | https://practicesoftwaretesting.com |
| **API URL** | https://api.practicesoftwaretesting.com |
| **API Docs** | https://api.practicesoftwaretesting.com/api/documentation |
| **Purpose** | Manual and automated QA practice across registration, catalog, cart, checkout, and invoice flows |

## Project Summary

End-to-end testing of the Toolshop e-commerce application covering user registration, login, product search, cart management, Cash on Delivery checkout (with double-confirm invoice generation), and post-purchase invoice verification — implemented as 8 manual cases with matching UI and API Playwright automation.

## Primary AI Tool(s) Used

- **Cursor** (Auto / Composer for planning, Sonnet for automation code)

## Scope

### In Scope

- User registration and login (UI + API)
- Product search and product details
- Shopping cart management
- Checkout with **Cash on Delivery (COD)** — requires **two Confirm clicks**
- Post-purchase invoice verification
- Negative scenarios: invalid login, unauthenticated API access, invalid cart quantity

### Out of Scope

- Admin panel, performance testing, security penetration testing
- Payment gateway integration beyond COD selection

## Test Data (Reference)

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@practicesoftwaretesting.com | welcome01 |
| Customer 2 | customer2@practicesoftwaretesting.com | welcome01 |

> Registration tests use dynamically generated `@example.com` emails via `PrismStructure/playwright/fixtures/testData.js`.

## Deliverables

| Artifact | Location |
| --- | --- |
| Manual functional test cases | `FunctionalTestCase.csv` |
| Playwright UI + API automation | `PrismStructure/` |
| AI-assisted QA prompts | `ai-prompts/` |
| Project overview | `project-info.md` |
| Repository guide | `readme.md` |

## Test Approach

| Tier | Count | Tags | Focus |
| --- | --- | --- | --- |
| Manual | 8 | Smoke / Regression | ISTQB-style functional cases |
| UI Automation | 8 | `@smoke`, `@regression` | Critical user journeys via Playwright |
| API Automation | 10 | `@smoke`, `@regression` | Auth, cart, products, invoice lifecycle |

### Smoke vs Regression Split

**Smoke (critical path):** Registration, Login, Add to Cart, Checkout COD, API auth + cart creation

**Regression (extended coverage):** Search, Product Details, Invoice verification, negative login/cart scenarios

## AI Workflow Summary

1. **Context:** Provided assignment PDF, SUT URLs, and `FunctionalTestCase.csv` to Cursor
2. **Requirement analysis:** Mapped AC1 (Registration/Login) and AC2 (E2E Purchase / API Invoice) to test scenarios
3. **Test planning:** Smoke = purchase path; Regression = search, details, invoice, negatives
4. **Manual design:** 8 ISTQB cases in CSV with traceable IDs
5. **Automation design:** Prism page-object pattern, `ApiClient` helper, `data-test` selectors
6. **Validation:** Reviewed AI-generated selectors against Toolshop Angular source; fixed API payload structure (nested `address`)
7. **Test data:** Faker-style unique emails, US address for API, default customer for login smoke
8. **Debugging:** Fixed token_type casing, cart add endpoint (`POST /carts/{id}`), COD double-confirm
9. **Data privacy:** No production credentials shared; demo app test accounts only
10. **Reuse:** Same workflow applies to any web+API project: requirements → CSV → page objects → tagged suites

## Environment Assumptions

- Stable internet connection
- Chrome (latest stable) via Playwright
- Public demo environment at practicesoftwaretesting.com
