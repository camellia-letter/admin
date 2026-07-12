import { Alert, Text, Checkbox } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { HeaderBlockData } from '@camellia-letter/shared-types';

interface HeaderBlockEditorProps {
  blockId: string;
  data: HeaderBlockData;
  onChange: (data: HeaderBlockData) => void;
}

export const HeaderBlockEditor = ({ data, onChange }: HeaderBlockEditorProps) => {
  return (
    <>
      <Alert color="blue" icon={<IconInfoCircle size={20} />} mb="md">
        <Text size="sm" fw={500}>
          헤더 블록
        </Text>
        <Text size="sm" mt="xs">
          이 블록은 신랑/신부 이름을 헤더 형식으로 표시합니다.
        </Text>
      </Alert>
      <Checkbox
        label="타이틀 표시"
        checked={data.showTitle ?? true}
        onChange={(e) => onChange({ ...data, showTitle: e.currentTarget.checked })}
      />
    </>
  );
};
