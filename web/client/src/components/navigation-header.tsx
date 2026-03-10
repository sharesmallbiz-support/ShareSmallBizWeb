import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "./login-dialog";

export default function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img
                src="https://sharesmallbiz.com/img/ShareSmallBiz.svg"
                alt="ShareSmallBiz Logo"
                className="h-8 w-auto"
                data-testid="img-logo"
              />
              <span className="text-xl font-bold text-primary">ShareSmallBiz</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search businesses, opportunities, discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-2"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Auth / User menu */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 p-0"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.displayName?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 hover:text-primary hidden sm:block">
                        {user?.displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      data-testid="menu-profile"
                      onClick={() => navigate("/profile")}
                    >
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      data-testid="menu-settings"
                      onClick={() => navigate("/settings")}
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      data-testid="menu-analytics"
                      onClick={() => navigate("/analytics")}
                    >
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      data-testid="menu-logout"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogin(true)}
                    data-testid="button-login"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowLogin(true)}
                    data-testid="button-register"
                  >
                    Join Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
