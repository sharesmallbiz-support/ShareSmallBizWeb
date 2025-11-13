import { StaticApiService } from "./staticApi";

// Global fetch interceptor for static mode
export function setupStaticFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Parse the URL
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

    // Only intercept API calls
    if (!url.includes("/api/")) {
      return originalFetch(input, init);
    }

    try {
      const parsedUrl = new URL(url, window.location.origin);
      const pathname = parsedUrl.pathname;
      const searchParams = parsedUrl.searchParams;
      const method = init?.method || "GET";

      let data: any = null;

      // Route to appropriate static API method
      if (pathname === "/api/posts") {
        data = await StaticApiService.getPosts();
      } else if (pathname === "/api/auth/login") {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const user = await StaticApiService.authenticateUser(body.username, body.password);
        if (!user) {
          return new Response(JSON.stringify({ message: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        data = { user };
      } else if (pathname.startsWith("/api/posts/") && pathname.endsWith("/comments")) {
        const postId = pathname.split("/")[3];
        data = await StaticApiService.getComments(postId);
      } else if (pathname.startsWith("/api/users/") && pathname.endsWith("/metrics")) {
        const userId = pathname.split("/")[3];
        data = await StaticApiService.getBusinessMetrics(userId);
      } else if (pathname.startsWith("/api/users/") && pathname.endsWith("/posts")) {
        const userId = pathname.split("/")[3];
        data = await StaticApiService.getUserPosts(userId);
      } else if (pathname.startsWith("/api/users/") && pathname.endsWith("/activities")) {
        const userId = pathname.split("/")[3];
        const limit = parseInt(searchParams.get("limit") || "20");
        data = await StaticApiService.getActivityFeed(userId, limit);
      } else if (pathname.startsWith("/api/users/") && pathname.endsWith("/settings")) {
        const userId = pathname.split("/")[3];
        if (method === "PUT") {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          data = await StaticApiService.updateBusinessSettings(userId, body);
        } else {
          data = await StaticApiService.getBusinessSettings(userId);
        }
      } else if (pathname.startsWith("/api/users/") && pathname.endsWith("/analytics")) {
        const userId = pathname.split("/")[3];
        const period = (searchParams.get("period") as "week" | "month" | "year") || "month";
        data = await StaticApiService.getAnalytics(userId, period);
      } else if (pathname.match(/^\/api\/users\/[^/]+$/)) {
        const userId = pathname.split("/")[3];
        if (method === "PUT") {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          data = await StaticApiService.updateUser(userId, body);
        } else {
          data = await StaticApiService.getUser(userId);
        }
      } else if (pathname === "/api/ai/chat") {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        data = await StaticApiService.getAIResponse(body.message);
      } else {
        console.warn(`Unhandled static API endpoint: ${pathname}`);
        data = {};
      }

      // Return a mock Response object
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Static fetch interceptor error:", error);
      return new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  console.log("✅ Static fetch interceptor installed");
}
