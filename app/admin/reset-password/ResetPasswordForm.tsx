"use client";

import Link from "next/link";
import { useActionState } from "react";
import PasswordField from "@/components/PasswordField";
import { resetPassword, type ResetState } from "./actions";
import "../admin.css";

const initial: ResetState = {};

export default function ResetPasswordForm({ token, valid }: { token: string; valid: boolean }) {
  const [state, action, pending] = useActionState(resetPassword, initial);

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/assets/avanti-wordmark.png" alt="Avanti Lawn & Landscaping" />
        </div>

        {!valid && !state.ok ? (
          <>
            <h2 style={{ marginBottom: 4 }}>This link is no longer valid</h2>
            <div className="admin-flash admin-flash--error" role="status" style={{ marginTop: 12 }}>
              Reset links work once and expire after an hour. If you already set a new password, sign in with it — otherwise request a fresh link.
            </div>
            <div className="admin-login-recovery">
              <Link href="/admin/login">Go to sign in</Link>
              <span aria-hidden="true" style={{ opacity: 0.4, padding: "0 8px" }}>·</span>
              <Link href="/admin/forgot-password">Send a new reset link</Link>
            </div>
          </>
        ) : state.ok ? (
          <>
            <h2 style={{ marginBottom: 4 }}>Password updated</h2>
            <div className="admin-flash admin-flash--success" role="status" style={{ marginTop: 12 }}>
              Your password has been changed. You can now sign in with it.
            </div>
            <div className="admin-login-recovery">
              <Link href="/admin/login">Go to sign in</Link>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: 4 }}>Choose a new password</h2>
            <p className="subtitle">Enter a new password for your admin account.</p>
            <form className="admin-form" action={action}>
              <input type="hidden" name="token" value={token} />
              <PasswordField id="next" name="next" label="New Password" autoComplete="new-password" required />
              <PasswordField id="confirm" name="confirm" label="Confirm New Password" autoComplete="new-password" required />
              {state.error && <p style={{ color: "#f0a08e", marginBottom: 12, fontSize: "0.88rem" }}>{state.error}</p>}
              <button type="submit" className="admin-btn" style={{ width: "100%" }} disabled={pending}>
                {pending ? "Updating…" : "Update password"}
              </button>
            </form>
            <div className="admin-login-recovery">
              <Link href={state.error ? "/admin/forgot-password" : "/admin/login"}>
                {state.error ? "Send a new reset link" : "Back to sign in"}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
