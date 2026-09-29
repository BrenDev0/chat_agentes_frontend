import { BiSolidError } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading,
  onConfirm,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all">
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl mb-6">
            <BiSolidError size={28} />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-3 mt-8 items-center">
            <button
              disabled={isLoading}
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {cancelText}
            </button>

            <button
              disabled={isLoading}
              onClick={onConfirm}
              className="flex flex-row items-center justify-center cursor-pointer flex-1 px-4 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-red-100 dark:shadow-none"
            >
              {isLoading ? (
                <FaSpinner
                  size={16}
                  className="block animate-spin text-white w-5 h-5"
                />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <IoIosCloseCircleOutline size={30} />
        </button>
      </div>
    </div>
  );
}
