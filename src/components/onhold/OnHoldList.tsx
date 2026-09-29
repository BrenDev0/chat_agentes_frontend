"use client";

import { KnowledgeProcess } from "@/types/knowledge";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaChevronLeft, FaFileAlt } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
import OnHoldSkeleton from "../ui/skeletons/onHoldListSkeleton";
import ErrorNotification from "../ui/ErrorNotification";
import { openWebSocket } from "@/lib/onHoldList/webSocketConnection";
import { BsRecordCircle } from "react-icons/bs";
import getRedisData from "@/lib/onHoldList/getRedisData";

interface Props {
  agentId: string;
}

export default function OnHoldList({ agentId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [queue, setQueue] = useState<KnowledgeProcess[]>([]);

  const pendingItems = queue?.filter(
    (i: KnowledgeProcess) => i.status != "Guardado",
  );
  const finishedItems = queue?.filter(
    (i: KnowledgeProcess) => i.status === "Guardado",
  );

  const wsRef = useRef<WebSocket | null>(null);
  const wsInitialized = useRef(false);

  useEffect(() => {
    if (!agentId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorRequest(null);

        const result = await getRedisData(agentId);

        setQueue(result);
      } catch (err: any) {
        setErrorRequest("Ocurrió un obteniendo los procesos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId]);

  const closeNotification = () => {
    setErrorRequest(null);
  };

  useEffect(() => {
    if (wsInitialized.current) return;
    wsInitialized.current = true;

    openWebSocket().then((ws) => {
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const event = JSON.parse(e.data);
        if (event.type == "STATUS") {
          const { stage, status, progress, knowledge_id } = event.data;
          setQueue((prev) =>
            prev.map((item) =>
              item.knowledgeId === knowledge_id
                ? { ...item, ...event.data }
                : item,
            ),
          );
        }
      };
    });

    return () => {
      wsRef.current?.close();
      wsInitialized.current = false;
    };
  }, []);

  const confirmDelete = async () => {};

  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
      {/* {isDeleteModalOpen && queueToDelete && (
        <ConfirmModal
          closeDeleteModal={closeDeleteModal}
          confirmDelete={confirmDelete}
          objectToDelete={queueToDelete?.name}
          isDeleting={loading}
        />
      )} */}
      {errorRequest && (
        <ErrorNotification
          onCloseNotification={closeNotification}
          message={errorRequest}
        />
      )}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-start">
          <Link
            className="text-[16px] p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
            href={`knowledges`}
          >
            <FaChevronLeft className="cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Cola de procesamiento
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Monitorea el progreso del entrenamiento tu agente de IA.
            </p>
          </div>
        </div>
        {/* <button
          onClick={onOpenConnection}
          className="bg-white p-4 rounded-2xl shadow-sm"
        >
          web socket
        </button> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors overflow-hidden">
            <div className="flex flex-row justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <LuBrainCircuit size={18} className="text-indigo-500" />
                  Tareas Activas
                </h3>
              </div>
              <div className="p-6">
                <BsRecordCircle className="animate-pulse text-amber-600 dark:text-red-600" />
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <OnHoldSkeleton />
              ) : !loading && pendingItems?.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <FaCheckCircle
                    size={48}
                    className="mx-auto mb-4 opacity-20"
                  />
                  <p>No hay tareas pendientes en la cola.</p>
                </div>
              ) : (
                pendingItems?.map((item: KnowledgeProcess) => (
                  <div
                    key={item.knowledgeId}
                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                          <FaFileAlt size={24} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{item.size}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{item.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">{item.status}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="
                            h-full 
                            bg-indigo-600
                            transition-[width]
                            duration-700
                            ease-out
                          "
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <FaCheckCircle size={18} className="text-emerald-500" />
              Completados Recientemente
            </h3>

            <div className="space-y-4">
              {finishedItems?.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No hay archivos procesados en esta sesión.
                </p>
              ) : (
                finishedItems?.map((item: KnowledgeProcess) => (
                  <div
                    key={item.knowledgeId}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right-2"
                  >
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                      <FaFileAlt size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Finalizado correctamente
                      </p>
                    </div>
                    <FaCheckCircle size={14} className="text-emerald-500" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-none text-white space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FiAlertTriangle size={24} />
            </div>
            <h4 className="font-bold">¿Sabías que?</h4>
            <p className="text-indigo-100 text-sm leading-relaxed">
              El tiempo de procesamiento depende de la complejidad del documento
              y la carga del modelo. Los archivos PDF con imágenes tardan un
              poco más en ser indexados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
