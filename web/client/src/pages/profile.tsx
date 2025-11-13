import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationHeader from "../components/navigation-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../components/post-card";
import { MapPin, Briefcase, Link as LinkIcon, Calendar, Users, TrendingUp } from "lucide-react";

export default function Profile() {
  const [, navigate] = useLocation();

  // Get current user ID from localStorage or use a default
  const currentUserId = localStorage.getItem("currentUserId") || "user1";

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
  });

  // Fetch user posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "posts"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  // Fetch activity feed
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "activities"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/activities`);
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
  });

  // Fetch business metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/users", currentUserId, "metrics"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/metrics`);
      if (!response.ok) throw new Error("Failed to fetch metrics");
      return response.json();
    },
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full max-w-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-3xl">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.fullName}</h1>
                    <p className="text-gray-600">@{user?.username}</p>
                  </div>
                  <Button
                    onClick={() => navigate("/settings")}
                    variant="outline"
                  >
                    Edit Profile
                  </Button>
                </div>

                {user?.bio && (
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {user?.businessName && (
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {user.businessName}
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user?.website && (
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex gap-6 mt-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-semibold">{user?.connections || 0}</span>
                    <span className="text-gray-600 ml-1">Connections</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-success" />
                    <span className="font-semibold">{user?.businessScore || 0}</span>
                    <span className="text-gray-600 ml-1">Business Score</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Profile Views</div>
                <div className="text-2xl font-bold text-gray-900">{metrics.profileViews || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Network Growth</div>
                <div className="text-2xl font-bold text-success">+{metrics.networkGrowth || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Opportunities</div>
                <div className="text-2xl font-bold text-primary">{metrics.opportunities || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">Engagement Score</div>
                <div className="text-2xl font-bold text-secondary">{metrics.engagementScore || 0}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for Posts and Activity */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {postsLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No posts yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-64 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity: any) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activity.actor?.avatar} />
                          <AvatarFallback>
                            {activity.actor?.fullName?.charAt(0) || activity.actor?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{activity.actor?.fullName || activity.actor?.username}</span>
                            {' '}{activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No recent activity</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
