import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeforeAfterCarousel from "@/components/BeforeAfterCarousel";
import HeroMedia from "@/components/HeroMedia";
import HeroServiceRoute from "@/components/HeroServiceRoute";
import PropertyRoute from "@/components/PropertyRoute";
import WebsiteFlowTrace from "@/components/WebsiteFlowTrace";
import { getContent, getGlobalContent, parseAreaList } from "@/lib/content";
import { getBeforeAfterProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [c, g, projects] = await Promise.all([
    getContent("home"),
    getGlobalContent(),
    getBeforeAfterProjects(),
  ]);
  const areas = parseAreaList(g.area_list);
  const phoneTel = g.phone_tel ?? "9803287141";
  const phone = g.phone ?? "980-328-7141";
  const heroPoster = c.hero_image || "/assets/img/hero-mulch-wide.jpg";
  // Admin-uploaded video (Cloudinary) wins; otherwise the committed default clip.
  const heroVideo = c.hero_video || "/assets/hero.mp4";

  return (
    <>
      <SiteHeader active="home" />
      <main id="main-content" tabIndex={-1}>
        <section className="hero hero--property-plan">
          <HeroMedia poster={heroPoster} video={heroVideo} />
          <div className="container">
            <div className="hero-copy">
              <h1>One crew.<br />Your whole property.</h1>
              <p>Lawn care, landscaping, hardscaping, and maintenance for homes and businesses across the Waxhaw area.</p>
              <div className="hero-actions">
                <Link href="/contact" className="btn btn--primary">Get a Free Quote</Link>
                <a href={`tel:${phoneTel}`} className="btn btn--outline">Call {phone}</a>
                <a href={`sms:${phoneTel}`} className="hero-text-link">Text us</a>
              </div>
              <div className="hero-owner-proof">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3" /><path d="M5 21c.7-4 3.1-6 7-6s6.3 2 7 6M3 5.5h3M18 5.5h3" /></svg>
                </span>
                <strong>100% owner-involved crews</strong>
              </div>
            </div>
            <HeroServiceRoute />
          </div>
        </section>

        <PropertyRoute />

        {projects.length > 0 && (
        <section className="section results-section" id="results-section">
          <div className="container">
            <div className="results-head">
              <div>
                <h2>{c.ba_heading}</h2>
                <p>{c.ba_paragraph}</p>
              </div>
              <Link href="/gallery" className="route-link">View the gallery<span aria-hidden="true">→</span></Link>
            </div>
            <BeforeAfterCarousel projects={projects} />
          </div>
          <WebsiteFlowTrace />
        </section>
        )}

        <section className="section field-proof">
          <div className="container">
            <div className="field-proof-head">
              <h2>{c.why_heading}</h2>
              <p>{c.why_paragraph}</p>
            </div>
            <div className="field-proof-list">
              <div><span>01</span><strong>One accountable crew</strong><p>Regular care and larger outdoor work can stay with the same local team.</p></div>
              <div><span>02</span><strong>Real property work</strong><p>See the actual details behind the services before you decide to call.</p></div>
              <div><span>03</span><strong>Clear next step</strong><p>Request a free quote, call, or text, whichever works best for you.</p></div>
            </div>
          </div>
        </section>

        <section className="section coverage-section">
          <div className="container">
            <div className="section-head">
              <h2>{c.areas_heading}</h2>
              <p>{c.areas_paragraph}</p>
            </div>
            <div className="area-chip-grid">
              {areas.map((a) => (
                <div className="area-chip" key={a.name}>
                  <div className="pin">📍</div>
                  <div><strong>{a.name}</strong><span>{a.state === "North Carolina" ? "NC" : "SC"}</span></div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 34 }}>
              <Link href="/areas" className="btn btn--dark">View All Service Areas</Link>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container about-split">
            <div className="card-photo" style={{ aspectRatio: "4/3.2", marginBottom: 0 }}>
              <Image
                src={c.about_teaser_image}
                alt="Avanti Landscaping team member trimming shrubs at a client property"
                fill
                sizes="(max-width: 980px) calc(100vw - 48px), 565px"
              />
            </div>
            <div>
              <h2>{c.about_heading}</h2>
              <p>{c.about_paragraph}</p>
              <ul className="value-list">
                <li><span className="check">✓</span> Locally owned &amp; operated</li>
                <li><span className="check">✓</span> Free quotes</li>
                <li><span className="check">✓</span> Residential &amp; commercial properties</li>
              </ul>
              <div style={{ marginTop: 24 }}>
                <Link href="/about" className="btn btn--dark">More About Us</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight close-section">
          <div className="container">
            <div className="cta-band">
              <div>
                <h2>{c.cta_heading}</h2>
                <p>{c.cta_paragraph}</p>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn--dark">Request a Quote</Link>
                <a href={`tel:${phoneTel}`} className="btn btn--outline" style={{ borderColor: "#345126", color: "#345126" }}>Call {phone}</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
