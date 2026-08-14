"use client";

import { useActionState, useState } from "react";
import { formatUsPhone } from "@/lib/phone";
import PasswordField from "@/components/PasswordField";
import {
  changePassword,
  updateBusinessSettings,
  type BusinessSettingsState,
  type ChangePwState,
} from "./actions";

const passwordInitial: ChangePwState = {};
const businessInitial: BusinessSettingsState = {};

export default function AccountSettings({
  settings,
}: {
  settings: {
    phone: string;
    email: string;
    hours: string;
    facebookUrl: string;
    instagramUrl: string;
  };
}) {
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, passwordInitial);
  const [businessState, businessAction, businessPending] = useActionState(updateBusinessSettings, businessInitial);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  return (
    <section className="account-settings">
      <h2>Account</h2>
      <p className="subtitle">Manage the public business information customers use, then keep your admin access secure.</p>

      <section className="admin-card account-settings__business" aria-labelledby="business-settings-heading">
        <div className="account-settings__heading">
          <div>
            <h3 id="business-settings-heading">Business settings</h3>
            <p>These details appear across the website’s header, footer, contact page, and social links.</p>
          </div>
          {!isEditingBusiness && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setIsEditingBusiness(true)}>
              Edit business settings
            </button>
          )}
        </div>

        {businessState.ok && (
          <div className="admin-flash admin-flash--success" role="status">
            Business settings saved. The public site will use the updated details.
          </div>
        )}
        {businessState.error && (
          <div className="admin-flash admin-flash--error" role="alert">{businessState.error}</div>
        )}

        {isEditingBusiness ? (
          <form action={businessAction} className="admin-form account-settings__business-form">
            <div className="content-grid-2">
              <div>
                <label htmlFor="business-phone">Public phone number</label>
                <input
                  type="tel"
                  id="business-phone"
                  name="phone"
                  defaultValue={formatUsPhone(settings.phone)}
                  inputMode="numeric"
                  maxLength={14}
                  onChange={(event) => { event.currentTarget.value = formatUsPhone(event.currentTarget.value); }}
                  required
                />
              </div>
              <div>
                <label htmlFor="business-email">Public email address</label>
                <input type="email" id="business-email" name="email" defaultValue={settings.email} autoComplete="email" required />
              </div>
            </div>

            <label htmlFor="business-hours">Operating hours</label>
            <input type="text" id="business-hours" name="hours" defaultValue={settings.hours} placeholder="e.g. Mon–Sat: 8am–6pm" required />

            <div className="content-grid-2">
              <div>
                <label htmlFor="facebook-url">Facebook URL <span className="account-settings__optional">(optional)</span></label>
                <input type="url" id="facebook-url" name="facebookUrl" defaultValue={settings.facebookUrl} placeholder="https://www.facebook.com/..." />
              </div>
              <div>
                <label htmlFor="instagram-url">Instagram URL <span className="account-settings__optional">(optional)</span></label>
                <input type="url" id="instagram-url" name="instagramUrl" defaultValue={settings.instagramUrl} placeholder="https://www.instagram.com/..." />
              </div>
            </div>

            <div className="account-settings__business-actions">
              <button type="submit" className="admin-btn" disabled={businessPending} aria-busy={businessPending}>
                {businessPending && <span className="admin-spinner" aria-hidden="true" />}
                {businessPending ? "Saving settings…" : "Save business settings"}
              </button>
              <button type="button" className="admin-btn admin-btn--ghost" disabled={businessPending} onClick={() => setIsEditingBusiness(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="account-settings__business-summary">
            <div>
              <span className="account-settings__business-label">Public phone</span>
              <a href={`tel:${settings.phone.replace(/\D/g, "")}`}>{formatUsPhone(settings.phone)}</a>
            </div>
            <div>
              <span className="account-settings__business-label">Public email</span>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
            <div className="account-settings__hours">
              <span className="account-settings__business-label">Operating hours</span>
              <span>{settings.hours}</span>
            </div>
            <div className="account-settings__social">
              {settings.facebookUrl ? (
                <a className="account-settings__social-link" href={settings.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>
              ) : (
                <span className="account-settings__business-label">Facebook — not listed</span>
              )}
            </div>
            <div className="account-settings__social">
              {settings.instagramUrl ? (
                <a className="account-settings__social-link" href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
              ) : (
                <span className="account-settings__business-label">Instagram — not listed</span>
              )}
            </div>
          </div>
        )}

        <details className="account-settings__security">
        <summary>Password &amp; sign-in</summary>
        <div className="account-settings__security-body">
          <p>Change the password used for this admin account.</p>
          {passwordState.ok && (
            <div className="admin-flash admin-flash--success" role="status">
              Password updated. Use your new password next time you sign in.
            </div>
          )}
          {passwordState.error && (
            <div className="admin-flash admin-flash--error" role="alert">{passwordState.error}</div>
          )}

          <form action={passwordAction} className="admin-form account-settings__password-form">
            <PasswordField id="current" name="current" label="Current password" autoComplete="current-password" required />
            <PasswordField id="next" name="next" label="New password" autoComplete="new-password" required />
            <PasswordField id="confirm" name="confirm" label="Confirm new password" autoComplete="new-password" required />

            <button type="submit" className="admin-btn" disabled={passwordPending} aria-busy={passwordPending}>
              {passwordPending && <span className="admin-spinner" aria-hidden="true" />}
              {passwordPending ? "Saving password…" : "Update password"}
            </button>
          </form>
        </div>
        </details>
      </section>
    </section>
  );
}
