import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const MatchCenterButton = ({ matchNum }: { matchNum: number }) => {
  return (
    <div className="col-span-3 md:col-span-2 text-right md:mx-auto">
      <Link
        href={`/matches/${matchNum}`}
        className={cn(
          "text-sm",
          buttonVariants({ variant: "default", size: "sm" })
        )}
      >
        Match Center
      </Link>
    </div>
  );
};
