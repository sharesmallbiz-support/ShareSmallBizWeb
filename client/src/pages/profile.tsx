import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EditProfileModal from "@/components/edit-profile-modal";
import { 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  TrendingUp,
  Edit,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  BarChart3
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || !user) {
    setLocation("/login");
    return null;
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
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

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarImage 
                src={user.avatar || ""} 
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-white text-primary text-xl font-bold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold" data-testid="text-profile-name">
                    {user.fullName}
                  </h1>
                  <p className="text-white/90 text-lg mt-1" data-testid="text-profile-username">
                    @{user.username}
                  </p>
                </div>
                <EditProfileModal>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    data-testid="button-edit-profile"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </EditProfileModal>
              </div>
              
              {user.bio && (
                <p className="text-white/90 mt-3 max-w-2xl" data-testid="text-profile-bio">
                  {user.bio}
                </p>
              )}
              
              <div className="flex items-center space-x-6 mt-4 text-white/80">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-profile-location">{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      data-testid="link-profile-website"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="text-profile-joined">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            {user.businessName && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Business Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid="text-business-name">
                      {user.businessName}
                    </h3>
                    {user.businessType && (
                      <Badge variant="secondary" className="mt-1" data-testid="badge-business-type">
                        {user.businessType}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Network Size</p>
                        <p className="font-semibold" data-testid="text-connections">
                          {user.connections} connections
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Business Score</p>
                        <p className="font-semibold text-green-600" data-testid="text-business-score">
                          {user.businessScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium" data-testid="text-profile-email">
                      {user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Recent posts and activities will appear here
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/user-analytics">
                  <Button 
                    className="w-full justify-start" 
                    variant="default"
                    data-testid="button-view-analytics"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics Dashboard
                  </Button>
                </Link>
                <Link href="/business-settings">
                  <Button className="w-full justify-start" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Business Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-semibold">0</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-semibold">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.businessType && (
                    <Badge variant="outline">{user.businessType}</Badge>
                  )}
                  <Badge variant="outline">Small Business</Badge>
                  <Badge variant="outline">Networking</Badge>
                  <Badge variant="outline">Community</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">★</span>
                    </div>
                    <div>
                      <p className="font-medium">Community Member</p>
                      <p className="text-sm text-gray-500">Joined ShareSmallBiz</p>
                    </div>
                  </div>
                  
                  {user.connections > 50 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Networker</p>
                        <p className="text-sm text-gray-500">50+ connections</p>
                      </div>
                    </div>
                  )}
                  
                  {user.businessScore > 80 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Top Performer</p>
                        <p className="text-sm text-gray-500">High business score</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}