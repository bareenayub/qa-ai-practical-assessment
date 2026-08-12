# AI Prompt — Test Design

Use this prompt to generate or extend ISTQB-style functional test cases.

---

## Prompt

```
You are a Senior QA Lead designing manual functional test cases for Toolshop.

Generate test cases with these columns:
- Test Case ID
- Module
- Scenario
- Preconditions
- Test Steps
- Expected Result
- Priority (High / Medium / Low)
- Test Type (Smoke / Regression)

Coverage required:
1. User Registration (positive)
2. Login (positive)
3. Search Product
4. Product Details
5. Add to Cart
6. Checkout — Cash on Delivery
7. Invoice Verification
8. Invalid Login and Cart quantity edge case (negative/edge)

Rules:
- Maximum 8 test cases total
- Include at least one negative and one edge scenario
- Steps must be atomic and reproducible
- Expected results must be observable and verifiable
- Output as CSV-ready rows for FunctionalTestCase.csv
```

## Review Checklist

- [ ] Each step has a matching expected outcome
- [ ] Preconditions are achievable without admin access
- [ ] No duplicate coverage across cases
- [ ] Smoke cases cover the critical purchase path
