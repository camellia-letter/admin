import { Link } from 'react-router-dom';
import { Stack, Card, Text, Title, Anchor, Group, Flex } from '@mantine/core';

export default function Settings() {
  return (
    <Stack gap={0} mih="100vh" bg="gray.0">
      <Flex
        component="header"
        bg="white"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
      >
        <Flex w="100%" maw="1280px" mx="auto" py="xl" px="md">
          <Group gap="md">
            <Anchor component={Link} to="/" c="blue">
              ← 돌아가기
            </Anchor>
            <Title order={1} size="h2">
              설정
            </Title>
          </Group>
        </Flex>
      </Flex>
      <Flex component="main" w="100%" maw="1280px" mx="auto" direction="column" py="xl" px="md">
        <Card shadow="sm" padding="lg" withBorder>
          <Text c="dimmed">설정 옵션이 여기에 표시됩니다.</Text>
        </Card>
      </Flex>
    </Stack>
  );
}
