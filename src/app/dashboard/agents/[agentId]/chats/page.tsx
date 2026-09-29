import ChatsList from "@/components/chatAgent/ChatsList";
import ListMessage from "@/components/chatAgent/ChatMessage";
import { ChatProvider } from "@/context/ChatsContext";
import { getAllChats } from "@/lib/chats/getAllChats";

interface PageProps {
  params: {
    agentId: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const { agentId } = await params;
  return (
    <ChatProvider agentId={agentId}>
      <div className="p-4">
        <div className="h-[calc(100vh-7rem)] overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
          <ChatsList />
        </div>
      </div>
    </ChatProvider>
  );
}
