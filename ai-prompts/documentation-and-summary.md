# AI Prompt — Documentation and Summary

Use this prompt after a test cycle to produce stakeholder-ready documentation.

---

## Prompt

```
You are a Senior QA Lead summarizing Toolshop test execution results.

Inputs:
- FunctionalTestCase.csv (planned cases)
- Execution notes / defect IDs (if any)
- Automation results from PrismStructure/reports/ (if available)

Produce:
1. Test execution summary: Total | Passed | Failed | Blocked | Not Run
2. Defect summary table: ID | Severity | Module | Summary | Status
3. Coverage vs scope in project-info.md (gaps noted)
4. Risks and recommendations for next sprint
5. One-paragraph executive summary for non-technical stakeholders

Tone: factual, concise, ISTQB-aligned.
```

## Suggested Sections for Final Report

- Scope and environment
- Test approach (manual + automation status)
- Results matrix by module
- Known limitations and follow-up actions
