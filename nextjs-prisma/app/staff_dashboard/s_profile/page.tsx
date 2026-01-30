// Staff Profile Page
import { getStaffProfile } from "./s_profile";
import StaffProfileUI from "./s_profileUI";
import { redirect } from "next/navigation";

export default async function StaffProfilePage() {
    const result = await getStaffProfile();

    if (!result.success || !result.data) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <StaffProfileUI user={result.data} />
        </div>
    );
}
