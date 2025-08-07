import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  ArrowLeft, 
  Save, 
  Share2, 
  Copy, 
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { aiAgents, type AIAgent } from "./ai-assistant";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
}

interface AIInteraction {
  id: string;
  userId: string;
  agentId: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

export default function AIChat() {
  const { agentId } = useParams<{ agentId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the selected agent
  const agent = aiAgents.find(a => a.id === agentId);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load previous interactions
  const { data: interactions = [] } = useQuery({
    queryKey: ['/api/ai/interactions', user?.id, agentId],
    queryFn: async () => {
      if (!user?.id || !agentId) return [];
      const response = await fetch(`/api/ai/interactions?userId=${user.id}&agentId=${agentId}`);
      return response.json();
    },
    enabled: !!user?.id && !!agentId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user?.id || !agentId) {
        console.error("Missing user or agent ID:", { userId: user?.id, agentId });
        throw new Error("Missing user or agent ID");
      }
      
      const payload = {
        userId: user.id,
        agentId,
        message,
        messages: messages.slice(-10) // Send last 10 messages for context
      };
      
      console.log("Sending AI chat payload:", payload);
      return apiRequest("POST", "/api/ai/chat", payload);
    },
    onSuccess: (response: any) => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: response.response || response.message || "I received your message.",
        timestamp: new Date(),
        agentId
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Invalidate interactions to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/ai/interactions'] });
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Save interaction as post mutation
  const saveAsPostMutation = useMutation({
    mutationFn: async (interactionData: { title: string; content: string; tags: string[] }) => {
      return apiRequest("POST", "/api/posts", {
        userId: user?.id,
        title: interactionData.title,
        content: interactionData.content,
        tags: interactionData.tags,
        type: "discussion",
        isAIGenerated: true,
        sourceAgent: agent?.name
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI conversation saved as post successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    sendMessageMutation.mutate(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveAsPost = () => {
    if (messages.length < 2) {
      toast({
        title: "No Content",
        description: "Start a conversation before saving as post.",
        variant: "destructive"
      });
      return;
    }

    // Generate post content from conversation
    const conversationSummary = messages
      .slice(-6) // Last 3 exchanges
      .map(msg => `**${msg.role === 'user' ? 'Question' : agent?.name}**: ${msg.content}`)
      .join('\n\n');

    const postTitle = `AI Insights: ${agent?.name} Discussion`;
    const postContent = `I had an insightful conversation with our AI ${agent?.name} about business strategy. Here are the key takeaways:\n\n${conversationSummary}\n\n*What are your thoughts on this approach?*`;
    const postTags = agent?.expertise.slice(0, 3) || ["AI", "Business", "Strategy"];

    saveAsPostMutation.mutate({
      title: postTitle,
      content: postContent,
      tags: postTags
    });
  };

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
            <p className="text-gray-600 mb-4">The requested AI agent could not be found.</p>
            <Link href="/ai-assistant">
              <Button>Return to AI Assistants</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = agent.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/ai-assistant">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className={`${agent.color} h-10 w-10`}>
                  <AvatarFallback className="text-white">
                    <IconComponent className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">{agent.name}</h1>
                  <p className="text-sm text-gray-600">{agent.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveAsPost}
                disabled={messages.length < 2 || saveAsPostMutation.isPending}
                data-testid="save-as-post"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with {agent.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    {messages.length} messages
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="flex items-start space-x-3">
                        <Avatar className={`${agent.color} h-8 w-8`}>
                          <AvatarFallback className="text-white">
                            <IconComponent className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm">
                              Hello! I'm your {agent.name} AI assistant. I specialize in {agent.expertise.slice(0, 3).join(", ")} and more. 
                              How can I help you grow your business today?
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Chat Messages */}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className={message.role === "user" ? "bg-primary h-8 w-8" : `${agent.color} h-8 w-8`}>
                          <AvatarFallback className="text-white">
                            {message.role === "user" ? (
                              user?.fullName?.[0] || "U"
                            ) : (
                              <IconComponent className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${message.role === "user" ? "text-right" : ""}`}>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading Message */}
                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <Avatar className={`${agent.color} h-8 w-8`}>
                          <AvatarFallback className="text-white">
                            <IconComponent className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask ${agent.name} anything about ${agent.expertise[0].toLowerCase()}...`}
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isLoading}
                      data-testid="chat-input"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="lg"
                      data-testid="send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Agent Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{agent.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2">Expertise Areas:</h4>
                  <div className="space-y-1">
                    {agent.expertise.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Interactions</span>
                    <span className="font-medium">{agent.interactions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-medium">{agent.rating}/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Business Ideas
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Conversation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Insights
                </Button>
              </CardContent>
            </Card>
            
            {/* Previous Interactions */}
            {interactions.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Recent Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {interactions.slice(0, 5).map((interaction: any) => (
                      <div key={interaction.id} className="text-sm p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                        <p className="truncate">{interaction.lastMessage || "Previous conversation"}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(interaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}