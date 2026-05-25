import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockHistory, type BlockHistoryState } from './useBlockHistory';

describe('useBlockHistory', () => {
  const initialState: BlockHistoryState = {
    enabledBlocks: ['HERO'],
    blockData: {},
    blockOrder: ['HERO'],
  };

  let result: ReturnType<typeof renderHook<ReturnType<typeof useBlockHistory>, unknown>>;

  beforeEach(() => {
    result = renderHook(() => useBlockHistory(initialState));
  });

  it('초기 상태로 시작한다', () => {
    expect(result.result.current.canUndo).toBe(false);
    expect(result.result.current.canRedo).toBe(false);
  });

  it('새 상태를 푸시하면 undo가 가능해진다', () => {
    const newState: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE'],
    };

    act(() => {
      result.result.current.pushState(newState);
    });

    expect(result.result.current.canUndo).toBe(true);
    expect(result.result.current.canRedo).toBe(false);
  });

  it('undo를 하면 이전 상태로 돌아간다', () => {
    const state1: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE'],
    };

    const state2: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE', 'INFO'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE', 'INFO'],
    };

    act(() => {
      result.result.current.pushState(state1);
    });

    act(() => {
      result.result.current.pushState(state2);
    });

    let undoResult: BlockHistoryState | null = null;
    act(() => {
      undoResult = result.result.current.undo();
    });

    expect(undoResult).toEqual(state1);
    expect(result.result.current.canUndo).toBe(true);
    expect(result.result.current.canRedo).toBe(true);
  });

  it('redo를 하면 다음 상태로 이동한다', () => {
    const state1: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE'],
    };

    act(() => {
      result.result.current.pushState(state1);
    });

    act(() => {
      result.result.current.undo();
    });

    let redoResult;
    act(() => {
      redoResult = result.result.current.redo();
    });

    expect(redoResult).toEqual(state1);
    expect(result.result.current.canRedo).toBe(false);
  });

  it('히스토리 중간에서 새 상태를 푸시하면 이후 히스토리가 삭제된다', () => {
    const state1: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE'],
    };

    const state2: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE', 'INFO'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE', 'INFO'],
    };

    const state3: BlockHistoryState = {
      enabledBlocks: ['HERO', 'GALLERY'],
      blockData: {},
      blockOrder: ['HERO', 'GALLERY'],
    };

    act(() => {
      result.result.current.pushState(state1);
      result.result.current.pushState(state2);
    });

    act(() => {
      result.result.current.undo();
    });

    // 중간에서 새 상태 푸시
    act(() => {
      result.result.current.pushState(state3);
    });

    // redo가 불가능해야 함 (state2가 삭제됨)
    expect(result.result.current.canRedo).toBe(false);
  });

  it('clear를 하면 현재 상태만 남긴다', () => {
    const state1: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE'],
    };

    const state2: BlockHistoryState = {
      enabledBlocks: ['HERO', 'MESSAGE', 'INFO'],
      blockData: {},
      blockOrder: ['HERO', 'MESSAGE', 'INFO'],
    };

    act(() => {
      result.result.current.pushState(state1);
      result.result.current.pushState(state2);
    });

    act(() => {
      result.result.current.undo();
      result.result.current.clear();
    });

    expect(result.result.current.canUndo).toBe(false);
    expect(result.result.current.canRedo).toBe(false);
  });

  it('첫 번째 상태에서 undo는 null을 반환한다', () => {
    let undoResult;
    act(() => {
      undoResult = result.result.current.undo();
    });

    expect(undoResult).toBeNull();
  });

  it('마지막 상태에서 redo는 null을 반환한다', () => {
    let redoResult;
    act(() => {
      redoResult = result.result.current.redo();
    });

    expect(redoResult).toBeNull();
  });
});
