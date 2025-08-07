import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { OpportunityWithUser } from "@shared/schema";
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Eye, 
  Users, 
  Mail, 
  Phone,
  MessageSquare,
  Share2,
  Flag,
  Edit,
  Star
} from "lucide-react";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch opportunity details
  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['/api/opportunities', id],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities/${id}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity');
      return response.json() as Promise<OpportunityWithUser>;
    },
    enabled: !!id,
  });

  // Start conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: async () => {
      // For demo purposes, using a fixed current user ID
      const currentUserId = "user5"; // This would normally come from auth context
      return apiRequest('POST', `/api/opportunities/${id}/start-conversation`, {
        userId: currentUserId,
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Message sent!",
        description: `Started conversation about "${response.opportunityTitle}"`,
      });
      // Navigate to messages page
      setLocation('/messages');
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Opportunity not found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The opportunity you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={() => setLocation('/opportunities')}
                data-testid="button-back-to-opportunities"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Opportunities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => setLocation('/opportunities')}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Opportunities
        </Button>

        {/* Opportunity Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {opportunity.featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" data-testid="badge-type">
                    {opportunity.opportunityType}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-category">
                    {opportunity.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-4" data-testid="text-title">
                  {opportunity.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <img 
                      src={opportunity.user.avatar || '/default-avatar.png'}
                      alt={opportunity.user.fullName}
                      className="w-6 h-6 rounded-full mr-2"
                      data-testid="img-user-avatar"
                    />
                    <span data-testid="text-user-name">{opportunity.user.fullName}</span>
                    {opportunity.user.businessName && (
                      <span className="text-gray-500 dark:text-gray-400">
                        • {opportunity.user.businessName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Eye className="mr-1 h-3 w-3" />
                    <span data-testid="text-views">{opportunity.viewsCount} views</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span data-testid="text-applications">{opportunity.applicationsCount} interested</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" data-testid="button-flag">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap" data-testid="text-description">
                  {opportunity.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start" data-testid={`requirement-${index}`}>
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" data-testid={`tag-${index}`}>
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opportunity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="text-sm" data-testid="text-location">{opportunity.location}</span>
                  </div>
                )}
                {opportunity.budget && (
                  <div className="flex items-center">
                    <DollarSign className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="text-sm" data-testid="text-budget">{opportunity.budget}</span>
                  </div>
                )}
                {opportunity.timeline && (
                  <div className="flex items-center">
                    <Clock className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="text-sm" data-testid="text-timeline">{opportunity.timeline}</span>
                  </div>
                )}
                <Separator />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Posted on {formatDate(opportunity.createdAt)}
                  {opportunity.updatedAt !== opportunity.createdAt && (
                    <div>Updated on {formatDate(opportunity.updatedAt)}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.contactMethod === 'email' && opportunity.contactInfo && (
                  <Button className="w-full" data-testid="button-contact-email">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                )}
                {opportunity.contactMethod === 'phone' && opportunity.contactInfo && (
                  <Button className="w-full" data-testid="button-contact-phone">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                )}
                {opportunity.contactMethod === 'platform message' && (
                  <Button 
                    className="w-full" 
                    data-testid="button-contact-message"
                    onClick={() => startConversationMutation.mutate()}
                    disabled={startConversationMutation.isPending}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {startConversationMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Contact method: {opportunity.contactMethod}
                  {opportunity.contactInfo && opportunity.contactMethod !== 'platform message' && (
                    <div className="font-mono mt-1" data-testid="text-contact-info">
                      {opportunity.contactInfo}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Profile */}
            <Card>
              <CardHeader>
                <CardTitle>About the Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={opportunity.user.avatar || '/default-avatar.png'}
                    alt={opportunity.user.fullName}
                    className="w-12 h-12 rounded-full"
                    data-testid="img-business-avatar"
                  />
                  <div>
                    <h4 className="font-semibold" data-testid="text-business-name">
                      {opportunity.user.businessName || opportunity.user.fullName}
                    </h4>
                    {opportunity.user.businessType && (
                      <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="text-business-type">
                        {opportunity.user.businessType}
                      </p>
                    )}
                  </div>
                </div>
                {opportunity.user.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="text-business-bio">
                    {opportunity.user.bio}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{opportunity.user.connections} connections</span>
                  <span>Score: {opportunity.user.businessScore}/100</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setLocation(`/profile/${opportunity.user.id}`)}
                  data-testid="button-view-profile"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}