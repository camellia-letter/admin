import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Stack,
  Flex,
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  TextInput,
  Button,
  Group,
  Table,
  Badge,
  Anchor,
  Loader,
  Center,
  Pagination,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { getAllInvitations, getPrintInvitationStats } from '../api/admin';
import type { AdminInvitation, PrintInvitationStatsResponse } from '../api/admin';

export default function PrintInvitationsList() {
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [stats, setStats] = useState<PrintInvitationStatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [hasConfigFilter, setHasConfigFilter] = useState<'all' | 'true' | 'false'>('all');

  const loadInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number | boolean> = {
        page,
        limit,
      };

      if (search) {
        params.search = search;
      }

      if (hasConfigFilter !== 'all') {
        params.hasConfig = hasConfigFilter === 'true';
      }

      const response = await getAllInvitations(params);
      setInvitations(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('청첩장 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, hasConfigFilter]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getPrintInvitationStats();
      setStats(response.data);
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = (filter: 'all' | 'true' | 'false') => {
    setHasConfigFilter(filter);
    setPage(1);
  };

  return (
    <Stack gap={0} mih="100vh" bg="gray.0">
      <Flex
        component="header"
        bg="white"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
      >
        <Container size="xl" py="xl" px="md">
          <Flex justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Title order={1} size="h2">
                실물 청첩장 관리
              </Title>
              <Text size="sm" c="dimmed">
                모든 사용자의 실물 청첩장 설정을 관리합니다
              </Text>
            </Stack>
            <Anchor component={Link} to="/" c="gray">
              대시보드로 돌아가기
            </Anchor>
          </Flex>
        </Container>
      </Flex>

      <Container component="main" size="xl" py="xl" px="md">
        {stats && (
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="lg">
            <Card shadow="sm" padding="lg" withBorder>
              <Text size="sm" fw={500} c="dimmed">
                전체 청첩장
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {stats.totalInvitations}
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" withBorder>
              <Text size="sm" fw={500} c="dimmed">
                실물 설정 완료
              </Text>
              <Text size="xl" fw={700} c="blue" mt="xs">
                {stats.totalWithPrintConfig}
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" withBorder>
              <Text size="sm" fw={500} c="dimmed">
                설정 비율
              </Text>
              <Text size="xl" fw={700} c="green" mt="xs">
                {(stats.configUsageRate * 100).toFixed(1)}%
              </Text>
            </Card>
          </SimpleGrid>
        )}

        <Card shadow="sm" padding="lg" withBorder mb="lg">
          <form onSubmit={handleSearch}>
            <Group gap="md" align="flex-end">
              <TextInput
                style={{ flex: 1 }}
                placeholder="신랑/신부 이름, 슬러그, 사용자 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
              />
              <Button type="submit" color="blue">
                검색
              </Button>
              {search && (
                <Button
                  variant="light"
                  color="gray"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setPage(1);
                  }}
                >
                  초기화
                </Button>
              )}
            </Group>
          </form>

          <Group gap="xs" mt="md">
            <Button
              variant={hasConfigFilter === 'all' ? 'filled' : 'light'}
              color="blue"
              onClick={() => handleFilterChange('all')}
            >
              전체
            </Button>
            <Button
              variant={hasConfigFilter === 'true' ? 'filled' : 'light'}
              color="blue"
              onClick={() => handleFilterChange('true')}
            >
              설정 완료
            </Button>
            <Button
              variant={hasConfigFilter === 'false' ? 'filled' : 'light'}
              color="blue"
              onClick={() => handleFilterChange('false')}
            >
              미설정
            </Button>
          </Group>

          <Text size="sm" c="dimmed" mt="md">
            전체 {total}개 중 {invitations.length}개 표시 (페이지 {page}/{totalPages})
          </Text>
        </Card>

        {loading && (
          <Card shadow="sm" padding="lg" withBorder>
            <Center py="xl">
              <Loader size="md" />
            </Center>
          </Card>
        )}

        {error && (
          <Card shadow="sm" padding="lg" withBorder>
            <Center py="xl">
              <Text c="red">{error}</Text>
            </Center>
          </Card>
        )}

        {!loading && !error && invitations.length > 0 && (
          <Card shadow="sm" padding={0} withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>청첩장</Table.Th>
                  <Table.Th>사용자</Table.Th>
                  <Table.Th>예식일</Table.Th>
                  <Table.Th>실물 설정</Table.Th>
                  <Table.Th>작업</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invitations.map((invitation) => (
                  <Table.Tr key={invitation.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {invitation.groomName} & {invitation.brideName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {invitation.venue}
                      </Text>
                      {invitation.slug && (
                        <Text size="xs" c="dimmed" mt={4}>
                          /{invitation.slug}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{invitation.user.name || '-'}</Text>
                      <Text size="xs" c="dimmed">
                        {invitation.user.email || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(invitation.weddingDate).toLocaleDateString('ko-KR')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {invitation.hasPrintConfig ? (
                        <Stack gap="xs">
                          <Badge color="green" size="sm">
                            설정 완료
                          </Badge>
                          {invitation.printConfigTemplate && (
                            <Text size="xs" c="dimmed">
                              {invitation.printConfigTemplate}
                            </Text>
                          )}
                        </Stack>
                      ) : (
                        <Badge color="gray" size="sm">
                          미설정
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Anchor
                          component={Link}
                          to={`/invitations/${invitation.id}/print`}
                          size="sm"
                        >
                          설정 보기
                        </Anchor>
                        <Anchor component={Link} to={`/editor/${invitation.id}`} size="sm" c="gray">
                          편집
                        </Anchor>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        )}

        {!loading && !error && invitations.length === 0 && (
          <Card shadow="sm" padding="lg" withBorder>
            <Center py="xl">
              <Text c="dimmed">검색 결과가 없습니다.</Text>
            </Center>
          </Card>
        )}

        {!loading && !error && totalPages > 1 && (
          <Group justify="center" mt="lg">
            <Pagination total={totalPages} value={page} onChange={setPage} />
          </Group>
        )}
      </Container>
    </Stack>
  );
}
