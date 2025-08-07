import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import StartConversationDialog from "@/components/start-conversation-dialog";
import { 
  ArrowLeft,
  Send,
  Edit,
  Trash2,
  Mail,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

const editMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type SendMessageForm = z.infer<typeof sendMessageSchema>;
type EditMessageForm = z.infer<typeof editMessageSchema>;

interface Conversation {
  id: string;
  participants: string[];
  lastMessageId: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  isActive: boolean;
  otherUser: {
    id: string;
    fullName: string;
    avatar: string | null;
    businessName: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: Date;
  } | null;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt: Date | null;
  createdAt: Date;
  sender: {
    id: string;
    fullName: string;
    avatar: string | null;
  };
}

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated || !user) {
    setLocation("/login");
    return null;
  }

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['/api/conversations', user.id],
    queryFn: async () => {
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      return response.json();
    },
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['/api/conversations', selectedConversation, 'messages'],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const response = await fetch(`/api/conversations/${selectedConversation}/messages?userId=${user.id}`);
      return response.json();
    },
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageForm = useForm<SendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { content: "" },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string; conversationId?: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        ...data,
        senderId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      sendMessageForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', selectedConversation, 'messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Edit message mutation
  const editMessageForm = useForm<EditMessageForm>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: { content: "" },
  });

  const editMessageMutation = useMutation({
    mutationFn: async (data: { messageId: string; content: string }) => {
      const response = await apiRequest("PATCH", `/api/messages/${data.messageId}`, {
        userId: user.id,
        content: data.content,
      });
      return response.json();
    },
    onSuccess: () => {
      setEditingMessage(null);
      editMessageForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', selectedConversation, 'messages'] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await apiRequest("DELETE", `/api/messages/${messageId}?userId=${user.id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', selectedConversation, 'messages'] });
    },
  });

  const onSendMessage = (data: SendMessageForm) => {
    const selectedConv = conversations.find((c: Conversation) => c.id === selectedConversation);
    if (!selectedConv) return;

    sendMessageMutation.mutate({
      receiverId: selectedConv.otherUser.id,
      content: data.content,
      conversationId: selectedConversation || undefined,
    });
  };

  const onEditMessage = (data: EditMessageForm) => {
    if (!editingMessage) return;
    editMessageMutation.mutate({
      messageId: editingMessage,
      content: data.content,
    });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessage(message.id);
    editMessageForm.setValue("content", message.content);
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
    editMessageForm.reset();
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date | string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <img 
                src="https://sharesmallbiz.com/img/ShareSmallBiz.svg" 
                alt="ShareSmallBiz Logo" 
                className="h-6 w-auto"
              />
              <span className="text-sm font-medium text-gray-700">ShareSmallBiz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Conversations</span>
                </CardTitle>
                <StartConversationDialog 
                  trigger={
                    <Button variant="outline" size="sm" data-testid="button-new-conversation">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loadingConversations ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations yet</div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation: Conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                          selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        data-testid={`conversation-${conversation.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={conversation.otherUser.avatar || ""}
                              alt={conversation.otherUser.fullName}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(conversation.otherUser.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.otherUser.fullName}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            
                            {conversation.otherUser.businessName && (
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.otherUser.businessName}
                              </p>
                            )}
                            
                            {conversation.lastMessage && (
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-600 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatTime(conversation.lastMessage.createdAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const selectedConv = conversations.find((c: Conversation) => c.id === selectedConversation);
                      return selectedConv ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={selectedConv.otherUser.avatar || ""}
                              alt={selectedConv.otherUser.fullName}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(selectedConv.otherUser.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-base">{selectedConv.otherUser.fullName}</span>
                            {selectedConv.otherUser.businessName && (
                              <p className="text-sm text-gray-500 font-normal">
                                {selectedConv.otherUser.businessName}
                              </p>
                            )}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </CardTitle>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-[380px] p-4">
                    {loadingMessages ? (
                      <div className="text-center text-gray-500 py-8">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message: Message) => {
                          const isOwnMessage = message.senderId === user.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? "order-2" : "order-1"}`}>
                                <div
                                  className={`px-4 py-2 rounded-lg ${
                                    isOwnMessage
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  {editingMessage === message.id ? (
                                    <form onSubmit={editMessageForm.handleSubmit(onEditMessage)} className="space-y-2">
                                      <Textarea
                                        {...editMessageForm.register("content")}
                                        className="min-h-[60px] text-sm"
                                        data-testid={`edit-message-${message.id}`}
                                      />
                                      <div className="flex space-x-2">
                                        <Button
                                          type="submit"
                                          size="sm"
                                          disabled={editMessageMutation.isPending}
                                          data-testid="button-save-edit"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={cancelEditMessage}
                                          data-testid="button-cancel-edit"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </form>
                                  ) : (
                                    <p className="text-sm">{message.content}</p>
                                  )}
                                </div>
                                
                                <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(message.createdAt)}
                                  </span>
                                  {message.isEdited && (
                                    <span className="text-xs text-gray-400">(edited)</span>
                                  )}
                                  {isOwnMessage && (
                                    <div className="flex items-center space-x-1">
                                      {message.isRead ? (
                                        <CheckCheck className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <Check className="h-3 w-3 text-gray-400" />
                                      )}
                                    </div>
                                  )}
                                  
                                  {isOwnMessage && editingMessage !== message.id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          data-testid={`message-menu-${message.id}`}
                                        >
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() => startEditMessage(message)}
                                          data-testid={`edit-message-${message.id}`}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => deleteMessageMutation.mutate(message.id)}
                                          className="text-destructive"
                                          data-testid={`delete-message-${message.id}`}
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>

                <Separator />

                {/* Message Input */}
                <CardContent className="p-4">
                  <form onSubmit={sendMessageForm.handleSubmit(onSendMessage)} className="flex space-x-2">
                    <Textarea
                      {...sendMessageForm.register("content")}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[50px] max-h-[120px] resize-none"
                      data-testid="input-message"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessageForm.handleSubmit(onSendMessage)();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={sendMessageMutation.isPending}
                      className="self-end"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}