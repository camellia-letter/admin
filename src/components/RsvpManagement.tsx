import { useState } from 'react';
import {
  Card,
  Button,
  Badge,
  Text,
  Group,
  Stack,
  Box,
  Title,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core';
import { useRsvps, useRsvpStats, useDeleteRsvp } from '@/hooks/useRsvps';
import { AppAlertDialog } from '@/components/ui/AppAlertDialog';
import type { Rsvp } from '@/types/invitation';

interface RsvpManagementProps {
  invitationId: string;
}

const attendanceLabels: Record<string, { text: string; color: string }> = {
  attending: { text: '참석', color: 'green' },
  not_attending: { text: '불참', color: 'red' },
  undecided: { text: '미정', color: 'gray' },
};

const mealLabels: Record<string, string> = {
  standard: '일반식',
  vegetarian: '채식',
  none: '식사 안함',
};

export default function RsvpManagement({ invitationId }: RsvpManagementProps) {
  const { data: rsvps, isLoading, error } = useRsvps(invitationId);
  const { data: stats } = useRsvpStats(invitationId);
  const { mutate: deleteRsvp, isPending: isDeleting } = useDeleteRsvp();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteRsvp(deleteTarget.id);
  };

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" withBorder>
        <Title order={2} size="h4" mb="md">
          참석 여부 관리
        </Title>
        <Center py="xl">
          <Loader size="md" />
        </Center>
      </Card>
    );
  }

  if (error) {
    return (
      <Card shadow="sm" padding="lg" withBorder>
        <Title order={2} size="h4" mb="md">
          참석 여부 관리
        </Title>
        <Center py="xl">
          <Text c="red">데이터를 불러오는데 실패했습니다</Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={2} size="h4">
          참석 여부 관리
        </Title>
        <Text size="sm" c="dimmed">
          전체 {rsvps?.length || 0}명
        </Text>
      </Group>

      {stats && (
        <SimpleGrid cols={4} spacing="sm" mb="lg">
          <Card padding="sm" bg="green.0" ta="center">
            <Text size="xl" fw={700} c="green.6">
              {stats.attending}
            </Text>
            <Text size="xs" c="green.7">
              참석
            </Text>
          </Card>
          <Card padding="sm" bg="red.0" ta="center">
            <Text size="xl" fw={700} c="red.6">
              {stats.notAttending}
            </Text>
            <Text size="xs" c="red.7">
              불참
            </Text>
          </Card>
          <Card padding="sm" bg="gray.0" ta="center">
            <Text size="xl" fw={700} c="gray.6">
              {stats.undecided}
            </Text>
            <Text size="xs" c="gray.7">
              미정
            </Text>
          </Card>
          <Card padding="sm" bg="blue.0" ta="center">
            <Text size="xl" fw={700} c="blue.6">
              {stats.totalGuests}
            </Text>
            <Text size="xs" c="blue.7">
              예상 인원
            </Text>
          </Card>
        </SimpleGrid>
      )}

      {!rsvps || rsvps.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">아직 응답이 없습니다</Text>
        </Center>
      ) : (
        <Stack gap="sm">
          {rsvps.map((rsvp: Rsvp) => {
            const attendance = attendanceLabels[rsvp.attendance] || attendanceLabels.undecided;
            return (
              <Card key={rsvp.id} padding="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Text fw={500}>{rsvp.name}</Text>
                      <Badge size="sm" color={attendance.color}>
                        {attendance.text}
                      </Badge>
                      {rsvp.side && (
                        <Badge size="sm" color="violet">
                          {rsvp.side === 'groom' ? '신랑측' : '신부측'}
                        </Badge>
                      )}
                    </Group>
                    <Stack gap={4}>
                      {rsvp.phoneNumber && (
                        <Text size="sm" c="dimmed">
                          연락처: {rsvp.phoneNumber}
                        </Text>
                      )}
                      {rsvp.attendance === 'attending' && (
                        <Text size="sm" c="dimmed">
                          참석 인원: {rsvp.guestCount}명
                        </Text>
                      )}
                      {rsvp.mealType && (
                        <Text size="sm" c="dimmed">
                          식사: {mealLabels[rsvp.mealType] || rsvp.mealType}
                        </Text>
                      )}
                      {rsvp.message && (
                        <Text size="sm" c="dimmed" fs="italic">
                          "{rsvp.message}"
                        </Text>
                      )}
                    </Stack>
                    <Text size="xs" c="dimmed" mt="xs">
                      {new Date(rsvp.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Box>
                  <Button
                    size="xs"
                    variant="filled"
                    color="red"
                    onClick={() => handleDelete(rsvp.id, rsvp.name)}
                    loading={isDeleting}
                  >
                    삭제
                  </Button>
                </Group>
              </Card>
            );
          })}
        </Stack>
      )}

      <AppAlertDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="RSVP 삭제"
        description={deleteTarget ? `"${deleteTarget.name}"님의 응답을 삭제하시겠습니까?` : ''}
        confirmText="삭제"
        variant="danger"
      />
    </Card>
  );
}
