import { MatchStatus } from "@prisma/client";
import { prisma } from ".";

export async function loadPredictions() {
  const users = await prisma.user.findMany();
  const matches = await prisma.match.findMany({
    where: { status: MatchStatus.SCHEDULED },
  });

  let data = [] as any[];
  matches.forEach((match) => {
    users.forEach((user) => {
      if (match.team1Id && match.team2Id) {
        const teamId = [match.team1Id, match.team2Id][
          Math.floor(Math.random() * 2)
        ];
        const amount = [50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 6)];
        data.push({
          teamId,
          userId: user.id,
          matchId: match.id,
          amount,
          isDouble: false,
        });
      }
    });
  });
  data = data.filter((item, i) => ![3, 17, 31, 47, 60, 79].includes(i)); // removing random predictions for default bets
  await prisma.prediction.deleteMany({ where: { NOT: { amount: 500 } } });
  await prisma.prediction.createMany({ data });
}
