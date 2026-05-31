import { memo } from 'react';
import { Paper, UnstyledButton, Flex, Text, Box } from '@mantine/core';
import type { InvitationBlock, BlockDataByType, BlockType } from '@camellia-letter/shared-types';
import { ChevronDownIcon } from '@/components/ui/icons';
import { getBlockLabel } from '@/utils/blockHelpers';
import { HeroBlockEditor } from '@/components/BlockEditor/editors/HeroBlockEditor';
<<<<<<< HEAD
=======
import { WeddingSummaryBlockEditor } from '@/components/BlockEditor/editors/WeddingSummaryBlockEditor';
>>>>>>> be29520 (Feature(apps-admin): WEDDING_SUMMARY 블록 추가)
import { MessageBlockEditor } from '@/components/BlockEditor/editors/MessageBlockEditor';
import { InfoBlockEditor } from '@/components/BlockEditor/editors/InfoBlockEditor';
import { MapBlockEditor } from '@/components/BlockEditor/editors/MapBlockEditor';
import { GalleryBlockEditor } from '@/components/BlockEditor/editors/GalleryBlockEditor';
import { GuestbookBlockEditor } from '@/components/BlockEditor/editors/GuestbookBlockEditor';
import { AccountBlockEditor } from '@/components/BlockEditor/editors/AccountBlockEditor';
import { TransportBlockEditor } from '@/components/BlockEditor/editors/TransportBlockEditor';
import { RsvpBlockEditor } from '@/components/BlockEditor/editors/RsvpBlockEditor';
import { ParentsBlockEditor } from '@/components/BlockEditor/editors/ParentsBlockEditor';

interface BlockEditPanelProps {
  block: InvitationBlock;
  isExpanded?: boolean;
  onToggleExpanded?: (type: BlockType) => void;
  onUpdate: (type: BlockType, data: BlockDataByType[keyof BlockDataByType]) => void;
}

function BlockEditPanelComponent({
  block,
  isExpanded = true,
  onToggleExpanded,
  onUpdate,
}: BlockEditPanelProps) {
  // 각 에디터에 전달할 핸들러 (block.type을 curry)
  const handleDataChange = (data: BlockDataByType[keyof BlockDataByType]) => {
    onUpdate(block.type, data);
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'HERO':
        return <HeroBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />;
<<<<<<< HEAD
=======
      case 'WEDDING_SUMMARY':
        return <WeddingSummaryBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />;
>>>>>>> be29520 (Feature(apps-admin): WEDDING_SUMMARY 블록 추가)
      case 'MESSAGE':
        return (
          <MessageBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'INFO':
        return <InfoBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />;
      case 'PARENTS':
        return (
          <ParentsBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'MAP':
        return <MapBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />;
      case 'GALLERY':
        return (
          <GalleryBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'GUESTBOOK':
        return (
          <GuestbookBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'ACCOUNT':
        return (
          <AccountBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'TRANSPORT':
        return (
          <TransportBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />
        );
      case 'RSVP':
        return <RsvpBlockEditor blockId={block.id} data={block.data} onChange={handleDataChange} />;
      default:
        return <div>Unknown block type: {(block as { type: string }).type}</div>;
    }
  };

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded(block.type);
    }
  };

  return (
    <Paper withBorder radius="md" shadow="sm" style={{ overflow: 'hidden' }}>
      {/* Header - 접기/펼치기 가능 */}
      <UnstyledButton
        w="100%"
        p="md"
        onClick={handleToggle}
        style={(theme) => ({
          '&:hover': { backgroundColor: theme.colors.gray[0] },
          transition: 'background-color 0.2s',
        })}
      >
        <Flex justify="space-between" align="center">
          <Text size="sm" fw={600}>
            {getBlockLabel(block.type)}
          </Text>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Flex>
      </UnstyledButton>

      {/* Content */}
      {isExpanded && (
        <Box px="md" pb="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Box pt="md">{renderEditor()}</Box>
        </Box>
      )}
    </Paper>
  );
}

// React.memo로 감싸서 export (리렌더링 최적화)
export const BlockEditPanel = memo(BlockEditPanelComponent);

// 디버깅을 위한 displayName
BlockEditPanel.displayName = 'BlockEditPanel';
