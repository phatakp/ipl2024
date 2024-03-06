"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { SignOutButton } from "@/app/(auth)/_components/sign-out-button";
import { NavLink } from "@/components/navigation/nav-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { IndianRupeeIcon, LogInIcon, TextIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { Badge } from "../ui/badge";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") return <Skeleton className="size-6 rounded-full" />;

  const profileImg = session?.user.image ?? "https://github.com/shadcn.png";

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {!!session?.user.id ? (
          <div className="relative">
            <Avatar className="border-primary">
              <AvatarImage src={profileImg} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Badge
              className="flex items-center justify-center text-xs absolute left-0 -translate-x-1/2 top-0 z-10"
              variant={session.user.balance < 0 ? "destructive" : "success"}
            >
              <IndianRupeeIcon className="size-3 text-muted" />
              {session.user.balance.toFixed(1)}
            </Badge>
          </div>
        ) : (
          <TextIcon className="w-6 h-6 md:hidden cursor-pointer" />
        )}
      </DrawerTrigger>

      <DrawerContent className="w-full py-8 outline-none">
        {!!session?.user.id ? (
          <DrawerHeader className="flex flex-col justify-center items-center space-y-4">
            <DrawerClose asChild>
              <Button variant="outline" size="icon">
                <X className="size-4" />
              </Button>
            </DrawerClose>
            <AnimatedTooltip
              items={[
                {
                  id: session.user.id,
                  name: session.user.name ?? "Anonymous User",
                  desc: `Doubles Left: ${session.user.doublesLeft}`,
                  image: profileImg,
                },
              ]}
            />

            <SignOutButton />
          </DrawerHeader>
        ) : (
          <>
            <DrawerHeader>
              <DrawerClose asChild>
                <Button variant="outline" size="icon">
                  <X className="size-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              onClick={() => setOpen(false)}
            >
              Login
              <LogInIcon className="w-4 h-4 ml-2" />
            </Link>
          </>
        )}
        <div className="h-full w-full flex flex-col items-center justify-center space-y-8 overflow-hidden">
          {routes.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              onClose={() => setOpen(false)}
            />
          ))}
        </div>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
