"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { PromptField } from "@/components/custom/promptField";
import { useChat } from "@/hooks/useChat";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getChatHistory, type ChatMessage } from "@/lib/api/chat";

export default function Console() {
  const params = useParams();
  const goalId = params.id as string;

  const { sendMessage, isPending } = useChat(goalId);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch history
  const { data: history, isLoading } = useQuery({
    queryKey: ["messages", goalId],
    queryFn: () => getChatHistory(goalId),
    enabled: !!goalId, // Only fetch if we have an ID
    retry: false,
  });

  // Local state ONLY for the message currently being sent optimistically
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );

  // DERIVED STATE: Merge history and optimistic messages
  // This calculates 'allMessages' every render. No useEffect needed.
  const allMessages = useMemo(() => {
    const serverMessages = history || [];

    // Filter out optimistic messages that match content already in history
    // This prevents the "double message" flicker when the server responds
    const uniqueOptimistic = optimisticMessages.filter(
      (opt) => !serverMessages.some((serv) => serv.content === opt.content),
    );

    return [...serverMessages, ...uniqueOptimistic];
  }, [history, optimisticMessages]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
    };

    // Add to optimistic list immediately
    setOptimisticMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    sendMessage(userMessage.content);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="pb-3 h-full w-full">
      <div className="flex flex-col h-full w-full items-center gap-1.5">
        <div className="flex-1 w-full lg:w-1/2 overflow-y-scroll space-y-2 no-scrollbar">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {/* Skeleton loaders or a simple pulse */}
              <div className="h-10 w-3/4 bg-slate-100 animate-pulse rounded-lg" />
              <div className="h-10 w-1/2 self-end bg-blue-100 animate-pulse rounded-lg" />
            </div>
          ) : allMessages.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
              Start a chat...
            </div>
          ) : (
            allMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-4 rounded-2xl text-sm max-w-[85%] ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 border"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>

        {/* <div className="flex-1 w-full lg:w-1/2 overflow-y-scroll no-scrollbar">
          chats here
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-4 rounded-2xl text-sm max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 border"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div> */}

        <div className="space-y-1.5 w-full lg:w-1/2">
          <PromptField
            value={inputValue}
            isPending={isPending}
            disabled={isPending}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
          />
          <p className="text-xs text-center text-gray-500">
            Zimna can make mistakes. Check important info and dates.
          </p>
        </div>
      </div>
    </div>
  );
}
