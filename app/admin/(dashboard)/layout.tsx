import { signOut } from "@/auth";
import AdminNav from "./AdminNav";
import "../admin.css";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="admin-shell">
      <AdminNav signOutAction={signOutAction} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
