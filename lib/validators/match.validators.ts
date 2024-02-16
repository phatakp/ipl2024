import { prisma } from "@/lib/db";
import { MatchStatus } from "@prisma/client";

export function isValidStatus(
  winnerId: string | undefined,
  status: MatchStatus
) {
  if (!!winnerId && winnerId > "" && status !== MatchStatus.COMPLETED)
    return false;
  return true;
}

export function isValidWinner(
  winnerId: string | undefined,
  status: MatchStatus
) {
  if (status === MatchStatus.COMPLETED && !winnerId) return false;
  return true;
}

export function isValidBatFirst(
  batFirstId: string | undefined,
  status: MatchStatus
) {
  if (status !== MatchStatus.ABANDONED && !batFirstId) return false;
  return true;
}

export function isValidScore(score: string, status: MatchStatus) {
  if (status === MatchStatus.ABANDONED) return true;
  const [runs, wickets] = score.split("/");
  return (
    parseInt(runs) >= 0 && parseInt(wickets) >= 0 && parseInt(wickets) <= 10
  );
}

export function isValidOvers(overs: string, status: MatchStatus) {
  if (status === MatchStatus.ABANDONED) return true;
  if (overs.includes(".")) {
    const [num, den] = overs.split(".");
    return (
      parseInt(num) >= 0 &&
      parseInt(num) <= 20 &&
      parseInt(den) >= 0 &&
      parseInt(den) <= 5
    );
  }
  return parseFloat(overs) > 0 && parseFloat(overs) <= 20;
}

export function isValidT1Score(score: string, status: MatchStatus) {
  if (status === MatchStatus.COMPLETED && score === "0/0") return false;
  return isValidScore(score, status);
}

export function isValidT2Score(score: string, status: MatchStatus) {
  if (status === MatchStatus.COMPLETED && score === "0/0") return false;
  return isValidScore(score, status);
}

export function isValidT1Overs(overs: string, status: MatchStatus) {
  if (status === MatchStatus.COMPLETED && overs === "0.0") return false;
  return isValidOvers(overs, status);
}

export function isValidT2Overs(overs: string, status: MatchStatus) {
  if (status === MatchStatus.COMPLETED && overs === "0.0") return false;
  return isValidOvers(overs, status);
}

export async function isDefaulterPresent(matchId: string) {
  const preds = await prisma.prediction.aggregate({
    _count: true,
    where: { matchId },
  });
  const users = await prisma.user.aggregate({
    _count: true,
  });
  return users._count > preds._count;
}
