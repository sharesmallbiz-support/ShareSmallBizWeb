import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationHeader from "../components/navigation-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Bell, Lock, Briefcase, Link as LinkIcon, Save } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUserId = localStorage.getItem("currentUserId") || "user1";

  // Fetch current user settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "settings"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/settings`);
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  // Fetch current user data
  const { data: user } = useQuery({
    queryKey: ["/api/users", currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await fetch(`/api/users/${currentUserId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "settings"] });
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update user profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await fetch(`/api/users/${currentUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profileForm);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings?.notifications,
        [key]: value,
      },
    };
    updateSettings.mutate(newSettings);
  };

  const handlePrivacyChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings?.privacy,
        [key]: value,
      },
    };
    updateSettings.mutate(newSettings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell us about yourself and your business"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>

                  <Button type="submit" disabled={updateProfile.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive email updates about your activity
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.emailNotifications ?? true}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Get push notifications for important updates
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.pushNotifications ?? true}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Comment Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Notify when someone comments on your posts
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.commentNotifications ?? true}
                    onCheckedChange={(checked) => handleNotificationChange("commentNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Like Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Notify when someone likes your posts
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.likeNotifications ?? true}
                    onCheckedChange={(checked) => handleNotificationChange("likeNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Connection Requests</Label>
                    <p className="text-sm text-gray-500">
                      Notify about new connection requests
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.connectionRequests ?? true}
                    onCheckedChange={(checked) => handleNotificationChange("connectionRequests", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of your activity
                    </p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.weeklySummary ?? false}
                    onCheckedChange={(checked) => handleNotificationChange("weeklySummary", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={settings?.privacy?.profileVisibility || "public"}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    Choose who can view your profile
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Email</Label>
                    <p className="text-sm text-gray-500">
                      Display your email on your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings?.privacy?.showEmail ?? false}
                    onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Location</Label>
                    <p className="text-sm text-gray-500">
                      Display your location on your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings?.privacy?.showLocation ?? true}
                    onCheckedChange={(checked) => handlePrivacyChange("showLocation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Searchable</Label>
                    <p className="text-sm text-gray-500">
                      Allow others to find you in search
                    </p>
                  </div>
                  <Switch
                    checked={settings?.privacy?.searchable ?? true}
                    onCheckedChange={(checked) => handlePrivacyChange("searchable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Business Metrics</Label>
                    <p className="text-sm text-gray-500">
                      Display your business metrics publicly
                    </p>
                  </div>
                  <Switch
                    checked={settings?.privacy?.showMetrics ?? true}
                    onCheckedChange={(checked) => handlePrivacyChange("showMetrics", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Business Settings
                </CardTitle>
                <CardDescription>
                  Configure your business information and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={user?.businessName || ""}
                    placeholder="Your Business Name"
                    disabled
                  />
                  <p className="text-sm text-gray-500">
                    Contact support to change your business name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={user?.businessType || ""}
                    placeholder="e.g., Retail, Services, Technology"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    value={settings?.business?.businessHours || "9:00 AM - 5:00 PM"}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    onChange={(e) => {
                      const newSettings = {
                        ...settings,
                        business: {
                          ...settings?.business,
                          businessHours: e.target.value,
                        },
                      };
                      updateSettings.mutate(newSettings);
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Integrations</Label>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        f
                      </div>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <p className="text-sm text-gray-500">
                          {settings?.integrations?.facebook?.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {settings?.integrations?.facebook?.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-gray-500">
                          {settings?.integrations?.instagram?.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {settings?.integrations?.instagram?.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-gray-500">
                          {settings?.integrations?.linkedin?.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {settings?.integrations?.linkedin?.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
