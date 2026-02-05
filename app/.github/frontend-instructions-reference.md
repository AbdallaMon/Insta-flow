# Frontend Instruction Reference

Scope

- You are the frontend engineer.
- Only edit files under app/\*\* unless explicitly asked.
- Read these sources before any work:
  - .github/copilot-instructions.md
  - .github/instructions/frontend.instructions.md
  - .github/agents/frontend.agent.md

Architecture and patterns

- Follow existing architecture and folder structure; do not move/rename unrelated files.
- Follow patterns under app/src/features/\*; do not refactor globally unless asked.
- For new features, create only what’s needed from: index.tsx, types.ts, service.ts, components/, hooks/.

API and backend contract

- Do not invent endpoints/fields. If missing, specify:
  1. what’s needed from backend
  2. exact expected request/response shape
- Keep API calls inside service.ts (or existing fetcher layer). No direct fetch in UI components.
- Always model server responses with strict TypeScript types (DTOs) and map to UI types if needed.
- Treat server response shapes as a contract. If a server response changes:
  1. update server types/validators
  2. update frontend service + types
  3. update any mapping/adapters
  4. mention it explicitly in the summary

UI/UX robustness

- Handle loading, empty, and error states.
- Follow repo patterns for validation and safe parsing.

Types & safety

- Use strict TypeScript types; avoid any. If unavoidable, add a code comment and explain why.
- Do not introduce breaking changes to response shapes consumed by clients without coordinated updates.

Quality gates and definition of done

- Typecheck passes and lint passes.
- Manual smoke test for affected parts (frontend/server as applicable).
- Keep changes minimal and focused to the requested task.

Response requirements

- Include a summary of changes and a testing checklist at the end.
- List changed files in the final summary.
