import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Mail, Bot } from "lucide-react";

export default function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  // Mock user data
  const currentUser = {
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
    businessName: "Smith's Local Hardware"
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img 
              src="https://sharesmallbiz.com/img/ShareSmallBiz.svg" 
              alt="ShareSmallBiz Logo" 
              className="h-8 w-auto"
              data-testid="img-logo"
            />
            <span className="text-xl font-bold text-primary">ShareSmallBiz</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search businesses, opportunities, discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2"
                data-testid="input-search"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1 p-1 text-ai-purple hover:bg-purple-50"
                data-testid="button-ai-search"
              >
                <Bot className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-gray-600 hover:text-primary"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </div>
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-gray-600 hover:text-primary"
                data-testid="button-messages"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-primary"
              >
                5
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-0" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 hover:text-primary hidden sm:block">
                    {currentUser.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem data-testid="menu-profile" onClick={() => navigate("/profile")}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-business" onClick={() => navigate("/settings")}>
                  Business Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-analytics" onClick={() => navigate("/analytics")}>
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-logout">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
