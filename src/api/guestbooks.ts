import apiClient from './client';
import type { GuestBook, UpdateGuestBookDto, PaginatedResponse } from '@/types/invitation';

export const getGuestbooksForAdmin = async (invitationId: string): Promise<GuestBook[]> => {
  const { data } = await apiClient.get<PaginatedResponse<GuestBook>>(
    `/api/guestbooks/admin?invitationId=${invitationId}`,
  );
  return data.items;
};

export const updateGuestbook = async (id: string, dto: UpdateGuestBookDto): Promise<GuestBook> => {
  const { data } = await apiClient.patch(`/api/guestbooks/${id}`, dto);
  return data;
};

export const deleteGuestbook = async (id: string): Promise<void> => {
  await apiClient.post(`/api/guestbooks/${id}/delete`);
};
