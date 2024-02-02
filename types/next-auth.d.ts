import { ProfileInfo } from "@/types";
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    balance: number;
    profile: ProfileInfo;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profile: ProfileInfo;
      role: UserRole;
      balance: number;
    } & DefaultSession["user"];
  }
}
