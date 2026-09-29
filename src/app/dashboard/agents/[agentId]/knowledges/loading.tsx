export default function LoadingKnowledgePage() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-2 justify-between">
        <div className="flex flex-row justify-center items-start gap-2">
          {/* Back button */}
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />

          <div className="space-y-2">
            <div className="h-6 w-56 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Botón cola */}
        <div className="mt-5 lg:mt-0 h-12 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col lg:flex-row gap-4 mt-10">
        {/* Formulario */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Tabla */}
        <div className="w-full lg:w-2/3 overflow-x-auto">
          <div className="space-y-4">
            {/* Header tabla */}
            <div className="hidden md:flex gap-6">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>

            {/* Filas simuladas */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"
              >
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
