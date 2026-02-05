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
import { ScrollArea } from "../ui/scroll-area";
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
    <div className="h-full w-full relative">
      <div className="h-full">
        <ScrollArea className={`h-[80%]`}>
          <Conversation>
            <ConversationContent className="px-0!">
              {isLoading ? (
                <div className="space-y-6">
                  {/* user */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-[70%] w-full flex justify-end">
                      <Skeleton className="h-6 w-60" />
                    </div>
                  </div>
                  {/* assistant */}
                  <div className="flex items-start gap-3">
                    <div className="max-w-[70%] w-full">
                      <Skeleton className="h-20 w-100" />
                    </div>
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
                        className="overflow-y-visible!"
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
        </ScrollArea>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
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
    
  );
};

export default ChatWindow;
