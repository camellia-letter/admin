# 미리보기 UI 수정 계획

## 📋 작성일

2026-06-29

---

## 🔍 진단 결과

### 1. 타입체크 및 빌드 상태

- ✅ TypeScript 타입체크: 통과
- ⚠️ ESLint: 미설치 (command not found)
- ✅ IDE 진단: 오류 없음

### 2. 발견된 문제점

#### 🚨 심각: SNAP_UPLOAD 블록 미리보기 컴포넌트 누락

**위치**: `src/components/Preview/`

**증상**:
- 최근 커밋(aaa6916)에서 SNAP_UPLOAD 블록 타입이 추가됨
- 미리보기 렌더링 컴포넌트가 구현되지 않음
- 해당 블록이 포함된 초대장의 미리보기에서 레이아웃 깨짐 발생

**영향받는 파일**:
1. `src/components/Preview/PreviewBlocks.tsx`
   - ❌ `PreviewSnapUploadBlock` 컴포넌트 없음

2. `src/components/Preview/InvitationPreview.tsx`
   - ❌ Line 82-139: `BlockRenderer` 함수의 switch 문에 `case 'SNAP_UPLOAD':` 처리 없음
   - 결과: SNAP_UPLOAD 블록이 있으면 `default: return null;`로 처리되어 렌더링되지 않음

**참고**:
- ✅ `src/utils/blockHelpers.ts:61-65` - SNAP_UPLOAD 기본 데이터는 정의됨
- ✅ `src/utils/blockHelpers.ts:117,139` - 라벨과 설명 정의됨

#### ⚠️ WORK_RULES 위반: console.error 사용

**위치**: `src/components/print/PrintPreview.tsx`

**위반 사항**:
- Line 43: `console.error('PDF 생성 실패:', err);`
- Line 126: `console.error('PDF 로드 실패:', error);`

**규칙**: `docs/WORK_RULES.md:155` - `console.log` 금지

---

## 🛠 수정 방안

### Priority 1: SNAP_UPLOAD 블록 미리보기 구현

#### Step 1: PreviewSnapUploadBlock 컴포넌트 생성

**파일**: `src/components/Preview/PreviewBlocks.tsx`

**구현 내용**:
```typescript
// SNAP_UPLOAD Block
export function PreviewSnapUploadBlock({
  data,
  theme,
}: {
  data: { title?: string; description?: string };
  theme: ThemeStyles;
}) {
  const title = data?.title || '스냅 업로드';
  const description = data?.description || '하객들이 촬영한 사진을 업로드할 수 있습니다.';

  return (
    <section
      className="py-8 px-4"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.15)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-full mx-auto text-center">
        <h2 className="text-sm font-medium mb-4" style={{ color: theme.colors.text }}>
          {title}
        </h2>
        <div
          className="bg-white shadow-sm p-4"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}
        >
          <div className="space-y-2">
            <div
              className="border-2 border-dashed p-6 flex flex-col items-center gap-2"
              style={{
                borderColor: theme.colors.secondary,
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-2xl">📸</span>
              <p className="text-xs" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {description}
              </p>
            </div>
            <button
              disabled
              className="w-full py-1.5 text-xs text-white"
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius,
              }}
            >
              사진 선택하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**위치**: 파일 끝부분, `PreviewParentsBlock` 다음

#### Step 2: InvitationPreview에 렌더링 로직 추가

**파일**: `src/components/Preview/InvitationPreview.tsx`

**수정 위치**: Line 136 (RSVP 블록 다음)

**추가 내용**:
```typescript
case 'RSVP':
  return <PreviewRsvpBlock key={block.id} data={block.data} theme={theme} />;
case 'SNAP_UPLOAD':
  return <PreviewSnapUploadBlock key={block.id} data={block.data} theme={theme} />;
default:
  return null;
```

#### Step 3: import 문 추가

**파일**: `src/components/Preview/InvitationPreview.tsx`

**수정 위치**: Line 3-15 (import 블록)

**추가 내용**:
```typescript
import {
  PreviewMessageBlock,
  PreviewInfoBlock,
  PreviewMapBlock,
  PreviewGalleryBlock,
  PreviewAccountBlock,
  PreviewTransportBlock,
  PreviewGuestbookBlock,
  PreviewRsvpBlock,
  PreviewHeroBlock,
  PreviewWeddingSummaryBlock,
  PreviewParentsBlock,
  PreviewSnapUploadBlock, // ← 추가
} from './PreviewBlocks';
```

---

### Priority 2: console.error 제거

**파일**: `src/components/print/PrintPreview.tsx`

**수정 방안**:

1. **Line 42-44 수정**:
```typescript
// 기존
console.error('PDF 생성 실패:', err);
setError('PDF 미리보기를 생성하지 못했습니다.');

// 수정 후
setError('PDF 미리보기를 생성하지 못했습니다.');
```

2. **Line 125-127 수정**:
```typescript
// 기존
console.error('PDF 로드 실패:', error);
setError('PDF를 불러오지 못했습니다.');

// 수정 후
setError('PDF를 불러오지 못했습니다.');
```

**주의**: eslint 주석도 함께 제거

---

## ✅ 검증 방법

### 1. 타입체크
```bash
pnpm typecheck
```

### 2. 기능 테스트
1. Admin 앱에서 초대장 편집 페이지 열기
2. 블록 추가 메뉴에서 "스냅 업로드" 블록 추가
3. 미리보기 패널에서 SNAP_UPLOAD 블록이 정상 렌더링되는지 확인
4. 다른 블록들과 함께 순서 변경 테스트
5. 테마 변경 시 스타일 적용 확인

### 3. 시각적 검증 항목
- [ ] 블록 제목 표시
- [ ] 설명 텍스트 표시
- [ ] 📸 이모지 아이콘 표시
- [ ] 점선 테두리 표시
- [ ] "사진 선택하기" 버튼 표시
- [ ] 테마 색상 정상 적용
- [ ] 반응형 레이아웃 유지

---

## 📌 작업 시 주의사항

### WORK_RULES.md 준수사항

1. **함수 선언**: 화살표 함수 사용 (`export const` 또는 `export function`)
2. **변수 선언**: `const` 기본, 재할당 필요 시 `let`
3. **export**: 컴포넌트는 `export const` 또는 `export function`
4. **최소 변경**: 기존 구조 유지, 필요한 부분만 수정
5. **타입 안정성**: `any` 사용 금지
6. **디버깅 코드**: `console.log` 금지

### 기존 패턴 따르기

- `PreviewBlocks.tsx`의 다른 블록 컴포넌트 구조 참고
- ThemeStyles 인터페이스 활용
- `withAlpha` 유틸 함수 활용
- 동일한 스타일 패턴 유지 (padding, spacing, 반응형)

---

## 📝 예상 변경 파일

1. `src/components/Preview/PreviewBlocks.tsx` (약 40줄 추가)
2. `src/components/Preview/InvitationPreview.tsx` (3줄 추가)
3. `src/components/print/PrintPreview.tsx` (2줄 제거)

**총 변경량**: +43, -2 lines

---

## 🔗 관련 커밋

- aaa6916 - feat: add SNAP_UPLOAD block type support to admin UI
- cf32259 - Fix(admin): SNAP_UPLOAD 블록 저장 및 복원 오류 수정

---

## 🎯 완료 기준

- [ ] SNAP_UPLOAD 블록이 미리보기에서 정상 렌더링됨
- [ ] console.error 모두 제거됨
- [ ] `pnpm typecheck` 통과
- [ ] 다른 블록들과 레이아웃 일관성 유지
- [ ] WORK_RULES.md 규칙 준수
- [ ] 불필요한 코드 없음
