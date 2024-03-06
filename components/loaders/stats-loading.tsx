import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const StatsLoading = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-16">
      {Array.from(Array(3).keys()).map((a) => (
        <div
          key={a}
          className="flex flex-col justify-center items-center gap-4 w-full"
        >
          <Skeleton className="w-32 h-10" />
          <Card className="w-full">
            <CardHeader className="w-full grid grid-cols-5 border-b py-2">
              <div
                className={
                  "w-full flex items-center justify-end gap-4 col-span-2"
                }
              >
                <Skeleton className="w-10 h-6" />
                <Skeleton className="size-16 rounded-full" />
              </div>
              <div />
              <div
                className={
                  "w-full flex items-center justify-end gap-4 col-span-2"
                }
              >
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="w-10 h-6" />
              </div>
            </CardHeader>
            <CardContent className="w-full grid grid-cols-5 gap-4 items-center py-4">
              <div className="col-span-2 grid md:gap-4 gap-2">
                {Array.from(Array(3).keys()).map((i) => (
                  <div
                    key={i}
                    className={
                      "grid grid-cols-5 md:grid-cols-12 gap-2 items-center w-full"
                    }
                  >
                    <Skeleton
                      className={
                        "md:col-span-8 col-span-3 rounded-none w-full h-6"
                      }
                    />
                    <Skeleton
                      className={
                        "text-sm md:col-span-2 hidden md:block w-full h-6"
                      }
                    />
                    <Skeleton
                      className={
                        "text-xs md:text-sm col-span-2 shrink-0 w-full h-6"
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="size-14" />
              </div>

              <div className="col-span-2 grid md:gap-4 gap-2">
                {Array.from(Array(3).keys()).map((i) => (
                  <div
                    key={i}
                    className={
                      "grid grid-cols-5 md:grid-cols-12 gap-2 items-center w-full"
                    }
                  >
                    <Skeleton
                      className={
                        "text-xs md:text-sm col-span-2 shrink-0 w-full h-6"
                      }
                    />
                    <Skeleton
                      className={
                        "text-sm md:col-span-2 hidden md:block w-full h-6"
                      }
                    />
                    <Skeleton
                      className={
                        "md:col-span-8 col-span-3 rounded-none w-full h-6"
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
