"use client";

import { PrimaryChildrenProp } from "@/types/types";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

interface IAppContext {
  status: "loading" | "authenticated" | "unauthenticated";
  userData: Session["user"] | null;
}

const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider = ({ children }: PrimaryChildrenProp) => {
  const { data, status } = useSession();
  const userData = data?.user ?? null;
  return (
    <AppContext.Provider value={{ userData, status }}>
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
