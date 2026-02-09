"use client";

import { PrimaryChildrenProp } from "@/types/types";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface IAppContext {
  status: "loading" | "authenticated" | "unauthenticated";
  userData: Session["user"] | null;
  updateSession: (val: Session["user"]) => void;
  resetAt: Date | null;
  setResetAt: (val: Date | null) => void;
}

const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider = ({ children }: PrimaryChildrenProp) => {
  const { data, status, update: updateSession } = useSession();
  const userData = data?.user ?? null;
  const [resetAt, setResetAt] = useState<Date | null>(null);

  useEffect(() => {
    const result = localStorage.getItem("resetAt");

    if (!result) {
      setResetAt(null);
      return;
    }

    const parsed = JSON.parse(result);

    setResetAt(parsed);
  }, []);

  return (
    <AppContext.Provider
      value={{ userData, status, updateSession, resetAt, setResetAt }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppContextProvider");
  }

  return context;
};

export default useAppContext;
