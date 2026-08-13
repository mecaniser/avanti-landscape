import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getContent } from "@/lib/content";
import { prisma } from "@/lib/db";

const CATEGORIES = [
  { id: "lawn-care", label: "Lawn Care" },
  { id: "landscaping", label: "Landscaping" },
  { id: "hardscaping", label: "Hardscaping" },
  { id: "maintenance", label: "Lawn & Landscape Maintenance" },
];

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [c, services] = await Promise.all([
    getContent("services"),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <SiteHeader active="services" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / Services</div>
            <h1>Our Services</h1>
            <p>{c.hero_paragraph}</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {CATEGORIES.map((cat, i) => (
              <div className="category-block" id={cat.id} key={cat.id} style={i === CATEGORIES.length - 1 ? { marginBottom: 0 } : undefined}>
                <div className="category-head">
                  <div>
                    <span className="eyebrow">Category</span>
                    <h2>{cat.label}</h2>
                  </div>
                </div>
                <div className="service-row">
                  {services
                    .filter((s) => s.category === cat.id)
                    .map((s) => (
                      <div className="service-item" key={s.id}>
                        <span className="dot"></span>
                        <div>
                          <h4>{s.name}</h4>
                          <p>{s.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--tight section--cream">
          <div className="container">
            <div className="cta-band" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
              <div>
                <h2>{c.cta_heading}</h2>
                <p>{c.cta_paragraph}</p>
              </div>
              <Link href="/contact" className="btn btn--primary">Get a Free Quote</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
