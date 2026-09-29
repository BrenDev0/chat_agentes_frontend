"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLongArrowAltRight,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { useRouter } from "next/navigation";
import { tooglePassword } from "@/lib/tooglePassword";
import { View } from "@/types/view";
import FormShowErrors from "../ui/FormShowErrors";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

interface Prop {
  onChangeView: (view: View) => void;
}

export default function FormLogin({ onChangeView }: Prop) {
  const [loading, setLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const OnSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      setErrorRequest(result.message);
      setLoading(false);
      return;
    }
    setErrorRequest(null);
    setLoading(false);
    localStorage.setItem("connectionId", result.connectionId);
    router.push("/dashboard");
  };

  const ontogglePassword = () => {
    const newStatus = tooglePassword(showPassword);
    setShowPassword(newStatus);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-6 lg:p-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-4">
            <FaUser size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-slate-500">
            Accede a tu panel de control de agentes IA
          </p>
        </div>

        <form onSubmit={handleSubmit(OnSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">
              Email
            </label>
            <div className="relative">
              <div className="relative">
                <IoIosMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.email?.message}
              </p>
            </div>
          </div>

          <div className="space-y-0">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="relative">
                <FaKey
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "El password es obligatorio",
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                {showPassword ? (
                  <FaEyeSlash
                    size={20}
                    onClick={ontogglePassword}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                ) : (
                  <FaEye
                    size={20}
                    onClick={ontogglePassword}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                )}
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.password?.message}
              </p>
            </div>
            <Link
              href={"/recoveryAccount"}
              type="button"
              className="text-xs font-bold text-indigo-600 mb-2 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button className="cursor-pointer group w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2">
            {loading ? (
              <FaSpinner className="block animate-spin text-white w-5 h-5" />
            ) : (
              <>
                Iniciar Sesión
                <FaLongArrowAltRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
        {errorRequest && <FormShowErrors apiErrors={errorRequest} />}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            ¿No tienes una cuenta?{" "}
            <button
              onClick={() => onChangeView("register")}
              className="cursor-pointer text-indigo-600 font-bold hover:underline"
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
