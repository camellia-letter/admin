import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, approveUser, rejectUser } from '@/api/admin';
import type { GetUsersParams } from '@/api/admin';

export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      rejectUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
