import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DashboardLoading = () => {
  return (
    <div className="flex flex-col space-y-16 w-full max-w-6xl mx-auto pb-8">
      <div className="mx-auto">
        <div className="w-[370px] sm:w-full max-w-6xl mx-auto">
          <Skeleton className="w-[370px] sm:w-[448px] p-0 rounded-xl" />
          <Skeleton className="w-[370px] sm:w-[448px] p-0 rounded-xl" />
          <Skeleton className="w-[370px] sm:w-[448px] p-0 rounded-xl" />
          <Skeleton className="w-[370px] sm:w-[448px] p-0 rounded-xl" />
        </div>
      </div>

      <div className="w-[370px] sm:w-full max-w-6xl mx-auto text-center">
        <Card className="w-[370px] sm:w-[448px] p-0 rounded-xl">
          <CardHeader
            className={cn(
              `flex flex-row items-center justify-between border-b p-0 rounded-t-xl`
            )}
          >
            <div className="flex flex-col justify-between gap-4 p-4 h-full">
              <Skeleton className="w-4 h-4" />
              <div className="grid font-over gap-0">
                <Skeleton className="w-10 h-6" />
                <Skeleton className="w-10 h-6" />
                <div className="flex items-center justify-center gap-1">
                  <Skeleton className="rounded-full w-5 h-5" />
                </div>
              </div>
              <Skeleton className="h-10 w-12" />
            </div>
            <Skeleton className="w-32 h-32" />
          </CardHeader>

          <CardContent className="w-full flex flex-col divide-y px-0">
            {Array.from(Array(9).keys()).map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12" />

                <div className="flex flex-col flex-1">
                  <Skeleton className="w-10 h-6" />
                  <div className="flex items-center justify-center gap-1">
                    <Skeleton className="rounded-full w-5 h-5" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLoading;
