"use client";

import { useChat } from "@/context/ChatsContext";
import { message } from "@/types/messages";
import { Modal } from "@/types/modal";
import { useEffect, useState } from "react";
import { BiExport, BiMessageSquare } from "react-icons/bi";
import { FaChevronLeft, FaRegTrashAlt, FaUser } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { MdOutlineChatBubbleOutline, MdSupportAgent } from "react-icons/md";
import { timeAgo } from "../../lib/timeAgo";
import ChatMessageSkeleton from "../ui/skeletons/ChatMessagesSkeleton";
import ErrorNotification from "../ui/ErrorNotification";

export default function ChatMessage() {
  const [messages, setMessages] = useState<message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const { selectedChat, activeChat, openDeleteModal } = useChat();
  const deleteMode: Modal = {
    title: "¿Eliminar este elemento?",
    desc: "",
    type: "DELETE",
    confirmText: "Si, eliminar",
  };

  useEffect(() => {
    if (!selectedChat?.chatId) return;

    const controller = new AbortController();

    const fetchChats = async () => {
      try {
        setLoading(true);
        setErrorRequest(null);

        const res = await fetch(`/api/messages/${selectedChat.chatId}`, {
          signal: controller.signal,
        });

        const result = await res.json();

        console.log(result);

        if (!res.ok) {
          setErrorRequest(result.message);
          return;
        }

        setMessages(result.data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setErrorRequest("Error al obtener los mensajes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    return () => controller.abort();
  }, [selectedChat?.chatId]);

  const closeNotification = () => {
    setErrorRequest(null);
  };

  return (
    <div className={`flex-1 h-full flex flex-col min-w-0`}>
      {errorRequest && (
        <ErrorNotification
          onCloseNotification={closeNotification}
          message={errorRequest}
        />
      )}
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => activeChat(null)}
                className="flex lg:hidden cursor-pointer text-[16px] p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
              >
                <FaChevronLeft className="cursor-pointer" />
              </button>
              <div className="hidden lg:flex w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl items-center justify-center text-white font-bold shadow-lg">
                <MdOutlineChatBubbleOutline size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {`Conversacion: #8486`}
                </h3>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1">
                  Información de contacto
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                <BiExport size={20} />
              </button>
              <button
                onClick={() => openDeleteModal(selectedChat, deleteMode)}
                className="cursor-pointer p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <FaRegTrashAlt size={20} />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all">
                <IoMdMore size={20} />
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 dark:bg-slate-950/20 [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-200
        [&::-webkit-scrollbar-thumb]:bg-indigo-600/70
        dark:[&::-webkit-scrollbar-track]:bg-slate-900/70
        dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600"
          >
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Inicio de sesión - {timeAgo(selectedChat.createdAt)}
              </div>
            </div>

            {loading ? (
              <ChatMessageSkeleton />
            ) : (
              messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "human" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${msg.type === "human" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                        msg.type === "human"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {msg.type === "human" ? (
                        <FaUser size={16} />
                      ) : (
                        <MdSupportAgent size={20} />
                      )}
                    </div>
                    <div
                      className={`space-y-1.5 ${msg.type === "human" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.type === "human"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        10:35 pm
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-400">
            <BiMessageSquare size={48} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Selecciona una conversación
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            Elige un hilo de la lista de la izquierda para ver el historial
            completo de la interacción.
          </p>
        </div>
      )}
    </div>
  );
}
