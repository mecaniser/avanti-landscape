"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/content/home", label: "Page Content" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/account", label: "Account" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  // Match on the section root (e.g. "/admin/content" for the
  // "/admin/content/home" link) so dynamic sub-routes like
  // /admin/content/services or /admin/blog/[id] still highlight
  // their parent nav item.
  const root = href.split("/").slice(0, 3).join("/");
  return pathname === root || pathname.startsWith(root + "/");
}

export default function AdminNav({ signOutAction }: { signOutAction: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Close the drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // role="dialog" aria-modal="true" claims modal behavior, so it has to act
  // like one: move focus in on open, trap Tab inside so a keyboard user
  // can't tab into the page hidden behind the backdrop, close on Escape,
  // and give focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable[0]?.focus();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      menuBtnRef.current?.focus();
    };
  }, [open]);

  const links = (
    <>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(pathname, item.href) ? "active" : undefined}
        >
          {item.label}
        </Link>
      ))}
      <Link href="/" target="_blank" rel="noopener" className="admin-view-site">
        View Website ↗
      </Link>
    </>
  );

  return (
    <>
      {/* Desktop sidebar. Hidden below the drawer breakpoint (admin.css), where
          the separate .admin-drawer below renders its own copy of the same
          links instead — two presentations of one link list, toggled by
          display, not one set of nodes moved around. */}
      <aside className="admin-sidebar">
        <h1>Avanti Admin</h1>
        {links}
        <form action={signOutAction}>
          <button type="submit">Sign Out</button>
        </form>
      </aside>

      {/* Mobile top bar. Sign Out used to live here, always visible next to
          the hamburger — but that's not where it belongs: it's a rare,
          consequential action, not a frequent one, and the desktop sidebar
          already treats it that way, tucked at the bottom of the nav list
          behind a border, not pinned to the header. Moved into the drawer
          to match. */}
      <div className="admin-topbar">
        <span className="admin-topbar-title">Avanti Admin</span>
        <button
          ref={menuBtnRef}
          type="button"
          className="admin-menu-btn"
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="admin-menu-btn-bars" aria-hidden="true" />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {/* The drawer stays mounted (closed state is a CSS transform, not
          display:none) so it can slide in. transform alone doesn't remove it
          from the tab order or the accessibility tree, so a keyboard user
          could tab through 7 invisible off-screen links before reaching real
          content while it's closed. inert removes it from both while shut. */}
      <div
        ref={drawerRef}
        id="admin-mobile-drawer"
        className={`admin-drawer${open ? " admin-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        inert={!open}
      >
        <nav className="admin-drawer-nav">{links}</nav>
        <form action={signOutAction} className="admin-drawer-signout">
          <button type="submit">Sign Out</button>
        </form>
      </div>
      {open && (
        <button
          type="button"
          className="admin-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
