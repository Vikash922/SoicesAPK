import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuthStore } from '@/store/useAuthStore';

export const useProfile = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileApi.getProfile(user!.id),
    enabled: !!user?.id,
  });
};

export const useClaimDailyBonus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: () => profileApi.claimDailyBonus(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
};
