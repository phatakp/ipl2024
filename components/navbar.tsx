"use client";

import { UserProfile } from "@/app/(protected)/_components/user-profile";
import { MobileNav } from "@/components/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/scroll-position";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  link.isProtected && status !== "authenticated" && "hidden",
                  "group transition duration-300 font-heading tracking-widest"
                )}
              >
                {link.name}
                {(!path.includes(link.href) || path === "/") && (
                  <span className="block max-w-0 group-hover:max-w-[50%] mx-auto transition-all duration-500 h-1 bg-secondary"></span>
                )}
                {path.includes(link.href) && path !== "/" && (
                  <span className="block max-w-[50%] mx-auto transition-all duration-500 h-1 bg-primary"></span>
                )}
              </Link>
            ))}
          </div>
          {status === "authenticated" && <UserProfile />}
          {status === "unauthenticated" && <MobileNav />}
          {status === "unauthenticated" && !path.includes("sign") && (
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "hidden md:flex"
              )}
            >
              Login
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};
