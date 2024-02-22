import { cn } from "@/lib/utils";
import Image from "next/image";

export const CarouselCardTeamLogo = ({
  header,
  team,
}: {
  header: boolean;
  team: string | undefined;
}) => {
  return (
    <div
      className={cn(
        "relative",
        header ? "w-32 h-32" : "w-10 h-10 sm:w-12 sm:h-12"
      )}
    >
      <Image
        src={`/${team ?? "default"}${header ? "outline" : ""}.png`}
        alt="logo"
        fill
      />
    </div>
  );
};
