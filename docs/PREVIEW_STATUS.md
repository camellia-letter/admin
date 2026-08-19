# Admin 미리보기 — 현황과 남은 작업

`PREVIEW_UI_FIX_PLAN.md`(2026-06-29), `PREVIEW_FIX_PLAN.md`(2026-07-09),
`PREVIEW_TASK_LIST.md`(2026-07) 세 문서를 통합했다. 원본은 `docs/archive/`에 있다.

**마지막 확인: 2026-08-19**

---

## 배경

Admin 미리보기가 Tailwind CSS로 작성돼 있어 Mantine 기반 Web 청첩장과
다르게 보이는 문제였다. 해결 방향은 Preview 블록을 Mantine 컴포넌트로
재작성하는 것이었다.

---

## 현황 — 13개 블록 중 12개 완료

원본 문서의 체크박스는 75개 중 71개가 미완으로 남아 있으나,
**체크박스가 갱신되지 않았을 뿐 코드는 대부분 전환됐다.**
`src/components/Preview/PreviewBlocks.tsx`를 실제로 확인한 결과다.

| 블록 | 상태 |
| --- | --- |
| Header, Message, Info, Map, Gallery, Account, Transport, Guestbook, Rsvp, WeddingSummary, Parents, SnapUpload | ✅ Mantine 전환 완료 |
| **Hero** | ❌ 유일하게 미전환 (Tailwind className 6개 잔존) |

---

## 남은 작업 1 — PreviewHeroBlock 전환

`PreviewBlocks.tsx`의 `PreviewHeroBlock`만 `<section>`/`<div>` + className
구조로 남아 있다. 다른 12개 블록과 같이 Mantine 컴포넌트로 바꾼다.

---

## 남은 작업 2 — 무효 className 정리 (신규 발견)

> ⚠️ **admin에는 Tailwind가 설치돼 있지 않다.**
> `package.json`에 의존성이 없고, `tailwind.config.*`·`postcss.config.*`도 없으며,
> CSS에 `@tailwind` 지시자도 없다.
> **따라서 모든 Tailwind className은 아무 효과가 없는 죽은 속성이다.**

미전환 블록만의 문제가 아니라 admin 전체에 26건이 흩어져 있다.

| className | 건수 | 실제 영향 |
| --- | --- | --- |
| `sr-only` | 5 | **화면에 그대로 보인다.** `StatsModal.tsx`에서 낭독기용 라벨이 노출돼 `📝 방명록` 카드에 `방명록 수: 12개`처럼 라벨이 중복 표시된다 |
| `w-5 h-5` / `w-4 h-4` | 12 | 아이콘 크기 지정이 먹지 않는다 |
| `group` / `group-hover:opacity-100` | 2 | hover 시 노출 동작이 되지 않는다 |
| `w-full flex items-center justify-center` | 1 | Hero 플레이스홀더(이미지 미설정 시)가 가운데 정렬되지 않는다 |
| `text-center` / `text-4xl` / `text-xs mt-2` | 3 | Hero 플레이스홀더 문구 크기·정렬이 적용되지 않는다 |
| `relative w-full` / `min-h-full` | 3 | 영향 적음 (인라인 style이나 기본값이 대신하고 있다) |

해당 파일: `PreviewBlocks.tsx`, `StatsModal.tsx`, `InvitationPreview.tsx`,
`BlockEditor/index.tsx`, `BlockEditor/BlockSelector.tsx`,
`BlockEditor/DraggableBlock.tsx`, `BlockEditor/AddBlockMenu.tsx`,
`BlockEditor/editors/{Transport,Account,Gallery}BlockEditor.tsx`

**우선순위**: `sr-only` 5건이 유일하게 사용자에게 보이는 결함이므로 먼저 처리한다.
Mantine에는 시각적으로 숨기는 `visibleFrom`/`VisuallyHidden` 상당 기능이 있으므로
그쪽으로 바꾸거나, 라벨이 이미 위에 표시되고 있으니 `aria-label`로 옮긴다.

---

## 검증

- `npm run typecheck` / `npm run lint` / `npm run test`
- Web 청첩장과 나란히 놓고 시각 비교 (`www.camellialetter.art` vs admin 미리보기)
- Hero 블록은 **이미지 있음 / 없음** 두 경우를 모두 확인한다
  (플레이스홀더 경로가 위 무효 className의 영향을 받는다)
