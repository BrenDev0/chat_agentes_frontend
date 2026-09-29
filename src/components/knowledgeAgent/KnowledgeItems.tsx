import { timeAgo } from "@/lib/timeAgo";
import { ItemState, Knowledge } from "@/types/knowledge";
import { JSX } from "react";
import { BsFileEarmarkX } from "react-icons/bs";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaRegTrashAlt,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Modal } from "@/types/modal";

interface Props {
  knowledgeData: Knowledge[];
  onConfirmDeleteknowledge: (Knowledge: Knowledge, mode: Modal) => void;
}

export default function KnowledgeItems({
  knowledgeData,
  onConfirmDeleteknowledge,
}: Props) {
  const deleteMode: Modal = {
    title: "¿Eliminar este elemento?",
    desc: "",
    type: "DELETE",
    confirmText: "Si, eliminar",
  };
  const processMode: Modal = {
    title: "Iniciar procesamiento",
    desc: "El archivo se procesara para que se agregue al contexto del agente, puede tardar unos minutos en iniciar el proceso",
    type: "PROCESS",
    confirmText: "Si, procesar",
  };
  const dataMode: Modal = {
    title: "Borrar datos guardados",
    desc: "Se borraran todos los datos obtenidos de este archivo, pero el archivo no se eliminara ",
    type: "DATA",
    confirmText: "Si, borrar",
  };
  const stateIconMap: Record<ItemState, JSX.Element> = {
    PROCESADO: (
      <span className="flex items-center gap-2 text-green-600">
        <FaCheckCircle />
        <span>Procesado</span>
      </span>
    ),
    PROCESANDO: (
      <span className="flex items-center gap-2 text-blue-600">
        <FaSpinner className="animate-spin" />
        <span>Procesando</span>
      </span>
    ),
    "NO PROCESADO": (
      <span className="flex items-center gap-2 text-gray-500">
        <FaClock />
        <span>No procesado</span>
      </span>
    ),
    ERROR: (
      <span className="flex items-center gap-2 text-red-600">
        <FaExclamationTriangle />
        <span>Error</span>
      </span>
    ),
  };

  if (!knowledgeData || knowledgeData.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={5}
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
      {knowledgeData.map((knowledge) => {
        return (
          <tr
            key={knowledge.knowledgeId}
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
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <FaFileAlt size={20} />
                </div>
                <div>
                  <p className="w-52 overflow-hidden text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {knowledge.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{knowledge.size}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold dark:text-slate-400">
                    {knowledge.type}
                  </span>
                </div>
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {knowledge.description}
              </p>
            </td>

            <td
              data-label="Fecha"
              className="
            px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400
          "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {timeAgo(knowledge.createdAt)}
              </p>
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
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-10">
                {stateIconMap[knowledge.state] ?? null}
              </span>
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
                <button
                  onClick={() =>
                    onConfirmDeleteknowledge(knowledge, deleteMode)
                  }
                  className="cursor-pointer p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Eliminar archivo"
                >
                  <FaRegTrashAlt size={16} />{" "}
                </button>
                {knowledge.state === "NO PROCESADO" && (
                  <button
                    onClick={() =>
                      onConfirmDeleteknowledge(knowledge, processMode)
                    }
                    className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    title="Procesar documento"
                  >
                    <MdOutlineDocumentScanner size={18} />
                  </button>
                )}
                {knowledge.state === "PROCESADO" && (
                  <button
                    onClick={() =>
                      onConfirmDeleteknowledge(knowledge, dataMode)
                    }
                    className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    title="Eliminar Datos"
                  >
                    <BsFileEarmarkX size={18} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
