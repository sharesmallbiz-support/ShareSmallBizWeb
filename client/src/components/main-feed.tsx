import { useState } from "react";
import CreatePost from "./create-post";
import PostCard from "./post-card";
import { Button } from "@/components/ui/button";
import { usePosts } from "../hooks/use-posts";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainFeed() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { data: posts, isLoading, hasNextPage, fetchNextPage } = usePosts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="post-card p-6">
            <div className="flex items-center mb-4">
              <Skeleton className="w-12 h-12 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <CreatePost 
        isExpanded={showCreatePost}
        onToggleExpand={() => setShowCreatePost(!showCreatePost)}
      />

      {/* Feed Posts */}
      <div className="space-y-6" data-testid="feed-posts">
        {posts?.pages.flatMap(page => page).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center py-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="px-8 py-3"
            data-testid="button-load-more"
          >
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
