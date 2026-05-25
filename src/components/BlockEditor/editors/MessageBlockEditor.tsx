import { Stack, TextInput, Textarea } from '@mantine/core';
import type { MessageBlockData } from '@camellia-letter/shared-types';

interface MessageBlockEditorProps {
  blockId: string;
  data: MessageBlockData;
  onChange: (data: MessageBlockData) => void;
}

export const MessageBlockEditor = ({ data, onChange }: MessageBlockEditorProps) => {
  const title = data.title || '';
  const content = data.content || '';

  const handleChange = (field: keyof MessageBlockData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="제목"
        value={title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="예: 초대합니다"
        size="sm"
      />
      <Textarea
        label="내용"
        value={content}
        onChange={(e) => handleChange('content', e.target.value)}
        placeholder="인사말을 입력하세요..."
        rows={5}
        size="sm"
        autosize={false}
        styles={{ input: { resize: 'vertical' } }}
      />
    </Stack>
  );
};
