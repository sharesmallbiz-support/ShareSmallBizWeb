import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Bot,
} from "lucide-react";
import type { DiscussionModel } from "@shared/schema";

interface PostCardProps {
  post: DiscussionModel;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const displayName = post.creator?.displayName ?? "Unknown User";
  const userName = post.creator?.userName ?? "";
  const avatarUrl = post.creator?.profilePictureUrl ?? "";
  const coverUrl = post.cover || null;
  const likesCount = (post.likes ?? []).length;
  const commentsCount = (post.comments ?? []).length;

  const likeMutation = useMutation({
    mutationFn: () => api.discussion.likeDiscussion(post.id),
    onSuccess: () => {
      setIsLiked((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
    },
  });

  return (
    <Card className="post-card" data-testid={`post-${post.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="w-12 h-12 mr-3">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold" data-testid={`post-author-${post.id}`}>
              {displayName}
            </h3>
            <p className="text-sm text-gray-600">
              {userName && `@${userName} · `}
              {formatDistanceToNow(new Date(post.createdDate), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {post.isFeatured && (
              <Badge className="text-xs font-semibold bg-primary/20 text-primary">
                Featured
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {post.title && (
          <h2 className="text-xl font-semibold mb-3" data-testid={`post-title-${post.id}`}>
            {post.title}
          </h2>
        )}

        <p className="text-gray-700 mb-4" data-testid={`post-content-${post.id}`}>
          {post.description || post.content}
        </p>
      </CardContent>

      {coverUrl && (
        <img
          src={coverUrl}
          alt={post.title || "Post image"}
          className="w-full h-64 object-cover"
          data-testid={`post-image-${post.id}`}
        />
      )}

      {(post.tags ?? []).length > 0 && (
        <CardContent className="px-6 pt-0 pb-2">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}

      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => likeMutation.mutate()}
              className={`flex items-center ${isLiked ? "text-red-500" : "text-gray-600 hover:text-primary"}`}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 hover:text-primary"
              data-testid={`button-comment-${post.id}`}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-primary"
            data-testid={`button-save-${post.id}`}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {likesCount > 50 && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Bot className="h-4 w-4 text-ai-purple mr-2" />
              <span className="text-sm font-semibold text-ai-purple">AI Insight</span>
            </div>
            <p className="text-sm text-gray-700">
              This post has {Math.round((likesCount / 50 - 1) * 100)}% higher engagement
              than average. Consider similar content about{" "}
              {post.tags?.[0] || "this topic"}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
