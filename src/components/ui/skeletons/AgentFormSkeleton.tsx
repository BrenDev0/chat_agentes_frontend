export default function AgentFormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      {/* FORMULARIO */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <div className="h-6 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>

            {/* Temperatura */}
            <div className="space-y-2">
              <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            {/* System prompt */}
            <div className="space-y-2">
              <div className="h-4 w-60 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>

            {/* Toggle */}
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* CHAT PREVIEW */}
      <div className="lg:col-span-5 h-[calc(100vh-10rem)] sticky top-24">
        <div className="bg-slate-900 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-slate-800">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-700 rounded" />
                <div className="h-3 w-40 bg-slate-700 rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-slate-700 rounded" />
          </div>

          {/* Body */}
          <div className="flex-1 p-6 space-y-4">
            <div className="h-4 w-3/4 bg-slate-800 rounded" />
            <div className="h-4 w-2/3 bg-slate-800 rounded" />
            <div className="h-4 w-1/2 bg-slate-800 rounded" />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800">
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
