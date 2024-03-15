"use client";

import { addMatch } from "@/actions/match.actions";
import { FormInput } from "@/components/form-input";
import { FormSelect } from "@/components/form-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useTeamOptions } from "@/hooks/team-options";
import { cn } from "@/lib/utils";
import {
  AddMatchFormData,
  AddMatchFormSchema,
} from "@/zodSchemas/match.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MatchType } from "@prisma/client";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const typeOptions = Object.keys(MatchType).map((key) => ({
  value: key,
  label: key,
}));
const stakeOptions = [
  { value: "50", label: "50" },
  { value: "100", label: "100" },
  { value: "200", label: "200" },
];

export const AddMatchForm = () => {
  const [isOpen, setisOpen] = useState(false);
  const { toast } = useToast();
  const { update } = useSession();
  const { data: teams, isLoading } = useTeamOptions();

  const form = useForm<AddMatchFormData>({
    resolver: zodResolver(AddMatchFormSchema),
    mode: "onChange",
    defaultValues: {
      num: "0",
      type: MatchType.LEAGUE,
      date: DateTime.fromISO(new Date().toISOString())
        .setZone("Asia/Kolkata")
        .toISO()!,
      venue: "",
      minStake: "50",
      team1Id: "",
      team2Id: "",
    },
  });

  const onSubmit = async (values: AddMatchFormData) => {
    const resp = await addMatch(values);
    if (resp?.success) {
      toast({
        title: "Success",
        description: "Match added successfully",
      });
      setisOpen(false);
    } else
      toast({
        title: "Error",
        description: `${resp?.data}`,
        variant: "destructive",
      });
  };

  if (isLoading) return loader();

  const teamOptions = teams!.map((team) => ({
    value: team.id,
    label: team.longName,
  }));

  return (
    <Dialog open={isOpen && !isLoading} onOpenChange={setisOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="mt-8 w-fit z-50 mx-auto"
        >
          Add Match
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center p-4">
        <Card className="w-full bg-background text-foreground shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-over text-3xl title">
              New Match
            </CardTitle>
            <CardDescription>Add details for the match</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="num"
                    label="Match Num"
                    type="number"
                    min={0}
                    required={true}
                  />
                  <FormSelect
                    name="type"
                    label="Type"
                    options={typeOptions}
                    required={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    name="team1Id"
                    label="Team1"
                    options={teamOptions}
                    required={true}
                  />
                  <FormSelect
                    name="team2Id"
                    label="Team2"
                    options={teamOptions}
                    required={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput name="date" label="Date" />
                  <FormSelect
                    name="minStake"
                    label="Min Stake"
                    options={stakeOptions}
                    required={true}
                  />
                </div>

                <FormInput name="venue" label="Venue" />

                <div className={cn("flex items-center justify-end w-full")}>
                  <Button
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    size="sm"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

const loader = () => (
  <Dialog open>
    <DialogContent className="p-4">
      <Card className="w-full bg-background text-foreground shadow-md border-none">
        <Skeleton className="w-full h-10"></Skeleton>
        <CardContent>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className=" h-10 w-10 rounded-sm" />
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  </Dialog>
);
