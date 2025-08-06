import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Zap, 
  ArrowRight,
  MapPin,
  Clock
} from "lucide-react";

export default function RightSidebar() {
  // Mock data for now - replace with real API calls
  const businessMetrics = {
    profileViews: 127,
    networkGrowth: 23,
    opportunities: 5,
    engagementScore: 84
  };

  const trendingTopics = [
    { tag: "#SmallBusinessTips", count: 142 },
    { tag: "#LocalPartnership", count: 89 },
    { tag: "#DigitalMarketing", count: 76 },
    { tag: "#Networking", count: 54 },
    { tag: "#AI4Business", count: 41 }
  ];

  const suggestedConnections = [
    {
      id: "1",
      name: "Mike Chen",
      businessName: "Tech Solutions Inc.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
    },
    {
      id: "2",
      name: "Lisa Johnson",
      businessName: "Creative Marketing",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
    },
    {
      id: "3",
      name: "David Rodriguez",
      businessName: "Local Consulting",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
    }
  ];

  const upcomingEvents = [
    {
      id: "1",
      title: "Small Business Networking",
      location: "Portland Business Center",
      date: "15",
      month: "MAR",
      time: "6:00 PM - 8:00 PM"
    },
    {
      id: "2",
      title: "Digital Marketing Workshop",
      location: "Online Webinar",
      date: "22",
      month: "MAR",
      time: "2:00 PM - 4:00 PM"
    }
  ];

  const communityStats = {
    activeMembers: 2847,
    partnerships: 156,
    opportunities: 489,
    aiInteractions: 1200
  };

  return (
    <div className="space-y-6">
      {/* Business Analytics Widget */}
      <Card className="business-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Your Business Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profile Views</span>
            <div className="text-right">
              <span className="font-semibold" data-testid="metric-profile-views">
                {businessMetrics.profileViews}
              </span>
              <span className="text-xs text-success ml-1">+12%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Network Growth</span>
            <div className="text-right">
              <span className="font-semibold" data-testid="metric-network-growth">
                {businessMetrics.networkGrowth}
              </span>
              <span className="text-xs text-success ml-1">+8%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Opportunities</span>
            <div className="text-right">
              <span className="font-semibold" data-testid="metric-opportunities">
                {businessMetrics.opportunities}
              </span>
              <Badge variant="secondary" className="ml-1 text-xs">New</Badge>
            </div>
          </div>
          <Button 
            variant="link" 
            className="w-full text-center text-primary p-0"
            data-testid="button-view-analytics"
          >
            View Full Analytics →
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="business-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">🔥 Trending in Business</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              data-testid={`trend-${index}`}
            >
              <div>
                <p className="font-medium text-sm">{topic.tag}</p>
                <p className="text-xs text-gray-600">{topic.count} posts today</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card className="business-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedConnections.map((connection) => (
            <div key={connection.id} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm" data-testid={`connection-name-${connection.id}`}>
                  {connection.name}
                </p>
                <p className="text-xs text-gray-600" data-testid={`connection-business-${connection.id}`}>
                  {connection.businessName}
                </p>
              </div>
              <Button 
                size="sm" 
                className="text-xs"
                data-testid={`button-connect-${connection.id}`}
              >
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="business-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5 text-secondary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              data-testid={`event-${event.id}`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-secondary bg-opacity-20 text-secondary p-2 rounded-lg text-center min-w-[48px]">
                  <p className="text-xs font-bold">{event.date}</p>
                  <p className="text-xs">{event.month}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-center">Community Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary" data-testid="stat-members">
                {communityStats.activeMembers.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Active Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success" data-testid="stat-partnerships">
                {communityStats.partnerships}
              </p>
              <p className="text-xs text-gray-600">Partnerships</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-opportunities">
                {communityStats.opportunities}
              </p>
              <p className="text-xs text-gray-600">Opportunities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ai-purple" data-testid="stat-ai-interactions">
                {(communityStats.aiInteractions / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-600">AI Assists</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
