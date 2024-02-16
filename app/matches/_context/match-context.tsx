"use client";
import { MatchAPIResult, PredictionAPIResult } from "@/types";
import { Session } from "next-auth";
import { createContext, useContext } from "react";

type MatchContextProps = {
  match: MatchAPIResult;
  prediction: PredictionAPIResult | null;
  session: Session | null;
};

export const MatchContext = createContext<MatchContextProps | null>(null);

export const useMatchContext = () => {
  const context = useContext(MatchContext);
  if (!context)
    throw new Error("Match.* components should be used inside MatchContext");
  return context;
};
