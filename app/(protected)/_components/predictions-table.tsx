"use client";

import { TablePagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import { useMatchPredictions } from "@/hooks/match-predictions";
import { useUserPredictions } from "@/hooks/user-predictions";
import { cn, isPredictionCutoffPassed } from "@/lib/utils";
import { MatchAPIResult, PredictionAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type PredictionsTableProps =
  | {
      userId: string;
      match?: MatchAPIResult;
    }
  | { userId?: string; match: MatchAPIResult };

const PAGE_SIZE = 10;

export const PredictionsTable = ({ userId, match }: PredictionsTableProps) => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);

  const { data: matchPredictions, isLoading: isMatchLoading } =
    useMatchPredictions(match?.id, session?.user.id);

  const { data: userPredictions, isLoading: isUserLoading } =
    useUserPredictions(userId);

  let predictions = [] as PredictionAPIResult[];
  let pagePredictions = [] as PredictionAPIResult[];
  let totalPages = 1;

  if (!isMatchLoading && !isUserLoading) {
    predictions = !!userId
      ? userPredictions ?? []
      : session?.user.id
      ? match?.status === MatchStatus.SCHEDULED &&
        !isPredictionCutoffPassed(match.date)
        ? matchPredictions?.filter((pred) => pred.userId === session.user.id) ??
          []
        : matchPredictions ?? []
      : [];
    totalPages = Math.ceil((predictions?.length ?? 0) / PAGE_SIZE);
    pagePredictions = predictions?.slice(
      (page - 1) * PAGE_SIZE,
      (page - 1) * PAGE_SIZE + PAGE_SIZE
    );
  } else return loader();

  return (
    <Card className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="font-medium bg-darkblue hover:bg-darkblue">
            <TableHead className="text-left">
              {!!match?.id ? "User" : "Match"}
            </TableHead>
            <TableHead className="text-left">Team</TableHead>
            <TableHead className="text-right">Stake</TableHead>
            <TableHead className="text-right">Result</TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Created
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isUserLoading && !isMatchLoading && predictions.length === 0 && (
            <TableRow className="text-center">
              <TableCell colSpan={4} className="text-center md:hidden">
                {session?.user.id ? (
                  "No Predictions yet"
                ) : (
                  <div className="w-full flex justify-center items-center gap-2">
                    You are not logged in
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: "link", size: "sm" })
                      )}
                    >
                      Login now
                    </Link>
                  </div>
                )}
              </TableCell>
              <TableCell
                colSpan={5}
                className="text-center hidden md:table-cell"
              >
                {session?.user.id ? (
                  "No Predictions yet"
                ) : (
                  <div className="w-full flex justify-center items-center gap-2">
                    You are not logged in
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: "destructive", size: "sm" })
                      )}
                    >
                      Login now
                    </Link>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
          {pagePredictions?.map((prediction, i) => {
            const name =
              prediction.match?.team1?.shortName &&
              prediction.match?.team2?.shortName
                ? `${prediction.match?.team1?.shortName} vs ${prediction.match?.team2?.shortName}`
                : "IPL Winner";
            return (
              <TableRow className="border-none" key={prediction.id}>
                <TableCell className="font-medium text-left py-2 text-darkblue">
                  {!!match?.id ? (
                    prediction.user.name
                  ) : !!prediction.match?.num ? (
                    <Link
                      href={`/matches/${prediction.match.num}`}
                      className={cn(
                        buttonVariants({ variant: "link", size: "sm" }),
                        "text-left p-0 w-auto h-auto"
                      )}
                    >
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                </TableCell>
                <TableCell className="inline-flex items-center gap-x-1 py-2 text-darkblue font-medium">
                  <Image
                    src={`/${prediction?.team?.shortName ?? "default"}.png`}
                    alt="logo"
                    width={26}
                    height={26}
                  />
                  <span>{prediction.team?.shortName ?? "DEF"}</span>
                </TableCell>
                <TableCell className="py-2 text-right relative">
                  {prediction.amount.toFixed()}
                  {prediction.isDouble && (
                    <Badge className="text-sm flex items-center justify-center w-5 h-5 rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                      D
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-2 text-right",
                    prediction.result < 0
                      ? "text-destructive"
                      : "text-green-600"
                  )}
                >
                  {prediction.result.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-center py-2">
                  {DateTime.fromISO(
                    prediction.createdAt.toISOString()
                  ).toFormat("ff")}{" "}
                  IST
                </TableCell>
              </TableRow>
            );
          })}
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
