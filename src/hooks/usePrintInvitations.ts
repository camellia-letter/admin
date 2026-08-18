import { useQuery } from '@tanstack/react-query';
import { getAllInvitations, getPrintInvitationStats } from '@/api/admin';
import type { GetAllInvitationsParams } from '@/api/admin';

export const usePrintInvitations = (params: GetAllInvitationsParams = {}) => {
  return useQuery({
    queryKey: ['print-invitations', params],
    queryFn: () => getAllInvitations(params),
  });
};

export const usePrintInvitationStats = () => {
  return useQuery({
    queryKey: ['print-invitations', 'stats'],
    queryFn: () => getPrintInvitationStats(),
  });
};
