import { Stack, Text, Paper, Flex, TextInput, ActionIcon, UnstyledButton } from '@mantine/core';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DeleteIcon, DragHandleIcon } from '@/components/ui/icons';
import { ImageUploader } from '@/components/ui/ImageUploader';
import type { GalleryBlockData, GalleryImage } from '@camellia-letter/shared-types';

interface GalleryBlockEditorProps {
  blockId: string;
  data: GalleryBlockData;
  onChange: (data: GalleryBlockData) => void;
}

interface SortableImageItemProps {
  image: GalleryImage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (field: 'url' | 'caption', value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableImageItem = ({
  image,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `gallery-image-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="sm" bg="gray.0">
      <Flex align="flex-start" gap="sm">
        {/* 드래그 핸들 + 이동 버튼 */}
        <Flex direction="column" align="center" gap={2} style={{ paddingTop: '32px' }}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="위로 이동"
          >
            <IconChevronUp size={12} />
          </ActionIcon>
          <UnstyledButton
            style={{
              cursor: 'grab',
              color: 'var(--mantine-color-gray-4)',
              touchAction: 'none',
            }}
            aria-label="드래그하여 순서 변경"
            {...attributes}
            {...listeners}
          >
            <DragHandleIcon className="w-5 h-5" />
          </UnstyledButton>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="아래로 이동"
          >
            <IconChevronDown size={12} />
          </ActionIcon>
        </Flex>

        <Stack style={{ flex: 1 }} gap="xs">
          <ImageUploader
            value={image.url}
            onChange={(url) => onUpdate('url', url)}
            onImageRemove={onRemove}
            folder="gallery"
            label={`이미지 ${index + 1}`}
          />
          <TextInput
            value={image.caption || ''}
            onChange={(e) => onUpdate('caption', e.target.value)}
            placeholder="캡션 (선택)"
            size="sm"
          />
        </Stack>
        <ActionIcon variant="subtle" color="red" onClick={onRemove} title="이미지 삭제" mt="xl">
          <DeleteIcon className="w-5 h-5" />
        </ActionIcon>
      </Flex>
    </Paper>
  );
};

export const GalleryBlockEditor = ({ data, onChange }: GalleryBlockEditorProps) => {
  const images = data.images || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleMultipleImagesUploaded = (urls: string[]) => {
    const newImages = [...images, ...urls.map((url) => ({ url, caption: undefined }))];
    onChange({ ...data, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange({ ...data, images: newImages });
  };

  const handleUpdateImage = (index: number, field: 'url' | 'caption', value: string) => {
    const newImages = images.map((img, i) => {
      if (i === index) {
        return { ...img, [field]: value };
      }
      return img;
    });
    onChange({ ...data, images: newImages });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) {return;}
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, removed);
    onChange({ ...data, images: newImages });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = images.findIndex((_, i) => `gallery-image-${i}` === active.id);
    const overIndex = images.findIndex((_, i) => `gallery-image-${i}` === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newImages = [...images];
      const [removed] = newImages.splice(activeIndex, 1);
      newImages.splice(overIndex, 0, removed);
      onChange({ ...data, images: newImages });
    }
  };

  return (
    <Stack gap="md">
      {/* Existing Images */}
      {images.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            갤러리 이미지 ({images.length}개)
          </Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((_, index) => `gallery-image-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {images.map((image, index) => (
                  <SortableImageItem
                    key={`gallery-image-${index}`}
                    image={image}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === images.length - 1}
                    onUpdate={(field, value) => handleUpdateImage(index, field, value)}
                    onRemove={() => handleRemoveImage(index)}
                    onMoveUp={() => handleMove(index, -1)}
                    onMoveDown={() => handleMove(index, 1)}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      )}

      {/* Add New Images (Multiple Upload) */}
      <Paper withBorder p="md" bg="white">
        <Text size="sm" fw={500} mb="sm">
          새 이미지 추가 (여러 장 선택 가능)
        </Text>
        <ImageUploader
          multiple={true}
          onMultipleChange={handleMultipleImagesUploaded}
          folder="gallery"
          label=""
          maxFiles={10}
        />
      </Paper>

      {images.length === 0 && (
        <Text size="sm" c="dimmed" ta="center" py="md">
          아직 추가된 이미지가 없습니다
        </Text>
      )}
    </Stack>
  );
};
