import { StatsRow } from "./stats-row";

type StatsRowGroupProps = {
  allWins: number;
  allWinPct: number;
  homeWins: number;
  homeWinPct: number;
  awayWins: number;
  awayWinPct: number;
  dir?: "left" | "right";
};

export const StatsRowGroup = ({
  allWins,
  allWinPct,
  homeWins,
  homeWinPct,
  awayWins,
  awayWinPct,
  dir = "left",
}: StatsRowGroupProps) => {
  return (
    <div className="col-span-2 grid md:gap-4 gap-2">
      <StatsRow label="All" wins={allWins} winPct={allWinPct} dir={dir} />
      <StatsRow label="Home" wins={homeWins} winPct={homeWinPct} dir={dir} />
      <StatsRow label="Away" wins={awayWins} winPct={awayWinPct} dir={dir} />
    </div>
  );
};
