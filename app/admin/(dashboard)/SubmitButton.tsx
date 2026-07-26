"use client";

import { useFormStatus } from "react-dom";

/**
 * Server action forms give no feedback while they run, and a two-photo upload
 * takes several seconds — long enough for the owner to assume nothing happened
 * and click again. useFormStatus reports the parent form's pending state, so
 * the button can disable itself and say what it is doing.
 */
export default function SubmitButton({
  children,
  pendingLabel,
  className = "admin-btn",
  style,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} style={style} disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="admin-spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
