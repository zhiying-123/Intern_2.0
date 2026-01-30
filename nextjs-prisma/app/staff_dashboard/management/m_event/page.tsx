import EventManagementUI from "./m_eventUI";
import { getCompanyEvents } from "./m_event";

export default async function EventManagementPage() {
    let events = [] as any[];

    try {
        events = await getCompanyEvents();
    } catch (e) {
        console.error("Failed to load events:", e);
        events = [];
    }

    return <EventManagementUI events={events} />;
}
