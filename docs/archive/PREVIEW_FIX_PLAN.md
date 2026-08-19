# Admin 미리보기 수정 계획

## 📋 작성일
2026-07-09

---

## 🔍 현재 문제 상황

### 1. Admin 미리보기가 실제 Web 청첩장과 완전히 다르게 보임
- **Hero 블록**: 이미지가 제대로 표시되지 않음
- **Gallery 블록**: 이미지가 너무 크게 보임
- **모든 블록**: 레이아웃이 깨지고 CSS가 제대로 적용되지 않음
- **텍스트 크기**: 실제보다 크거나 작게 보임
- **간격(padding)**: 실제보다 좁게 보임

### 2. 실제 Web 청첩장은 정상 작동
- localhost:4000에서 정상적으로 보임
- 배포된 페이지도 정상

---

## 🎯 목표

**Admin 미리보기를 실제 Web 청첩장과 동일하게 표시**

- 픽셀 단위로 완전히 동일하지 않아도 됨
- **분위기와 레이아웃이 동일**해야 함
- 미리보기의 목적: 실제 청첩장이 어떻게 보일지 확인

---

## 🔧 근본 원인

### Admin Preview vs Web 청첩장 차이점

| 항목 | Admin Preview (현재) | Web 청첩장 (목표) |
|------|---------------------|------------------|
| **UI 라이브러리** | Tailwind CSS 클래스 | Mantine 컴포넌트 |
| **Padding** | `py-8` (32px) | `py={48}` (48px) |
| **Container** | `max-w-full mx-auto` | `<Container size="sm">` |
| **Font Size** | `text-sm`, `text-xs` | `size="lg"`, `size="md"` |
| **Layout** | Tailwind flex/grid | Mantine Stack/Flex |
| **간격** | `gap-1`, `space-y-2` | `gap="lg"`, `gap="xs"` |

**결론**: Admin Preview가 Tailwind로 작성되어 있어서 Mantine 기반 Web 청첩장과 스타일이 다름

---

## 📝 수정 작업 계획

### Phase 1: Web 블록 컴포넌트 분석 ✅
- [x] HeroBlock.tsx 분석 완료
- [x] GalleryBlock.tsx 분석 완료
- [x] WeddingSummaryBlock.tsx 분석 완료
- [x] MessageBlock.tsx 분석 완료
- [x] ParentsBlock.tsx 분석 완료
- [x] InfoBlock.tsx 분석 완료

### Phase 2: Admin Preview 블록 재작성 🔄

각 블록을 Web과 동일하게 **Mantine 컴포넌트 기반**으로 재작성

#### 2-1. HeroBlock
- **현재**: `height: 'auto'`, `objectFit: 'contain'` 적용됨
- **Web과 동일**: 추가 수정 필요 없음 (이미 동일)

#### 2-2. WeddingSummaryBlock
- **현재**: Tailwind 클래스 (`py-6 px-4`, `text-base`)
- **변경**:
  - `<Container size="sm" py={32}>`
  - `<Stack gap="xs" align="center">`
  - `<Text size="lg" fw={500}>` (이름)
  - `<Text size="md" opacity={0.8}>` (날짜/장소)

#### 2-3. MessageBlock
- **현재**: Tailwind 클래스 (`py-8 px-4`, `text-xs`)
- **변경**:
  - `<Container size="sm" py={48}>`
  - `<Stack gap="lg" align="center">`
  - `<Title order={2} size="h3">` (제목)
  - `<Text style={{ lineHeight: 1.8 }}>` (내용)

#### 2-4. ParentsBlock
- **현재**: Tailwind flex (`justify-between`, `gap-2`)
- **변경**:
  - `<Container size="sm" py={48}>`
  - `<Box p="md" style={{ backgroundColor: withAlpha(...) }}>`
  - `<Stack gap={32}>`
  - `<Flex justify="space-between" wrap="nowrap">`
  - `<Divider>` (신랑/신부 사이)
  - `<Text size="md" fw={600}>` (부모 이름)
  - `<Text size="xs" opacity={0.6}>` (보조 텍스트)

#### 2-5. InfoBlock
- **현재**: Tailwind 클래스 사용
- **변경**:
  - `<Container size="sm" py={48}>`
  - `<Paper shadow="sm" p="md">`
  - `<Text size="xl">` (날짜)
  - `<Text size="lg" color={primary}>` (시간)
  - D-day 뱃지: `px="md" py="xs" fw={600} style={{ borderRadius: '9999px' }}`

#### 2-6. GalleryBlock
- **현재**: 모든 이미지 표시 (수정 완료)
- **확인 필요**: 이미지 크기가 여전히 너무 큰지 확인
- **Web과 비교**:
  - Web은 `<SimpleGrid cols={3} spacing="sm">`
  - Admin은 `grid grid-cols-3 gap-1`
  - **변경**: `<SimpleGrid cols={3} spacing="sm">` 사용

#### 2-7. MapBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

#### 2-8. AccountBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

#### 2-9. TransportBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

#### 2-10. GuestbookBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

#### 2-11. RsvpBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

#### 2-12. SnapUploadBlock
- **변경**:
  - `<Container size="sm" py={48}>`
  - Tailwind → Mantine 변환

### Phase 3: InvitationPreview 컨테이너 수정
- **현재**: `min-h-full` div
- **확인**: Web의 전체 레이아웃 구조 확인 후 동일하게 적용

### Phase 4: 테스트 및 검증
- [ ] 실제 Web 청첩장과 나란히 놓고 비교
- [ ] 모든 블록의 간격, 크기, 스타일 확인
- [ ] 타입체크 통과
- [ ] 빌드 성공

---

## 🚨 주의사항

### 1. WORK_RULES.md 준수
- 화살표 함수 사용
- `const` 기본, `let` 필요시만
- `export const` (컴포넌트)
- 최소 변경
- `any` 금지
- `console.log` 금지

### 2. 기존 구조 유지
- 파일 구조 변경 금지
- `PreviewBlocks.tsx` 내에서만 수정
- `InvitationPreview.tsx`는 최소한만 수정

### 3. Mantine 컴포넌트 일관성
- Web과 동일한 컴포넌트 사용
- Web과 동일한 props 사용 (`size`, `py`, `gap` 등)
- Web과 동일한 스타일 값 사용

---

## ✅ 완료 기준

1. **시각적 일치**: Admin 미리보기가 Web 청첩장과 거의 동일하게 보임
2. **레이아웃 정상**: 모든 블록이 올바른 간격과 크기로 표시됨
3. **스크롤 정상**: 세로 스크롤만 필요하고 가로 스크롤 불필요
4. **타입 안전**: TypeScript 타입체크 통과
5. **빌드 성공**: pnpm typecheck 통과

---

## 📊 예상 작업량

- **수정 파일**: 1개 (`src/components/Preview/PreviewBlocks.tsx`)
- **예상 라인 수**: 약 300-400줄 수정
- **예상 시간**: 30-45분

---

## 🔗 참고 파일

### Web 블록 컴포넌트 (참조용)
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/HeroBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/GalleryBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/WeddingSummaryBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/MessageBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/ParentsBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/InfoBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/MapBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/AccountBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/TransportBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/GuestbookBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/RsvpBlock.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web/src/components/blocks/SnapUploadBlock.tsx`

### Admin Preview 컴포넌트 (수정 대상)
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/admin/src/components/Preview/PreviewBlocks.tsx`
- `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/admin/src/components/Preview/InvitationPreview.tsx`

---

## 📌 다음 단계

이 문서를 승인받은 후 Phase 2부터 순차적으로 작업 진행
