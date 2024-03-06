import Image from "next/image";

export const MatchCarouselTeam = ({
  shortName,
  runs,
  wickets,
}: {
  shortName: string | undefined;
  runs: number;
  wickets: number;
}) => (
  <div className="flex items-center justify-between">
    <div className="inline-flex items-center gap-2">
      <Image
        src={`/${shortName ?? "default"}.png`}
        alt=""
        width={30}
        height={30}
      />
      <span className="text-xs">{shortName ?? "TBC"}</span>
    </div>
    <div className="text-sm">
      {runs}/{wickets}
    </div>
  </div>
);
