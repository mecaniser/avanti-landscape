"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
      {/* Desktop / tablet sidebar (also used as the drawer content on mobile) */}
      <aside className={`admin-sidebar${open ? " admin-sidebar--open" : ""}`}>
        <h1>Avanti Admin</h1>
        {links}
        <form action={signOutAction}>
          <button type="submit">Sign Out</button>
        </form>
      </aside>

      {/* Mobile top bar */}
      <div className="admin-topbar">
        <span className="admin-topbar-title">Avanti Admin</span>
        <div className="admin-topbar-actions">
          <form action={signOutAction}>
            <button type="submit" className="admin-topbar-signout">Sign Out</button>
          </form>
          <button
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
      </div>

      {/* Mobile drawer */}
      <div
        id="admin-mobile-drawer"
        className={`admin-drawer${open ? " admin-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <nav className="admin-drawer-nav">{links}</nav>
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
