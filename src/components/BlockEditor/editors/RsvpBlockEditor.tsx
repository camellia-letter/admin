import { Stack, Text, TextInput, Textarea, Checkbox } from '@mantine/core';
import type { RsvpBlockData } from '@/types/invitation';

interface RsvpBlockEditorProps {
  blockId: string;
  data: RsvpBlockData;
  onChange: (data: RsvpBlockData) => void;
}

export const RsvpBlockEditor = ({ data, onChange }: RsvpBlockEditorProps) => {
  const blockData: RsvpBlockData = {
    title: data.title || '참석 여부',
    description: data.description || '참석 여부를 알려주세요.',
    deadline: data.deadline || '',
    showMealOption: data.showMealOption ?? false,
    showGuestCount: data.showGuestCount ?? true,
  };

  const handleChange = (field: keyof RsvpBlockData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        하객들의 참석 여부를 수집할 수 있습니다. 응답 내역은 에디터 하단에서 확인하세요.
      </Text>

      <TextInput
        label="섹션 제목"
        value={blockData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="참석 여부"
        size="sm"
      />

      <Textarea
        label="안내 문구"
        value={blockData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="참석 여부를 알려주세요."
        rows={2}
        size="sm"
        autosize={false}
      />

      <TextInput
        type="date"
        label="응답 마감일 (선택)"
        value={blockData.deadline ? blockData.deadline.split('T')[0] : ''}
        onChange={(e) =>
          handleChange('deadline', e.target.value ? new Date(e.target.value).toISOString() : '')
        }
        size="sm"
      />

      <Stack gap="sm" pt="xs">
        <Checkbox
          label="동반 인원 입력 받기"
          checked={blockData.showGuestCount}
          onChange={(e) => handleChange('showGuestCount', e.currentTarget.checked)}
          size="sm"
        />

        <Checkbox
          label="식사 옵션 선택 (일반식/채식)"
          checked={blockData.showMealOption}
          onChange={(e) => handleChange('showMealOption', e.currentTarget.checked)}
          size="sm"
        />
      </Stack>
    </Stack>
  );
};
