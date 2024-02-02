"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dispatch, SetStateAction } from "react";

type TablePagitionProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};

export const TablePagination = ({
  page,
  setPage,
  totalPages,
}: TablePagitionProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page <= 1}
            href="#"
            onClick={() => setPage((prev) => prev - 1)}
          />
        </PaginationItem>

        <span className="text-xs w-full text-right pr-4">
          Page {page} of {totalPages}
        </span>

        <PaginationItem>
          <PaginationNext
            disabled={page >= totalPages}
            href="#"
            onClick={() => setPage((prev) => prev + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
