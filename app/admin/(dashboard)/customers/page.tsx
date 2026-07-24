import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = { lead: "Lead", active: "Active", inactive: "Inactive" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && status !== "all" ? { status: status as "lead" | "active" | "inactive" } : {};

  const customers = await prisma.customer.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h2>Customers</h2>
      <p className="subtitle">All leads and customers in one place — filter by status below.</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "lead", "active", "inactive"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/customers" : `/admin/customers?status=${s}`}
              className="admin-btn admin-btn--ghost"
              style={{
                padding: "6px 14px",
                fontSize: "0.85rem",
                background: (status ?? "all") === s ? "var(--dark-green, #345126)" : "transparent",
                color: (status ?? "all") === s ? "#fff" : undefined,
              }}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
        <Link href="/admin/customers/new" className="admin-btn">+ Add Customer</Link>
      </div>

      <div className="admin-card">
        {customers.length === 0 ? (
          <p className="subtitle">No customers here yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>Service</th><th>Status</th><th>Added</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/admin/customers/${c.id}`}>{c.name}</Link></td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.serviceType || "—"}</td>
                  <td><span className={`admin-badge admin-badge--${c.status}`}>{STATUS_LABELS[c.status]}</span></td>
                  <td>{c.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
