"use client";

import { useTeamFormGuide } from "@/hooks/team-form-guide";
import { cn } from "@/lib/utils";
import { MatchStatus } from "@prisma/client";
import { Loader2Icon } from "lucide-react";

export const TeamFormGuide = ({ teamId }: { teamId: string }) => {
  const { data: last10, isLoading } = useTeamFormGuide(teamId);

  if (isLoading) return <Loader2Icon className="w-4 h-4 animate-spin" />;

  return (
    <div className="flex items-center gap-1 flex-nowrap shrink-0 mt-2">
      {last10?.map((item) => (
        <span
          key={item.id}
          className={cn(
            "h-4 w-4 rounded-full flex items-center justify-center text-[9px]",
            item.winnerId === teamId
              ? "bg-green-600 text-white"
              : !!item.winnerId
              ? "bg-destructive text-destructive-foreground"
              : "bg-input text-muted-foreground text-[10px]"
          )}
        >
          {item.winnerId === teamId
            ? "W"
            : !!item.winnerId
            ? "L"
            : item.status === MatchStatus.SCHEDULED
            ? "-"
            : "D"}
        </span>
      ))}
      {!!last10 &&
        last10.length < 10 &&
        Array.from(Array(10 - last10.length).keys()).map((i) => (
          <span
            key={i}
            className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center text-xs bg-muted text-muted-foreground"
            )}
          >
            -
          </span>
        ))}
    </div>
  );
};
