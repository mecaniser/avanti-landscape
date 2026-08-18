"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      // Keep focus inside the panel while it covers the page. Without this,
      // tabbing walks onto the links behind the overlay, which a keyboard or
      // screen reader user cannot see.
      if (event.key === "Tab" && navRef.current) {
        const focusable = navRef.current.querySelectorAll<HTMLElement>("a[href]");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement;

        if (event.shiftKey && (activeEl === first || activeEl === navRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeEl === last) {
          event.preventDefault();
          first.focus();
        }
      }
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

  // The header is sticky and its height varies with the topbar wrapping, so
  // measure it rather than hardcoding an offset the panel would misalign to.
  useEffect(() => {
    if (!open) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const apply = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(header.getBoundingClientRect().height)}px`
      );
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, [open]);

  // Lock the page behind the panel. The panel covers the viewport, so letting
  // the page scroll underneath moves content the visitor cannot see and leaves
  // them somewhere unexpected when they close it.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    // Replace the scrollbar's width so the page does not shift as it is hidden.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>

      {/* Portalled to <body>. .site-header sets backdrop-filter, which makes it
          the containing block for position:fixed descendants, so a panel
          rendered inside it would size to the header instead of the viewport. */}
      {open && createPortal(
        <>
          <div
              className="mobile-nav-backdrop"
              aria-hidden="true"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            />
          <nav
            ref={navRef}
            className="mobile-nav open"
            aria-label="Mobile navigation"
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
        <Link href="/contact" className="mobile-nav__cta" onClick={() => setOpen(false)}>
          Get a Free Quote
            </Link>
          </nav>
        </>,
        document.body
      )}
    </>
  );
}
