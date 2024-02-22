import { cn } from "@/lib/utils";
import { IndianRupeeIcon } from "lucide-react";

type TeamAmountProps = {
  type: "team";
  team: string | undefined;
  nrr: number;
};
type OtherAmountProps = {
  type: "user" | "pred" | "matchpred" | "result";
};

type CarouselCardAmountProps = {
  header: boolean;
  balance: number;
} & (TeamAmountProps | OtherAmountProps);

const classNames =
  "RCB-text GT-text CSK-text MI-text SRH-text LSG-text PBKS-text RR-text DC-text KKR-text";

export const CarouselCardAmount = (props: CarouselCardAmountProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center font-semibold text-lg text-right font-over",
        props.type !== "team" && props.balance < 0
          ? "text-destructive"
          : props.type !== "team"
          ? "text-green-600"
          : props.header
          ? `${props.team}-text`
          : "text-darkblue",
        props.header && `font-bold text-6xl`
      )}
    >
      {props.type !== "team" && (
        <IndianRupeeIcon
          className={cn("text-muted-foreground", !props.header && "size-4 ")}
        />
      )}
      {props.balance.toFixed(props.type === "team" ? 0 : 1)}
      {props.type === "team" && (
        <div
          className={cn(
            "inline-flex items-center text-muted-foreground text-xs ml-2",
            props.nrr < 0 ? "text-destructive" : "text-green-600"
          )}
        >
          ({props.nrr.toFixed(3)})
        </div>
      )}
    </div>
  );
};
