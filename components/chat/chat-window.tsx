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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { toast } from "sonner";
import { MessageFormData } from "@/schemas/schema";
import useCustomMutation from "@/hooks/use-mutation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import useAppContext from "@/context/app-context";
import { formatRetryTime } from "@/lib/time-format";

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
  const { retryAfter, setRetryAfter } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const [text, setText] = useState<string>("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const { mutate } = useCustomMutation<
    MutationResponse,
    MessageFormData,
    MutationError
  >({
    api_key: ["save_messages"],
    api_url: `/api/chat/${id}`,
  });

  const { messages, status, sendMessage, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/conversation",
    }),
    onFinish: ({ message, isError }) => {
      if (isError) {
        stop();
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
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    },
    onError: (error) => {
      console.error("AI Error", error);

      const match = error.message.match(/Please retry in ([\d.]+)s/);
      if (match) {
        const seconds = parseFloat(match[1]);
        setRetryAfter(seconds);
        toast.error(
          `AI Rate limit exceeded. Please wait ${formatRetryTime(seconds)}.`,
          { duration: 2500 },
        );
        stop();
      } else {
        toast.error(error.message, { duration: 2500 });
        stop();
      }
    },
  });

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
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }, 50);
        },
        onError: ({ message: errorMsg }) => {
          toast.error(errorMsg);
        },
      },
    );
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const threshold = 120;
        const isNearBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

        setShouldAutoScroll(isNearBottom);
      }, 50);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (!bottomRef.current) return;

    // prevent scroll on first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (shouldAutoScroll) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, status, shouldAutoScroll]);

  useEffect(() => {
    if (!isLoading) {
      setMessages(initailMessages);
    }
  }, [initailMessages, isLoading]);

  return (
    <div className="w-full h-svh max-w-5xl flex items-center justify-center pb-3 px-3 md:pt-0 pt-12">
      <div className="flex flex-col relative w-full h-full gap-3">
        <div ref={containerRef} className="flex-1 min-h-0 w-full">
          <Conversation className="relative w-full h-full">
            <ConversationContent className="px-1! pe-3! h-full w-full">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-end">
                    <Skeleton className="h-6 w-full max-w-60" />
                  </div>

                  <div className="flex items-start gap-3">
                    <Skeleton className="h-20 w-full max-w-100" />
                  </div>
                </div>
              ) : (
                <>
                  {!isLoading && messages.length === 0 ? (
                    <ConversationEmptyState
                      className="h-full w-full flex items-center justify-center"
                      title="Start a conversation"
                      description="Ask anything. Get instant answers, ideas, and help."
                    />
                  ) : (
                    <>
                      {messages.map((message) => (
                        <Message
                          from={message.role}
                          key={message.id}
                          className="max-[426px]:px-0! pb-2"
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
                      ))}

                      {status === "submitted" && (
                        <Message
                          from="assistant"
                          className="max-[426px]:px-0! pb-2"
                        >
                          <MessageContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Spinner className="size-5" />
                              <span className="text-sm font-medium">
                                Thinking...
                              </span>
                            </div>
                          </MessageContent>
                        </Message>
                      )}
                    </>
                  )}
                  <div ref={bottomRef} />
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
              <PromptInputSubmit
                disabled={(!text && !status) || !!retryAfter}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
