import { getTeams } from "@/actions/team.actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TeamFormGuide } from "./team-form-guide";

export const PointsTable = async () => {
  const teams = await getTeams();
  const first = teams[0];

  return (
    <Card className="w-full max-w-md p-0 rounded-xl">
      <CardHeader
        className={cn(
          `flex flex-row items-center justify-between border-b ${first.shortName} p-0 rounded-t-xl`
        )}
      >
        <div className="flex flex-col justify-between gap-4 p-4 h-full">
          <span className="font-semibold">1</span>
          <div className="grid">
            <span className="text-lg font-over">{first.longName}</span>
            <TeamFormGuide teamId={first.id} />
          </div>
          <span className="font-bold text-6xl">{first.points}</span>
        </div>
        <Image
          src={`/${first.shortName}outline.png`}
          alt="logo"
          width={120}
          height={120}
        />
      </CardHeader>
      <CardContent className="w-full flex flex-col divide-y px-0">
        {teams.map((team, i) => {
          if (i == 0) return null;
          return (
            <div key={team.id} className="flex items-center gap-4 px-4 py-2">
              <span className="w-4">{i + 1}</span>
              <div className="w-10 h-10 sm:w-10 sm:h-10 relative">
                <Image src={`/${team.shortName}.png`} alt="logo" fill />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-over">{team.longName}</span>
                <TeamFormGuide teamId={team.id} />
              </div>
              <span className="font-bold text-lg text-right">
                {team.points}
              </span>
            </div>
          );
        })}
      </CardContent>
      {/* <Table>
        <TableHeader>
          <TableRow className="font-medium bg-darkblue hover:bg-darkblue">
            <TableHead className="text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center hidden md:table-cell">
              W
            </TableHead>
            <TableHead className="text-center hidden md:table-cell">
              L
            </TableHead>
            <TableHead className="text-center hidden md:table-cell">
              NR
            </TableHead>
            <TableHead className="text-center">NRR</TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              For
            </TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Against
            </TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="xl:table-cell hidden">Recent Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team, i) => (
            <TableRow className="border-none" key={team.id}>
              <TableCell className="font-medium text-center py-2 text-darkblue">
                {i + 1}
              </TableCell>
              <TableCell className="inline-flex items-center gap-x-2 py-2 text-darkblue font-medium">
                <Image
                  src={`/${team.shortName}.png`}
                  alt="logo"
                  width={26}
                  height={26}
                />
                <span>{team.shortName}</span>
              </TableCell>
              <TableCell className="py-2 text-center">{team.played}</TableCell>
              <TableCell className="py-2 text-center hidden md:table-cell">
                {team.won}
              </TableCell>
              <TableCell className="py-2 text-center hidden md:table-cell">
                {team.lost}
              </TableCell>
              <TableCell className="py-2 text-center hidden md:table-cell">
                {team.draw}
              </TableCell>
              <TableCell className="py-2 text-center">
                {team.nrr.toFixed(3) ?? "-"}
              </TableCell>
              <TableCell className="py-2 text-center hidden lg:table-cell">
                {team.forRuns ?? 0}/{team.forOvers ?? 0}
              </TableCell>
              <TableCell className="py-2 text-center hidden lg:table-cell">
                {team.againstRuns ?? 0}/{team.againstOvers ?? 0}
              </TableCell>
              <TableCell className="py-2 text-center">{team.points}</TableCell>
              <TableCell className="items-center justify-start gap-x-2 xl:flex hidden py-2">
                <TeamFormGuide teamId={team.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </Card>
  );
};
