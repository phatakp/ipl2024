import { SocialButton } from "@/app/(auth)/_components/social-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { buttonVariants } from "./ui/button";

type Button = {
  href: string;
  title: string;
};

type ModalFormProps = {
  title: string;
  desc: string;
  form: ReactNode;
  leftButton?: Button;
  rightButton?: Button;
  social?: boolean;
};
export const ModalForm = ({
  title,
  desc,
  form,
  leftButton,
  rightButton,
  social,
}: ModalFormProps) => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl title">{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <>
          <div className="flex flex-col space-y-8 mt-8">
            {!!social && <SocialButton />}
            {form}
          </div>
          <div className="flex justify-between items-center mt-8">
            <Link
              href={leftButton?.href ?? "#"}
              className={cn(buttonVariants({ variant: "link" }))}
            >
              {leftButton?.title}
            </Link>

            <Link
              href={rightButton?.href ?? "#"}
              className={cn(buttonVariants({ variant: "link" }))}
            >
              {rightButton?.title}
            </Link>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
