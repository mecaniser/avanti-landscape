"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "./actions";
import "../admin.css";

const initial: ForgotState = {};

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/assets/avanti-wordmark.png" alt="Avanti Lawn & Landscaping" />
        </div>
        <h2 style={{ marginBottom: 4 }}>Reset your password</h2>
        <p className="subtitle">Enter your account email and we&apos;ll send you a reset link.</p>

        {state.ok ? (
          <div className="admin-flash admin-flash--success" role="status">
            If an account exists for that email, a reset link is on its way. Check your inbox — and your spam folder just in case.
          </div>
        ) : (
          <form className="admin-form" action={action}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required autoFocus autoComplete="email" />
            {state.error && <p style={{ color: "#f0a08e", marginBottom: 12, fontSize: "0.88rem" }}>{state.error}</p>}
            <button type="submit" className="admin-btn" style={{ width: "100%" }} disabled={pending}>
              {pending ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <div className="admin-login-recovery">
          <Link href="/admin/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
