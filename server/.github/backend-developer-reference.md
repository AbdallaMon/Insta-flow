# Backend Developer Reference — Insta-Pay Server

> **Purpose:** Complete backend development guidelines consolidated from all instruction files.  
> **Read this before starting any backend task.**

---

## 1. SCOPE & RESPONSIBILITY

- Work **ONLY** on `server/**` files unless explicitly told otherwise
- I am the backend engineer responsible for the Server codebase
- **Maintain API contract** with frontend — breaking changes require coordination

---

## 2. MODULE PATTERN (MANDATORY)

Every module follows this exact structure:

```
modules/<module-name>/
  ├── <module>.routes.ts      # Route definitions
  ├── <module>.service.ts     # Business logic
  ├── <module>.validators.ts  # Input validation
  └── <module>.types.ts       # TypeScript types
```

**Rules:**

- Keep routes thin — delegate to service
- Keep all business logic in service layer
- **DO NOT deviate from this pattern**

---

## 3. ENDPOINT RULES

- **Never create new endpoints** unless explicitly requested
- If a new endpoint is needed → **PROPOSE FIRST**, then implement after approval
- Do not invent APIs/modules that don't exist
- If something is missing, ask the user first

---

## 4. INPUT VALIDATION & TYPE SAFETY

- **Always validate inputs** using existing validators pattern
- **Never trust client input** — validate everything
- Use strict TypeScript types — **avoid `any`**
- If `any` is unavoidable → add code comment explaining why
- Follow existing validation patterns in `<module>.validators.ts`

---

## 5. FRONTEND ↔ BACKEND CONTRACT (CRITICAL)

### Every endpoint must document:

1. **Request shape** (params/query/body)
2. **Response shape** (success + error cases)
3. **Stable field names** — do NOT rename/remove fields frontend uses

### If response shape changes:

1. Update server types/validators
2. Update frontend service + types
3. Update any mapping/adapters
4. **Explicitly mention required frontend updates in summary**

### Response shapes are a CONTRACT:

- Treat them as immutable unless coordinated with frontend
- Breaking changes require synchronized updates
- Field renames/removals = breaking changes

---

## 6. ARCHITECTURE & STRUCTURE

- Follow **existing folder structure** — do not move/rename unrelated files
- Keep changes **minimal and focused** to the requested task
- Do not introduce breaking changes
- Follow existing code patterns and conventions

---

## 7. QUALITY GATES (BEFORE "DONE")

Before marking any task complete:

- ✅ **Typecheck passes** (`npm run typecheck` or equivalent)
- ✅ **Lint passes** (`npm run lint` or equivalent)
- ✅ **Add/adjust tests** (if repo has them & relevant to changes)
- ✅ **Manual smoke test** for affected endpoints
- ✅ **Summary of changes** + list of changed files
- ✅ **Testing checklist** provided to user

---

## 8. WORKFLOW

### When receiving a backend task:

1. **Read this reference file** (you're here!)
2. **Understand the request** — ask clarifying questions if needed
3. **Check existing code** — follow patterns, don't invent
4. **Propose unknowns** — if something is unclear or missing, ask first
5. **Implement** — follow module pattern, validate inputs, maintain contract
6. **Test** — ensure quality gates pass
7. **Summarize** — list changes, testing checklist, frontend impact (if any)

### If I need something:

- **ASK the user** — do not guess or invent
- **PROPOSE first** — before creating new endpoints/modules
- **DO NOT fake** — if data/API doesn't exist, say so

---

## 9. COMMON PATTERNS

### Route Example:

```typescript
// <module>.routes.ts
router.post(
  "/",
  validate(<module>Validators.create),
  <module>Controller.create,
);
```

### Service Example:

```typescript
// <module>.service.ts
export const <module>Service = {
  async create(data: CreateDto): Promise<ResponseDto> {
    // Business logic here
  }
};
```

### Validator Example:

```typescript
// <module>.validators.ts
export const <module>Validators = {
  create: z.object({
    field: z.string()
  })
};
```

---

## 10. FORBIDDEN ACTIONS

❌ Creating endpoints without request  
❌ Breaking response contracts without coordination  
❌ Using `any` without explanation  
❌ Trusting client input without validation  
❌ Moving/renaming unrelated files  
❌ Inventing APIs/data that don't exist  
❌ Deviating from module pattern

---

## 11. SUMMARY FORMAT

Always end with:

```markdown
### Changes Made

- List of modified files with brief description

### Testing Checklist

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Manual test: [describe what to test]

### Frontend Impact

- [None / List required frontend updates]
```

---

**Ready to work. Read this file before each task.**
