import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient adminEmail={session.email} />;
}
