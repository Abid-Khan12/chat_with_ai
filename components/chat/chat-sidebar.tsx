"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./sidebar-footer";
import { Button } from "../ui/button";
import { ArrowLeft, ChevronDown, HomeIcon, SidebarIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import useAppContext from "@/context/app-context";
import Link from "next/link";
import ConversationItem from "./conversation-item";
import NewChatButton from "./new-chat-btn";
import useFetch from "@/hooks/use-fetch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface FetchResponse {
  data: {
    _id: string;
    title: string;
  }[];
}

const ChatSidebar = () => {
  const { status, userData } = useAppContext();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data, isLoading } = useFetch<FetchResponse>({
    api_key: ["user_chats_fetch"],
    api_url: "/api/chat",
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="space-y-2">
        <SidebarMenu className="md:flex-row flex-row-reverse justify-between items-center">
          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size={"icon"}
                    nativeButton={false}
                    variant={"ghost"}
                    className={"size-9"}
                    render={
                      <Link href={"/"}>
                        <HomeIcon />
                      </Link>
                    }
                  />
                }
              />
              <TooltipContent side="right">Back Home</TooltipContent>
            </Tooltip>
          )}

          <SidebarMenuItem>
            <SidebarTrigger
              className={"h-9 w-9 rounded-lg "}
              render={
                <SidebarMenuButton
                  tooltip={"Toggle Sidebar"}
                  className="flex items-center justify-center"
                >
                  <SidebarIcon
                    className={`${isCollapsed ? "rotate-180" : "rotate-0"} transition-transform duration-200`}
                  />
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <NewChatButton />
      </SidebarHeader>
      <SidebarSeparator className={`m-0`} />
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              render={
                <CollapsibleTrigger className={`w-fit`}>
                  Recent Chats
                  <ChevronDown className="ml-auto transition-transform duration-200 data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
              }
            ></SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="space-y-2">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SidebarMenuSkeleton
                      className="w-full"
                      key={`skeleton-${i}`}
                    />
                  ))
                ) : (
                  <>
                    {data ? (
                      <>
                        {data.data.map((item) => (
                          <ConversationItem
                            id={item._id}
                            title={item.title}
                            key={item.title}
                          />
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        {status === "loading" ? (
          <Skeleton className="size-10 w-full" />
        ) : (
          <NavUser
            name={userData?.name!}
            email={userData?.email!}
            avatar={userData?.image!}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatSidebar;
