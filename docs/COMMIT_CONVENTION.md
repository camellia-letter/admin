# Commit Convention

이 문서는 CamelliaLetter 프로젝트의 커밋 메시지 규칙을 정의합니다.

## 기본 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 커밋 메시지 구성

- `Type`: 변경의 성격을 나타냅니다. 대문자 시작(예: `Feature`, `Fix`)으로 작성합니다.
- `Scope`: 변경 범위를 간단히 명시합니다(선택).
- `Subject`: 50자 이내로 핵심 변경 내용을 요약합니다.
- `Body`: 상세 설명이 필요할 때 작성합니다(선택).
- `Footer`: 이슈/티켓, BREAKING CHANGE 등을 기록합니다(선택).

## Type 목록

- `Feature`: 새로운 기능 또는 파일 추가
- `Fix`: 버그 및 오류 수정
- `Docs`: 문서 변경
- `Style`: 코드 포맷/세미콜론/공백 등 동작에 영향 없는 변경
- `Refactor`: 기능 변화 없는 리팩터링
- `Perf`: 성능 개선
- `Test`: 테스트 추가/수정
- `Build`: 빌드/패키지/의존성 관련 변경
- `Ci`: CI 설정 변경
- `Chore`: 기타 잡무(스크립트, 설정 등)
- `Revert`: 이전 커밋 되돌림

### Type 표기 규칙

- Type은 대문자 시작만 허용합니다.
- 예: `Feature`, `Fix`, `Docs`

### 자동화/포맷 관련 Type 가이드

- 린트 설정/스크립트/CI 파이프라인 변경: `Ci` 또는 `Chore`
- 코드 포맷만 바뀐 변경(동작 영향 없음): `Style`

## Scope 가이드

- 앱/패키지/모듈 이름을 사용합니다.
- 예: `apps-web`, `apps-admin`, `packages-ui`, `packages-utils`, `config`, `infra`
- 모호할 경우 생략할 수 있습니다.

## Subject 가이드

- 명령형 현재형으로 작성합니다. (예: "추가", "수정", "개선")
- 마침표를 붙이지 않습니다.
- 변경 의도가 한눈에 보이도록 작성합니다.
- Type을 제외한 내용은 한국어로 작성합니다.

## Body 가이드

- 무엇을, 왜 변경했는지 설명합니다.
- 필요 시 영향 범위나 대안 비교를 포함합니다.
- 줄바꿈은 문장 단위로 사용합니다.

## Footer 가이드

- 관련 이슈/티켓을 연결합니다.
- 호환성 깨짐은 `BREAKING CHANGE:`로 명시합니다.
- Type을 제외한 내용은 한국어로 작성합니다.

## 이슈/티켓 포맷

- GitHub 이슈: `Closes #123`, `Fixes #123`, `Refs #123`
- JIRA: `Refs JIRA-123`, `Closes JIRA-123`
- 여러 개일 경우 줄바꿈으로 나열합니다.

## 예시

```
Feature(apps-web): 온보딩 플로우 추가

첫 방문 사용자가 온보딩 화면을 확인할 수 있습니다.

Closes #123
```

```
Fix(packages-utils): 파서의 빈 입력 처리
```

```
Refactor(config): eslint 오버라이드 단순화

BREAKING CHANGE: 레거시 패키지의 린트 규칙을 제거했습니다.
```

### 본문/푸터 템플릿 (한국어 기준)

```
<Type>(<Scope>): <Subject>

<무엇을 변경했는지>
<왜 필요한지 또는 영향 범위>

Closes #123
BREAKING CHANGE: <호환성 깨짐 설명>
```

## Revert 형식

```
Revert: <subject>

This reverts commit <sha>.
```

## 커밋 메시지 체크리스트

- [ ] type이 목록에 있는가?
- [ ] type이 대문자 시작인가?
- [ ] subject가 50자 이내인가?
- [ ] 필요 시 scope가 적절한가?
- [ ] breaking change가 있다면 footer에 표기했는가?
- [ ] 이슈/티켓 포맷이 규칙에 맞는가?
