import { Resend } from "resend";
import { phoneDigits } from "@/lib/phone";

let client: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

type Lead = {
  name: string;
  phone: string;
  email: string;
  address?: string | null;
  serviceType?: string | null;
  message?: string | null;
};

// Lead fields are visitor-supplied and go into an HTML document, so every
// interpolated value must be escaped to keep the email from being an injection
// vector.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const COLORS = {
  page: "#0b0d05",
  card: "#171a0f",
  header: "#0e1207",
  line: "#333825",
  text: "#e8ebdd",
  soft: "#a3a992",
  heading: "#ffffff",
  olive: "#b3d15a",
  gold: "#eeb93d",
};

const BODY_FONT = "'Inter','Segoe UI',Helvetica,Arial,sans-serif";
const HEAD_FONT = "'Poppins','Segoe UI',Helvetica,Arial,sans-serif";

function detailRow(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.line};font-family:${BODY_FONT};font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.soft};width:110px;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.line};font-family:${BODY_FONT};font-size:15px;color:${COLORS.text};vertical-align:top;">${valueHtml}</td>
    </tr>`;
}

function renderLeadEmailText(lead: Lead) {
  return [
    `New quote request from ${lead.name}`,
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Address: ${lead.address || "-"}`,
    `Service: ${lead.serviceType || "-"}`,
    "",
    "Message:",
    lead.message || "-",
    "",
    "Sent from the avantilandscapingnc.com contact form.",
  ].join("\n");
}

export function renderLeadEmailHtml(lead: Lead) {
  const name = escapeHtml(lead.name);
  const phone = escapeHtml(lead.phone);
  const tel = phoneDigits(lead.phone);
  const email = escapeHtml(lead.email);
  const address = lead.address ? escapeHtml(lead.address) : null;
  const service = lead.serviceType ? escapeHtml(lead.serviceType) : null;
  const message = lead.message ? escapeHtml(lead.message).replace(/\n/g, "<br>") : null;
  const firstName = name.split(" ")[0] || name;

  const submittedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">New quote request from ${name}${service ? ` — ${service}` : ""}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};padding:24px 12px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.card};border:1px solid ${COLORS.line};border-radius:14px;overflow:hidden;">
        <!-- header -->
        <tr>
          <td style="background:${COLORS.header};padding:22px 28px;border-bottom:2px solid ${COLORS.gold};">
            <div style="font-family:${HEAD_FONT};font-size:19px;font-weight:700;color:${COLORS.heading};letter-spacing:0.01em;">Avanti Landscaping</div>
            <div style="font-family:${HEAD_FONT};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${COLORS.olive};margin-top:3px;">Lawn &amp; Landscape Co.</div>
          </td>
        </tr>
        <!-- title -->
        <tr>
          <td style="padding:26px 28px 6px;">
            <div style="font-family:${HEAD_FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.gold};">New Quote Request</div>
            <div style="font-family:${HEAD_FONT};font-size:24px;font-weight:700;color:${COLORS.heading};margin-top:6px;">${name}</div>
            <div style="font-family:${BODY_FONT};font-size:14px;color:${COLORS.soft};margin-top:6px;">A new lead just came in through your website contact form.</div>
          </td>
        </tr>
        <!-- details -->
        <tr>
          <td style="padding:14px 28px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("Phone", `<a href="tel:${tel}" style="color:${COLORS.olive};text-decoration:none;font-weight:600;">${phone}</a>`)}
              ${detailRow("Email", `<a href="mailto:${email}" style="color:${COLORS.olive};text-decoration:none;font-weight:600;">${email}</a>`)}
              ${address ? detailRow("Address", address) : ""}
              ${service ? detailRow("Service", `<span style="display:inline-block;background:rgba(139,174,60,0.16);color:${COLORS.olive};font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;">${service}</span>`) : ""}
            </table>
          </td>
        </tr>
        ${message ? `
        <!-- message -->
        <tr>
          <td style="padding:18px 28px 4px;">
            <div style="font-family:${BODY_FONT};font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.soft};margin-bottom:8px;">Message</div>
            <div style="font-family:${BODY_FONT};font-size:15px;line-height:1.55;color:${COLORS.text};background:#202415;border:1px solid ${COLORS.line};border-left:3px solid ${COLORS.olive};border-radius:8px;padding:14px 16px;">${message}</div>
          </td>
        </tr>` : ""}
        <!-- actions -->
        <tr>
          <td style="padding:22px 28px 6px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:10px;">
                  <a href="tel:${tel}" style="display:inline-block;background:${COLORS.gold};color:#241c04;font-family:${HEAD_FONT};font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">Call ${phone}</a>
                </td>
                <td>
                  <a href="mailto:${email}" style="display:inline-block;background:transparent;color:${COLORS.olive};border:1px solid ${COLORS.line};font-family:${HEAD_FONT};font-size:14px;font-weight:700;text-decoration:none;padding:11px 22px;border-radius:8px;">Email ${firstName}</a>
                </td>
              </tr>
            </table>
            <div style="font-family:${BODY_FONT};font-size:12px;color:${COLORS.soft};margin-top:12px;">You can also just reply to this email — it goes straight to ${firstName}.</div>
          </td>
        </tr>
        <!-- footer -->
        <tr>
          <td style="padding:22px 28px;border-top:1px solid ${COLORS.line};">
            <div style="font-family:${BODY_FONT};font-size:12px;color:${COLORS.soft};">Sent from the <a href="https://www.avantilandscapingnc.com/contact" style="color:${COLORS.olive};text-decoration:none;">avantilandscapingnc.com</a> contact form · ${submittedAt} ET</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export async function sendLeadNotification(lead: Lead) {
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
    html: renderLeadEmailHtml(lead),
    text: renderLeadEmailText(lead),
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
