import { useForm } from "react-hook-form";
import FormShowErrors from "../ui/FormShowErrors";
import { useState } from "react";
import { FaChevronLeft, FaKey, FaSpinner } from "react-icons/fa";
import { BsFillSendCheckFill, BsSendFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import Link from "next/link";

type FormData = {
  email: string;
};

type ViewRecoveryAccount = "email" | "recovery";

interface Props {
  onChangeView: (view: ViewRecoveryAccount) => void;
  onSetToken: (token: string) => void;
}

export default function FormRecoveryVerifiedEmail({
  onChangeView,
  onSetToken,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({});

  const onFormSubmit = async (data: FormData) => {
    setErrorRequest(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/publicRecovery/email`, {
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
        onSetToken(result.token.verificationToken);
        onChangeView("recovery");
        // if (step == "email") {
        //   setStep("code");
        //   setToken(result.token.verificationToken);
        // } else {
        //   setStep("email");
        //   reset();
        // }
      }, 2000);
      // setValue("token", token, {
      //   shouldDirty: true,
      //   shouldValidate: true,
      // });
      setLoading(false);
    } catch (error: any) {
      setErrorRequest("Ocurrió un error, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const values = watch();
  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-6 lg:p-10 space-y-8">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
        >
          <FaChevronLeft size={16} />
          Volver al inicio de sesión
        </Link>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 shadow-amber-200 rounded-2xl text-white mb-4">
            <FaKey size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recuperar Cuenta
          </h1>
          <p className="text-slate-500">
            Introduce tu correo para recibir un código de recuperación.
          </p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <FormShowErrors formErrors={errors} apiErrors={errorRequest} />
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                    message: "El email no tiene un formato correcto",
                  },
                })}
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !values.email}
              className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-white shadow-lg shadow-indigo-200 dark:shadow-none ${
                updateSuccess
                  ? "bg-emerald-500"
                  : "bg-amber-500 active:scale-95 disabled:opacity-50 disabled:scale-100"
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
                  : "Solicitar codigo de verificación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
