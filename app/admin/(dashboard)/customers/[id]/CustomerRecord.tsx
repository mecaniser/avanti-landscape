"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "../../SubmitButton";
import { formatUsPhone } from "@/lib/phone";

type Customer = {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  serviceType: string | null;
  status: "lead" | "active" | "inactive";
  message: string | null;
  notes: string | null;
};

type SaveState = "idle" | "saving" | "saved" | "error";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="customer-record__fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function CustomerRecord({
  customer,
  updateAction,
  deleteAction,
}: {
  customer: Customer;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  async function saveCustomer(formData: FormData) {
    setSaveState("saving");
    setSaveError(null);

    try {
      await updateAction(formData);
      setSaveState("saved");
      router.refresh();
    } catch {
      setSaveState("error");
      setSaveError("Changes could not be saved. Please try again.");
    }
  }

  function openEditor() {
    setSaveState("idle");
    setSaveError(null);
    setEditing(true);
  }

  function closeEditor() {
    setSaveState("idle");
    setSaveError(null);
    setEditing(false);
  }

  return (
    <section className="customer-record" aria-label={`${customer.name} customer record`}>
      {!editing ? (
        <>
          <div className="customer-record__summary-head">
            <div>
              <p className="customer-record__label">Customer details</p>
              <p className="customer-record__hint">Review the submitted information, then edit when the lead is ready to be updated.</p>
            </div>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={openEditor}>Edit details</button>
          </div>

          <dl className="customer-record__facts">
            <Fact label="Full name">{customer.name}</Fact>
            <Fact label="Status"><span className={`admin-badge admin-badge--${customer.status}`}>{customer.status}</span></Fact>
            <Fact label="Phone">
              {customer.phone ? <a href={phoneHref(customer.phone)}>{customer.phone}</a> : "—"}
            </Fact>
            <Fact label="Email">
              {customer.email ? <a href={`mailto:${customer.email}`}>{customer.email}</a> : "—"}
            </Fact>
            <Fact label="Property address">{customer.address || "—"}</Fact>
            <Fact label="Requested service">{customer.serviceType || "—"}</Fact>
          </dl>

          {customer.message && (
            <div className="customer-record__message">
              <h3>Original request</h3>
              <p>{customer.message}</p>
            </div>
          )}

          {customer.notes && (
            <div className="customer-record__message customer-record__message--notes">
              <h3>Internal notes</h3>
              <p>{customer.notes}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="customer-record__summary-head">
            <div>
              <p className="customer-record__label">Edit customer details</p>
              <p className="customer-record__hint">The original request remains preserved below.</p>
            </div>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={closeEditor}>Cancel</button>
          </div>

          <form action={saveCustomer} className="admin-form customer-record__form" onChange={() => setSaveState("idle")}>
            <div className="content-grid-2">
              <div>
                <label htmlFor="name">Full name</label>
                <input type="text" id="name" name="name" defaultValue={customer.name} required />
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={customer.status}>
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={formatUsPhone(customer.phone ?? "")}
                  inputMode="numeric"
                  maxLength={14}
                  onChange={(event) => { event.currentTarget.value = formatUsPhone(event.currentTarget.value); }}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" defaultValue={customer.email ?? ""} />
              </div>
              <div>
                <label htmlFor="address">Property address</label>
                <input type="text" id="address" name="address" defaultValue={customer.address ?? ""} />
              </div>
              <div>
                <label htmlFor="serviceType">Requested service</label>
                <input type="text" id="serviceType" name="serviceType" defaultValue={customer.serviceType ?? ""} />
              </div>
            </div>

            <label htmlFor="notes">Internal notes</label>
            <textarea id="notes" name="notes" rows={5} defaultValue={customer.notes ?? ""} />

            <div className="customer-record__actions">
              <button type="submit" className="admin-btn" disabled={saveState === "saving"} aria-busy={saveState === "saving"}>
                {saveState === "saving" && <span className="admin-spinner" aria-hidden="true" />}
                {saveState === "saving" ? "Saving changes…" : "Save changes"}
              </button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeEditor} disabled={saveState === "saving"}>Cancel</button>
            </div>

            <p className={`customer-record__save-status${saveState === "error" ? " customer-record__save-status--error" : ""}`} role="status" aria-live="polite">
              {saveState === "saving" && "Saving your changes…"}
              {saveState === "saved" && "Changes saved."}
              {saveState === "error" && saveError}
            </p>
          </form>

          {customer.message && (
            <div className="customer-record__message">
              <h3>Original request</h3>
              <p>{customer.message}</p>
            </div>
          )}

          <form action={deleteAction} className="customer-record__delete">
            <div>
              <strong>Remove this customer</strong>
              <p>This permanently removes this lead and its notes.</p>
            </div>
            <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Deleting customer…">Delete customer</SubmitButton>
          </form>
        </>
      )}
    </section>
  );
}
