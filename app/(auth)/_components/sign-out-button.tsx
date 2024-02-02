"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();
  async function handleLogout() {
    await signOut();
    router.replace("/");
  }

  return (
    <Button
      className="flex gap-2"
      variant="btnlink"
      size="btnlink"
      onClick={handleLogout}
    >
      <LogOutIcon className="h-4 w-4" />
      Logout
    </Button>
  );
};
