# AGENTS.md

## 📌 Mandatory Instruction (절대 규칙)

Before ANY action:

1. 반드시 `./docs/WORK_RULES.md`를 먼저 읽는다
2. 해당 규칙을 기준으로 판단한다
3. 규칙을 확인하지 않았다면 작업을 진행하지 않는다

---

## 🧠 Project Overview

This is the **admin application** (Vite + React).

프로젝트는 모노레포가 아니라 **독립된 4개의 git 저장소**로 구성된다:

- `web` (Next.js) — 사용자용 청첩장
- `admin` (Vite + React) — 이 저장소
- `api` (NestJS) — API 서버
- `types` (`@camellia-letter/shared-types`) — GitHub Packages로 배포되는 공유 타입 패키지

공유 타입은 소스 참조가 아니라 **npm 패키지로 설치**해서 사용한다.
따라서 타입 변경은 `types` 저장소에서 버전을 올려 배포한 뒤,
각 저장소에서 재설치해야 반영된다.

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

- `@camellia-letter/shared-types` 패키지 내용 (별도 `types` 저장소에서 관리)
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
