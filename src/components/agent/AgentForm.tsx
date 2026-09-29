"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  FaChevronLeft,
  FaMap,
  FaPlay,
  FaRegSave,
  FaSpinner,
} from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { useState } from "react";
import FormShowErrors from "../ui/FormShowErrors";
import { AllAgentData } from "@/types/agent";
import DemoChat from "./DemoChat";
import { MdOutlineSupportAgent } from "react-icons/md";

type FormData = {
  settingId: string;
  agentId?: string;
  name: string;
  description: string;
  temperature: number;
  systemPrompt: string;
  transcripts: boolean;
};

interface Props {
  defaultValues?: AllAgentData | null;
}

export default function AgentForm({ defaultValues }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      settingId: defaultValues?.dataSettingAgent.settingId || "",
      agentId: defaultValues?.dataAgent.agentId || "",
      name: defaultValues?.dataAgent.name || "",
      description: defaultValues?.dataAgent.description || "",
      temperature: defaultValues?.dataSettingAgent.temperature || 0.5,
      systemPrompt: defaultValues?.dataSettingAgent.systemPrompt || "",
      transcripts: defaultValues?.dataSettingAgent.transcripts || true,
    },
    criteriaMode: "all",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const values = watch();

  const [saveTranscript, setSaveTranscript] = useState<boolean>(true);

  const onValueTranscript = () => {
    const newValue = !saveTranscript;

    setSaveTranscript(newValue);
    setValue("transcripts", newValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    const isUpdate = Boolean(data.agentId);

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: data,
        operation: isUpdate ? "update" : "create",
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorRequest(result.message);
      setSaveSuccess(false);
      setLoading(false);
      return;
    }

    setErrorRequest(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setLoading(false);
    reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
              <h2 className="flex flex-row gap-2 items-center text-xl font-bold text-slate-900 dark:text-slate-100">
                <Link
                  className="text-[16px] p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
                  href={"/dashboard/agents"}
                >
                  <FaChevronLeft className="cursor-pointer" />
                </Link>{" "}
                Configuración del Agente
              </h2>
            </div>
            <div className="space-y-6 flex flex-col">
              <div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nombre del Agente
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "El nombre del agente el obligatorio",
                    })}
                    className="text-slate-700 dark:text-slate-100 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.name?.message}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Descripcion del agente
                </label>
                <textarea
                  {...register("description", {
                    required: "La descripción del agente es obligatorio",
                  })}
                  className="text-slate-700 dark:text-slate-100 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700d rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  placeholder="Una breve descripcion del agente"
                />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.description?.message}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Temperatura ({values.temperature})
                </label>
                <input
                  {...register("temperature", { valueAsNumber: true })}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  className="block w-1/2 accent-indigo-600"
                />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.temperature?.message}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Instrucciones del Sistema
                </label>
                <textarea
                  {...register("systemPrompt", {
                    required: "Las instrucciones del agente son obligatorias",
                    minLength: {
                      value: 20,
                      message:
                        "Las instrucciones del agente deben ser más descriptivas (mín. 20 caracteres).",
                    },
                  })}
                  className="text-slate-700 dark:text-slate-100 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  placeholder="Describe cómo debe comportarse el agente..."
                />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.systemPrompt?.message}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Guardar transcripción
                </label>
                <button
                  type="button"
                  onClick={onValueTranscript}
                  className={`flex items-center p-1 rounded-full relative w-14 h-8 transition-colors border border-slate-200 dark:border-slate-700 ${
                    saveTranscript ? "bg-indigo-600" : "bg-transparent"
                  }`}
                >
                  <div
                    className={`absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
                      saveTranscript ? "translate-x-6" : "translate-x-0"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-2xl ${
                        saveTranscript ? "bg-white" : "bg-slate-400"
                      }`}
                    ></span>
                  </div>
                </button>
              </div>
              <div className="hidden space-y-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                  Herramientas (Grounding)
                </label>
                <div className="flex gap-4">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all bg-white border-slate-200 text-slate-500`}
                  >
                    <FaMap size={16} />
                    Google Maps
                  </button>
                </div>
              </div>
              <div className="self-end">
                <button
                  disabled={loading}
                  className={` cursor-pointer flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-indigo-700 transition-all ${
                    saveSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                  } disabled:opacity-50 disabled:scale-100`}
                >
                  {loading ? (
                    <FaSpinner
                      size={16}
                      className="block animate-spin text-white w-5 h-5"
                    />
                  ) : (
                    <FaRegSave size={16} />
                  )}
                  {loading
                    ? "Guardando..."
                    : saveSuccess
                      ? "¡Guardado!"
                      : "Guardar Cambios"}
                </button>
              </div>
              {errorRequest && <FormShowErrors apiErrors={errorRequest} />}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-5 min-w-md h-[calc(100vh-10rem)] sticky top-24">
        <div className="bg-slate-900 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <MdOutlineSupportAgent size={18} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {defaultValues?.dataAgent.name || "Agente Demo"}
                </h3>
                <p className="text-slate-400 text-xs">
                  {defaultValues?.dataAgent.description || "Demo"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-slate-50
          [&::-webkit-scrollbar-thumb]:bg-indigo-600
          dark:[&::-webkit-scrollbar-track]:bg-slate-950
          dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600"
          >
            <DemoChat />
            {/* <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                <LuMessageCircleMore size={32} />
              </div>
              <p className="text-slate-400 text-sm">
                Empieza una conversación para probar tu configuración.
              </p>
            </div> */}
          </div>
          <div className="p-4 bg-slate-800/30 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full bg-slate-800 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors">
                <FaPlay size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
