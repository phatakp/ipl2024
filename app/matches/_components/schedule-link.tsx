"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ScheduleLink = () => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => router.push("/matches")}
      className={"text-xs p-0"}
    >
      Schedule
    </Button>
  );
};
