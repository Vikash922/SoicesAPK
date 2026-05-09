import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  spice_points: number;
  membership_tier: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, return null
          return null;
        }
        throw error;
      }
      return data as Profile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
};
