export default function AgentItemsSkeleton() {
  return (
    <tbody>
      {[...Array(3)].map((_, i) => (
        <tr
          key={i}
          className="animate-pulse block md:table-row
          border border-slate-200 dark:border-slate-800
          md:border-0
          rounded-xl md:rounded-none
          mb-4 md:mb-0
          hover:bg-slate-50/80 dark:hover:bg-slate-800/40
          transition-colors
          group"
        >
          <td
            className="px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400"
          >
            <div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </td>
          <td
            className="px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400"
          >
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
          <td
            className="px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400"
          >
            <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
          <td
            className="px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400"
          >
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </td>
          <td
            className="px-6 py-4
            block md:table-cell
            before:content-[attr(data-label)]
            before:block md:before:hidden
            before:text-xs before:font-bold
            before:text-slate-500 dark:before:text-slate-400"
          >
            <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
