import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />

      <main className="w-full flex flex-col gap-3">
        <div className="border-b py-2 sm:hidden bg-background sticky top-0 w-full px-4 z-50">
          <SidebarTrigger />
        </div>
        <div className="page max-w-5xl lg:px-7 px-4 py-2 mx-auto w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
