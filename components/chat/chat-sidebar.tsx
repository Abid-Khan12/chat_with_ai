"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import useAppContext from "@/context/app-context";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./sidebar-footer";
const ChatSidebar = () => {
  const { status, userData } = useAppContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
       
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
