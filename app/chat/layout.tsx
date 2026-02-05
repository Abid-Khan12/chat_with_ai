import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />

      <main className="page">
        <div className="border-b py-2 md:hidden bg-background fixed top-0 w-full px-3 z-50">
          <SidebarTrigger />
        </div>
        <div className="h-full w-full flex items-center justify-center">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
