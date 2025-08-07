import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { OpportunityWithUser } from "@shared/schema";
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Eye, 
  Users,
  Briefcase,
  Star
} from "lucide-react";

export default function Opportunities() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Fetch opportunities
  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['/api/opportunities'],
    queryFn: async () => {
      const response = await fetch('/api/opportunities');
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return response.json() as Promise<OpportunityWithUser[]>;
    },
  });

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || opp.category === categoryFilter;
    const matchesType = typeFilter === "all" || opp.opportunityType === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get unique categories and types for filters
  const categories = Array.from(new Set(opportunities.map(opp => opp.category)));
  const types = Array.from(new Set(opportunities.map(opp => opp.opportunityType)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Business Opportunities
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover partnerships, collaborations, and business opportunities
            </p>
          </div>
          <Button 
            onClick={() => setLocation('/opportunities/new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            data-testid="button-create-opportunity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post Opportunity
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-opportunities"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your filters or create a new opportunity.
              </p>
              <Button 
                onClick={() => setLocation('/opportunities/new')}
                data-testid="button-create-first-opportunity"
              >
                <Plus className="mr-2 h-4 w-4" />
                Post Your First Opportunity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <Card 
                key={opportunity.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer relative"
                onClick={() => setLocation(`/opportunities/${opportunity.id}`)}
                data-testid={`card-opportunity-${opportunity.id}`}
              >
                {opportunity.featured && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
                    <Star className="h-3 w-3" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {opportunity.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <img 
                          src={opportunity.user.avatar || '/default-avatar.png'}
                          alt={opportunity.user.fullName}
                          className="w-5 h-5 rounded-full"
                          data-testid={`img-user-avatar-${opportunity.id}`}
                        />
                        <span>{opportunity.user.fullName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" data-testid={`badge-type-${opportunity.id}`}>
                      {opportunity.opportunityType}
                    </Badge>
                    <Badge variant="outline" data-testid={`badge-category-${opportunity.id}`}>
                      {opportunity.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {opportunity.location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="mr-2 h-4 w-4" />
                        {opportunity.location}
                      </div>
                    )}
                    {opportunity.budget && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {opportunity.budget}
                      </div>
                    )}
                    {opportunity.timeline && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="mr-2 h-4 w-4" />
                        {opportunity.timeline}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {opportunity.viewsCount} views
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {opportunity.applicationsCount} interested
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}