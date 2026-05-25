import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, Flex, Stack, Title, Text, Button, Group, Anchor } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import { IconAlertTriangle } from '@tabler/icons-react';
import { theme } from '@/styles/theme';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageSkeleton } from './components/Skeleton';
import 'dayjs/locale/ko';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Editor = lazy(() => import('./pages/Editor'));
const Settings = lazy(() => import('./pages/Settings'));
const PrintDesignEditor = lazy(() => import('./pages/PrintDesignEditor'));
const PrintInvitationsList = lazy(() => import('./pages/PrintInvitationsList'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 4xx 에러는 재시도하지 않음
        if (error instanceof Error && 'response' in error) {
          const status = (error as { response?: { status?: number } }).response?.status;
          if (status && status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 5 * 60 * 1000, // 5분 (데이터가 fresh 상태로 유지되는 시간)
      gcTime: 10 * 60 * 1000, // 10분 (캐시에 보관되는 시간, 메모리 효율화)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
    },
    mutations: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MantineProvider theme={theme}>
        <DatesProvider settings={{ locale: 'ko', firstDayOfWeek: 0, weekendDays: [0, 6] }}>
          <Notifications />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/editor/:id"
                      element={
                        <ErrorBoundary
                          fallback={
                            <Flex mih="100vh" align="center" justify="center" bg="gray.0" px="md">
                              <Stack align="center" gap="md" maw={448}>
                                <IconAlertTriangle size={64} color="var(--mantine-color-red-4)" />
                                <Title order={2} size="h3">
                                  에디터에서 오류가 발생했습니다
                                </Title>
                                <Text c="dimmed" ta="center">
                                  페이지를 새로고침하거나 대시보드로 돌아가주세요.
                                </Text>
                                <Group gap="sm">
                                  <Button color="pink" onClick={() => window.location.reload()}>
                                    새로고침
                                  </Button>
                                  <Anchor href="/" underline="never">
                                    <Button variant="default">대시보드로</Button>
                                  </Anchor>
                                </Group>
                              </Stack>
                            </Flex>
                          }
                        >
                          <Editor />
                        </ErrorBoundary>
                      }
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/invitations/:id/print" element={<PrintDesignEditor />} />
                    <Route path="/admin/print-invitations" element={<PrintInvitationsList />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </DatesProvider>
      </MantineProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
