import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationHeader from "../components/navigation-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Save } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: authUser, isAuthenticated } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", authUser?.userId],
    queryFn: () => api.users.get(authUser!.userId),
    enabled: !!authUser?.userId,
  });

  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    websiteUrl: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName ?? "",
        bio: user.bio ?? "",
        websiteUrl: user.websiteUrl ?? "",
      });
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: () => api.users.update(authUser!.userId, profileForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", authUser?.userId] });
      toast({ title: "Profile updated successfully." });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 text-lg">Sign in to manage your settings.</p>
        </div>
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-2 max-w-xs mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your public profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile.mutate();
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileForm.displayName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, displayName: e.target.value })
                      }
                      placeholder="Your display name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={profileForm.websiteUrl}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, websiteUrl: e.target.value })
                      }
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

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled />
                  <p className="text-sm text-gray-500">
                    Contact support to change your email address.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={user?.userName ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Member since</Label>
                  <Input value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "—"} disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
