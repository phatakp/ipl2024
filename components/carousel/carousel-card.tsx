"use client";

import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CarouselItemDataType, PredictionAPIResult } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { TableCardLoading } from "../loaders/table-card-loading";
import { Card, CardContent, CardFooter } from "../ui/card";
import { CarouselCardData } from "./carousel-card-data";
import { CarouselCardHeader } from "./carousel-card-header";
import { Pagination } from "./pagination";

type CarouselCardProps = {
  type: CarouselItemDataType;
  data: unknown[];
};

const PAGE_SIZE = siteConfig.pageSize;
let MIN_SIZE = 9;

export const CarouselCard = ({ type, data }: CarouselCardProps) => {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();

  if (status === "loading") return <TableCardLoading />;

  let totalPages = 1;
  let topData;
  let pageData = [] as unknown[];

  if (data.length > 0) {
    totalPages = Math.ceil(data.length / PAGE_SIZE);
    pageData = data.slice(
      (page - 1) * PAGE_SIZE,
      (page - 1) * PAGE_SIZE + PAGE_SIZE
    );
    topData = data[0];
    if (type === "pred")
      pageData = (pageData as PredictionAPIResult[]).filter((d) => !!d.matchId);
    else
      pageData = pageData.filter((d, i) => (page === 1 && i > 0) || page > 1);
  }

  return (
    <Card className={cn("p-0 rounded-xl w-[370px] md:w-[450px] mx-4")}>
      <CarouselCardHeader session={session} type={type} data={topData} />

      <CardContent
        className={cn("w-full flex flex-col divide-y divide-input p-0")}
      >
        {pageData.map((pageItem, i) => {
          return (
            <CarouselCardData
              key={i}
              type={type}
              data={pageItem}
              index={i}
              rank={
                page === 1
                  ? `${(page - 1) * PAGE_SIZE + i + 2}`
                  : `${(page - 1) * PAGE_SIZE + i + 1}`
              }
              session={session}
            />
          );
        })}

        {pageData.length < 1 && (
          <CarouselCardData
            type={type}
            data={undefined}
            index={pageData.length}
            rank={`${
              pageData.length === 0 ? pageData.length + 2 : pageData.length + 1
            }`}
            session={session}
          />
        )}
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="flex justify-center items-center mt-4">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            total={data.length}
          />
        </CardFooter>
      )}
    </Card>
  );
};
