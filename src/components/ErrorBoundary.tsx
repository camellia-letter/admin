import { Component, ReactNode } from 'react';
import { Flex, Stack, Title, Text, Button, Group } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Error caught and handled
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Flex mih="100vh" align="center" justify="center" bg="gray.0" px="md">
          <Stack align="center" gap="md" maw={448}>
            <IconAlertTriangle size={80} color="var(--mantine-color-red-4)" />
            <Title order={2} size="h3">
              문제가 발생했습니다
            </Title>
            <Text c="dimmed" ta="center">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </Text>
            <Group gap="sm">
              <Button color="pink" onClick={() => window.location.reload()}>
                새로고침
              </Button>
              <Button variant="default" onClick={() => (window.location.href = '/')}>
                홈으로
              </Button>
            </Group>
          </Stack>
        </Flex>
      );
    }

    return this.props.children;
  }
}
