# AGENTS.md

## 📌 Mandatory Instruction (절대 규칙)

Before ANY action:

1. 반드시 `./docs/WORK_RULES.md`를 먼저 읽는다
2. 해당 규칙을 기준으로 판단한다
3. 규칙을 확인하지 않았다면 작업을 진행하지 않는다

---

## 🧠 Project Overview

This is a structured monorepo project:

- apps/web (Next.js)
- apps/admin (Vite + React)
- apps/api (NestJS)
- packages/shared (shared types & utils)

Architecture consistency is critical.

---

## 🚨 Non-Negotiable Rules

- Follow `docs/WORK_RULES.md` strictly
- Do NOT change architecture
- Do NOT refactor unless explicitly requested
- Do NOT introduce new patterns

If unsure → DO NOTHING and ask

---

## 🔁 Required Workflow

1. Read `docs/WORK_RULES.md`
2. Analyze existing implementation
3. Follow same pattern
4. Apply minimal change
5. Validate

---

## 🧪 Validation (필수)

After changes, ALWAYS run:

- pnpm typecheck
- pnpm lint
- pnpm test

---

## 🔒 Restricted Areas

Do NOT modify unless explicitly asked:

- packages/shared/\*\*
- authentication logic
- query key structure
- block system types
- API core logic

---

## 🎯 Coding Principles

- minimal diff
- preserve structure
- follow existing patterns
- avoid over-engineering

---

## ✅ Completion Criteria

- No rule violation (WORK_RULES.md)
- No unnecessary changes
- Type-safe
- Consistent with existing code
