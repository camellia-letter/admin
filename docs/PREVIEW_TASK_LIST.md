# Admin 미리보기 수정 작업 목록

## 📋 작업 개요

**목표**: Admin 미리보기를 실제 Web 청첩장과 동일하게 표시

**핵심 문제**: Admin Preview가 Tailwind CSS로 작성되어 있어서 Mantine 기반 Web 청첩장과 스타일이 다름

**해결 방법**: Admin Preview의 모든 블록을 Mantine 컴포넌트 기반으로 재작성

---

## ✅ 작업 체크리스트

### Phase 1: 준비 작업

- [x] Web 블록 컴포넌트 분석 완료
- [x] 문제 원인 파악 완료
- [x] 작업 계획 수립 완료

### Phase 2: PreviewBlocks.tsx 수정

**파일**: `/Users/eonjeongcha/Desktop/myCode/CamelliaLetter/admin/src/components/Preview/PreviewBlocks.tsx`

#### 2-1. Import 수정
```typescript
// 추가 필요
import { Container, Stack, Text, Box, Flex, Divider, Paper, Title, SimpleGrid, AspectRatio } from '@mantine/core';
```

#### 2-2. PreviewWeddingSummaryBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={32} 적용
- [ ] Stack gap="xs" align="center" 적용
- [ ] Text size="lg" fw={500} (이름)
- [ ] Text size="md" opacity={0.8} (날짜/장소)

#### 2-3. PreviewMessageBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Stack gap="lg" align="center" 적용
- [ ] Title order={2} size="h3" (제목)
- [ ] Text lineHeight={1.8} (내용)
- [ ] whiteSpace: 'pre-line' 유지

#### 2-4. PreviewParentsBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Box p="md" with backgroundColor
- [ ] Stack gap={32} 적용
- [ ] Flex justify="space-between" wrap="nowrap"
- [ ] Divider 추가 (신랑/신부 사이)
- [ ] Text size="md" fw={600} (이름)
- [ ] Text size="xs" opacity={0.6} (보조)

#### 2-5. PreviewInfoBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Paper shadow="sm" p="md" 적용
- [ ] Text size="xl" (날짜)
- [ ] Text size="lg" color={primary} (시간)
- [ ] D-day 뱃지 스타일 수정 (px="md" py="xs" fw={600} borderRadius: '9999px')

#### 2-6. PreviewMapBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Paper 컴포넌트로 지도 영역 감싸기
- [ ] 버튼 스타일 수정

#### 2-7. PreviewGalleryBlock 수정
- [ ] Tailwind grid 제거
- [ ] Container size="sm" py={48} 적용
- [ ] SimpleGrid cols={3} spacing="sm" 적용
- [ ] AspectRatio ratio={1} 사용
- [ ] Paper로 각 이미지 감싸기
- [ ] Title order={2} size="h3" (제목)

#### 2-8. PreviewAccountBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] gradient 배경 유지
- [ ] Stack gap="lg" 적용
- [ ] Paper 컴포넌트로 각 계좌 영역 감싸기

#### 2-9. PreviewTransportBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Stack gap="md" 적용
- [ ] Paper로 각 교통수단 항목 감싸기

#### 2-10. PreviewGuestbookBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] Paper shadow="sm" p="md" 적용
- [ ] Stack gap="md" 적용

#### 2-11. PreviewRsvpBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] gradient 배경 유지
- [ ] SimpleGrid cols={3} 적용
- [ ] Paper로 각 옵션 감싸기

#### 2-12. PreviewSnapUploadBlock 수정
- [ ] Tailwind 클래스 제거
- [ ] Container size="sm" py={48} 적용
- [ ] gradient 배경 유지
- [ ] Paper shadow="sm" p="md" 적용

#### 2-13. PreviewHeroBlock 확인
- [x] 이미 height: 'auto', objectFit: 'contain' 적용됨
- [ ] 실제 렌더링 확인 필요

### Phase 3: 검증

- [ ] 타입체크 실행: `pnpm typecheck`
- [ ] 개발 서버 재시작
- [ ] 브라우저 하드 새로고침
- [ ] Admin 미리보기와 Web 청첩장 나란히 비교
- [ ] 모든 블록의 크기, 간격, 스타일 확인
- [ ] 스크롤 동작 확인 (가로 스크롤 없어야 함)

---

## 🎯 각 블록별 주요 변경 사항

### 공통 변경 사항
1. **Container**: 모두 `<Container size="sm">` 사용
2. **Padding**: 대부분 `py={48}`, WeddingSummaryBlock만 `py={32}`
3. **Stack**: `<Stack gap="lg">` 또는 `gap="xs"` 사용
4. **Text**: Mantine Text 컴포넌트로 교체
   - `size="lg"`, `size="md"`, `size="sm"`, `size="xs"` 사용
   - `fw={500}`, `fw={600}` (font-weight)
   - `opacity={0.8}`, `opacity={0.6}` (투명도)
   - `ta="center"` (text-align)

### Tailwind → Mantine 매핑

| Tailwind | Mantine |
|----------|---------|
| `py-8 px-4` | `py={48}` (Container가 자동 padding) |
| `py-6 px-4` | `py={32}` |
| `max-w-full mx-auto` | `<Container size="sm">` |
| `text-xs` | `size="xs"` |
| `text-sm` | `size="sm"` |
| `text-base` | `size="md"` |
| `text-lg` | `size="lg"` |
| `text-xl` | `size="xl"` |
| `font-medium` | `fw={500}` |
| `font-semibold` | `fw={600}` |
| `text-center` | `ta="center"` |
| `space-y-2` | `<Stack gap="xs">` |
| `space-y-4` | `<Stack gap="md">` |
| `space-y-6` | `<Stack gap="lg">` |
| `gap-1` | `spacing="xs"` |
| `gap-2` | `spacing="sm"` |
| `gap-4` | `spacing="md"` |
| `grid grid-cols-3` | `<SimpleGrid cols={3}>` |
| `flex justify-between` | `<Flex justify="space-between">` |
| `opacity-80` | `opacity={0.8}` |
| `opacity-60` | `opacity={0.6}` |
| `bg-white shadow-sm` | `<Paper shadow="sm">` |
| `aspect-square` | `<AspectRatio ratio={1}>` |

---

## 📝 코드 작성 가이드

### 1. Container 사용 예시
```typescript
<Container size="sm" py={48} style={{ fontFamily: theme.fontFamily }}>
  {/* 내용 */}
</Container>
```

### 2. Stack 사용 예시
```typescript
<Stack gap="lg" align="center">
  <Text size="lg" fw={500} ta="center" style={{ color: theme.colors.text }}>
    제목
  </Text>
  <Text size="md" ta="center" style={{ color: theme.colors.text, opacity: 0.8 }}>
    내용
  </Text>
</Stack>
```

### 3. Flex 사용 예시
```typescript
<Flex justify="space-between" wrap="nowrap" gap="md">
  <Text size="md" fw={600}>왼쪽</Text>
  <Text size="md" fw={600}>오른쪽</Text>
</Flex>
```

### 4. SimpleGrid 사용 예시
```typescript
<SimpleGrid cols={3} spacing="sm">
  {items.map((item, index) => (
    <AspectRatio key={index} ratio={1}>
      <Paper style={{ backgroundColor, borderRadius }}>
        <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Paper>
    </AspectRatio>
  ))}
</SimpleGrid>
```

### 5. Paper 사용 예시
```typescript
<Paper shadow="sm" p="md" style={{ borderRadius: theme.borderRadius }}>
  {/* 내용 */}
</Paper>
```

---

## ⚠️ 주의사항

1. **theme.colors 사용**: 기존 theme 구조 유지
2. **withAlpha 함수**: 기존 함수 계속 사용
3. **fontFamily**: 모든 Container에 `style={{ fontFamily: theme.fontFamily }}` 추가
4. **borderRadius**: `theme.borderRadius` 사용
5. **플레이스홀더**: 데이터 없을 때 플레이스홀더 유지
6. **조건부 렌더링**: 기존 로직 유지 (데이터 없으면 플레이스홀더 또는 null)

---

## 🔍 검증 방법

### 1. 시각적 비교
- Admin 미리보기 (localhost:4001)
- Web 청첩장 (localhost:4000 또는 새 탭에서 보기)
- 두 화면을 나란히 놓고 비교

### 2. 체크 항목
- [ ] 텍스트 크기가 비슷한가?
- [ ] 블록 간 간격이 비슷한가?
- [ ] 색상이 동일한가?
- [ ] 레이아웃이 깨지지 않았는가?
- [ ] 이미지가 제대로 표시되는가?
- [ ] 가로 스크롤이 없는가?
- [ ] 모든 블록이 표시되는가?

### 3. 기술적 검증
```bash
# 타입체크
pnpm typecheck

# 개발 서버 재시작 (필요시)
pkill -9 -f "vite"
pnpm dev
```

---

## 📊 예상 결과

### Before (현재)
- Tailwind 기반 작은 텍스트
- 좁은 간격 (py-8 = 32px)
- 레이아웃 깨짐
- 이미지 크기 이상

### After (목표)
- Mantine 기반 적절한 텍스트 크기
- 넓은 간격 (py={48} = 48px)
- Web과 동일한 레이아웃
- Web과 동일한 이미지 표시

---

## 🚀 작업 시작 시

이 파일을 다시 제시하면 Phase 2부터 순차적으로 작업을 시작합니다.

각 블록을 하나씩 수정하고, 수정 완료 시마다 체크리스트에 표시합니다.
