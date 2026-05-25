import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInvitations,
  getInvitation,
  getInvitationStats,
  createInvitation,
  deleteInvitation,
  updateInvitation,
} from '@/api/invitations';
import type { CreateInvitationDto, UpdateInvitationDto } from '@/types/invitation';
import { useAuthStore } from '@/store/authStore';

export const useInvitations = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['invitations', user?.id],
    queryFn: () => getInvitations(),
  });
};

export const useInvitation = (id: string) => {
  return useQuery({
    queryKey: ['invitations', id],
    queryFn: () => getInvitation(id),
    enabled: !!id,
  });
};

export const useInvitationStats = (id: string) => {
  return useQuery({
    queryKey: ['invitations', id, 'stats'],
    queryFn: () => getInvitationStats(id),
    enabled: !!id,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateInvitationDto) => createInvitation(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
};

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInvitationDto }) =>
      updateInvitation(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['invitations', id] });
    },
  });
};
