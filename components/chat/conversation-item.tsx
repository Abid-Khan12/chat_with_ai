"use client";

import { MessageCircle } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/navigation";

const ConversationItem = ({
  title,
  id,
  isCollapsed,
}: {
  id: string;
  title: string;
  isCollapsed: boolean;
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.replace(`/chat/${id}`);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="truncate"
          onClick={handleClick}
          tooltip={title}
        >
          <MessageCircle />
          {title}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default ConversationItem;
