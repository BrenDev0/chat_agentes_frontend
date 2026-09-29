export default function KnowledgeSkeleton() {
  return (
    <tbody>
      {[...Array(3)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-6">
            <div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </td>
          <td className="px-6 py-6">
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
          <td className="px-6 py-6">
            <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
          <td className="px-6 py-6">
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </td>
          <td className="px-6 py-6">
            <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
