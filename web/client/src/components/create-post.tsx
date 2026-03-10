import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Image, Bot, Send, X, Handshake, TrendingUp } from "lucide-react";

interface CreatePostProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function CreatePost({ isExpanded, onToggleExpand }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const createMutation = useMutation({
    mutationFn: () =>
      api.discussion.createDiscussion({
        title,
        content,
        description: content.substring(0, 200),
        isPublic: true,
        tags,
        postType: 0,
      }),
    onSuccess: () => {
      toast({ title: "Post created successfully!" });
      setTitle("");
      setContent("");
      setTags([]);
      onToggleExpand();
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Error creating post",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) setTags([...tags, tag]);
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  if (!isExpanded) {
    return (
      <Card className="business-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback>
                {user?.displayName?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <Input
              type="text"
              placeholder={
                isAuthenticated
                  ? "Share an update, ask a question, or start a discussion..."
                  : "Sign in to create a post"
              }
              onClick={isAuthenticated ? onToggleExpand : undefined}
              readOnly={!isAuthenticated}
              className="flex-1 cursor-pointer"
              data-testid="input-create-post-trigger"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="business-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={user?.displayName ?? "User"} />
              <AvatarFallback>
                {user?.displayName?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user?.displayName ?? "User"}</h3>
              <p className="text-sm text-gray-600">Share with your network</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            data-testid="button-close-create-post"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Input
          type="text"
          placeholder="Add a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
          data-testid="input-post-title"
        />

        <Textarea
          placeholder="What's on your mind? Share your thoughts, ask questions, or start a discussion..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mb-4 resize-none"
          data-testid="textarea-post-content"
        />

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center">
                #{tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 p-0 h-auto"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          {tags.length < 5 && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => addTag("smallbusiness")} data-testid="button-tag-smallbusiness">
                #smallbusiness
              </Button>
              <Button variant="outline" size="sm" onClick={() => addTag("networking")} data-testid="button-tag-networking">
                #networking
              </Button>
              <Button variant="outline" size="sm" onClick={() => addTag("collaboration")} data-testid="button-tag-collaboration">
                #collaboration
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 hover:text-primary"
              data-testid="button-add-image"
            >
              <Image className="mr-2 h-4 w-4" />
              Photo
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || createMutation.isPending}
            className="bg-primary hover:bg-primary-dark"
            data-testid="button-publish-post"
          >
            <Send className="mr-2 h-4 w-4" />
            {createMutation.isPending ? "Publishing..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
