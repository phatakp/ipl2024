import { getMatchResults } from "@/actions/match";
import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeNrr(
  forOvers: number,
  forRuns: number,
  againstOvers: number,
  againstRuns: number
) {
  if (
    forOvers === 0 ||
    forRuns === 0 ||
    againstOvers === 0 ||
    againstRuns === 0
  )
    return 0;

  const forDec = (forOvers * 10) % 10;
  const forNum = parseInt(forOvers.toFixed());
  const againstDec = (againstOvers * 10) % 10;
  const againstNum = parseInt(againstOvers.toFixed());
  const nrr =
    (forRuns / (forNum * 6 + forDec) -
      againstRuns / (againstNum * 6 + againstDec)) *
    6;
  return nrr;
}

export function isMatchStarted(matchDate: string) {
  const currDate = DateTime.fromISO(new Date().toISOString()).setZone(
    "Asia/Kolkata"
  );
  return currDate! >= DateTime.fromISO(matchDate).setZone("Asia/Kolkata");
}

export function isPredictionCutoffPassed(matchDate: string) {
  const currDate = DateTime.fromISO(new Date().toISOString()).setZone(
    "Asia/Kolkata"
  );
  const cutoff = DateTime.fromISO(matchDate)
    .minus({ minutes: 30 })
    .setZone("Asia/Kolkata");
  return currDate! >= cutoff;
}

export async function isIPLWinnerUpdatable() {
  const completed = await getMatchResults();
  return completed?.[0]?.num < 35;
}
