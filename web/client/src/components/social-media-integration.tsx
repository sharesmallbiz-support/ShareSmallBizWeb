import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Share,
  Calendar,
  Rss
} from "lucide-react";

export default function SocialMediaIntegration() {
  // Mock data for Facebook and YouTube integration
  const facebookPosts = [
    {
      id: "fb1",
      content: "Just launched our new product line! Excited to serve our community better.",
      likes: 45,
      comments: 12,
      shares: 8,
      timestamp: "2 hours ago",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    },
    {
      id: "fb2", 
      content: "Thank you to everyone who attended our grand opening! The support means everything.",
      likes: 87,
      comments: 23,
      shares: 15,
      timestamp: "1 day ago",
      image: null
    }
  ];

  const youtubeChannels = [
    {
      id: "yt1",
      channelName: "Smith's Hardware Tips",
      subscribers: "1.2K",
      latestVideo: {
        title: "5 Essential Tools Every Home Should Have",
        views: "847",
        duration: "8:42",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop"
      }
    },
    {
      id: "yt2",
      channelName: "Local Business Stories",
      subscribers: "854",
      latestVideo: {
        title: "How Small Businesses Are Thriving in 2024",
        views: "523",
        duration: "12:15",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop"
      }
    }
  ];

  const socialMetrics = {
    totalReach: 15420,
    engagement: 8.7,
    crossPlatformGrowth: 23
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-gray mb-4">
            Social Media Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consolidate and display your Facebook and YouTube content to showcase your business across all platforms
          </p>
        </div>

        {/* Social Metrics Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="metric-total-reach">
                {socialMetrics.totalReach.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Reach</div>
              <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
                Across all platforms
              </Badge>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2" data-testid="metric-engagement">
                {socialMetrics.engagement}%
              </div>
              <div className="text-sm text-gray-600">Avg. Engagement</div>
              <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                +2.3% vs last month
              </Badge>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2" data-testid="metric-growth">
                +{socialMetrics.crossPlatformGrowth}%
              </div>
              <div className="text-sm text-gray-600">Cross-Platform Growth</div>
              <Badge variant="secondary" className="mt-2 bg-secondary/10 text-secondary">
                This quarter
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Facebook & YouTube Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Facebook Integration */}
          <Card className="professional-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold">
                  f
                </div>
                Facebook Activity
              </CardTitle>
              <Button variant="outline" size="sm" data-testid="button-view-facebook">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Page
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {facebookPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop" alt="Business Page" />
                      <AvatarFallback>SH</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Smith's Local Hardware</div>
                      <div className="text-xs text-gray-500">{post.timestamp}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3" data-testid={`facebook-post-${post.id}`}>
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-1 text-white text-xs">👍</span>
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {post.comments}
                      </span>
                      <span className="flex items-center">
                        <Share className="h-3 w-3 mr-1" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-connect-facebook"
              >
                <Rss className="h-4 w-4 mr-2" />
                Connect More Facebook Pages
              </Button>
            </CardContent>
          </Card>

          {/* YouTube Integration */}
          <Card className="professional-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 text-white">
                  <Play className="h-4 w-4" />
                </div>
                YouTube Channels
              </CardTitle>
              <Button variant="outline" size="sm" data-testid="button-view-youtube">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Channel
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {youtubeChannels.map((channel) => (
                <div key={channel.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900" data-testid={`youtube-channel-${channel.id}`}>
                        {channel.channelName}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {channel.subscribers} subscribers
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img 
                        src={channel.latestVideo.thumbnail} 
                        alt="Video thumbnail" 
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {channel.latestVideo.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900 mb-1" data-testid={`youtube-video-${channel.id}`}>
                        {channel.latestVideo.title}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {channel.latestVideo.views} views
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-connect-youtube"
              >
                <Play className="h-4 w-4 mr-2" />
                Connect More YouTube Channels
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cross-Platform Analytics */}
        <div className="mt-12">
          <Card className="ai-enhanced-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-3 h-5 w-5 text-ai-purple" />
                Cross-Platform Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Performance</h4>
                  <p className="text-sm text-gray-600">Your video content performs 45% better than text posts across all platforms</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <div className="text-2xl mb-2">⏰</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optimal Timing</h4>
                  <p className="text-sm text-gray-600">Best engagement happens on Tuesday at 10 AM and Thursday at 3 PM</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Audience Growth</h4>
                  <p className="text-sm text-gray-600">Your local audience is growing 3x faster than national reach</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}