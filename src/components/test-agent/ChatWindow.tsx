"use client";

import { Agent } from "@/types/agent";
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import ModalAgentSelect from "./ModalAgentSelect";
import { useForm } from "react-hook-form";
import { IoMdSend } from "react-icons/io";

type FormData = {
  messageUser: string;
};

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [agentSelected, setAgentSelected] = useState<Agent | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      messageUser: "",
    },
    criteriaMode: "all",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onFormSubmit = () => {
    console.log("Hola");
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FaRobot size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Probador de Agentes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interactúa en tiempo real con tus configuraciones
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 text-sm text-slate-800 dark:text-white">
          <button onClick={() => setIsOpen(true)}>
            <p>Selecciona un agente</p>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-slate-200 dark:border-slate-800">
        <div
          className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-slate-50
              [&::-webkit-scrollbar-thumb]:bg-indigo-600
              dark:[&::-webkit-scrollbar-track]:bg-slate-950
              dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600"
        >
          <div className="bg-white dark:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-800 dark:text-white">
              {agentSelected?.name}
            </p>
          </div>
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
              <LuMessageCircleMore size={32} />
            </div>
            <p className="text-slate-400 text-sm">
              Selecciona un agente y empieza una conversación para probar tu
              configuración.
            </p>
          </div>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200">
          <div className="relative">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <input
                {...register("messageUser", {
                  required: "No se pueden enviar mensajes vacios",
                })}
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full bg-white dark:bg-slate-800 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors">
                <IoMdSend size={25} />
              </button>
            </form>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.messageUser?.message}
          </p>
        </div>
      </div>
      <ModalAgentSelect
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(agent) => setAgentSelected(agent)}
      />
    </>
  );
}
