import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StatsType } from "@/types";
import { IndianRupeeIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const classNames =
  "text-CSK-secondary shadow-CSK-secondary text-MI-secondary shadow-MI-secondary text-GT-secondary shadow-GT-secondary text-RR-secondary shadow-RR-secondary text-RCB-secondary shadow-RCB-secondary text-SRH-secondary shadow-SRH-secondary text-PBKS-secondary shadow-PBKS-secondary text-KKR-secondary shadow-KKR-secondary text-DC-secondary shadow-DC-secondary text-LSG-secondary shadow-LSG-secondary";

export const StatsCard = ({ title, amount, icon }: StatsType) => {
  const { data: session, status } = useSession();
  if (status === "loading") return <Skeleton className="h-36 w-60" />;

  const teamName = session?.user.profile.team?.shortName;

  return (
    <Card
      className={`w-[240px] h-[145px] shadow-lg shadow-${teamName}-secondary mx-4 shrink-0`}
    >
      <CardHeader className="space-y-0">
        <CardTitle
          className={`flex flex-row items-center justify-between text-sm font-semibold font-over `}
        >
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="">
        <div className="text-4xl font-bold inline-flex items-center text-muted-foreground">
          {!title.includes("Prediction") && (
            <IndianRupeeIcon className="size-5" />
          )}
          <span
            className={cn(
              amount < 0 || (title.includes("Prediction") && amount < 50)
                ? "text-destructive"
                : "text-success"
            )}
          >
            {!!amount && amount < 0
              ? (amount * -1)?.toFixed(1)
              : amount?.toFixed(1)}
            {title.includes("Prediction") && "%"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
