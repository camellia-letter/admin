import type { BlockType } from '@/types/invitation';
import { Menu, Button, Group, Text, Box } from '@mantine/core';
import { IconPlus, IconChevronDown } from '@tabler/icons-react';
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
} from '@/components/ui/icons';
import { getBlockLabel, getBlockDescription } from '@/utils/blockHelpers';

interface AddBlockMenuProps {
  onAddBlock: (type: BlockType) => void;
}

const blockTypes: BlockType[] = [
  'HEADER',
  'HERO',
  'MESSAGE',
  'INFO',
  'PARENTS',
  'MAP',
  'GALLERY',
  'GUESTBOOK',
  'ACCOUNT',
  'TRANSPORT',
  'RSVP',
];

const blockIcons: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  HEADER: HeaderIcon,
  HERO: ImageIcon,
  MESSAGE: TextIcon,
  INFO: InfoIcon,
  PARENTS: ParentsIcon,
  MAP: MapIcon,
  GALLERY: GalleryIcon,
  GUESTBOOK: GuestbookIcon,
  ACCOUNT: AccountIcon,
  TRANSPORT: TransportIcon,
  RSVP: RsvpIcon,
};

export const AddBlockMenu = ({ onAddBlock }: AddBlockMenuProps) => {
  return (
    <Menu position="top" withArrow>
      <Menu.Target>
        <Button
          fullWidth
          color="blue"
          rightSection={<IconChevronDown size={16} />}
          leftSection={<IconPlus size={20} />}
        >
          블록 추가
        </Button>
      </Menu.Target>

      <Menu.Dropdown style={{ maxHeight: 384, overflowY: 'auto', width: 320 }}>
        {blockTypes.map((type) => {
          const Icon = blockIcons[type];
          return (
            <Menu.Item key={type} onClick={() => onAddBlock(type)}>
              <Group wrap="nowrap" gap="sm">
                <Box style={{ color: 'var(--mantine-color-gray-6)', flexShrink: 0 }}>
                  <Icon className="w-5 h-5" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500}>
                    {getBlockLabel(type)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {getBlockDescription(type)}
                  </Text>
                </Box>
              </Group>
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};
