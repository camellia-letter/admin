import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { InvitationBlock, BlockDataByType } from '@camellia/shared-types';
import { DragHandleIcon } from '@/components/ui/icons';
import { getBlockLabel } from '@/utils/blockHelpers';
import { HeroBlockEditor } from '@/components/BlockEditor/editors/HeroBlockEditor';
import { MessageBlockEditor } from '@/components/BlockEditor/editors/MessageBlockEditor';
import { InfoBlockEditor } from '@/components/BlockEditor/editors/InfoBlockEditor';
import { MapBlockEditor } from '@/components/BlockEditor/editors/MapBlockEditor';
import { GalleryBlockEditor } from '@/components/BlockEditor/editors/GalleryBlockEditor';
import { GuestbookBlockEditor } from '@/components/BlockEditor/editors/GuestbookBlockEditor';
import { AccountBlockEditor } from '@/components/BlockEditor/editors/AccountBlockEditor';
import { TransportBlockEditor } from '@/components/BlockEditor/editors/TransportBlockEditor';
import { RsvpBlockEditor } from '@/components/BlockEditor/editors/RsvpBlockEditor';
import { Paper, Flex, Text, ActionIcon, UnstyledButton, Box } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface DraggableBlockProps {
  block: InvitationBlock;
  onUpdate: (data: BlockDataByType[keyof BlockDataByType]) => void;
  onDelete: () => void;
}

export const DraggableBlock = ({ block, onUpdate, onDelete }: DraggableBlockProps) => {
  // BlockEditor에서 block.type을 ID로 사용 (블록 타입당 하나만 존재)
  const sortableId = block.type;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'HERO':
        return <HeroBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'MESSAGE':
        return <MessageBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'INFO':
        return <InfoBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'MAP':
        return <MapBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'GALLERY':
        return <GalleryBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'GUESTBOOK':
        return <GuestbookBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'ACCOUNT':
        return <AccountBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'TRANSPORT':
        return <TransportBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      case 'RSVP':
        return <RsvpBlockEditor blockId={block.id} data={block.data} onChange={onUpdate} />;
      default:
        return <Text c="dimmed">Unknown block type: {(block as { type: string }).type}</Text>;
    }
  };

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="md" shadow="sm" radius="md">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb="md"
        pb="md"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
      >
        <Flex align="center" gap="xs">
          <UnstyledButton
            style={{
              cursor: 'grab',
              color: 'var(--mantine-color-gray-4)',
              touchAction: 'none',
            }}
            {...attributes}
            {...listeners}
          >
            <DragHandleIcon className="w-5 h-5" />
          </UnstyledButton>
          <Text size="sm" fw={600} c="gray.7">
            {getBlockLabel(block.type)}
          </Text>
        </Flex>
        <ActionIcon variant="subtle" color="red" onClick={onDelete} title="블록 삭제">
          <IconTrash size={20} />
        </ActionIcon>
      </Flex>

      {/* Block Editor */}
      <Box>{renderEditor()}</Box>
    </Paper>
  );
};
