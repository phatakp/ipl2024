import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const RuleTable = () => {
  return (
    <Table>
      <TableCaption>Win/Loss Summary Post Match</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Player</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">If CSK Wins</TableHead>
          <TableHead className="text-right">If KKR Wins</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium relative">
            P1
            <Badge
              variant="success"
              className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 px-2"
            >
              D
            </Badge>
          </TableCell>
          <TableCell>CSK</TableCell>
          <TableCell className="text-right">100</TableCell>
          <TableCell className="text-right text-success">+333.3</TableCell>
          <TableCell className="text-right text-destructive">-200</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium relative">P2</TableCell>
          <TableCell>CSK</TableCell>
          <TableCell className="text-right">50</TableCell>
          <TableCell className="text-right text-success">+66.7</TableCell>
          <TableCell className="text-right text-destructive">-50</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium relative">P3</TableCell>
          <TableCell>KKR</TableCell>
          <TableCell className="text-right">100</TableCell>
          <TableCell className="text-right text-destructive">-200</TableCell>
          <TableCell className="text-right text-success">+150</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium relative">P4</TableCell>
          <TableCell>KKR</TableCell>
          <TableCell className="text-right">50</TableCell>
          <TableCell className="text-right text-destructive">-100</TableCell>
          <TableCell className="text-right text-success">+150</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium relative">P5</TableCell>
          <TableCell>-</TableCell>
          <TableCell className="text-right">50</TableCell>
          <TableCell className="text-right text-destructive">-100</TableCell>
          <TableCell className="text-right text-destructive">-50</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
