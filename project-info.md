# Project Information — QA AI Practical Assessment

## Application Under Test

| Field | Value |
| --- | --- |
| **Application** | Practice Software Testing — Toolshop |
| **Type** | E-commerce web application (demo) |
| **Primary URL** | https://practicesoftwaretesting.com |
| **Purpose** | Manual and automated QA practice across registration, catalog, cart, and checkout flows |

## Scope

This assessment covers **end-user functional flows** only:

- User registration and login
- Product search and product details
- Shopping cart management
- Checkout with **Cash on Delivery (COD)**
- Post-purchase invoice verification
- Negative and edge scenarios for login and cart updates

Out of scope: admin panel, backend API-only testing, payment gateway integration (beyond COD selection), and non-functional testing (performance, security penetration).

## Test Data (Reference)

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@practicesoftwaretesting.com | welcome01 |
| Customer 2 | customer2@practicesoftwaretesting.com | welcome01 |

> Use dynamically generated emails for registration tests to avoid duplicate-account failures.

## Deliverables

| Artifact | Location |
| --- | --- |
| Manual functional test cases | `FunctionalTestCase.csv` |
| Automation scaffold (Playwright / Selenium) | `PrismStructure/` |
| AI-assisted QA prompts | `ai-prompts/` |
| Project overview | `project-info.md` |
| Repository guide | `readme.md` |

## Test Approach

- **ISTQB-aligned** test case design (preconditions, steps, expected results)
- **Smoke** tests for critical path (register, login, cart, COD checkout)
- **Regression** tests for search, product details, invoice, and negative paths
- Traceability from requirements → manual cases → future automation in `PrismStructure/`

## Environment Assumptions

- Stable internet connection
- Supported browser (Chrome / Edge / Firefox — latest stable)
- Application available at the hosted URL above
- Test execution performed against the public demo environment unless otherwise specified
