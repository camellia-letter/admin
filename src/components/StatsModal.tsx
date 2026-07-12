import { Card, Text, SimpleGrid, Button, Box, Group, Stack, Tabs, Table, Pagination } from '@mantine/core';
import { useState } from 'react';
import { useInvitationStats } from '@/hooks/useInvitations';
import { StatsSkeleton } from '@/components/Skeleton';
import { AppDialog } from '@/components/ui/AppDialog';
import type { Invitation } from '@camellia-letter/shared-types';
import { useQuery } from '@tanstack/react-query';
import { getShareLogs } from '@/api/invitations';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
}

export const StatsModal = ({ isOpen, onClose, invitation }: StatsModalProps) => {
  const { data: stats, isLoading } = useInvitationStats(invitation.id);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: shareLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['shareLogs', invitation.id, currentPage],
    queryFn: () => getShareLogs(invitation.id, currentPage, 20),
    enabled: activeTab === 'shareLogs',
  });

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
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview">개요</Tabs.Tab>
          <Tabs.Tab value="shareLogs">공유 로그</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
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
        </Tabs.Panel>

        <Tabs.Panel value="shareLogs" pt="md">
          {isLoadingLogs ? (
            <Box ta="center" py="xl">
              <Text c="dimmed">로딩 중...</Text>
            </Box>
          ) : shareLogs && shareLogs.items.length > 0 ? (
            <Stack gap="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>번호</Table.Th>
                    <Table.Th>공유 시간</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {shareLogs.items.map((log, index) => (
                    <Table.Tr key={log.id}>
                      <Table.Td>{(currentPage - 1) * 20 + index + 1}</Table.Td>
                      <Table.Td>{new Date(log.sharedAt).toLocaleString('ko-KR')}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {shareLogs.totalPages > 1 && (
                <Group justify="center">
                  <Pagination
                    total={shareLogs.totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                  />
                </Group>
              )}
            </Stack>
          ) : (
            <Box ta="center" py="xl">
              <Text c="dimmed">공유 로그가 없습니다.</Text>
            </Box>
          )}
        </Tabs.Panel>
      </Tabs>
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
