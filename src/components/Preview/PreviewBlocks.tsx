import type {
  AccountBlockData,
  TransportBlockData,
  RsvpBlockData,
  TransportType,
  ParentsBlockData,
} from '@camellia-letter/shared-types';
import { Container, Stack, Text, Box, Flex, Divider, Title, Paper, SimpleGrid, AspectRatio } from '@mantine/core';
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
    <Container size="sm" py={48}>
      <Stack gap="lg" align="center" style={{ fontFamily: theme.fontFamily }}>
        <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
          오시는 길
        </Title>
        <Paper shadow="sm" w="100%" style={{ overflow: 'hidden', borderRadius: `calc(${theme.borderRadius} * 2)` }}>
          <Stack gap="md" p="xl" align="center">
            <Stack gap={4} align="center">
              <Text size="xl" ta="center" style={{ color: theme.colors.text }}>
                {venue}
              </Text>
              <Text ta="center" style={{ color: theme.colors.text, opacity: 0.6 }}>
                {venueAddress}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
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

  if (images.length === 0) return null;

  return (
    <Container size="lg" py={48} style={{ fontFamily: theme.fontFamily }}>
      <Stack gap="lg">
        <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
          갤러리
        </Title>
        <SimpleGrid cols={3} spacing="sm">
          {images.map((image, index) => (
            <AspectRatio key={index} ratio={1}>
              <Paper
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: withAlpha(theme.colors.secondary, 0.2),
                  borderRadius: theme.borderRadius,
                }}
              >
                <img
                  src={image.url}
                  alt={image.caption || `이미지 ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Paper>
            </AspectRatio>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
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
    <Paper
      py={48}
      radius={0}
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
      }}
    >
      <Container size="sm">
        <Stack gap="xl" style={{ fontFamily: theme.fontFamily }}>
          <Stack gap="md" align="center">
            <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
              마음 전하실 곳
            </Title>
          </Stack>
          {hasAnyAccounts ? (
            <Stack gap="md">
              {hasGroomAccounts && (
                <Paper
                  p="md"
                  style={{
                    backgroundColor: withAlpha(theme.colors.primary, 0.05),
                    border: `1px solid ${withAlpha(theme.colors.primary, 0.2)}`,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  <Stack gap="xs" align="center">
                    <Text size="sm" fw={500} style={{ color: theme.colors.primary }}>
                      {groomTitle}
                    </Text>
                    <Text size="xs" style={{ color: theme.colors.text, opacity: 0.7 }}>
                      {groomAccounts.length}개 계좌
                    </Text>
                  </Stack>
                </Paper>
              )}
              {hasBrideAccounts && (
                <Paper
                  p="md"
                  style={{
                    backgroundColor: withAlpha(theme.colors.accent, 0.05),
                    border: `1px solid ${withAlpha(theme.colors.accent, 0.2)}`,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  <Stack gap="xs" align="center">
                    <Text size="sm" fw={500} style={{ color: theme.colors.accent }}>
                      {brideTitle}
                    </Text>
                    <Text size="xs" style={{ color: theme.colors.text, opacity: 0.7 }}>
                      {brideAccounts.length}개 계좌
                    </Text>
                  </Stack>
                </Paper>
              )}
            </Stack>
          ) : (
            <Box py="xl" ta="center" style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), borderRadius: theme.borderRadius }}>
              <Stack gap="xs" align="center">
                <Text size="xl">💰</Text>
                <Text size="xs" style={{ color: theme.colors.text, opacity: 0.5 }}>
                  계좌 정보를 추가하세요
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Paper>
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
    <Container size="sm" py={48} style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}>
      <Stack gap="lg">
        <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
          {title}
        </Title>
        {hasAnyContent ? (
          <Stack gap="sm">
            {items.slice(0, 3).map((item, index) => (
              <Paper
                key={index}
                p="sm"
                style={{
                  backgroundColor: withAlpha(theme.colors.primary, 0.05),
                  border: `1px solid ${withAlpha(theme.colors.primary, 0.1)}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Flex align="center" gap="sm">
                  <Text size="lg">{transportIcons[item.type] || '📍'}</Text>
                  <Text size="xs" style={{ color: theme.colors.text }}>
                    {item.title}
                  </Text>
                </Flex>
              </Paper>
            ))}
            {items.length > 3 && (
              <Text size="xs" ta="center" style={{ color: theme.colors.text, opacity: 0.6 }}>
                +{items.length - 3}개 더보기
              </Text>
            )}
            {hasParkingInfo && (
              <Paper
                p="sm"
                style={{
                  backgroundColor: withAlpha(theme.colors.secondary, 0.1),
                  border: `1px solid ${withAlpha(theme.colors.secondary, 0.2)}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Flex align="center" gap="sm">
                  <Text size="lg">🅿️</Text>
                  <Text size="xs" style={{ color: theme.colors.text }}>
                    주차 안내
                  </Text>
                </Flex>
              </Paper>
            )}
          </Stack>
        ) : (
          <Box py="xl" ta="center" style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.1), borderRadius: theme.borderRadius }}>
            <Stack gap="xs" align="center">
              <Text size="xl">🚗</Text>
              <Text size="xs" style={{ color: theme.colors.text, opacity: 0.5 }}>
                교통 정보를 추가하세요
              </Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}

// Guestbook Block
export function PreviewGuestbookBlock({ theme }: { theme: ThemeStyles }) {
  return (
    <Container size="sm" py={48} style={{ fontFamily: theme.fontFamily }}>
      <Stack gap="lg">
        <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
          방명록
        </Title>
        <Paper
          p="md"
          shadow="sm"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)`, backgroundColor: 'white' }}
        >
          <Stack gap="sm">
            <input
              type="text"
              placeholder="이름"
              disabled
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${theme.colors.secondary}`,
                borderRadius: theme.borderRadius,
                fontSize: '12px',
              }}
            />
            <textarea
              placeholder="축하 메시지"
              disabled
              rows={2}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${theme.colors.secondary}`,
                borderRadius: theme.borderRadius,
                fontSize: '12px',
                resize: 'none',
              }}
            />
            <Paper
              py="xs"
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius,
                cursor: 'not-allowed',
              }}
            >
              <Text size="sm" ta="center" style={{ color: 'white' }}>
                작성하기
              </Text>
            </Paper>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

// RSVP Block
export function PreviewRsvpBlock({ data, theme }: { data: RsvpBlockData; theme: ThemeStyles }) {
  const { title = '참석 여부' } = data;

  return (
    <Paper
      py={48}
      radius={0}
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <Container size="sm">
        <Stack gap="lg">
          <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
            {title}
          </Title>
          <SimpleGrid cols={3} spacing="xs">
            {['참석', '불참', '미정'].map((label, index) => (
              <Paper
                key={index}
                p="sm"
                style={{
                  border: `1px solid ${index === 0 ? theme.colors.primary : theme.colors.secondary}`,
                  backgroundColor: index === 0 ? withAlpha(theme.colors.primary, 0.1) : 'transparent',
                  borderRadius: theme.borderRadius,
                }}
              >
                <Stack gap="xs" align="center">
                  <Text size="lg">{['😊', '😢', '🤔'][index]}</Text>
                  <Text size="xs" style={{ color: theme.colors.text }}>
                    {label}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
          <Paper
            py="xs"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius,
              cursor: 'not-allowed',
            }}
          >
            <Text size="sm" ta="center" style={{ color: 'white' }}>
              참석 여부 제출
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Paper>
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

  if (!hasAnyParents) return null;

  return (
    <Box py={48} style={{ backgroundColor: withAlpha(theme.colors.secondary, 0.15) }}>
      <Container size="sm">
        <Stack gap={32} style={{ fontFamily: theme.fontFamily }}>
          {hasGroomParents && (
            <Flex justify="space-between" align="center" p="md" gap="md" wrap="nowrap">
              <Text size="md" fw={500} style={{ color: theme.colors.text, minWidth: 50, textAlign: 'left' }}>
                신랑
              </Text>
              <Flex align="center" gap={8} style={{ flex: 1, justifyContent: 'center' }}>
                <Stack gap={4} style={{ alignItems: 'center' }}>
                  {groomFatherName && (
                    <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                      {groomFatherName}
                    </Text>
                  )}
                  {groomMotherName && (
                    <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                      {groomMotherName}
                    </Text>
                  )}
                </Stack>
                {groomFatherName && groomMotherName && (
                  <Text size="xs" fw={400} style={{ color: theme.colors.text, opacity: 0.6 }}>
                    의
                  </Text>
                )}
              </Flex>
              <Flex align="center" gap={4} style={{ minWidth: 80, justifyContent: 'flex-end' }}>
                <Text size="xs" fw={400} style={{ color: theme.colors.text, opacity: 0.6 }}>
                  아들
                </Text>
                <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                  {groomName}
                </Text>
              </Flex>
            </Flex>
          )}

          {hasGroomParents && hasBrideParents && <Divider color={theme.colors.text} opacity={0.1} />}

          {hasBrideParents && (
            <Flex justify="space-between" align="center" p="md" gap="md" wrap="nowrap">
              <Text size="md" fw={500} style={{ color: theme.colors.text, minWidth: 50, textAlign: 'left' }}>
                신부
              </Text>
              <Flex align="center" gap={8} style={{ flex: 1, justifyContent: 'center' }}>
                <Stack gap={4} style={{ alignItems: 'center' }}>
                  {brideFatherName && (
                    <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                      {brideFatherName}
                    </Text>
                  )}
                  {brideMotherName && (
                    <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                      {brideMotherName}
                    </Text>
                  )}
                </Stack>
                {brideFatherName && brideMotherName && (
                  <Text size="xs" fw={400} style={{ color: theme.colors.text, opacity: 0.6 }}>
                    의
                  </Text>
                )}
              </Flex>
              <Flex align="center" gap={4} style={{ minWidth: 80, justifyContent: 'flex-end' }}>
                <Text size="xs" fw={400} style={{ color: theme.colors.text, opacity: 0.6 }}>
                  딸
                </Text>
                <Text size="md" fw={600} style={{ color: theme.colors.text, whiteSpace: 'nowrap' }}>
                  {brideName}
                </Text>
              </Flex>
            </Flex>
          )}
        </Stack>
      </Container>
    </Box>
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
    <Paper
      py={48}
      radius={0}
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.15)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <Container size="sm">
        <Stack gap="lg">
          <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
            {title}
          </Title>
          <Paper
            p="md"
            shadow="sm"
            style={{ borderRadius: `calc(${theme.borderRadius} * 2)`, backgroundColor: 'white' }}
          >
            <Stack gap="sm">
              <Box
                p="xl"
                style={{
                  border: `2px dashed ${theme.colors.secondary}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Stack gap="xs" align="center">
                  <Text size="xl">📸</Text>
                  <Text size="xs" ta="center" style={{ color: theme.colors.text, opacity: 0.7 }}>
                    {description}
                  </Text>
                </Stack>
              </Box>
              <Paper
                py="xs"
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius,
                  cursor: 'not-allowed',
                }}
              >
                <Text size="sm" ta="center" style={{ color: 'white' }}>
                  사진 선택하기
                </Text>
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Paper>
  );
}
