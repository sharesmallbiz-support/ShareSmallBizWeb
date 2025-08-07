import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  Phone,
  Mail,
  Save
} from "lucide-react";

const businessSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  industry: z.string().optional(),
  foundedYear: z.string().optional(),
  employeeCount: z.string().optional(),
  revenue: z.string().optional(),
  businessGoals: z.string().optional(),
  targetMarket: z.string().optional(),
  businessDescription: z.string().optional(),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessPhone: z.string().optional(),
});

type BusinessSettingsForm = z.infer<typeof businessSettingsSchema>;

export default function BusinessSettings() {
  const { user, login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!isAuthenticated || !user) {
    setLocation("/login");
    return null;
  }

  const form = useForm<BusinessSettingsForm>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      businessName: user.businessName || "",
      businessType: user.businessType || "",
      location: user.location || "",
      website: user.website || "",
      bio: user.bio || "",
      industry: "",
      foundedYear: "",
      employeeCount: "",
      revenue: "",
      businessGoals: "",
      targetMarket: "",
      businessDescription: "",
      businessEmail: user.email || "",
      businessPhone: "",
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: BusinessSettingsForm) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      const jsonData = await response.json();
      return jsonData;
    },
    onSuccess: (response) => {
      const updatedUser = response.user;
      login(updatedUser);
      toast({
        title: "Business settings updated!",
        description: "Your business information has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update business settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessSettingsForm) => {
    updateBusinessMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900">Business Settings</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <img 
                src="https://sharesmallbiz.com/img/ShareSmallBiz.svg" 
                alt="ShareSmallBiz Logo" 
                className="h-6 w-auto"
              />
              <span className="text-sm font-medium text-gray-700">ShareSmallBiz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Settings Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Business Overview Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Business Overview</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your business profile and information
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Business Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Your Business Name"
                      {...form.register("businessName")}
                      data-testid="input-business-name"
                    />
                    {form.formState.errors.businessName && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Input
                      id="businessType"
                      placeholder="E.g., Retail, Services, Technology"
                      {...form.register("businessType")}
                      data-testid="input-business-type"
                    />
                    {form.formState.errors.businessType && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.businessType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="E.g., Food & Beverage, Healthcare"
                      {...form.register("industry")}
                      data-testid="input-industry"
                    />
                  </div>

                  <div>
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      placeholder="2020"
                      {...form.register("foundedYear")}
                      data-testid="input-founded-year"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State, Country"
                      {...form.register("location")}
                      data-testid="input-location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourbusiness.com"
                      {...form.register("website")}
                      data-testid="input-website"
                    />
                    {form.formState.errors.website && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Input
                        id="employeeCount"
                        placeholder="E.g., 1-10, 11-50, 51-200"
                        {...form.register("employeeCount")}
                        data-testid="input-employee-count"
                      />
                    </div>

                    <div>
                      <Label htmlFor="revenue">Annual Revenue</Label>
                      <Input
                        id="revenue"
                        placeholder="E.g., $100K-$500K"
                        {...form.register("revenue")}
                        data-testid="input-revenue"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Describe what your business does, your products/services, and what makes you unique..."
                      rows={4}
                      {...form.register("businessDescription")}
                      data-testid="textarea-business-description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetMarket">Target Market</Label>
                    <Textarea
                      id="targetMarket"
                      placeholder="Describe your ideal customers and target audience..."
                      rows={3}
                      {...form.register("targetMarket")}
                      data-testid="textarea-target-market"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessGoals">Business Goals</Label>
                    <Textarea
                      id="businessGoals"
                      placeholder="What are your short-term and long-term business objectives?"
                      rows={3}
                      {...form.register("businessGoals")}
                      data-testid="textarea-business-goals"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="contact@yourbusiness.com"
                        {...form.register("businessEmail")}
                        data-testid="input-business-email"
                      />
                      {form.formState.errors.businessEmail && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.businessEmail.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        placeholder="(555) 123-4567"
                        {...form.register("businessPhone")}
                        data-testid="input-business-phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={updateBusinessMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                    data-testid="button-save-business-settings"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateBusinessMutation.isPending ? "Saving..." : "Save Business Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Business Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Business Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Network Connections</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-connections-count">
                      {user.connections}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Score</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-business-score">
                      {user.businessScore}/100
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile Completion</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(((user.businessName ? 1 : 0) + 
                                  (user.businessType ? 1 : 0) + 
                                  (user.location ? 1 : 0) + 
                                  (user.website ? 1 : 0) + 
                                  (user.bio ? 1 : 0)) / 5 * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}