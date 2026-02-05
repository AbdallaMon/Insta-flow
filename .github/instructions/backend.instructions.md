---
applyTo: "server/**"
---

# Backend Instructions (Server)

Must

- Follow module pattern:
  - `<module>.routes.ts`, `<module>.service.ts`, `<module>.validators.ts`, `<module>.types.ts`
- Do not create new endpoints unless explicitly requested. If needed, propose first.
- Validate inputs (use existing validators pattern). Never trust client input.
- Keep business logic in service, keep routes thin.

Frontend awareness

- Every endpoint must have:
  - request shape (params/body)
  - response shape (success + error)
  - stable field names (do not rename/remove fields used by frontend without coordinating)
- If response shape changes, mention required frontend updates explicitly.

Quality gates

- Typecheck + lint must pass.
- Add/adjust tests if repo has them (only if relevant).
