"use client";

import { FaRegBell } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import Badge from "./Badge";
import { useContextUser } from "@/context/UserContext";
import { User } from "../../types/user";
import UserInfoSkeleton from "./skeletons/UserInfoSkeleton";
import ThemeToggle from "./ThemeTogle";
import { LuAlignJustify } from "react-icons/lu";
import { useContextNavigation } from "@/context/NavigationContext";

export default function TopBar() {
  const { user, loading } = useContextUser();
  const { toggle } = useContextNavigation();

  return (
    <header className="h-20 px-2 lg:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between lg:justify-end">
      <div
        onClick={toggle}
        className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        <LuAlignJustify size={24} />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 rounded-lg transition-colors relative">
          <FaRegBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        {loading ? (
          <UserInfoSkeleton />
        ) : (
          user && (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
              <Badge name={user?.name} />
            </div>
          )
        )}
      </div>
    </header>
  );
}
