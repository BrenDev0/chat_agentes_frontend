"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { chat } from "../types/chat";
import { useConfirm } from "@/hooks/useModalConfirm";
import { Modal } from "@/types/modal";

interface ChatContextType {
  chats: chat[] | null;
  selectedChat: chat | null;
  activeChat: (chatSelected: chat | null) => void;
  openDeleteModal: (chatSelected: chat, mode: Modal) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  agentId,
}: {
  children: React.ReactNode;
  agentId: string;
}) {
  const [chats, setChats] = useState<chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const { openConfirm, ConfirmDialog } = useConfirm();

  const activeChat = (chatSelected: chat | null) => {
    setSelectedChat(chatSelected);
  };

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setErrorRequest("");

      const res = await fetch(`/api/agents/${agentId}/chats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorRequest(result.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setErrorRequest("");
      setChats(result.data);
    };

    fetchChats();
  }, []);

  const openDeleteModal = (chatSelected: chat, mode: Modal) => {
    let descText = "";
    if (mode.type !== "DELETE") {
      descText = mode.desc;
    } else {
      descText = `Estás a punto de eliminar este chat. Esta acción es permanente.`;
    }
    openConfirm({
      title: mode.title,
      description: descText,
      confirmText: mode.confirmText,
      onConfirm: async () => {
        try {
          setLoading(true);

          const res = await fetch(
            `/api/agents/${agentId}/chats/${chatSelected.chatId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chatId: chatSelected.chatId,
                operation: mode.type,
              }),
            },
          );

          const result = await res.json();

          if (!res.ok) {
            setErrorRequest(result.message);
            return;
          }

          setChats((prev) =>
            prev.filter((chat) => chat.chatId !== chatSelected.chatId),
          );
          activeChat(null);
        } catch {
          setErrorRequest("Ocurrió un error inesperado");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <ChatContext.Provider
      value={{ loading, chats, selectedChat, activeChat, openDeleteModal }}
    >
      {children}
      <ConfirmDialog />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used inside provider");
  }
  return context;
}
