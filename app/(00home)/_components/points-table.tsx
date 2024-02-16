import { getTeams } from "@/actions/team.actions";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { TeamFormGuide } from "./team-form-guide";

export const PointsTable = async () => {
  const teams = await getTeams();

  return (
    <Card className="w-full">
      <Table>
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
      </Table>
    </Card>
  );
};
