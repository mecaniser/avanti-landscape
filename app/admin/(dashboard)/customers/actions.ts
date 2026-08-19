"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatUsPhone } from "@/lib/phone";

export async function updateCustomer(id: string, formData: FormData) {
  const status = String(formData.get("status") || "lead");
  await prisma.customer.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      phone: formatUsPhone(String(formData.get("phone") || "")) || null,
      email: String(formData.get("email") || "") || null,
      address: String(formData.get("address") || "") || null,
      serviceType: String(formData.get("serviceType") || "") || null,
      status: status as "lead" | "active" | "inactive",
      notes: String(formData.get("notes") || "") || null,
    },
  });
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
}

export async function createCustomer(formData: FormData) {
  const customer = await prisma.customer.create({
    data: {
      name: String(formData.get("name") || ""),
      phone: formatUsPhone(String(formData.get("phone") || "")) || null,
      email: String(formData.get("email") || "") || null,
      address: String(formData.get("address") || "") || null,
      serviceType: String(formData.get("serviceType") || "") || null,
      status: (String(formData.get("status") || "active")) as "lead" | "active" | "inactive",
      notes: String(formData.get("notes") || "") || null,
    },
  });
  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customer.id}`);
}

export async function removeCustomerImage(id: string) {
  await prisma.customer.update({ where: { id }, data: { image: null } });
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}
