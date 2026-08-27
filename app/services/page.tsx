import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { SERVICE_CATEGORIES } from "@/lib/services";
import { getServices } from "@/lib/queries";

export const metadata: Metadata = pageMetadata({
  title: "Landscaping Services in Waxhaw, NC",
  description:
    "Explore lawn care, landscaping, hardscaping, and property maintenance for Waxhaw-area homes and businesses. Find the right service and request a free quote.",
  path: "/services",
  image: absoluteUrl("/assets/img/card-landscaping.jpg"),
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [c, services] = await Promise.all([
    getContent("services"),
    getServices(),
  ]);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
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
            {SERVICE_CATEGORIES.map((cat, i) => (
              <div className="category-block" id={cat.slug} key={cat.slug} style={i === SERVICE_CATEGORIES.length - 1 ? { marginBottom: 0 } : undefined}>
                <div className="category-head">
                  <div>
                    <span className="eyebrow">Category</span>
                    <h2>{cat.label}</h2>
                  </div>
                  <Link href={`/services/${cat.slug}`} className="route-link">
                    All {cat.label.toLowerCase()}<span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="service-row">
                  {services
                    .filter((s) => s.category === cat.slug)
                    .map((s) => (
                      <div className="service-item" key={s.id}>
                        <span className="dot"></span>
                        <div>
                          <h3>{s.name}</h3>
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
