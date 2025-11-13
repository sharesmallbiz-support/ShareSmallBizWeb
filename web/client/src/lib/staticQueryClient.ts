import { QueryClient } from "@tanstack/react-query";
import { StaticApiService, isStaticMode } from "./staticApi";

// Create API request function that works in both modes
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  if (isStaticMode) {
    // Handle static mode API calls
    const url = new URL(endpoint, "http://localhost");
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    if (pathname === "/api/posts") {
      return StaticApiService.getPosts();
    }

    if (pathname === "/api/auth/login") {
      const body = JSON.parse(options.body as string);
      const user = await StaticApiService.authenticateUser(
        body.username,
        body.password
      );
      if (!user) throw new Error("Invalid credentials");
      return { user };
    }

    if (pathname.startsWith("/api/posts/") && pathname.endsWith("/comments")) {
      const postId = pathname.split("/")[3];
      return StaticApiService.getComments(postId);
    }

    if (pathname.startsWith("/api/users/") && pathname.endsWith("/metrics")) {
      const userId = pathname.split("/")[3];
      return StaticApiService.getBusinessMetrics(userId);
    }

    if (pathname.startsWith("/api/users/") && pathname.endsWith("/posts")) {
      const userId = pathname.split("/")[3];
      return StaticApiService.getUserPosts(userId);
    }

    if (pathname.startsWith("/api/users/") && pathname.endsWith("/activities")) {
      const userId = pathname.split("/")[3];
      const limit = parseInt(searchParams.get("limit") || "20");
      return StaticApiService.getActivityFeed(userId, limit);
    }

    if (pathname.startsWith("/api/users/") && pathname.endsWith("/settings")) {
      const userId = pathname.split("/")[3];
      if (options.method === "PUT") {
        const body = JSON.parse(options.body as string);
        return StaticApiService.updateBusinessSettings(userId, body);
      }
      return StaticApiService.getBusinessSettings(userId);
    }

    if (pathname.startsWith("/api/users/") && pathname.endsWith("/analytics")) {
      const userId = pathname.split("/")[3];
      const period = (searchParams.get("period") as "week" | "month" | "year") || "month";
      return StaticApiService.getAnalytics(userId, period);
    }

    if (pathname.match(/^\/api\/users\/[^/]+$/)) {
      const userId = pathname.split("/")[3];
      if (options.method === "PUT") {
        const body = JSON.parse(options.body as string);
        return StaticApiService.updateUser(userId, body);
      }
      return StaticApiService.getUser(userId);
    }

    if (pathname === "/api/ai/chat") {
      const body = JSON.parse(options.body as string);
      return StaticApiService.getAIResponse(body.message);
    }

    // Default empty response for unhandled endpoints
    console.warn(`Unhandled static API endpoint: ${pathname}`);
    return {};
  }

  // Original dynamic API for server mode
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [endpoint] = queryKey as [string];
        return apiRequest(endpoint);
      },
      staleTime: isStaticMode ? Infinity : 5 * 60 * 1000, // Cache forever in static mode
      retry: isStaticMode ? false : 3,
    },
  },
});
