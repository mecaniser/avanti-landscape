import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getContent, getGlobalContent, parseAreaList } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AreasPage() {
  const [c, g] = await Promise.all([getContent("areas"), getGlobalContent()]);
  const areas = parseAreaList(g.area_list);

  return (
    <>
      <SiteHeader active="areas" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / Areas</div>
            <h1>Service Areas</h1>
            <p>{c.hero_paragraph}</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="area-chip-grid">
              {areas.map((a) => (
                <div className="area-chip" key={a.name}>
                  <div className="pin">📍</div>
                  <div><strong>{a.name}</strong><span>{a.state}</span></div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 50 }} className="section-head">
              <span className="eyebrow">Don&apos;t see your town?</span>
              <h2>{c.cta_heading}</h2>
              <p>{c.cta_paragraph}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <Link href="/contact" className="btn btn--primary">Ask About Your Address</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
