import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Analytics from "./pages/analytics";

// Import the appropriate query client based on mode
import { queryClient } from "./lib/queryClient";
import { queryClient as staticQueryClient } from "./lib/staticQueryClient";

const isStaticMode = import.meta.env.VITE_MODE === 'static';
const activeQueryClient = isStaticMode ? staticQueryClient : queryClient;

// Determine base path for routing
const getBasePath = () => {
  // For GitHub Pages, check if we're running on github.io
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return '/ShareSmallBizWeb';
  }
  return '';
};

function Router() {
  const basePath = getBasePath();
  
  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/analytics" component={Analytics} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={activeQueryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
