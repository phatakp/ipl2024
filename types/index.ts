import {
  Match,
  MatchHistory,
  Prediction,
  Team,
  User,
  UserProfile,
} from "@prisma/client";

// General Types
export type ActionResp = { success: boolean; data: any };

// Team Types
export type TeamShortInfo = Pick<Team, "id" | "shortName" | "longName">;

// User Types
export type ProfileInfo = Pick<
  UserProfile,
  "userId" | "firstName" | "lastName" | "teamId" | "isPaid"
>;
export type UserAPIResult = User & {
  profile: (ProfileInfo & { team: TeamShortInfo | null }) | null;
};

// Match Types
export type MatchInput = Omit<Match, "id">;
export type MatchTeamDetails = {
  team1: TeamShortInfo | null;
  team2: TeamShortInfo | null;
  winner: TeamShortInfo | null;
};
export type MatchAPIResult = Match & MatchTeamDetails;

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
    | "doublePlayed"
  > | null;
};

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
