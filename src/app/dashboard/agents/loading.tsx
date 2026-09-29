import AgentItemsSkeleton from "@/components/ui/skeletons/AgentItemsSkeleton";

type Columns = {
  id: string;
  title: string;
};

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
    title: "Creado",
  },
  {
    id: "actions",
    title: "Acciones",
  },
];

export default function LoadingAgents() {
  return (
    <div className="relative p-8 max-w-8xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Mis Agentes
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Gestiona y monitorea todos tus agentes de IA creados
        </p>
      </div>
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
        <AgentItemsSkeleton />
      </table>
    </div>
  );
}
