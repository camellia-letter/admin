import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInvitations, useInvitation, useCreateInvitation } from './useInvitations';
import * as invitationsApi from '../api/invitations';
import type { Invitation } from '@camellia-letter/shared-types';
import React from 'react';

// API 모킹
vi.mock('../api/invitations');
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({ id: '1', email: 'test@example.com', name: 'Test User' }),
}));

describe('useInvitations hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  describe('useInvitations', () => {
    it('초대장 목록을 가져온다', async () => {
      const mockInvitations = [
        { id: '1', title: '청첩장 1', slug: 'wedding-1' },
        { id: '2', title: '청첩장 2', slug: 'wedding-2' },
      ] as unknown as Invitation[];

      vi.mocked(invitationsApi.getInvitations).mockResolvedValue(mockInvitations);

      const { result } = renderHook(() => useInvitations(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockInvitations);
      expect(invitationsApi.getInvitations).toHaveBeenCalledTimes(1);
    });

    it('에러가 발생하면 isError가 true가 된다', async () => {
      vi.mocked(invitationsApi.getInvitations).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useInvitations(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useInvitation', () => {
    it('ID로 특정 초대장을 가져온다', async () => {
      const mockInvitation = {
        id: '1',
        title: '청첩장 1',
        slug: 'wedding-1',
        content: '결혼합니다',
      } as unknown as Invitation;

      vi.mocked(invitationsApi.getInvitation).mockResolvedValue(mockInvitation);

      const { result } = renderHook(() => useInvitation('1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockInvitation);
      expect(invitationsApi.getInvitation).toHaveBeenCalledWith('1');
    });

    it('ID가 없으면 쿼리가 실행되지 않는다', () => {
      const { result } = renderHook(() => useInvitation(''), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(invitationsApi.getInvitation).not.toHaveBeenCalled();
    });
  });

  describe('useCreateInvitation', () => {
    it('초대장을 생성하고 쿼리를 무효화한다', async () => {
      const newInvitation = {
        id: '3',
        title: '새 청첩장',
        slug: 'new-wedding',
      } as unknown as Invitation;

      vi.mocked(invitationsApi.createInvitation).mockResolvedValue(newInvitation);

      const { result } = renderHook(() => useCreateInvitation(), { wrapper });

      const createDto = {
        title: '새 청첩장',
        slug: 'new-wedding',
        groomName: '신랑',
        brideName: '신부',
        weddingDate: '2024-06-01T10:00:00Z',
        venue: '웨딩홀',
        venueAddress: '서울시 강남구',
      };

      result.current.mutate(createDto);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(newInvitation);
      expect(invitationsApi.createInvitation).toHaveBeenCalledWith(createDto);
    });
  });
});
