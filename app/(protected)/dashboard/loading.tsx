import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4 w-full max-w-6xl mx-auto py-8 px-4">
      <div className="mx-auto md:col-span-2">
        <div className="w-[320px] sm:w-full max-w-6xl mx-auto">
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full p-4 flex flex-col">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </Skeleton>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full p-4 flex flex-col">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </Skeleton>
      </div>
    </div>
  );
};

export default DashboardLoading;
