import { getMatchResults, getMatches } from "@/actions/match.actions";
import {
  getStatsForUser,
  getUserPredictions,
} from "@/actions/prediction.actions";
import {
  getBiggestLoss,
  getHighestWins,
  getUsers,
} from "@/actions/user.actions";
import { Carousel } from "@/components/carousel/carousel";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getAuthServerSession } from "@/lib/auth";
import { MatchAPIResult } from "@/types";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Brain,
  BrainCircuit,
  Dot,
  ShieldIcon,
} from "lucide-react";
import { ProfileForm } from "../_components/forms/profile-form";
import { MatchScheduleCarousel } from "../_components/match-schedule-carousel";
import { StatsCarousel } from "../_components/stats-carousel";

const classNames =
  "text-CSK text-MI text-GT text-RR text-RCB text-LSG text-SRH text-DC text-KKR text-PBKS";

const DashboardPage = async () => {
  const session = await getAuthServerSession();
  if (!session?.user.id) return null;

  const matches: MatchAPIResult[] = await getMatches();
  const completed = await getMatchResults();
  const isWinnerChangeAllowed = completed[0].num < 35;

  //For Stats
  const users = await getUsers();
  const wins = await getHighestWins();
  const losses = await getBiggestLoss();
  const { won, lost, pct, double } = await getStatsForUser(session.user.id);
  const userPredictions = await getUserPredictions(session.user.id);
  const rank =
    users
      ?.map((user, i) => ({ rank: i + 1, id: user.id }))
      .find((item) => item.id === session.user.id)?.rank ?? "-";

  let items = [
    { type: "user", data: users, title: "Leaderboard" },
    { type: "result", data: wins, title: "Highest Single Win" },
    { type: "result", data: losses, title: "Biggest Single Loss" },
    { type: "pred", data: userPredictions, title: "Your Predictions" },
  ];

  items = items.filter((item) => item.data.length > 0);

  const stats = [
    {
      amount: won,
      title: "Total Won",
      icon: <ArrowUpNarrowWide className="size-6 text-muted-foreground" />,
    },
    {
      amount: lost,
      title: "Total Lost",
      icon: <ArrowDownWideNarrow className="size-6 text-muted-foreground" />,
    },
    {
      amount: double,
      title: "Doubles Win/Loss",
      icon: <Brain className="size-6 text-muted-foreground" />,
    },
    {
      amount: pct,
      title: "Prediction Accuracy",
      icon: <BrainCircuit className="size-6 text-muted-foreground" />,
    },
  ];

  const desc = (
    <Badge
      className={`flex items-center text-base font-over ${session.user.profile.team?.shortName} text-${session.user.profile.team?.shortName}-foreground w-full justify-center`}
    >
      <div className="inline-flex items-center">
        <ShieldIcon className="size-6" />
        <span className="">{rank}</span>
      </div>
      <Dot className="size-6 text-muted-foreground" />
      <div className={`flex items-center font-semibold font-over`}>
        <span>{session.user.name}</span>
      </div>
      <Dot className="size-6 text-muted-foreground" />
      <div className="flex items-center justify-center gap-1 font-over">
        <span className="font-over">Doubles:</span>
        <span className="font-semibold">{session.user.doublesLeft}</span>
      </div>
    </Badge>
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        desc={desc}
        component={
          <ProfileForm
            profile={session.user.profile}
            userId={session.user.id}
            isWinnerChangeAllowed={isWinnerChangeAllowed}
          />
        }
      />

      <div className="flex flex-col space-y-16 w-full max-w-7xl mx-auto py-16 px-4">
        <div className="flex flex-col gap-4">
          <h1 className="px-4 title text-3xl font-bold font-over">
            Match Schedule
          </h1>
          <MatchScheduleCarousel matches={matches} />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="px-4 title text-3xl font-bold font-over">
            Your stats
          </h1>
          <StatsCarousel stats={stats} />
        </div>

        <Carousel data={items} />
      </div>
    </>
  );
};

export default DashboardPage;
