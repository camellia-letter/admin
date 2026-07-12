import { Stack, TextInput, Textarea } from '@mantine/core';
import type { SnapUploadBlockData } from '@camellia-letter/shared-types';

interface SnapUploadBlockEditorProps {
  blockId: string;
  data: SnapUploadBlockData;
  onChange: (data: SnapUploadBlockData) => void;
}

export const SnapUploadBlockEditor = ({ data, onChange }: SnapUploadBlockEditorProps) => {
  return (
    <Stack gap="md">
      <TextInput
        label="제목"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.currentTarget.value })}
        placeholder="스냅 업로드"
      />
      <Textarea
        label="설명"
        value={data.description || ''}
        onChange={(e) => onChange({ ...data, description: e.currentTarget.value })}
        placeholder="하객들이 촬영한 사진을 업로드할 수 있습니다."
        minRows={3}
      />
    </Stack>
  );
};
