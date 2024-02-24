"use client";

import { UserProfileDropDown } from "@/app/(protected)/_components/user-profile-dropdown";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/scroll-position";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { NavLink } from "./nav-link";

export const Navbar = () => {
  const { status } = useSession();
  const scrollPos = useScrollPosition();
  const path = usePathname();

  return (
    <div
      className={cn(
        "sticky inset-x-0  text-white drop-shadow-sm  z-50 ",
        scrollPos > 0 ? "top-0 shadow-md shadow-[#19398a]" : "top-8"
      )}
      style={{
        background: `url(/nav.png) left/contain no-repeat,url(/nav-rotate.png) right/contain no-repeat #19398a`,
      }}
    >
      <nav className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={50} />
          </Link>
          <div className="md:inline-flex items-center gap-8 hidden">
            {routes.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </div>
          {status === "loading" && <Skeleton className="w-20 h-6" />}
          {status === "authenticated" && <UserProfileDropDown />}
          {status === "unauthenticated" && <MobileNav />}
          {status === "unauthenticated" && !path.includes("sign") && (
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden md:flex group w-20"
              )}
            >
              Login
              <ChevronRightIcon className="group-hover:h-4 group-hover:w-4 ml-2 w-0 h-0 opacity-0 group-hover:opacity-100 group-hover:transition group-hover:duration-500" />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};
