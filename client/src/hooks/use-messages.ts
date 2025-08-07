import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./use-auth";

export function useUnreadCount() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/messages/unread-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return { unreadCount: 0 };
      const response = await fetch(`/api/messages/unread-count?userId=${user.id}`);
      return response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useStartConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        ...data,
        senderId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });
}