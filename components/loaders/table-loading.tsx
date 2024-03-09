import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

const TableLoading = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-8 pt-24">
      <h1 className="text-3xl title font-extrabold">Points Table</h1>
      <Table>
        <TableCaption>
          <Skeleton className="w-full h-6" />
        </TableCaption>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead className="text-right w-fit">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-10 h-6" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="size-6" />
            </TableHead>
            <TableHead className="text-left hidden md:table-cell">
              <Skeleton className="w-10 h-6" />
            </TableHead>
            <TableHead className="text-left hidden md:table-cell">
              <Skeleton className="w-10 h-6" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(10).keys()).map((i) => (
            <TableRow key={i}>
              <TableCell className="font-semibold text-right w-fit">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell>
                <Skeleton className=" w-10 h-6" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="size-6" />
              </TableCell>
              <TableCell className="text-left hidden md:table-cell">
                <Skeleton className=" w-10 h-6" />
              </TableCell>
              <TableCell className="text-left hidden md:table-cell">
                <Skeleton className=" w-10 h-6" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableLoading;
