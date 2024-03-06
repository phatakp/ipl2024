"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const MatchCardScheduleLink = () => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => router.push("/matches")}
      className={cn("text-xs p-0")}
    >
      IPL Schedule
    </Button>
  );
};
