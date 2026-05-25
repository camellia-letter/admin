import { useState, useCallback, useEffect } from 'react';
import type { BlockType, BlockDataByType } from '@/types/invitation';

export interface BlockHistoryState {
  enabledBlocks: BlockType[];
  blockData: Partial<BlockDataByType>;
  blockOrder: BlockType[];
}

interface UseBlockHistoryReturn {
  pushState: (state: BlockHistoryState) => void;
  undo: () => BlockHistoryState | null;
  redo: () => BlockHistoryState | null;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useBlockHistory(initialState: BlockHistoryState): UseBlockHistoryReturn {
  const [history, setHistory] = useState<BlockHistoryState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback(
    (state: BlockHistoryState) => {
      setHistory((prev) => {
        // 현재 위치 이후의 히스토리 삭제 (새 분기)
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(state);

        // 최대 히스토리 크기 유지
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });
      setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
    },
    [currentIndex],
  );

  const undo = useCallback((): BlockHistoryState | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): BlockHistoryState | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const clear = useCallback(() => {
    if (history.length > 0) {
      setHistory([history[currentIndex]]);
      setCurrentIndex(0);
    }
  }, [history, currentIndex]);

  return {
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clear,
  };
}

// 키보드 단축키 훅
export function useUndoRedoShortcuts(
  onUndo: () => void,
  onRedo: () => void,
  canUndo: boolean,
  canRedo: boolean,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z 또는 Cmd+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          onUndo();
        }
      }
      // Ctrl+Shift+Z 또는 Cmd+Shift+Z (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) {
          onRedo();
        }
      }
      // Ctrl+Y 또는 Cmd+Y (Redo - Windows 스타일)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) {
          onRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, canUndo, canRedo]);
}
