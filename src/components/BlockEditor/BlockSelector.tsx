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
import type { BlockType } from '@camellia-letter/shared-types';
import {
  HeaderIcon,
  ImageIcon,
  TextIcon,
  InfoIcon,
  MapIcon,
  GalleryIcon,
  GuestbookIcon,
  AccountIcon,
  TransportIcon,
  RsvpIcon,
  ParentsIcon,
  DragHandleIcon,
  CameraIcon,
} from '@/components/ui/icons';
import { getBlockLabel, getBlockDescription } from '@/utils/blockHelpers';
import { Stack, Paper, Flex, Text, Switch, ActionIcon, UnstyledButton } from '@mantine/core';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface BlockSelectorProps {
  enabledBlocks: Set<BlockType>;
  blockOrder: BlockType[];
  onToggle: (type: BlockType) => void;
  onReorder: (newOrder: BlockType[]) => void;
}

const ALL_BLOCK_TYPES: BlockType[] = [
  'HEADER',
  'HERO',
  'WEDDING_SUMMARY',
  'MESSAGE',
  'INFO',
  'PARENTS',
  'MAP',
  'GALLERY',
  'GUESTBOOK',
  'ACCOUNT',
  'TRANSPORT',
  'RSVP',
  'SNAP_UPLOAD',
];

const blockIcons: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  HEADER: HeaderIcon,
  HERO: ImageIcon,
  WEDDING_SUMMARY: InfoIcon,
  MESSAGE: TextIcon,
  INFO: InfoIcon,
  PARENTS: ParentsIcon,
  MAP: MapIcon,
  GALLERY: GalleryIcon,
  GUESTBOOK: GuestbookIcon,
  ACCOUNT: AccountIcon,
  TRANSPORT: TransportIcon,
  RSVP: RsvpIcon,
  SNAP_UPLOAD: CameraIcon,
};

interface SortableBlockItemProps {
  type: BlockType;
  isEnabled: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SortableBlockItem = ({
  type,
  isEnabled,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableBlockItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: type,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const Icon = blockIcons[type];
  const label = getBlockLabel(type);

  const bgColor = isEnabled ? 'var(--mantine-color-pink-0)' : 'white';
  const borderColor = isEnabled ? 'var(--mantine-color-pink-5)' : 'var(--mantine-color-gray-2)';
  const iconBgColor = isEnabled ? 'var(--mantine-color-pink-1)' : 'var(--mantine-color-gray-1)';
  const iconColor = isEnabled ? 'var(--mantine-color-pink-6)' : 'var(--mantine-color-gray-5)';

  return (
    <Paper
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: bgColor,
        borderColor,
        borderWidth: 2,
        borderStyle: 'solid',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      p="md"
      radius="md"
    >
      <Flex align="center" gap="md">
        {/* 드래그 핸들 + 이동 버튼 */}
        <Flex direction="column" align="center" gap={2}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label={`${label} 위로 이동`}
          >
            <IconChevronUp size={12} />
          </ActionIcon>
          <UnstyledButton
            style={{
              cursor: 'grab',
              color: 'var(--mantine-color-gray-4)',
              touchAction: 'none',
            }}
            aria-label={`${label} 드래그하여 순서 변경`}
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
            aria-label={`${label} 아래로 이동`}
          >
            <IconChevronDown size={12} />
          </ActionIcon>
        </Flex>

        {/* 아이콘 */}
        <Flex
          w={40}
          h={40}
          align="center"
          justify="center"
          style={{
            backgroundColor: iconBgColor,
            borderRadius: 'var(--mantine-radius-md)',
            flexShrink: 0,
            color: iconColor,
          }}
        >
          <Icon className="w-5 h-5" />
        </Flex>

        {/* 라벨 */}
        <Flex direction="column" style={{ flex: 1, minWidth: 0 }} gap={2}>
          <Text size="sm" fw={500} c={isEnabled ? 'pink.7' : 'gray.7'}>
            {label}
          </Text>
          <Text size="xs" c="dimmed" truncate="end">
            {getBlockDescription(type)}
          </Text>
        </Flex>

        {/* 토글 스위치 */}
        <Switch
          checked={isEnabled}
          onChange={onToggle}
          color="pink"
          aria-label={`${label} ${isEnabled ? '비활성화' : '활성화'}`}
        />
      </Flex>
    </Paper>
  );
};

export const BlockSelector = ({
  enabledBlocks,
  blockOrder,
  onToggle,
  onReorder,
}: BlockSelectorProps) => {
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

  // blockOrder에 없는 블록은 끝에 추가
  const orderedTypes = [...blockOrder];
  ALL_BLOCK_TYPES.forEach((type) => {
    if (!orderedTypes.includes(type)) {
      orderedTypes.push(type);
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeType = active.id as BlockType;
    const overType = over.id as BlockType;

    const oldIndex = orderedTypes.indexOf(activeType);
    const newIndex = orderedTypes.indexOf(overType);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = [...orderedTypes];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      onReorder(newOrder);
    }
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedTypes.length) {return;}
    const newOrder = [...orderedTypes];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, removed);
    onReorder(newOrder);
  };

  return (
    <Stack gap="xs">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedTypes} strategy={verticalListSortingStrategy}>
          <Stack gap="xs">
            {orderedTypes.map((type, index) => (
              <SortableBlockItem
                key={type}
                type={type}
                isEnabled={enabledBlocks.has(type)}
                onToggle={() => onToggle(type)}
                onMoveUp={() => handleMove(index, -1)}
                onMoveDown={() => handleMove(index, 1)}
                isFirst={index === 0}
                isLast={index === orderedTypes.length - 1}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </Stack>
  );
};
