import { getTeams } from "@/actions/team.actions";
import { Team } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export const TeamStickers = async () => {
  const teams = await getTeams();

  return (
    <div className="w-full inline-flex flex-nowrap max-w-6xl mx-auto overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] mt-8">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {teams.map((team, index) => (
          <StickerItem key={team.id} team={team} index={index} />
        ))}
      </ul>
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        {teams.map((team, index) => (
          <StickerItem key={team.id} team={team} index={index} />
        ))}
      </ul>
    </div>
  );
};

const StickerItem = ({ team, index }: { team: Team; index: number }) => (
  <li className="flex flex-col items-center justify-center">
    <div className="flex items-center gap-1">
      <Image
        src={`/${team.shortName}outline.png`}
        alt="team"
        width={30}
        height={30}
      />

      <span className="text-sm">({team.points})</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">
        ({team.nrr.toFixed(3)})
      </span>
      {index > 3 ? (
        <ChevronDown className="size-4 text-destructive" />
      ) : (
        <ChevronUp className="size-4 text-success" />
      )}
    </div>
  </li>
);
