import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const MatchDetailButton = ({ matchNum }: { matchNum: number }) => {
  return (
    <div className="col-span-3 md:col-span-2 text-right md:mx-auto">
      <Link
        href={`/matches/${matchNum}`}
        className={cn(
          buttonVariants({ size: "sm", variant: "destructive" }),
          "text-sm"
        )}
      >
        Match Center
      </Link>
    </div>
  );
};
