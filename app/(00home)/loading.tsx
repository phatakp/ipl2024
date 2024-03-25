import TableLoading from "@/components/loaders/table-loading";
import { Skeleton } from "@/components/ui/skeleton";

const HomeLoading = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-0 space-y-8">
      <div className="w-full inline-flex flex-nowrap max-w-7xl mx-auto">
        <Skeleton className="relative size-16 sm:size-18 md:size-20 aspect-square" />
        <Skeleton className="relative size-16 sm:size-18 md:size-20 aspect-square" />
        <Skeleton className="relative size-16 sm:size-18 md:size-20 aspect-square" />
        <Skeleton className="relative size-16 sm:size-18 md:size-20 aspect-square" />
        <Skeleton className="relative size-16 sm:size-18 md:size-20 aspect-square" />
      </div>

      <TableLoading />
    </section>
  );
};

export default HomeLoading;
