import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { InvitationBlock, BlockDataByType } from '@camellia/shared-types';
import { DraggableBlock } from './DraggableBlock';
import { Stack, Paper, Center, Text } from '@mantine/core';

interface BlockListProps {
  blocks: InvitationBlock[];
  onUpdateBlock: (id: string, data: BlockDataByType[keyof BlockDataByType]) => void;
  onDeleteBlock: (id: string) => void;
}

export const BlockList = ({ blocks, onUpdateBlock, onDeleteBlock }: BlockListProps) => {
  if (blocks.length === 0) {
    return (
      <Paper
        p="xl"
        withBorder
        radius="md"
        style={{ borderStyle: 'dashed', borderWidth: 2 }}
        bg="gray.0"
      >
        <Center>
          <Stack gap="xs" align="center">
            <Text c="dimmed">아직 추가된 블록이 없습니다</Text>
            <Text size="sm" c="dimmed">
              아래 "블록 추가" 버튼을 클릭하여 청첩장을 구성하세요
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
      <Stack gap="md">
        {blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            onUpdate={(data) => onUpdateBlock(block.id, data)}
            onDelete={() => onDeleteBlock(block.id)}
          />
        ))}
      </Stack>
    </SortableContext>
  );
};
