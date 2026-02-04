"use client";

import { useState } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  conversationTitleFormData,
  conversationTitleSchema,
} from "@/schemas/schema";
import { Field, FieldGroup } from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import InputField from "../inputs/input-field";
import useCustomMutation from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "@/context/app-context";

type MutationResponse = {
  data: {
    conversation: {
      id: string;
      title: string;
    };
    usage: {};
  };
};

type MutationError = {
  data: {
    resetAt: Date;
  };
};

const getResetTime = (resetAt: Date) => {
  if (!resetAt) return "";
  const reset = new Date(resetAt);
  const now = new Date();
  const diff = reset.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    return `in ${Math.floor(hours / 24)} day(s)`;
  }
  return `in ${hours}h ${minutes}m`;
};

const NewChatButton = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { resetAt, setResetAt } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const isLimitReached = resetAt ? new Date() < new Date(resetAt) : false;

  const { mutate, isPending } = useCustomMutation<
    MutationResponse,
    conversationTitleFormData,
    MutationError
  >({
    api_key: ["newChat_mutation"],
    api_url: "/api/conversation",
  });

  const { control, reset, handleSubmit } = useForm<conversationTitleFormData>({
    resolver: zodResolver(conversationTitleSchema),
    defaultValues: {
      title: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: conversationTitleFormData) => {
    mutate(
      { payload: { ...values } },
      {
        onSuccess: ({ data, message }) => {
          toast.success(message);

          setShowModal(false);
          reset();
          queryClient.refetchQueries({
            queryKey: ["user_chats_fetch"],
          });

          router.replace(`/chat/${data?.data.conversation.id}`);
        },
        onError: ({ validationErrors, message, data }) => {
          if (validationErrors) {
            Object.entries(validationErrors).forEach(([field, errors]) => {
              toast.error(`${field}: ${errors[0]}`);
            });
            return;
          }

          if (data?.data.resetAt) {
            localStorage.setItem("resetAt", JSON.stringify(data?.data.resetAt));
            setResetAt(data.data.resetAt);
            setShowModal(false);
          }

          toast.error(message, { duration: 2000 });
          return;
        },
      },
    );
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="truncate"
            tooltip={"New Chat"}
            onClick={() => setShowModal(true)}
          >
            <SquarePen className="h-5 w-5" />
            New Chat
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {/* Form Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className={`md:min-w-2xl z-99999`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl font-semibold`}>
              Start New Chat
            </DialogTitle>
            {resetAt && (
              <DialogDescription className={"text-destructive"}>
                Chat limit reached. Resets {getResetTime(resetAt)}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-2">
              <InputField
                control={control}
                name="title"
                placeholder="Conversation Title"
                label="Title"
                maxLength={90}
              />
              <Field className="mt-4 sm:flex-row items-center gap-y-5">
                <div className="flex sm:flex-row flex-col-reverse sm:justify-end items-center gap-4">
                  <Button
                    type="button"
                    variant={"outline"}
                    size={"lg"}
                    className={"sm:w-fit! w-full"}
                    render={
                      <DialogClose disabled={isPending}>Close</DialogClose>
                    }
                  />
                  <Button
                    disabled={isPending || isLimitReached}
                    type="submit"
                    className={`sm:w-fit! w-full`}
                    size={"lg"}
                  >
                    {isLimitReached ? "Limit Reached" : "Create Chat"}
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChatButton;
