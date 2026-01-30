import HolidaysUI from "./holidaysUI";
import { fetchMalaysiaHolidays } from "./holidays";
import prisma from "@/lib/prisma";

interface PageProps {
    searchParams: Promise<{ year?: string }>;
}

export default async function HolidaysPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();

    let publicHolidays = [] as any[];
    let companyEvents = [] as any[];

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
    } catch (e) {
        console.error("Failed to load holidays:", e);
    }

    // Combine public holidays and company events
    const allHolidays = [...publicHolidays, ...companyEvents];

    return (
        <HolidaysUI
            holidays={allHolidays}
            year={year}
        />
    );
}
