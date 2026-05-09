import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  spice_points: number;
  membership_tier: string;
}

export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async claimDailyBonus(userId: string) {
    // 1. Get current points
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('spice_points')
      .eq('id', userId)
      .single();
    
    if (getError) throw getError;

    // 2. Update points
    const newPoints = (profile.spice_points || 0) + 10;
    
    // 3. Determine new tier
    let newTier = 'Seed';
    if (newPoints >= 2000) newTier = 'Premium Saffron';
    else if (newPoints >= 500) newTier = 'Ground';

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        spice_points: newPoints,
        membership_tier: newTier
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    return data;
  }
};
