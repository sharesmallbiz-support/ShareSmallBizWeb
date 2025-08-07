import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useStartConversation } from "@/hooks/use-messages";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MessageSquare, Search, Send, User } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string;
  businessName: string | null;
  businessType: string | null;
  location: string | null;
  avatar: string | null;
  bio: string | null;
  connections: number;
  businessScore: number;
}

interface StartConversationDialogProps {
  trigger?: React.ReactNode;
  selectedUserId?: string;
}

export default function StartConversationDialog({ 
  trigger, 
  selectedUserId 
}: StartConversationDialogProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  // Fetch all users for selection
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      return response.json();
    },
    enabled: open,
  });

  // Get selected user info if selectedUserId is provided
  const { data: preSelectedUser } = useQuery({
    queryKey: ['/api/users', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await fetch(`/api/users/${selectedUserId}`);
      return response.json();
    },
    enabled: !!selectedUserId && open,
  });

  const startConversation = useStartConversation();

  // Filter users excluding current user
  const filteredUsers = users
    .filter((u: User) => u.id !== user?.id)
    .filter((u: User) => 
      searchQuery === "" || 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Set pre-selected user when dialog opens or when preSelectedUser changes
  React.useEffect(() => {
    if (preSelectedUser && open) {
      setSelectedUser(preSelectedUser);
    }
  }, [preSelectedUser, open]);

  React.useEffect(() => {
    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
    }
  }, [preSelectedUser]);

  const handleSendMessage = () => {
    if (!selectedUser || !message.trim()) return;

    startConversation.mutate(
      {
        receiverId: selectedUser.id,
        content: message,
      },
      {
        onSuccess: () => {
          toast({
            title: "Message sent!",
            description: `Your message has been sent to ${selectedUser.fullName}`,
          });
          setOpen(false);
          setMessage("");
          setSelectedUser(null);
          setLocation("/messages");
        },
        onError: (error: any) => {
          toast({
            title: "Failed to send message",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const defaultTrigger = (
    <Button className="flex items-center space-x-2" data-testid="button-start-conversation">
      <MessageSquare className="h-4 w-4" />
      <span>Start Conversation</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Select a user and send them a message to start a conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedUser ? (
            <>
              {/* User Search and Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User</label>
                <Command className="rounded-lg border shadow-md">
                  <CommandInput
                    placeholder="Search for users..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    data-testid="input-search-users"
                  />
                  <CommandList>
                    <ScrollArea className="h-[200px]">
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {isLoading ? (
                          <div className="p-4 text-center text-gray-500">Loading users...</div>
                        ) : (
                          filteredUsers.map((userOption: User) => (
                            <CommandItem
                              key={userOption.id}
                              onSelect={() => setSelectedUser(userOption)}
                              className="cursor-pointer"
                              data-testid={`user-option-${userOption.id}`}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={userOption.avatar || ""}
                                    alt={userOption.fullName}
                                  />
                                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                    {getInitials(userOption.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{userOption.fullName}</p>
                                  {userOption.businessName && (
                                    <p className="text-xs text-gray-500">{userOption.businessName}</p>
                                  )}
                                  {userOption.location && (
                                    <p className="text-xs text-gray-400">{userOption.location}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {userOption.connections} connections
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Score: {userOption.businessScore}
                                  </Badge>
                                </div>
                              </div>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </div>
            </>
          ) : (
            <>
              {/* Selected User Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sending message to:</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedUser.avatar || ""}
                      alt={selectedUser.fullName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(selectedUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{selectedUser.fullName}</p>
                    {selectedUser.businessName && (
                      <p className="text-sm text-gray-600">{selectedUser.businessName}</p>
                    )}
                    {selectedUser.location && (
                      <p className="text-sm text-gray-500">{selectedUser.location}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    data-testid="button-change-user"
                  >
                    Change
                  </Button>
                </div>
              </div>

              {/* Message Composition */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[120px]"
                  data-testid="textarea-message"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setSelectedUser(null);
                    setMessage("");
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || startConversation.isPending}
                  data-testid="button-send"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {startConversation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}