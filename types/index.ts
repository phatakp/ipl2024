import {
  Match,
  MatchHistory,
  Prediction,
  Team,
  User,
  UserProfile,
} from "@prisma/client";

export type TeamShortInfo = Pick<Team, "id" | "shortName" | "longName">;

export type ProfileInfo = Pick<
  UserProfile,
  "userId" | "firstName" | "lastName" | "teamId" | "isPaid"
>;

export type MatchHistoryInput = Omit<MatchHistory, "id">;
export type MatchInput = Omit<Match, "id">;

export type MatchAPIResult = Match & {
  team1: TeamShortInfo | null;
  team2: TeamShortInfo | null;
  winner: TeamShortInfo | null;
};

export type MatchHistoryAPIResult = MatchHistory & {
  team1: TeamShortInfo | null;
  team2: TeamShortInfo | null;
  winner: TeamShortInfo | null;
};

export type PredictionAPIResult = Prediction & {
  team: TeamShortInfo | null;
  user: { name: string | null };
  match: {
    id: string;
    num: number;
    minStake: number;
    team1: TeamShortInfo | null;
    team2: TeamShortInfo | null;
    winner: TeamShortInfo | null;
  } | null;
};

export type UserAPIResult = User & {
  profile: (ProfileInfo & { team: TeamShortInfo | null }) | null;
};

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
  t2vst1_AwayWins: number;
  t2vst1_AwayWinPct: number;
  t1_AllMatches: number;
  t1_AllWins: number;
  t1_AllWinPct: number;
  t1_HomeMatches: number;
  t1_HomeWins: number;
  t1_HomeWinPct: number;
  t2_AllMatches: number;
  t2_AllWins: number;
  t2_AllWinPct: number;
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
