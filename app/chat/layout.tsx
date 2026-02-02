import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />

      <main className="w-full max-w-5xl lg:px-7 px-4 py-2">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
