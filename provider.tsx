"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ReactQueryProvider } from "./lib/react-query-provider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>
  );
};

export default AppProvider;
