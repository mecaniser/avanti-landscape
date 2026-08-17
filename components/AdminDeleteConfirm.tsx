"use client";

import { useEffect, useId, useRef, useState } from "react";
import SubmitButton from "@/app/admin/(dashboard)/SubmitButton";

/**
 * A one-click delete with no confirmation risks destroying content from a
 * stray click, and window.confirm() is unreliable: browsers can silently
 * auto-suppress repeated dialogs from the same page, so a retry can appear
 * to do nothing with no visible cause. This inline step can't be suppressed,
 * doubles as its own feedback, and moves focus to Cancel (the safe default)
 * so a keyboard user's focus isn't dropped when the trigger button unmounts.
 */
export default function AdminDeleteConfirm({
  action,
  itemLabel,
  triggerLabel = "Delete",
  triggerClassName = "admin-btn admin-btn--danger",
  triggerStyle,
  pendingLabel = "Deleting…",
  submitClassName = "admin-btn admin-btn--danger",
  submitStyle,
  className = "admin-delete-confirm",
}: {
  action: (formData: FormData) => void | Promise<void>;
  itemLabel: string;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  pendingLabel?: string;
  submitClassName?: string;
  submitStyle?: React.CSSProperties;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  if (!confirming) {
    return (
      <button type="button" className={triggerClassName} style={triggerStyle} onClick={() => setConfirming(true)}>
        {triggerLabel}
      </button>
    );
  }

  return (
    <form action={action} role="group" aria-label={`Confirm delete for ${itemLabel}`} className={className}>
      <span id={messageId}>Delete &ldquo;{itemLabel}&rdquo;? This can&rsquo;t be undone.</span>
      <div className={`${className}__actions`}>
        <SubmitButton className={submitClassName} style={submitStyle} pendingLabel={pendingLabel}>
          Yes, delete
        </SubmitButton>
        <button
          ref={cancelRef}
          type="button"
          className="admin-btn admin-btn--ghost"
          aria-describedby={messageId}
          onClick={() => setConfirming(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
