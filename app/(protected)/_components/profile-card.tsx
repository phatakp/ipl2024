import { getTeamById } from "@/actions/team.actions";
import { getUsers } from "@/actions/user.actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IndianRupeeIcon, ShieldHalfIcon } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { ProfileForm } from "./profile-form";

type ProfileCardProps = {
  session: Session | null;
};

export const ProfileCard = async ({ session }: ProfileCardProps) => {
  if (!session) return;

  const users = await getUsers();
  const rank =
    users
      ?.map((user, i) => ({ rank: i + 1, id: user.id }))
      .find((item) => item.id === session.user.id)?.rank ?? "-";
  const team = await getTeamById(session.user.profile.teamId);
  const profileImg = session?.user.image ?? "https://github.com/shadcn.png";

  return (
    <Card className="w-full max-w-sm mx-auto relative">
      <CardHeader className="p-0">
        <div className="w-full h-32 overflow-hidden relative">
          <Image
            className="object-cover object-top"
            src={`/teamBanners/${team?.shortName}.png`}
            alt="Mountain"
            fill
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4  rounded-full overflow-hidden">
          <Image
            className="object-cover object-center h-32"
            src={profileImg}
            alt="Woman looking front"
            fill
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-semibold">{session.user.name}</h2>
          <p className="text-muted-foreground">{team?.longName}</p>
        </div>
        <ul className="py-4 mt-2 text-muted-foreground flex items-center justify-around border-b">
          <li className="flex flex-col items-center justify-around">
            <ShieldHalfIcon className="w-6 h-6 text-darkblue" />
            <span className="text-xl">{rank}</span>
          </li>
          <li className="flex flex-col items-center justify-between">
            <IndianRupeeIcon className="w-6 h-6 text-darkblue" />
            <span
              className={cn(
                "text-xl",
                session.user.balance < 0 ? "text-destructive" : "text-green-600"
              )}
            >
              {session.user.balance.toFixed(2)}
            </span>
          </li>
        </ul>
        <div className="flex items-center justify-center mt-2">
          <ProfileForm
            userId={session!.user.id}
            profile={session!.user.profile}
          />
        </div>
      </CardContent>
    </Card>
  );
};
