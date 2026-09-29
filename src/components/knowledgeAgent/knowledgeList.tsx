"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import { Knowledge } from "@/types/knowledge";
import KnowledgeForm from "./knowledgeForm";
import KnowledgeSkeleton from "../ui/skeletons/KnowledgeSkeleton";
import { LuFileClock } from "react-icons/lu";
import ErrorNotification from "../ui/ErrorNotification";
import KnowledgeItems from "./KnowledgeItems";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useModalConfirm";
import { Modal } from "@/types/modal";

type Columns = {
  id: string;
  title: string;
};

interface Props {
  agentId: string;
  dataKnowledge: Knowledge[];
}

const columTable: Columns[] = [
  {
    id: "archivo",
    title: "Archivo",
  },
  {
    id: "info",
    title: "Info",
  },
  {
    id: "fecha-subida",
    title: "Fecha",
  },
  {
    id: "estado",
    title: "Estatus",
  },
  {
    id: "actions",
    title: "Acciónes",
  },
];

export default function KnowledgeList({ agentId, dataKnowledge }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const { openConfirm, ConfirmDialog } = useConfirm();

  const router = useRouter();

  const openDeleteModal = (knowledge: Knowledge, mode: Modal) => {
    let descText = "";
    const knowledgeId = knowledge.knowledgeId;
    const connectionId = localStorage.getItem("connectionId");
    if (mode.type !== "DELETE") {
      descText = mode.desc;
    } else {
      descText = `Estás a punto de eliminar "${knowledge.name}". Esta acción es permanente.`;
    }
    openConfirm({
      title: mode.title,
      description: descText,
      confirmText: mode.confirmText,
      onConfirm: async () => {
        try {
          setLoading(true);

          const res = await fetch(
            `/api/agents/${agentId}/knowledgeDocuments/${knowledgeId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                knowledgeId: knowledge.knowledgeId,
                connectionId: connectionId,
                operation: mode.type,
              }),
            },
          );

          const result = await res.json();

          if (!res.ok) {
            setErrorRequest(result.message);
            return;
          }

          router.refresh();
        } catch {
          setErrorRequest("Ocurrió un error inesperado");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const closeNotification = () => {
    setErrorRequest(null);
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
      {errorRequest && (
        <ErrorNotification
          onCloseNotification={closeNotification}
          message={errorRequest}
        />
      )}
      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-2 justify-between">
          <div className="flex flex-row justify-center items-start gap-2">
            <Link
              className="text-[16px] p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
              href={`/dashboard/agents`}
            >
              <FaChevronLeft className="cursor-pointer" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Base de Conocimiento
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Entrena a tus agentes con documentos específicos para mejorar su
                precisión.
              </p>
            </div>
          </div>
          <div>
            <Link href={`/dashboard/agents/${agentId}/onhold`}>
              <button className="mt-5 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none font-semibold">
                <LuFileClock />
                Cola de procesamiento
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mt-10">
        <div className="w-full lg:w-1/3">
          <KnowledgeForm agentId={agentId} />
        </div>
        <div className="w-full lg:w-2/3 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {columTable.map((columns) => (
                  <th
                    key={columns.id}
                    className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {columns.title}
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <KnowledgeSkeleton />
            ) : (
              <KnowledgeItems
                onConfirmDeleteknowledge={openDeleteModal}
                knowledgeData={dataKnowledge}
              />
            )}
          </table>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}
