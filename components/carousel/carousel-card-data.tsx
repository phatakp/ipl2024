import { PaidForm } from "@/app/(protected)/_components/forms/is-paid-form";
import { cn } from "@/lib/utils";
import {
  CarouselItemDataType,
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { PredictionStatus, Team, UserRole } from "@prisma/client";
import { Session } from "next-auth";
import { ReactNode } from "react";
import { FormGuide } from "../form-guide";
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
  let nrr = 0;
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
            id={(data as UserAPIResult).id}
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
        node = `${
          (data as PredictionResultAPIType).match?.team1?.shortName ?? "TBC"
        } vs ${
          (data as PredictionResultAPIType).match?.team2?.shortName ?? "TBC"
        }`;
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
        text1 = `${
          (data as PredictionAPIResult).match?.team1?.shortName ?? "TBC"
        } vs ${(data as PredictionAPIResult).match?.team2?.shortName ?? "TBC"}`;
        node = `Stake : ${(data as PredictionAPIResult).amount.toFixed()}`;
      }
      break;
    case "team":
      node = <FormGuide header={false} type="team" id={""} />;
      if (!!data) {
        teamShortName = (data as Team).shortName;
        amount = (data as Team).points;
        text1 = (data as Team).longName;
        nrr = (data as Team).nrr;
        node = <FormGuide header={false} type="team" id={(data as Team).id} />;
      }
      break;

    default:
      break;
  }

  return (
    <div
      key={index}
      className={cn("flex items-center justify-between gap-4 px-4 py-2")}
    >
      {!!data && type === "user" && session?.user.role === UserRole.ADMIN && (
        <PaidForm
          userId={(data as UserAPIResult).id}
          isPaid={!!(data as UserAPIResult).profile?.isPaid}
        />
      )}
      <span className="w-6">
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
        nrr={nrr}
        team={teamShortName}
        result={result}
      />
    </div>
  );
};
