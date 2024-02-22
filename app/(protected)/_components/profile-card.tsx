// "use client";

import { getTeamById } from "@/actions/team.actions";
import { getUsers } from "@/actions/user.actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IndianRupeeIcon, ShieldHalfIcon } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { ProfileForm } from "./forms/profile-form";

type ProfileCardProps = {
  session: Session;
};

const classNames =
  "RCB-text GT-text CSK-text MI-text SRH-text LSG-text PBKS-text RR-text DC-text KKR-text";

export const ProfileCard = async ({ session }: ProfileCardProps) => {
  const users = await getUsers();
  const rank =
    users
      ?.map((user, i) => ({ rank: i + 1, id: user.id }))
      .find((item) => item.id === session.user.id)?.rank ?? "-";
  const team = await getTeamById(session.user.profile.teamId);
  const profileImg = session?.user.image ?? "https://github.com/shadcn.png";

  return (
    <Card className="w-full max-w-sm mx-auto relative">
      <CardHeader className="p-0 relative [&>svg]:hidden">
        <div
          className={`inline-flex items-center absolute left-2 top-2 ${team?.shortName}-text z-10`}
        >
          <ShieldHalfIcon className="size-4" />
          <span className="text-lg font-bold">{rank}</span>
        </div>
        <Badge className="absolute right-2 top-2 z-10">
          Doubles: {session.user.doublesLeft}
        </Badge>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 space-y-0">
          <h2
            className={`font-semibold ${team?.shortName}-text m-0 p-0 leading-3`}
          >
            {session.user.name}
          </h2>
          <p className={`text-sm m-0 p-0 ${team?.shortName}-text opacity-80`}>
            {team?.longName}
          </p>
          <div className="inline-flex items-center m-0">
            <IndianRupeeIcon className="size-4 text-muted-foreground" />
            <span
              className={cn(
                "text-2xl font-bold",
                session.user.balance < 0 ? "text-destructive" : "text-green-600"
              )}
            >
              {session.user.balance.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="w-full h-36 overflow-hidden relative">
          <Image
            className="object-cover object-top"
            src={`/teamBanners/${team?.shortName}.png`}
            alt="Mountain"
            fill
          />
        </div>
        <div className="mx-auto size-16 absolute left-1/2 top-0 -translate-x-1/2  border-4 rounded-full overflow-hidden">
          <Image
            className="object-cover object-center"
            src={profileImg}
            alt="Woman looking front"
            fill
          />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-4 pb-1">
        <ProfileForm
          userId={session!.user.id}
          profile={session!.user.profile}
        />
      </CardContent>
    </Card>
  );
};
