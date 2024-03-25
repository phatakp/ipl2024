import { cn } from "@/lib/utils";
import {
  CarouselItemDataType,
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { PredictionStatus } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { ReactNode } from "react";
import { FormGuide } from "../form-guide";
import { buttonVariants } from "../ui/button";
import { CarouselCardAmount } from "./carousel-card-amount";
import { CarouselCardDesc } from "./carousel-card-desc";
import { CarouselCardTeamLogo } from "./carousel-card-team-logo";

type CarouselCardDataProps = {
  type: CarouselItemDataType;
  rank: string;
  data: unknown;
  index: number;
  session: Session | null;
};

export const CarouselCardData = ({
  type,
  rank,
  data,
  index,
  session,
}: CarouselCardDataProps) => {
  let teamShortName: string | undefined = undefined;
  let amount = 0;
  let text1 = "Visual Row";
  let node: ReactNode;
  let isDouble = false;
  let result: PredictionStatus = PredictionStatus.PLACED;

  switch (type) {
    case "user":
      node = <FormGuide header={false} type="user" id={""} />;
      if (!!data) {
        teamShortName = (data as UserAPIResult).profile?.team?.shortName;
        amount = (data as UserAPIResult).balance;
        text1 = (data as UserAPIResult).name ?? `User ${rank}`;
        node = (
          <FormGuide
            header={false}
            type="user"
            data={(data as UserAPIResult).predictions}
          />
        );
      }
      break;
    case "result":
      node = "### vs ###";
      if (!!data) {
        teamShortName = (data as PredictionResultAPIType).team?.shortName;
        amount = (data as PredictionResultAPIType).result;
        result = (data as PredictionResultAPIType).status;
        text1 = (data as PredictionResultAPIType).user.name ?? `User ${rank}`;
        isDouble = (data as PredictionResultAPIType).isDouble;
        node = (
          <Link
            href={`/matches/${(data as PredictionResultAPIType).match?.num}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-4 text-muted-foreground text-sm text-left w-fit px-0"
            )}
          >
            {(data as PredictionResultAPIType).match?.team1?.shortName ?? "TBC"}{" "}
            vs{" "}
            {(data as PredictionResultAPIType).match?.team2?.shortName ?? "TBC"}
          </Link>
        );
      }
      break;
    case "matchpred":
      node = "###: ##";
      if (!!data) {
        teamShortName = (data as PredictionAPIResult).team?.shortName;
        amount = (data as PredictionAPIResult).result;
        text1 = (data as PredictionAPIResult).user.name ?? `User ${rank}`;
        node = `Stake : ${(data as PredictionAPIResult).amount.toFixed()}`;
        isDouble = (data as PredictionAPIResult).isDouble;
        result = (data as PredictionAPIResult).status;
      }
      break;
    case "pred":
      node = "###: ##";
      if (!!data) {
        teamShortName = (data as PredictionAPIResult).team?.shortName;
        amount = (data as PredictionAPIResult).result;
        result = (data as PredictionAPIResult).status;
        isDouble = (data as PredictionAPIResult).isDouble;
        text1 = `${
          (data as PredictionAPIResult).match?.team1?.shortName ?? "TBC"
        } vs ${(data as PredictionAPIResult).match?.team2?.shortName ?? "TBC"}`;
        node = `Stake : ${(data as PredictionAPIResult).amount.toFixed()}`;
      }
      break;
    default:
      break;
  }

  return (
    <div
      key={index}
      className={cn("flex items-center justify-between gap-4 md:px-4 p-2")}
    >
      {/* {!!data && type === "user" && session?.user.role === UserRole.ADMIN && (
        <PaidForm
          userId={(data as UserAPIResult).id}
          isPaid={!!(data as UserAPIResult).profile?.isPaid}
        />
      )} */}
      <span className="w-4">
        {type === "pred" && !!data
          ? `#${(data as PredictionAPIResult).match?.num}`
          : rank}
      </span>
      <CarouselCardTeamLogo header={false} team={teamShortName} />
      <CarouselCardDesc
        header={false}
        type={type}
        text1={text1}
        text2=""
        node={node}
        isDouble={isDouble}
      />
      <CarouselCardAmount
        type={type}
        header={false}
        amount={amount}
        team={teamShortName}
        result={result}
      />
    </div>
  );
};
