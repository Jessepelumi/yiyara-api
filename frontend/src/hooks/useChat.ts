import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sendChatMessage } from "@/lib/api/chat";

export const useChat = (goalId?: string) => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const {
    mutate: sendMessage,
    isPending,
    error,
  } = useMutation({
    mutationFn: (content: string) =>
      sendChatMessage({
        content,
        conversation_id: activeConversationId || undefined,
        goal_id: !activeConversationId ? goalId : undefined,
      }),
    onSuccess: (data) => {
      // Lock in the conversation ID so we don't keep sending goal_id
      if (!activeConversationId) {
        setActiveConversationId(data.conversation_id);
      }

      // Invalidate existing goals list in case the AI added new goals/tasks
      queryClient.invalidateQueries({ queryKey: ["messages", goalId] });
    },
  });

  return { sendMessage, isPending, error };
};
