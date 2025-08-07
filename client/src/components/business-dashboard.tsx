import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  BarChart3,
  PieChart,
  ArrowUpRight,
  Lightbulb,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function BusinessDashboard() {
  // Mock data - replace with real API calls to your Microsoft Web API
  const dashboardMetrics = {
    networkGrowth: { value: 23, change: "+15%", period: "this month" },
    opportunities: { value: 12, change: "+8", period: "this week" },
    engagement: { value: 84, change: "+12%", period: "vs last month" },
    collaborations: { value: 5, change: "new", period: "pending" }
  };

  const quickInsights = [
    {
      icon: "🎯",
      title: "Partnership Opportunity",
      description: "3 businesses in your area match your collaboration criteria",
      action: "View Matches",
      color: "success"
    },
    {
      icon: "📈",
      title: "Growth Trend",
      description: "Your posts perform 32% better on Tuesday mornings",
      action: "Optimize Schedule",
      color: "business-blue"
    },
    {
      icon: "🤖",
      title: "AI Recommendation",
      description: "Try video content - it's trending in your industry",
      action: "Get Tips",
      color: "ai-purple"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-gray mb-4">
            Your Business Intelligence Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights powered by AI and community data to help you make smarter business decisions
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-gray mb-1" data-testid="metric-network-growth">
                {dashboardMetrics.networkGrowth.value}
              </h3>
              <p className="text-sm text-gray-600 mb-2">Network Growth</p>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                {dashboardMetrics.networkGrowth.change} {dashboardMetrics.networkGrowth.period}
              </Badge>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-dark-gray mb-1" data-testid="metric-opportunities">
                {dashboardMetrics.opportunities.value}
              </h3>
              <p className="text-sm text-gray-600 mb-2">New Opportunities</p>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {dashboardMetrics.opportunities.change} {dashboardMetrics.opportunities.period}
              </Badge>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-gray mb-1" data-testid="metric-engagement">
                {dashboardMetrics.engagement.value}%
              </h3>
              <p className="text-sm text-gray-600 mb-2">Engagement Score</p>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                {dashboardMetrics.engagement.change} {dashboardMetrics.engagement.period}
              </Badge>
            </CardContent>
          </Card>

          <Card className="ai-enhanced-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-ai-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-ai-purple" />
              </div>
              <h3 className="text-2xl font-bold text-dark-gray mb-1" data-testid="metric-collaborations">
                {dashboardMetrics.collaborations.value}
              </h3>
              <p className="text-sm text-gray-600 mb-2">Active Collaborations</p>
              <Badge variant="secondary" className="bg-ai-purple/10 text-ai-purple border-ai-purple/20">
                {dashboardMetrics.collaborations.change} {dashboardMetrics.collaborations.period}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* AI Smart Insights */}
          <div className="lg:col-span-2">
            <Card className="ai-enhanced-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="w-8 h-8 bg-ai-purple/10 rounded-lg flex items-center justify-center mr-3">
                    <Lightbulb className="h-4 w-4 text-ai-purple" />
                  </div>
                  AI-Powered Business Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickInsights.map((insight, index) => (
                  <div key={index} className="flex items-start p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors border border-gray-100">
                    <div className="text-2xl mr-4">{insight.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-gray mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      {insight.title === "AI Recommendation" ? (
                        <Link href="/ai-assistant">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            data-testid={`button-insight-${index}`}
                          >
                            {insight.action} <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          data-testid={`button-insight-${index}`}
                        >
                          {insight.action} <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/opportunities/new">
                  <Button 
                    className="w-full justify-start business-gradient text-white" 
                    data-testid="button-create-opportunity"
                  >
                    <Target className="mr-3 h-4 w-4" />
                    Post New Opportunity
                  </Button>
                </Link>
                <Button 
                  className="w-full justify-start collaboration-gradient text-white"
                  data-testid="button-schedule-meeting"
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  Schedule Collaboration
                </Button>
                <Link href="/ai-assistant">
                  <Button 
                    className="w-full justify-start ai-gradient text-white"
                    data-testid="button-ask-ai"
                  >
                    <MessageSquare className="mr-3 h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-view-analytics"
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  View Full Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Charts Preview */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Engagement Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Posts</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comments</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div className="w-3/5 h-2 bg-success rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collaborations</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div className="w-2/5 h-2 bg-secondary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="mr-2 h-5 w-5 text-success" />
                Weekly Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 space-x-2">
                {[40, 65, 45, 80, 55, 90, 75].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-success rounded-t w-full transition-all hover:bg-success/80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}