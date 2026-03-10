import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { DiscussionModel } from "@shared/schema";

export function useDiscussions(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["discussions", "paged"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.discussion.getPagedDiscussions(
        pageParam as number,
        pageSize,
        0 // sortType: 0 = Recent
      );
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber >= lastPage.totalPages) return undefined;
      return lastPage.pageNumber + 1;
    },
    initialPageParam: 1,
    select: (data) => ({
      ...data,
      discussions: data.pages.flatMap(
        (page) => page.items as DiscussionModel[]
      ),
    }),
  });
}
