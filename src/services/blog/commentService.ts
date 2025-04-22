
import { supabase } from '@/integrations/supabase/client';
import { Comment, CreateCommentInput } from './types';

export const fetchCommentsByPostId = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      users (name, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const createComment = async (comment: CreateCommentInput) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateComment = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteComment = async (id: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
