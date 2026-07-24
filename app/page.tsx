import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { getContent, getGlobalContent, parseAreaList } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [c, g] = await Promise.all([getContent("home"), getGlobalContent()]);
  const areas = parseAreaList(g.area_list);
  const phoneTel = g.phone_tel ?? "9803287141";
  const phone = g.phone ?? "980-328-7141";

  return (
    <>
      <SiteHeader active="home" />
      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-copy">
              <span className="eyebrow">{c.hero_eyebrow}</span>
              <h1>{c.hero_heading}</h1>
              <p>{c.hero_paragraph}</p>
              <div className="hero-actions">
                <Link href="/contact" className="btn btn--primary">Get a Free Quote</Link>
                <a href={`tel:${phoneTel}`} className="btn btn--outline">Call {phone}</a>
              </div>
              <div className="hero-badges">
                <div><strong>9+</strong><span>Communities Served</span></div>
                <div><strong>100%</strong><span>Satisfaction Focused</span></div>
                <div><strong>Free</strong><span>On-Site Estimates</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">What We Do</span>
              <h2>{c.services_heading}</h2>
              <p>{c.services_paragraph}</p>
            </div>
            <div className="grid grid--4">
              <div className="card">
                <div className="card-photo"><img src={c.card_lawncare_image} alt="Avanti Landscaping crew applying lawn fertilization treatment" /></div>
                <h3>Lawn Care</h3>
                <p>Fertilization, weed control, aeration, and seeding for a thicker, greener lawn.</p>
                <Link className="card-link" href="/services#lawn-care">Explore Lawn Care →</Link>
              </div>
              <div className="card">
                <div className="card-photo"><img src={c.card_landscaping_image} alt="Fresh sod installation by Avanti Landscaping" /></div>
                <h3>Landscaping</h3>
                <p>Plantings, sod, lighting, drainage, and grading that boost curb appeal.</p>
                <Link className="card-link" href="/services#landscaping">Explore Landscaping →</Link>
              </div>
              <div className="card">
                <div className="card-photo">
                  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#c9c2ac" /><g stroke="#9a9276" strokeWidth="3"><rect x="10" y="10" width="80" height="60" /><rect x="100" y="10" width="80" height="60" /><rect x="190" y="10" width="80" height="60" /><rect x="280" y="10" width="110" height="60" /><rect x="10" y="80" width="80" height="60" /><rect x="100" y="80" width="80" height="60" /><rect x="190" y="80" width="80" height="60" /><rect x="280" y="80" width="110" height="60" /><rect x="10" y="150" width="80" height="60" /><rect x="100" y="150" width="80" height="60" /><rect x="190" y="150" width="80" height="60" /><rect x="280" y="150" width="110" height="60" /><rect x="10" y="220" width="80" height="60" /><rect x="100" y="220" width="80" height="60" /><rect x="190" y="220" width="80" height="60" /><rect x="280" y="220" width="110" height="60" /></g></svg>
                </div>
                <h3>Hardscaping</h3>
                <p>Patios, retaining walls, fire pits, walkways, and outdoor steps built to last.</p>
                <Link className="card-link" href="/services#hardscaping">Explore Hardscaping →</Link>
              </div>
              <div className="card">
                <div className="card-photo"><img src={c.card_maintenance_image} alt="Avanti Landscaping crew member mowing a lawn" /></div>
                <h3>Lawn &amp; Landscape Maintenance</h3>
                <p>Mowing, mulching, and seasonal cleanups on a schedule that fits your property.</p>
                <Link className="card-link" href="/services#maintenance">Explore Maintenance →</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--dark">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Why Avanti</span>
              <h2>{c.why_heading}</h2>
              <p>{c.why_paragraph}</p>
            </div>
            <div className="stat-grid">
              <div><strong>9</strong><span>Communities Served</span></div>
              <div><strong>100%</strong><span>Owner-Involved Crews</span></div>
              <div><strong>Free</strong><span>Estimates &amp; Consultations</span></div>
              <div><strong>All</strong><span>Residential &amp; Commercial</span></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Real Results</span>
              <h2>{c.ba_heading}</h2>
              <p>{c.ba_paragraph}</p>
            </div>
            <div className="ba-wrap">
              <BeforeAfterSlider
                beforeSrc={c.ba_before_image}
                afterSrc={c.ba_after_image}
                beforeAlt="Before: bare mulch bed along the stone chimney during soil delivery"
                afterAlt="After: finished planting bed with new arborvitae and flowers along the stone chimney"
              />
              <div className="ba-caption">{c.ba_caption_title}<span>{c.ba_caption_sub}</span></div>
            </div>
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <Link href="/gallery" className="btn btn--dark">See More Project Photos</Link>
            </div>
          </div>
        </section>

        <section className="section section--cream">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Where We Work</span>
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

        <section className="section">
          <div className="container about-split">
            <div className="card-photo" style={{ aspectRatio: "4/3.2", marginBottom: 0 }}>
              <img src={c.about_teaser_image} alt="Avanti Landscaping team member trimming shrubs at a client property" />
            </div>
            <div>
              <span className="eyebrow">About Avanti</span>
              <h2>{c.about_heading}</h2>
              <p>{c.about_paragraph}</p>
              <ul className="value-list">
                <li><span className="check">✓</span> Locally owned &amp; operated</li>
                <li><span className="check">✓</span> Free on-site estimates</li>
                <li><span className="check">✓</span> Residential &amp; commercial properties</li>
              </ul>
              <div style={{ marginTop: 24 }}>
                <Link href="/about" className="btn btn--dark">More About Us</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight">
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
