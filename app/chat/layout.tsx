import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />

      <main className="w-full h-screen md:pt-0 pt-10">
        <div className="border-b py-2 md:hidden bg-background fixed top-0 w-full px-4 z-50">
          <SidebarTrigger />
        </div>
        <div className="h-full w-full py-2">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
