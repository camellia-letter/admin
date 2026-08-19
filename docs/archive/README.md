# docs/archive

보관 문서. **실행 지시서가 아니라 기록이다.**
여기 있는 문서의 지시를 그대로 따르지 말 것 — 작성 당시와 코드가 다르다.

## 미리보기 Mantine 전환 계획 (3건)

`PREVIEW_UI_FIX_PLAN.md`(2026-06-29) · `PREVIEW_FIX_PLAN.md`(2026-07-09) ·
`PREVIEW_TASK_LIST.md`(2026-07)

같은 작업을 중복 서술한 세 문서다. **체크박스는 75개 중 71개가 미완으로
남아 있으나 실제 코드는 13개 블록 중 12개가 전환 완료된 상태**이므로,
체크박스를 그대로 믿으면 안 된다.

현재 상태와 남은 작업은 **`../PREVIEW_STATUS.md`** 를 본다.

## WEB_PUSH_GUIDE.md

2026-05-31. `WEDDING_SUMMARY` 블록 타입을 `web/src/types/invitation.ts`에
반영하고 푸시하는 일회성 안내였다.

지금은 공유 타입이 `@camellia-letter/shared-types` 패키지로 관리되므로
이 절차는 유효하지 않다. 문서가 가리키던 `web/src/types/invitation.ts`는
아직 파일로 남아 있으나 **import하는 곳이 없는 죽은 코드다.**
타입 변경 절차는 `types/DEPLOY.md`를 따른다.
