"use client";

import { PrimaryChildrenProp } from "@/types/types";
import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children }: PrimaryChildrenProp) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
