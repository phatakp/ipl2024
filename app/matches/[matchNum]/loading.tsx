import { StatsLoading } from "@/components/loaders/stats-loading";
import { Skeleton } from "@/components/ui/skeleton";

const MatchDetailLoading = () => {
  return (
    <>
      <div className="w-screen h-60 p-4">
        <div className="w-full max-w-6xl p-4 mx-auto flex flex-col items-center justify-center space-y-8">
          <Skeleton className="w-20 h-10" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-center gap-8">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="size-16 rounded-full" />
            </div>
            <span className=" text-2xl sr-only font-over basis-1/4 text-center">
              VS
            </span>
            <div className="flex items-center justify-center gap-8">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <Skeleton className="w-full h-6 rounded-md" />
          <Skeleton className="w-20 h-10" />
        </div>
      </div>
      <div className="mt-24 w-full max-w-6xl mx-auto">
        <StatsLoading />
      </div>
    </>
  );
};

export default MatchDetailLoading;
