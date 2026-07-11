import type {
  AccountBlockData,
  TransportBlockData,
  RsvpBlockData,
  TransportType,
  ParentsBlockData,
  HeaderBlockData,
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

// Header Block
export function PreviewHeaderBlock({
  data,
  groomName,
  brideName,
  theme,
}: {
  data: HeaderBlockData;
  groomName: string;
  brideName: string;
  theme: ThemeStyles;
}) {
  const { showTitle = true } = data;

  return (
    <Container size="sm" py={64} style={{ fontFamily: theme.fontFamily }}>
      <Stack gap="md" align="center">
        {showTitle && (
          <Text size="sm" ta="center" style={{ color: theme.colors.primary, opacity: 0.8, letterSpacing: '0.35em' }}>
            WEDDING INVITATION
          </Text>
        )}
        <Title
          order={1}
          ta="center"
          style={{ color: theme.colors.text, fontFamily: 'var(--font-noto-serif), serif' }}
        >
          {groomName} & {brideName}
        </Title>
        <Divider w={64} color={theme.colors.secondary} />
      </Stack>
    </Container>
  );
}

// Message Block
export function PreviewMessageBlock({
  data,
  theme,
}: {
  data: { title?: string; content?: string };
  theme: ThemeStyles;
}) {
  if (!data.title && !data.content) return null;

  return (
    <Container size="sm" py={48}>
      <Stack gap="lg" align="center" style={{ fontFamily: theme.fontFamily }}>
        {data.title && (
          <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
            {data.title}
          </Title>
        )}
        {data.content && (
          <Text
            ta="center"
            style={{ color: theme.colors.text, opacity: 0.8, whiteSpace: 'pre-line', lineHeight: 1.8 }}
          >
            {data.content}
          </Text>
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
          <Stack gap="md">
            {hasGroomAccounts && (
              <Paper
                style={{
                  backgroundColor: withAlpha(theme.colors.primary, 0.05),
                  border: `1px solid ${withAlpha(theme.colors.primary, 0.2)}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Box p="md">
                  <Text fw={600} style={{ color: theme.colors.primary }}>
                    {groomTitle}
                  </Text>
                </Box>
                <Box p="md" pt={0}>
                  <Stack gap="sm">
                    {groomAccounts.map((account, index) => (
                      <Paper key={index} p="md" shadow="sm" style={{ borderRadius: theme.borderRadius }}>
                        <Flex justify="space-between" align="center" gap="md">
                          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              {account.bank}
                            </Text>
                            <Text fw={600} style={{ color: theme.colors.text }}>
                              {account.accountNumber}
                            </Text>
                            <Text size="sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                              {account.holder}
                            </Text>
                          </Stack>
                        </Flex>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )}
            {hasBrideAccounts && (
              <Paper
                style={{
                  backgroundColor: withAlpha(theme.colors.accent, 0.05),
                  border: `1px solid ${withAlpha(theme.colors.accent, 0.2)}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Box p="md">
                  <Text fw={600} style={{ color: theme.colors.accent }}>
                    {brideTitle}
                  </Text>
                </Box>
                <Box p="md" pt={0}>
                  <Stack gap="sm">
                    {brideAccounts.map((account, index) => (
                      <Paper key={index} p="md" shadow="sm" style={{ borderRadius: theme.borderRadius }}>
                        <Flex justify="space-between" align="center" gap="md">
                          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              {account.bank}
                            </Text>
                            <Text fw={600} style={{ color: theme.colors.text }}>
                              {account.accountNumber}
                            </Text>
                            <Text size="sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                              {account.holder}
                            </Text>
                          </Stack>
                        </Flex>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )}
          </Stack>
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

  if (!hasItems && !hasParkingInfo) {
    return null;
  }

  const getTransportColor = (type: TransportType) => {
    switch (type) {
      case 'subway':
        return { bg: withAlpha(theme.colors.primary, 0.08), border: withAlpha(theme.colors.primary, 0.2) };
      case 'bus':
        return { bg: withAlpha(theme.colors.accent, 0.08), border: withAlpha(theme.colors.accent, 0.2) };
      case 'car':
        return { bg: withAlpha(theme.colors.secondary, 0.15), border: withAlpha(theme.colors.secondary, 0.3) };
      case 'shuttle':
        return { bg: withAlpha(theme.colors.primary, 0.05), border: withAlpha(theme.colors.primary, 0.15) };
      default:
        return { bg: withAlpha(theme.colors.text, 0.05), border: withAlpha(theme.colors.text, 0.1) };
    }
  };

  return (
    <Container size="sm" py={48} style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}>
      <Stack gap="xl">
        <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
          {title}
        </Title>

        {hasItems && (
          <Stack gap="md">
            {items.map((item, index) => {
              const icon = transportIcons[item.type] || transportIcons.other;
              const itemColors = getTransportColor(item.type);

              return (
                <Paper
                  key={index}
                  p="md"
                  style={{
                    backgroundColor: itemColors.bg,
                    border: `1px solid ${itemColors.border}`,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  <Flex gap="md" align="flex-start">
                    <Text size="xl">{icon}</Text>
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={600} style={{ color: theme.colors.text }}>
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text size="sm" style={{ color: theme.colors.text, opacity: 0.75, whiteSpace: 'pre-line' }}>
                          {item.description}
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                </Paper>
              );
            })}
          </Stack>
        )}

        {hasParkingInfo && (
          <Paper
            p="md"
            style={{
              backgroundColor: withAlpha(theme.colors.secondary, 0.15),
              border: `1px solid ${withAlpha(theme.colors.secondary, 0.3)}`,
              borderRadius: theme.borderRadius,
            }}
          >
            <Flex gap="md" align="flex-start">
              <Text size="xl">🅿️</Text>
              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={600} style={{ color: theme.colors.text }}>
                  주차 안내
                </Text>
                <Text size="sm" style={{ color: theme.colors.text, opacity: 0.75, whiteSpace: 'pre-line' }}>
                  {parkingInfo}
                </Text>
              </Stack>
            </Flex>
          </Paper>
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
  const { title = '참석 여부', description = '참석 여부를 알려주세요.' } = data;

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
        <Paper p="xl" shadow="sm" style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}>
          <Stack gap="lg">
            <Stack gap={6} align="center">
              <Title order={2} size="h3" ta="center" style={{ color: theme.colors.text }}>
                {title}
              </Title>
              {description && (
                <Text size="sm" ta="center" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  {description}
                </Text>
              )}
            </Stack>

            <Stack gap="md">
              <Box>
                <Text size="sm" fw={500} mb="xs" style={{ color: theme.colors.text }}>
                  이름 *
                </Text>
                <input
                  placeholder="홍길동"
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${theme.colors.secondary}`,
                    borderRadius: theme.borderRadius,
                    fontSize: '14px',
                  }}
                />
              </Box>

              <Box>
                <Text size="sm" fw={500} mb="xs" style={{ color: theme.colors.text }}>
                  연락처
                </Text>
                <input
                  placeholder="010-1234-5678"
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${theme.colors.secondary}`,
                    borderRadius: theme.borderRadius,
                    fontSize: '14px',
                  }}
                />
              </Box>

              <Stack gap="xs">
                <Text size="sm" fw={500} style={{ color: theme.colors.text }}>
                  참석 여부 *
                </Text>
                <SimpleGrid cols={3} spacing="sm">
                  {[
                    { label: '참석', emoji: '😊', selected: true },
                    { label: '불참', emoji: '😢', selected: false },
                    { label: '미정', emoji: '🤔', selected: false },
                  ].map((option, index) => (
                    <Paper
                      key={index}
                      p="md"
                      style={{
                        cursor: 'pointer',
                        border: `1px solid ${option.selected ? theme.colors.primary : theme.colors.secondary}`,
                        backgroundColor: option.selected ? withAlpha(theme.colors.primary, 0.1) : 'transparent',
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      <Stack gap={4} align="center">
                        <Text fz={24}>{option.emoji}</Text>
                        <Text size="sm" style={{ color: theme.colors.text }}>
                          {option.label}
                        </Text>
                      </Stack>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Stack>

              <Box>
                <Text size="sm" fw={500} mb="xs" style={{ color: theme.colors.text }}>
                  축하 메시지 (선택)
                </Text>
                <textarea
                  placeholder="축하 메시지를 남겨주세요"
                  rows={3}
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${theme.colors.secondary}`,
                    borderRadius: theme.borderRadius,
                    fontSize: '14px',
                    resize: 'none',
                  }}
                />
              </Box>

              <Paper
                py="sm"
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius,
                  cursor: 'not-allowed',
                }}
              >
                <Text fw={500} ta="center" style={{ color: 'white' }}>
                  참석 여부 제출
                </Text>
              </Paper>
            </Stack>
          </Stack>
        </Paper>
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
