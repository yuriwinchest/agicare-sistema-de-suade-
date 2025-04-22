
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { Post } from '@/services/blog/types';

interface PostCardProps {
  post: Post;
  showAuthor?: boolean;
}

export const PostCard = ({ post, showAuthor = true }: PostCardProps) => {
  const authorName = post.users?.name || 'Usuário';
  const authorAvatar = post.users?.avatar_url;
  const categories = post.post_categories?.map(pc => pc.categories) || [];
  const commentCount = post.comments?.length || 0;
  
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  const excerptContent = post.content.length > 150 
    ? `${post.content.substring(0, 150)}...` 
    : post.content;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <Link to={`/post/${post.id}`}>
          <CardTitle className="text-xl hover:text-blue-600 transition-colors">
            {post.title}
          </CardTitle>
        </Link>
        
        {showAuthor && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardDescription>
              <Link to={`/user/${post.user_id}`} className="hover:underline">
                {authorName}
              </Link>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </CardDescription>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm mb-3">
          {excerptContent}
        </p>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map(category => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <Link 
          to={`/post/${post.id}`} 
          className="text-sm text-primary hover:underline"
        >
          Leia mais
        </Link>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <MessageSquare size={14} />
          <span className="text-xs">{commentCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
