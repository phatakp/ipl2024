import { useFormGuide } from "@/hooks/form-guide";
import { cn } from "@/lib/utils";
import {
  Match,
  MatchStatus,
  Prediction,
  PredictionStatus,
} from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

type FormGuideProps = {
  header?: boolean;
  type: "user" | "team";
  id?: string;
  data?: Prediction[];
};

export const FormGuide = ({
  type,
  data,
  id,
  header = false,
}: FormGuideProps) => {
  const { data: last5, isLoading } = useFormGuide(data, id);

  if (isLoading)
    return (
      <div className="flex items-center gap-1 flex-nowrap shrink-0 mt-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
      </div>
    );
  return (
    <div className="flex items-center gap-1 flex-nowrap shrink-0 mt-2">
      {!!last5 &&
        last5.length < 5 &&
        Array.from(Array(5 - last5.length).keys()).map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full flex items-center justify-center text-xs bg-input text-muted-foreground opacity-80",
              header ? "size-8" : "size-4"
            )}
          >
            -
          </span>
        ))}

      {last5?.map((item) => {
        const isWon =
          type === "team"
            ? (item as Match).winnerId === id
            : (item as Prediction).status === PredictionStatus.WON;
        const isLost =
          type === "team"
            ? (item as Match).winnerId !== null
            : (item as Prediction).status === PredictionStatus.LOST;
        return (
          <span
            key={item.id}
            className={cn(
              "rounded-full flex items-center justify-center ",
              header ? "size-8 text-lg" : "size-4 text-[9px]",
              isWon
                ? "bg-success text-success-foreground"
                : isLost
                ? "bg-destructive text-destructive-foreground"
                : "bg-input text-muted-foreground text-[10px] opacity-80"
            )}
          >
            {isWon
              ? "W"
              : isLost
              ? "L"
              : type === "team" &&
                (item as Match).status === MatchStatus.SCHEDULED
              ? "-"
              : "N"}
          </span>
        );
      })}

      {!last5 &&
        Array.from(Array(5).keys()).map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full flex items-center justify-center text-xs bg-input text-muted-foreground opacity-80",
              header ? "size-8" : "size-4"
            )}
          >
            -
          </span>
        ))}
    </div>
  );
};
