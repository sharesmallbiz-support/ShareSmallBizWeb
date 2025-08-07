import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import {
  TrendingUp, TrendingDown, MessageSquare, FileText, Brain, Bell,
  Users, Award, Target, Calendar, Clock, Star, ThumbsUp, Eye,
  BarChart3, Activity, Zap, Network, Trophy, BookOpen
} from "lucide-react";

interface UserAnalytics {
  userId: string;
  username: string;
  joinDate: string;
  aiUsage: {
    totalInteractions: number;
    favoriteAgent: string;
    totalMinutesSpent: number;
    questionsAsked: number;
    conversationsSaved: number;
    avgSessionLength: number;
    weeklyUsage: Array<{ day: string; interactions: number }>;
    agentBreakdown: Array<{ agent: string; count: number; satisfaction: number }>;
    topCategories: Array<{ category: string; count: number }>;
  };
  postActivity: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    engagementRate: number;
    bestPerformingPost: { title: string; likes: number; comments: number };
    monthlyPosts: Array<{ month: string; posts: number; engagement: number }>;
    postTypes: Array<{ type: string; count: number; avgEngagement: number }>;
    reachMetrics: {
      totalViews: number;
      uniqueViewers: number;
      repeatViewers: number;
    };
  };
  messagingStats: {
    totalConversations: number;
    totalMessages: number;
    responseRate: number;
    avgResponseTime: number; // in minutes
    networkConnections: number;
    activeConversations: number;
    businessInquiries: number;
    collaborationRequests: number;
    monthlyMessages: Array<{ month: string; sent: number; received: number }>;
    topContacts: Array<{ name: string; messages: number; businessType: string }>;
  };
  businessGrowth: {
    profileViews: number;
    profileViewsGrowth: number;
    connectionRequests: number;
    businessOpportunities: number;
    skillEndorsements: number;
    businessScore: number;
    growthTrends: Array<{ month: string; score: number; opportunities: number }>;
    achievements: Array<{ title: string; date: string; description: string }>;
  };
  notifications: {
    totalNotifications: number;
    unreadCount: number;
    categories: Array<{ type: string; count: number }>;
    responseTime: number; // average time to respond to notifications
    weeklyActivity: Array<{ day: string; notifications: number; responses: number }>;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function UserAnalyticsDashboard({ userId }: { userId: string }) {
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/users/analytics', userId, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/analytics?timeRange=${timeRange}`);
      return response.json() as Promise<UserAnalytics>;
    }
  });

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p>Loading your business analytics...</p>
        </div>
      </div>
    );
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header with User Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-white">
              <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                {analytics.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{analytics.username}'s Business Analytics</h2>
              <p className="text-blue-100">Member since {new Date(analytics.joinDate).toLocaleDateString()}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Business Score: {analytics.businessGrowth.businessScore}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Network: {analytics.messagingStats.networkConnections} connections
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white text-sm"
            >
              <option value="7d" className="text-gray-900">Last 7 days</option>
              <option value="30d" className="text-gray-900">Last 30 days</option>
              <option value="90d" className="text-gray-900">Last 90 days</option>
              <option value="1y" className="text-gray-900">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">AI Interactions</p>
                <p className="text-2xl font-bold text-blue-900">
                  {analytics.aiUsage.totalInteractions.toLocaleString()}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {Math.round(analytics.aiUsage.totalMinutesSpent / 60)} hours of AI assistance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Content Engagement</p>
                <p className="text-2xl font-bold text-green-900">
                  {analytics.postActivity.engagementRate.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-700 mt-2">
              {analytics.postActivity.totalPosts} posts, {analytics.postActivity.totalLikes} likes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Network Growth</p>
                <p className="text-2xl font-bold text-purple-900">
                  {analytics.messagingStats.networkConnections}
                </p>
              </div>
              <Network className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-700 mt-2">
              {analytics.messagingStats.businessInquiries} business inquiries
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Business Score</p>
                <p className="text-2xl font-bold text-orange-900">
                  {analytics.businessGrowth.businessScore}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-orange-700 mt-2 flex items-center">
              <span className={getGrowthColor(analytics.businessGrowth.profileViewsGrowth)}>
                {analytics.businessGrowth.profileViewsGrowth >= 0 ? '↗' : '↘'} 
                {Math.abs(analytics.businessGrowth.profileViewsGrowth)}%
              </span>
              <span className="ml-1">this month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-usage">AI Usage</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">AI Conversations</p>
                        <p className="text-sm text-gray-600">
                          Most used: {analytics.aiUsage.favoriteAgent}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{analytics.aiUsage.totalInteractions}</p>
                      <p className="text-sm text-gray-600">interactions</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">Content Creation</p>
                        <p className="text-sm text-gray-600">
                          {analytics.postActivity.engagementRate.toFixed(1)}% avg engagement
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{analytics.postActivity.totalPosts}</p>
                      <p className="text-sm text-gray-600">posts</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium">Business Networking</p>
                        <p className="text-sm text-gray-600">
                          {analytics.messagingStats.responseRate}% response rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{analytics.messagingStats.totalMessages}</p>
                      <p className="text-sm text-gray-600">messages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Business Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.businessGrowth.growthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      name="Business Score"
                    />
                    <Area
                      type="monotone"
                      dataKey="opportunities"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                      name="Opportunities"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.businessGrowth.achievements.slice(0, 5).map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(achievement.date).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Usage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.aiUsage.agentBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({agent, percent}) => `${agent}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.aiUsage.agentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly AI Usage Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.aiUsage.weeklyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="interactions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Performance & Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.aiUsage.agentBreakdown.map((agent, index) => (
                  <div key={agent.agent} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{agent.agent}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{agent.count} interactions</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{agent.satisfaction.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={(agent.count / analytics.aiUsage.totalInteractions) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">
                      {analytics.postActivity.reachMetrics.totalViews.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {analytics.postActivity.totalLikes}
                    </p>
                    <p className="text-sm text-green-600">Total Likes</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">
                      {analytics.postActivity.totalComments}
                    </p>
                    <p className="text-sm text-purple-600">Total Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Content & Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.postActivity.monthlyPosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Posts"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Engagement Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Best Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">
                      {analytics.postActivity.bestPerformingPost.title}
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {analytics.postActivity.bestPerformingPost.likes} likes • 
                      {analytics.postActivity.bestPerformingPost.comments} comments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Messaging Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.messagingStats.monthlyMessages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      name="Sent"
                    />
                    <Area
                      type="monotone"
                      dataKey="received"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                      name="Received"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-blue-600" />
                      <span>Total Connections</span>
                    </div>
                    <span className="font-bold text-xl">{analytics.messagingStats.networkConnections}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <span>Active Conversations</span>
                    </div>
                    <span className="font-bold text-xl">{analytics.messagingStats.activeConversations}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-6 w-6 text-purple-600" />
                      <span>Business Inquiries</span>
                    </div>
                    <span className="font-bold text-xl">{analytics.messagingStats.businessInquiries}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                      <span>Avg Response Time</span>
                    </div>
                    <span className="font-bold text-xl">{analytics.messagingStats.avgResponseTime}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Business Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.messagingStats.topContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.businessType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{contact.messages}</p>
                      <p className="text-sm text-gray-600">messages</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[
                        { name: 'Score', value: analytics.businessGrowth.businessScore, fill: '#8884d8' }
                      ]}>
                        <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{analytics.businessGrowth.businessScore}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Overall Business Score</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Views</span>
                    <span className="font-medium">{analytics.businessGrowth.profileViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection Requests</span>
                    <span className="font-medium">{analytics.businessGrowth.connectionRequests}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Business Opportunities</span>
                    <span className="font-medium">{analytics.businessGrowth.businessOpportunities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Skill Endorsements</span>
                    <span className="font-medium">{analytics.businessGrowth.skillEndorsements}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.businessGrowth.growthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={3}
                      name="Business Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="opportunities"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Opportunities"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Notification Categories</h4>
                  <div className="space-y-2">
                    {analytics.notifications.categories.map((category, index) => (
                      <div key={category.type} className="flex justify-between items-center">
                        <span className="text-sm">{category.type}</span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(category.count / analytics.notifications.totalNotifications) * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-medium">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Weekly Activity</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.notifications.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="notifications" fill="#8884d8" name="Received" />
                      <Bar dataKey="responses" fill="#82ca9d" name="Responded" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}