"use client";

import { useState } from "react";
import FormShowErrors from "../ui/FormShowErrors";
import { Controller, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { BsFillSendCheckFill, BsSendFill } from "react-icons/bs";
import OtpInput from "./OtpInput";
import { useContextUser } from "@/context/UserContext";

type FormData = {
  email: string;
  code: string;
  token: string;
};

type Step = "email" | "code";

export default function FormChangeEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("email");
  const { onchangeEmail } = useContextUser();

  const {
    register,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      code: "",
      token: "",
    },
  });

  const onFormSubmit = async (data: FormData) => {
    setErrorRequest(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/changeProfileEmail/${step}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log(result);

      if (!res.ok) {
        setErrorRequest(result.message);
        setUpdateSuccess(false);
        setLoading(false);
        return;
      }

      setErrorRequest(null);
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        if (step == "email") {
          setStep("code");
          setValue("token", result.token.verificationToken, {
            shouldDirty: true,
            shouldValidate: true,
          });
        } else {
          setStep("email");
          reset();
        }
      }, 2000);
      setLoading(false);
      setErrorRequest(null);
      onchangeEmail(result.token.email);
    } catch (error: any) {
      setErrorRequest("Ocurrió un error, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const values = watch();

  return (
    <div>
      {errorRequest && <FormShowErrors apiErrors={errorRequest} />}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {step == "code" && (
          <button
            onClick={() => {
              setStep("email");
              reset();
            }}
            className="cursor-pointer text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest"
          >
            Cancelar
          </button>
        )}
        {step == "email" && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Nuevo Email
              </label>
              <input
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "El email no tiene un formato correcto",
                  },
                })}
                type="email"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.email?.message}
              </p>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading || !values.email}
                className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
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
                  <BsFillSendCheckFill size={18} />
                ) : (
                  <BsSendFill size={18} />
                )}
                {loading
                  ? "Enviando..."
                  : updateSuccess
                    ? "¡Codigo enviado!"
                    : "Solicitar codigo"}
              </button>
            </div>
          </>
        )}
        {step == "code" && (
          <>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-indigo-700 dark:text-indigo-400 text-center font-medium">
                Ingresa el código enviado a{" "}
                <span className="font-bold">{values.email}</span>
              </p>
            </div>
            <div className="space-y-1">
              <Controller
                name="code"
                control={control}
                rules={{
                  required: "El código es obligatorio",
                  minLength: { value: 6, message: "Debe tener 6 dígitos" },
                }}
                render={({ field }) => (
                  <OtpInput value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading || !values.email}
                className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
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
                  <BsFillSendCheckFill size={18} />
                ) : (
                  <BsSendFill size={18} />
                )}
                {loading
                  ? "Actualizando..."
                  : updateSuccess
                    ? "¡Actualizado!"
                    : "Confirmar cambio"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
