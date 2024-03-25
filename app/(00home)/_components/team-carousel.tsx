import { Teams } from "@/lib/constants";
import Image from "next/image";

export const TeamCarousel = () => {
  return (
    <div className="w-full inline-flex flex-nowrap max-w-7xl mx-auto overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {Object.keys(Teams).map((key, index) => (
          <li key={key} className="relative size-16 sm:size-18 md:size-20">
            <Image src={`/${key}outline.png`} alt="" fill />
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        {Object.keys(Teams).map((key, index) => (
          <li key={key} className="relative size-20">
            <Image src={`/${key}outline.png`} alt="" fill />
          </li>
        ))}
      </ul>
    </div>
  );
};
