import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeforeAfterCarousel from "@/components/BeforeAfterCarousel";
import { getContent, getGlobalContent } from "@/lib/content";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [c, g, images, projects] = await Promise.all([
    getContent("gallery"),
    getGlobalContent(),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.beforeAfterProject.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <SiteHeader active="gallery" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / Gallery</div>
            <h1>Project Gallery</h1>
            <p>{c.hero_paragraph}</p>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="section section--tight">
            <div className="container">
              <div className="section-head">
                <h2>Before &amp; After</h2>
                <p>One Avanti project, shown clearly before work and after installation.</p>
              </div>
              <BeforeAfterCarousel projects={projects} />
            </div>
          </section>
        )}

        <section className="section section--tight">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More Work</span>
              <h2>Project Photos</h2>
            </div>
            <div className="gallery-grid">
              {images.map((img) => (
                <div className="gallery-item" key={img.id} style={{ position: "relative" }}>
                  {/* Below the fold: lazy so React doesn't emit an unused preload for each. */}
                  <img src={img.url} alt={img.caption ?? ""} loading="lazy" />
                  {img.caption && (
                    <div
                      className="caption"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "14px 16px",
                        background: "linear-gradient(to top, rgba(35,43,30,0.75), transparent)",
                        color: "#fff",
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="blog-notice">
              <p style={{ margin: 0 }}>
                More photos are added as new projects wrap up. Follow along on{" "}
                <a href={g.facebook_url} target="_blank" rel="noopener" style={{ color: "var(--dark-green-2)", fontWeight: 600 }}>Facebook</a> or{" "}
                <a href={g.instagram_url} target="_blank" rel="noopener" style={{ color: "var(--dark-green-2)", fontWeight: 600 }}>Instagram</a> for the latest work.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--tight section--cream">
          <div className="container">
            <div className="cta-band" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
              <div>
                <h2>Want results like these on your property?</h2>
                <p>Let&apos;s talk about your project.</p>
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
