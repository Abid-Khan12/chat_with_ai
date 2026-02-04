import { MessageSquare, Sparkles, Zap } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
      <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="size-8 text-primary" />
        </div>

        <h1 className="md:text-3xl text-2xl font-bold tracking-tight">
          Welcome to Chat_With_AI
        </h1>

        <p className="text-muted-foreground md:text-lg">
          Start a new conversation to get assistance with anything you need
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-2xl md:grid-cols-3">
        <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <Sparkles className="size-5 text-primary mb-2" />
          <h3 className="font-medium mb-1">Creative Writing</h3>
          <p className="text-sm text-muted-foreground">
            Get help with stories, essays, and more
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <Zap className="size-5 text-primary mb-2" />
          <h3 className="font-medium mb-1">Quick Answers</h3>
          <p className="text-sm text-muted-foreground">
            Ask questions and get instant responses
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <MessageSquare className="size-5 text-primary mb-2" />
          <h3 className="font-medium mb-1">Deep Conversations</h3>
          <p className="text-sm text-muted-foreground">
            Explore complex topics in detail
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Click "New Chat" in the sidebar to begin
      </p>
    </div>
  );
};

export default ChatPage;
