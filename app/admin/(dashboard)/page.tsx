import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatUpdatedAt } from "@/lib/format";

export const dynamic = "force-dynamic";

const ACTIVITY_SECTIONS = [
  { label: "Page Content", href: "/admin/content/home" },
  { label: "Services", href: "/admin/services" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Customers", href: "/admin/customers" },
] as const;

export default async function AdminOverviewPage() {
  const [
    leadCount,
    activeCount,
    recentLeads,
    contentMax,
    serviceMax,
    galleryImageMax,
    beforeAfterMax,
    blogMax,
    customerMax,
  ] = await Promise.all([
    prisma.customer.count({ where: { status: "lead" } }),
    prisma.customer.count({ where: { status: "active" } }),
    prisma.customer.findMany({ where: { status: "lead" }, orderBy: { createdAt: "desc" }, take: 5 }),
    // One aggregate per section rather than fetching full rows: Overview
    // only needs the single latest timestamp, not the records themselves.
    prisma.contentBlock.aggregate({ _max: { updatedAt: true } }),
    prisma.service.aggregate({ _max: { updatedAt: true } }),
    prisma.galleryImage.aggregate({ _max: { updatedAt: true } }),
    prisma.beforeAfterProject.aggregate({ _max: { updatedAt: true } }),
    prisma.blogPost.aggregate({ _max: { updatedAt: true } }),
    prisma.customer.aggregate({ _max: { updatedAt: true } }),
  ]);
  // Gallery admin shows photo-grid images and before/after projects on one
  // screen, so its activity timestamp is whichever of the two is newer.
  const galleryMax =
    !galleryImageMax._max.updatedAt || (beforeAfterMax._max.updatedAt && beforeAfterMax._max.updatedAt > galleryImageMax._max.updatedAt)
      ? beforeAfterMax._max.updatedAt
      : galleryImageMax._max.updatedAt;
  const activityByLabel: Record<(typeof ACTIVITY_SECTIONS)[number]["label"], Date | null> = {
    "Page Content": contentMax._max.updatedAt,
    Services: serviceMax._max.updatedAt,
    Gallery: galleryMax,
    Blog: blogMax._max.updatedAt,
    // Includes a brand-new lead coming in, not just an edit to an existing
    // customer — consistent with every other section here, where adding a
    // new item counts as activity the same as editing one.
    Customers: customerMax._max.updatedAt,
  };

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

      <div className="admin-card admin-activity">
        <h3 style={{ marginBottom: 12 }}>Recent Activity</h3>
        <ul className="admin-activity__list">
          {ACTIVITY_SECTIONS.map((section) => {
            const updatedAt = activityByLabel[section.label];
            return (
              <li key={section.label}>
                <Link href={section.href}>{section.label}</Link>
                <span className="admin-activity__timestamp">
                  {updatedAt ? `Updated ${formatUpdatedAt(updatedAt)}` : "No edits yet"}
                </span>
              </li>
            );
          })}
        </ul>
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
