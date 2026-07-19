import { useState } from 'react';
import {
  Container,
  Title,
  Tabs,
  Table,
  Avatar,
  Badge,
  Button,
  Group,
  Text,
  Paper,
  Stack,
  Modal,
  Textarea,
  Pagination,
  Center,
  Loader,
  Alert,
} from '@mantine/core';
import { IconCheck, IconX, IconClock, IconAlertCircle } from '@tabler/icons-react';
import { useUsers, useApproveUser, useRejectUser } from '@/hooks/useUsers';
import { useToast } from '@/hooks/useNotifications';
import type { UserStatus } from '@/api/admin';

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const config = {
    PENDING: { color: 'orange', label: '대기 중', icon: IconClock },
    ACTIVE: { color: 'green', label: '활성', icon: IconCheck },
    REJECTED: { color: 'red', label: '거부됨', icon: IconX },
  };

  const { color, label, icon: Icon } = config[status];

  return (
    <Badge color={color} variant="light" leftSection={<Icon size={14} />}>
      {label}
    </Badge>
  );
};

export default function Users() {
  const [activeTab, setActiveTab] = useState<UserStatus | 'all'>('PENDING');
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const { addToast } = useToast();

  const status = activeTab === 'all' ? undefined : activeTab;
  const { data, isLoading, error } = useUsers({ status, page, limit: 20 });
  const { mutate: approve, isPending: isApproving } = useApproveUser();
  const { mutate: reject, isPending: isRejecting } = useRejectUser();

  const handleApprove = (userId: string) => {
    approve(userId, {
      onSuccess: () => {
        addToast('success', '사용자가 승인되었습니다.');
      },
      onError: () => {
        addToast('error', '승인에 실패했습니다.');
      },
    });
  };

  const handleRejectClick = (userId: string) => {
    setRejectModal({ isOpen: true, userId });
    setRejectionReason('');
  };

  const handleRejectConfirm = () => {
    if (!rejectModal.userId) return;

    if (!rejectionReason.trim()) {
      addToast('error', '거부 사유를 입력해주세요.');
      return;
    }

    reject(
      { userId: rejectModal.userId, reason: rejectionReason },
      {
        onSuccess: () => {
          addToast('success', '사용자가 거부되었습니다.');
          setRejectModal({ isOpen: false, userId: null });
          setRejectionReason('');
        },
        onError: () => {
          addToast('error', '거부에 실패했습니다.');
        },
      },
    );
  };

  const handleRejectCancel = () => {
    setRejectModal({ isOpen: false, userId: null });
    setRejectionReason('');
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1}>사용자 관리</Title>

        <Tabs value={activeTab} onChange={(value) => {
          setActiveTab(value as UserStatus | 'all');
          setPage(1);
        }}>
          <Tabs.List>
            <Tabs.Tab value="PENDING" leftSection={<IconClock size={16} />}>
              대기 중
            </Tabs.Tab>
            <Tabs.Tab value="ACTIVE" leftSection={<IconCheck size={16} />}>
              승인됨
            </Tabs.Tab>
            <Tabs.Tab value="REJECTED" leftSection={<IconX size={16} />}>
              거부됨
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="오류">
            사용자 목록을 불러오는데 실패했습니다.
          </Alert>
        )}

        {isLoading && (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        )}

        {!isLoading && data && (
          <>
            <Paper withBorder radius="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>사용자</Table.Th>
                    <Table.Th>이메일</Table.Th>
                    <Table.Th>가입일</Table.Th>
                    <Table.Th>상태</Table.Th>
                    <Table.Th>작업</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.data.users.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" c="dimmed" py="xl">
                          사용자가 없습니다.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    data.data.users.map((user) => (
                      <Table.Tr key={user.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar src={user.image} radius="xl" />
                            <Text size="sm" fw={500}>
                              {user.name || '이름 없음'}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{user.email}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{formatDate(user.createdAt)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <StatusBadge status={user.status} />
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {user.status === 'PENDING' && (
                              <>
                                <Button
                                  size="xs"
                                  color="green"
                                  variant="light"
                                  leftSection={<IconCheck size={14} />}
                                  onClick={() => handleApprove(user.id)}
                                  loading={isApproving}
                                >
                                  승인
                                </Button>
                                <Button
                                  size="xs"
                                  color="red"
                                  variant="light"
                                  leftSection={<IconX size={14} />}
                                  onClick={() => handleRejectClick(user.id)}
                                  loading={isRejecting}
                                >
                                  거부
                                </Button>
                              </>
                            )}
                            {user.status === 'REJECTED' && user.rejectionReason && (
                              <Text size="xs" c="dimmed">
                                사유: {user.rejectionReason}
                              </Text>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>

            {data.data.totalPages > 1 && (
              <Center>
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={data.data.totalPages}
                />
              </Center>
            )}
          </>
        )}
      </Stack>

      <Modal
        opened={rejectModal.isOpen}
        onClose={handleRejectCancel}
        title="사용자 거부"
        centered
      >
        <Stack gap="md">
          <Textarea
            label="거부 사유"
            placeholder="사용자에게 표시될 거부 사유를 입력하세요"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.currentTarget.value)}
            minRows={3}
            required
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={handleRejectCancel}>
              취소
            </Button>
            <Button
              color="red"
              onClick={handleRejectConfirm}
              loading={isRejecting}
            >
              거부
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
