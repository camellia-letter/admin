import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Flex, Title, Text, Button, Alert, Loader, Grid, Anchor } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { DEFAULT_PRINT_INVITATION_CONFIG } from '@camellia/shared-types';
import type { PrintInvitationConfig } from '@camellia/shared-types';
import PrintConfigPanel from '@/components/print/PrintConfigPanel';
import PrintPreview from '@/components/print/PrintPreview';
import { getPrintConfig, savePrintConfig, downloadPrintPDF } from '@/api/print-invitation';

export default function PrintDesignEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState<PrintInvitationConfig>(DEFAULT_PRINT_INVITATION_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // 초기 설정 로드
  useEffect(() => {
    if (!id) {
      setError('청첩장 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    const loadConfig = async () => {
      try {
        const savedConfig = await getPrintConfig(id);
        if (savedConfig) {
          setConfig(savedConfig);
        }
      } catch {
        // 에러 발생 시 기본 설정 사용
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [id]);

  // 설정 저장
  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      await savePrintConfig(id, config);
      setSaveMessage('설정이 저장되었습니다.');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setError('설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // PDF 다운로드
  const handleDownload = async () => {
    if (!id) return;

    setIsDownloading(true);
    setError(null);

    try {
      await downloadPrintPDF(id, config);
    } catch {
      setError('PDF 다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Flex mih="100vh" align="center" justify="center">
        <Stack align="center" gap="md">
          <Loader size="lg" color="blue" />
          <Text c="dimmed">로딩 중...</Text>
        </Stack>
      </Flex>
    );
  }

  if (!id) {
    return (
      <Flex w="100%" p="xl">
        <Alert color="red" title="오류">
          청첩장 ID가 없습니다.
        </Alert>
      </Flex>
    );
  }

  return (
    <Stack gap={0} mih="100vh" bg="gray.0" p="xl">
      {/* Header */}
      <Flex w="100%" maw="1280px" mx="auto" direction="column" mb="xl">
        <Stack gap="md">
          <Flex justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Anchor onClick={() => navigate(`/invitations/${id}`)} c="blue">
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} />
                  청첩장 상세로 돌아가기
                </Flex>
              </Anchor>
              <Title order={1} size="h2">
                실물 청첩장 PDF 출력 설정
              </Title>
              <Text size="sm" c="dimmed">
                템플릿을 선택하고 설정을 조정한 후 PDF로 다운로드하세요.
              </Text>
            </Stack>

            <Flex gap="sm">
              <Button onClick={handleSave} loading={isSaving} color="blue">
                설정 저장
              </Button>
              <Button onClick={handleDownload} loading={isDownloading} color="green">
                PDF 다운로드
              </Button>
            </Flex>
          </Flex>

          {/* Messages */}
          {saveMessage && (
            <Alert color="green" title="성공">
              {saveMessage}
            </Alert>
          )}

          {error && (
            <Alert color="red" title="오류">
              {error}
            </Alert>
          )}
        </Stack>
      </Flex>

      {/* Main Content */}
      <Flex w="100%" maw="1280px" mx="auto" direction="column">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PrintConfigPanel config={config} onChange={setConfig} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PrintPreview invitationId={id} config={config} />
          </Grid.Col>
        </Grid>
      </Flex>
    </Stack>
  );
}
