import Link from "next/link";
import { getGlobalContent } from "@/lib/content";
import { SERVICE_CATEGORIES } from "@/lib/services";
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
      <a className="skip-link" href="#main-content">Skip to main content</a>
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
        <nav className="navbar" aria-label="Primary navigation">
          <Link href="/" className="brand">
            <img src="/assets/avanti-wordmark.png" alt="Avanti Lawn & Landscaping" />
          </Link>

          <ul className="nav-links">
            {NAV.map((item) =>
              item.key === "services" ? (
                <li key={item.key} className={active === item.key ? "active" : undefined}>
                  <Link href="/services" aria-current={active === item.key ? "page" : undefined}>
                    Services <span className="caret">▾</span>
                  </Link>
                  <div className="dropdown-panel">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <Link href={`/services/${cat.slug}`} key={cat.slug}>
                        <span className="dot"></span>{cat.label}
                      </Link>
                    ))}
                    <Link href="/services" className="view-all">View All Services →</Link>
                  </div>
                </li>
              ) : (
                <li key={item.key} className={active === item.key ? "active" : undefined}>
                  <Link href={item.href} aria-current={active === item.key ? "page" : undefined}>{item.label}</Link>
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

          <MobileNavToggle items={NAV} active={active} phone={phone} phoneTel={phoneTel} />
        </nav>
      </div>
    </header>
  );
}
