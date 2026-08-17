import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeforeAfterCarousel from "@/components/BeforeAfterCarousel";
import GalleryPhotoGrid from "@/components/GalleryPhotoGrid";
import JsonLd from "@/components/JsonLd";
import { getContent, getGlobalContent } from "@/lib/content";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { prisma } from "@/lib/db";

export const metadata: Metadata = pageMetadata({
  title: "Project Gallery: Before & After Landscaping Work",
  description:
    "Real before-and-after photos of lawn care, sod installation, mulch beds, drainage, and planting projects completed by Avanti Landscaping around Waxhaw, NC.",
  path: "/gallery",
  image: absoluteUrl("/assets/img/project-sod-installation.jpg"),
});

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
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
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
              <p>Select a project photo to view the work up close.</p>
            </div>
            <GalleryPhotoGrid images={images.map((image) => ({ id: image.id, url: image.url, caption: image.caption }))} />

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
