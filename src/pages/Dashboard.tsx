import { useState, lazy, Suspense, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Text,
  Group,
  SimpleGrid,
  Alert,
  Flex,
  Stack,
  Title,
  Badge,
  ActionIcon,
  Center,
} from '@mantine/core';
import {
  IconTrash,
  IconEdit,
  IconChartBar,
  IconEye,
  IconShare,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';
import { useInvitations, useDeleteInvitation, useCreateInvitation } from '@/hooks/useInvitations';
import { InvitationCardSkeleton, StatsSkeleton } from '@/components/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useNotifications';
import { AppAlertDialog } from '@/components/ui/AppAlertDialog';
import type { Invitation } from '@camellia-letter/shared-types';

const StatsModal = lazy(() => import('@/components/StatsModal'));

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: invitations, isLoading, error } = useInvitations();
  const { mutate: createInvitation, isPending: isCreating } = useCreateInvitation();
  const { addToast } = useToast();

  const handleCreateInvitation = () => {
    createInvitation(
      {
        groomName: '신랑',
        brideName: '신부',
        weddingDate: new Date().toISOString(),
        venue: '예식장',
        venueAddress: '예식장 주소',
      },
      {
        onSuccess: (invitation) => {
          navigate(`/editor/${invitation.id}`);
        },
        onError: () => {
          addToast('error', '청첩장 생성에 실패했습니다.');
        },
      },
    );
  };

  return (
    <Stack gap={0} mih="100vh" bg="gray.0">
      <Flex
        component="header"
        role="banner"
        bg="white"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
      >
        <Flex w="100%" justify="space-between" align="center" py="xl" px="md">
          <Title order={1} size="h2">
            청첩장 목록
          </Title>
          {user && (
            <Text size="sm" c="dimmed">
              {user.name || user.email}님의 청첩장
            </Text>
          )}
        </Flex>
      </Flex>

      <Flex
        component="main"
        id="main-content"
        role="main"
        w="100%"
        maw="1280px"
        mx="auto"
        direction="column"
        py="xl"
        px="md"
      >
        <Stack gap="lg">
          {!user && (
            <Alert color="yellow" title="⚠️ 로그인 정보가 없습니다">
              Web 앱에서 로그인 후 다시 시도해주세요. (토큰이 URL에 포함되어야 합니다)
            </Alert>
          )}

          <Flex w="100%" justify="flex-end" align="center">
            <Button
              onClick={handleCreateInvitation}
              color="pink"
              aria-label="새 청첩장 만들기"
              loading={isCreating}
            >
              + 새 청첩장
            </Button>
          </Flex>

          {isLoading && (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
            </SimpleGrid>
          )}

          {error && (
            <Card shadow="sm" padding="lg">
              <Stack gap="xs" align="center">
                <Text c="red" ta="center">
                  데이터를 불러오는데 실패했습니다.
                </Text>
                <Text c="dimmed" size="sm" ta="center">
                  API 서버가 실행 중인지 확인해주세요.
                </Text>
              </Stack>
            </Card>
          )}

          {!isLoading && !error && invitations?.length === 0 && (
            <Card shadow="sm" padding="lg">
              <Stack gap="xs" align="center">
                <Text c="dimmed" ta="center">
                  아직 생성된 청첩장이 없습니다.
                </Text>
                <Text c="dimmed" size="sm" ta="center">
                  새 청첩장을 만들어보세요!
                </Text>
              </Stack>
            </Card>
          )}

          {!isLoading && !error && invitations && invitations.length > 0 && (
            <SimpleGrid
              cols={{ base: 1, md: 2, lg: 3 }}
              spacing="md"
              role="list"
              aria-label={`청첩장 목록 (${invitations.length}개)`}
            >
              {invitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Flex>
    </Stack>
  );
}

const InvitationCard = memo(function InvitationCard({ invitation }: { invitation: Invitation }) {
  const [showStats, setShowStats] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation();
  const { addToast } = useToast();
  const weddingDate = new Date(invitation.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cardTitle = `${invitation.groomName} & ${invitation.brideName}`;

  const invitationUrl = invitation.slug
    ? `${import.meta.env.VITE_WEB_URL || 'http://localhost:4000'}/invitation/${invitation.slug}`
    : `${import.meta.env.VITE_WEB_URL || 'http://localhost:4000'}/invitation/${invitation.id}`;

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteInvitation(invitation.id);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('error', 'URL 복사에 실패했습니다.');
    }
  };

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ position: 'relative' }}
        aria-label={`${cardTitle} 청첩장`}
      >
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ position: 'absolute', top: 12, right: 12 }}
          aria-label={`${cardTitle} 청첩장 삭제`}
          loading={isDeleting}
        >
          <IconTrash size={16} />
        </ActionIcon>

        <Group gap="xs" mb="md" pr={32}>
          <Text size="lg">💒</Text>
          <Title order={3} size="h4">
            {cardTitle}
          </Title>
        </Group>

        <Stack component="dl" gap="xs">
          <Group gap="xs">
            <Text size="sm" component="dt" visually-hidden="true">
              예식 일자
            </Text>
            <span aria-hidden="true">📅</span>
            <Text size="sm" c="dimmed" component="dd">
              {formattedDate}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" component="dt" visually-hidden="true">
              예식장
            </Text>
            <span aria-hidden="true">📍</span>
            <Text size="sm" c="dimmed" component="dd">
              {invitation.venue}
            </Text>
          </Group>
        </Stack>

        <Card mt="md" p="xs" bg="gray.0" radius="sm">
          <Flex justify="space-between" align="center" gap="xs">
            <Flex style={{ flex: 1, minWidth: 0 }}>
              <Text size="xs" c="dimmed" span>
                URL:{' '}
              </Text>
              <Text size="xs" ff="monospace" truncate="end" span>
                {invitation.slug
                  ? `/invitation/${invitation.slug}`
                  : `/invitation/${invitation.id.slice(0, 8)}...`}
              </Text>
            </Flex>
            <Button
              size="xs"
              variant={copied ? 'light' : 'subtle'}
              color={copied ? 'green' : 'gray'}
              onClick={handleCopyUrl}
              leftSection={copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
              aria-label={copied ? 'URL이 복사됨' : 'URL 복사하기'}
            >
              {copied ? '복사됨' : '복사'}
            </Button>
          </Flex>
          {!invitation.slug && (
            <Text size="xs" c="dimmed" mt={4}>
              커스텀 URL 미설정 (편집에서 설정 가능)
            </Text>
          )}
        </Card>

        <Group mt="md" gap="md">
          <Badge variant="light" leftSection={<IconEye size={12} />}>
            {invitation.viewCount || 0}
          </Badge>
          <Badge variant="light" leftSection={<IconShare size={12} />}>
            {invitation.shareCount || 0}
          </Badge>
        </Group>

        <Flex
          mt="lg"
          pt="md"
          gap="xs"
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Button
            component={Link}
            to={`/editor/${invitation.id}`}
            variant="light"
            color="gray"
            style={{ flex: 1 }}
            leftSection={<IconEdit size={16} />}
            aria-label={`${cardTitle} 청첩장 편집`}
          >
            편집
          </Button>
          <Button
            variant="light"
            color="blue"
            style={{ flex: 1 }}
            leftSection={<IconChartBar size={16} />}
            onClick={() => setShowStats(true)}
            aria-label={`${cardTitle} 청첩장 통계 보기`}
          >
            통계
          </Button>
          <Button
            component="a"
            href={invitationUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            color="pink"
            style={{ flex: 1 }}
            leftSection={<IconEye size={16} />}
            aria-label={`${cardTitle} 청첩장 미리보기 (새 창에서 열림)`}
          >
            미리보기
          </Button>
        </Flex>
      </Card>

      {showStats && (
        <Suspense
          fallback={
            <Center
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <StatsSkeleton />
            </Center>
          }
        >
          <StatsModal
            isOpen={showStats}
            onClose={() => setShowStats(false)}
            invitation={invitation}
          />
        </Suspense>
      )}

      <AppAlertDialog
        open={showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="청첩장 삭제"
        description={`"${cardTitle}" 청첩장을 삭제하시겠습니까?`}
        confirmText="삭제"
        variant="danger"
      />
    </>
  );
});
