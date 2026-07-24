"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function refresh() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function updateService(id: string, formData: FormData) {
  await prisma.service.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
    },
  });
  refresh();
}

export async function addService(formData: FormData) {
  const category = String(formData.get("category") || "lawn-care");
  const count = await prisma.service.count({ where: { category } });
  await prisma.service.create({
    data: {
      category,
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      sortOrder: count,
    },
  });
  refresh();
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  refresh();
}
