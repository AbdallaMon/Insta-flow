# Copilot Rules — Project Standards (repo-wide)

Overview

- These instructions apply to all work in this repository.

Must (required)

- Must follow existing architecture and folder structure. Do not move/rename unrelated files.
- Must not invent APIs/endpoints/modules that do not exist. If missing, propose first (no implementation).
- Must keep changes minimal and focused to the requested task.
- Must include: summary of changes + testing checklist at the end of the response/PR.

Types & safety

- Use strict TypeScript types; avoid `any`. If unavoidable: add code comment + explain why.
- Do not introduce breaking changes to response shapes consumed by clients without coordinated updates.

Frontend ↔ Backend contract (critical)

- Treat server response shapes as a contract.
- If a server response changes:
  1. update server types/validators
  2. update frontend service + types
  3. update any mapping/adapters
  4. mention it explicitly in the summary

Folder conventions (follow existing)

- Frontend: `app/src/*`
- Backend: `server/*`

Definition of "done"

- Typecheck passes + lint passes
- Manual smoke test for affected parts (frontend/server)
- List changed files in the final summary
