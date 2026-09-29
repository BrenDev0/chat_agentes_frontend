"use client";

import Link from "next/link";
import { FaExclamation, FaHome } from "react-icons/fa";

export default function ErrorKnowledge() {
  return (
    <div className="bg-slate-50  dark:bg-slate-950 h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 transition-colors">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="relative flex items-center justify-center w-32 h-32 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl transition-colors">
          <FaExclamation
            size={64}
            className="text-indigo-600 dark:text-indigo-400 animate-pulse"
          />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          ¡Vaya! Algo salió mal
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          Ocurrio un error obteniendo los documentos del agente
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-sm">
        <Link
          href={`/dashboard/agents`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
        >
          <FaHome size={20} />
          Volver a agentes
        </Link>
      </div>
    </div>
  );
}
