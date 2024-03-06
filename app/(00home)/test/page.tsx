import { getMatchByNum } from "@/actions/match.actions";
import { getMatchPredictions } from "@/actions/prediction.actions";
import { getDefaultersForMatch } from "@/actions/settlement.actions";

const TestPage = async () => {
  const match = await getMatchByNum(19);
  if (!match) return null;
  const defaulters = await getDefaultersForMatch(match.id);
  const matchPredictions = await getMatchPredictions({
    matchId: match.id,
    fetchAll: true,
  });

  const winners = matchPredictions.filter(
    (pred) => pred.teamId === "cltcycmy80008dui0mmeiygp6"
  );

  const losers = matchPredictions
    .filter((pred) => !!pred.teamId && pred.teamId !== match.winnerId)
    .map((pred) =>
      pred.isDouble ? { ...pred, amount: pred.amount * 2 } : pred
    );

  const totalWon = winners.reduce((acc, b) => acc + b.amount, 0);
  let totalLost = losers.reduce((acc, b) => acc + b.amount, 0);
  if (totalWon > 0) {
    totalLost += defaulters.length * match.minStake;
  } else totalLost = defaulters.length * match.minStake;

  return (
    <pre className="mx-auto max-w-6xl w-full">
      {JSON.stringify(totalWon, null, 4)}
      {JSON.stringify(totalLost, null, 4)}
    </pre>
  );
};

export default TestPage;
