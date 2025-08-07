import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import StartConversationDialog from "./start-conversation-dialog";
import { useAuth } from "@/hooks/use-auth";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Bot,
  Handshake,
  TrendingUp,
  Mail
} from "lucide-react";
import type { PostWithUser } from "@shared/schema";

interface PostCardProps {
  post: PostWithUser;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [showAIInsight, setShowAIInsight] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock current user ID - replace with real auth
  const currentUserId = user?.id || "user1";

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/posts/${post.id}/like`, { userId: currentUserId });
      } else {
        return apiRequest("POST", `/api/posts/${post.id}/like`, { userId: currentUserId });
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "marketing":
        return "bg-secondary/20 text-secondary";
      case "opportunity":
        return "bg-success/20 text-success";
      case "collaboration":
        return "bg-success/20 text-success";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "marketing":
        return <TrendingUp className="h-3 w-3 mr-1" />;
      case "opportunity":
      case "collaboration":
        return <Handshake className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const formatPostType = (type: string) => {
    switch (type) {
      case "marketing":
        return "Marketing Tips";
      case "opportunity":
        return "Collaboration";
      case "collaboration":
        return "Collaboration";
      default:
        return "Discussion";
    }
  };

  return (
    <Card className="post-card" data-testid={`post-${post.id}`}>
      {/* Post Header */}
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="w-12 h-12 mr-3">
            <AvatarImage src={post.user.avatar || ""} alt={post.user.fullName} />
            <AvatarFallback>{post.user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold" data-testid={`post-author-${post.id}`}>
              {post.user.fullName}
            </h3>
            <p className="text-sm text-gray-600">
              {post.user.businessName} • {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {post.postType !== "discussion" && (
              <Badge className={`text-xs font-semibold ${getPostTypeColor(post.postType)}`}>
                {getPostTypeIcon(post.postType)}
                {formatPostType(post.postType)}
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        {post.title && (
          <h2 className="text-xl font-semibold mb-3" data-testid={`post-title-${post.id}`}>
            {post.title}
          </h2>
        )}
        <p className="text-gray-700 mb-4" data-testid={`post-content-${post.id}`}>
          {post.content}
        </p>
      </CardContent>

      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title || "Post image"} 
          className="w-full h-64 object-cover"
          data-testid={`post-image-${post.id}`}
        />
      )}

      {/* Collaboration Details */}
      {post.isCollaboration && post.collaborationDetails && (
        <CardContent className="p-6 pt-0">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-success mb-2">What we offer:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {post.collaborationDetails && 
               typeof post.collaborationDetails === 'object' && 
               'offers' in post.collaborationDetails && 
               Array.isArray((post.collaborationDetails as { offers: string[] }).offers) &&
               (post.collaborationDetails as { offers: string[] }).offers.map((offer: string, index: number) => (
                  <li key={index}>• {offer}</li>
                ))
              }
            </ul>
          </div>
        </CardContent>
      )}

      {/* Post Actions */}
      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-primary'}`}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 hover:text-primary"
              data-testid={`button-comment-${post.id}`}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>{post.commentsCount}</span>
            </Button>

            {user && user.id !== post.user.id && (
              <StartConversationDialog
                selectedUserId={post.user.id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-gray-600 hover:text-green-600"
                    data-testid={`button-message-${post.user.id}`}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </Button>
                }
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 hover:text-primary"
              data-testid={`button-share-${post.id}`}
            >
              <Share className="mr-2 h-4 w-4" />
              <span>{post.sharesCount}</span>
            </Button>
            
            {post.isCollaboration && (
              <Button
                size="sm"
                className="bg-success hover:bg-green-600"
                data-testid={`button-interest-${post.id}`}
              >
                Express Interest
              </Button>
            )}
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

        {/* AI Insights */}
        {(post.likesCount || 0) > 50 && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Bot className="h-4 w-4 text-ai-purple mr-2" />
              <span className="text-sm font-semibold text-ai-purple">AI Insight</span>
            </div>
            <p className="text-sm text-gray-700">
              This post has {Math.round(((post.likesCount || 0) / 50 - 1) * 100)}% higher engagement than average. 
              Consider similar content about {post.tags?.[0] || 'this topic'}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
