
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (id: string, userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};
