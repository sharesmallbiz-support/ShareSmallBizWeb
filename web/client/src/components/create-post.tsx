import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Image, 
  Lightbulb, 
  Bot, 
  Send,
  X,
  Handshake,
  TrendingUp
} from "lucide-react";

interface CreatePostProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function CreatePost({ isExpanded, onToggleExpand }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"discussion" | "marketing" | "opportunity">("discussion");
  const [tags, setTags] = useState<string[]>([]);
  const [isCollaboration, setIsCollaboration] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock current user
  const currentUser = {
    id: "user1",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48"
  };

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      toast({ title: "Post created successfully!" });
      setTitle("");
      setContent("");
      setPostType("discussion");
      setTags([]);
      setIsCollaboration(false);
      onToggleExpand();
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: () => {
      toast({ 
        title: "Error creating post", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({ 
        title: "Content required", 
        description: "Please add some content to your post.",
        variant: "destructive" 
      });
      return;
    }

    createPostMutation.mutate({
      userId: currentUser.id,
      title: title || null,
      content,
      postType,
      tags: tags.length > 0 ? tags : null,
      isCollaboration,
      imageUrl: null, // TODO: Add image upload functionality
    });
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isExpanded) {
    return (
      <Card className="business-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <Input
              type="text"
              placeholder="Share an update, ask a question, or start a discussion..."
              onClick={onToggleExpand}
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
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{currentUser.name}</h3>
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

        {/* Post Type Selection */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={postType === "discussion" ? "default" : "outline"}
            size="sm"
            onClick={() => setPostType("discussion")}
            data-testid="button-type-discussion"
          >
            Discussion
          </Button>
          <Button
            variant={postType === "marketing" ? "default" : "outline"}
            size="sm"
            onClick={() => setPostType("marketing")}
            data-testid="button-type-marketing"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Marketing
          </Button>
          <Button
            variant={postType === "opportunity" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setPostType("opportunity");
              setIsCollaboration(true);
            }}
            data-testid="button-type-opportunity"
          >
            <Handshake className="h-3 w-3 mr-1" />
            Opportunity
          </Button>
        </div>

        {/* Title Input */}
        <Input
          type="text"
          placeholder="Add a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
          data-testid="input-post-title"
        />

        {/* Content Input */}
        <Textarea
          placeholder="What's on your mind? Share your thoughts, ask questions, or start a discussion..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mb-4 resize-none"
          data-testid="textarea-post-content"
        />

        {/* Tags */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => addTag("smallbusiness")}
                data-testid="button-tag-smallbusiness"
              >
                #smallbusiness
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addTag("networking")}
                data-testid="button-tag-networking"
              >
                #networking
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addTag("collaboration")}
                data-testid="button-tag-collaboration"
              >
                #collaboration
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
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
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 hover:text-ai-purple"
              data-testid="button-ai-help"
            >
              <Bot className="mr-2 h-4 w-4" />
              AI Help
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || createPostMutation.isPending}
            className="bg-primary hover:bg-primary-dark"
            data-testid="button-publish-post"
          >
            <Send className="mr-2 h-4 w-4" />
            {createPostMutation.isPending ? "Publishing..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
