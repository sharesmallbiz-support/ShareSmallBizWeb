import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Login from "./pages/login";

// Import the appropriate query client based on mode
import { queryClient } from "./lib/queryClient";
import { queryClient as staticQueryClient } from "./lib/staticQueryClient";

const isStaticMode = import.meta.env.VITE_MODE === 'static';
const activeQueryClient = isStaticMode ? staticQueryClient : queryClient;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
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
