import { prisma } from "@/lib/db";

const TestPage = async () => {
  const doubles = await prisma.prediction.findMany({
    where: { isDouble: true },
    include: { match: true, team: true, user: true },
  });
  const summary = doubles.map((d) => ({
    match: d.match?.num,
    user: d.user.name,
    team: d.team?.shortName,
  }));
  return (
    <pre className="mx-auto max-w-7xl w-full">
      {JSON.stringify(summary, null, 4)}
    </pre>
  );
};

export default TestPage;
