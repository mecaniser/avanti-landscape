import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { formatUsPhone, isValidUsPhone } from "@/lib/phone";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50).refine(isValidUsPhone).transform(formatUsPhone),
  email: z.string().trim().email().max(200),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const { name, phone, email, address, service, message } = parsed.data;

  const customer = await prisma.customer.create({
    data: {
      name,
      phone,
      email,
      address: address || null,
      serviceType: service || null,
      message: message || null,
      status: "lead",
    },
  });

  try {
    await sendLeadNotification({ name, phone, email, address, serviceType: service, message });
  } catch (err) {
    console.error("Failed to send lead notification email:", err);
    // The lead is already saved — don't fail the request over email delivery.
  }

  return NextResponse.json({ ok: true, id: customer.id });
}
