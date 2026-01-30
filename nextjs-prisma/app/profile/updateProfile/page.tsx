import { getProfile } from "../profile";
import UpdateProfileForm from "./updateProfileForm";
import { redirect } from "next/navigation";

export default async function UpdateProfilePage() {
    const user = await getProfile();

    if (!user) redirect("/login");

    return <UpdateProfileForm user={user} />;
}
