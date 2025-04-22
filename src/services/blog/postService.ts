
import { supabase } from '@/integrations/supabase/client';
import { Post, CreatePostInput, UpdatePostInput } from './types';

export const fetchPosts = async (published: boolean = true) => {
  let query = supabase
    .from('posts')
    .select(`
      *,
      users (name, avatar_url),
      post_categories (
        categories (id, name)
      )
    `)
    .order('created_at', { ascending: false });

  if (published) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const fetchPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (name, avatar_url),
      post_categories (
        categories (id, name)
      ),
      comments (
        *,
        users (name, avatar_url)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const fetchPostsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (name, avatar_url),
      post_categories (
        categories (id, name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createPost = async (post: CreatePostInput) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePost = async (id: string, post: UpdatePostInput) => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const addPostCategories = async (postId: string, categoryIds: string[]) => {
  const postCategories = categoryIds.map(categoryId => ({
    post_id: postId,
    category_id: categoryId
  }));

  const { data, error } = await supabase
    .from('post_categories')
    .insert(postCategories);

  if (error) throw error;
  return data;
};

export const removePostCategory = async (postId: string, categoryId: string) => {
  const { error } = await supabase
    .from('post_categories')
    .delete()
    .eq('post_id', postId)
    .eq('category_id', categoryId);

  if (error) throw error;
  return true;
};
