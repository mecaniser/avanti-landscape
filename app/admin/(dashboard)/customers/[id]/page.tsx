import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatUpdatedAt } from "@/lib/format";
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
  // @updatedAt stamps updatedAt equal to createdAt on the row's initial
  // insert, so a lead nobody has touched yet would otherwise show "Added
  // Aug 17 · Last updated Aug 17" — two identical facts stated as if they
  // were two different ones. Only show the second once it's true.
  const wasEdited = customer.updatedAt.getTime() !== customer.createdAt.getTime();

  return (
    <>
      <h2>{customer.name}</h2>
      <p className="subtitle">
        Added {customer.createdAt.toLocaleDateString()}
        {wasEdited && <> · Last updated {formatUpdatedAt(customer.updatedAt)}</>}
      </p>
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
