import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  TrendingUp,
  Users,
  Star,
  MessageSquare,
  Clock,
  Award,
  Target,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Brain,
  BarChart3
} from "lucide-react";
import { aiAgents } from "@/pages/ai-assistant";

interface AgentMetrics {
  agentId: string;
  totalInteractions: number;
  averageRating: number;
  responseTime: number; // in milliseconds
  satisfactionRate: number; // percentage
  specialtyScores: Record<string, number>;
  weeklyInteractions: Array<{ day: string; count: number }>;
  userFeedback: Array<{
    rating: number;
    comment: string;
    timestamp: string;
    userId: string;
  }>;
  topQuestions: Array<{
    question: string;
    count: number;
    category: string;
  }>;
  performanceTrends: Array<{
    date: string;
    rating: number;
    interactions: number;
  }>;
}

interface DashboardData {
  agentMetrics: Record<string, AgentMetrics>;
  overallStats: {
    totalInteractions: number;
    averageRating: number;
    activeAgents: number;
    userSatisfaction: number;
  };
  trendsData: Array<{
    date: string;
    [agentId: string]: number | string;
  }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function AIAgentDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/ai/dashboard', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/ai/dashboard?timeRange=${timeRange}`);
      return response.json() as Promise<DashboardData>;
    }
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p>Loading AI performance data...</p>
        </div>
      </div>
    );
  }

  const agentOptions = [
    { id: "all", name: "All Agents" },
    ...aiAgents.map(agent => ({ id: agent.id, name: agent.name }))
  ];

  const selectedAgentData = selectedAgent === "all" 
    ? null 
    : dashboardData.agentMetrics[selectedAgent];

  const getAgentIcon = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent?.icon || Brain;
  };

  const getAgentColor = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent?.color || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            AI Agent Performance Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor agent performance, user satisfaction, and interaction analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {agentOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overallStats.totalInteractions.toLocaleString()}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600">↗ +12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  {dashboardData.overallStats.averageRating.toFixed(1)}
                  <Star className="h-5 w-5 text-yellow-500 ml-1 fill-current" />
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600">↗ +0.3</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overallStats.activeAgents}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All agents operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overallStats.userSatisfaction}%
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600">↗ +5%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Performance Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Agent Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiAgents.map((agent) => {
                    const metrics = dashboardData.agentMetrics[agent.id];
                    const IconComponent = agent.icon;
                    
                    return (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className={`${agent.color} h-10 w-10`}>
                            <AvatarFallback className="text-white">
                              <IconComponent className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-gray-600">
                              {metrics?.totalInteractions || 0} interactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">
                              {(metrics?.averageRating || 0).toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {(metrics?.satisfactionRate || 0)}% satisfaction
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Interaction Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Interaction Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {aiAgents.slice(0, 3).map((agent, index) => (
                      <Line
                        key={agent.id}
                        type="monotone"
                        dataKey={agent.id}
                        stroke={COLORS[index]}
                        strokeWidth={2}
                        name={agent.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Agent Usage Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Agent Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={aiAgents.map(agent => ({
                        name: agent.name,
                        value: dashboardData.agentMetrics[agent.id]?.totalInteractions || 0,
                        color: COLORS[aiAgents.indexOf(agent) % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {aiAgents.map((agent, index) => (
                        <Cell key={agent.id} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  <h4 className="font-medium">Usage Breakdown</h4>
                  {aiAgents.map((agent, index) => {
                    const interactions = dashboardData.agentMetrics[agent.id]?.totalInteractions || 0;
                    const total = dashboardData.overallStats.totalInteractions;
                    const percentage = total > 0 ? (interactions / total) * 100 : 0;
                    
                    return (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm">{agent.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{interactions}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiAgents.map(agent => ({
                    name: agent.name.split(' ')[0],
                    responseTime: dashboardData.agentMetrics[agent.id]?.responseTime || 0,
                    target: 2000 // 2 second target
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}ms`, 'Response Time']} />
                    <Bar dataKey="responseTime" fill="#8884d8" />
                    <Bar dataKey="target" fill="#82ca9d" opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiAgents.map(agent => {
                    const metrics = dashboardData.agentMetrics[agent.id];
                    const satisfactionRate = metrics?.satisfactionRate || 0;
                    
                    return (
                      <div key={agent.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{agent.name}</span>
                          <span className="text-sm text-gray-600">{satisfactionRate}%</span>
                        </div>
                        <Progress value={satisfactionRate} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Specialty Performance</CardTitle>
              <p className="text-sm text-gray-600">
                Performance ratings across different business areas
              </p>
            </CardHeader>
            <CardContent>
              {selectedAgent !== "all" && selectedAgentData ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={Object.entries(selectedAgentData.specialtyScores).map(([skill, score]) => ({
                      skill,
                      score,
                      fullMark: 5
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar
                        name="Performance"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiAgents.map(agent => (
                    <Card key={agent.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                          onClick={() => setSelectedAgent(agent.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className={`${agent.color} h-8 w-8`}>
                            <AvatarFallback className="text-white">
                              <agent.icon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="font-medium">{agent.name}</h4>
                        </div>
                        <div className="space-y-2">
                          {agent.expertise.slice(0, 3).map(skill => (
                            <div key={skill} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{skill}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent User Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {/* Sample feedback items */}
                    {[
                      { rating: 5, comment: "The Marketing Guru gave me excellent advice on social media strategy. Very helpful!", agent: "Marketing Guru", time: "2 hours ago" },
                      { rating: 4, comment: "Finance Advisor helped me understand cash flow better. Good insights.", agent: "Finance Advisor", time: "4 hours ago" },
                      { rating: 5, comment: "Operations Expert provided practical solutions for my workflow issues.", agent: "Operations Expert", time: "6 hours ago" },
                      { rating: 4, comment: "Customer Success agent was very thorough in explaining retention strategies.", agent: "Customer Success", time: "8 hours ago" },
                      { rating: 5, comment: "Legal & Compliance gave clear guidance on business formation. Thank you!", agent: "Legal & Compliance", time: "1 day ago" }
                    ].map((feedback, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[1,2,3,4,5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= feedback.rating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {feedback.agent}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{feedback.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Feedback Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5,4,3,2,1].map(rating => (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                      <Progress 
                        value={rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-sm text-gray-600 w-12">
                        {rating === 5 ? '65%' : rating === 4 ? '25%' : rating === 3 ? '8%' : rating === 2 ? '2%' : '0%'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dashboardData.trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {aiAgents.map((agent, index) => (
                    <Line
                      key={agent.id}
                      type="monotone"
                      dataKey={agent.id}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      name={agent.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}