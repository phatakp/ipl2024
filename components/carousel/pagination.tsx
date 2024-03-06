import { siteConfig } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

type PaginationProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  total: number;
  totalPages: number;
};

export const Pagination = ({
  page,
  setPage,
  total,
  totalPages,
}: PaginationProps) => {
  const PAGE_SIZE = siteConfig.pageSize;
  const start = (page - 1) * PAGE_SIZE + 1;
  let end = page * PAGE_SIZE;
  if (end > total) end = total;

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <Button
        variant="link"
        size="icon"
        disabled={page <= 1}
        onClick={() => setPage((prev) => prev - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm">
        {start} to {end} of {total}
      </span>
      <Button
        variant="link"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
