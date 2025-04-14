
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/components/auth/types';

export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  department_id?: string;
  professional_id?: string;
  is_active: boolean;
  settings: Record<string, any>;
};

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Parse the JSONB settings field to ensure it's an object
      return {
        ...data,
        settings: typeof data.settings === 'string' 
          ? JSON.parse(data.settings) 
          : (data.settings || {})
      };
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!userId) throw new Error('No user ID provided');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
  };
};
