import type {
  AccountBlockData,
  TransportBlockData,
  RsvpBlockData,
  TransportType,
  ParentsBlockData,
} from '@camellia-letter/shared-types';
import { Container, Stack, Text, Box, Flex, Divider, Title, Paper } from '@mantine/core';
import { withAlpha } from './themeUtils';

interface ThemeStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fontFamily: string;
  borderRadius: string;
}

// Message Block
export function PreviewMessageBlock({
  data,
  theme,
}: {
  data: { title?: string; content?: string };
  theme: ThemeStyles;
}) {
  const hasContent = data.title || data.content;

  return (
    <Container size="sm" py={48} style={{ fontFamily: theme.fontFamily }}>
      <Stack gap="lg" align="center">
        {hasContent ? (
          <>
            {data.title && (
              <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
                {data.title}
              </Title>
            )}
            {data.content && (
              <Text
                ta="center"
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line'
                }}
              >
                {data.content}
              </Text>
            )}
          </>
        ) : (
          <Box py="lg">
            <Stack gap="xs" align="center">
              <Text size="xl">💌</Text>
              <Text size="xs" style={{ color: theme.colors.text, opacity: 0.5 }}>
                인사말을 추가하세요
              </Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}

// Info Block
export function PreviewInfoBlock({
  weddingDate,
  theme,
}: {
  groomName?: string;
  brideName?: string;
  weddingDate: string;
  theme: ThemeStyles;
}) {
  const date = new Date(weddingDate);

  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const formattedTime = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // D-Day 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wedding = new Date(date);
  wedding.setHours(0, 0, 0, 0);
  const diffTime = wedding.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let ddayText = '';
  if (diffDays > 0) {
    ddayText = `D-${diffDays}`;
  } else if (diffDays === 0) {
    ddayText = 'D-Day';
  } else {
    ddayText = `D+${Math.abs(diffDays)}`;
  }

  return (
    <Paper py={48} radius={0} style={{ backgroundColor: withAlpha(theme.colors.background, 0.5) }}>
      <Container size="sm">
        <Stack gap="lg" align="center" style={{ fontFamily: theme.fontFamily }}>
          <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
            예식 일시
          </Title>
          <Stack gap={4} align="center">
            <Text size="xl" ta="center" style={{ color: theme.colors.text }}>
              {formattedDate}
            </Text>
            {formattedTime && (
              <Text size="lg" ta="center" style={{ color: theme.colors.primary }}>
                {formattedTime}
              </Text>
            )}
          </Stack>
          {ddayText && (
            <Paper
              px="md"
              py="xs"
              style={{
                backgroundColor: withAlpha(theme.colors.primary, 0.1),
                color: theme.colors.primary,
                borderRadius: theme.borderRadius === '0' ? '9999px' : `calc(${theme.borderRadius} * 4)`,
              }}
            >
              <Text size="sm" fw={600}>
                {ddayText}
              </Text>
            </Paper>
          )}
        </Stack>
      </Container>
    </Paper>
  );
}

// Map Block
export function PreviewMapBlock({
  venue,
  venueAddress,
  theme,
}: {
  venue: string;
  venueAddress: string;
  theme: ThemeStyles;
}) {
  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto text-center">
        <h2 className="text-sm font-medium mb-4" style={{ color: theme.colors.text }}>
          오시는 길
        </h2>
        <div
          className="bg-white shadow-sm p-4"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}
        >
          <p className="text-base" style={{ color: theme.colors.text }}>
            {venue}
          </p>
          <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
            {venueAddress}
          </p>
          <div
            className="mt-3 inline-block px-3 py-1.5 text-xs font-medium text-white"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius,
            }}
          >
            지도 보기
          </div>
        </div>
      </div>
    </section>
  );
}

// Gallery Block
export function PreviewGalleryBlock({
  data,
  theme,
}: {
  data: { images?: { url: string; caption?: string }[] };
  theme: ThemeStyles;
}) {
  const images = data.images || [];

  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium mb-4 text-center" style={{ color: theme.colors.text }}>
          갤러리
        </h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden"
                style={{
                  backgroundColor: withAlpha(theme.colors.secondary, 0.2),
                  borderRadius: theme.borderRadius,
                }}
              >
                <img
                  src={image.url}
                  alt={image.caption || `이미지 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="py-8 text-center"
            style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), borderRadius: theme.borderRadius }}
          >
            <span className="text-2xl">📷</span>
            <p className="text-xs mt-2" style={{ color: theme.colors.text, opacity: 0.5 }}>
              사진을 추가하세요
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Account Block
export function PreviewAccountBlock({
  data,
  theme,
}: {
  data: AccountBlockData;
  theme: ThemeStyles;
}) {
  const {
    groomTitle = '신랑측',
    groomAccounts = [],
    brideTitle = '신부측',
    brideAccounts = [],
  } = data;
  const hasGroomAccounts = groomAccounts.length > 0;
  const hasBrideAccounts = brideAccounts.length > 0;
  const hasAnyAccounts = hasGroomAccounts || hasBrideAccounts;

  return (
    <section
      className="py-8 px-4"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          마음 전하실 곳
        </h2>
        {hasAnyAccounts ? (
          <div className="space-y-3">
            {hasGroomAccounts && (
            <div
              className="border p-3 text-center"
              style={{
                backgroundColor: withAlpha(theme.colors.primary, 0.05),
                borderColor: withAlpha(theme.colors.primary, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <p className="text-xs font-medium" style={{ color: theme.colors.primary }}>
                {groomTitle}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {groomAccounts.length}개 계좌
              </p>
            </div>
          )}
          {hasBrideAccounts && (
            <div
              className="border p-3 text-center"
              style={{
                backgroundColor: withAlpha(theme.colors.accent, 0.05),
                borderColor: withAlpha(theme.colors.accent, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <p className="text-xs font-medium" style={{ color: theme.colors.accent }}>
                {brideTitle}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {brideAccounts.length}개 계좌
              </p>
            </div>
          )}
          </div>
        ) : (
          <div
            className="py-8 text-center"
            style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), borderRadius: theme.borderRadius }}
          >
            <span className="text-2xl">💰</span>
            <p className="text-xs mt-2" style={{ color: theme.colors.text, opacity: 0.5 }}>
              계좌 정보를 추가하세요
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Transport Block
const transportIcons: Record<TransportType, string> = {
  subway: '🚇',
  bus: '🚌',
  car: '🚗',
  shuttle: '🚐',
  other: '📍',
};

export function PreviewTransportBlock({
  data,
  theme,
}: {
  data: TransportBlockData;
  theme: ThemeStyles;
}) {
  const { title = '오시는 길 안내', items = [], parkingInfo = '' } = data;
  const hasItems = items.length > 0;
  const hasParkingInfo = parkingInfo && parkingInfo.trim() !== '';
  const hasAnyContent = hasItems || hasParkingInfo;

  return (
    <section
      className="py-8 px-4"
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          {title}
        </h2>
        {hasAnyContent ? (
          <div className="space-y-2">
            {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="border p-2 flex items-center gap-2"
              style={{
                backgroundColor: withAlpha(theme.colors.primary, 0.05),
                borderColor: withAlpha(theme.colors.primary, 0.1),
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">{transportIcons[item.type] || '📍'}</span>
              <span className="text-xs" style={{ color: theme.colors.text }}>
                {item.title}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-center" style={{ color: theme.colors.text, opacity: 0.6 }}>
              +{items.length - 3}개 더보기
            </p>
          )}
          {hasParkingInfo && (
            <div
              className="border p-2 flex items-center gap-2"
              style={{
                backgroundColor: withAlpha(theme.colors.secondary, 0.1),
                borderColor: withAlpha(theme.colors.secondary, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">🅿️</span>
              <span className="text-xs" style={{ color: theme.colors.text }}>
                주차 안내
              </span>
            </div>
          )}
          </div>
        ) : (
          <div
            className="py-8 text-center"
            style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), borderRadius: theme.borderRadius }}
          >
            <span className="text-2xl">🚗</span>
            <p className="text-xs mt-2" style={{ color: theme.colors.text, opacity: 0.5 }}>
              교통 정보를 추가하세요
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Guestbook Block
export function PreviewGuestbookBlock({ theme }: { theme: ThemeStyles }) {
  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium mb-4 text-center" style={{ color: theme.colors.text }}>
          방명록
        </h2>
        <div
          className="bg-white shadow-sm p-4"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}
        >
          <div className="space-y-2">
            <input
              type="text"
              placeholder="이름"
              disabled
              className="w-full px-2 py-1.5 border text-xs"
              style={{
                borderColor: theme.colors.secondary,
                borderRadius: theme.borderRadius,
              }}
            />
            <textarea
              placeholder="축하 메시지"
              disabled
              rows={2}
              className="w-full px-2 py-1.5 border text-xs resize-none"
              style={{
                borderColor: theme.colors.secondary,
                borderRadius: theme.borderRadius,
              }}
            />
            <button
              disabled
              className="w-full py-1.5 text-xs text-white"
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius,
              }}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// RSVP Block
export function PreviewRsvpBlock({ data, theme }: { data: RsvpBlockData; theme: ThemeStyles }) {
  const { title = '참석 여부' } = data;

  return (
    <section
      className="py-8 px-4"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-1">
          {['참석', '불참', '미정'].map((label, index) => (
            <div
              key={index}
              className="border p-2 text-center"
              style={{
                borderColor: index === 0 ? theme.colors.primary : theme.colors.secondary,
                backgroundColor: index === 0 ? withAlpha(theme.colors.primary, 0.1) : 'transparent',
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">{['😊', '😢', '🤔'][index]}</span>
              <p className="text-xs mt-1" style={{ color: theme.colors.text }}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <button
          disabled
          className="w-full mt-3 py-1.5 text-xs text-white"
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius,
          }}
        >
          참석 여부 제출
        </button>
      </div>
    </section>
  );
}

// Hero Block
export function PreviewHeroBlock({
  data,
  theme,
}: {
  data: { imageUrl?: string };
  theme: ThemeStyles;
}) {
  return (
    <section className="relative w-full" style={{ backgroundColor: theme.colors.background }}>
      <div className="relative w-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="메인 이미지"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            draggable={false}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), minHeight: '300px' }}
          >
            <div className="text-center">
              <span className="text-4xl">🖼️</span>
              <p className="text-xs mt-2" style={{ color: theme.colors.text, opacity: 0.5 }}>
                메인 이미지를 추가하세요
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Wedding Summary Block
export function PreviewWeddingSummaryBlock({
  groomName,
  brideName,
  weddingDate,
  venue,
  theme,
}: {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  theme: ThemeStyles;
}) {
  const date = new Date(weddingDate);

  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 || 12;
  const formattedTime = `${period} ${displayHour}시${minutes > 0 ? ` ${minutes}분` : ''}`;

  return (
    <Container size="sm" py={32} style={{ fontFamily: theme.fontFamily }}>
      <Stack gap="xs" align="center">
        <Text size="lg" fw={500} ta="center" style={{ color: theme.colors.text }}>
          {groomName} · {brideName}
        </Text>
        <Text size="md" ta="center" style={{ color: theme.colors.text, opacity: 0.8 }}>
          {formattedDate} {formattedTime}
        </Text>
        <Text size="md" ta="center" style={{ color: theme.colors.text, opacity: 0.8 }}>
          {venue}
        </Text>
      </Stack>
    </Container>
  );
}

// Parents Block
export function PreviewParentsBlock({
  data,
  groomName,
  brideName,
  theme,
}: {
  data: ParentsBlockData;
  groomName: string;
  brideName: string;
  theme: ThemeStyles;
}) {
  const { groomFatherName, groomMotherName, brideFatherName, brideMotherName } = data;

  const hasGroomParents = groomFatherName || groomMotherName;
  const hasBrideParents = brideFatherName || brideMotherName;
  const hasAnyParents = hasGroomParents || hasBrideParents;

  return (
    <Container
      size="sm"
      py={48}
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}
    >
      <Box p="md" style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.05), borderRadius: theme.borderRadius }}>
        <Stack gap={32}>
          {hasAnyParents ? (
            <>
              {hasGroomParents && (
                <Flex justify="space-between" wrap="nowrap" gap="md">
                  <Text size="md" fw={600} style={{ color: theme.colors.text, minWidth: 50 }}>
                    신랑
                  </Text>
                  <Flex flex={1} align="center" justify="center" gap="sm">
                    <Stack gap="xs" align="center">
                      {groomFatherName && (
                        <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                          {groomFatherName}
                        </Text>
                      )}
                      {groomMotherName && (
                        <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                          {groomMotherName}
                        </Text>
                      )}
                    </Stack>
                    {groomFatherName && groomMotherName && (
                      <Text size="xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        의
                      </Text>
                    )}
                  </Flex>
                  <Flex align="center" gap="xs" style={{ minWidth: 80, justifyContent: 'flex-end' }}>
                    <Text size="xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                      아들
                    </Text>
                    <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                      {groomName}
                    </Text>
                  </Flex>
                </Flex>
              )}

              {hasGroomParents && hasBrideParents && <Divider style={{ opacity: 0.1 }} />}

              {hasBrideParents && (
                <Flex justify="space-between" wrap="nowrap" gap="md">
                  <Text size="md" fw={600} style={{ color: theme.colors.text, minWidth: 50 }}>
                    신부
                  </Text>
                  <Flex flex={1} align="center" justify="center" gap="sm">
                    <Stack gap="xs" align="center">
                      {brideFatherName && (
                        <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                          {brideFatherName}
                        </Text>
                      )}
                      {brideMotherName && (
                        <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                          {brideMotherName}
                        </Text>
                      )}
                    </Stack>
                    {brideFatherName && brideMotherName && (
                      <Text size="xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        의
                      </Text>
                    )}
                  </Flex>
                  <Flex align="center" gap="xs" style={{ minWidth: 80, justifyContent: 'flex-end' }}>
                    <Text size="xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                      딸
                    </Text>
                    <Text size="md" fw={600} style={{ color: theme.colors.text }}>
                      {brideName}
                    </Text>
                  </Flex>
                </Flex>
              )}
            </>
          ) : (
            <Box py="xl" ta="center">
              <Stack gap="xs" align="center">
                <Text size="xl">👨‍👩‍👧‍👦</Text>
                <Text size="xs" style={{ color: theme.colors.text, opacity: 0.5 }}>
                  부모님 성함을 추가하세요
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

// Snap Upload Block
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
