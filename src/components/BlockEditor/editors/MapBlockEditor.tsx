import { Alert, Text } from '@mantine/core';
import { IconMap } from '@tabler/icons-react';
import type { MapBlockData } from '@camellia/shared-types';

interface MapBlockEditorProps {
  blockId: string;
  data: MapBlockData;
  onChange: (data: MapBlockData) => void;
}

export const MapBlockEditor = (_props: MapBlockEditorProps) => {
  return (
    <Alert color="green" icon={<IconMap size={20} />}>
      <Text size="sm" fw={500}>
        자동 표시 블록
      </Text>
      <Text size="sm" mt="xs">
        이 블록은 위의 "기본 정보" 섹션에서 입력한 예식장 이름과 주소를 자동으로 표시합니다. 지도
        링크도 함께 제공됩니다.
      </Text>
    </Alert>
  );
};
