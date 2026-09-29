import KpiDashboard from "../../components/KpiDashboard";

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Panel de Control
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Sigue el rendimiento de tus agentes de IA en tiempo real.
        </p>
        <KpiDashboard />
      </div>
    </div>
  );
}
