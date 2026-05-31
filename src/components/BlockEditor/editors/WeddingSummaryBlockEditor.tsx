import { Alert, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { WeddingSummaryBlockData } from '@camellia-letter/shared-types';

interface WeddingSummaryBlockEditorProps {
  blockId: string;
  data: WeddingSummaryBlockData;
  onChange: (data: WeddingSummaryBlockData) => void;
}

export const WeddingSummaryBlockEditor = (_props: WeddingSummaryBlockEditorProps) => {
  return (
    <Alert color="blue" icon={<IconInfoCircle size={20} />}>
      <Text size="sm" fw={500}>
        자동 표시 블록
      </Text>
      <Text size="sm" mt="xs">
        이 블록은 위의 "기본 정보" 섹션에서 입력한 신랑/신부 이름, 예식 일시, 예식장을 간단히 표시합니다.
        별도로 편집할 필요가 없습니다.
      </Text>
    </Alert>
  );
};
