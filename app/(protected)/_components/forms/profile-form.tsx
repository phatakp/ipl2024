"use client";

import { updateProfile } from "@/actions/user.actions";
import { FormInput } from "@/components/form-input";
import { FormSelect } from "@/components/form-select";
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
import { cn, isIPLWinnerUpdatable } from "@/lib/utils";
import { ProfileInfo } from "@/types";
import { ProfileFormData, ProfileFormSchema } from "@/zodSchemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "lucide-react";
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

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      teamId: profile.teamId ?? "",
      userId,
    },
  });

  const onSubmit = async (values: ProfileFormData) => {
    const { success, data } = await updateProfile(values);
    if (success) {
      setOpen(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } else
      toast({ title: "Error", description: `${data}`, variant: "destructive" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" icon={<ChevronRightIcon />}>
          Edit Profile
        </Button>
      </DialogTrigger>

      {isLoading ? (
        loader()
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              This is mandatory before prediction!!
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput name="firstName" label="First Name" />
              <FormInput name="lastName" label="Last Name" />
              {!!teamOptions && teamOptions.length > 0 && (
                <FormSelect
                  name="teamId"
                  label="IPL Winner Team"
                  options={teamOptions}
                  isDisabled={!isIPLWinnerUpdatable()}
                />
              )}

              <div className={cn("flex items-center justify-end")}>
                <Button isLoading={form.formState.isSubmitting} type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      )}
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
