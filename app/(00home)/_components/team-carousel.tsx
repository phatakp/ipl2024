import { Teams } from "@/lib/constants";
import Image from "next/image";

export const TeamCarousel = () => {
  return (
    <div className="w-full inline-flex flex-nowrap max-w-6xl mx-auto overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
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

// export const TeamCarousel = () => {
//   return (
//     <div className="mx-auto w-screen">
//       <Carousel
//         opts={{
//           align: "center",
//           loop: true,
//         }}
//         className="w-[300px] sm:w-full max-w-6xl mx-auto"
//       >
//         <CarouselContent>
//           {Object.keys(Teams).map((key, index) => (
//             <CarouselItem key={key} className="basis-1/4 sm:basis-1/6">
//               <div className="p-1">
//                 <Card className="bg-darkblue border-none w-full max-w-24">
//                   <CardContent className="flex aspect-square items-center justify-center p-2">
//                     <Image
//                       src={`/${key}outline.png`}
//                       alt=""
//                       width={90}
//                       height={90}
//                     />
//                   </CardContent>
//                 </Card>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious
//           variant="ghost"
//           className="text-darkblue-foreground hover:text-darkblue-foreground hover:bg-transparent"
//         />
//         <CarouselNext
//           variant="ghost"
//           className="text-darkblue-foreground hover:text-darkblue-foreground hover:bg-transparent"
//         />
//       </Carousel>
//     </div>
//   );
// };
