"use client";

import { updateProfile } from "@/actions/user.actions";
import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useTeamOptions } from "@/hooks/team-options";
import { cn } from "@/lib/utils";
import { ProfileInfo } from "@/types";
import { ProfileFormData, ProfileFormSchema } from "@/zodSchemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ProfileFormProps = {
  profile: ProfileInfo;
  userId: string;
};

export const ProfileForm = ({ userId, profile }: ProfileFormProps) => {
  const { data: teamOptions, isLoading } = useTeamOptions();
  const { toast } = useToast();
  const [open, setOpen] = useState(!profile.teamId);
  const { update } = useSession();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      teamId: profile.teamId ?? "",
      userId,
    },
  });

  const teamId = form.watch("teamId");

  const onSubmit = async (values: ProfileFormData) => {
    const { success, data } = await updateProfile(values);
    if (success) {
      setOpen(false);
      update();
      toast({ title: "Success", description: "Profile updated successfully" });
    } else
      toast({ title: "Error", description: `${data}`, variant: "destructive" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <Edit2Icon className="size-4 text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl title">
            {!teamId ? "Select IPL Winner" : "Update Profile"}
          </DialogTitle>
          <DialogDescription>
            This is mandatory before prediction!!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput name="firstName" label="First Name" />
            <FormInput name="lastName" label="Last Name" />
            <FormInput name="teamId" type="hidden" label="Select Team" />
            {isLoading && (
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="size-16" />
              </div>
            )}

            <div className="grid grid-cols-5 gap-4 px-auto">
              {teamOptions?.map((team) => (
                <Button
                  key={team.id}
                  type="button"
                  variant={team.shortName as any}
                  onClick={() => form.setValue("teamId", team.id)}
                  className={cn(
                    "relative p-0 m-0 aspect-square opacity-20 size-16 hover:opacity-80",
                    team.id === teamId && "border-2 border-success opacity-100"
                  )}
                >
                  <Image src={`/${team.shortName}outline.png`} alt="log" fill />
                </Button>
              ))}
            </div>

            <div className={cn("flex items-center justify-end my-8")}>
              <Button isLoading={form.formState.isSubmitting} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const loader = () => (
  <DialogContent className="p-4">
    <Card className="w-full bg-background text-foreground shadow-md border-none">
      <Skeleton className="w-full h-10"></Skeleton>
      <CardContent>
        <div>
          <Skeleton className="h-6 my-4" />

          <Skeleton className="h-4 my-4" />

          <div className="flex items-center justify-center">
            <Skeleton className="w-full h-10" />

            <Skeleton className="w-full h-10" />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <Skeleton className="h-6 w-full"></Skeleton>
            <Skeleton className="h-4 w-10" />
          </div>

          <Skeleton className=" h-10 w-10 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  </DialogContent>
);
