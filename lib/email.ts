import { Resend } from "resend";

let client: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendLeadNotification(lead: {
  name: string;
  phone: string;
  email: string;
  address?: string | null;
  serviceType?: string | null;
  message?: string | null;
}) {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const resend = getClient();

  if (!resend || !to) {
    // The lead is persisted by the contact route. Do not write customer PII
    // to provider logs when notification delivery is intentionally disabled.
    console.warn("[email] Lead notification skipped: Resend is not configured.");
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.LEAD_NOTIFICATION_FROM ?? "Avanti Landscaping Website <onboarding@resend.dev>",
    to,
    replyTo: lead.email,
    subject: `New quote request from ${lead.name}`,
    text: [
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Address: ${lead.address || "-"}`,
      `Service: ${lead.serviceType || "-"}`,
      "",
      "Message:",
      lead.message || "-",
    ].join("\n"),
  });

  // Resend reports API failures: bad key, unverified sender domain, rate
  // limit: by returning an `error` object, not by throwing. Without this
  // check a rejected send looks identical to a delivered one, and quote
  // requests stop arriving with nothing in the logs to say why.
  if (error) {
    throw new Error(`Resend rejected the lead notification (${error.name}): ${error.message}`);
  }

  return { skipped: false, id: data?.id };
}
