import { Card, Text, SimpleGrid, Button, Box, Group, Stack } from '@mantine/core';
import { useInvitationStats } from '@/hooks/useInvitations';
import { StatsSkeleton } from '@/components/Skeleton';
import { AppDialog } from '@/components/ui/AppDialog';
import type { Invitation } from '@/types/invitation';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
}

export default function StatsModal({ isOpen, onClose, invitation }: StatsModalProps) {
  const { data: stats, isLoading } = useInvitationStats(invitation.id);

  const footer = (
    <Button onClick={onClose} variant="light" color="gray" fullWidth>
      닫기
    </Button>
  );

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${invitation.groomName} & ${invitation.brideName} 통계`}
      footer={footer}
    >
      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <Stack gap="lg">
          <SimpleGrid cols={2}>
            <StatCard icon="👁️" label="총 조회수" value={stats.viewCount} color="blue" />
            <StatCard icon="📤" label="공유 횟수" value={stats.shareCount} color="green" />
          </SimpleGrid>

          <Card padding="md" bg="violet.0">
            <Group gap="xs" mb="xs">
              <span aria-hidden="true">📝</span>
              <Text size="sm" c="violet.6" fw={500}>
                방명록
              </Text>
            </Group>
            <Text size="xl" fw={700} c="violet.7">
              <span className="sr-only">방명록 수: </span>
              {stats.guestbookCount}개
            </Text>
          </Card>

          <Card padding="md" bg="gray.0">
            <Group gap="xs" mb="md">
              <span aria-hidden="true">📋</span>
              <Text size="sm" c="gray.6" fw={500}>
                참석 여부 (RSVP)
              </Text>
            </Group>

            <SimpleGrid cols={3} mb="md">
              <Box ta="center">
                <Text size="xl" fw={700} c="teal.6">
                  <span className="sr-only">참석 예정: </span>
                  {stats.rsvpStats.attending}
                </Text>
                <Text size="xs" c="dimmed">
                  참석
                </Text>
              </Box>
              <Box ta="center">
                <Text size="xl" fw={700} c="red.5">
                  <span className="sr-only">불참 예정: </span>
                  {stats.rsvpStats.notAttending}
                </Text>
                <Text size="xs" c="dimmed">
                  불참
                </Text>
              </Box>
              <Box ta="center">
                <Text size="xl" fw={700} c="gray.4">
                  <span className="sr-only">미정: </span>
                  {stats.rsvpStats.undecided}
                </Text>
                <Text size="xs" c="dimmed">
                  미정
                </Text>
              </Box>
            </SimpleGrid>

            <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  총 응답 수
                </Text>
                <Text size="sm" fw={500}>
                  {stats.rsvpStats.total}명
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  예상 참석 인원
                </Text>
                <Text size="sm" fw={700} c="pink.6">
                  {stats.rsvpStats.totalGuests}명
                </Text>
              </Group>
            </Box>
          </Card>
        </Stack>
      ) : (
        <Box ta="center" py="xl">
          <Text c="dimmed">통계를 불러올 수 없습니다.</Text>
        </Box>
      )}
    </AppDialog>
  );
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: 'blue' | 'green';
}) => {
  return (
    <Card padding="md" bg={color === 'blue' ? 'blue.0' : 'green.0'}>
      <Group gap="xs" mb="xs">
        <span aria-hidden="true">{icon}</span>
        <Text size="sm" c={color === 'blue' ? 'blue.6' : 'green.6'} fw={500}>
          {label}
        </Text>
      </Group>
      <Text size="xl" fw={700} c={color === 'blue' ? 'blue.7' : 'green.7'}>
        <span className="sr-only">{label}: </span>
        {value.toLocaleString()}
      </Text>
    </Card>
  );
};
