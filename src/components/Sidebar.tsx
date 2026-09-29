"use client";

import { NavItem } from "@/types/navItem";
import { usePathname } from "next/navigation";
import { FaSpinner, FaUser } from "react-icons/fa";
import { MdLogout, MdOutlineDashboard } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";
import Link from "next/link";
import { useTransition } from "react";
import { logout } from "@/lib/auth/logout";
import { useContextNavigation } from "@/context/NavigationContext";
import { LuX } from "react-icons/lu";
import { IoIosChatboxes } from "react-icons/io";

const navItems: NavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: <MdOutlineDashboard size={20} />,
  },
  {
    id: "agents",
    href: "/dashboard/agents",
    label: "Mis Agentes",
    icon: <FaRobot size={20} />,
  },
  {
    id: "test-agents",
    href: "/dashboard/test-agents",
    label: "Chat de Prueba",
    icon: <IoIosChatboxes size={20} />,
  },
  {
    id: "profile",
    href: "/dashboard/profile",
    label: "Mi Perfil",
    icon: <FaUser size={20} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useContextNavigation();

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggle}
      />
      <aside
        className={`w-64 h-screen bg-white border-r dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <FaUser size={32} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>
          <button
            onClick={toggle}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <LuX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              onClick={toggle}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => startTransition(() => logout())}
            disabled={isPending}
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <FaSpinner size={20} className="block animate-spin w-5 h-5" />
            ) : (
              <MdLogout size={20} />
            )}
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
