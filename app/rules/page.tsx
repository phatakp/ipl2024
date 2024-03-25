import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RuleTable } from "./_components/rule-table";

const RulesPage = () => {
  return (
    <>
      <PageHeader
        title="Game Rules"
        desc="Predict the winner of every IPL game and earn big !!"
      />
      <div className={`relative w-full max-w-7xl mx-auto px-4 md:px-8`}>
        <ul className="leading-loose space-y-16">
          <Card>
            <CardHeader className="text-3xl font-over title mb-4">
              Pre Requisites
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-disc space-y-4">
                <li className="font-semibold">
                  Once a player registers, he/she needs to complete the whole
                  tournament.
                </li>
                <li>
                  After first login, every player will be asked predict the
                  overall IPL winner. <br />
                  An automatic stake of Rs.500/- will be applicable for this
                  case, which will be settled after final match.
                </li>
                <li className="font-semibold">
                  IPL Winner can be changed up until the completion of Match 35.{" "}
                  <br /> This can be done from Dashboard page (Edit Icon just
                  beside your name).
                </li>
                <li>
                  <span className="text-destructive">
                    After registration a caution deposit of Rs.500/ has to be
                    made
                  </span>{" "}
                  on phone number <strong>9130469142 (PhonePe/GPay)</strong>.{" "}
                  <br /> Only then you will be allowed to predict the matches.
                  This deposit will be adjusted in your final settlement.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-3xl font-over title mb-4">
              Prediction
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-disc space-y-4">
                <li className="">
                  Every player has to predict the winner of the match atleast 30
                  minutes before start of the match.
                </li>

                <li className="">
                  Minimum Stake is applicable for each match as below.{" "}
                  <strong>
                    No Maximum Limit, but stake can be increased in multiples of
                    10.
                  </strong>
                  <ul>
                    For League Matches - <strong>Rs.50</strong>
                  </ul>
                  <ul>
                    For Knockout/Qualifiers - <strong>Rs.100</strong>
                  </ul>
                  <ul>
                    For Final Match - <strong>Rs.200</strong>
                  </ul>
                </li>

                <li className="">
                  Player has the option to play double any time (up until 30
                  mins post start of match). <br /> However his/her stake amount
                  should be the highest.
                </li>

                <li className="text-destructive">
                  In case a player does not predict before the cutoff, an amount
                  equivalent to minimum stake <br />
                  applicable for the match will deducted from player&apos;s
                  balance.
                </li>
                <li>
                  <span className="font-semibold">
                    Prediction can be updated as per below guidelines.
                  </span>
                  <br />
                  Rules for same are defined as -
                  <ol className="ml-4 list-inside list-disc space-y-2">
                    <li>
                      Stake amount can only be increased (No decrease allowed)
                      up until start of match.
                    </li>
                    <li>
                      Team change is allowed until start of match, however the
                      stake amount has to be atleast double of the existing
                      value.
                    </li>
                    <li>
                      Double of another player can be overridden up until 30
                      mins post start of match. <br /> However the stake has to
                      be increased, to be more than previous double.
                    </li>
                  </ol>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-3xl font-over title">
              Double Plays
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-disc space-y-4">
                <li>
                  Each player will be awarded a total of 5 double plays to be
                  utilized in{" "}
                  <span className="font-semibold text-destructive">
                    league matches only.
                  </span>
                </li>
                <li className="">
                  Double can be applied anytime up until 30 mins post start of
                  the match.
                </li>
                <li className="font-semibold">
                  Only one double (one with the highest stake) will be
                  applicable.
                </li>
                <li className="text-destructive">
                  If a double is played and match is abandoned, the double will
                  be added back to player tally.
                </li>
                <li className="text-destructive">
                  Any unutilized doubles at the end of league stage will be
                  exhausted.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-3xl font-over title">
              Settlement
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-disc space-y-4">
                <li>
                  All stakes will be settled at end of each match as below -
                  <ul className="ml-8">
                    For Losing stakes, amount equivalent to stake to be debited
                    from balance.
                  </ul>
                  <ul className="ml-8">
                    For Winning stakes, amount will be credited to balance as
                    per below formula.
                    <li className="font-semibold text-success">
                      Credit Amount = (Your Stake / Total Win Amount) * Total
                      Loss Amount
                    </li>
                  </ul>
                </li>

                <li>
                  Defaulted stakes will always deducted (even if the match was
                  abandoned or there were no winners). <br /> For such matches,
                  defaulted stakes will be divided among all non-defaulters as
                  per applicable formula
                </li>

                <li className="">
                  In case double was played and won, all losers will lose double
                  their stake. <br /> Winning double will get additional 50%
                  share of the total loss amount over an above the usual win
                  amount.
                </li>
                <li>
                  Losing double will just have his/her loss doubled. <br />
                  The amount will be divided among winners as per existing
                  formula
                </li>

                <li>
                  Below table shows the sample stake results for the CSK vs KKR
                  match and applicable settlements.{" "}
                  <span className="text-destructive">
                    &apos;D&apos; in the row shows double player.
                  </span>
                  <h5 className="mt-4 text-lg">Result after the Match</h5>
                  <span className="text-sm text-muted-foreground">
                    Credit Amount = (Your Stake / Total Win Amount) * Total Loss
                    Amount
                  </span>
                  <RuleTable />
                </li>

                <li className="text-destructive">
                  Higher the stakes, higher will be the return.
                </li>
              </ol>
            </CardContent>
          </Card>
        </ul>

        <h1 className="mt-16 text-6xl font-extrabold">Play Bold !!</h1>
      </div>
    </>
  );
};

export default RulesPage;
