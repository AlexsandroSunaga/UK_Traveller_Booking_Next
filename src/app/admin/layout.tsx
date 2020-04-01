import "../booking.css";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="booking-app min-h-screen bg-slate-100">
      {session && <AdminSidebar />}
      <div className={session ? "lg:pl-64" : ""}>{children}</div>
    </div>
  );
}
