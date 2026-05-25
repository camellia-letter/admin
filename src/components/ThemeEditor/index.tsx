import { useState, useMemo, useCallback, memo } from 'react';
import {
  InvitationTheme,
  ThemePreset,
  FontFamily,
  ThemeColors,
  GradientConfig,
  THEME_PRESETS,
  DEFAULT_THEME,
} from '@camellia/shared-types';
import { checkThemeContrast, getContrastGrade } from '@/utils/colorContrast';
import { useToast } from '@/hooks/useNotifications';
import {
  Stack,
  Group,
  Button,
  Text,
  Paper,
  ColorInput,
  Switch,
  Grid,
  Box,
  Badge,
  Card,
  Collapse,
} from '@mantine/core';
import { IconUpload, IconDownload, IconChevronDown } from '@tabler/icons-react';

interface ThemeEditorProps {
  theme: InvitationTheme | undefined;
  onChange: (theme: InvitationTheme) => void;
}

// 테마 카테고리
const THEME_CATEGORIES = {
  basic: {
    label: '기본',
    presets: ['classic', 'modern', 'minimal', 'elegant'] as const,
  },
  season: {
    label: '계절',
    presets: ['spring', 'summer', 'autumn', 'winter'] as const,
  },
  nature: {
    label: '자연',
    presets: ['nature', 'forest', 'beach', 'garden'] as const,
  },
  mood: {
    label: '분위기',
    presets: ['romantic', 'navy', 'burgundy', 'midnight', 'sunset'] as const,
  },
};

const FONT_OPTIONS: { value: FontFamily; label: string; fontFamily: string }[] = [
  {
    value: 'pretendard',
    label: '프리텐다드',
    fontFamily:
      "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
  { value: 'noto-serif', label: '노토 세리프', fontFamily: "'Noto Serif KR', serif" },
  { value: 'gowun-batang', label: '고운 바탕', fontFamily: "'Gowun Batang', serif" },
  { value: 'nanum-myeongjo', label: '나눔 명조', fontFamily: "'Nanum Myeongjo', serif" },
  {
    value: 'cafe24-surround',
    label: '카페24 써라운드',
    fontFamily: "'Cafe24Surround', sans-serif",
  },
];

const getFontFamily = (fontValue: FontFamily): string => {
  return FONT_OPTIONS.find((f) => f.value === fontValue)?.fontFamily || FONT_OPTIONS[0].fontFamily;
};

const BORDER_RADIUS_OPTIONS: { value: 'none' | 'small' | 'medium' | 'large'; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
];

const GRADIENT_DIRECTIONS: { value: GradientConfig['direction']; label: string }[] = [
  { value: 'to-b', label: '위→아래' },
  { value: 'to-t', label: '아래→위' },
  { value: 'to-r', label: '왼→오' },
  { value: 'to-l', label: '오→왼' },
  { value: 'to-br', label: '대각선↘' },
  { value: 'to-bl', label: '대각선↙' },
  { value: 'to-tr', label: '대각선↗' },
  { value: 'to-tl', label: '대각선↖' },
];

const DEFAULT_GRADIENT: GradientConfig = {
  enabled: false,
  type: 'linear',
  direction: 'to-b',
  fromColor: '#fce4ec',
  toColor: '#f3e5f5',
};

// 그라디언트 CSS 생성
const getGradientCSS = (gradient: GradientConfig): string => {
  if (!gradient.enabled) return '';

  const directionMap: Record<GradientConfig['direction'], string> = {
    'to-b': '180deg',
    'to-t': '0deg',
    'to-r': '90deg',
    'to-l': '270deg',
    'to-br': '135deg',
    'to-bl': '225deg',
    'to-tr': '45deg',
    'to-tl': '315deg',
  };

  if (gradient.type === 'linear') {
    const colors = gradient.viaColor
      ? `${gradient.fromColor}, ${gradient.viaColor}, ${gradient.toColor}`
      : `${gradient.fromColor}, ${gradient.toColor}`;
    return `linear-gradient(${directionMap[gradient.direction]}, ${colors})`;
  } else {
    const colors = gradient.viaColor
      ? `${gradient.fromColor}, ${gradient.viaColor}, ${gradient.toColor}`
      : `${gradient.fromColor}, ${gradient.toColor}`;
    return `radial-gradient(circle, ${colors})`;
  }
};

export const ThemeEditor = ({ theme, onChange }: ThemeEditorProps) => {
  const currentTheme = theme || DEFAULT_THEME;
  const [isCustomMode, setIsCustomMode] = useState(currentTheme.preset === 'custom');
  const [activeCategory, setActiveCategory] = useState<keyof typeof THEME_CATEGORIES>('basic');
  const { addToast } = useToast();

  const handlePresetChange = useCallback(
    (preset: ThemePreset) => {
      if (preset === 'custom') {
        setIsCustomMode(true);
        onChange({
          ...currentTheme,
          preset: 'custom',
        });
      } else {
        setIsCustomMode(false);
        onChange({
          preset,
          colors: THEME_PRESETS[preset].colors,
          fontFamily: currentTheme.fontFamily,
          borderRadius: currentTheme.borderRadius,
        });
      }
    },
    [currentTheme, onChange],
  );

  // 테마 내보내기
  const handleExportTheme = useCallback(() => {
    const themeData = JSON.stringify(currentTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${currentTheme.preset}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentTheme]);

  // 테마 가져오기
  const handleImportTheme = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTheme = JSON.parse(event.target?.result as string) as InvitationTheme;
          // 유효성 검사
          if (importedTheme.colors && importedTheme.fontFamily) {
            onChange({
              ...importedTheme,
              preset: 'custom', // 가져온 테마는 커스텀으로 설정
            });
            setIsCustomMode(true);
            addToast('success', '테마를 성공적으로 가져왔습니다.');
          } else {
            addToast('error', '유효하지 않은 테마 파일입니다.');
          }
        } catch {
          addToast('error', '테마 파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(selectedFile);
    },
    [onChange, addToast],
  );

  const handleColorChange = useCallback(
    (colorKey: keyof ThemeColors, value: string) => {
      onChange({
        ...currentTheme,
        preset: 'custom',
        colors: {
          ...currentTheme.colors,
          [colorKey]: value,
        },
      });
      setIsCustomMode(true);
    },
    [currentTheme, onChange],
  );

  const handleFontChange = useCallback(
    (fontFamily: FontFamily) => {
      onChange({
        ...currentTheme,
        fontFamily,
      });
    },
    [currentTheme, onChange],
  );

  const handleBorderRadiusChange = useCallback(
    (borderRadius: 'none' | 'small' | 'medium' | 'large') => {
      onChange({
        ...currentTheme,
        borderRadius,
      });
    },
    [currentTheme, onChange],
  );

  const handleGradientChange = useCallback(
    (updates: Partial<GradientConfig>) => {
      const currentGradient = currentTheme.gradient || DEFAULT_GRADIENT;
      onChange({
        ...currentTheme,
        gradient: {
          ...currentGradient,
          ...updates,
        },
      });
    },
    [currentTheme, onChange],
  );

  const currentGradient = currentTheme.gradient || DEFAULT_GRADIENT;

  // 색상 대비 검사 결과 계산
  const contrastReport = useMemo(
    () => checkThemeContrast(currentTheme.colors),
    [currentTheme.colors],
  );

  return (
    <Stack gap="lg">
      {/* 테마 내보내기/가져오기 */}
      <Group justify="flex-end">
        <Button
          variant="default"
          size="xs"
          leftSection={<IconUpload size={14} />}
          onClick={() => document.getElementById('theme-import-file')?.click()}
        >
          가져오기
        </Button>
        <input
          id="theme-import-file"
          type="file"
          accept=".json"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              handleImportTheme(selectedFile);
              e.target.value = '';
            }
          }}
          style={{ display: 'none' }}
        />
        <Button
          variant="default"
          size="xs"
          leftSection={<IconDownload size={14} />}
          onClick={handleExportTheme}
        >
          내보내기
        </Button>
      </Group>

      {/* 프리셋 선택 */}
      <Stack gap="md">
        <Text size="sm" fw={500}>
          테마 프리셋
        </Text>

        {/* 카테고리 탭 */}
        <Paper p="xs" bg="gray.1" radius="md">
          <Group gap="xs">
            {(Object.keys(THEME_CATEGORIES) as (keyof typeof THEME_CATEGORIES)[]).map(
              (category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'filled' : 'subtle'}
                  size="xs"
                  onClick={() => setActiveCategory(category)}
                  style={{ flex: 1 }}
                >
                  {THEME_CATEGORIES[category].label}
                </Button>
              ),
            )}
          </Group>
        </Paper>

        {/* 프리셋 그리드 */}
        <Grid gutter="xs">
          {THEME_CATEGORIES[activeCategory].presets.map((preset) => (
            <Grid.Col key={preset} span={6}>
              <Paper
                p="md"
                withBorder
                radius="md"
                onClick={() => handlePresetChange(preset)}
                style={{
                  cursor: 'pointer',
                  borderWidth: 2,
                  borderColor:
                    currentTheme.preset === preset && !isCustomMode
                      ? 'var(--mantine-color-blue-6)'
                      : 'var(--mantine-color-gray-3)',
                  backgroundColor:
                    currentTheme.preset === preset && !isCustomMode
                      ? 'var(--mantine-color-blue-0)'
                      : 'white',
                }}
              >
                <Group gap="xs" mb="xs">
                  <Box
                    w={16}
                    h={16}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: THEME_PRESETS[preset].colors.primary,
                    }}
                  />
                  <Box
                    w={16}
                    h={16}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: THEME_PRESETS[preset].colors.secondary,
                    }}
                  />
                  <Box
                    w={16}
                    h={16}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: THEME_PRESETS[preset].colors.background,
                    }}
                  />
                </Group>
                <Text size="sm" fw={500}>
                  {THEME_PRESETS[preset].name}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>

        {/* 커스텀 버튼 */}
        <Paper
          p="md"
          withBorder
          radius="md"
          onClick={() => handlePresetChange('custom')}
          style={{
            cursor: 'pointer',
            borderWidth: 2,
            borderColor: isCustomMode
              ? 'var(--mantine-color-blue-6)'
              : 'var(--mantine-color-gray-3)',
            backgroundColor: isCustomMode ? 'var(--mantine-color-blue-0)' : 'white',
          }}
        >
          <Group justify="center" gap="xs">
            <Box
              w={16}
              h={16}
              style={{
                borderRadius: '50%',
                background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)',
              }}
            />
            <Text size="sm" fw={500}>
              커스텀 색상 직접 설정
            </Text>
          </Group>
        </Paper>
      </Stack>

      {/* 미리보기 */}
      <ThemePreview
        colors={currentTheme.colors}
        fontFamily={currentTheme.fontFamily}
        gradient={currentGradient}
      />

      {/* 색상 대비 검사 결과 */}
      <ContrastCheckPanel colors={currentTheme.colors} report={contrastReport} />

      {/* 커스텀 색상 (커스텀 모드일 때만 표시) */}
      {isCustomMode && (
        <Stack gap="md">
          <Text size="sm" fw={500}>
            색상 커스터마이즈
          </Text>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <ColorPicker
                label="메인 색상"
                value={currentTheme.colors.primary}
                onChange={(value: string) => handleColorChange('primary', value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorPicker
                label="보조 색상"
                value={currentTheme.colors.secondary}
                onChange={(value: string) => handleColorChange('secondary', value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorPicker
                label="배경 색상"
                value={currentTheme.colors.background}
                onChange={(value: string) => handleColorChange('background', value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorPicker
                label="텍스트 색상"
                value={currentTheme.colors.text}
                onChange={(value: string) => handleColorChange('text', value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorPicker
                label="강조 색상"
                value={currentTheme.colors.accent}
                onChange={(value: string) => handleColorChange('accent', value)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      )}

      {/* 폰트 선택 */}
      <Stack gap="md">
        <Text size="sm" fw={500}>
          폰트
        </Text>
        <Stack gap="xs">
          {FONT_OPTIONS.map((option) => (
            <Paper
              key={option.value}
              p="md"
              withBorder
              radius="md"
              onClick={() => handleFontChange(option.value)}
              style={{
                cursor: 'pointer',
                borderWidth: 2,
                borderColor:
                  currentTheme.fontFamily === option.value
                    ? 'var(--mantine-color-blue-6)'
                    : 'var(--mantine-color-gray-3)',
                backgroundColor:
                  currentTheme.fontFamily === option.value
                    ? 'var(--mantine-color-blue-0)'
                    : 'white',
              }}
            >
              <Text size="xs" c="dimmed" mb={4}>
                {option.label}
              </Text>
              <Text size="lg" style={{ fontFamily: option.fontFamily }}>
                신랑 ♥ 신부
              </Text>
            </Paper>
          ))}
        </Stack>
      </Stack>

      {/* 모서리 둥글기 */}
      <Stack gap="md">
        <Text size="sm" fw={500}>
          모서리 둥글기
        </Text>
        <Group gap="xs" grow>
          {BORDER_RADIUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={currentTheme.borderRadius === option.value ? 'filled' : 'default'}
              size="sm"
              onClick={() => handleBorderRadiusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Group>
      </Stack>

      {/* 그라디언트 배경 */}
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            그라디언트 배경
          </Text>
          <Switch
            checked={currentGradient.enabled}
            onChange={(e) => handleGradientChange({ enabled: e.currentTarget.checked })}
          />
        </Group>

        <Collapse in={currentGradient.enabled}>
          <Paper p="md" bg="gray.0" radius="md">
            <Stack gap="md">
              {/* 그라디언트 타입 */}
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  타입
                </Text>
                <Group gap="xs" grow>
                  <Button
                    variant={currentGradient.type === 'linear' ? 'filled' : 'default'}
                    size="sm"
                    onClick={() => handleGradientChange({ type: 'linear' })}
                  >
                    선형
                  </Button>
                  <Button
                    variant={currentGradient.type === 'radial' ? 'filled' : 'default'}
                    size="sm"
                    onClick={() => handleGradientChange({ type: 'radial' })}
                  >
                    원형
                  </Button>
                </Group>
              </Stack>

              {/* 방향 (선형일 때만) */}
              {currentGradient.type === 'linear' && (
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    방향
                  </Text>
                  <Grid gutter="xs">
                    {GRADIENT_DIRECTIONS.map((dir) => (
                      <Grid.Col key={dir.value} span={3}>
                        <Button
                          variant={currentGradient.direction === dir.value ? 'filled' : 'default'}
                          size="xs"
                          onClick={() => handleGradientChange({ direction: dir.value })}
                          fullWidth
                        >
                          {dir.label}
                        </Button>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              )}

              {/* 색상 */}
              <Stack gap="sm">
                <Group gap="md" align="center">
                  <ColorInput
                    value={currentGradient.fromColor}
                    onChange={(value) => handleGradientChange({ fromColor: value })}
                    label="시작 색상"
                    size="xs"
                    style={{ flex: 1 }}
                  />
                </Group>

                <Group gap="md" align="center">
                  <ColorInput
                    value={currentGradient.viaColor || currentGradient.fromColor}
                    onChange={(value) => handleGradientChange({ viaColor: value })}
                    label="중간 색상 (선택)"
                    size="xs"
                    style={{ flex: 1 }}
                    rightSection={
                      currentGradient.viaColor ? (
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => handleGradientChange({ viaColor: undefined })}
                        >
                          제거
                        </Button>
                      ) : null
                    }
                  />
                </Group>

                <Group gap="md" align="center">
                  <ColorInput
                    value={currentGradient.toColor}
                    onChange={(value) => handleGradientChange({ toColor: value })}
                    label="끝 색상"
                    size="xs"
                    style={{ flex: 1 }}
                  />
                </Group>
              </Stack>

              {/* 그라디언트 미리보기 */}
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  그라디언트 미리보기
                </Text>
                <Box
                  h={48}
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                    border: '1px solid var(--mantine-color-gray-3)',
                    background: getGradientCSS(currentGradient),
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Collapse>
      </Stack>
    </Stack>
  );
};

// 미리보기 컴포넌트
interface ThemePreviewProps {
  colors: ThemeColors;
  fontFamily: FontFamily;
  gradient: GradientConfig;
}

const ThemePreview = memo(({ colors, fontFamily, gradient }: ThemePreviewProps) => {
  const gradientCSS = useMemo(() => getGradientCSS(gradient), [gradient]);

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        미리보기
      </Text>
      <Paper
        p="md"
        withBorder
        radius="md"
        style={{
          backgroundColor: gradient.enabled ? undefined : colors.background,
          background: gradient.enabled ? gradientCSS : colors.background,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
        <Text size="lg" fw={600} mb="xs" style={{ color: colors.text }}>
          신랑 ♥ 신부
        </Text>
        <Text size="sm" mb="md" style={{ color: colors.text }}>
          결혼합니다
        </Text>
        <Group gap="xs">
          <Button size="sm" c="white" style={{ backgroundColor: colors.primary }}>
            참석하기
          </Button>
          <Button size="sm" style={{ backgroundColor: colors.secondary, color: colors.text }}>
            축하 메시지
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
});

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = memo(({ label, value, onChange }: ColorPickerProps) => {
  return <ColorInput label={label} value={value} onChange={onChange} size="xs" />;
});

// 색상 대비 검사 패널 컴포넌트
interface ContrastCheckPanelProps {
  colors: ThemeColors;
  report: ReturnType<typeof checkThemeContrast>;
}

const ContrastCheckPanel = memo(({ colors, report }: ContrastCheckPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contrastItems = [
    {
      label: '본문 텍스트',
      description: '텍스트 vs 배경',
      fg: colors.text,
      bg: colors.background,
      result: report.textOnBackground,
    },
    {
      label: '메인 버튼',
      description: '흰색 vs 메인 색상',
      fg: '#FFFFFF',
      bg: colors.primary,
      result: report.whiteOnPrimary,
    },
    {
      label: '강조 버튼',
      description: '흰색 vs 강조 색상',
      fg: '#FFFFFF',
      bg: colors.accent,
      result: report.whiteOnAccent,
    },
    {
      label: '보조 배경',
      description: '텍스트 vs 보조 색상',
      fg: colors.text,
      bg: colors.secondary,
      result: report.textOnSecondary,
    },
  ];

  return (
    <Card withBorder radius="md">
      {/* 헤더 */}
      <Card.Section
        p="md"
        bg="gray.0"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              색상 대비 검사
            </Text>
            {report.overallPass ? (
              <Badge size="sm" color="green">
                WCAG AA 통과
              </Badge>
            ) : (
              <Badge size="sm" color="red">
                {report.warnings.length}개 경고
              </Badge>
            )}
          </Group>
          <IconChevronDown
            size={20}
            style={{
              transition: 'transform 0.2s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Group>
      </Card.Section>

      {/* 상세 내용 */}
      <Collapse in={isExpanded}>
        <Stack gap="md" p="md">
          {/* 경고 메시지 */}
          {report.warnings.length > 0 && (
            <Paper
              p="md"
              bg="red.0"
              withBorder
              style={{ borderColor: 'var(--mantine-color-red-3)' }}
            >
              <Text size="sm" fw={500} c="red.8" mb="xs">
                접근성 경고
              </Text>
              <Stack gap={4}>
                {report.warnings.map((warning, index) => (
                  <Text key={index} size="xs" c="red.7">
                    • {warning}
                  </Text>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 대비율 목록 */}
          <Stack gap="xs">
            {contrastItems.map((item, index) => {
              const grade = getContrastGrade(item.result.ratio);
              return (
                <Group key={index} gap="md" p="xs" bg="gray.0" style={{ borderRadius: '8px' }}>
                  {/* 색상 샘플 */}
                  <Group gap={4}>
                    <Box
                      w={24}
                      h={24}
                      style={{
                        borderRadius: '4px',
                        backgroundColor: item.fg,
                        border: '1px solid var(--mantine-color-gray-3)',
                      }}
                      title={`전경색: ${item.fg}`}
                    />
                    <Text size="xs" c="dimmed">
                      on
                    </Text>
                    <Box
                      w={24}
                      h={24}
                      style={{
                        borderRadius: '4px',
                        backgroundColor: item.bg,
                        border: '1px solid var(--mantine-color-gray-3)',
                      }}
                      title={`배경색: ${item.bg}`}
                    />
                  </Group>

                  {/* 설명 */}
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {item.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.description}
                    </Text>
                  </Box>

                  {/* 결과 */}
                  <Box ta="right">
                    <Badge
                      size="sm"
                      style={{
                        backgroundColor: grade.color + '20',
                        color: grade.color,
                      }}
                    >
                      {item.result.ratio}:1
                    </Badge>
                    <Text size="xs" mt={2} style={{ color: grade.color }}>
                      {grade.label}
                    </Text>
                  </Box>
                </Group>
              );
            })}
          </Stack>

          {/* WCAG 기준 안내 */}
          <Box pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              WCAG AA 기준
            </Text>
            <Text size="xs" c="dimmed">
              • 일반 텍스트: 4.5:1 이상
            </Text>
            <Text size="xs" c="dimmed">
              • 큰 텍스트/UI: 3:1 이상
            </Text>
          </Box>
        </Stack>
      </Collapse>
    </Card>
  );
});
