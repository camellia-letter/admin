import { useState, useEffect, useCallback } from 'react';
import type { BlockType, BlockDataByType } from '@camellia-letter/shared-types';

export interface BlockTemplate {
  id: string;
  name: string;
  createdAt: string;
  enabledBlocks: BlockType[];
  blockData: Partial<BlockDataByType>;
  blockOrder: BlockType[];
}

const STORAGE_KEY = 'camellia-block-templates';

export function useBlockTemplates() {
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);

  // 로컬스토리지에서 템플릿 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch {
      // Failed to load templates
    }
  }, []);

  // 템플릿 저장
  const saveTemplate = useCallback(
    (
      name: string,
      enabledBlocks: BlockType[],
      blockData: Partial<BlockDataByType>,
      blockOrder: BlockType[],
    ) => {
      const newTemplate: BlockTemplate = {
        id: `template-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        enabledBlocks,
        blockData,
        blockOrder,
      };

      setTemplates((prev) => {
        const updated = [...prev, newTemplate];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Failed to save template
        }
        return updated;
      });

      return newTemplate;
    },
    [],
  );

  // 템플릿 삭제
  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Failed to delete template
      }
      return updated;
    });
  }, []);

  // 템플릿 이름 변경
  const renameTemplate = useCallback((id: string, newName: string) => {
    setTemplates((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, name: newName } : t));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Failed to rename template
      }
      return updated;
    });
  }, []);

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    renameTemplate,
  };
}
