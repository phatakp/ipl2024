"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SignOutButton } from "@/app/(auth)/_components/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const UserProfileDropDown = () => {
  const { data: session, status } = useSession();
  const path = usePathname();
  if (status === "loading") return <Loader2 className="h-8 w-8 animate-spin" />;

  const profileImg = session?.user.image ?? "https://github.com/shadcn.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={profileImg} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col">
          <span>My Account</span>
          <span className="text-muted-foreground text-xs font-normal">
            {session?.user.name}
          </span>
        </DropdownMenuLabel>
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

        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
