import CalendarUI from "./calendarUI";
import { fetchMalaysiaHolidays } from "./holidays";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

interface PageProps {
    searchParams: Promise<{ year?: string }>;
}

async function getCurrentUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    if (!userCookie) return null;
    const user = JSON.parse(userCookie);
    return user.id;
}

export default async function HolidaysPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();

    let publicHolidays = [] as any[];
    let companyEvents = [] as any[];
    let userTodos = [] as any[];

    try {
        // Fetch public holidays from API
        publicHolidays = await fetchMalaysiaHolidays(year);

        // Fetch company events from database for this year
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59);

        const events = await prisma.companyEvent.findMany({
            where: {
                event_date: {
                    gte: yearStart,
                    lte: yearEnd
                }
            }
        });

        // Convert company events to Holiday format
        companyEvents = events.map(e => ({
            date: e.event_date.toISOString().split('T')[0],
            name: e.event_name,
            localName: e.description || e.event_name,
            type: e.type.toLowerCase() as 'company' | 'observance'
        }));

        // Fetch user's personal todos
        const userId = await getCurrentUserId();
        if (userId) {
            const todos = await prisma.todoItem.findMany({
                where: {
                    u_id: userId,
                    due_date: {
                        not: null
                    }
                },
                orderBy: [
                    { due_date: 'asc' },
                ],
            });
            userTodos = todos;
        }
    } catch (e) {
        console.error("Failed to load calendar data:", e);
    }

    // Combine public holidays and company events
    const allHolidays = [...publicHolidays, ...companyEvents];

    return (
        <CalendarUI
            holidays={allHolidays}
            year={year}
            todos={userTodos}
        />
    );
}
