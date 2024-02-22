import { TeamFormGuide } from "@/app/(00home)/_components/team-form-guide";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  PredictionAPIResult,
  PredictionResultAPIType,
  UserAPIResult,
} from "@/types";
import { Team } from "@prisma/client";
import { UserTableFormGuide } from "../../app/(protected)/_components/user-table-form-guide";
import { Badge } from "../ui/badge";

type MatchPredProps = {
  type: "matchpred";
  data: PredictionAPIResult;
  page: number;
  index: number;
};

type PredProps = { type: "pred"; data: PredictionAPIResult };

type PredResultProps = {
  header: false;
  type: "result";
  data: PredictionResultAPIType;
  page: number;
  index: number;
};

type UserProps = {
  header: false;
  type: "user";
  data: UserAPIResult;
  page: number;
  index: number;
};

type PredHeaderResultProps = {
  header: true;
  type: "result";
  data: PredictionResultAPIType;
};

type UserHeaderProps = {
  header: true;
  type: "user";
  data: UserAPIResult;
};

type TeamHeaderProps = {
  header: true;
  type: "team";
  data: Team;
};

type CarouselCardDescProps = { header: boolean } & (
  | MatchPredProps
  | PredProps
  | UserProps
  | PredResultProps
  | PredHeaderResultProps
  | UserHeaderProps
  | TeamHeaderProps
);

const PAGE_SIZE = siteConfig.pageSize;

export const CarouselCardDesc = (props: CarouselCardDescProps) => {
  if (!props.data) return null;

  let title1 = "";
  let title2 = "";
  let titleData = "";

  switch (props.type) {
    case "user":
      title1 = props.data.profile?.firstName ?? "User";
      title2 = props.data.profile?.lastName ?? "1";
      titleData =
        props.data.name ??
        `User ${
          ((props as UserProps).page - 1) * PAGE_SIZE +
          (props as UserProps).index +
          1
        }`;
      break;
    case "result":
      title1 = props.data.user.profile?.firstName ?? "User";
      title2 = props.data.user.profile?.lastName ?? "1";
      titleData =
        props.data.user.name ??
        `User ${
          ((props as PredResultProps).page - 1) * PAGE_SIZE +
          (props as PredResultProps).index +
          1
        }`;
      break;
    case "matchpred":
      title1 = props.data.user.name?.split(" ")?.[0] ?? "User";
      title2 = props.data.user.name?.split(" ")?.[1] ?? "1";
      titleData =
        props.data.user.name ??
        `User ${(props.page - 1) * PAGE_SIZE + props.index + 1}`;
      break;
    case "pred":
      title1 = "IPL";
      title2 = "Winner";
      titleData = `${props.data.match?.team1?.shortName}-vs-${props.data.match?.team2?.shortName}`;
      break;
    case "team":
      title1 =
        props.data.longName.split(" ")?.[0] ?? (props.data as Team).shortName;
      title2 = props.data.longName.split(" ")?.[1] ?? "";
      titleData = props.data.longName;
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {props.header && (
        <div className="relative flex flex-col">
          <CarouselCardTitle type="1" title={title1} />
          <CarouselCardTitle type="2" title={title2} />
          {props.type === "matchpred" && props.data.isDouble && (
            <Badge className="bg-green-600 text-white absolute -right-8 props.data-1/2 -translate-y-1/2 hover:bg-green-600">
              Double
            </Badge>
          )}
        </div>
      )}
      {!props.header && (
        <>
          <CarouselCardTitle type="data" title={titleData} />

          {props.type === "matchpred" && props.data.isDouble && (
            <Badge className="bg-green-600 text-white absolute right-4 props.data-1/2 -translate-y-1/2 hover:bg-green-600">
              Double
            </Badge>
          )}
        </>
      )}

      {["pred", "matchpred"].includes(props.type) && (
        <span className="text-sm text-muted-foreground h-4 mt-2">
          Stake : {(props.data as PredictionAPIResult).amount.toFixed()}
        </span>
      )}
      {props.type === "result" && (
        <span className="text-sm text-muted-foreground h-4 mt-2">
          Match-{props.data.match?.num} : {props.data.match?.team1?.shortName}{" "}
          vs {props.data.match?.team2?.shortName}
        </span>
      )}
      {props.type === "user" && <UserTableFormGuide userId={props.data.id} />}
      {props.type === "team" && <TeamFormGuide teamId={props.data.id} />}
    </div>
  );
};

export const CarouselCardTitle = ({
  type,
  title,
}: {
  title: string;
  type: "1" | "2" | "data";
}) => (
  <span
    className={cn(
      "font-over",
      type === "1"
        ? "font-semibold"
        : type === "2"
        ? "font-bold text-xl"
        : "text-sm"
    )}
  >
    {title}
  </span>
);
