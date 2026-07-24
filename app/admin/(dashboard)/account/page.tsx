"use client";

import { useActionState } from "react";
import { changePassword, type ChangePwState } from "./actions";

const initial: ChangePwState = {};

export default function AccountPage() {
  const [state, action, pending] = useActionState(changePassword, initial);

  return (
    <>
      <h2>Account</h2>
      <p className="subtitle">Update the password you use to sign in.</p>

      <div className="admin-card" style={{ maxWidth: 460 }}>
        {state.ok && (
          <div className="admin-flash admin-flash--success" role="status">
            Password updated. Use your new password next time you sign in.
          </div>
        )}
        {state.error && (
          <div className="admin-flash admin-flash--error" role="alert">
            {state.error}
          </div>
        )}

        <form action={action} className="admin-form">
          <label htmlFor="current">Current Password</label>
          <input type="password" id="current" name="current" autoComplete="current-password" required />

          <label htmlFor="next">New Password</label>
          <input type="password" id="next" name="next" autoComplete="new-password" required />

          <label htmlFor="confirm">Confirm New Password</label>
          <input type="password" id="confirm" name="confirm" autoComplete="new-password" required />

          <button type="submit" className="admin-btn" disabled={pending}>
            {pending ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
}
