"use client";

export default function DetailsCloseButton({ children = "Close" }: { children?: React.ReactNode }) {
  function closeDetails(event: React.MouseEvent<HTMLButtonElement>) {
    const details = event.currentTarget.closest("details");
    if (!(details instanceof HTMLDetailsElement)) return;

    details.open = false;
    details.querySelector<HTMLElement>("summary")?.focus();
  }

  return (
    <button type="button" className="admin-btn admin-btn--ghost" onClick={closeDetails}>
      {children}
    </button>
  );
}
