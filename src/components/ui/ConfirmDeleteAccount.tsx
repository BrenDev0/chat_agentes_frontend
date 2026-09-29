import { useForm } from "react-hook-form";
import { BiSolidError } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import FormShowErrors from "./FormShowErrors";

interface Props {
  confirmDelete: (word: string) => void;
  closeDeleteModal: () => void;
  isDeleting: boolean;
  errorMsg: string | null;
  deleteStatus: boolean;
}

type FormData = {
  secureWords: string;
};

export default function ConfirmDeleteAccount({
  confirmDelete,
  closeDeleteModal,
  isDeleting,
  errorMsg,
  deleteStatus,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      secureWords: "",
    },
  });

  const onValidateData = (data: FormData) => {
    confirmDelete(data.secureWords);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all">
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeDeleteModal}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl mb-6">
            <BiSolidError size={28} />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              ¿Estás absolutamente seguro?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Esta acción es irreversible. Para confirmar, por favor ingresa la
              frase <span className="font-bold uppercase">Eliminar cuenta</span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-8 items-center">
            <form className="w-full" onSubmit={handleSubmit(onValidateData)}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Frase de confirmación
                </label>
                <input
                  {...register("secureWords", {
                    required: "La frase es obligatorio",
                  })}
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.secureWords?.message}
                </p>
              </div>
              <div className="flex gap-3 mt-8 items-center">
                <button
                  disabled={isDeleting}
                  onClick={closeDeleteModal}
                  className="cursor-pointer flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className={`flex flex-row items-center justify-center cursor-pointer flex-1 px-4 py-3 font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 dark:shadow-none ${
                    deleteStatus
                      ? "bg-emerald-500 text-white"
                      : "bg-red-600 text-white active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                  } disabled:opacity-50 disabled:scale-100`}
                >
                  {isDeleting ? (
                    <FaSpinner
                      size={16}
                      className="block animate-spin text-white w-5 h-5"
                    />
                  ) : deleteStatus ? (
                    "¡Cuenta eliminada!"
                  ) : (
                    "Borrar cuenta"
                  )}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="cursor-pointer absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <IoIosCloseCircleOutline size={30} />
                </button>
              </div>
            </form>
            {errorMsg && <FormShowErrors apiErrors={errorMsg} />}
          </div>
        </div>
      </div>
    </div>
  );
}
