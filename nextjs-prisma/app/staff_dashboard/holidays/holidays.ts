// Server: fetch Malaysia holidays from Calendarific API

interface CalendarificHoliday {
    name: string;
    description: string;
    date: { iso: string };
    primary_type: string;
}

interface CalendarificResponse {
    meta: { code: number };
    response: { holidays: CalendarificHoliday[] };
}

export interface Holiday {
    date: string;
    name: string;
    localName: string;
    type: 'public' | 'company' | 'observance';
}

// Fetch Malaysia public holidays from Calendarific API
export async function fetchMalaysiaHolidays(year: number): Promise<Holiday[]> {
    const apiKey = process.env.CALENDARIFIC_API_KEY;
    if (!apiKey) throw new Error("Missing CALENDARIFIC_API_KEY in environment");

    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=MY&year=${year}`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 1 day

    if (!res.ok) {
        console.error(`Failed to fetch holidays for ${year}: ${res.status}`);
        return [];
    }

    const data: CalendarificResponse = await res.json();

    if (data.meta.code !== 200 || !data.response.holidays) {
        console.error("API error:", data.meta);
        return [];
    }

    // Filter to show only Federal Public Holidays
    return data.response.holidays
        .filter(h => h.primary_type === 'Federal Public Holiday')
        .map(h => ({
            date: h.date.iso.split('T')[0],
            name: h.name,
            localName: h.description.substring(0, 50) + (h.description.length > 50 ? '...' : ''),
            type: 'public' as const
        }));
}

// Company holidays (these are still hardcoded since they're company-specific)
export function getCompanyHolidays(year: number): Holiday[] {
    if (year === 2026) {
        return [
            { date: "2026-02-02", name: "Company Annual Dinner", localName: "公司年夜饭", type: "company" },
            { date: "2026-12-31", name: "New Year's Eve (Half Day)", localName: "除夕（半天）", type: "company" },
        ];
    }
    return [];
}
