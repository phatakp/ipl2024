import { prisma } from ".";
import { loadHistory } from "./match-history";
import { loadMatches } from "./schedule";

const teamDetails = [
  { shortName: "CSK", longName: "Chennai SuperKings" },
  { shortName: "DC", longName: "Delhi Capitals" },
  { shortName: "GT", longName: "Gujarat Titans" },
  { shortName: "KKR", longName: "Kolkata KnightRiders" },
  { shortName: "LSG", longName: "Lucknow SuperGiants" },
  { shortName: "MI", longName: "Mumbai Indians" },
  { shortName: "PBKS", longName: "Punjab Kings" },
  { shortName: "RR", longName: "Rajasthan Royals" },
  { shortName: "RCB", longName: "Royal Challengers Bangalore" },
  { shortName: "SRH", longName: "Sunrisers Hyderabad" },
];

async function loadTeams() {
  await prisma.team.deleteMany();
  await prisma.team.createMany({
    data: teamDetails,
  });
}

async function main() {
  // await prisma.user.updateMany({ data: { doublesLeft: 5, balance: 0 } });
  await prisma.user.deleteMany();
  await loadTeams();
  console.log("Teams loaded");
  await loadMatches();
  console.log("Matches loaded");
  await loadHistory();
  console.log("History loaded");
  // await loadPredictions();
  // console.log("Data loaded");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
