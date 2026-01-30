//backend
"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getProfile() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;

  if (!userCookie) return null;

  const { id } = JSON.parse(userCookie);

  return prisma.user.findUnique({
    where: { u_id: id },
    select: {
      u_id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
