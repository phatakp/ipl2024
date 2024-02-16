"use client";

import { TablePagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserDetails } from "@/hooks/user-details";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { UserTableFormGuide } from "./user-table-form-guide";

const PAGE_SIZE = 10;

type UsersTableProps = {
  session: Session | null;
};

export const UsersTable = ({ session }: UsersTableProps) => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUserDetails();
  const totalPages = !!users ? Math.ceil(users?.length / PAGE_SIZE) : 1;
  const pageUsers = users?.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  if (isLoading) return loader();

  return (
    <Card className="w-full space-y-4 relative">
      <Table>
        <TableHeader>
          <TableRow className="font-medium bg-darkblue hover:bg-darkblue">
            <TableHead className="text-center">Pos</TableHead>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">Team</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="xl:table-cell hidden">Recent Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageUsers?.map((user, i) => (
            <TableRow className="border-none" key={user.id}>
              <TableCell className="font-medium text-center py-2 text-darkblue">
                {(page - 1) * PAGE_SIZE + i + 1}
              </TableCell>
              <TableCell className="py-2 text-left truncate relative overflow-visible md:pl-8">
                {user.name ?? `User ${i + 1}`}
                <Badge
                  variant="default"
                  className="rounded-full absolute right-0 md:left-0 top-1/2 -translate-y-1/2 text-xs w-5 h-5 flex items-center justify-center -rotate-12 leading-3"
                >
                  {user.doublesLeft}
                </Badge>
              </TableCell>
              <TableCell className="inline-flex items-center gap-x-1 py-2 text-darkblue font-medium">
                <Image
                  src={`/${user?.profile?.team?.shortName ?? "default"}.png`}
                  alt="logo"
                  width={26}
                  height={26}
                />
                <span>{user?.profile?.team?.shortName ?? "TBC"}</span>
                {session?.user.role === UserRole.ADMIN && (
                  <Badge variant="outline" className="ml-2 text-xs font-light">
                    {user.profile?.isPaid ? "Paid" : "Pending"}
                  </Badge>
                )}
              </TableCell>
              <TableCell
                className={cn(
                  "py-2 text-right",
                  user.balance < 0 ? "text-destructive" : "text-green-600"
                )}
              >
                {user.balance.toFixed(2)}
              </TableCell>
              <TableCell className="items-center justify-start gap-x-2 xl:flex hidden py-2">
                <UserTableFormGuide userId={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <TablePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </Card>
  );
};

export const loader = () => (
  <Card className="w-full flex flex-col gap-2">
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
  </Card>
);
