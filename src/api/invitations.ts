import apiClient from './client';
import type {
  Invitation,
  CreateInvitationDto,
  UpdateInvitationDto,
  InvitationStats,
  PaginatedResponse,
} from '@/types/invitation';

export const getInvitations = async (): Promise<Invitation[]> => {
  const { data } = await apiClient.get<PaginatedResponse<Invitation>>('/api/invitations');
  return data.items;
};

export const getInvitation = async (id: string): Promise<Invitation> => {
  const { data } = await apiClient.get(`/api/invitations/${id}`);
  return data;
};

export const getInvitationStats = async (id: string): Promise<InvitationStats> => {
  const { data } = await apiClient.get(`/api/invitations/${id}/stats`);
  return data;
};

export const createInvitation = async (dto: CreateInvitationDto): Promise<Invitation> => {
  const { data } = await apiClient.post('/api/invitations', dto);
  return data;
};

export const deleteInvitation = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/invitations/${id}`);
};

export const updateInvitation = async (
  id: string,
  dto: UpdateInvitationDto,
): Promise<Invitation> => {
  const { data } = await apiClient.patch(`/api/invitations/${id}`, dto);
  return data;
};

export const checkSlugAvailability = async (
  slug: string,
  excludeId?: string,
): Promise<{ available: boolean; message: string; normalized?: string }> => {
  const params = excludeId ? { excludeId } : {};
  const { data } = await apiClient.get(`/api/invitations/check-slug/${slug}`, {
    params,
  });
  return data;
};

export const suggestSlug = async (
  groomName: string,
  brideName: string,
): Promise<{ slug: string }> => {
  const { data } = await apiClient.get('/api/invitations/suggest-slug', {
    params: { groomName, brideName },
  });
  return data;
};
