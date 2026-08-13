"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  key: string;
};

export default function MobileNavToggle({
  items,
  active,
  phone,
  phoneTel,
}: {
  items: NavItem[];
  active: string;
  phone: string;
  phoneTel: string;
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);

    const desktop = window.matchMedia("(min-width: 981px)");
    const onViewportChange = () => {
      if (desktop.matches && open) setOpen(false);
    };
    desktop.addEventListener("change", onViewportChange);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="mobile-navigation"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>

      <nav
        className={`mobile-nav${open ? " open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active === item.key ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <a href={`tel:${phoneTel}`} onClick={() => setOpen(false)}>Call {phone}</a>
      </nav>
    </>
  );
}
