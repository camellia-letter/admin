import apiClient from './client';
import type { Rsvp, RsvpStats, PaginatedResponse } from '@camellia-letter/shared-types';

export const getRsvps = async (invitationId: string): Promise<Rsvp[]> => {
  const { data } = await apiClient.get<PaginatedResponse<Rsvp>>(
    `/api/rsvps?invitationId=${invitationId}`,
  );
  return data.items;
};

export const getRsvpStats = async (invitationId: string): Promise<RsvpStats> => {
  const { data } = await apiClient.get(`/api/rsvps/stats?invitationId=${invitationId}`);
  return data;
};

export const deleteRsvp = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/rsvps/${id}`);
};
