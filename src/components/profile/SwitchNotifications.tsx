"use client";

import { useState } from "react";
import { set } from "react-hook-form";

export default function SwitchNotifications() {
  const [statusNotification, setStatusNotification] = useState<boolean>(true);
  return (
    <button
      onClick={() => {}}
      className={`flex items-center p-1 rounded-full relative w-14 h-8 transition-colors border border-slate-200 dark:border-slate-700 ${
        statusNotification ? "bg-indigo-600" : "bg-transparent"
      } `}
    >
      <div
        className={`absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          statusNotification ? "translate-x-6" : "translate-x-0"
        }`}
      >
        <span
          className={`w-6 h-6 rounded-2xl ${
            statusNotification ? "bg-white" : "bg-slate-400"
          }`}
        ></span>
      </div>
    </button>
  );
}
