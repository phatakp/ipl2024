import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MatchesLoading = () => {
  return (
    <>
      <Skeleton className={"w-screen relative h-48"}>
        <div className="max-w-7xl m-auto flex items-center justify-between p-4 h-full">
          <h1 className="text-3xl sr-only">Matches</h1>
        </div>
      </Skeleton>
      <div className="pt-16 px-4 min-h-screen">
        <div className="flex items-center justify-start gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Card className="w-full p-0 md:p-4 max-w-7xl mx-auto">
          <CardContent className="space-y-8 p-0 md:p-4">
            {Array.from(Array(5).keys()).map((i) => (
              <div
                key={i}
                className="flex flex-col space-y-16 border-b border-input py-8 my-4"
              >
                <Skeleton className="w-full h-10" />
                <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0 items-center">
                  <Skeleton className="col-span-2 w-20 h-10" />
                  <div className="col-span-5 md:col-span-6 flex items-center justify-between w-full">
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
                  <Skeleton className="md:col-span-2 text-right md:mx-auto w-20 h-10 " />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MatchesLoading;
