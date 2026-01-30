// Staff Profile Backend
"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getStaffProfile() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        return { success: false, message: "Not authenticated" };
    }

    const { id } = JSON.parse(userCookie);

    try {
        const user = await prisma.user.findUnique({
            where: { u_id: id },
            select: {
                u_id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        return { success: true, data: user };
    } catch (error) {
        return { success: false, message: "Failed to fetch profile" };
    }
}

export async function updateStaffProfile(name: string, email: string) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        return { success: false, message: "Not authenticated" };
    }

    const { id, role } = JSON.parse(userCookie);

    // Validate email
    if (!email.includes("@")) {
        return { success: false, message: "Email must contain @" };
    }

    // Validate name
    if (!name || name.trim().length === 0) {
        return { success: false, message: "Name is required" };
    }

    try {
        // Check if email is already used by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
                u_id: { not: id }
            }
        });

        if (existingUser) {
            return { success: false, message: "Email is already in use" };
        }

        await prisma.user.update({
            where: { u_id: id },
            data: {
                name: name.trim(),
                email: email.trim(),
            },
        });

        // Update cookies with new info (keep same format as login)
        const updatedUserCookie = JSON.stringify({
            id: id,
            email: email.trim(),
            role: role, // Keep the existing role
        });

        cookieStore.set("auth", "true", {
            httpOnly: true,
            path: "/",
        });

        cookieStore.set("user", updatedUserCookie, {
            httpOnly: true,
            path: "/",
        });

        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, message: "Failed to update profile" };
    }
}

export async function changePassword(oldPassword: string, newPassword: string) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        return { success: false, message: "Not authenticated" };
    }

    const { id } = JSON.parse(userCookie);

    // Validate new password
    if (newPassword.length < 8) {
        return { success: false, message: "Password must be at least 8 characters" };
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasLetter || !hasNumber) {
        return { success: false, message: "Password must contain both letters and numbers" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { u_id: id },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Verify old password (plain text comparison)
        if (oldPassword !== user.password) {
            return { success: false, message: "Current password is incorrect" };
        }

        // Update with new password (plain text)
        await prisma.user.update({
            where: { u_id: id },
            data: { password: newPassword },
        });

        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Change password error:", error);
        return { success: false, message: "Failed to change password" };
    }
}
