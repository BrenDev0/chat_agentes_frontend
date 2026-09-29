"use client";

import { useChat } from "@/context/ChatsContext";
import { timeAgo } from "@/lib/timeAgo";
import { timeToId } from "@/lib/timeToId";
import { chat } from "@/types/chat";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import ChatMessage from "./ChatMessage";
import ChatListSkeleton from "../ui/skeletons/ChatListSkeleton";

export default function ChatsList() {
  const { chats, loading, selectedChat, activeChat } = useChat();

  return (
    <div
      className={`w-full h-full flex border-r border-slate-100 dark:border-slate-800`}
    >
      <div
        className={`relative h-full flex flex-col ${selectedChat ? "hidden lg:flex" : "flex"}`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-row items-start gap-2 mb-0">
            <Link
              className="text-[16px] p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
              href={`/dashboard/agents`}
            >
              <FaChevronLeft className="cursor-pointer" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Conversaciones
              </h2>
            </div>
          </div>
          <div className="relative">
            {/* <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por usuario o agente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:text-slate-200"
          /> */}
          </div>
        </div>

        <div
          className=" flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:bg-indigo-600/70
          dark:[&::-webkit-scrollbar-track]:bg-slate-900/70
          dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600"
        >
          {loading ? (
            <ChatListSkeleton />
          ) : (
            chats?.map((chatItem) => (
              <button
                onClick={() => activeChat(chatItem)}
                key={chatItem.chatId}
                className={`cursor-pointer w-full p-4 flex gap-4 transition-all border-b border-slate-50 dark:border-slate-800/50 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                  selectedChat?.chatId === chatItem.chatId
                    ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-600"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
              >
                <div className="w-12 h-12 bg-indigo-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold">
                  <MdOutlineChatBubbleOutline size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                      Conversación:{" "}
                      <span className="uppercase font-bold">
                        {`#${timeToId(chatItem.createdAt)}`}
                      </span>
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {timeAgo(chatItem.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                    Chat
                  </p>
                </div>
              </button>
            ))
          )}
          {!loading && chats?.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <IoSearch size={32} />
              </div>
              <p className="text-sm font-bold text-slate-500">
                No se encontraron chats
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 ${!selectedChat ? "hidden lg:flex" : "flex"}`}>
        {selectedChat && <ChatMessage />}
      </div>
    </div>
  );
}
