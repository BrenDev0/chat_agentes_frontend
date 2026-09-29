"use client";

import DangerZone from "@/components/profile/DangerZone";
import FormChangeEmail from "@/components/profile/FormChangeEmail";
import FormChangeName from "@/components/profile/FormChangeName";
import FormChangePassword from "@/components/profile/FormChangePassword";
import SwitchNotifications from "@/components/profile/SwitchNotifications";
import Badge from "@/components/ui/Badge";
import { useContextUser } from "@/context/UserContext";
import { FaBell, FaKey, FaRegSave, FaShieldAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function UserProfilePage() {
  const { user } = useContextUser();

  if (!user) {
    return (
      <h2 className="p-8 text-center text-md text-slate-500 font-bold">
        No se encontro ningun usuario activo
      </h2>
    );
  }

  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="flex flex-col text-center lg:text-left lg:flex-row items-center gap-6 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <Badge
          name={user?.name}
          className="bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg p-8"
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {user.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
          <div className="mt-2 flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider transition-colors">
              Plan Pro
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FaUser
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            Información Personal
          </h3>
          <FormChangeName />
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FaShieldAlt
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            Seguridad
          </h3>
          <div className="space-y-4">
            <FormChangePassword userId={user.userId} />
            <div className="hidden w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <FaBell
                  size={18}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Notificaciones
                </span>
              </div>
              <SwitchNotifications />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MdEmail
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            Actualizar email
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Para cambiar tu email principal, deberás verificar la nueva
            dirección mediante un código de seguridad.
          </p>
          <div className="space-y-4">
            <FormChangeEmail />
          </div>
        </div>
        <DangerZone />
      </div>
    </div>
  );
}
