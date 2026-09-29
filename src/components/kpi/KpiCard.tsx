import { ReactNode } from "react";

interface Prop {
  color: string;
  trend?: string;
  title: string;
  value: string;
  children: ReactNode;
}

export default function KpiCard({
  color,
  trend,
  title,
  value,
  children,
}: Prop) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>{children}</div>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {trend}
        </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
        {value}
      </p>
    </div>
  );
}
