import { cn } from "@/lib/utils";
import { CarouselItemDataType } from "@/types";
import { ReactNode } from "react";
import { Badge } from "../ui/badge";

type CarouselCardDescProps = {
  header: boolean;
  type: CarouselItemDataType;
  text1: string;
  text2: string;
  node: ReactNode;
  isDouble?: boolean;
};

export const CarouselCardDesc = ({
  header,
  type,
  text1,
  text2,
  node,
  isDouble,
}: CarouselCardDescProps) => {
  return (
    <div className="flex flex-col flex-1 relative">
      {header ? (
        <div className="relative flex flex-col">
          <CarouselCardTitle type="1" title={text1} />
          <CarouselCardTitle type="2" title={text2} />
        </div>
      ) : (
        <>
          <CarouselCardTitle type="data" title={text1} />

          {isDouble && (
            <Badge
              variant="success"
              className="absolute right-0 bottom-0 size-4 p-0 text-xs -translate-y-1/2"
            >
              &nbsp;D
            </Badge>
          )}
        </>
      )}
      {header ? (
        node
      ) : (
        <span className="text-muted-foreground text-sm">{node}</span>
      )}
    </div>
  );
};

export const CarouselCardTitle = ({
  type,
  title,
}: {
  title: string;
  type: "1" | "2" | "data";
}) => (
  <span
    className={cn(
      "font-over",
      type === "1"
        ? "font-bold text-2xl"
        : type === "2"
        ? "font-extrabold text-4xl"
        : "text-sm opacity-90 truncate"
    )}
  >
    {title}
  </span>
);
