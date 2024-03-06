"use client";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LogInIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const DesktopNav = () => {
  const path = usePathname();
  const { data: session, status } = useSession();

  return (
    <>
      <div className="md:flex flex-1 items-center justify-center gap-8 hidden">
        {routes.map((route) => {
          if (status === "loading")
            return <Skeleton key={route.href} className="w-16 h-6" />;
          const isActive =
            path === route.href ||
            (route.href === "/matches" && path.includes("/matches"));
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "font-over uppercase font-semibold relative transition-all ease-in-out duration-500 group",
                route.isProtected && !session?.user.id && "hidden"
              )}
            >
              {route.name}
              {isActive ? (
                <span className="w-full h-1 absolute -bottom-2 left-1/2 -translate-x-1/2 bg-destructive mx-auto transition-all duration-500 ease-in-out"></span>
              ) : (
                <span className="w-0 group-hover:w-full h-1 absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary mx-auto transition-all duration-500 ease-in-out"></span>
              )}
            </Link>
          );
        })}
      </div>
      {!session?.user.id && (
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "hidden md:flex"
          )}
        >
          Login
          <LogInIcon className="size-4 ml-2" />
        </Link>
      )}
    </>
  );
};
