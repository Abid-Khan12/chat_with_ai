import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <main className="page">
        <div className="h-full w-full flex items-center justify-center">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
