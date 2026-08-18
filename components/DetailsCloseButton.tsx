"use client";

export default function DetailsCloseButton({
  children = "Close",
  className = "admin-btn admin-btn--plain",
  "aria-label": ariaLabel,
}: {
  children?: React.ReactNode;
  /** Override for callers that need a compact/icon-only treatment (e.g. a
   *  corner dismiss) instead of the standard text button. */
  className?: string;
  "aria-label"?: string;
}) {
  function closeDetails(event: React.MouseEvent<HTMLButtonElement>) {
    const details = event.currentTarget.closest("details");
    if (!(details instanceof HTMLDetailsElement)) return;

    details.open = false;
    details.querySelector<HTMLElement>("summary")?.focus();
  }

  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={closeDetails}>
      {children}
    </button>
  );
}
