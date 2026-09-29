import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { FaChevronLeft, FaKey, FaSpinner } from "react-icons/fa";
import OtpInput from "../profile/OtpInput";
import { useState } from "react";
import { BsFillSendCheckFill, BsSendFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import { useRouter } from "next/navigation";

type FormData = {
  code: string;
  token: string | null;
};

interface Prop {
  token: string | null;
}

export default function FormRecoveryAcount({ token }: Prop) {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorRequest, setErrorRequest] = useState<string | null>(null);
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
      token: token,
    },
  });

  const values = watch();
  const router = useRouter();

  const onFormSubmit = async (data: FormData) => {
    setErrorRequest(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/publicRecovery/code`, {
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
        reset();
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      setErrorRequest("Ocurrió un error, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

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
            Verificar Código
          </h1>
          <p className="text-slate-500">
            Hemos enviado un código a su cuenta de correo.
          </p>
          <div className="bg-amber-300 p-4 flex flex-col rounded-2xl items-center">
            <MdError size={20} />
            <p className="text-sm mt-2">
              Debera ingresar en el perfil del usuario para cambiar de
              contraseña e iniciar sesion nuevamente
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
              disabled={loading || !values.token}
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
                ? "Verificando..."
                : updateSuccess
                  ? "¡Verificado!"
                  : "Verificar codigo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
