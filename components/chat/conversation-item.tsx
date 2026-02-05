"use client";

import { MessageCircle } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useRouter } from "next/navigation";

const ConversationItem = ({ title, id }: { id: string; title: string }) => {
  const { toggleSidebar, isMobile } = useSidebar();
  const router = useRouter();
  const handleClick = () => {
    router.replace(`/chat/${id}`);
    if (isMobile) {
      toggleSidebar();
    }
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
