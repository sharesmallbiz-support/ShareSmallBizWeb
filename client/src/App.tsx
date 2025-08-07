import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import BusinessSettings from "./pages/business-settings";
import Messages from "./pages/messages";
import AIAssistant from "./pages/ai-assistant";
import AIChat from "./pages/ai-chat";
import AIDashboard from "./pages/ai-dashboard";
import UserAnalytics from "./pages/user-analytics";
import Opportunities from "./pages/opportunities";
import OpportunityDetail from "./pages/opportunity-detail";
import OpportunityForm from "./pages/opportunity-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route path="/business-settings" component={BusinessSettings} />
      <Route path="/messages" component={Messages} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/ai-chat/:agentId" component={AIChat} />
      <Route path="/ai-dashboard" component={AIDashboard} />
      <Route path="/user-analytics" component={UserAnalytics} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/opportunities/new" component={OpportunityForm} />
      <Route path="/opportunities/:id/edit" component={OpportunityForm} />
      <Route path="/opportunities/:id" component={OpportunityDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
