import { Stack, Text, TextInput, Paper, Flex } from '@mantine/core';
import type { ParentsBlockData } from '@camellia/shared-types';

interface ParentsBlockEditorProps {
  blockId: string;
  data: ParentsBlockData;
  onChange: (data: ParentsBlockData) => void;
}

export const ParentsBlockEditor = ({ data, onChange }: ParentsBlockEditorProps) => {
  const blockData: ParentsBlockData = {
    groomFatherName: data.groomFatherName || '',
    groomMotherName: data.groomMotherName || '',
    brideFatherName: data.brideFatherName || '',
    brideMotherName: data.brideMotherName || '',
  };

  const handleChange = (field: keyof ParentsBlockData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const renderParentSection = (side: 'groom' | 'bride', fatherName: string, motherName: string) => {
    const sideLabel = side === 'groom' ? '신랑' : '신부';
    const bgColor =
      side === 'groom' ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-pink-0)';
    const borderColor =
      side === 'groom' ? 'var(--mantine-color-blue-2)' : 'var(--mantine-color-pink-2)';

    const fatherField = side === 'groom' ? 'groomFatherName' : 'brideFatherName';
    const motherField = side === 'groom' ? 'groomMotherName' : 'brideMotherName';

    return (
      <Paper p="md" withBorder style={{ backgroundColor: bgColor, borderColor }}>
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            {sideLabel}측 부모님
          </Text>
          <Flex gap="md">
            <TextInput
              label="아버지 성함"
              value={fatherName}
              onChange={(e) => handleChange(fatherField, e.target.value)}
              placeholder="예: 홍길동"
              style={{ flex: 1 }}
            />
            <TextInput
              label="어머니 성함"
              value={motherName}
              onChange={(e) => handleChange(motherField, e.target.value)}
              placeholder="예: 김영희"
              style={{ flex: 1 }}
            />
          </Flex>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        양가 부모님 성함을 입력하세요. 입력하지 않은 항목은 표시되지 않습니다.
      </Text>

      {renderParentSection(
        'groom',
        blockData.groomFatherName || '',
        blockData.groomMotherName || '',
      )}

      {renderParentSection(
        'bride',
        blockData.brideFatherName || '',
        blockData.brideMotherName || '',
      )}
    </Stack>
  );
};
