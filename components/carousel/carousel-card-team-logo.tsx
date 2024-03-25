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
    <div className={cn("relative", header ? "size-32" : "size-10 sm:size-12")}>
      <Image src={`/${team ?? "default"}outline.png`} alt="logo" fill />
    </div>
  );
};
