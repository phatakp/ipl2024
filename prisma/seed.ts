import { PrismaClient } from "@prisma/client";
import { loadHistory } from "./scrape";
import { loadPredictions } from "./temp-predictions";
const prisma = new PrismaClient();

const teamDetails = [
  { shortName: "CSK", longName: "Chennai Super Kings" },
  { shortName: "DC", longName: "Delhi Capitals" },
  { shortName: "GT", longName: "Gujarat Titans" },
  { shortName: "KKR", longName: "Kolkata Knight Riders" },
  { shortName: "LSG", longName: "Lucknow Super Giants" },
  { shortName: "MI", longName: "Mumbai Indians" },
  { shortName: "PBKS", longName: "Punjab Kings" },
  { shortName: "RR", longName: "Rajasthan Royals" },
  { shortName: "RCB", longName: "Royal Challengers Bangalore" },
  { shortName: "SRH", longName: "Sunrisers Hyderabad" },
];

async function loadTeams() {
  await prisma.team.createMany({
    data: teamDetails,
  });
}

async function main() {
  // await loadTeams();
  await loadHistory();
  await loadPredictions();
  console.log("Data loaded");
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
