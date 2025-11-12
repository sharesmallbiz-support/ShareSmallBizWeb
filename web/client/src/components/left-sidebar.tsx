import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Handshake, 
  Calendar, 
  Store, 
  Bot,
  TrendingUp,
  Users,
  Star
} from "lucide-react";

export default function LeftSidebar() {
  // Mock user data
  const currentUser = {
    name: "John Smith",
    businessName: "Smith's Local Hardware",
    location: "Portland, OR",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    connections: 247,
    businessScore: 8.4
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="business-card">
        <CardContent className="p-6">
          <div className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg" data-testid="text-user-name">
              {currentUser.name}
            </h3>
            <p className="text-gray-600 text-sm" data-testid="text-business-name">
              {currentUser.businessName}
            </p>
            <p className="text-xs text-gray-500 mt-1" data-testid="text-location">
              {currentUser.location}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-semibold text-primary" data-testid="text-connections">
                {currentUser.connections}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Business Score</span>
              <div className="flex items-center">
                <span className="font-semibold text-success mr-1" data-testid="text-business-score">
                  {currentUser.businessScore}/10
                </span>
                <Star className="h-3 w-3 text-success fill-current" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Widget */}
      <Card className="ai-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Business Assistant</h3>
              <p className="text-xs text-purple-100">Always ready to help</p>
            </div>
          </div>
          <p className="text-sm mb-4 text-purple-100">
            Get instant advice on marketing, networking, and growth strategies.
          </p>
          <Button 
            className="bg-white text-ai-purple hover:bg-gray-100 w-full"
            data-testid="button-start-ai-chat"
          >
            Start Conversation
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="business-card">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              data-testid="button-create-post"
            >
              <Plus className="mr-3 h-4 w-4 text-primary" />
              <span className="text-sm">Create Post</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              data-testid="button-find-collaborators"
            >
              <Handshake className="mr-3 h-4 w-4 text-success" />
              <span className="text-sm">Find Collaborators</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              data-testid="button-local-events"
            >
              <Calendar className="mr-3 h-4 w-4 text-secondary" />
              <span className="text-sm">Local Events</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              data-testid="button-marketplace"
            >
              <Store className="mr-3 h-4 w-4 text-warm-gray" />
              <span className="text-sm">Marketplace</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
