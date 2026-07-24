import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateCustomer, deleteCustomer } from "../actions";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  const update = updateCustomer.bind(null, id);
  const del = deleteCustomer.bind(null, id);

  return (
    <>
      <h2>{customer.name}</h2>
      <p className="subtitle">Added {customer.createdAt.toLocaleDateString()}</p>

      <div className="admin-card">
        <form action={update} className="admin-form">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" defaultValue={customer.name} required />

          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" defaultValue={customer.phone ?? ""} />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" defaultValue={customer.email ?? ""} />

          <label htmlFor="address">Property Address</label>
          <input type="text" id="address" name="address" defaultValue={customer.address ?? ""} />

          <label htmlFor="serviceType">Service</label>
          <input type="text" id="serviceType" name="serviceType" defaultValue={customer.serviceType ?? ""} />

          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={customer.status}>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {customer.message && (
            <>
              <label>Original Message</label>
              <p className="subtitle" style={{ marginBottom: 16, whiteSpace: "pre-wrap" }}>{customer.message}</p>
            </>
          )}

          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={5} defaultValue={customer.notes ?? ""} />

          <button type="submit" className="admin-btn">Save Changes</button>
        </form>
      </div>

      <form action={del}>
        <button type="submit" className="admin-btn admin-btn--danger">Delete Customer</button>
      </form>
    </>
  );
}
