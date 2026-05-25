import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PrintInvitationConfig } from '@camellia/shared-types';
import { generatePrintPDFBlob } from '@/api/print-invitation';
import { Paper, Title, Loader, Alert, Stack, Flex, Text, Center, Box } from '@mantine/core';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PrintPreviewProps {
  invitationId: string;
  config: PrintInvitationConfig;
}

const PrintPreview = ({ invitationId, config }: PrintPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const generatePreview = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await generatePrintPDFBlob(invitationId, config);

        if (!isCancelled) {
          // 이전 URL 해제
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }

          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      } catch (err) {
        if (!isCancelled) {
          // eslint-disable-next-line no-console
          console.error('PDF 생성 실패:', err);
          setError('PDF 미리보기를 생성하지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    // 디바운싱: 500ms 후에 PDF 재생성
    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
    // pdfUrl은 의도적으로 제외 (무한 루프 방지)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId, config]);

  // 컴포넌트 언마운트 시 URL 해제
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Paper
      p="md"
      bg="gray.1"
      radius="md"
      style={{
        position: 'relative',
        minHeight: 600,
        boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      <Flex direction="column" align="center">
        <Title order={3} size="h4" mb="md">
          PDF 미리보기
        </Title>

        {isLoading && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              zIndex: 10,
            }}
          >
            <Center h="100%">
              <Stack align="center" gap="sm">
                <Loader size="lg" color="blue" />
                <Text size="sm" c="dimmed">
                  PDF 생성 중...
                </Text>
              </Stack>
            </Center>
          </Box>
        )}

        {error && (
          <Alert color="red" w="100%">
            {error}
          </Alert>
        )}

        {!error && pdfUrl && (
          <Flex direction="column" align="center" w="100%">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                // eslint-disable-next-line no-console
                console.error('PDF 로드 실패:', error);
                setError('PDF를 불러오지 못했습니다.');
              }}
              loading={
                <Center h={256}>
                  <Text size="sm" c="dimmed">
                    PDF 로딩 중...
                  </Text>
                </Center>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Paper key={`page_${index + 1}`} mb="md" shadow="lg">
                  <Page
                    pageNumber={index + 1}
                    width={400}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Paper>
              ))}
            </Document>

            {numPages > 0 && (
              <Text mt="xs" size="sm" c="dimmed">
                총 {numPages} 페이지
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    </Paper>
  );
};

export default PrintPreview;
