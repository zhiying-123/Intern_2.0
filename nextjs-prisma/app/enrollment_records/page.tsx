import { getEnrollmentRecords } from "./getRecords";
import EnrollmentRecordsUI from "./recordsUI";

export default async function EnrollmentRecordsPage() {
    const records = await getEnrollmentRecords();

    if (!records) {
        return <div className="pt-32 text-center">Please log in to view your enrollment records</div>;
    }

    return <EnrollmentRecordsUI records={records} />;
}
