"use server";

import { NewUserType } from "@/app/(auth)/_zodSchema";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createUser(data: NewUserType) {
  const { email, password } = data;
  const hash = await bcrypt.hash(password, 10);

  try {
    const isExisting = await prisma.user.findUnique({
      where: { email },
    });
    if (isExisting) return { success: false, data: "Email already exists" };

    const user = await prisma.user.create({
      data: {
        email,
        password: { create: { hash } },
        profile: { create: {} },
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);

    return { success: false, data: "Error while creating user" };
  }
}
