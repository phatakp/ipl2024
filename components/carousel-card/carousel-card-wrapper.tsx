"use client";

import { PaidForm } from "@/app/(protected)/_components/forms/is-paid-form";
import { CarouselCardAmount } from "@/components/carousel-card/carousel-card-amount";
import { CarouselCardDesc } from "@/components/carousel-card/carousel-card-desc";
import { CarouselCardTeamLogo } from "@/components/carousel-card/carousel-card-team-logo";
import { Pagination } from "@/components/carousel-card/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { Team, UserRole } from "@prisma/client";
import { ShieldHalfIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type UserTypeProps = {
  type: "user";
  data: UserAPIResult[];
};

type PredTypeProps = {
  type: "pred";
  data: PredictionAPIResult[];
};

type MatchPredTypeProps = {
  type: "matchpred";
  data: PredictionAPIResult[];
};

type PredResultTypeProps = {
  type: "result";
  data: PredictionResultAPIType[];
};

type TeamTypeProps = {
  type: "team";
  data: Team[];
};

type CarouselCardWrapperProps = {
  type: "pred" | "user" | "result" | "matchpred" | "team";
  title: string;
} & (
  | UserTypeProps
  | PredTypeProps
  | PredResultTypeProps
  | MatchPredTypeProps
  | TeamTypeProps
);

const PAGE_SIZE = siteConfig.pageSize;

export const CarouselCardWrapper = (props: CarouselCardWrapperProps) => {
  const { data: session, status } = useSession();
  const [page, setPage] = useState(1);
  if (!props.data) return null;

  const totalPages = !!props.data
    ? Math.ceil(props.data?.length / PAGE_SIZE)
    : 1;

  const pageData = props.data.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const top = props.data[0] as (typeof props.data)[0];

  let teamShortName: string | undefined = "";
  let balance: number = 0;
  let nrr = 0;

  switch (props.type) {
    case "user":
      teamShortName = (top as UserAPIResult)?.profile?.team?.shortName;
      balance = (top as UserAPIResult)?.balance;
      break;
    case "result":
      teamShortName = (top as PredictionResultAPIType)?.team?.shortName;
      balance = (top as PredictionResultAPIType)?.result;
      break;
    case "matchpred":
      teamShortName = (top as PredictionAPIResult)?.team?.shortName;
      balance = (top as PredictionAPIResult)?.result;
      break;
    case "pred":
      teamShortName = (top as PredictionAPIResult)?.team?.shortName;
      balance = (top as PredictionAPIResult)?.result;
      break;
    case "team":
      teamShortName = (top as Team).shortName;
      balance = (top as Team).points;
      nrr = (top as Team).nrr;
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
      <div className="text-darkblue font-over text-xl font-bold">
        {props.title}
      </div>

      <Card
        className={cn(
          "w-full p-0 rounded-xl min-w-80",
          props.type === "matchpred" ? "max-w-xl" : "max-w-md"
        )}
      >
        <CardHeader
          className={cn(
            `flex flex-row items-center justify-between border-b ${teamShortName} p-0 rounded-t-xl`
          )}
        >
          <div className="flex flex-col justify-between gap-4 p-4 h-full">
            <div className="font-semibold inline-flex items-center gap-2">
              <ShieldHalfIcon className="size-4" />
              <span className="text-xl font-semibold">1</span>
            </div>
            <CarouselCardDesc
              header={true}
              type={props.type as any}
              data={top as any}
            />
            <CarouselCardAmount
              type={props.type}
              header={true}
              balance={balance}
              nrr={nrr}
              team={teamShortName}
            />
          </div>
          <CarouselCardTeamLogo header={true} team={teamShortName} />
        </CardHeader>

        <CardContent className="w-full flex flex-col divide-y px-0">
          {pageData.map((item, i) => {
            if (i == 0 && page === 1) return null;

            let rank = "";
            let team: string | undefined = "";
            let itemBalance = 0;
            let nrrData = 0;

            switch (props.type) {
              case "user":
                rank = `${(page - 1) * PAGE_SIZE + i + 1}`;
                team = (item as UserAPIResult)?.profile?.team?.shortName as any;
                itemBalance = (item as UserAPIResult).balance as number;
                break;
              case "result":
                rank = `${(page - 1) * PAGE_SIZE + i + 1}`;
                team = (item as PredictionResultAPIType)?.team
                  ?.shortName as any;
                itemBalance = (item as PredictionResultAPIType)
                  ?.result as number;
                break;
              case "matchpred":
                rank = `${(page - 1) * PAGE_SIZE + i + 1}`;
                team = (item as PredictionAPIResult)?.team?.shortName;
                itemBalance = (item as PredictionAPIResult)?.result as number;
                break;
              case "pred":
                rank = `#${(item as PredictionAPIResult).match?.num as any}`;
                team = (item as PredictionAPIResult)?.team?.shortName as any;
                itemBalance = (item as PredictionAPIResult)?.result as number;
                break;
              case "team":
                rank = `${(page - 1) * PAGE_SIZE + i + 1}`;
                team = (item as Team).shortName;
                itemBalance = (item as Team).points;
                nrrData = (item as Team).nrr;
                break;
              default:
                break;
            }

            return (
              <div key={item.id} className="flex items-center gap-4 px-4 py-2">
                {props.type === "user" &&
                  session?.user.role === UserRole.ADMIN && (
                    <PaidForm
                      userId={item.id}
                      isPaid={!!(item as UserAPIResult)?.profile?.isPaid as any}
                    />
                  )}
                <span className="w-4">{rank}</span>
                <CarouselCardTeamLogo header={false} team={team} />
                <CarouselCardDesc
                  header={false}
                  type={props.type as any}
                  data={item as any}
                  page={page}
                  index={i}
                />
                <CarouselCardAmount
                  type={props.type}
                  header={false}
                  balance={itemBalance}
                  nrr={nrrData}
                  team={team}
                />
              </div>
            );
          })}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="flex justify-center items-center">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              total={props.data.length}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
