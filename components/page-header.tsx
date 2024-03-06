import { getMatchResults } from "@/actions/match.actions";
import { TeamStickers } from "@/app/(00home)/_components/team-stickers";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { TextGenerateEffect } from "./ui/text-generate-effect";

export const PageHeader = async ({
  title,
  desc,
  component,
}: {
  title: string;
  desc: ReactNode;
  component?: ReactNode;
}) => {
  const matches = await getMatchResults();
  return (
    <div className="min-h-48 w-full rounded-md bg-backround/90 relative flex flex-col antialiased max-w-6xl mx-auto">
      <div className="max-w-2xl p-4 mx-auto">
        <TextGenerateEffect
          words={title}
          className={cn(
            "relative z-10 text-5xl md:text-7xl font-sans font-bold text-center"
          )}
        />
        <p></p>

        <div className="text-muted-foreground max-w-lg my-2 text-sm text-center relative z-10 flex items-center justify-center gap-4">
          {desc}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {component}
          </div>
        </div>
        {title === "Dashboard" && (
          <div className="text-sm text-center px-4 text-muted-foreground">
            {matches.length > 0 &&
              `Updated after completion of Match ${matches[0].num} - ${
                matches[0].team1?.shortName ?? "TBC"
              } vs ${matches[0].team2?.shortName ?? "TBC"}`}
          </div>
        )}
      </div>
      {title === "Dashboard" && <TeamStickers />}
      <BackgroundBeams />
    </div>
  );
};
