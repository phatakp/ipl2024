import {
  Match,
  MatchHistory,
  Prediction,
  Team,
  User,
  UserProfile,
} from "@prisma/client";
import { ReactNode } from "react";

// General Types
export type ActionResp = { success: boolean; data: any };

// Team Types
export type TeamShortInfo = Pick<Team, "id" | "shortName" | "longName">;
export function isTeamType(object: unknown): object is Team {
  if (object !== null && typeof object === "object") return "nrr" in object;
  return false;
}

// User Types
export type ProfileInfo = Pick<
  UserProfile,
  "userId" | "firstName" | "lastName" | "teamId" | "isPaid"
> & { team: TeamShortInfo | null };

export type UserAPIResult = User & {
  profile: ProfileInfo | null;
};

export function isUserType(object: unknown): object is UserAPIResult {
  if (object !== null && typeof object === "object")
    return "doublesLeft" in object;
  return false;
}

// Match Types
export type MatchInput = Omit<Match, "id">;
export type MatchTeamDetails = {
  team1: TeamShortInfo | null;
  team2: TeamShortInfo | null;
  winner: TeamShortInfo | null;
};
export type MatchAPIResult = Match & MatchTeamDetails;

export function isMatchType(object: unknown): object is MatchAPIResult {
  if (object !== null && typeof object === "object")
    return "minStake" in object;
  return false;
}

// Match History Types
export type MatchHistoryInput = Omit<MatchHistory, "id">;
export type MatchHistoryAPIResult = MatchHistory & MatchTeamDetails;

// Prediction Types
export type PredictionAPIResult = Prediction & {
  team: TeamShortInfo | null;
  user: Pick<User, "name" | "doublesLeft">;
  match: Pick<
    MatchAPIResult,
    | "id"
    | "date"
    | "num"
    | "minStake"
    | "team1"
    | "team2"
    | "winner"
    | "isDoublePlayed"
  > | null;
};
export function isPredictionType(
  object: unknown
): object is PredictionResultAPIType {
  if (object !== null && typeof object === "object")
    return "amount" in object && "isDouble" in object;
  return false;
}

export type PredictionResultAPIType = Prediction & {
  team: TeamShortInfo | null;
  user: Pick<UserAPIResult, "name" | "profile">;
  match: Pick<MatchAPIResult, "num" | "team1" | "team2" | "winner"> | null;
};
export function isResultType(
  object: unknown
): object is PredictionResultAPIType {
  if (object !== null && typeof object === "object")
    return "amount" in object && "result" in object;
  return false;
}

// Stats Type
export type StatsResult = {
  t1vst2_AllMatches: number;
  t1vst2_AllWins: number;
  t1vst2_WinPct: number;
  t2vst1_AllWins: number;
  t2vst1_WinPct: number;
  t1vst2_HomeMatches: number;
  t1vst2_AwayMatches: number;
  t1vst2_HomeWins: number;
  t1vst2_HomeWinPct: number;
  t1vst2_AwayWins: number;
  t1vst2_AwayWinPct: number;
  t2vst1_HomeWins: number;
  t2vst1_HomeWinPct: number;
  t2vst1_AwayWins: number;
  t2vst1_AwayWinPct: number;
  t1_AllMatches: number;
  t1_AllWins: number;
  t1_AllWinPct: number;
  t1_HomeMatches: number;
  t1_HomeWins: number;
  t1_HomeWinPct: number;
  t1_AwayMatches: number;
  t1_AwayWins: number;
  t1_AwayWinPct: number;
  t2_AllMatches: number;
  t2_AllWins: number;
  t2_AllWinPct: number;
  t2_HomeMatches: number;
  t2_HomeWins: number;
  t2_HomeWinPct: number;
  t2_AwayMatches: number;
  t2_AwayWins: number;
  t2_AwayWinPct: number;
  t1_WinPct: number;
  t2_WinPct: number;
  pct: number;
  recentBetween: MatchHistoryAPIResult[];
  t1_last5: MatchHistoryAPIResult[];
  t2_last5: MatchHistoryAPIResult[];
};

export type CarouselItemDataType =
  | "pred"
  | "user"
  | "result"
  | "matchpred"
  | "team";

export type StatsType = {
  title: string;
  amount: number;
  icon?: ReactNode;
};

export type CarouselTeamItems = {
  data: Team[];
  title: string;
  type: "team";
};

export type CarouselPredItems = {
  data: PredictionAPIResult[];
  title: string;
  type: "pred";
};

export type CarouselMatchPredItems = {
  data: PredictionAPIResult[];
  title: string;
  type: "matchpred";
};

export type CarouselResultItems = {
  data: PredictionResultAPIType[];
  title: string;
  type: "result";
};

export type CarouselUserItems = {
  data: UserAPIResult[];
  title: string;
  type: "user";
};

export type CarouselItemType = { type: CarouselItemDataType } & (
  | CarouselUserItems
  | CarouselPredItems
  | CarouselTeamItems
  | CarouselResultItems
  | CarouselMatchPredItems
);

export function isCarouselDataType(
  object: unknown
): object is CarouselItemType {
  if (object !== null && typeof object === "object")
    return "type" in object && "data" in object && "title" in object;
  return false;
}

export function isStatsType(object: unknown): object is StatsType {
  if (object !== null && typeof object === "object")
    return "title" in object && "amount" in object;
  return false;
}
