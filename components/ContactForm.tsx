"use client";

import { useState } from "react";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<string, string>): Errors {
  const errors: Errors = {};

  const name = (data.name ?? "").trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";

  const phone = (data.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Please enter a phone number.";
  else if (digits.length < 10) errors.phone = "Enter a valid phone number (at least 10 digits).";

  const email = (data.email ?? "").trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const message = (data.message ?? "").trim();
  if (message && message.length > 3000) errors.message = "Please keep your message under 3000 characters.";

  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function clearFieldError(field: keyof Errors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = form.querySelector<HTMLElement>(".invalid");
      first?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please call or text us instead.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div id="form-success">
        <h3 style={{ marginBottom: 10 }}>Thanks — we&apos;ve got it!</h3>
        <p>
          We&apos;ll be in touch shortly. For anything urgent, call or text us at{" "}
          <a href="tel:9803287141" style={{ color: "var(--olive-light)", fontWeight: 600 }}>980-328-7141</a>.
        </p>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="form-alert form-alert--error" role="alert">{submitError}</div>
      )}
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Jane Smith"
            autoComplete="name"
            className={errors.name ? "invalid" : undefined}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={() => clearFieldError("name")}
          />
          {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(704) 555-0100"
            autoComplete="tel"
            className={errors.phone ? "invalid" : undefined}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onChange={() => clearFieldError("phone")}
          />
          {errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@email.com"
          autoComplete="email"
          className={errors.email ? "invalid" : undefined}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={() => clearFieldError("email")}
        />
        {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="address">Property Address <span style={{ color: "var(--text-soft)", fontWeight: 400 }}>(optional)</span></label>
          <input type="text" id="address" name="address" placeholder="City, NC" autoComplete="street-address" />
        </div>
        <div className="form-field">
          <label htmlFor="service">Service Needed</label>
          <select id="service" name="service" defaultValue="Lawn Care">
            <option>Lawn Care</option>
            <option>Landscaping</option>
            <option>Hardscaping</option>
            <option>Lawn &amp; Landscape Maintenance</option>
            <option>Not Sure / Other</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">Message <span style={{ color: "var(--text-soft)", fontWeight: 400 }}>(optional)</span></label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us a bit about your project or property..."
          className={errors.message ? "invalid" : undefined}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={() => clearFieldError("message")}
        />
        {errors.message && <span className="field-error" id="message-error">{errors.message}</span>}
      </div>
      <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request a Free Quote"}
      </button>
    </form>
  );
}
