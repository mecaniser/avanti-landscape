import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateCustomer, deleteCustomer } from "../actions";
import CustomerRecord from "./CustomerRecord";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  return (
    <>
      <h2>{customer.name}</h2>
      <p className="subtitle">Added {customer.createdAt.toLocaleDateString()}</p>
      <CustomerRecord
        customer={{
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          serviceType: customer.serviceType,
          status: customer.status,
          message: customer.message,
          notes: customer.notes,
        }}
        updateAction={updateCustomer.bind(null, id)}
        deleteAction={deleteCustomer.bind(null, id)}
      />
    </>
  );
}
