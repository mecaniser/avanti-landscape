import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [leadCount, activeCount, recentLeads] = await Promise.all([
    prisma.customer.count({ where: { status: "lead" } }),
    prisma.customer.count({ where: { status: "active" } }),
    prisma.customer.findMany({ where: { status: "lead" }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <>
      <h2>Overview</h2>
      <p className="subtitle">Quick snapshot of leads and shortcuts to manage the site.</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="subtitle" style={{ marginBottom: 4 }}>New Leads</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{leadCount}</div>
        </div>
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="subtitle" style={{ marginBottom: 4 }}>Active Customers</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{activeCount}</div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Recent Leads</h3>
        {recentLeads.length === 0 ? (
          <p className="subtitle">No new leads yet. Submissions from the contact form will show up here.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Service</th><th>Submitted</th></tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td><Link href={`/admin/customers/${lead.id}`}>{lead.name}</Link></td>
                  <td>{lead.phone}</td>
                  <td>{lead.serviceType || "-"}</td>
                  <td>{lead.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 16 }}>
          <Link href="/admin/customers" className="admin-btn admin-btn--ghost">View All Customers</Link>
        </div>
      </div>
    </>
  );
}
