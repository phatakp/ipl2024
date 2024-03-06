"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { MatchType } from "@prisma/client";
import { Dot } from "lucide-react";
import { useMatchContext } from "../../_context/match-context";

export const MatchCardTopLine = () => {
  const { match } = useMatchContext();
  return (
    <CardHeader className="p-2 rounded-none">
      <CardTitle className="text-sm flex items-center text-muted-foreground">
        <span className="shrink-0 font-over uppercase">
          {match.type === MatchType.LEAGUE ? `Match ${match.num}` : match.type}
        </span>
        <Dot className="size-8 text-muted-foreground" />
        <span className="truncate font-over text-xs">{match.venue}</span>
      </CardTitle>
    </CardHeader>
  );
};
