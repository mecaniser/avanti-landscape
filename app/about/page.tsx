import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Our Waxhaw Landscaping Crew",
  description:
    "Avanti Landscaping is a locally owned, owner-involved crew serving Waxhaw, NC and nearby communities. One accountable team for lawn care, landscaping, hardscaping, and maintenance.",
  path: "/about",
  image: absoluteUrl("/assets/img/about-crew.jpg"),
});

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const c = await getContent("about");

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <SiteHeader active="about" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / About</div>
            <h1>About Avanti Landscaping</h1>
            <p>{c.hero_paragraph}</p>
          </div>
        </section>

        <section className="section">
          <div className="container about-split">
            <div>
              <span className="eyebrow">Our Story</span>
              <h2>{c.story_heading}</h2>
              <p>{c.story_paragraph_1}</p>
              <p style={{ marginTop: 16 }}>{c.story_paragraph_2}</p>
              <div style={{ marginTop: 24 }}>
                <Link href="/contact" className="btn btn--dark">Work With Us</Link>
              </div>
            </div>
            <div className="card-photo" style={{ aspectRatio: "4/3.2", marginBottom: 0 }}>
              <Image src={c.photo_image} alt="Avanti Landscaping crew member pruning shrubs beside a patio"
                fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </section>

        <section className="section section--dark">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">What We Believe</span>
              <h2>Our Values</h2>
            </div>
            <div className="grid grid--3">
              <div className="card" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
                <h3 style={{ color: "#fff" }}>Quality First</h3>
                <p style={{ color: "rgba(255,255,255,0.8)" }}>We take the time to get the small details right, every visit.</p>
              </div>
              <div className="card" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
                <h3 style={{ color: "#fff" }}>Fair &amp; Honest</h3>
                <p style={{ color: "rgba(255,255,255,0.8)" }}>Straightforward pricing and honest recommendations, always.</p>
              </div>
              <div className="card" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
                <h3 style={{ color: "#fff" }}>Reliable Service</h3>
                <p style={{ color: "rgba(255,255,255,0.8)" }}>We show up when we say we will, season after season.</p>
              </div>
            </div>
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
