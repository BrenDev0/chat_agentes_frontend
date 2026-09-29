export default function ChatListSkeleton() {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div className="w-full p-4 flex gap-4 border-b border-slate-50 dark:border-slate-800/50 animate-pulse">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>

            {/* Description */}
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
