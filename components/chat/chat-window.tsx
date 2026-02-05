"use client";

import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { toast } from "sonner";
import { MessageFormData } from "@/schemas/schema";
import useCustomMutation from "@/hooks/use-mutation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface MutationResponse {
  data: {};
}

type MutationError = {
  data: {
    resetAt: Date;
  };
};

interface ChatWindowProps {
  id: string;
  initailMessages: UIMessage[];
  isLoading: boolean;
}

const ChatWindow = ({ id, initailMessages, isLoading }: ChatWindowProps) => {
  const [text, setText] = useState<string>("");

  const { mutate } = useCustomMutation<
    MutationResponse,
    MessageFormData,
    MutationError
  >({
    api_key: ["save_messages"],
    api_url: `/api/chat/${id}`,
  });

  const { messages, status, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/conversation",
    }),
    onFinish: ({ message, isError }) => {
      if (isError) {
        return;
      }
      const textPart = message.parts.find((p) => p.type === "text");
      const content = textPart?.text!;
      const payload = {
        role: message.role,
        content,
      };
      mutate(
        {
          payload,
        },
        {
          onSuccess: ({ message }) => {
            toast.success(message);
          },
          onError: ({ validationErrors, message }) => {
            if (validationErrors) {
              Object.entries(validationErrors).forEach(([field, errors]) => {
                toast.error(`${field}: ${errors[0]}`);
              });
              return;
            }
            toast.error(message, { duration: 2000 });
            return;
          },
        },
      );
    },
    onError: (error) => {
      console.error("AI Error", error);
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!isLoading) {
      setMessages(initailMessages);
    }
  }, [initailMessages, isLoading]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText) {
      return;
    }

    // Save user message immediately
    mutate(
      {
        payload: {
          role: "user",
          content: message.text,
        },
      },
      {
        onSuccess: () => {
          // Send to AI after saving
          sendMessage({
            text: message.text,
          });
          setText("");
        },
        onError: ({ message: errorMsg }) => {
          toast.error(`Failed to save message: ${errorMsg}`);
        },
      },
    );
  };

  return (
    <div className="w-full h-svh max-w-4xl flex items-center justify-center pb-3 px-3 md:pt-0 pt-12">
      <div className="flex flex-col relative w-full h-full gap-3">
        <div className="flex-1 min-h-0 w-full">
          <Conversation className="relative w-full h-full">
            
            <ConversationContent className="px-1! pe-3!">
              {isLoading ? (
                <div className="space-y-6">
                  {/* user */}
                  <div className="flex items-start justify-end">
                    <Skeleton className="h-6 w-full max-w-60" />
                  </div>
                  {/* assistant */}
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-20 w-full max-w-100" />
                  </div>
                </div>
              ) : (
                <>
                  {!isLoading && messages.length === 0 ? (
                    <ConversationEmptyState
                      className="w-full flex items-center justify-center"
                      title="Start a conversation"
                      description="Ask anything. Get instant answers, ideas, and help."
                    />
                  ) : (
                    messages.map((message) => (
                      <Message
                        from={message.role}
                        key={message.id}
                        className="max-[426px]:px-0!"
                      >
                        <MessageContent>
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <MessageResponse key={`${message.id}-${i}`}>
                                    {part.text}
                                  </MessageResponse>
                                );
                              default:
                                return null;
                            }
                          })}
                        </MessageContent>
                      </Message>
                    ))
                  )}
                </>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        <div>
          <PromptInput onSubmit={handleSubmit} multiple>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit disabled={!text && !status} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
