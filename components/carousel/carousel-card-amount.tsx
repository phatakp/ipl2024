import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CarouselItemDataType } from "@/types";
import { PredictionStatus } from "@prisma/client";
import { IndianRupeeIcon } from "lucide-react";

type CarouselCardAmountProps = {
  header: boolean;
  type: CarouselItemDataType;
  amount: number;
  team: string | undefined;
  isDouble?: boolean;
  result?: PredictionStatus;
};

export const CarouselCardAmount = ({
  header,
  type,
  amount,
  team,
  result,
  isDouble,
}: CarouselCardAmountProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-end gap-1 font-semibold text-lg font-over text-right",
        amount < 0 && (team !== "PBKS" || !header)
          ? "text-destructive"
          : amount < 0 && header
          ? "text-orange-500"
          : ["pred", "matchpred", "result"].includes(type) &&
            result === PredictionStatus.NORESULT
          ? "text-muted-foreground"
          : header
          ? `text-${team}-foreground `
          : "text-success",
        header &&
          `font-extrabold text-5xl md:text-6xl text-left justify-start w-full`
      )}
    >
      <IndianRupeeIcon
        className={cn("text-muted-foreground", !header && "size-4 ")}
      />

      <span>{amount.toFixed(1)}</span>

      {["pred", "matchpred", "result"].includes(type) && (
        <span className={cn("text-xs uppercase invert-[50%]")}>
          ({result?.charAt(0)})
        </span>
      )}
      {header && isDouble && (
        <Badge variant="success" className="absolute right-4 top-4 text-lg">
          Double
        </Badge>
      )}
    </div>
  );
};
