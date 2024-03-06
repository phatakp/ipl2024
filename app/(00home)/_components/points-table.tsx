import { getMatchResults } from "@/actions/match.actions";
import { getTeams } from "@/actions/team.actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export const PointsTable = async () => {
  const teams = await getTeams();
  const matches = await getMatchResults();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-8 pt-24">
      <h1 className="text-3xl title font-extrabold">Points Table</h1>
      <Table>
        <TableCaption>
          {matches.length > 0 &&
            `Updated after completion of Match ${matches[0].num} - ${
              matches[0].team1?.shortName ?? "TBC"
            } vs ${matches[0].team2?.shortName ?? "TBC"}`}
        </TableCaption>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead className="text-right w-fit">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Pld</TableHead>
            <TableHead className="text-right hidden md:table-cell">
              Won
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              Lost
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              NR
            </TableHead>
            <TableHead className="text-right">Pts</TableHead>
            <TableHead className="text-right">NRR</TableHead>
            <TableHead className="text-left hidden md:table-cell">
              For
            </TableHead>
            <TableHead className="text-left hidden md:table-cell">
              Agst
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={team.id}>
              <TableCell className="font-semibold text-right w-fit">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-start gap-2 font-over">
                  <Image
                    src={`/${team.shortName}.png`}
                    width={40}
                    height={40}
                    alt="team"
                  />
                  <span>{team.shortName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{team.played}</TableCell>
              <TableCell className="text-right hidden md:table-cell">
                {team.won}
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                {team.lost}
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                {team.draw}
              </TableCell>
              <TableCell className="text-right">{team.points}</TableCell>
              <TableCell className="text-right">
                {team.nrr.toFixed(3)}
              </TableCell>
              <TableCell className="text-left hidden md:table-cell">
                {team.forRuns}/{team.forOvers}
              </TableCell>
              <TableCell className="text-left hidden md:table-cell">
                {team.againstRuns}/{team.againstOvers}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
