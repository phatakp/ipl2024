"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type NavLinkProps = {
  link: { href: string; isProtected: boolean; name: string; icon: ReactNode };
};

export const NavLink = ({ link }: NavLinkProps) => {
  const path = usePathname();
  const { status } = useSession();
  if (status === "loading") return <Skeleton className="w-16 h-6" />;

  return (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        "group transition duration-300 font-over text-sm uppercase",
        link.isProtected && status !== "authenticated" && "hidden"
      )}
    >
      {link.name}
      {path !== link.href &&
        ((link.href === "/matches" && !path.includes("/matches")) ||
          link.href !== "/matches") && (
          <span className="block max-w-0 group-hover:max-w-[50%] mx-auto transition-all duration-500 h-1 bg-secondary mt-2"></span>
        )}
      {(path === link.href ||
        (link.href === "/matches" && path.includes("/matches"))) && (
        <span className="block max-w-[50%] mx-auto transition-all duration-500 h-1 bg-primary mt-2"></span>
      )}
    </Link>
  );
};
