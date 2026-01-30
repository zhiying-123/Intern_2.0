// /profile/deleteAK/page.tsx
import DeleteAKUI from "./deleteAKUI";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DeleteAccountPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        redirect("/login");
    }

    const { id } = JSON.parse(userCookie);

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
        redirect("/login");
    }

    return <DeleteAKUI user={user} />;
}
