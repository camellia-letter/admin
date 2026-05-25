import { Alert, Text } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import type { GuestbookBlockData } from '@camellia/shared-types';

interface GuestbookBlockEditorProps {
  blockId: string;
  data: GuestbookBlockData;
  onChange: (data: GuestbookBlockData) => void;
}

export const GuestbookBlockEditor = (_props: GuestbookBlockEditorProps) => {
  return (
    <Alert color="violet" icon={<IconBook size={20} />}>
      <Text size="sm" fw={500}>
        방명록 블록
      </Text>
      <Text size="sm" mt="xs">
        이 블록은 청첩장을 방문한 하객들이 축하 메시지를 남길 수 있는 방명록을 표시합니다. 방명록
        내용은 별도로 관리됩니다.
      </Text>
      <Text size="xs" c="dimmed" mt="xs">
        ※ 방명록 기능은 향후 구현 예정입니다
      </Text>
    </Alert>
  );
};
