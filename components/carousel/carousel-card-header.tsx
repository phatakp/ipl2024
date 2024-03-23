import { cn } from "@/lib/utils";
import {
  CarouselItemDataType,
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { PredictionStatus } from "@prisma/client";
import { ShieldHalfIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { ReactNode } from "react";
import { FormGuide } from "../form-guide";
import { Button, buttonVariants } from "../ui/button";
import { CardHeader } from "../ui/card";
import { CarouselCardAmount } from "./carousel-card-amount";
import { CarouselCardDesc } from "./carousel-card-desc";
import { CarouselCardTeamLogo } from "./carousel-card-team-logo";

type CarouselCardHeaderProps = {
  type: CarouselItemDataType;
  data: unknown;
  session: Session | null;
};

export const CarouselCardHeader = ({
  session,
  type,
  data,
}: CarouselCardHeaderProps) => {
  let teamShortName: string | undefined = undefined;
  let amount = 0;
  let text1 = "#####";
  let text2 = "##";
  let node: ReactNode;
  let isDouble = false;
  let result: PredictionStatus = PredictionStatus.PLACED;

  switch (type) {
    case "user":
      node = <FormGuide header={true} type="user" id={""} />;
      if (!!data) {
        teamShortName = (data as UserAPIResult).profile?.team?.shortName;
        amount = (data as UserAPIResult).balance;
        text1 = (data as UserAPIResult).profile?.firstName ?? "User";
        text2 = (data as UserAPIResult).profile?.lastName ?? "1";
        node = (
          <FormGuide
            header={true}
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
        text1 =
          (data as PredictionResultAPIType).user.profile?.firstName ?? "User";
        text2 = (data as PredictionResultAPIType).user.profile?.lastName ?? "1";
        isDouble = (data as PredictionResultAPIType).isDouble;
        node = (
          <Link
            href={`/matches/${(data as PredictionResultAPIType).match?.num}`}
            className={cn(
              buttonVariants({ variant: "success" }),
              "font-semibold hover:bg-success w-fit text-base"
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
      node = "Stake: ##";
      if (!!data) {
        teamShortName = (data as PredictionAPIResult).team?.shortName;
        amount = (data as PredictionAPIResult).result;
        result = (data as PredictionAPIResult).status;
        text1 =
          (data as PredictionAPIResult).user.name?.split(" ")?.[0] ?? "User";
        text2 = (data as PredictionAPIResult).user.name?.split(" ")?.[1] ?? "1";
        node = (
          <Button
            variant="success"
            className="font-semibold hover:bg-success w-fit text-base cursor-default"
          >
            Stake : {(data as PredictionAPIResult).amount.toFixed()}
          </Button>
        );
        isDouble = (data as PredictionAPIResult).isDouble;
      }
      break;
    case "pred":
      node = "Stake: ##";
      if (!!data) {
        teamShortName = (data as PredictionAPIResult).team?.shortName;
        amount = (data as PredictionAPIResult).result;
        result = (data as PredictionAPIResult).status;
        text1 = "IPL";
        text2 = "Winner";
        isDouble = (data as PredictionAPIResult).isDouble;
        node = (
          <Button
            variant="success"
            className="font-semibold hover:bg-success w-fit text-base cursor-default"
          >
            Stake : {(data as PredictionAPIResult).amount.toFixed()}
          </Button>
        );
      }
      break;
    default:
      break;
  }

  return (
    <CardHeader
      className={cn(
        `flex flex-row items-center justify-between border-b ${teamShortName} p-0 rounded-t-xl h-[265px] w-full relative`
      )}
    >
      <div className="flex flex-col justify-between gap-4 p-4 h-full flex-1">
        <div className="font-semibold inline-flex items-center gap-2">
          <ShieldHalfIcon className="size-4" />
          <span className="text-xl font-semibold">1</span>
          {/* {!!data &&
            type === "user" &&
            session?.user.role === UserRole.ADMIN && (
              <PaidForm
                userId={(data as UserAPIResult).id}
                isPaid={!!(data as UserAPIResult).profile?.isPaid}
              />
            )} */}
        </div>
        <CarouselCardDesc
          header={true}
          type={type}
          text1={text1}
          text2={text2}
          node={node}
          isDouble={isDouble}
        />
        <CarouselCardAmount
          type={type}
          header={true}
          amount={amount}
          team={teamShortName}
          result={result}
          isDouble={isDouble}
        />
      </div>
      <CarouselCardTeamLogo header={true} team={teamShortName} />
    </CardHeader>
  );
};
