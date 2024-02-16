import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <div className="flex items-center justify-center w-full p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-over text-slate-800">
                Create New Account
              </CardTitle>
              <CardDescription>Enter details for your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-8">
              <SocialButton />
              <SignUpForm />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Back to Home
              </Link>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Already have an account
              </Link>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpPage;
