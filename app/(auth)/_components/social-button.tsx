"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export const SocialButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function handleGoogleLogin() {
    try {
      setLoading(true);
      signIn("google", { callbackUrl: "/dashboard" }).then((callback) => {
        if (callback?.error)
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
          });
        if (callback?.ok && !callback.error) {
          toast({ title: "You are logged in successfully!" });
        }
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Could not log you in" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <Button
        className="flex gap-4"
        variant="destructive"
        onClick={handleGoogleLogin}
      >
        <Image src={"/google.png"} width={16} height={16} alt="" />
        Sign in with Google
      </Button>
      <div className="relative">
        <Separator />
        <span className="absolute text-sm text-muted-foreground -top-2.5 left-1/2 -translate-x-1/2 bg-background">
          or continue with
        </span>
      </div>
    </div>
  );
};
