import { Alert, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { InfoBlockData } from '@camellia-letter/shared-types';

interface InfoBlockEditorProps {
  blockId: string;
  data: InfoBlockData;
  onChange: (data: InfoBlockData) => void;
}

export const InfoBlockEditor = (_props: InfoBlockEditorProps) => {
  return (
    <Alert color="blue" icon={<IconInfoCircle size={20} />}>
      <Text size="sm" fw={500}>
        자동 표시 블록
      </Text>
      <Text size="sm" mt="xs">
        이 블록은 위의 "기본 정보" 섹션에서 입력한 신랑/신부 이름, 예식 일시를 자동으로 표시합니다.
        별도로 편집할 필요가 없습니다.
      </Text>
    </Alert>
  );
};
