"use client";

import { Loader } from "@/components/loader";
import { useUserFormGuide } from "@/hooks/user-form-guide";
import { cn } from "@/lib/utils";
import { PredictionStatus } from "@prisma/client";

export const UserTableFormGuide = ({ userId }: { userId: string }) => {
  const { data: last5, isLoading } = useUserFormGuide(userId);

  if (isLoading) return <Loader />;

  return (
    <div className="flex items-center gap-1 flex-nowrap shrink-0 mt-2">
      {last5?.map((item) => (
        <span
          key={item.id}
          className={cn(
            "h-4 w-4 rounded-full flex items-center justify-center text-[9px]",
            item.status === PredictionStatus.WON
              ? "bg-green-600 text-white"
              : item.status === PredictionStatus.LOST
              ? "bg-destructive text-destructive-foreground"
              : "bg-input text-muted-foreground text-[10px]"
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
              "h-4 w-4 rounded-full flex items-center justify-center text-xs bg-muted text-muted-foreground"
            )}
          >
            -
          </span>
        ))}
    </div>
  );
};
