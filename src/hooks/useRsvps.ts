import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRsvps, getRsvpStats, deleteRsvp } from '@/api/rsvps';

export const useRsvps = (invitationId: string) => {
  return useQuery({
    queryKey: ['rsvps', invitationId],
    queryFn: () => getRsvps(invitationId),
    enabled: !!invitationId,
  });
};

export const useRsvpStats = (invitationId: string) => {
  return useQuery({
    queryKey: ['rsvps', 'stats', invitationId],
    queryFn: () => getRsvpStats(invitationId),
    enabled: !!invitationId,
  });
};

export const useDeleteRsvp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRsvp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps'] });
    },
  });
};
