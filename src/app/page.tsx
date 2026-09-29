"use client";

import FormLogin from "@/components/auth/FormLogin";
import FormRegister from "@/components/auth/FormRegister";
import { View } from "@/types/view";
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState<View>("login");

  const changeView = (mode: View) => {
    setView(mode);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      {view === "login" && <FormLogin onChangeView={changeView} />}
      {view === "register" && <FormRegister onChangeView={changeView} />}
    </div>
  );
}
