"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import PasswordField from "@/components/PasswordField";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRecoveryStub, setShowRecoveryStub] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/assets/avanti-wordmark.png" alt="Avanti Lawn & Landscaping" />
        </div>
        <h2 style={{ marginBottom: 4 }}>Welcome back</h2>
        <p className="subtitle">Sign in to manage your site.</p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required autoFocus />
          <PasswordField id="password" name="password" label="Password" autoComplete="current-password" required />
          {error && <p style={{ color: "#f0a08e", marginBottom: 12, fontSize: "0.88rem" }}>{error}</p>}
          <button type="submit" className="admin-btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="admin-login-recovery">
          <button type="button" onClick={() => setShowRecoveryStub((current) => !current)} aria-expanded={showRecoveryStub}>
            Forgot password?
          </button>
          {showRecoveryStub && (
            <p role="status">Password recovery will be enabled with the planned WorkOS staff-access setup. For now, contact the site administrator to regain access.</p>
          )}
        </div>
      </div>
    </div>
  );
}
