import { cn } from "@/lib/utils";
import { CarouselItemDataType } from "@/types";
import { PredictionStatus } from "@prisma/client";
import { IndianRupeeIcon } from "lucide-react";
import { Badge } from "../ui/badge";

type CarouselCardAmountProps = {
  header: boolean;
  type: CarouselItemDataType;
  amount: number;
  team: string | undefined;
  nrr?: number;
  isDouble?: boolean;
  result?: PredictionStatus;
};

export const CarouselCardAmount = ({
  header,
  type,
  amount,
  team,
  nrr,
  result,
  isDouble,
}: CarouselCardAmountProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-end gap-1 font-semibold text-lg font-over relative text-right",
        type !== "team" && amount < 0
          ? "text-destructive"
          : ["pred", "matchpred", "result"].includes(type) &&
            result === PredictionStatus.NORESULT
          ? "text-muted-foreground"
          : type !== "team"
          ? "text-success"
          : header
          ? `text-${team}-foreground`
          : "text-primary",
        header && `font-extrabold text-6xl text-left justify-start`
      )}
    >
      {type !== "team" && (
        <IndianRupeeIcon
          className={cn("text-muted-foreground", !header && "size-4 ")}
        />
      )}
      <span className={cn(type === "team" && "w-[30px]")}>
        {amount.toFixed(type === "team" ? 0 : 1)}
      </span>

      {type === "team" && (
        <span
          className={cn(
            "text-xs w-[40px]",
            !nrr || nrr === 0 || header
              ? "invert-[50%] text-sm"
              : nrr < 0
              ? "text-destructive"
              : "text-success"
          )}
        >
          (
          {!nrr || nrr === 0
            ? "0.000"
            : nrr < 0
            ? (nrr * -1).toFixed(3)
            : nrr.toFixed(3)}
          )
        </span>
      )}
      {["pred", "matchpred", "result"].includes(type) && (
        <span className={cn("text-xs uppercase invert-[50%]")}>
          ({result?.charAt(0)})
        </span>
      )}
      {header && isDouble && (
        <Badge
          variant="success"
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          Double
        </Badge>
      )}
    </div>
  );
};
