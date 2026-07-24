import Link from "next/link";
import { getGlobalContent } from "@/lib/content";
import MobileNavToggle from "@/components/MobileNavToggle";

const NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/services", label: "Services", key: "services" },
  { href: "/areas", label: "Areas", key: "areas" },
  { href: "/about", label: "About", key: "about" },
  { href: "/gallery", label: "Gallery", key: "gallery" },
  { href: "/contact", label: "Contact", key: "contact" },
  { href: "/blog", label: "Blog", key: "blog" },
];

export default async function SiteHeader({ active }: { active: string }) {
  const g = await getGlobalContent();
  const phone = g.phone ?? "980-328-7141";
  const phoneTel = g.phone_tel ?? "9803287141";
  const email = g.email ?? "avantilandscaping1@gmail.com";
  const hours = g.hours ?? "Mon–Sat: 8am–6pm";

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <div><span className="topbar-tag">Locally owned &amp; operated in Waxhaw, NC</span></div>
          <div className="topbar-right">
            <span>{hours}</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="brand">
            <img src="/assets/logo.svg" alt="Avanti Landscaping logo" />
            <div className="brand-text">
              <strong>Avanti Landscaping</strong>
              <span>Lawn &amp; Landscape Co.</span>
            </div>
          </Link>

          <ul className="nav-links">
            {NAV.map((item) =>
              item.key === "services" ? (
                <li key={item.key} className={active === item.key ? "active" : undefined}>
                  <Link href="/services">
                    Services <span className="caret">▾</span>
                  </Link>
                  <div className="dropdown-panel">
                    <Link href="/services#lawn-care"><span className="dot"></span>Lawn Care</Link>
                    <Link href="/services#landscaping"><span className="dot"></span>Landscaping</Link>
                    <Link href="/services#hardscaping"><span className="dot"></span>Hardscaping</Link>
                    <Link href="/services#maintenance"><span className="dot"></span>Lawn &amp; Landscape Maintenance</Link>
                    <Link href="/services" className="view-all">View All Services →</Link>
                  </div>
                </li>
              ) : (
                <li key={item.key} className={active === item.key ? "active" : undefined}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              )
            )}
          </ul>

          <div className="nav-cta">
            <div className="nav-phone">
              <small>Call or text</small>
              <a href={`tel:${phoneTel}`}>{phone}</a>
            </div>
            <Link href="/contact" className="btn btn--dark btn--sm">Get a Free Quote</Link>
          </div>

          <button className="nav-toggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      <div className="mobile-nav">
        {NAV.map((item) => (
          <Link key={item.key} href={item.href}>{item.label}</Link>
        ))}
        <a href={`tel:${phoneTel}`}>Call {phone}</a>
      </div>
      <MobileNavToggle />
    </header>
  );
}
