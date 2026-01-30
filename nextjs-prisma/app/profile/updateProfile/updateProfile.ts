//backend
"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

type UpdateProfileInput = {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};

export async function updateProfile(data: UpdateProfileInput) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;

  if (!userCookie) {
    throw new Error("Unauthorized");
  }

  const { id } = JSON.parse(userCookie);

  const user = await prisma.user.findUnique({
    where: { u_id: id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData: any = {};

  // change name / email
  if (data.name && data.name !== user.name) {
    updateData.name = data.name;
  }

  if (data.email && data.email !== user.email) {
    // server-side email validation
    if (!data.email.includes("@")) {
      throw new Error("Invalid email address");
    }
    updateData.email = data.email;
  }

  // change password
  if (data.oldPassword || data.newPassword) {
    if (!data.oldPassword || !data.newPassword) {
      throw new Error("Both old and new password are required");
    }

    if (data.oldPassword !== user.password) {
      throw new Error("Old password incorrect");
    }

    // server-side password rules: min 8 chars, must include letters and numbers
    if (data.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }
    const hasLetter = /[A-Za-z]/.test(data.newPassword);
    const hasNumber = /[0-9]/.test(data.newPassword);
    if (!hasLetter || !hasNumber) {
      throw new Error("New password must include both letters and numbers");
    }

    updateData.password = data.newPassword;
  }

  await prisma.user.update({
    where: { u_id: id },
    data: updateData,
  });

  return { success: true };
}
