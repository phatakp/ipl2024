"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/" });
  }

  return (
    <Button className="flex gap-2" size="sm" onClick={handleLogout}>
      <LogOutIcon className="size-4" />
      Logout
    </Button>
  );
};
