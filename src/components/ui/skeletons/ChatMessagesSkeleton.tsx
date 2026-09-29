interface ChatSkeletonProps {
  count?: number;
}

export default function ChatMessageSkeleton({ count = 6 }: ChatSkeletonProps) {
  return (
    <div>
      {[...Array(count)].map((_, i) => {
        const isHuman = i % 2 === 0;

        return (
          <div
            key={i}
            className={`flex ${
              isHuman ? "justify-end" : "justify-start"
            } animate-pulse`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                isHuman ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 shrink-0" />

              {/* Bubble */}
              <div className="space-y-2">
                <div
                  className={`px-5 py-3 rounded-2xl ${
                    isHuman
                      ? "bg-indigo-300/40 rounded-tr-none"
                      : "bg-slate-200 dark:bg-slate-700 rounded-tl-none"
                  }`}
                >
                  <div className="h-3 w-40 bg-white/60 dark:bg-slate-600 rounded mb-2" />
                  <div className="h-3 w-28 bg-white/60 dark:bg-slate-600 rounded" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
