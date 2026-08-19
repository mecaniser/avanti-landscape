import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "@/components/AdminIcons";
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
      <p className="subtitle">All leads and customers in one place. Filter by status below.</p>

      <div className="customers-toolbar">
        <div className="customers-toolbar__pills">
          {["all", "lead", "active", "inactive"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/customers" : `/admin/customers?status=${s}`}
              className={`admin-btn admin-btn--ghost customers-toolbar__pill${
                (status ?? "all") === s ? " customers-toolbar__pill--active" : ""
              }`}
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
          <table className="admin-table admin-table--stacked">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>Service</th><th>Status</th><th>Added</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/customers/${c.id}`} className="customers-table__name">
                      {/* A small thumbnail beside the name, nested in this
                          existing cell rather than a new column: the mobile
                          stacked-card CSS maps columns by nth-child position,
                          and a 7th column would renumber every one of them. */}
                      {/* Even with no photo yet, an explicit placeholder (rather
                          than nothing) is what tells the client this list has a
                          photo feature at all — an empty slot reads as "there's
                          nothing here," not "you could add something here." */}
                      <span className="customers-table__thumb" aria-hidden="true">
                        {c.image ? (
                          <Image src={c.image} alt="" fill sizes="32px" style={{ objectFit: "cover" }} />
                        ) : (
                          <PlusIcon size={10} />
                        )}
                      </span>
                      {c.name}
                    </Link>
                  </td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.serviceType || "-"}</td>
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
