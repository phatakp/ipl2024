import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { password: true },
        });

        if (!user || !user?.password) return null;

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password.hash
        );

        if (!isCorrectPassword) return null;

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async createUser({ user }) {
      const { name } = user;
      let firstName = "";
      let lastName = "";
      if (!!name) {
        [firstName, lastName] = name.split(" ");
      }
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        create: { firstName, lastName, userId: user.id },
        update: { firstName, lastName },
      });
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.profile = token.profile;
        session.user.balance = token.balance;
        session.user.role = token.role;
        session.user.doublesLeft = token.doublesLeft;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
        include: {
          profile: {
            include: {
              team: { select: { id: true, shortName: true, longName: true } },
            },
          },
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name as string,
        email: dbUser.email,
        picture: dbUser.image,
        profile: dbUser.profile,
        balance: dbUser.balance,
        role: dbUser.role,
        doublesLeft: dbUser.doublesLeft,
      } as JWT;
    },
  },
};

export const getAuthServerSession = () => getServerSession(authOptions);
