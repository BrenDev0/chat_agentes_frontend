"use client";

import Link from "next/link";
import AgentItems from "./AgentItems";
import { FaPlus, FaSync } from "react-icons/fa";
import { Agent } from "@/types/agent";
import { useState } from "react";
import ConfirmModal from "../ui/ConfirmModal";
import AgentItemsSkeleton from "../ui/skeletons/AgentItemsSkeleton";
import { useRouter } from "next/navigation";
import ErrorNotification from "../ui/ErrorNotification";
import { useConfirm } from "@/hooks/useModalConfirm";
import { Modal } from "@/types/modal";

type Columns = {
  id: string;
  title: string;
};

interface Props {
  dataAgents: Agent[];
}

const columTable: Columns[] = [
  {
    id: "agent",
    title: "Agente",
  },
  {
    id: "description",
    title: "Descripción",
  },
  {
    id: "state",
    title: "Estado",
  },
  {
    id: "create",
    title: "Fecha",
  },
  {
    id: "actions",
    title: "Acciónes",
  },
];

export default function AgentList({ dataAgents }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const { openConfirm, ConfirmDialog } = useConfirm();
  const router = useRouter();

  const openDeleteModal = (agent: Agent, mode: Modal) => {
    let descText = "";
    if (mode.type !== "DELETE") {
      descText = mode.desc;
    } else {
      descText = `Estás a punto de eliminar "${agent.name}". Esta acción es permanente.`;
    }
    openConfirm({
      title: mode.title,
      description: descText,
      confirmText: mode.confirmText,
      onConfirm: async () => {
        try {
          setLoading(true);

          const res = await fetch(`/api/agents/${agent.agentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              body: agent.agentId,
            }),
          });

          const result = await res.json();

          if (!res.ok) {
            setErrorRequest(result.message);
            return;
          }

          router.refresh();
        } catch {
          setErrorRequest("Ocurrió un error inesperado eliminando el elemento");
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mis Agentes
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestiona y monitorea todos tus agentes de IA creados
          </p>
        </div>
        <div className="flex flex-row gap-5">
          <button className="hidden cursor-pointer p-3 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50">
            <FaSync />
          </button>
          <Link href={"/dashboard/agents/new-agent"}>
            <button className="mt-4 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none font-semibold">
              <FaPlus />
              Nuevo Agente
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {columTable.map((column) => (
                  <th
                    key={column.id}
                    className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <AgentItemsSkeleton />
            ) : (
              <AgentItems
                agentsData={dataAgents}
                onConfirmDeleteAgent={openDeleteModal}
              />
            )}
          </table>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}
