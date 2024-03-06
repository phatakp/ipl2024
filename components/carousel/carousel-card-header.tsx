import { PaidForm } from "@/app/(protected)/_components/forms/is-paid-form";
import { cn } from "@/lib/utils";
import {
  CarouselItemDataType,
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { PredictionStatus, Team, UserRole } from "@prisma/client";
import { ShieldHalfIcon } from "lucide-react";
import { Session } from "next-auth";
import { ReactNode } from "react";
import { FormGuide } from "../form-guide";
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
  let nrr = 0;
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
        text1 =
          (data as PredictionResultAPIType).user.profile?.firstName ?? "User";
        text2 = (data as PredictionResultAPIType).user.profile?.lastName ?? "1";
        node = `${
          (data as PredictionResultAPIType).match?.team1?.shortName ?? "TBC"
        } vs ${
          (data as PredictionResultAPIType).match?.team2?.shortName ?? "TBC"
        }`;
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
        node = `Stake : ${(data as PredictionAPIResult).amount.toFixed()}`;
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
        node = `Stake : ${(data as PredictionAPIResult).amount.toFixed()}`;
      }
      break;
    case "team":
      node = <FormGuide header={true} type="team" id={""} />;
      if (!!data) {
        teamShortName = (data as Team).shortName;
        amount = (data as Team).points;
        const names = (data as Team).longName.split(" ");
        text1 = names.length > 2 ? `${names[0]} ${names[1]}` : names[0];
        text2 = names.at(-1)!;
        nrr = (data as Team).nrr;
        node = <FormGuide header={true} type="team" id={(data as Team).id} />;
      }
      break;

    default:
      break;
  }

  return (
    <CardHeader
      className={cn(
        `flex flex-row items-center justify-between border-b ${teamShortName} p-0 rounded-t-xl h-[265px] w-full`
      )}
    >
      <div className="flex flex-col justify-between gap-4 p-4 h-full flex-1">
        <div className="font-semibold inline-flex items-center gap-2">
          <ShieldHalfIcon className="size-4" />
          <span className="text-xl font-semibold">1</span>
          {!!data &&
            type === "user" &&
            session?.user.role === UserRole.ADMIN && (
              <PaidForm
                userId={(data as UserAPIResult).id}
                isPaid={!!(data as UserAPIResult).profile?.isPaid}
              />
            )}
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
          nrr={nrr}
          team={teamShortName}
          result={result}
          isDouble={isDouble}
        />
      </div>
      <CarouselCardTeamLogo header={true} team={teamShortName} />
    </CardHeader>
  );
};
