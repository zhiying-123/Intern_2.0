// Server: Fetch company events from database
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CompanyEvent {
    ce_id: number;
    event_name: string;
    event_date: Date;
    description: string | null;
    type: string;
}

export async function getCompanyEvents() {
    try {
        const events = await prisma.companyEvent.findMany({
            orderBy: { event_date: 'asc' }
        });
        return events;
    } catch (error) {
        console.error("Error fetching company events:", error);
        return [];
    }
}

export async function addCompanyEvent(formData: FormData) {
    try {
        const event_name = formData.get("event_name") as string;
        const event_date = formData.get("event_date") as string;
        const description = formData.get("description") as string;
        const type = formData.get("type") as string;

        await prisma.companyEvent.create({
            data: {
                event_name,
                event_date: new Date(event_date),
                description: description || null,
                type: type || "COMPANY"
            }
        });

        revalidatePath("/staff_dashboard/management/m_event");
        revalidatePath("/staff_dashboard/holidays");
        return { success: true };
    } catch (error) {
        console.error("Error adding event:", error);
        return { success: false, error: "Failed to add event" };
    }
}

export async function deleteCompanyEvent(ce_id: number) {
    try {
        await prisma.companyEvent.delete({
            where: { ce_id }
        });

        revalidatePath("/staff_dashboard/management/m_event");
        revalidatePath("/staff_dashboard/holidays");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}
