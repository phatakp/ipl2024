"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type NavLinkProps = {
  link: { href: string; isProtected: boolean; name: string; icon: ReactNode };
  onClose: () => void;
};

export const NavLink = ({ link, onClose }: NavLinkProps) => {
  const path = usePathname();
  const { status } = useSession();
  if (status === "loading") return <Skeleton className="w-16 h-6" />;
  const isActive =
    path === link.href ||
    (link.href === "/matches" && path.includes("/matches"));
  return (
    <Link
      href={link.href}
      onClick={onClose}
      className={cn(
        "w-full font-over uppercase py-4 px-8 relative hover:text-destructive rounded-r-full rounded-l-none transition-all ease-in-out duration-500",
        isActive &&
          " bg-black text-primary hover:text-primary pointer-events-none",
        link.isProtected && status !== "authenticated" && "hidden"
      )}
    >
      {link.name}
    </Link>
  );
};
