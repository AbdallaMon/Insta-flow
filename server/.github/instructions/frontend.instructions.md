---
applyTo: "app/**"
---

# Frontend Instructions (app)

Must

- Follow patterns under `app/src/features/*` (do not refactor globally unless asked).
- For new feature:
  - `index.tsx`, `types.ts`, `service.ts`, `components/`, `hooks/` (only what is needed).
- Keep API calls inside `service.ts` (or existing fetcher layer) — no direct fetch in UI components.
- Always model server responses with types (DTO types) and map to UI types if needed.

Backend awareness

- Do not assume new endpoints exist.
- If an endpoint/field is missing, output: (1) what’s needed from backend, (2) the exact expected request/response shape.
- When consuming an API, handle:
  - loading, empty, error states
  - validation and safe parsing (as per repo patterns)

Quality gates

- Typecheck + lint must pass.
- Update only files related to the task.
