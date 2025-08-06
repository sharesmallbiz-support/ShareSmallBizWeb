import { useState } from "react";
import { Link } from "wouter";
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
import { Search, Bell, Mail, Bot, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
            {isAuthenticated && (
              <>
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
              </>
            )}

            {/* User Profile or Login Link */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-0" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.avatar || ""} 
                        alt={user.fullName}
                      />
                      <AvatarFallback className="bg-primary text-white">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 hover:text-primary hidden sm:block">
                      {user.fullName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem data-testid="menu-profile">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-business">
                    Business Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-analytics">
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    data-testid="menu-logout"
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" data-testid="button-login-nav">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
