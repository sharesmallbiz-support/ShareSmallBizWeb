import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIConversation {
  message: string;
  response: string;
  suggestions?: string[];
  actionItems?: string[];
}

export function useAIChat() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        userId: "user1", // Mock user ID
        userContext: {
          businessName: "Smith's Local Hardware",
          businessType: "Retail",
          location: "Portland, OR"
        }
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setConversations(prev => [...prev, {
        message: variables,
        response: data.response,
        suggestions: data.suggestions,
        actionItems: data.actionItems
      }]);
    },
  });

  const sendMessage = (message: string) => {
    return chatMutation.mutateAsync(message);
  };

  return {
    conversations,
    sendMessage,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
  };
}
