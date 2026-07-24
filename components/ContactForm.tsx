"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

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
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div id="form-success">
        <h3 style={{ marginBottom: 10 }}>Thanks — we&apos;ve got it!</h3>
        <p>
          We&apos;ll be in touch shortly. For anything urgent, call or text us at{" "}
          <a href="tel:9803287141" style={{ color: "var(--dark-green-2)", fontWeight: 600 }}>980-328-7141</a>.
        </p>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="Jane Smith" required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" placeholder="(704) 555-0100" required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="you@email.com" required />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="address">Property Address</label>
          <input type="text" id="address" name="address" placeholder="City, NC" />
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
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} placeholder="Tell us a bit about your project or property..." />
      </div>
      {error && (
        <p style={{ color: "#b3261e", marginBottom: 12 }}>{error}</p>
      )}
      <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request a Free Quote"}
      </button>
    </form>
  );
}
