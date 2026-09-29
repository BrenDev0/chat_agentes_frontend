export default function OnHoldSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 transition-colors">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              {/* Icon skeleton */}
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl shrink-0" />

              {/* Text skeleton */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            </div>

            {/* Trash button skeleton */}
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-slate-300 dark:bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
