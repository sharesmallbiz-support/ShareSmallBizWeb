import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      businessName: "",
      businessType: "",
      location: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      console.log("Making login request with:", data);
      const response = await apiRequest("POST", "/api/auth/login", data);
      const jsonData = await response.json();
      console.log("Parsed JSON response:", jsonData);
      return jsonData;
    },
    onSuccess: (response: any) => {
      console.log("Login onSuccess called with:", response);
      const user = response.user;
      
      if (!user || !user.fullName) {
        console.error("Invalid user data:", user);
        toast({
          title: "Login Error", 
          description: "Invalid user data received from server",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.fullName}`,
      });
      login(user);
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Login mutation error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials", 
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupForm, "confirmPassword">) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      const jsonData = await response.json();
      return jsonData;
    },
    onSuccess: (response: any) => {
      const user = response.user;
      toast({
        title: "Account created!",
        description: `Welcome to ShareSmallBiz, ${user.fullName}`,
      });
      login(user);
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onSignup = (data: SignupForm) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ShareSmallBiz</h1>
          <p className="text-white/80">Join the small business community</p>
        </div>

        <Card className="professional-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {activeTab === "login" ? "Welcome Back" : "Join The Community"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      {...loginForm.register("username")}
                      data-testid="input-login-username"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      data-testid="input-login-password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={loginMutation.isPending}
                    data-testid="button-login-submit"
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4">
                  <p className="font-medium mb-2">Demo accounts available:</p>
                  <div className="space-y-1 text-xs">
                    <p><strong>johnsmith</strong> / password123 (Hardware Store)</p>
                    <p><strong>sharesmallbiz</strong> / password123 (Platform Team)</p>
                    <p><strong>sarahmartinez</strong> / password123 (Landscaping)</p>
                    <p><strong>markhazleton</strong> / password123 (ShareSmallBiz Founder)</p>
                    <p><strong>jonathanroper</strong> / password123 (WichitaSewer.com)</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-fullName">Full Name</Label>
                      <Input
                        id="signup-fullName"
                        placeholder="John Smith"
                        {...signupForm.register("fullName")}
                        data-testid="input-signup-fullname"
                      />
                      {signupForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        placeholder="johnsmith"
                        {...signupForm.register("username")}
                        data-testid="input-signup-username"
                      />
                      {signupForm.formState.errors.username && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      {...signupForm.register("email")}
                      data-testid="input-signup-email"
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-businessName">Business Name</Label>
                    <Input
                      id="signup-businessName"
                      placeholder="Your Business LLC"
                      {...signupForm.register("businessName")}
                      data-testid="input-signup-business-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-businessType">Business Type</Label>
                      <Input
                        id="signup-businessType"
                        placeholder="Retail"
                        {...signupForm.register("businessType")}
                        data-testid="input-signup-business-type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-location">Location</Label>
                      <Input
                        id="signup-location"
                        placeholder="City, State"
                        {...signupForm.register("location")}
                        data-testid="input-signup-location"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create password"
                        {...signupForm.register("password")}
                        data-testid="input-signup-password"
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
                      <Input
                        id="signup-confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        {...signupForm.register("confirmPassword")}
                        data-testid="input-signup-confirm-password"
                      />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={signupMutation.isPending}
                    data-testid="button-signup-submit"
                  >
                    {signupMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}