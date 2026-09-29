"use client";

import FormRecoveryAcount from "@/components/recoveryAccount/FormRecoveryAccount";
import FormRecoveryVerifiedEmail from "@/components/recoveryAccount/FormRecoveryVerifiedEmail";
import { useState } from "react";

type ViewRecoveryAccount = "email" | "recovery";

export default function RecoveryAccountPage() {
  const [view, setView] = useState<ViewRecoveryAccount>("email");
  const [token, setToken] = useState<string | null>(null);
  const changeView = (mode: ViewRecoveryAccount) => {
    setView(mode);
  };
  const addToken = (token: string) => {
    setToken(token);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      {view === "email" && (
        <FormRecoveryVerifiedEmail
          onSetToken={addToken}
          onChangeView={changeView}
        />
      )}
      {view === "recovery" && <FormRecoveryAcount token={token} />}
    </div>
  );
}
