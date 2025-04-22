
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPosts, 
  fetchPostById, 
  createPost, 
  updatePost, 
  deletePost,
  fetchPostsByUserId
} from '@/services/blog/postService';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/services/blog/categoryService';
import { 
  fetchCommentsByPostId, 
  createComment, 
  updateComment, 
  deleteComment 
} from '@/services/blog/commentService';
import { 
  fetchUsers, 
  fetchUserById, 
  updateUserProfile 
} from '@/services/blog/userService';
import { CreatePostInput, UpdatePostInput, CreateCommentInput } from '@/services/blog/types';

export const usePosts = (published: boolean = true) => {
  return useQuery({
    queryKey: ['posts', published],
    queryFn: () => fetchPosts(published)
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id
  });
};

export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => fetchPostsByUserId(userId),
    enabled: !!userId
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (post: CreatePostInput) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: UpdatePostInput }) => 
      updatePost(id, post),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!postId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (comment: CreateCommentInput) => createComment(comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.post_id] });
    }
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, content, postId }: { id: string; content: string; postId: string }) => 
      updateComment(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, postId }: { id: string; postId: string }) => {
      return deleteComment(id).then(() => ({ postId }));
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['comments', result.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', result.postId] });
    }
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) => 
      updateUserProfile(id, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
