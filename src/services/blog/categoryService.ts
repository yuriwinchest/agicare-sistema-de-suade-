
import { supabase } from '@/integrations/supabase/client';
import { Category } from './types';

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const fetchCategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createCategory = async (name: string) => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, name: string) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
