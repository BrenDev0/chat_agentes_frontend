"use client";

import { tooglePassword } from "@/lib/tooglePassword";
import { View } from "@/types/view";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLongArrowAltRight,
  FaSpinner,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import FormShowErrors from "../ui/FormShowErrors";

type FormData = {
  name: string;
  email: string;
  password: string;
};

interface Prop {
  onChangeView: (view: View) => void;
}

export default function FormRegister({ onChangeView }: Prop) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  //const router = useRouter();

  const OnSubmit = async (data: FormData) => {
    console.log(data);

    setLoading(true);
    setErrorRequest("Ocurrio un error al crear la cuenta");
    setLoading(false);
  };

  const ontogglePassword = () => {
    const newStatus = tooglePassword(showPassword);
    setShowPassword(newStatus);
  };
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-8 duration-300">
        <div className="p-6 lg:p-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-600 rounded-2xl text-white mb-4 shadow-lg shadow-violet-200">
              <FaUserPlus size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Crea tu cuenta
            </h1>
            <p className="text-slate-500">
              Empieza a configurar tus propios agentes inteligentes
            </p>
          </div>

          <form onSubmit={handleSubmit(OnSubmit)} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-3 space-y-1">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="Julio Lopez"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">
                  Email
                </label>
                <div className="relative">
                  <IoIosMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "El email no tiene un formato valido",
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="nombre@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">
                Contraseña
              </label>
              <div className="relative">
                <FaKey
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "El password es obligatorio",
                    minLength: {
                      message:
                        "La contraseña debe contener almenos 8 caracteres",
                      value: 8,
                    },
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
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
            </div>

            <button
              disabled={loading}
              className="group w-full bg-violet-600 text-white font-bold py-4 rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {loading ? (
                <FaSpinner className="block animate-spin text-white w-5 h-5" />
              ) : (
                <>
                  Crear Cuenta
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
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => onChangeView("login")}
                className="cursor-pointer text-violet-600 font-bold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
