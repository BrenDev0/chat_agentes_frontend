import { JSX } from "react";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { BiSolidError } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdError } from "react-icons/md";

interface Props<T extends FieldValues> {
  apiErrors?: string | null; // opcional
}

export default function FormShowErrors<T extends FieldValues>({
  apiErrors,
}: Props<T>) {
  return (
    <div className="animate-in slide-in-from-top-2 duration-300 mb-6 group">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex gap-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-4 -top-4 text-red-100 dark:text-red-900/10 group-hover:scale-110 transition-transform">
          <BiSolidError size={80} />
        </div>

        <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
          <MdError size={25} />
        </div>

        <div className="flex-1 space-y-2 relative z-10">
          <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
            Error
          </h4>
          <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
            {apiErrors && <li>{apiErrors}</li>}
          </ul>
        </div>

        <button className="flex-shrink-0 p-1 h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-red-400 dark:text-red-500 transition-colors">
          <IoIosCloseCircleOutline size={18} />
        </button>
      </div>
    </div>
  );
}
