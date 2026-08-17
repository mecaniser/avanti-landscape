"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { TAGS } from "@/lib/content";

export type ServiceActionState = { ok?: boolean; error?: string; message?: string };

function refresh() {
  updateTag(TAGS.services);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function updateService(id: string, _previousState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!name || !description) return { error: "Add both a service name and a short description." };

  try {
    await prisma.service.update({ where: { id }, data: { name, description } });
    refresh();
    return { ok: true, message: "Service changes saved." };
  } catch {
    return { error: "The service could not be saved. Please try again." };
  }
}

export async function addService(_previousState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  const category = String(formData.get("category") || "lawn-care");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!name || !description) return { error: "Add both a service name and a short description." };

  try {
    const count = await prisma.service.count({ where: { category } });
    await prisma.service.create({ data: { category, name, description, sortOrder: count } });
    refresh();
    return { ok: true, message: "Service added." };
  } catch {
    return { error: "The service could not be added. Please try again." };
  }
}

export async function deleteService(id: string, _previousState: ServiceActionState, _formData: FormData): Promise<ServiceActionState> {
  try {
    await prisma.service.delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch {
    return { error: "The service could not be deleted. Please try again." };
  }
}
