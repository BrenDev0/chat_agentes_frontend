"use client";

import { useTheme } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full relative w-14 h-8 transition-colors border border-slate-200 dark:border-slate-700"
    >
      <div
        className={`absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          theme == "dark"
            ? "translate-x-6 bg-indigo-600"
            : "translate-x-0 bg-white shadow-sm"
        }`}
      >
        {theme == "dark" ? (
          <FaMoon size={16} className="text-white" />
        ) : (
          <FaSun size={16} className="text-amber-500" />
        )}
      </div>
    </button>
  );
}
