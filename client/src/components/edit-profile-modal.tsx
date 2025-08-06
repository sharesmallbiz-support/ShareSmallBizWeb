import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  children: React.ReactNode;
}

export default function EditProfileModal({ children }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      businessName: user?.businessName || "",
      businessType: user?.businessType || "",
      location: user?.location || "",
      bio: user?.bio || "",
      website: user?.website || "",
      avatar: user?.avatar || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: EditProfileForm) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      const jsonData = await response.json();
      return jsonData;
    },
    onSuccess: (response) => {
      const updatedUser = response.user;
      login(updatedUser); // Update auth state with new user data
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      setOpen(false);
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and business details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...form.register("fullName")}
                data-testid="input-edit-fullname"
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your Business LLC"
                {...form.register("businessName")}
                data-testid="input-edit-business-name"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                placeholder="Retail, Services, Technology, etc."
                {...form.register("businessType")}
                data-testid="input-edit-business-type"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                {...form.register("location")}
                data-testid="input-edit-location"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourbusiness.com"
                {...form.register("website")}
                data-testid="input-edit-website"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/your-photo.jpg"
                {...form.register("avatar")}
                data-testid="input-edit-avatar"
              />
              {form.formState.errors.avatar && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.avatar.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself and your business..."
                rows={4}
                {...form.register("bio")}
                data-testid="textarea-edit-bio"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}