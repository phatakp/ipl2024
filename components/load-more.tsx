"use client";

import { getMatchFixtures, getMatchResults } from "@/actions/match.actions";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

let page = 2;
type MatchDetailType = JSX.Element;

export const LoadMore = ({ type }: { type: "fixtures" | "results" }) => {
  const { ref, inView } = useInView();
  const [data, setData] = useState<MatchDetailType[]>([]);
  const [moreData, setMoreData] = useState(true);

  useEffect(() => {
    if (inView) {
      if (type === "fixtures") {
        getMatchFixtures(page).then((res) => {
          if (res.length === 0) setMoreData(false);
          setData([...data, ...res]);
          page++;
        });
      } else {
        getMatchResults(page).then((res) => {
          if (res.length === 0) setMoreData(false);
          setData([...data, ...res]);
          page++;
        });
      }
    }
  }, [inView, data, type]);

  if (!moreData) return null;

  return (
    <>
      <div className="w-full max-w-6xl mx-auto grid gap-4">
        <Card className="w-full px-0 md:px-4 shadow-md">
          <CardContent className="">{data}</CardContent>
        </Card>
      </div>
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          <Image
            src="./spinner.svg"
            alt="spinner"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
};
