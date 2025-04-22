
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  users?: User;
  post_categories?: { categories: Category }[];
  comments?: (Comment & { users: User })[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  user_id: string;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  content: string;
  post_id: string;
  user_id: string;
}
