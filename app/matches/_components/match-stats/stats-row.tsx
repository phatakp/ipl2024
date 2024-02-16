import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StatsRowProps = {
  wins: number;
  winPct: number;
  label: string;
  dir?: "left" | "right";
};

export const StatsRow = ({
  wins,
  winPct,
  label,
  dir = "left",
}: StatsRowProps) => (
  <div
    className={cn("grid grid-cols-5 md:grid-cols-12 gap-2 items-center w-full")}
  >
    <Progress
      value={Math.floor(winPct * 100)}
      className={cn(
        "md:col-span-8 col-span-3 rounded-none",
        dir === "left" ? "rotate-180 order-first" : "order-last"
      )}
    />
    <div className={cn("text-sm md:col-span-2 hidden md:block")}>
      {(winPct * 100).toFixed()}%
    </div>
    <div
      className={cn(
        "text-xs md:text-sm col-span-2 shrink-0",
        dir === "left" ? "order-last text-right" : "order-first text-left"
      )}
    >
      {label}
    </div>
  </div>
);
