import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  ArrowUpRight,
  Eye,
  ThumbsUp,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function BusinessDashboard() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["users", authUser?.userId],
    queryFn: () => api.users.get(authUser!.userId),
    enabled: !!authUser?.userId,
  });

  if (!isAuthenticated) {
    return (
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Business Intelligence Hub
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in to see your personalised business metrics and insights.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Business Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your profile performance and community engagement
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-1"
                data-testid="metric-profile-views"
              >
                {user?.profileViewCount ?? 0}
              </h3>
              <p className="text-sm text-gray-600">Profile Views</p>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-6 w-6 text-success" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-1"
                data-testid="metric-likes"
              >
                {user?.likeCount ?? 0}
              </h3>
              <p className="text-sm text-gray-600">Total Likes</p>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-1"
                data-testid="metric-posts"
              >
                {user?.postCount ?? 0}
              </h3>
              <p className="text-sm text-gray-600">Posts</p>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-1"
                data-testid="metric-roles"
              >
                {(user?.roles ?? []).join(", ") || "Member"}
              </h3>
              <p className="text-sm text-gray-600">Role</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            className="business-gradient text-white"
            onClick={() => navigate("/analytics")}
            data-testid="button-view-analytics"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            data-testid="button-view-profile"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
      </div>
    </section>
  );
}
