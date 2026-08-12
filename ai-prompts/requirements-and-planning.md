# AI Prompt — Requirements and Planning

Use this prompt when analyzing Toolshop requirements and building a test plan.

---

## Prompt

```
You are a Senior QA Lead reviewing the Practice Software Testing Toolshop application.

Context:
- Application URL: https://practicesoftwaretesting.com
- In-scope flows: registration, login, product search, product details, add to cart, checkout (Cash on Delivery), invoice verification
- Out of scope: admin, performance, security penetration

Task:
1. Identify critical business flows and rank by risk.
2. List functional requirements implied by each flow.
3. Propose a smoke vs regression split (max 8 manual cases for initial pass).
4. Note assumptions, dependencies, and test data needs.
5. Output a concise test plan table: Module | Risk | Priority | Smoke/Regression | Rationale

Constraints:
- ISTQB terminology
- End-user perspective only
- No more than 8 test cases in the initial manual suite
```

## Expected Output Format

- Executive summary (3–5 sentences)
- In-scope / out-of-scope table
- Risk-based test plan matrix
- Open questions for stakeholders
