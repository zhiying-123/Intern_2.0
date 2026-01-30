import { getProfile } from "./profile";
import ProfileUI from "./profileUI";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getProfile();

  if (!user) redirect("/login");

  return <ProfileUI user={user} />;
}
