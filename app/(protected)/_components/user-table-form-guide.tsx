"use client";

import { useUserFormGuide } from "@/hooks/user-form-guide";
import { cn } from "@/lib/utils";
import { PredictionStatus } from "@prisma/client";
import { Loader2Icon } from "lucide-react";

export const UserTableFormGuide = ({ userId }: { userId: string }) => {
  const { data: last5, isLoading } = useUserFormGuide(userId);

  if (isLoading) return <Loader2Icon className="w-4 h-4 animate-spin" />;

  return (
    <div className="flex items-center justify-around gap-1 flex-nowrap shrink-0 mt-2">
      {last5?.map((item) => (
        <span
          key={item.id}
          className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center text-xs",
            item.status === PredictionStatus.WON
              ? "bg-green-600 text-white"
              : item.status === PredictionStatus.LOST
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {item.status === PredictionStatus.WON
            ? "W"
            : item.status === PredictionStatus.LOST
            ? "L"
            : "-"}
        </span>
      ))}
      {!!last5 &&
        last5.length < 5 &&
        Array.from(Array(5 - last5.length).keys()).map((i) => (
          <span
            key={i}
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center text-xs bg-muted text-muted-foreground"
            )}
          >
            -
          </span>
        ))}
    </div>
  );
};