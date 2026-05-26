import { useState, useEffect, useCallback, useRef } from 'react';
import type { InvitationBlock, BlockType, BlockDataByType } from '@camellia-letter/shared-types';
import { BlockSelector } from './BlockSelector';
import { BlockEditPanel } from './BlockEditPanel';
import { createDefaultBlock } from '@/utils/blockHelpers';
import { useBlockHistory, useUndoRedoShortcuts } from '@/hooks/useBlockHistory';
import { useBlockTemplates, type BlockTemplate } from '@/hooks/useBlockTemplates';
import { useToast } from '@/hooks/useNotifications';
import { AppAlertDialog } from '@/components/ui/AppAlertDialog';
import {
  Stack,
  Group,
  Button,
  Text,
  Paper,
  TextInput,
  ActionIcon,
  Title,
  Center,
  Modal,
  Box,
} from '@mantine/core';
import {
  IconArrowBack,
  IconArrowForward,
  IconChevronUp,
  IconChevronDown,
  IconDeviceFloppy,
  IconFolder,
  IconTrash,
} from '@tabler/icons-react';

interface BlockEditorProps {
  blocks: InvitationBlock[];
  onChange: (blocks: InvitationBlock[]) => void;
}

// 블록 데이터 타입
type BlockDataMap = Partial<BlockDataByType>;

export const BlockEditor = ({ blocks, onChange }: BlockEditorProps) => {
  // 템플릿 관리
  const { templates, saveTemplate, deleteTemplate } = useBlockTemplates();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const { addToast } = useToast();

  // 활성화된 블록 타입들
  const [enabledBlocks, setEnabledBlocks] = useState<Set<BlockType>>(() => {
    return new Set(blocks.map((b) => b.type));
  });

  // 각 블록의 데이터 (토글 OFF해도 데이터 유지)
  const [blockData, setBlockData] = useState<BlockDataMap>(() => {
    const data: BlockDataMap = {};
    blocks.forEach((block) => {
      // 동적 key 할당은 TS correlated type 한계로 assertion 필요
      (data as Record<string, unknown>)[block.type] = block.data;
    });
    return data;
  });

  // 블록 순서 (모든 블록의 타입 순서)
  const [blockOrder, setBlockOrder] = useState<BlockType[]>(() => {
    // 기존 블록 순서 + 나머지 블록 타입
    const existingOrder = blocks.map((b) => b.type);
    const allTypes: BlockType[] = [
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
    allTypes.forEach((type) => {
      if (!existingOrder.includes(type)) {
        existingOrder.push(type);
      }
    });
    return existingOrder;
  });

  // 전체 접기/펼치기 상태
  const [allExpanded, setAllExpanded] = useState(true);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<BlockType>>(() => {
    return new Set(blocks.map((b) => b.type));
  });

  // Undo/Redo 히스토리
  const isRestoringRef = useRef(false);
  const restoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pushState, undo, redo, canUndo, canRedo } = useBlockHistory({
    enabledBlocks: Array.from(enabledBlocks),
    blockData,
    blockOrder,
  });

  // 외부 업데이트 추적용 ref
  const isExternalUpdateRef = useRef(false);
  const prevBlocksRef = useRef(blocks);

  // blocks prop이 변경될 때 상태 동기화 (외부 업데이트만)
  useEffect(() => {
    // 자체 onChange로 인한 변경은 무시
    if (prevBlocksRef.current === blocks) return;
    prevBlocksRef.current = blocks;

    isExternalUpdateRef.current = true;

    const newEnabledBlocks = new Set(blocks.map((b) => b.type));
    const newBlockData: BlockDataMap = {};
    blocks.forEach((block) => {
      (newBlockData as Record<string, unknown>)[block.type] = block.data;
    });

    setEnabledBlocks(newEnabledBlocks);
    setBlockData((prev) => ({ ...prev, ...newBlockData }));

    // 순서 업데이트 (기존 블록 순서 유지)
    setBlockOrder((prev) => {
      const existingOrder = blocks.map((b) => b.type);
      const newOrder = [...existingOrder];
      prev.forEach((type) => {
        if (!newOrder.includes(type)) {
          newOrder.push(type);
        }
      });
      return newOrder;
    });

    // 다음 틱에서 플래그 리셋
    requestAnimationFrame(() => {
      isExternalUpdateRef.current = false;
    });
  }, [blocks]);

  // 활성화된 블록만 InvitationBlock 배열로 변환
  const buildBlocks = useCallback((): InvitationBlock[] => {
    const orderedTypes = blockOrder.filter((type) => enabledBlocks.has(type));

    return orderedTypes.map(
      (type, index) =>
        ({
          id: `block-${type}`,
          type,
          order: index,
          data: blockData[type] || createDefaultBlock(type, index).data,
        }) as InvitationBlock,
    );
  }, [enabledBlocks, blockData, blockOrder]);

  // 상태 변경 시 onChange 호출 (외부 업데이트 시에는 호출하지 않음)
  useEffect(() => {
    if (isExternalUpdateRef.current) return;

    const newBlocks = buildBlocks();
    prevBlocksRef.current = newBlocks;
    onChange(newBlocks);
  }, [enabledBlocks, blockData, blockOrder]);

  // 상태를 히스토리에 저장
  const saveToHistory = useCallback(() => {
    if (isRestoringRef.current) return;

    pushState({
      enabledBlocks: Array.from(enabledBlocks),
      blockData,
      blockOrder,
    });
  }, [enabledBlocks, blockData, blockOrder, pushState]);

  // Undo 핸들러
  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      isRestoringRef.current = true;
      setEnabledBlocks(new Set(prevState.enabledBlocks));
      setBlockData(prevState.blockData);
      setBlockOrder(prevState.blockOrder);
      if (restoreTimeoutRef.current) clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
  }, [undo]);

  // Redo 핸들러
  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      isRestoringRef.current = true;
      setEnabledBlocks(new Set(nextState.enabledBlocks));
      setBlockData(nextState.blockData);
      setBlockOrder(nextState.blockOrder);
      if (restoreTimeoutRef.current) clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
  }, [redo]);

  // 키보드 단축키 등록
  useUndoRedoShortcuts(handleUndo, handleRedo, canUndo, canRedo);

  // 전체 접기/펼치기
  const handleToggleAllExpanded = () => {
    const newExpanded = !allExpanded;
    setAllExpanded(newExpanded);
    if (newExpanded) {
      setExpandedBlocks(new Set(enabledBlocks));
    } else {
      setExpandedBlocks(new Set());
    }
  };

  // 개별 블록 접기/펼치기 상태 변경
  const handleToggleBlockExpanded = useCallback((type: BlockType) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // 블록 토글
  const handleToggle = (type: BlockType) => {
    // 히스토리 저장
    saveToHistory();

    setEnabledBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
        // 새로 활성화된 블록에 기본 데이터가 없으면 생성
        if (!blockData[type]) {
          setBlockData(
            (prevData) =>
              ({ ...prevData, [type]: createDefaultBlock(type, 0).data }) as BlockDataMap,
          );
        }
        // 새로 활성화된 블록은 펼침 상태로
        setExpandedBlocks((prevExpanded) => new Set([...prevExpanded, type]));
      }
      return next;
    });
  };

  // 블록 순서 변경
  const handleReorder = (newOrder: BlockType[]) => {
    // 히스토리 저장
    saveToHistory();
    setBlockOrder(newOrder);
  };

  // 블록 데이터 업데이트 (debounce 적용을 위해 히스토리는 별도 처리)
  const handleUpdateBlock = useCallback((type: BlockType, data: BlockDataByType[BlockType]) => {
    setBlockData((prev) => ({ ...prev, [type]: data }) as BlockDataMap);
  }, []);

  // 데이터 변경 시 히스토리 저장 (debounced)
  const saveHistoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleUpdateBlockWithHistory = useCallback(
    (type: BlockType, data: BlockDataByType[BlockType]) => {
      // 기존 타임아웃 취소
      if (saveHistoryTimeoutRef.current) {
        clearTimeout(saveHistoryTimeoutRef.current);
      }

      // 데이터 업데이트
      handleUpdateBlock(type, data);

      // 1초 후 히스토리 저장 (타이핑 중에는 저장하지 않음)
      saveHistoryTimeoutRef.current = setTimeout(() => {
        saveToHistory();
      }, 1000);
    },
    [handleUpdateBlock, saveToHistory],
  );

  // 활성화된 블록들을 순서대로 가져오기
  const getOrderedEnabledBlocks = (): InvitationBlock[] => {
    const orderedTypes = blockOrder.filter((type) => enabledBlocks.has(type));

    return orderedTypes.map(
      (type, index) =>
        ({
          id: type,
          type,
          order: index,
          data: blockData[type] || createDefaultBlock(type, index).data,
        }) as InvitationBlock,
    );
  };

  const orderedBlocks = getOrderedEnabledBlocks();

  // 템플릿 저장
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      addToast('warning', '템플릿 이름을 입력해주세요.');
      return;
    }
    saveTemplate(
      templateName.trim(),
      Array.from(enabledBlocks),
      blockData as Record<string, Record<string, unknown>>,
      blockOrder,
    );
    setTemplateName('');
    setShowTemplateModal(false);
    addToast('success', '템플릿이 저장되었습니다.');
  };

  // 템플릿 불러오기
  const handleLoadTemplate = (template: BlockTemplate) => {
    saveToHistory();
    isRestoringRef.current = true;
    setEnabledBlocks(new Set(template.enabledBlocks));
    setBlockData(template.blockData);
    setBlockOrder(template.blockOrder);
    setExpandedBlocks(new Set(template.enabledBlocks));
    setShowTemplateList(false);
    if (restoreTimeoutRef.current) clearTimeout(restoreTimeoutRef.current);
    restoreTimeoutRef.current = setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  };

  // 템플릿 삭제
  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTemplateId(id);
  };

  const handleConfirmDeleteTemplate = () => {
    if (!deleteTemplateId) return;
    deleteTemplate(deleteTemplateId);
  };

  return (
    <Stack gap="lg">
      {/* 템플릿 버튼 */}
      <Group justify="flex-end">
        <Button
          variant="default"
          size="sm"
          leftSection={<IconFolder size={16} />}
          onClick={() => setShowTemplateList(true)}
        >
          템플릿 불러오기
        </Button>
        <Button
          size="sm"
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={() => setShowTemplateModal(true)}
          disabled={enabledBlocks.size === 0}
        >
          템플릿 저장
        </Button>
      </Group>

      {/* 블록 선택 영역 (1열 + 드래그앤드롭) */}
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3} size="h4">
            청첩장 구성 요소
          </Title>
          <Text size="sm" c="dimmed">
            {enabledBlocks.size}개 선택됨
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          드래그하여 순서를 변경하고, 토글로 사용 여부를 선택하세요
        </Text>
        <BlockSelector
          enabledBlocks={enabledBlocks}
          blockOrder={blockOrder}
          onToggle={handleToggle}
          onReorder={handleReorder}
        />
      </Stack>

      {/* 선택된 블록 상세 편집 영역 */}
      {orderedBlocks.length > 0 && (
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3} size="h4">
              블록 상세 편집
            </Title>
            <Group gap="xs">
              {/* Undo/Redo 버튼 */}
              <Group gap={4}>
                <ActionIcon
                  variant="subtle"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="실행 취소 (Ctrl+Z)"
                >
                  <IconArrowBack size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="다시 실행 (Ctrl+Shift+Z)"
                >
                  <IconArrowForward size={16} />
                </ActionIcon>
              </Group>

              {/* 전체 접기/펼치기 버튼 */}
              <Button
                variant="subtle"
                size="sm"
                onClick={handleToggleAllExpanded}
                leftSection={
                  allExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                }
              >
                {allExpanded ? '모두 접기' : '모두 펼치기'}
              </Button>
            </Group>
          </Group>

          <Stack gap="md">
            {orderedBlocks.map((block) => (
              <BlockEditPanel
                key={block.type}
                block={block}
                isExpanded={expandedBlocks.has(block.type)}
                onToggleExpanded={handleToggleBlockExpanded}
                onUpdate={handleUpdateBlockWithHistory}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {orderedBlocks.length === 0 && (
        <Paper p="xl" withBorder style={{ borderStyle: 'dashed', borderWidth: 2 }}>
          <Center>
            <Stack gap="xs" align="center">
              <Text c="dimmed">선택된 구성 요소가 없습니다</Text>
              <Text size="sm" c="dimmed">
                위에서 사용할 구성 요소의 토글을 켜세요
              </Text>
            </Stack>
          </Center>
        </Paper>
      )}

      {/* 템플릿 저장 모달 */}
      <Modal
        opened={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setTemplateName('');
        }}
        title="템플릿 저장"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="템플릿 이름"
            placeholder="예: 기본 청첩장 템플릿"
            value={templateName}
            onChange={(e) => setTemplateName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTemplate();
              }
            }}
            autoFocus
          />
          <Paper p="md" bg="gray.0">
            <Text size="sm">저장될 내용: {enabledBlocks.size}개 블록 설정</Text>
            <Text size="xs" c="dimmed" mt={4}>
              블록 구성, 순서, 데이터가 저장됩니다
            </Text>
          </Paper>
          <Group grow>
            <Button
              variant="default"
              onClick={() => {
                setShowTemplateModal(false);
                setTemplateName('');
              }}
            >
              취소
            </Button>
            <Button onClick={handleSaveTemplate}>저장</Button>
          </Group>
        </Stack>
      </Modal>

      {/* 템플릿 목록 모달 */}
      <Modal
        opened={showTemplateList}
        onClose={() => setShowTemplateList(false)}
        title="템플릿 불러오기"
        centered
        size="md"
      >
        {templates.length === 0 ? (
          <Center py="xl">
            <Stack gap="xs" align="center">
              <IconFolder size={48} color="var(--mantine-color-gray-4)" />
              <Text c="dimmed">저장된 템플릿이 없습니다</Text>
              <Text size="sm" c="dimmed">
                블록을 구성한 후 템플릿으로 저장해보세요
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="xs" mah="60vh" style={{ overflowY: 'auto' }} mb="md">
            {templates.map((template) => (
              <Paper
                key={template.id}
                p="md"
                withBorder
                onClick={() => handleLoadTemplate(template)}
                style={{ cursor: 'pointer' }}
                className="group"
              >
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Text fw={500}>{template.name}</Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {template.enabledBlocks.length}개 블록 ·{' '}
                      {new Date(template.createdAt).toLocaleDateString('ko-KR')}
                    </Text>
                  </Box>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                    title="템플릿 삭제"
                    style={{ opacity: 0 }}
                    className="group-hover:opacity-100"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        <Button variant="default" fullWidth onClick={() => setShowTemplateList(false)}>
          닫기
        </Button>
      </Modal>

      <AppAlertDialog
        open={deleteTemplateId !== null}
        onOpenChange={() => setDeleteTemplateId(null)}
        onConfirm={handleConfirmDeleteTemplate}
        title="템플릿 삭제"
        description="이 템플릿을 삭제하시겠습니까?"
        confirmText="삭제"
        variant="danger"
      />
    </Stack>
  );
};
