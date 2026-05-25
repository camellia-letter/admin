import { Stack, TextInput } from '@mantine/core';
import type { HeroBlockData } from '@camellia-letter/shared-types';
import { ImageUploader } from '@/components/ui/ImageUploader';

interface HeroBlockEditorProps {
  blockId: string;
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
}

export const HeroBlockEditor = ({ data, onChange }: HeroBlockEditorProps) => {
  const imageUrl = data.imageUrl || '';
  const altText = data.altText || '';

  const handleChange = (field: keyof HeroBlockData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack gap="md">
      <ImageUploader
        value={imageUrl}
        onChange={(url) => handleChange('imageUrl', url)}
        onImageRemove={() => handleChange('imageUrl', '')}
        folder="hero"
        label="메인 이미지 *"
      />

      <TextInput
        label="대체 텍스트 (선택)"
        value={altText}
        onChange={(e) => handleChange('altText', e.target.value)}
        placeholder="메인 이미지"
        size="sm"
        description="스크린 리더를 위한 이미지 설명"
      />
    </Stack>
  );
};
