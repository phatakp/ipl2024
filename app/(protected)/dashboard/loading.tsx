import { TableCardLoading } from "@/components/loaders/table-card-loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <Skeleton className={"w-screen relative h-48"}>
        <div className="max-w-7xl m-auto flex items-center justify-between p-4 h-full">
          <h1 className="text-3xl sr-only">Dashboard</h1>
        </div>
      </Skeleton>
      <div className="flex flex-col space-y-16 w-full max-w-7xl mx-auto pb-8 mt-8 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-48" />
          <div className="md:col-span-2 flex items-center justify-center gap-8">
            <Skeleton className="w-full h-48" />
            <Skeleton className="w-full h-48" />
          </div>
        </div>

        <TableCardLoading />
      </div>
    </>
  );
}
