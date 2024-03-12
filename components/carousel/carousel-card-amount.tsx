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
        "inline-flex items-center justify-end gap-1 font-semibold text-lg font-over relative text-right",
        amount < 0
          ? "text-destructive"
          : ["pred", "matchpred", "result"].includes(type) &&
            result === PredictionStatus.NORESULT
          ? "text-muted-foreground"
          : header
          ? `text-${team}-foreground`
          : "text-success",
        header && `font-extrabold text-6xl text-left justify-start`
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
