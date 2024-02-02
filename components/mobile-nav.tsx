"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = () => {
  const { data: session, status } = useSession();
  const path = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="md:hidden">
        <MenuIcon className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {routes.map((link) => (
          <DropdownMenuItem
            key={link.href}
            asChild
            className={cn(
              link.isProtected && !session?.user.id ? "hidden" : ""
            )}
          >
            <Link
              href={link.href}
              className="group transition duration-300 flex gap-2"
            >
              {link.icon}
              {link.name}
              {(!link.href.includes(path) || path === "/") && (
                <span className="block max-w-0 group-hover:max-w-[50%] mx-auto transition-all duration-500 h-1 bg-secondary"></span>
              )}
              {link.href.includes(path) && path !== "/" && (
                <span className="block max-w-[50%] mx-auto transition-all duration-500 h-1 bg-primary"></span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild>
          <Link href="/sign-in">Login</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
