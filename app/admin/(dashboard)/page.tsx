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

      <div className="admin-stats">
        <div className="admin-card">
          <div className="subtitle admin-stats__label">New Leads</div>
          <div className="admin-stats__value">{leadCount}</div>
        </div>
        <div className="admin-card">
          <div className="subtitle admin-stats__label">Active Customers</div>
          <div className="admin-stats__value">{activeCount}</div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Recent Leads</h3>
        {recentLeads.length === 0 ? (
          <p className="subtitle">No new leads yet. Submissions from the contact form will show up here.</p>
        ) : (
          <div className="admin-table-scroll">
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
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <Link href="/admin/customers" className="admin-btn admin-btn--ghost">View All Customers</Link>
        </div>
      </div>
    </>
  );
}
