import { describe, it, expect } from 'vitest';
import {
  createDefaultBlock,
  reorderBlocks,
  getBlockLabel,
  getBlockDescription,
  validateBlockData,
  validateAllBlocks,
} from './blockHelpers';
import type { InvitationBlock, BlockType } from '@camellia-letter/shared-types';

describe('blockHelpers', () => {
  describe('createDefaultBlock', () => {
    it('should create a HERO block with default data', () => {
      const block = createDefaultBlock('HERO', 0);

      expect(block).toHaveProperty('id');
      expect(block.type).toBe('HERO');
      expect(block.order).toBe(0);
      expect(block.data).toEqual({
        imageUrl: '',
        altText: '메인 이미지',
      });
    });

    it('should create a MESSAGE block with default data', () => {
      const block = createDefaultBlock('MESSAGE', 1);

      expect(block.type).toBe('MESSAGE');
      expect(block.order).toBe(1);
      expect(block.data).toHaveProperty('title');
      expect(block.data).toHaveProperty('content');
    });

    it('should create an ACCOUNT block with empty accounts', () => {
      const block = createDefaultBlock('ACCOUNT', 2);

      expect(block.type).toBe('ACCOUNT');
      expect(block.data.groomAccounts).toEqual([]);
      expect(block.data.brideAccounts).toEqual([]);
    });

    it('should create a SNAP_UPLOAD block with default data', () => {
      const block = createDefaultBlock('SNAP_UPLOAD', 3);

      expect(block.type).toBe('SNAP_UPLOAD');
      expect(block.data).toHaveProperty('title');
      expect(block.data).toHaveProperty('description');
    });
  });

  describe('reorderBlocks', () => {
    const createTestBlocks = (): InvitationBlock[] => [
      createDefaultBlock('HERO', 0),
      createDefaultBlock('MESSAGE', 1),
      createDefaultBlock('INFO', 2),
      createDefaultBlock('MAP', 3),
    ];

    it('should reorder blocks from index 0 to 2', () => {
      const blocks = createTestBlocks();
      const reordered = reorderBlocks(blocks, 0, 2);

      expect(reordered[0].type).toBe('MESSAGE');
      expect(reordered[1].type).toBe('INFO');
      expect(reordered[2].type).toBe('HERO');
      expect(reordered[3].type).toBe('MAP');

      // Check that orders are updated
      expect(reordered[0].order).toBe(0);
      expect(reordered[1].order).toBe(1);
      expect(reordered[2].order).toBe(2);
      expect(reordered[3].order).toBe(3);
    });

    it('should reorder blocks from index 3 to 1', () => {
      const blocks = createTestBlocks();
      const reordered = reorderBlocks(blocks, 3, 1);

      expect(reordered[0].type).toBe('HERO');
      expect(reordered[1].type).toBe('MAP');
      expect(reordered[2].type).toBe('MESSAGE');
      expect(reordered[3].type).toBe('INFO');
    });

    it('should handle same index without error', () => {
      const blocks = createTestBlocks();
      const reordered = reorderBlocks(blocks, 1, 1);

      expect(reordered).toHaveLength(4);
      expect(reordered[1].type).toBe('MESSAGE');
    });
  });

  describe('getBlockLabel', () => {
    it('should return correct Korean labels', () => {
      expect(getBlockLabel('HEADER')).toBe('헤더');
      expect(getBlockLabel('HERO')).toBe('메인 이미지');
      expect(getBlockLabel('MESSAGE')).toBe('인사말');
      expect(getBlockLabel('GALLERY')).toBe('갤러리');
      expect(getBlockLabel('SNAP_UPLOAD')).toBe('스냅 업로드');
    });
  });

  describe('getBlockDescription', () => {
    it('should return correct descriptions', () => {
      expect(getBlockDescription('HEADER')).toContain('신랑 신부');
      expect(getBlockDescription('GALLERY')).toContain('갤러리');
      expect(getBlockDescription('MAP')).toContain('지도');
      expect(getBlockDescription('SNAP_UPLOAD')).toContain('촬영한 사진');
    });
  });

  describe('validateBlockData', () => {
    it('should validate HERO block with valid URL', () => {
      const block = createDefaultBlock('HERO', 0);
      block.data.imageUrl = 'https://example.com/image.jpg';

      const result = validateBlockData(block);
      expect(result.valid).toBe(true);
    });

    it('should invalidate HERO block with empty URL', () => {
      const block = createDefaultBlock('HERO', 0);
      block.data.imageUrl = '';

      const result = validateBlockData(block);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL');
    });

    it('should invalidate HERO block with invalid URL', () => {
      const block = createDefaultBlock('HERO', 0);
      block.data.imageUrl = 'not-a-valid-url';

      const result = validateBlockData(block);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('올바른 URL');
    });

    it('should validate MESSAGE block with content', () => {
      const block = createDefaultBlock('MESSAGE', 0);
      block.data.content = '초대합니다';

      const result = validateBlockData(block);
      expect(result.valid).toBe(true);
    });

    it('should invalidate MESSAGE block without title and content', () => {
      const block = createDefaultBlock('MESSAGE', 0);
      block.data.title = '';
      block.data.content = '';

      const result = validateBlockData(block);
      expect(result.valid).toBe(false);
    });

    it('should validate GALLERY block with valid images', () => {
      const block = createDefaultBlock('GALLERY', 0);
      block.data.images = [
        { url: 'https://example.com/1.jpg', caption: 'Image 1' },
        { url: 'https://example.com/2.jpg' },
      ];

      const result = validateBlockData(block);
      expect(result.valid).toBe(true);
    });

    it('should invalidate GALLERY block with invalid image URL', () => {
      const block = createDefaultBlock('GALLERY', 0);
      block.data.images = [
        { url: 'invalid-url', caption: 'Image 1' },
      ];

      const result = validateBlockData(block);
      expect(result.valid).toBe(false);
    });

    it('should always validate INFO block', () => {
      const block = createDefaultBlock('INFO', 0);
      const result = validateBlockData(block);
      expect(result.valid).toBe(true);
    });

    it('should always validate SNAP_UPLOAD block', () => {
      const block = createDefaultBlock('SNAP_UPLOAD', 0);
      const result = validateBlockData(block);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateAllBlocks', () => {
    it('should validate all valid blocks', () => {
      const blocks: InvitationBlock[] = [
        {
          ...createDefaultBlock('HERO', 0),
          data: { imageUrl: 'https://example.com/image.jpg', altText: 'Hero' },
        },
        {
          ...createDefaultBlock('MESSAGE', 1),
          data: { title: '초대합니다', content: '내용' },
        },
        createDefaultBlock('INFO', 2),
      ];

      const result = validateAllBlocks(blocks);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect all errors from invalid blocks', () => {
      const blocks: InvitationBlock[] = [
        {
          ...createDefaultBlock('HERO', 0),
          data: { imageUrl: '', altText: 'Hero' },
        },
        {
          ...createDefaultBlock('MESSAGE', 1),
          data: { title: '', content: '' },
        },
      ];

      const result = validateAllBlocks(blocks);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('블록 1');
    });

    it('should return valid for empty block array', () => {
      const result = validateAllBlocks([]);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
