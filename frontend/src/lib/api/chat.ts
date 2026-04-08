import { apiClient } from "./client";

interface ChatRequest {
  content: string;
  goal_id?: string;
  conversation_id?: string;
}

interface ChatResponse {
  conversation_id: string;
  message: {
    id: string;
    role: "user" | "model";
    content: string;
    created_at: string;
  };
}

export interface ChatMessage {
  id?: string;
  role: "user" | "model";
  content: string;
  created_at?: string;
}

export const sendChatMessage = async (
  data: ChatRequest,
): Promise<ChatResponse> => {
  // Pass the method and body in the options object
  return await apiClient<ChatResponse>("/conversations/chat/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getChatHistory = async (
  goalId: string,
): Promise<ChatMessage[]> => {
  // This hits your new Django endpoint that filters messages by goal_id
  return await apiClient<ChatMessage[]>(`/conversations/history/${goalId}/`, {
    method: "GET",
  });
};
