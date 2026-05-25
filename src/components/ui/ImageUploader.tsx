import { useState } from 'react';
import { Button, Group, Text, Box } from '@mantine/core';
import { IconUpload, IconX, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import apiClient from '@/api/client';

interface ImageUploaderProps {
  value?: string;
  currentImage?: string;
  onChange?: (url: string) => void;
  onImageSelect?: (url: string) => void;
  onImageRemove?: () => void;
  multiple?: boolean;
  values?: string[];
  onMultipleChange?: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxFiles?: number;
}

interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export const ImageUploader = ({
  value,
  currentImage,
  onChange,
  onImageSelect,
  onImageRemove,
  multiple,
  values,
  onMultipleChange,
  folder,
  label,
  maxFiles,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const imageUrl = value || currentImage;
  const handleChange = onChange || onImageSelect;

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/api/storage/upload/image', formData, {
      params: folder ? { folder } : undefined,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple && onMultipleChange) {
        const uploadPromises = Array.from(files).map((file) => uploadFile(file));

        const urls = await Promise.all(uploadPromises);
        const currentUrls = values || [];
        onMultipleChange([...currentUrls, ...urls]);
      } else {
        const file = files[0];
        const url = await uploadFile(file);
        if (handleChange) {
          handleChange(url);
        }
      }
    } catch {
      // Error silently handled - uploading state will be reset
    } finally {
      setUploading(false);
    }
  };

  const moveUp = (index: number) => {
    if (!values || !onMultipleChange || index === 0) return;

    const newValues = [...values];
    [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
    onMultipleChange(newValues);
  };

  const moveDown = (index: number) => {
    if (!values || !onMultipleChange || index === values.length - 1) return;

    const newValues = [...values];
    [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
    onMultipleChange(newValues);
  };

  const removeImage = (index: number) => {
    if (!values || !onMultipleChange) return;

    const newValues = values.filter((_, i) => i !== index);
    onMultipleChange(newValues);
  };

  return (
    <Box>
      {multiple && values && values.length > 0 ? (
        <Box>
          {values.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              mb="md"
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  maxHeight: '300px',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              />
              <Group gap="xs">
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconArrowUp size={14} />}
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  위로
                </Button>
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconArrowDown size={14} />}
                  onClick={() => moveDown(index)}
                  disabled={index === values.length - 1}
                >
                  아래로
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  leftSection={<IconX size={14} />}
                  onClick={() => removeImage(index)}
                >
                  제거
                </Button>
              </Group>
            </Box>
          ))}
          <Box mt="md">
            <label htmlFor="image-upload">
              <Button
                component="span"
                variant="light"
                leftSection={<IconUpload size={16} />}
                loading={uploading}
              >
                {label || '이미지 추가'}
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Text size="xs" c="dimmed" mt="xs">
              JPG, PNG, GIF 형식 지원{maxFiles ? ` (최대 ${maxFiles}개)` : ''}
            </Text>
          </Box>
        </Box>
      ) : imageUrl ? (
        <Box>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              maxWidth: '100%',
              width: '100%',
              maxHeight: '400px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          />
          <Group>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconX size={14} />}
              onClick={onImageRemove}
              disabled={!onImageRemove}
            >
              제거
            </Button>
          </Group>
        </Box>
      ) : (
        <Box>
          <label htmlFor="image-upload">
            <Button
              component="span"
              variant="light"
              leftSection={<IconUpload size={16} />}
              loading={uploading}
            >
              {label || '이미지 업로드'}
            </Button>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Text size="xs" c="dimmed" mt="xs">
            JPG, PNG, GIF 형식 지원{maxFiles ? ` (최대 ${maxFiles}개)` : ''}
          </Text>
        </Box>
      )}
    </Box>
  );
};
