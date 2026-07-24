import Link from "next/link";
import { signOut } from "@/auth";
import "../admin.css";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/content/home", label: "Page Content" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/account", label: "Account" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Avanti Admin</h1>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
        <Link href="/" target="_blank" rel="noopener" className="admin-view-site">
          View Website ↗
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
