import { HexColorPicker } from 'react-colorful';
import type {
  PrintInvitationConfig,
  PrintLayoutType,
  PrintTemplate,
  PaperSize,
  QRCodeSize,
  QRCodePosition,
} from '@camellia-letter/shared-types';
import {
  Stack,
  Paper,
  Title,
  Select,
  Checkbox,
  TextInput,
  NumberInput,
  Grid,
  Text,
  Box,
} from '@mantine/core';

interface PrintConfigPanelProps {
  config: PrintInvitationConfig;
  onChange: (config: PrintInvitationConfig) => void;
}

const PrintConfigPanel = ({ config, onChange }: PrintConfigPanelProps) => {
  const updateConfig = (updates: Partial<PrintInvitationConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateElements = (key: string, value: unknown) => {
    onChange({
      ...config,
      elements: {
        ...config.elements,
        [key]: value,
      },
    });
  };

  const updateQRCode = (key: string, value: unknown) => {
    onChange({
      ...config,
      elements: {
        ...config.elements,
        qrCode: {
          ...config.elements.qrCode,
          [key]: value,
        },
      },
    });
  };

  const updateCustomColors = (key: string, value: string) => {
    onChange({
      ...config,
      customColors: {
        ...config.customColors,
        [key]: value,
      },
    });
  };

  const updateCustomFontSizes = (key: string, value: number | undefined) => {
    onChange({
      ...config,
      customFontSizes: {
        ...config.customFontSizes,
        [key]: value,
      },
    });
  };

  return (
    <Paper p="md" withBorder radius="md" shadow="sm" bg="white">
      <Stack gap="lg">
        <Title order={2} size="h3">
          실물 청첩장 설정
        </Title>

        {/* Layout Type */}
        <Select
          label="레이아웃 유형"
          value={config.layoutType}
          onChange={(value) => updateConfig({ layoutType: value as PrintLayoutType })}
          data={[
            { value: 'single', label: '단면 (1페이지)' },
            { value: 'double', label: '양면 (2페이지)' },
            { value: 'bifold', label: '2단 접지' },
            { value: 'trifold', label: '3단 접지' },
          ]}
        />

        {/* Template */}
        <Select
          label="템플릿"
          value={config.template}
          onChange={(value) => updateConfig({ template: value as PrintTemplate })}
          data={[
            { value: 'classic-simple', label: '클래식 심플' },
            { value: 'modern-minimal', label: '모던 미니멀' },
            { value: 'romantic-floral', label: '로맨틱 플로럴' },
            { value: 'elegant-gold', label: '엘레강스 골드' },
            { value: 'nature-green', label: '네이처 그린' },
            { value: 'vintage-beige', label: '빈티지 베이지' },
          ]}
        />

        {/* Paper Size */}
        <Select
          label="용지 크기"
          value={config.paperSize}
          onChange={(value) => updateConfig({ paperSize: value as PaperSize })}
          data={[
            { value: 'A5', label: 'A5 (148×210mm)' },
            { value: 'A4', label: 'A4 (210×297mm)' },
            { value: 'DL', label: 'DL (110×220mm)' },
          ]}
        />

        {/* Elements */}
        <Box>
          <Text size="sm" fw={500} mb="sm">
            포함 요소
          </Text>
          <Stack gap="xs">
            <Checkbox
              label="인사말"
              checked={config.elements.message}
              onChange={(e) => updateElements('message', e.currentTarget.checked)}
            />
            <Checkbox
              label="갤러리 이미지"
              checked={config.elements.gallery}
              onChange={(e) => updateElements('gallery', e.currentTarget.checked)}
            />
            {config.elements.gallery && (
              <Box ml="xl">
                <NumberInput
                  label="이미지 개수"
                  min={1}
                  max={5}
                  value={config.elements.galleryImageCount || 3}
                  onChange={(value) =>
                    updateElements('galleryImageCount', typeof value === 'number' ? value : 3)
                  }
                  w={100}
                  size="xs"
                />
              </Box>
            )}
            <Checkbox
              label="교통편 안내"
              checked={config.elements.transport}
              onChange={(e) => updateElements('transport', e.currentTarget.checked)}
            />
          </Stack>
        </Box>

        {/* QR Code */}
        <Box>
          <Checkbox
            label="QR 코드 삽입"
            checked={config.elements.qrCode.enabled}
            onChange={(e) => updateQRCode('enabled', e.currentTarget.checked)}
            mb="sm"
            fw={500}
          />

          {config.elements.qrCode.enabled && (
            <Stack gap="sm" ml="xl">
              <TextInput
                label="QR 코드 URL"
                type="url"
                value={config.elements.qrCode.url}
                onChange={(e) => updateQRCode('url', e.currentTarget.value)}
                placeholder="https://example.com/invitation/..."
                size="xs"
              />
              <Select
                label="크기"
                value={config.elements.qrCode.size}
                onChange={(value) => updateQRCode('size', value as QRCodeSize)}
                data={[
                  { value: 'small', label: '작게 (20mm)' },
                  { value: 'medium', label: '중간 (30mm)' },
                  { value: 'large', label: '크게 (40mm)' },
                ]}
                size="xs"
              />
              <Select
                label="위치"
                value={config.elements.qrCode.position}
                onChange={(value) => updateQRCode('position', value as QRCodePosition)}
                data={[
                  { value: 'top-right', label: '우측 상단' },
                  { value: 'bottom-center', label: '하단 중앙' },
                  { value: 'bottom-right', label: '우측 하단' },
                ]}
                size="xs"
              />
              <TextInput
                label="라벨"
                value={config.elements.qrCode.label || ''}
                onChange={(e) => updateQRCode('label', e.currentTarget.value)}
                placeholder="모바일 청첩장 보기"
                size="xs"
              />
            </Stack>
          )}
        </Box>

        {/* Custom Colors */}
        <Box>
          <Text size="sm" fw={500} mb="sm">
            커스텀 컬러
          </Text>
          <Stack gap="sm">
            <Box>
              <Text size="xs" c="dimmed" mb="xs">
                주 색상 (Primary)
              </Text>
              <HexColorPicker
                color={config.customColors?.primary || '#333333'}
                onChange={(color) => updateCustomColors('primary', color)}
              />
              <TextInput
                value={config.customColors?.primary || '#333333'}
                onChange={(e) => updateCustomColors('primary', e.currentTarget.value)}
                mt="xs"
                size="xs"
                styles={{ input: { fontFamily: 'monospace' } }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Custom Font Family */}
        <TextInput
          label="커스텀 폰트 (선택사항)"
          value={config.customFontFamily || ''}
          onChange={(e) => updateConfig({ customFontFamily: e.currentTarget.value || undefined })}
          placeholder="폰트 파일 이름 (예: CustomFont)"
          description="서버에 업로드된 .ttf 파일 이름을 입력하세요."
        />

        {/* Custom Font Sizes */}
        <Box>
          <Text size="sm" fw={500} mb="sm">
            폰트 크기 조절 (선택사항)
          </Text>
          <Grid gutter="sm">
            <Grid.Col span={6}>
              <NumberInput
                label="타이틀 (pt)"
                min={8}
                max={72}
                value={config.customFontSizes?.title || undefined}
                onChange={(value) =>
                  updateCustomFontSizes('title', typeof value === 'number' ? value : undefined)
                }
                placeholder="기본값"
                size="xs"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="제목 (pt)"
                min={8}
                max={48}
                value={config.customFontSizes?.heading || undefined}
                onChange={(value) =>
                  updateCustomFontSizes('heading', typeof value === 'number' ? value : undefined)
                }
                placeholder="기본값"
                size="xs"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="본문 (pt)"
                min={6}
                max={24}
                value={config.customFontSizes?.body || undefined}
                onChange={(value) =>
                  updateCustomFontSizes('body', typeof value === 'number' ? value : undefined)
                }
                placeholder="기본값"
                size="xs"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="캡션 (pt)"
                min={6}
                max={16}
                value={config.customFontSizes?.caption || undefined}
                onChange={(value) =>
                  updateCustomFontSizes('caption', typeof value === 'number' ? value : undefined)
                }
                placeholder="기본값"
                size="xs"
              />
            </Grid.Col>
          </Grid>
          <Text size="xs" c="dimmed" mt="xs">
            비워두면 템플릿 기본 크기가 사용됩니다.
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PrintConfigPanel;
