import ChatWindow from "@/components/chat/chat-window";

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ChatWindow id={id} />;
};

export default ChatPage;
