"use client";

import useFetch from "@/hooks/use-fetch";

import { redirect, useParams } from "next/navigation";
import ChatWindow from "@/components/chat/chat-window";
import { useEffect, useState } from "react";
import { UIMessage } from "ai";
import { toast } from "sonner";

interface FetchResponse {
  data: {
    messages: { role: "user" | "assistant" | "system"; content: string }[];
  };
}
const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [initailsMessage, setInitailsMessage] = useState<UIMessage[]>([]);

  const { data, isLoading, isError, error } = useFetch<FetchResponse>({
    api_key: ["user_single_chat_fetch", id],
    api_url: `/api/chat/${id}`,
  });

  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        toast.error(error?.message);
        if (error.message == "Conversation not found") {
          redirect("/chat");
        }
      }
      const messages: UIMessage[] =
        data?.data.messages.map((item, i) => {
          return {
            id: `${i}-${item.role}`,
            role: item.role,
            parts: [
              {
                type: "text",
                text: item.content,
              },
            ],
          };
        }) || [];
      setInitailsMessage(messages);
    }
  }, [data, isLoading, isError]);
  return (
    <ChatWindow
      id={id}
      initailMessages={initailsMessage}
      isLoading={isLoading}
    />
  );
};

export default ChatPage;
