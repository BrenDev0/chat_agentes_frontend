"use client";

import { useState } from "react";
import { FaFileAlt, FaRegSave, FaSpinner, FaTrashAlt } from "react-icons/fa";
import FormShowErrors from "../ui/FormShowErrors";
import { FaCloudArrowUp } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import truncateFileName from "../../lib/truncateFileName";

type FormData = {
  agentId?: string;
  file: FileList;
  description: string;
  useForTraining: boolean;
};

interface Props {
  agentId: string;
}

export default function KnowledgeForm({ agentId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [useForTraining, setUseForTraining] = useState<boolean>(true);
  const router = useRouter();

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<FormData>({
    defaultValues: {
      agentId: agentId,
      useForTraining: true,
    },
    criteriaMode: "all",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const fileWatch = watch("file");
  const hasFile = fileWatch && fileWatch.length > 0;

  const onValueEmbedded = () => {
    const newValue = !useForTraining;

    setUseForTraining(newValue);
    setValue("useForTraining", newValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const clearFileSelection = () => {
    resetField("file");
  };

  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    const connectionId = localStorage.getItem("connectionId");
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("agentId", agentId);
    formData.append("description", String(data.description));
    formData.append("useForTraining", String(data.useForTraining));
    formData.append("connectionId", String(connectionId));
    const res = await fetch(`/api/agents/${agentId}/knowledgedocument/`, {
      method: "POST",
      body: formData,
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
    setTimeout(() => {
      (setSaveSuccess(false), router.refresh());
    }, 3000);
    setLoading(false);
    reset();
  };
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-slate-900 p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-10 space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <FaCloudArrowUp className="text-indigo-700" size={20} />
            <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">
              Subir documento
            </h3>
          </div>
        </div>
        <div className="relative">
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-8 flex flex-col"
          >
            <div className="relative group">
              {loading ? (
                <div className="space-y-4">
                  <p className="text-indigo-600 dark:text-indigo-400 font-black text-md flex flex-row gap-2 justify-center items-center">
                    Procesando archivo{" "}
                    <FaSpinner
                      size={16}
                      className="block animate-spin w-5 h-5"
                    />
                  </p>
                </div>
              ) : hasFile ? (
                <div className="relative p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <FaFileAlt size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="overflow-hidden text-sm font-bold text-indigo-900 dark:text-indigo-300 wrap-break-word truncate break-all">
                      <span className="sm:hidden">
                        {truncateFileName(fileWatch[0].name)}
                      </span>
                      <span className="hidden sm:inline">
                        {fileWatch[0].name}
                      </span>
                    </p>
                    <p className="text-[10px] text-indigo-500">
                      {(fileWatch[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={clearFileSelection}
                    disabled={loading}
                    className="cursor-pointer p-1.5 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors"
                    title="Quitar archivo"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center transition-all duration-300 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-900/5 group-hover:shadow-xl`}
                  >
                    <input
                      type="file"
                      {...register("file", {
                        validate: (files) =>
                          (files && files.length > 0) ||
                          "Debe seleccionar un archivo",
                      })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      disabled={loading}
                      accept=".pdf,.docx,.txt,.jpg"
                    />
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:text-indigo-500 transition-all">
                      <FaCloudArrowUp size={32} />
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      Suelta tus archivos aquí
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      o haz clic para explorar
                    </p>
                  </div>
                  <div>
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {errors.file?.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-white">
                Descripción
              </label>
              <textarea
                {...register("description", {
                  required: "La descripción del documento es obligatorio",
                })}
                className="text-slate-700 dark:text-slate-100 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Describe el contenido de este archivo"
              />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.description?.message}
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    useForTraining
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  <LuBrainCircuit />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Modo Entrenamiento
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                    {useForTraining
                      ? "El archivo se procesará y usará como base de conocimiento activa."
                      : "El archivo se guardará únicamente como respaldo sin ser procesado."}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={onValueEmbedded}
                    className={`cursor-pointer w-14 h-7 rounded-full transition-all relative flex items-center px-1.5 ${
                      useForTraining
                        ? "bg-indigo-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        useForTraining ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="self-end">
              <button
                disabled={loading}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-indigo-700 transition-all ${
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
          </form>
        </div>
      </div>
    </div>
  );
}
