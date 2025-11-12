import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostWithUser } from "@shared/schema";

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ["/api/posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/posts?offset=${pageParam}&limit=10&userId=user1`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json() as Promise<PostWithUser[]>;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer posts than requested, we've reached the end
      if (lastPage.length < 10) return undefined;
      
      // Return the next offset
      return allPages.length * 10;
    },
    initialPageParam: 0,
  });
}
