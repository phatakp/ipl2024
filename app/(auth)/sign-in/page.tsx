import { Dialog, DialogContent } from "@/components/ui/dialog";

import { SignInForm } from "@/app/(auth)/_components/sign-in-form";
import { SocialButton } from "@/app/(auth)/_components/social-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SignInPage = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <div className="flex items-center justify-center w-full p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-over text-slate-800">Login</CardTitle>
              <CardDescription>
                Enter Credentials to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialButton />
              <SignInForm />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Back to Home
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Don&apos;t have an account
              </Link>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPage;
