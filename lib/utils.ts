import { getMatchResults } from "@/actions/match.actions";
import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomNumberBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isToday(matchDate: string) {
  const currDate = DateTime.fromISO(new Date().toISOString())
    .setZone("Asia/Kolkata")
    .toISODate();

  const mDate = matchDate.slice(0, 10);
  return currDate === mDate;
}

export function isTomorrow(matchDate: string) {
  const tomorrowDate = DateTime.fromISO(new Date().toISOString())
    .plus({ days: 1 })
    .setZone("Asia/Kolkata")
    .toISODate();

  const mDate = matchDate.slice(0, 10);
  return tomorrowDate === mDate;
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

  let forNum = parseInt(forOvers.toFixed());
  let forDec = (forOvers * 10) % 10;
  if (forDec > 5) {
    forNum += 1;
    forDec -= 6;
  }

  let againstNum = parseInt(againstOvers.toFixed());
  let againstDec = (againstOvers * 10) % 10;
  if (againstDec > 5) {
    againstNum += 1;
    againstDec -= 6;
  }

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

export function isDoubleCutoffPassed(matchDate: string) {
  const currDate = DateTime.fromISO(new Date().toISOString()).setZone(
    "Asia/Kolkata"
  );
  const cutoff = DateTime.fromISO(matchDate)
    .plus({ minutes: 30 })
    .setZone("Asia/Kolkata");
  return currDate! >= cutoff;
}

export async function isIPLWinnerUpdatable() {
  const completed = await getMatchResults();
  return completed?.[0]?.num < 35;
}

export function transformOvers(overs: string) {
  const [num, den] = overs.split(".");
  if (parseInt(den) > 5) {
    const numR = parseInt(num) + 1;
    const denR = parseInt(den) - 6;
    return `${numR}.${denR}`;
  }
  return overs;
}

export function getFormattedTime(matchDate: string) {
  return matchDate.slice(11, 16);
}

export function getFormattedDate(matchDate: string) {
  const date = DateTime.fromISO(matchDate);
  return `${date.toFormat("ccc")}, ${date.toFormat("LLL")} ${date.toFormat(
    "dd"
  )}, ${getFormattedTime(matchDate)}`;
}
