import { Skeleton, Card, Stack, Group, Flex, SimpleGrid, Paper } from '@mantine/core';

export const InvitationCardSkeleton = () => {
  return (
    <Card shadow="sm" padding="lg">
      <Group gap="xs" mb="md">
        <Skeleton circle height={24} />
        <Skeleton height={24} width={160} />
      </Group>
      <Stack gap="xs">
        <Flex align="center" gap="xs">
          <Skeleton height={16} width={16} />
          <Skeleton height={16} width={128} />
        </Flex>
        <Flex align="center" gap="xs">
          <Skeleton height={16} width={16} />
          <Skeleton height={16} width={96} />
        </Flex>
      </Stack>
      <Flex mt="md" gap="md">
        <Skeleton height={16} width={48} />
        <Skeleton height={16} width={48} />
      </Flex>
      <Flex mt="lg" pt="md" gap="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Skeleton height={40} style={{ flex: 1 }} radius="md" />
        <Skeleton height={40} style={{ flex: 1 }} radius="md" />
        <Skeleton height={40} style={{ flex: 1 }} radius="md" />
      </Flex>
    </Card>
  );
};

export const EditorSkeleton = () => {
  return (
    <Stack gap="lg">
      <Flex justify="space-between" align="center">
        <Skeleton height={32} width={192} />
        <Skeleton height={40} width={96} radius="md" />
      </Flex>

      <Card shadow="sm" padding="lg">
        <Skeleton height={24} width={128} mb="md" />
        <SimpleGrid cols={2} spacing="md">
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
        </SimpleGrid>
      </Card>

      <Card shadow="sm" padding="lg">
        <Skeleton height={24} width={96} mb="md" />
        <Stack gap="sm">
          <Skeleton height={64} radius="md" />
          <Skeleton height={64} radius="md" />
          <Skeleton height={64} radius="md" />
        </Stack>
      </Card>
    </Stack>
  );
};

export const StatsSkeleton = () => {
  return (
    <Stack gap="lg">
      <SimpleGrid cols={2} spacing="md">
        <Skeleton height={96} radius="md" />
        <Skeleton height={96} radius="md" />
      </SimpleGrid>
      <Skeleton height={96} radius="md" />
      <Skeleton height={160} radius="md" />
    </Stack>
  );
};

export const PageSkeleton = () => {
  return (
    <Stack gap={0} mih="100vh" bg="gray.0">
      <Paper component="header" shadow="sm" bg="white">
        <Flex
          w="100%"
          maw="1280px"
          mx="auto"
          py="xl"
          px="md"
          justify="space-between"
          align="center"
        >
          <Skeleton height={36} width={128} />
          <Skeleton height={24} width={64} />
        </Flex>
      </Paper>

      <Flex component="main" w="100%" maw="1280px" mx="auto" direction="column" py="xl" px="md">
        <Flex mb="lg" justify="space-between" align="center">
          <Skeleton height={28} width={112} />
          <Skeleton height={40} width={112} radius="md" />
        </Flex>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          <InvitationCardSkeleton />
          <InvitationCardSkeleton />
          <InvitationCardSkeleton />
        </SimpleGrid>
      </Flex>
    </Stack>
  );
};

export const BlockSkeleton = () => {
  return (
    <Stack gap="md" py="xl" px="md" align="center">
      <Skeleton height={24} width={128} />
      <Skeleton height={16} width={192} />
      <Skeleton height={16} width={160} />
    </Stack>
  );
};
