import { useState } from 'react';
import { Card, Button, Badge, Text, Group, Stack, Box, Title, Loader, Center } from '@mantine/core';
import { useGuestbooks, useUpdateGuestbook, useDeleteGuestbook } from '@/hooks/useGuestbooks';
import { useToast } from '@/hooks/useNotifications';
import { AppAlertDialog } from '@/components/ui/AppAlertDialog';

interface GuestbookManagementProps {
  invitationId: string;
}

export const GuestbookManagement = ({ invitationId }: GuestbookManagementProps) => {
  const { data: guestbooks, isLoading, error } = useGuestbooks(invitationId);
  const { mutate: updateGuestbook } = useUpdateGuestbook();
  const { mutate: deleteGuestbook } = useDeleteGuestbook();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleToggleVisibility = (id: string, currentVisibility: boolean) => {
    updateGuestbook(
      { id, dto: { isVisible: !currentVisibility } },
      {
        onSuccess: () => {
          // 성공적으로 업데이트됨
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) {return;}

    setDeletingId(deleteTargetId);
    deleteGuestbook(deleteTargetId, {
      onSuccess: () => {
        addToast('success', '방명록이 삭제되었습니다');
        setDeletingId(null);
      },
      onError: () => {
        addToast('error', '방명록 삭제에 실패했습니다');
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" withBorder>
        <Title order={2} size="h4" mb="md">
          방명록 관리
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
          방명록 관리
        </Title>
        <Center py="xl">
          <Text c="red">방명록을 불러오는데 실패했습니다</Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={2} size="h4">
          방명록 관리
        </Title>
        <Text size="sm" c="dimmed">
          전체 {guestbooks?.length || 0}개
        </Text>
      </Group>

      {!guestbooks || guestbooks.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">아직 작성된 방명록이 없습니다</Text>
        </Center>
      ) : (
        <Stack gap="sm">
          {guestbooks.map((entry) => (
            <Card
              key={entry.id}
              padding="md"
              withBorder
              bg={entry.isVisible ? 'white' : 'gray.0'}
              style={{
                borderColor: entry.isVisible
                  ? 'var(--mantine-color-gray-2)'
                  : 'var(--mantine-color-gray-3)',
              }}
            >
              <Group justify="space-between" align="flex-start" mb="xs">
                <Box style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Text fw={500}>{entry.name}</Text>
                    {!entry.isVisible && (
                      <Badge size="sm" variant="filled" color="gray">
                        숨김
                      </Badge>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Box>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant={entry.isVisible ? 'light' : 'filled'}
                    color={entry.isVisible ? 'gray' : 'blue'}
                    onClick={() => handleToggleVisibility(entry.id, entry.isVisible)}
                  >
                    {entry.isVisible ? '숨김' : '공개'}
                  </Button>
                  <Button
                    size="xs"
                    variant="filled"
                    color="red"
                    onClick={() => handleDelete(entry.id)}
                    loading={deletingId === entry.id}
                  >
                    삭제
                  </Button>
                </Group>
              </Group>
              <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                {entry.message}
              </Text>
            </Card>
          ))}
        </Stack>
      )}

      <AppAlertDialog
        open={deleteTargetId !== null}
        onOpenChange={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="방명록 삭제"
        description="정말로 이 방명록을 삭제하시겠습니까?"
        confirmText="삭제"
        variant="danger"
      />
    </Card>
  );
}
