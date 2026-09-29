import { Agent } from "@/types/agent";
import Badge from "../ui/Badge";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import { MdModeEdit, MdOutlineChatBubbleOutline } from "react-icons/md";
import Link from "next/link";
import { TbDatabase } from "react-icons/tb";
import { timeAgo } from "@/lib/timeAgo";
import { Modal } from "@/types/modal";

interface Props {
  agentsData?: Agent[];
  onConfirmDeleteAgent: (AgentToDelete: Agent, mode: Modal) => void;
}

export default function AgentItems({
  agentsData,
  onConfirmDeleteAgent,
}: Props) {
  const deleteMode: Modal = {
    title: "¿Eliminar este elemento?",
    desc: "",
    type: "DELETE",
    confirmText: "si, eliminar",
  };
  if (!agentsData || agentsData.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={6}
            className="px-6 py-10 text-center text-md text-slate-500 font-bold"
          >
            No se encontraron datos
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-slate-100 md:divide-y-0">
      {agentsData.map((agent) => {
        return (
          <tr
            key={agent.agentId}
            className="
          block md:table-row
          border border-slate-200 dark:border-slate-800
          md:border-0
          rounded-xl md:rounded-none
          mb-4 md:mb-0
          hover:bg-slate-50/80 dark:hover:bg-slate-800/40
          transition-colors
          group
        "
          >
            {/* Nombre */}
            <td
              data-label="Agente"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <div className="flex items-center gap-3">
                <Badge name={agent.name} />
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {agent.name}
                </p>
              </div>
            </td>

            {/* Descripción */}
            <td
              data-label="Descripción"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                {agent.description}
              </span>
            </td>

            {/* Estado */}
            <td
              data-label="Estado"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  agent.agentState
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    agent.agentState ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {agent.agentState ? "Activo" : "Inactivo"}
              </span>
            </td>

            {/* Fecha */}
            <td
              data-label="Creado"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {timeAgo(agent.createdAt)}
              </p>
            </td>

            {/* Acciones */}
            <td
              data-label="Acciones"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <div className="flex gap-2 justify-start md:justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Link
                  href={`agents/${agent.agentId}/chats`}
                  className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  title="Chats"
                >
                  <MdOutlineChatBubbleOutline size={16} />
                </Link>
                <Link
                  href={`agents/${agent.agentId}/knowledges`}
                  className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  title="Base de conocimiento"
                >
                  <TbDatabase size={16} />
                </Link>
                <Link
                  href={`agents/${agent.agentId}`}
                  className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  title="Editar"
                >
                  <MdModeEdit size={16} />
                </Link>
                <button
                  onClick={() => onConfirmDeleteAgent(agent, deleteMode)}
                  className="cursor-pointer p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <FaRegTrashAlt size={16} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
