import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "../components/navigation-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Eye, ThumbsUp, Users, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Analytics() {
  const { user: authUser, isAuthenticated } = useAuth();

  // First fetch the user to get their userName for the profile endpoint
  const { data: userModel } = useQuery({
    queryKey: ["users", authUser?.userId],
    queryFn: () => api.users.get(authUser!.userId),
    enabled: !!authUser?.userId,
  });

  // Then fetch the profile (with analytics) by userName slug
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profiles", userModel?.userName],
    queryFn: () => api.profiles.getProfile(userModel!.userName),
    enabled: !!userModel?.userName,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 text-lg">Sign in to view your analytics.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const analytics = profile?.analytics;

  // Build chart data from recentViews record
  const viewsChartData = analytics?.recentViews
    ? Object.entries(analytics.recentViews).map(([date, count]) => ({
        date,
        views: count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your profile performance and engagement
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.totalViews ?? profile?.profileViewCount ?? 0}
              </div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.engagement.totalLikes ?? profile?.likeCount ?? 0}
              </div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.engagement.followerCount ?? 0}
              </div>
              <div className="text-sm text-gray-600">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {profile?.postCount ?? 0}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </CardContent>
          </Card>
        </div>

        {/* Views Over Time */}
        {viewsChartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Views Over Time</CardTitle>
              <CardDescription>Recent profile view history</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={viewsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3B82F6" name="Profile Views" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Geo Distribution */}
        {analytics?.geoDistribution &&
          Object.keys(analytics.geoDistribution).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Audience by Location</CardTitle>
                <CardDescription>Where your profile visitors are from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.geoDistribution).map(
                    ([location, count]) => {
                      const max = Math.max(
                        ...Object.values(analytics.geoDistribution)
                      );
                      return (
                        <div
                          key={location}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700 w-32">{location}</span>
                          <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(count / max) * 100}%` }}
                            />
                          </div>
                          <span className="font-semibold w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {!analytics && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">
                Analytics are available once your profile has received views.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
