import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuestbooksForAdmin, updateGuestbook, deleteGuestbook } from '@/api/guestbooks';
import type { UpdateGuestBookDto } from '@camellia-letter/shared-types';

export const useGuestbooks = (invitationId: string) => {
  return useQuery({
    queryKey: ['guestbooks', invitationId],
    queryFn: () => getGuestbooksForAdmin(invitationId),
    enabled: !!invitationId,
  });
};

export const useUpdateGuestbook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGuestBookDto }) => updateGuestbook(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['guestbooks', data.invitationId] });
    },
  });
};

export const useDeleteGuestbook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGuestbook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestbooks'] });
    },
  });
};
