import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationHeader from "../components/navigation-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../components/post-card";
import { Link as LinkIcon, Users, ThumbsUp, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DiscussionModel } from "@shared/schema";

export default function Profile() {
  const [, navigate] = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", authUser?.userId],
    queryFn: () => api.users.get(authUser!.userId),
    enabled: !!authUser?.userId,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 text-lg">
            Sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user?.profilePictureUrl} />
                <AvatarFallback className="text-3xl">
                  {user?.displayName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {user?.displayName}
                    </h1>
                    <p className="text-gray-600">@{user?.userName}</p>
                  </div>
                  <Button onClick={() => navigate("/settings")} variant="outline">
                    Edit Profile
                  </Button>
                </div>

                {user?.bio && (
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {user?.websiteUrl && (
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <a
                        href={user.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-6 mt-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-semibold">{user?.profileViewCount ?? 0}</span>
                    <span className="text-gray-600 ml-1">Profile Views</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-2 text-success" />
                    <span className="font-semibold">{user?.likeCount ?? 0}</span>
                    <span className="text-gray-600 ml-1">Likes</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-secondary" />
                    <span className="font-semibold">{user?.postCount ?? 0}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-1 max-w-xs">
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {user?.posts && user.posts.length > 0 ? (
              <div className="space-y-6">
                {(user.posts as DiscussionModel[]).map((post) => (
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
        </Tabs>
      </div>
    </div>
  );
}
