"use client";

import { useState } from "react";
import { useForm, set } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaRegSave,
  FaSpinner,
  FaUserLock,
} from "react-icons/fa";
import FormShowErrors from "../ui/FormShowErrors";

type FormData = {
  oldPassword: string;
  newPassword: string;
};

interface Props {
  userId: string;
}

export default function FormChangePassword({ userId }: Props) {
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch(`/api/user/${userId}`, {
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

    setErrorRequest(null);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
    setLoading(false);
    reset();
  };

  const values = watch();

  return (
    <div>
      {errorRequest && <FormShowErrors apiErrors={errorRequest} />}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Contraseña Antigua
          </label>
          <div className="relative">
            <FaUserLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type={showOldPassword ? "text" : "password"}
              {...register("oldPassword", {
                required: "La contraseña es obligatorio",
              })}
              className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
            <p className="text-red-600 dark:text-red-400 text-sm">
              {errors.oldPassword?.message}
            </p>
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showOldPassword ? (
                <FaEyeSlash
                  size={20}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              ) : (
                <FaEye
                  size={20}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Nueva Contraseña
          </label>
          <div className="relative">
            <FaUserLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener mínimo 8 caracteres",
                },
              })}
              className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Mínimo 8 caracteres"
            />
            <p className="text-red-600 dark:text-red-400 text-sm">
              {errors.newPassword?.message}
            </p>
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showNewPassword ? (
                <FaEyeSlash
                  size={20}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              ) : (
                <FaEye
                  size={20}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !values.oldPassword || !values.newPassword}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            updateSuccess
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50 disabled:scale-100"
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
            <FaKey size={18} />
          )}
          {loading
            ? "Actualizando..."
            : updateSuccess
              ? "¡Actualizado!"
              : "Cambiar Contraseña"}
        </button>
      </form>
    </div>
  );
}
