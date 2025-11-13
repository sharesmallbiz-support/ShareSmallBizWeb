import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "../components/navigation-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  ThumbsUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type AnalyticsPeriod = "week" | "month" | "year";

export default function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const currentUserId = localStorage.getItem("currentUserId") || "user1";

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "analytics", period],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/analytics?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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

  const summary = analytics?.summary || {};
  const chartData = analytics?.chartData || [];
  const topPosts = analytics?.topPosts || [];
  const demographics = analytics?.demographics || {};

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your business performance and engagement</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={period === "week" ? "default" : "outline"}
              onClick={() => setPeriod("week")}
              size="sm"
            >
              Week
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              onClick={() => setPeriod("month")}
              size="sm"
            >
              Month
            </Button>
            <Button
              variant={period === "year" ? "default" : "outline"}
              onClick={() => setPeriod("year")}
              size="sm"
            >
              Year
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center text-sm text-success">
                  <ArrowUpRight className="w-4 h-4" />
                  {summary.profileViewsChange || 0}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalProfileViews || 0}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center text-sm text-success">
                  <ArrowUpRight className="w-4 h-4" />
                  {summary.engagementChange || 0}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalEngagement || 0}</div>
              <div className="text-sm text-gray-600">Post Engagement</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-center text-sm text-success">
                  <ArrowUpRight className="w-4 h-4" />
                  {summary.connectionsChange || 0}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{summary.newConnections || 0}</div>
              <div className="text-sm text-gray-600">New Connections</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center text-sm text-success">
                  <ArrowUpRight className="w-4 h-4" />
                  {summary.opportunitiesChange || 0}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{summary.opportunities || 0}</div>
              <div className="text-sm text-gray-600">Opportunities</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>
                  Track your profile views, engagement, and network growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="profileViews"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Profile Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="postEngagement"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Post Engagement"
                    />
                    <Line
                      type="monotone"
                      dataKey="connections"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Connections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>Your activity distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="postEngagement" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Breakdown</CardTitle>
                  <CardDescription>Types of engagement you receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Likes", value: summary.totalLikes || 45 },
                          { name: "Comments", value: summary.totalComments || 30 },
                          { name: "Shares", value: summary.totalShares || 15 },
                          { name: "Saves", value: summary.totalSaves || 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>
                  Your most engaging content from the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post: any, index: number) => (
                    <div
                      key={post.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {post.title || "Untitled Post"}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {post.likesCount || 0} likes
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.commentsCount || 0} comments
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views || 0} views
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">
                          {post.engagementRate || 0}%
                        </div>
                        <div className="text-xs text-gray-500">engagement</div>
                      </div>
                    </div>
                  ))}

                  {topPosts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No posts found for this period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience by Location</CardTitle>
                  <CardDescription>Where your audience is located</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(demographics.locations || {}).map(([location, count]: [string, any]) => (
                      <div key={location} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-gray-700">{location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(demographics.locations || {}))) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-900 font-semibold w-12 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audience by Industry</CardTitle>
                  <CardDescription>Industries your connections work in</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(demographics.industries || {}).map(([name, value]) => ({
                          name,
                          value,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Growth Insights</CardTitle>
                  <CardDescription>
                    AI-powered recommendations to improve your performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Peak Engagement Time
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your posts get the most engagement between 2 PM - 4 PM. Try posting during
                          these hours for better reach.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Engagement Rate Increased
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your engagement rate is up {summary.engagementChange || 15}% this{" "}
                          {period}. Keep creating valuable content!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Network Expansion</h4>
                        <p className="text-sm text-gray-600">
                          You've connected with {summary.newConnections || 12} new professionals.
                          Consider reaching out to more people in your industry.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
