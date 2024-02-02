"use client";

import { createOrUpdatePrediction } from "@/app/(protected)/_actions";
import {
  PredictionData,
  PredictionSchema,
} from "@/app/(protected)/_zodSchemas";
import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTeamStats } from "@/hooks/team-stats";
import { cn, isMatchStarted } from "@/lib/utils";
import { MatchAPIResult, PredictionAPIResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MatchStatus } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PredictionFormProps = {
  match: MatchAPIResult;
  prediction: PredictionAPIResult | null;
};

export const PredictionForm = ({ match, prediction }: PredictionFormProps) => {
  const [isOpen, setisOpen] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const { data: stats, isLoading } = useTeamStats(
    match.team1Id,
    match.team2Id,
    isOpen
  );

  const form = useForm<PredictionData>({
    resolver: zodResolver(PredictionSchema),
    defaultValues: {
      amount: prediction?.amount ?? match.minStake,
      matchId: match.id ?? "",
      teamId: prediction?.teamId ?? "",
      userId: prediction?.userId ?? session?.user.id,
      isDouble: !!prediction?.isDouble ?? false,
    },
  });

  const [teamId, amount] = form.watch(["teamId", "amount"]);

  const onSubmit = async (values: PredictionData) => {
    const resp = await createOrUpdatePrediction(values);

    if (resp?.success) {
      toast({
        title: "Success",
        description: "Prediction updated successfully",
      });
      setisOpen(false);
    } else
      toast({
        title: "Error",
        description: `${resp.data}`,
        variant: "destructive",
      });
  };

  if (
    !(
      match.status === MatchStatus.SCHEDULED &&
      !isMatchStarted(match.date) &&
      !!session?.user.profile.teamId
    )
  )
    return null;

  return (
    <Dialog open={isOpen} onOpenChange={setisOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Predict Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>

      {isLoading ? (
        loader()
      ) : (
        <DialogContent className="bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center p-4">
          <Card className="w-full bg-background text-foreground shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading font-normal tracking-wide">
                Match {match.num} - {match.team1?.shortName} vs{" "}
                {match.team2?.shortName}
              </CardTitle>
              <CardDescription>Predict and win big !</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <Label
                    className={cn(
                      "tracking-wide font-heading text-lg my-4",
                      !!prediction &&
                        prediction.teamId === teamId &&
                        prediction.amount === amount
                        ? "text-primary"
                        : "text-destructive"
                    )}
                  >
                    {!!prediction &&
                    prediction.teamId === teamId &&
                    prediction.amount === amount
                      ? `Current Bet: Rs.${amount}/- for ${
                          teamId === match.team1Id
                            ? match.team1?.shortName
                            : match.team2?.shortName
                        }`
                      : `Provide Confirmation:  Rs.${amount}/- for ${
                          teamId === match.team1Id
                            ? match.team1?.shortName
                            : match.team2?.shortName
                        }`}
                  </Label>

                  <Slider
                    defaultValue={[match.minStake]}
                    max={match.minStake * 10}
                    min={match.minStake}
                    step={10}
                    onValueChange={(val) => form.setValue("amount", val[0])}
                  />
                  <FormInput name="amount" label="" className="hidden" />

                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      variant={
                        teamId === match.team1Id
                          ? (match.team1!.shortName as any)
                          : "outline"
                      }
                      size="team"
                      className="inline-flex items-center gap-4 rounded-r-none"
                      onClick={() => form.setValue("teamId", match.team1Id!)}
                    >
                      {match.team1?.shortName}
                      <Image
                        src={`/${match.team1?.shortName}.png`}
                        alt="team"
                        width={50}
                        height={50}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant={
                        teamId === match.team2Id
                          ? (match.team2!.shortName as any)
                          : "outline"
                      }
                      size="team"
                      className="inline-flex items-center gap-4 rounded-l-none"
                      onClick={() => form.setValue("teamId", match.team2Id!)}
                    >
                      <Image
                        src={`/${match.team2?.shortName}.png`}
                        alt="team"
                        width={50}
                        height={50}
                      />
                      {match.team2?.shortName}
                    </Button>
                  </div>
                  {!!stats?.pct && (
                    <div className="text-sm text-destructive font-semibold">
                      {`Based on stats ${match.team1?.shortName} has ${stats.pct}% chance of
              winning`}
                    </div>
                  )}
                  <FormInput name="teamId" label="" className="hidden" />

                  <FormField
                    control={form.control}
                    name="isDouble"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Double your stake
                          </FormLabel>
                          <FormDescription>
                            Only the one with highest stake will be applied.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
