# WORK_RULES.md

## 🎯 목적

이 문서는 CamelliaLetter 프로젝트의 코드 작성, 수정, 커밋 기준을 정의한다.

이 프로젝트는 기능 구현보다 **구조 일관성, 안정성, 유지보수성**을 우선한다.

---

# 0️⃣ 작업 전 필수 확인

모든 작업은 아래 순서를 반드시 따른다.

1. `docs/WORK_RULES.md`를 먼저 읽는다
2. `docs/COMMIT_CONVENTION.md`를 반드시 이어서 읽는다
3. 두 문서의 규칙을 확인하지 않았다면 작업을 진행하지 않는다

👉 코드 수정뿐 아니라 커밋 메시지 작성 시에도 `COMMIT_CONVENTION.md`를
기준으로 판단한다

---

# 1️⃣ 핵심 원칙 (가장 중요)

- 구조를 깨지 않는다
- 기존 패턴을 따른다
- 최소 변경으로 해결한다
- 불필요한 리팩토링 금지
- 코드 추가보다 단순화를 우선한다

---

# 2️⃣ 코드 스타일 규칙

## 함수 선언 규칙

- 모든 함수는 화살표 함수 사용 (ES6)
- `function` 키워드 사용 금지

### Correct

```ts
const getUser = () => {};
const Component = () => {};
const handleClick = () => {};
```

### Incorrect

```ts
function getUser() {}
function Component() {}
```

### Exception

- 프레임워크에서 강제하는 특수 케이스
- 명시적으로 요청받은 경우

---

## 변수 선언 규칙

- 기본은 `const`
- 재할당이 필요한 경우에만 `let`
- `var` 사용 금지

### Correct

```ts
const name = 'camellia';

let currentIndex = 0;
currentIndex += 1;
```

### Incorrect

```ts
let name = 'camellia';
var currentIndex = 0;
```

---

## export 규칙

### 기본 규칙

- 컴포넌트 / 훅 / 유틸 / 일반 모듈은 `export const` 사용
- `default export`는 기본적으로 금지

### 라우팅 페이지 규칙 (예외)

- **라우팅되는 페이지 전반은 `export default` 사용**
- Next.js `page.tsx`뿐 아니라, 라우트 진입점으로 사용되는 페이지 파일 전체에 동일하게 적용
- 즉, 사용자가 직접 진입하는 페이지/화면 단위 파일은 `export default`, 그 외 재사용 단위는 `export const`

### Correct

```ts
// 일반 컴포넌트
export const InvitationCard = () => {};

// hook
export const useInvitation = () => {};
```

```ts
// 라우팅 페이지
const DashboardPage = () => {};

export default DashboardPage;
```

### Incorrect

```ts
export default InvitationCard;
```

---

## 파일 구조 규칙

- 기존 구조 유지
- 임의 리팩토링 금지
- 새 파일 생성 전 기존 유사 구조 먼저 확인
- `shared`는 재사용이 명확할 때만 사용

---

## import 규칙

- 기존 import 스타일 유지
- 불필요한 import 금지
- import 정렬만을 위한 불필요한 diff 금지

---

# 3️⃣ 아키텍처 규칙

- TanStack Query 유지
- Zustand 유지
- API 구조 변경 금지
- 인증 흐름 변경 금지
- 블록 시스템 구조 유지

---

# 4️⃣ 금지 사항 🚫

- `any` 사용 금지
- `console.log` 금지
- dead code 금지
- 불필요한 abstraction 금지
- 새로운 상태관리 도입 금지
- 아키텍처 변경 금지

---

# 5️⃣ 작업 프로세스

## 작업 전

1. 기존 코드 분석
2. 동일 패턴 확인
3. 영향 범위 확인

## 작업 중

- 최소 변경
- 구조 유지

## 작업 후

- `npm run typecheck`
- `npm run lint`
- `npm run test`

---

# 6️⃣ 커밋 규칙

## 형식

`<Type>(<Scope>): <Subject>`

## 규칙

- Type은 대문자로 시작
- Subject는 50자 이내
- Type을 제외한 내용은 한국어 작성
- 마침표 금지

---

# 7️⃣ 완료 기준

1. 구조 유지
2. 타입 안정성 유지
3. 불필요한 코드 없음

---

# ⚠️ 최종 요약

- 구조를 깨지 마라
- 기존 패턴을 따라라
- 최소 수정만 해라
- 라우팅 페이지는 `export default`, 나머지는 `export const`
