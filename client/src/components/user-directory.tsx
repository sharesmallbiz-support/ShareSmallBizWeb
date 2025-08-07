import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import StartConversationDialog from "./start-conversation-dialog";
import { Users, MessageCircle, MapPin, Building2, Star } from "lucide-react";

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

export default function UserDirectory() {
  const { user: currentUser } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      return response.json();
    },
  });

  const filteredUsers = users
    .filter((u: User) => u.id !== currentUser?.id)
    .sort((a: User, b: User) => b.businessScore - a.businessScore)
    .slice(0, 8);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Connect with Entrepreneurs</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <div className="space-y-3 p-4">
              {filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user.fullName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(user.businessScore)}`} />
                        <span className="text-xs text-gray-500">{user.businessScore}</span>
                      </div>
                    </div>
                    
                    {user.businessName && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-600 truncate">
                          {user.businessName}
                        </p>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500 truncate">
                          {user.location}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {user.connections} connections
                      </Badge>
                      
                      <StartConversationDialog
                        selectedUserId={user.id}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            data-testid={`button-message-user-${user.id}`}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-3">
                <StartConversationDialog 
                  trigger={
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      data-testid="button-find-more-users"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Find More Entrepreneurs
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}