export const TEAM_SHORT_DETAILS = {
  select: { id: true, shortName: true, longName: true },
};

export const INCLUDE_MATCH_DETAILS = {
  team1: TEAM_SHORT_DETAILS,
  team2: TEAM_SHORT_DETAILS,
  winner: TEAM_SHORT_DETAILS,
};

export const PRED_MATCH_DETAILS = {
  select: {
    id: true,
    num: true,
    date: true,
    team1: TEAM_SHORT_DETAILS,
    team2: TEAM_SHORT_DETAILS,
    winner: TEAM_SHORT_DETAILS,
    minStake: true,
    doublePlayed: true,
  },
};

export const PRED_USER_DETAILS = { select: { name: true, doublesLeft: true } };
