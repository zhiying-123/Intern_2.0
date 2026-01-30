// backend
"use server";

import prisma from "@/lib/prisma";

export async function registerRequest(email: string, name: string, password: string) {
    // basic validation
    if (!email || !name || !password) {
        return { success: false, message: "Please provide name, email and password." };
    }

    if (password.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long." };
    }

    const re = /(?=.*[A-Za-z])(?=.*\d)/;
    if (!re.test(password)) {
        return { success: false, message: "Password must contain both letters and numbers." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { success: false, message: "Email already registered. Please login." };
    }

    const user = await prisma.user.create({ data: { email, name, password } });

    return { success: true, user: { id: user.u_id, email: user.email } };
}
