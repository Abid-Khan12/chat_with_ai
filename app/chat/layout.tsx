import ChatSidebar from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrimaryChildrenProp } from "@/types/types";

const ChatLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <SidebarProvider>
      <ChatSidebar />

      <main className="h-screen w-full flex flex-col md:gap-0 gap-3 relative">
        <div className="border-b py-2 md:hidden bg-background absolute top-0 w-full px-4 z-50">
          <SidebarTrigger />
        </div>
        <div className="h-full max-w-5xl lg:px-7 px-4 py-2 mx-auto w-full md:pt-4 pt-11.5">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
