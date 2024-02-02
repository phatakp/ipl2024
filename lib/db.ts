import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var _prisma: PrismaClient | undefined;
}

let _prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  _prisma = new PrismaClient();
} else {
  if (!global._prisma) {
    global._prisma = new PrismaClient();
  }
  _prisma = global._prisma;
}

export const prisma = _prisma;
