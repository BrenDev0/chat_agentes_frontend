import { BiSolidError } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Prop {
  message: string;
  onCloseNotification: () => void;
}

export default function ErrorNotification({
  message,
  onCloseNotification,
}: Prop) {
  return (
    <div className="fixed top-20 right-0 bg-red-100 dark:bg-red-900 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl text-red-600 dark:text-red-400">
          <BiSolidError size={20} />
        </div>
        <p className="text-sm font-medium text-red-800 dark:text-slate-300">
          {message}
        </p>
      </div>
      <button
        onClick={onCloseNotification}
        className="cursor-pointer text-xs font-bold text-red-600 dark:text-slate-300 hover:underline px-3 py-1.5"
      >
        <IoIosCloseCircleOutline size={30} />
      </button>
    </div>
  );
}
