import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Stack,
  Flex,
  Title,
  Text,
  Button,
  Group,
  TextInput,
  Textarea,
  Card,
  Paper,
  Anchor,
  Loader,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconArrowLeft, IconEye } from '@tabler/icons-react';
import { useInvitation, useUpdateInvitation } from '@/hooks/useInvitations';
import { checkSlugAvailability, suggestSlug } from '@/api/invitations';
import type {
  UpdateInvitationDto,
  InvitationBlock,
  InvitationTheme,
} from '@camellia-letter/shared-types';
import { BlockEditor } from '@/components/BlockEditor';
import { ThemeEditor } from '@/components/ThemeEditor';
import { InvitationPreview } from '@/components/Preview';
import GuestbookManagement from '@/components/GuestbookManagement';
import RsvpManagement from '@/components/RsvpManagement';
import { useToast } from '@/hooks/useNotifications';

// 디바이스 프리셋
type DevicePreset = 'iphone-se' | 'iphone-14' | 'galaxy-s21' | 'ipad-mini';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  borderRadius: string;
}

const DEVICE_PRESETS: Record<DevicePreset, DeviceConfig> = {
  'iphone-se': { name: 'iPhone SE', width: 320, height: 568, borderRadius: '2rem' },
  'iphone-14': { name: 'iPhone 14', width: 390, height: 844, borderRadius: '2.5rem' },
  'galaxy-s21': { name: 'Galaxy S21', width: 360, height: 800, borderRadius: '2rem' },
  'ipad-mini': { name: 'iPad mini', width: 768, height: 1024, borderRadius: '1.5rem' },
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invitation, isLoading, error } = useInvitation(id || '');
  const { mutate: updateInvitation, isPending: isUpdating } = useUpdateInvitation();
  const { addToast } = useToast();

  const [showPreview, setShowPreview] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>('iphone-14');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<UpdateInvitationDto>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    venue: '',
    venueAddress: '',
    message: '',
    blocks: [],
    theme: undefined,
    slug: undefined,
    rsvpViewPassword: undefined,
  });

  const [weddingDateValue, setWeddingDateValue] = useState<Date | null>(null);

  const [slugStatus, setSlugStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
    normalized?: string;
  }>({
    checking: false,
    available: null,
    message: '',
  });

  useEffect(() => {
    if (invitation) {
      const weddingDate = new Date(invitation.weddingDate);
      setWeddingDateValue(weddingDate);

      setFormData({
        groomName: invitation.groomName,
        brideName: invitation.brideName,
        weddingDate: invitation.weddingDate,
        venue: invitation.venue,
        venueAddress: invitation.venueAddress,
        message: invitation.message || '',
        blocks: invitation.blocks || [],
        theme: invitation.theme,
        slug: invitation.slug || undefined,
        rsvpViewPassword: undefined, // 보안상 해시된 비밀번호는 표시하지 않음
      });
    }
  }, [invitation]);

  // Debounce effect for slug validation with AbortController
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (formData.slug && formData.slug !== invitation?.slug) {
        setSlugStatus({ checking: true, available: null, message: '' });
        checkSlugAvailability(formData.slug, id)
          .then((result) => {
            if (!controller.signal.aborted) {
              setSlugStatus({
                checking: false,
                available: result.available,
                message: result.message,
                normalized: result.normalized,
              });
            }
          })
          .catch(() => {
            if (!controller.signal.aborted) {
              setSlugStatus({
                checking: false,
                available: false,
                message: '슬러그 확인 중 오류가 발생했습니다.',
              });
            }
          });
      } else if (!formData.slug) {
        setSlugStatus({ checking: false, available: null, message: '' });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.slug, id, invitation?.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UpdateInvitationDto) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value: Date | string | null) => {
    const dateValue = typeof value === 'string' ? new Date(value) : value;
    setWeddingDateValue(dateValue);
    if (dateValue) {
      setFormData((prev) => ({ ...prev, weddingDate: dateValue.toISOString() }));
    }
  };

  const handleBlocksChange = useCallback((blocks: InvitationBlock[]) => {
    setFormData((prev: UpdateInvitationDto) => ({ ...prev, blocks }));
  }, []);

  const handleThemeChange = useCallback((theme: InvitationTheme) => {
    setFormData((prev: UpdateInvitationDto) => ({ ...prev, theme }));
  }, []);

  const handleSuggestSlug = async () => {
    if (!formData.groomName || !formData.brideName) {
      addToast('warning', '신랑과 신부 이름을 먼저 입력해주세요.');
      return;
    }

    try {
      const result = await suggestSlug(formData.groomName, formData.brideName);
      setFormData((prev) => ({ ...prev, slug: result.slug }));
    } catch {
      addToast('error', '슬러그 생성 중 오류가 발생했습니다.');
    }
  };

  const handleClearSlug = () => {
    setFormData((prev) => ({ ...prev, slug: '' }));
    setSlugStatus({ checking: false, available: null, message: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // slug가 변경되었고 사용 불가능한 경우 제출 방지
    if (formData.slug && formData.slug !== invitation?.slug && slugStatus.available === false) {
      addToast('warning', '사용할 수 없는 URL입니다. 다른 URL을 입력해주세요.');
      return;
    }

    // 빈 문자열인 경우 null로 처리
    const submitData = {
      ...formData,
      slug: formData.slug?.trim() || null,
      rsvpViewPassword: formData.rsvpViewPassword?.trim() || null,
    };

    updateInvitation(
      { id, dto: submitData },
      {
        onSuccess: () => {
          addToast('success', '청첩장이 수정되었습니다.');
        },
      },
    );
  };

  // 현재 사용할 URL (slug 또는 id)
  const invitationUrl = invitation?.slug
    ? `${import.meta.env.VITE_WEB_URL || 'http://localhost:4000'}/invitation/${invitation.slug}`
    : `${import.meta.env.VITE_WEB_URL || 'http://localhost:4000'}/invitation/${id}`;

  if (isLoading) {
    return (
      <Flex mih="100vh" bg="gray.0" align="center" justify="center">
        <Stack align="center" gap="md">
          <Loader size="lg" color="pink" />
          <Text c="dimmed">로딩 중...</Text>
        </Stack>
      </Flex>
    );
  }

  if (error || !invitation) {
    return (
      <Flex mih="100vh" bg="gray.0" align="center" justify="center">
        <Stack align="center" gap="md">
          <Text c="red">청첩장을 불러오는데 실패했습니다.</Text>
          <Anchor component={Link} to="/" c="blue">
            대시보드로 돌아가기
          </Anchor>
        </Stack>
      </Flex>
    );
  }

  return (
    <Stack gap={0} mih="100vh" bg="gray.0">
      {/* Header */}
      <Paper
        component="header"
        shadow="sm"
        pos="sticky"
        top={0}
        style={{ zIndex: 10 }}
        bg="white"
        py="md"
      >
        <Flex w="100%" px="md" justify="space-between" align="center">
          <Group gap="md">
            <Anchor component={Link} to="/" c="blue">
              <Flex align="center" gap="xs">
                <IconArrowLeft size={16} />
                돌아가기
              </Flex>
            </Anchor>
            <Title order={1} size="h3">
              청첩장 편집
            </Title>
          </Group>
          <Group gap="md">
            <Button
              variant={showPreview ? 'filled' : 'light'}
              color={showPreview ? 'pink' : 'gray'}
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
            >
              {showPreview ? '미리보기 숨기기' : '미리보기 보기'}
            </Button>
            <Anchor href={invitationUrl} target="_blank" rel="noopener noreferrer" c="pink">
              <Flex align="center" gap="xs">
                새 탭에서 보기
                <IconEye size={16} />
              </Flex>
            </Anchor>
          </Group>
        </Flex>
      </Paper>

      {/* Main Content */}
      <Flex direction={showPreview ? 'row' : 'column'}>
        {/* Editor Panel */}
        <Stack
          component="main"
          style={{ flex: showPreview ? '1 1 0%' : undefined }}
          maw={showPreview ? undefined : 768}
          mx={showPreview ? 0 : 'auto'}
          w={showPreview ? undefined : '100%'}
          py="xl"
          px="md"
          gap="lg"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {/* 기본 정보 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={2} size="h4">
                    기본 정보
                  </Title>

                  <Flex gap="md">
                    <TextInput
                      label="신랑 이름"
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleChange}
                      required
                      withAsterisk
                      style={{ flex: 1 }}
                    />
                    <TextInput
                      label="신부 이름"
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleChange}
                      required
                      withAsterisk
                      style={{ flex: 1 }}
                    />
                  </Flex>

                  <DateTimePicker
                    label="예식 일시"
                    placeholder="날짜와 시간을 선택하세요"
                    value={weddingDateValue}
                    onChange={handleDateChange}
                    required
                    withAsterisk
                    valueFormat="YYYY-MM-DD HH:mm"
                  />

                  <TextInput
                    label="예식장 이름"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    withAsterisk
                  />

                  <TextInput
                    label="예식장 주소"
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleChange}
                    required
                    withAsterisk
                  />

                  {/* 커스텀 URL (슬러그) */}
                  <Stack gap="xs">
                    <Flex justify="space-between" align="center">
                      <Text size="sm" fw={500}>
                        커스텀 URL (선택)
                      </Text>
                      <Group gap="xs">
                        {formData.slug && (
                          <Button variant="subtle" size="xs" color="gray" onClick={handleClearSlug}>
                            URL 제거
                          </Button>
                        )}
                        <Button variant="subtle" size="xs" color="pink" onClick={handleSuggestSlug}>
                          자동 생성
                        </Button>
                      </Group>
                    </Flex>
                    <TextInput
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleChange}
                      placeholder="예: kim-chulsoo-lee-younghee"
                      error={slugStatus.available === false ? slugStatus.message : undefined}
                      rightSection={slugStatus.checking ? <Loader size="xs" /> : null}
                    />
                    {!slugStatus.checking &&
                      slugStatus.available === true &&
                      formData.slug !== invitation?.slug && (
                        <Text size="xs" c="green">
                          ✓ {slugStatus.message}
                        </Text>
                      )}
                    {formData.slug &&
                      !slugStatus.checking &&
                      slugStatus.normalized &&
                      formData.slug !== invitation?.slug && (
                        <Text size="xs" c="dimmed">
                          정규화된 URL: {slugStatus.normalized}
                        </Text>
                      )}
                    {formData.slug && formData.slug === invitation?.slug && (
                      <Text size="xs" c="blue">
                        현재 사용 중인 URL입니다.
                      </Text>
                    )}
                    {!formData.slug && (
                      <Text size="xs" c="dimmed">
                        커스텀 URL이 없으면 ID 기반 URL이 사용됩니다.
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Card>

              {/* RSVP 조회 비밀번호 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Title order={2} size="h4">
                      RSVP 조회 비밀번호
                    </Title>
                    <Text size="sm" c="dimmed">
                      비밀번호를 설정하면 RSVP 목록 조회 시 비밀번호를 입력해야 합니다.
                    </Text>
                  </Stack>
                  <TextInput
                    type="password"
                    name="rsvpViewPassword"
                    value={formData.rsvpViewPassword || ''}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요 (선택사항)"
                    description="비어있으면 누구나 RSVP 목록을 조회할 수 있습니다."
                  />
                  {invitation && (
                    <Text size="sm" c="dimmed">
                      RSVP 조회 페이지: {window.location.origin}/rsvp-list/
                      {invitation.slug || invitation.id}
                    </Text>
                  )}
                </Stack>
              </Card>

              {/* 인사말 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={2} size="h4">
                    인사말
                  </Title>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="소중한 분들을 초대합니다..."
                  />
                </Stack>
              </Card>

              {/* 테마 설정 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={2} size="h4">
                    테마 설정
                  </Title>
                  <ThemeEditor theme={formData.theme} onChange={handleThemeChange} />
                </Stack>
              </Card>

              {/* 블록 에디터 */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <BlockEditor blocks={formData.blocks || []} onChange={handleBlocksChange} />
              </Card>

              {/* 저장 버튼 */}
              <Flex gap="md">
                <Button variant="default" onClick={() => navigate('/')} style={{ flex: 1 }}>
                  취소
                </Button>
                <Button type="submit" color="pink" loading={isUpdating} style={{ flex: 1 }}>
                  저장하기
                </Button>
              </Flex>
            </Stack>
          </form>

          {/* 관리 섹션 */}
          <Stack gap="lg">
            <GuestbookManagement invitationId={id || ''} />
            <RsvpManagement invitationId={id || ''} />
          </Stack>
        </Stack>

        {/* Preview Panel */}
        {showPreview && (
          <Stack
            component="aside"
            gap={0}
            style={{
              flex: '0 0 40%',
              borderLeft: '1px solid var(--mantine-color-gray-3)',
              position: 'sticky',
              top: 65,
              height: 'calc(100vh - 65px)',
              overflow: 'hidden',
            }}
            bg="gray.1"
          >
            {/* Preview Header */}
            <Paper p="md" withBorder>
              <Stack gap="sm">
                <Flex justify="space-between" align="center">
                  <Text size="sm" fw={500} c="dimmed">
                    실시간 미리보기
                  </Text>
                  <Flex align="center" gap="xs">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-color-green-4)',
                      }}
                    ></span>
                    <Text size="xs" c="dimmed">
                      실시간 반영
                    </Text>
                  </Flex>
                </Flex>

                {/* Device & Dark Mode Controls */}
                <Flex justify="space-between" align="center" gap="md">
                  {/* Device Selector */}
                  <Group gap="xs">
                    {(Object.keys(DEVICE_PRESETS) as DevicePreset[]).map((device) => (
                      <Button
                        key={device}
                        size="xs"
                        variant={selectedDevice === device ? 'filled' : 'light'}
                        color={selectedDevice === device ? 'pink' : 'gray'}
                        onClick={() => setSelectedDevice(device)}
                        title={DEVICE_PRESETS[device].name}
                      >
                        {DEVICE_PRESETS[device].name}
                      </Button>
                    ))}
                  </Group>

                  {/* Dark Mode Toggle */}
                  <Button
                    size="xs"
                    variant={isDarkMode ? 'filled' : 'light'}
                    color={isDarkMode ? 'dark' : 'gray'}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                  >
                    {isDarkMode ? '다크' : '라이트'}
                  </Button>
                </Flex>
              </Stack>
            </Paper>

            {/* Phone Frame */}
            <Flex style={{ flex: 1, overflow: 'auto' }} p="md" align="flex-start" justify="center">
              <Paper
                shadow="xl"
                style={{
                  width: DEVICE_PRESETS[selectedDevice].width,
                  height: DEVICE_PRESETS[selectedDevice].height,
                  borderRadius: DEVICE_PRESETS[selectedDevice].borderRadius,
                  maxHeight: 'calc(100% - 2rem)',
                  border: '4px solid var(--mantine-color-gray-8)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Phone Notch */}
                <Flex h={24} bg="gray.8" align="center" justify="center" style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: 80,
                      height: 16,
                      backgroundColor: 'black',
                      borderRadius: '0 0 12px 12px',
                    }}
                  ></div>
                </Flex>

                {/* Preview Content */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    filter: isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none',
                    minHeight: 0,
                  }}
                >
                  <InvitationPreview formData={formData} />
                </div>

                {/* Phone Bottom Bar */}
                <Flex h={20} bg="gray.8" align="center" justify="center" style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: 96,
                      height: 4,
                      backgroundColor: 'var(--mantine-color-gray-6)',
                      borderRadius: 9999,
                    }}
                  ></div>
                </Flex>
              </Paper>
            </Flex>

            {/* Device Info */}
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" ta="center">
                {DEVICE_PRESETS[selectedDevice].name} ({DEVICE_PRESETS[selectedDevice].width} x{' '}
                {DEVICE_PRESETS[selectedDevice].height})
              </Text>
            </Paper>
          </Stack>
        )}
      </Flex>
    </Stack>
  );
}
