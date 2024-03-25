"use client";

import { Sidebar } from "@/components/navigation/side-bar";
import { useScrollPosition } from "@/hooks/scroll-position";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DesktopNav } from "./desktop-nav";

export const Navbar = () => {
  const { status } = useSession();
  const scrollPos = useScrollPosition();
  const path = usePathname();

  return (
    <div
      className={cn(
        "sticky inset-x-0 drop-shadow-sm  z-50 ",
        scrollPos > 0 ? "top-0" : "top-8"
      )}
      style={{
        background: `url(/nav.png) left/contain no-repeat,url(/nav-rotate.png) right/contain no-repeat #000`,
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={50} />
          </Link>
          {status === "loading" ? (
            <Skeleton className="size-16 rounded-full" />
          ) : (
            <>
              <DesktopNav />
              <Sidebar />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
