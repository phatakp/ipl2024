"use client";

import { updateMatch } from "@/actions/match.actions";
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
import { useMatchDetail } from "@/hooks/match-detail";
import { cn, isMatchStarted } from "@/lib/utils";
import {
  UpdateMatchFormData,
  UpdateMatchFormSchema,
} from "@/zodSchemas/match.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MatchStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type UpdateMatchFormProps = {
  matchId: string;
};

const statusOptions = Object.keys(MatchStatus).map((key) => ({
  value: key,
  label: key,
}));

export const UpdateMatchForm = ({ matchId }: UpdateMatchFormProps) => {
  const [isOpen, setisOpen] = useState(false);
  const { toast } = useToast();
  const { data: match, isLoading } = useMatchDetail(matchId);
  const queryClient = useQueryClient();
  const form = useForm<UpdateMatchFormData>({
    resolver: zodResolver(UpdateMatchFormSchema),
    mode: "onChange",
  });
  const { setValue } = form;

  useEffect(() => {
    setValue("matchId", match?.id ?? "");
    setValue("batFirstId", match?.batFirstId ?? "");
    setValue("t1Score", `${match?.team1Runs ?? 0}/${match?.team1Wickets ?? 0}`);
    setValue("t2Score", `${match?.team2Runs ?? 0}/${match?.team2Wickets ?? 0}`);
    setValue("t1Overs", match?.team1Overs.toFixed(1) ?? "0.0");
    setValue("t2Overs", match?.team2Overs.toFixed(1) ?? "0.0");
    setValue("status", match?.status ?? MatchStatus.SCHEDULED);
    setValue("winnerId", match?.winnerId ?? "");
  }, [isLoading, match, setValue]);

  const onSubmit = async (values: UpdateMatchFormData) => {
    const resp = await updateMatch(values, match?.team1Id!);
    if (resp?.success) {
      toast({
        title: "Success",
        description: "Match updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["matchPredictions"] });
      queryClient.invalidateQueries({ queryKey: ["userPredictions"] });
      setisOpen(false);
    } else
      toast({
        title: "Error",
        description: `${resp?.data}`,
        variant: "destructive",
      });
  };

  if (
    match?.status !== MatchStatus.SCHEDULED ||
    !isMatchStarted(match.date) ||
    !match.team1Id ||
    !match.team2Id
  )
    return null;

  const teamOptions = [
    { value: match.team1Id, label: match.team1!.shortName },
    { value: match.team2Id, label: match.team2!.shortName },
  ];

  return (
    <Dialog open={isOpen && !isLoading} onOpenChange={setisOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" icon={<ChevronRightIcon />}>
          Update Match
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center p-4">
        <Card className="w-full bg-background text-foreground shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-over font-normal">
              Match {match.num} - {match.team1?.shortName} vs{" "}
              {match.team2?.shortName}
            </CardTitle>
            <CardDescription>Update Match Result</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormSelect
                  name="status"
                  label="Status"
                  options={statusOptions}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    name="batFirstId"
                    label="Bat First Team"
                    options={teamOptions}
                    required={true}
                  />
                  <FormSelect
                    name="winnerId"
                    label="Winner"
                    options={teamOptions}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="t1Score"
                    label={`${match.team1!.shortName} score`}
                  />
                  <FormInput
                    name="t1Overs"
                    label={`${match.team1!.shortName} overs`}
                    type="number"
                    min={0}
                    max={20}
                    step={0.1}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="t2Score"
                    label={`${match.team2!.shortName} score`}
                  />
                  <FormInput
                    name="t2Overs"
                    label={`${match.team2!.shortName} overs`}
                    type="number"
                    min={0}
                    max={20}
                    step={0.1}
                  />
                </div>

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
