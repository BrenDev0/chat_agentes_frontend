import { useContextUser } from "@/context/UserContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegSave, FaSpinner, FaUserEdit } from "react-icons/fa";
import FormShowErrors from "../ui/FormShowErrors";

type FormData = {
  userName: string;
};

export default function FormChangeName() {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const { user, onchangeName } = useContextUser();

  console.log(updateSuccess);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      userName: user?.name,
    },
  });

  const onFormSubmit = async (data: FormData) => {
    setErrorRequest(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/changeProfileName`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorRequest(result.message);
        setUpdateSuccess(false);
        setLoading(false);
        return;
      }
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
      onchangeName(result.token.name);
    } catch (err) {
      setErrorRequest("Ocurrió un error, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col justify-center">
      {errorRequest && <FormShowErrors apiErrors={errorRequest} />}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 flex flex-col justify-center"
      >
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Nombre Completo
          </label>
          <input
            type="text"
            {...register("userName", {
              required: "El nombre es obligatorio",
            })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.userName?.message}
          </p>
        </div>
        <div className="space-y-1">
          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors active:scale-95 disabled:opacity-50 disabled:scale-100
                ${
                  updateSuccess
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                }`}
          >
            {loading ? (
              <FaSpinner
                size={16}
                className="block animate-spin text-white w-5 h-5"
              />
            ) : updateSuccess ? (
              <FaRegSave size={18} />
            ) : (
              <FaUserEdit size={18} />
            )}
            {loading
              ? "Actualizando..."
              : updateSuccess
                ? "¡Nombre actualizado!"
                : "Actualizar nombre"}
          </button>
        </div>
      </form>
    </div>
  );
}
